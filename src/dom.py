import logging
import asyncio
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Set
from playwright.async_api import Page, CDPSession

logger = logging.getLogger(__name__)

@dataclass
class DOMElement:
    node_id: int
    backend_node_id: int
    tag_name: str
    attributes: Dict[str, str]
    text_content: str
    is_clickable: bool
    is_visible: bool
    is_scrollable: bool
    parent_id: Optional[int]
    children_ids: List[int] = field(default_factory=list)
    highlight_index: Optional[int] = None  # The [i_123] index

class DomService:
    def __init__(self, page: Page):
        self.page = page
        self.cdp_session: Optional[CDPSession] = None
        # Cache to store the element map for the current step
        self.selector_map: Dict[int, DOMElement] = {}

    async def _ensure_cdp_session(self):
        if not self.cdp_session:
            self.cdp_session = await self.page.context.new_cdp_session(self.page)

    async def get_state_text(self) -> str:
        """
        Captures the DOM snapshot using CDP, parses it, and returns the formatted
        string state for the LLM.
        """
        await self._ensure_cdp_session()
        
        # 1. Capture DOM Snapshot (Layout + Styles)
        try:
            snapshot = await self.cdp_session.send(
                "DOMSnapshot.captureSnapshot",
                {
                    "computedStyles": ["display", "visibility", "opacity", "overflow"],
                    "includePaintOrder": True,
                    "includeDOMRects": True
                }
            )
        except Exception as e:
            logger.error(f"CDP Snapshot failed: {e}")
            return "Error: Could not capture DOM state."

        # 2. Parse and Index
        self.selector_map = {} # Reset cache
        elements = self._parse_snapshot(snapshot)
        interactive_elements = self._filter_interactive_elements(elements)
        
        # 3. Serialize
        return self._serialize_dom(interactive_elements)

    async def click_element(self, index: int):
        """
        Clicks an element using its cached backend_node_id via CDP.
        This is cleaner/more robust than CSS selectors.
        """
        await self._ensure_cdp_session()
        
        if index not in self.selector_map:
             raise ValueError(f"Index {index} is invalid for the current page state.")

        element = self.selector_map[index]
        
        try:
            # 1. Resolve the backend_node_id to a RemoteObject
            remote_object = await self.cdp_session.send(
                "DOM.resolveNode", 
                {"backendNodeId": element.backend_node_id}
            )
            object_id = remote_object["object"]["objectId"]
            
            # 2. Execute 'click()' on that specific object
            # We use scrollIntoView first to ensure it's interactable
            await self.cdp_session.send(
                "Runtime.callFunctionOn",
                {
                    "functionDeclaration": """
                        function() { 
                            this.scrollIntoView({block: 'center', inline: 'center'});
                            this.click();
                        }
                    """,
                    "objectId": object_id,
                    "awaitPromise": True
                }
            )
            logger.info(f"Clicked element [i_{index}] via CDP")
            
        except Exception as e:
            logger.error(f"Failed to click index {index}: {e}")
            raise RuntimeError(f"Failed to interact with element {index}. The page might have changed.")

    def _parse_snapshot(self, snapshot: Dict) -> List[DOMElement]:
        documents = snapshot.get('documents', [])
        strings = snapshot.get('strings', [])
        parsed_elements = []

        for doc in documents:
            nodes = doc.get('nodes', {})
            layout = doc.get('layout', {})
            
            node_values = nodes.get('nodeValue', [])
            node_names = nodes.get('nodeName', [])
            backend_node_ids = nodes.get('backendNodeId', [])
            parent_indices = nodes.get('parentIndex', [])
            attributes_list = nodes.get('attributes', [])
            
            # Layout info
            layout_node_indices = layout.get('nodeIndex', [])
            layout_styles = layout.get('styles', [])
            node_to_layout_index = {node_idx: i for i, node_idx in enumerate(layout_node_indices)}

            for i, backend_id in enumerate(backend_node_ids):
                # Attributes
                attrs = {}
                if i < len(attributes_list):
                    attr_indices = attributes_list[i]
                    for j in range(0, len(attr_indices), 2):
                        name_idx = attr_indices[j]
                        val_idx = attr_indices[j+1]
                        if name_idx >= 0 and val_idx >= 0:
                            attrs[strings[name_idx].lower()] = strings[val_idx]

                # Visibility Logic (Simplified for production speed)
                is_visible = False
                if i in node_to_layout_index:
                    is_visible = True 

                tag_name = strings[node_names[i]].lower()
                text_value = strings[node_values[i]] if node_values[i] >= 0 else ""

                element = DOMElement(
                    node_id=i,
                    backend_node_id=backend_id,
                    tag_name=tag_name,
                    attributes=attrs,
                    text_content=text_value,
                    is_clickable=self._is_element_clickable(tag_name, attrs),
                    is_visible=is_visible,
                    is_scrollable=False,
                    parent_id=parent_indices[i] if i < len(parent_indices) and parent_indices[i] >= 0 else None
                )
                parsed_elements.append(element)

        return parsed_elements

    def _is_element_clickable(self, tag_name: str, attrs: Dict[str, str]) -> bool:
        interactive_tags = {'a', 'button', 'input', 'select', 'textarea', 'details', 'summary'}
        if tag_name in interactive_tags:
            return True
        if attrs.get('role') in ['button', 'link', 'menuitem', 'option', 'checkbox', 'radio']:
            return True
        if attrs.get('onclick') or attrs.get('contenteditable') == 'true':
            return True
        return False

    def _filter_interactive_elements(self, elements: List[DOMElement]) -> List[DOMElement]:
        interactive = []
        counter = 0
        for el in elements:
            if el.is_visible:
                # Assign index if clickable
                if el.is_clickable:
                    el.highlight_index = counter
                    self.selector_map[counter] = el
                    counter += 1
                interactive.append(el)
        return interactive

    def _serialize_dom(self, elements: List[DOMElement]) -> str:
        lines = []
        for el in elements:
            has_index = el.highlight_index is not None
            text = el.text_content.strip() or el.attributes.get('aria-label', '') or el.attributes.get('placeholder', '') or el.attributes.get('value', '')
            
            if not has_index and not text:
                continue
                
            prefix = f"[i_{el.highlight_index}]" if has_index else "     "
            clean_text = text.replace('\n', ' ').strip()[:50]
            
            attrs = []
            if 'href' in el.attributes: attrs.append(f"href='{el.attributes['href']}'")
            if 'name' in el.attributes: attrs.append(f"name='{el.attributes['name']}'")
            
            attr_str = " ".join(attrs)
            line = f"{prefix} <{el.tag_name} {attr_str}> {clean_text}"
            lines.append(line)
            
        return "\n".join(lines)