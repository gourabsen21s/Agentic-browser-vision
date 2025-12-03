import asyncio
import os
from playwright.async_api import async_playwright
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Import our custom agent
from src.agent import CodeAgent

# Load environment variables
load_dotenv()

# --- 1. Define Your Output Schema ---
# This tells the Agent exactly what data structure you want back.
class Product(BaseModel):
    name: str = Field(description="Name of the product")
    price: str = Field(description="Price of the product")
    url: str = Field(description="Link to the product page")

class ScrapeResult(BaseModel):
    products: list[Product]
    total_found: int

# --- 2. Main Execution ---
async def main():
    # Check for Azure keys (since you switched to Azure)
    if not os.getenv("AZURE_OPENAI_API_KEY"):
        print("❌ Error: AZURE_OPENAI_API_KEY not found in .env file")
        return

    async with async_playwright() as p:
        # Launch Browser
        # headless=False lets you watch the agent work!
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        # Define the Task
        target_url = "https://"
        task = f"Navigate to {target_url}. Scrape the first 3 products you see. Return them in the specified JSON format."

        print(f"🚀 Starting Custom CodeAgent (Azure OpenAI)...")
        print(f"🎯 Task: {task}\n")

        # Initialize Agent
        agent = CodeAgent(page, ScrapeResult)
        
        # Run Agent
        result = await agent.run(task)

        # Output Result
        print("\n" + "="*50)
        print("🏁 FINAL RESULT")
        print("="*50)
        import json
        # Handle cases where result might be None or error
        if result:
            print(json.dumps(result, indent=2, default=str))
        else:
            print("No result returned.")
        
        # Keep browser open for a moment to inspect
        await asyncio.sleep(5)
        await browser.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Execution stopped by user.")