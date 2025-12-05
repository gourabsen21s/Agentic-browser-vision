# 🤖 Agentic Product Scraper

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-Automation-green?style=for-the-badge&logo=playwright&logoColor=white)
![YOLO](https://img.shields.io/badge/YOLO-Computer%20Vision-orange?style=for-the-badge&logo=opencv&logoColor=white)
![Azure OpenAI](https://img.shields.io/badge/Azure%20OpenAI-Reasoning-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)

**Next-Gen Web Automation powered by Computer Vision & LLM Reasoning**

[Features](#-features) • [Quick Start](#-quick-start) • [Configuration](#-configuration) • [Architecture](#-architecture)

</div>

---

## 🚀 Overview

The **Agentic Product Scraper** is an advanced web automation tool that "sees" and "thinks" like a human. Unlike traditional scrapers that rely on brittle CSS selectors, this agent uses **YOLO computer vision** to detect UI elements and **LLM reasoning** to plan interactions dynamically.

It is designed to handle complex, multi-step workflows on dynamic websites, making it resilient to layout changes and capable of achieving high-level goals.

## ✨ Features

- **👁️ Computer Vision Perception**: Uses a fine-tuned YOLO model to detect buttons, inputs, and links visually from screenshots.
- **🧠 AI Reasoning Engine**: Leverages Azure OpenAI (GPT-4o) to analyze the UI state and plan the optimal next action.
- **🛡️ Robust Browser Automation**: Built on Playwright for reliable, cross-browser execution with anti-detection measures.
- **⚙️ Advanced Browser Profile**: Fine-grained control over browser fingerprints, extensions, proxies, and context settings.
- **📝 OCR Integration**: Extracts text from detected elements using Tesseract/PaddleOCR for semantic understanding.
- **🎥 Visual Debugging**: Records session videos and saves step-by-step screenshots with annotated detections.

## ⚡ Quick Start

### Prerequisites

- Python 3.12+
- Azure OpenAI API Access
- Tesseract OCR (for text extraction)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gourabsen21s/agentic-product-scraper.git
   cd agentic-product-scraper
   ```

2. **Set up environment**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   playwright install chromium
   ```

3. **Configure credentials**
   Create a `.env` file:
   ```env
   AZURE_OPENAI_BASE=https://your-resource.openai.azure.com/
   AZURE_OPENAI_KEY=your_api_key
   AZURE_DEPLOYMENT=gpt-4o
   AZURE_API_VERSION=2024-02-15-preview
   ```

### Usage

Run the agent with a natural language goal:

```bash
# Search for products
python scripts/run_agent.py "Go to amazon.com and search for 'gaming laptop'"

# Complex navigation
python scripts/run_agent.py "Go to youtube.com, search for 'lofi hip hop', and play the first video"
```

## 🔧 Configuration

The agent is highly configurable via `runner/config.py` and environment variables.

### Browser Profile
The new `BrowserProfile` system allows detailed customization:
- **Headless Mode**: Toggle visibility (`HEADLESS=true/false`)
- **Extensions**: Auto-loads ad-blockers and utility extensions.
- **User Data**: Persists sessions via `user_data_dir`.
- **Proxy**: Supports authenticated proxies for rotation.

### Perception
- **YOLO Model**: Configurable path to custom weights (`YOLO_MODEL_PATH`).
- **Confidence Threshold**: Adjustable detection sensitivity.

## 🏗️ Architecture

1.  **Perception Layer**:
    *   Captures screenshot.
    *   **YOLOv8** detects UI bounding boxes.
    *   **OCR** extracts text content.
2.  **Reasoning Layer**:
    *   Constructs a prompt with the user goal and UI elements.
    *   **LLM** (GPT-4) generates a structured action plan (JSON).
3.  **Execution Layer**:
    *   **ActionExecutor** maps the plan to Playwright commands.
    *   Performs clicks, typing, scrolling, or navigation.
4.  **Loop**:
    *   Repeats until the goal is achieved or max steps reached.

## 📂 Project Structure

```
browser-runner/
├── api/                # FastAPI server endpoints
├── reasoner/           # LLM interaction & prompt engineering
├── runner/             # Core execution logic
│   ├── perception/     # YOLO & OCR modules
│   ├── browser_manager.py # Browser lifecycle management
│   └── browser_profile.py # Browser configuration models
├── scripts/            # CLI entry points
└── tests/              # Unit & integration tests
```

---

<div align="center">
  <sub>Built with ❤️ by the Agentic Coding Team</sub>
</div>
