import json
import asyncio
import logging
from typing import Dict, Any, Callable
from playwright.async_api import Page

logger = logging.getLogger(__name__)

class Toolset:
    """
    Defines the execution environment for the LLM.
    Acts as the 'Namespace' where functions like click(), navigate(), evaluate() live.
    """
    def __init__(self, page: Page, dom_service):
        self.page = page
        self.dom = dom_service
        
        # State tracking
        self.is_done = False
        self.final_result = None

    async def _navigate(self, url: str):
        """Navigates to a specific URL."""
        try:
            logger.info(f"🌐 Navigating to: {url}")
            await self.page.goto(url)
            # We wait for load state networkidle to ensure the page is ready
            # But we don't block too long; the DOM service will re-check state anyway
            try:
                await self.page.wait_for_load_state("networkidle", timeout=5000)
            except Exception:
                pass # Continue if network is busy, agent can wait explicitly if needed
        except Exception as e:
            logger.error(f"Navigation failed: {e}")
            raise

    def _parse_index(self, index: Any) -> int:
        """
        Parses an index that might be an int, string "12", string "i_12", or string "[i_12]".
        """
        if isinstance(index, int):
            return index
        
        if isinstance(index, str):
            # Remove common artifacts
            clean = index.replace("[", "").replace("]", "").replace("i_", "").strip()
            if clean.isdigit():
                return int(clean)
                
        raise ValueError(f"Invalid index format: {index}")

    async def _click(self, index: Any):
        """
        Clicks an element by its [i_xxx] index using the DOM service's CDP logic.
        """
        idx = self._parse_index(index)
        logger.info(f"🖱️ Clicking index [{idx}]")
        await self.dom.click_element(idx)
        
        # Small pause to allow UI to react (standard practice in scraping)
        await asyncio.sleep(1)

    async def _evaluate(self, code: str, variables: dict = None):
        """
        Executes JavaScript in the browser.
        Wraps code in an async IIFE to allow top-level await and variable injection.
        """
        vars_json = json.dumps(variables) if variables else "{}"
        
        # The prompt asks LLMs to write: (function(params) { ... })
        # We handle 3 cases:
        # 1. Plain code: "return document.title"
        # 2. Function expression: "(function() { ... })()"
        # 3. Arrow function: "() => { ... }"
        
        # We wrap everything in a master executor
        wrapped_js = f"""
        (async function() {{ 
            const params = {vars_json};
            try {{
                // If it looks like an IIFE or Function, just eval it
                // Otherwise treat it as a body
                const userCode = `{code.replace('`', '\\`')}`;
                
                // Simple heuristic: if it starts with (function, we eval it
                // But safer is to always wrap in a new function body
                // This is the implementation strategy from namespace.py
                const f = new Function('params', userCode.includes('return') ? userCode : 'return ' + userCode);
                return await f(params);
            }} catch (e) {{
                // Fallback for complex IIFEs
                return eval(userCode);
            }}
        }})()
        """
        try:
            return await self.page.evaluate(code)
        except Exception as e:
            logger.error(f"JS Evaluation failed: {e}")
            raise

    async def _input_text(self, index: Any, text: str):
        """Inputs text into a field identified by index."""
        idx = self._parse_index(index)
        logger.info(f"⌨️ Inputting text into [{idx}]: {text}")
        
        # We need a robust way to input text. 
        # Since we use CDP for clicking, we can try Playwright locator for typing 
        # if we can resolve the selector, OR use CDP.
        # For consistency, let's use the DOM service click to focus, then keyboard.
        
        await self.dom.click_element(idx)
        await self.page.keyboard.type(text)

    async def _done(self, result: Dict[str, Any]):
        """Signals that the task is complete."""
        logger.info("✅ DONE SIGNAL RECEIVED")
        self.is_done = True
        self.final_result = result

    async def _get_element(self, index: Any, level: int = 0):
        """
        Returns the details of an element by its [i_xxx] index.
        Useful for scraping text and attributes without guessing JS selectors.
        """
        idx = self._parse_index(index)
        return self.dom.get_element_by_index(idx, level)

    def get_globals(self) -> Dict[str, Any]:
        """
        Returns the dictionary of functions injected into the LLM's exec() scope.
        """
        return {
            "navigate": self._navigate,
            "click": self._click,
            "input_text": self._input_text,
            "evaluate": self._evaluate,
            "get_element": self._get_element,
            "done": self._done,
            
            # Utilities
            "print": print,
            "json": json,
            "asyncio": asyncio,
            "sleep": asyncio.sleep
        }