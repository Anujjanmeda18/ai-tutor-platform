# 🎯 Edubot.AI - AI-Powered Voice Learning Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Convex](https://img.shields.io/badge/Convex-DB-orange?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-AI-purple?style=for-the-badge)
![Deepgram](https://img.shields.io/badge/Deepgram-STT-blue?style=for-the-badge)

**Master any skill through real-time AI voice conversations**

[Live Demo](https://edubot-ai.vercel.app) • [Report Bug](https://github.com/yourusername/edubot-ai/issues) • [Request Feature](https://github.com/yourusername/edubot-ai/issues)

</div>

---

## 📖 About The Project

Edubot.AI is a cutting-edge AI-powered learning platform that provides personalized voice coaching across multiple domains. Whether you're preparing for interviews, learning a new language, or seeking guided meditation, our AI experts are available 24/7 to help you achieve your goals.

### ✨ Key Features

- 🎤 **Real-time Voice Conversations** - Natural speech-to-text and text-to-speech interactions
- 🤖 **5 AI Coaching Modes** - Topic lectures, interview prep, language learning, open Q&A, and meditation
- 👥 **Personalized AI Experts** - Joanna, Sallie, and Matthew with unique voice profiles
- 💬 **Live Transcription** - See your conversation in real-time
- 📊 **Detailed Feedback** - Get comprehensive performance analysis after sessions
- 🎯 **Credit System** - 50,000 free credits to get started
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

---

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with SSR
- **React 18** - UI library
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend & Database
- **Convex** - Real-time database and backend
- **Stack Auth** - Authentication system

### AI & Voice
- **Groq AI (Llama 3.3)** - Fast, powerful language model
- **Deepgram** - Real-time speech-to-text
- **Web Speech API** - Browser-native text-to-speech

### Deployment
- **Vercel** - Frontend hosting
- **Convex Cloud** - Backend hosting

---

## 🎭 AI Coaching Modes

### 1. 📚 Topic Base Lecture
Learn any subject from expert AI professors with engaging, structured lessons.

### 2. 💼 Mockup Interview
Practice realistic job interviews with AI interviewers providing instant feedback.

### 3. 🎯 Open-Ans Prep
Master open-ended questions with coaching on structure, clarity, and depth.

### 4. 🌍 Learn Language
Interactive language learning with pronunciation, grammar, and cultural context.

### 5. 🧘 Guided Meditation
Find inner peace with calming, guided meditation sessions.

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Convex account ([convex.dev](https://convex.dev))
- Deepgram API key ([deepgram.com](https://deepgram.com))
- Groq API key ([groq.com](https://groq.com))

### 1. Clone the Repository
git clone https://github.com/yourusername/edubot-ai.git
cd edubot-ai

### 2. Install Dependencies
npm install


### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_publishable_key
STACK_SECRET_SERVER_KEY=your_stack_secret_key

Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

AI APIs
DEEPGRAM_API_KEY=your_deepgram_api_key
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_GOOGLE_AI_KEY=your_google_ai_key


### 4. Deploy Convex Backend
npx convex dev


### 5. Run Development Server
npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Project Structure
└── Edubot-ai
    ├── .gitignore
    ├── README.md
    ├── app
        ├── (main)
        │   ├── _components
        │   │   └── Header.jsx
        │   ├── dashboard
        │   │   ├── _components
        │   │   │   ├── FeatureAssistant.jsx
        │   │   │   ├── Feedback.jsx
        │   │   │   ├── History.jsx
        │   │   │   ├── ProfileDialog.jsx
        │   │   │   └── UserInputDialog.jsx
        │   │   └── page.jsx
        │   ├── discussion-room
        │   │   └── [roomid]
        │   │   │   └── page.jsx
        │   ├── layout.jsx
        │   └── view-summary
        │   │   └── [roomid]
        │   │       └── page.jsx
        ├── AuthProvider.jsx
        ├── _components
        │   ├── Footer.jsx
        │   ├── Hero.jsx
        │   └── LandingHeader.jsx
        ├── _context
        │   └── userContext.jsx
        ├── api
        │   └── getToken
        │   │   └── route.jsx
        ├── globals.css
        ├── handler
        │   └── [...stack]
        │   │   └── page.js
        ├── icon.png
        ├── layout.js
        ├── loading.js
        ├── page.js
        └── provider.jsx
    ├── components.json
    ├── components
        └── ui
        │   ├── button.jsx
        │   ├── dialog.jsx
        │   ├── sonner.jsx
        │   └── textarea.jsx
    ├── convex
        ├── DiscussionRoom.jsx
        ├── _generated
        │   ├── api.d.ts
        │   ├── api.js
        │   ├── dataModel.d.ts
        │   ├── server.d.ts
        │   └── server.js
        ├── schema.js
        └── users.js
    ├── jsconfig.json
    ├── lib
        └── utils.js
    ├── middleware.js
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── public
        ├── edubot-logo.svg
        ├── file.svg
        ├── globe.svg
        ├── next.svg
        ├── vercel.svg
        └── window.svg
    ├── services
        └── globalservices.jsx
    └── stack
        ├── client.js
        └── server.js


---

## 🔧 Configuration

### Convex Schema

The database uses the following collections:

**users**
- `name`: string
- `email`: string
- `credits`: number (default: 50000)
- `subscriptionId`: optional string

**DiscussionRoom**
- `expertName`: string (Joanna, Sallie, Matthew)
- `topic`: string
- `coachingOption`: string
- `conversation`: array
- `summary`: optional string

---

## 💳 Credit System

- **Free Tier**: 50,000 credits on signup
- **Credit Usage**: Deducted based on AI response length
- **Session Estimate**: ~500 credits per average session
- **Pro Plan**: 100,000 credits/month for $10

---

## 🎯 Usage

1. **Sign Up** - Create your free account
2. **Choose Mode** - Select from 5 AI coaching options
3. **Start Session** - Click "Join" and start speaking
4. **Real-time Chat** - See live transcription of your conversation
5. **Get Feedback** - Generate detailed performance analysis
6. **Review History** - Access previous session summaries


---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Convex](https://convex.dev/)
- [Groq](https://groq.com/)
- [Deepgram](https://deepgram.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vercel](https://vercel.com/)

---

<div align="center">

Made with ❤️ by Anuj Kumar

⭐ Star this repo if you find it helpful!

</div>







