import asyncio
import websockets
import json

async def test_server():
    uri = "ws://localhost:8000/ws"
    async with websockets.connect(uri) as websocket:
        print("Connected to server")
        
        # Define a simple task
        task = "Navigate to https://example.com and return the page title."
        
        print(f"Sending task: {task}")
        await websocket.send(json.dumps({"task": task}))
        
        print("Waiting for result...")
        while True:
            response = await websocket.recv()
            data = json.loads(response)
            print(f"Received: {data}")
            
            if data.get("status") in ["success", "error"]:
                break

if __name__ == "__main__":
    asyncio.run(test_server())
