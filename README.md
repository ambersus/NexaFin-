 # NEXAFIN - The Generative Finance Assistant

GenFin is a cutting-edge, AI-powered financial platform designed for the Techathon. It leverages advanced generative AI and real-time data to provide users with comprehensive tools for market analysis, portfolio management, and startup simulation.

## 🚀 Key Features

### 🤖 FinBot AI Assistant
A context-aware financial chatbot powered by Gemini AI, capable of answering complex queries, providing investment insights, and guiding users through the platform.

### 📈 Market Tracker
Real-time tracking of global markets, including stocks, crypto, and commodities, with interactive charts and trend analysis.

### 🏢 Startup Builder (BuildSim)
An advanced simulation tool for founders to model runway, revenue projections, team scaling, and funding scenarios with high fidelity.

### 💼 Portfolio Generator
Intelligent portfolio construction based on user risk profiles, investment goals, and market conditions. Optimize your asset allocation effortlessly.

### 💰 Personal Finance
Comprehensive tools for tracking income, expenses, and budgeting to maintain financial health.

### 🧪 Scenario Engine
Stress-test your financial strategies against various economic scenarios (e.g., recession, high inflation) to ensure resilience.

### 🧠 Multi-Agent Analysis
Utilizes a system of specialized AI agents (Debate, competitive analysis) to provide deep, multi-perspective financial insights.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context & Hooks

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python
- **Libraries**: `yfinance`, `pandas`

### AI Integration
- **Model**: Google Gemini API

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn
- A Google Gemini API Key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/GenFin_Final.git
    cd GenFin_Final
    ```

2.  **Install Frontend Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Install Backend Dependencies**:
    ```bash
    pip install -r backend/requirements.txt
    ```

4.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
    ```

### 🚀 Running the Application

#### Option 1: One-Click Start (Windows)
Double-click `start.bat` or run it from the command line:
```bash
start.bat
```
This script will automatically install backend dependencies, start the backend server, and launch the frontend development server.

#### Option 2: Manual Start
**Run Backend:**
Open a terminal in the root directory:
```bash
cd backend
python -m uvicorn main:app --reload
```

**Run Frontend:**
Open a new terminal in the root directory:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

This project is created for the Final Techathon. All rights reserved.
