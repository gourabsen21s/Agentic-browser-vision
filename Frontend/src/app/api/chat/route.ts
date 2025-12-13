import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { messages } = await request.json();
  
  const lastMessage = messages[messages.length - 1];
  
  const responseText = generateMockResponse(lastMessage.content);
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = responseText.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? ' ' : '');
        controller.enqueue(encoder.encode(word));
        await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
      }
      
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}

function generateMockResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.includes('analyze') || lower.includes('scan')) {
    return "I'll analyze that webpage for you. My computer vision system will scan the page structure, identify key visual elements, detect interactive components, and extract the layout hierarchy. This includes recognizing buttons, forms, images, navigation menus, and text blocks. Once complete, I can provide structured data about each element's position, size, and semantic meaning.";
  }
  
  if (lower.includes('scrape') || lower.includes('extract')) {
    return "I can help you extract data from that page. Using visual recognition, I'll identify tables, lists, product cards, or any repeated patterns. Then I'll systematically extract the content while preserving the relationships between elements. Would you like me to focus on specific types of content, or should I perform a comprehensive extraction?";
  }
  
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm VisionScrape, your AI-powered web analysis assistant. I use computer vision to understand and extract information from webpages. You can ask me to analyze layouts, detect elements, scrape content, or identify patterns on any website. What would you like to explore today?";
  }
  
  if (lower.includes('help') || lower.includes('what can')) {
    return "I can help you with several computer vision tasks:\n\n• Analyze webpage layouts and structure\n• Detect and classify UI elements (buttons, forms, images)\n• Extract text and data from complex layouts\n• Identify visual patterns and repeated elements\n• Compare page versions for changes\n• Generate accessibility reports\n\nJust share a URL or describe what you'd like to analyze!";
  }
  
  return "I understand you're interested in web analysis. To help you better, could you provide a specific URL or describe the type of content you'd like to extract? I can analyze page structure, detect elements, scrape data, or identify visual patterns. The more details you provide, the more targeted my analysis can be.";
}

