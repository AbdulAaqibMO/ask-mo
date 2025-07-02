# AskMO - Motability Operations FAQ Assistant

AskMO is an interactive FAQ assistant designed specifically for Motability Operations users. It provides quick, accurate answers to common questions about vehicle adaptations, mobility equipment, and Motability scheme services.

## Features

- 🎯 **Smart FAQ Search**: Instantly find answers to questions about vehicle adaptations and Motability services
- 🎤 **Voice Input Support**: Ask questions using voice commands for hands-free operation
- 🔊 **Text-to-Speech**: Listen to answers with clear text-to-speech functionality
- 💻 **Modern UI**: Clean, accessible interface built with Next.js and Tailwind CSS
- ⚡ **Real-time Updates**: Instant responses with no page reloads
- 🌐 **Accessibility**: Designed with accessibility in mind for all users

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with Shadcn UI components
- **Speech Recognition**: Web Speech API
- **Text-to-Speech**: Web Speech Synthesis API
- **State Management**: React Hooks

## Getting Started

1. **Clone the repository**
   ```
   git clone https://github.com/AbdulAaqibMO/ask-mo.git
   cd ask-mo
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Run the development server**
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ChatInterface.tsx
│   ├── ChatPage.tsx
│   └── ui/          # Reusable UI components
├── data/            # FAQ data
├── hooks/           # Custom React hooks
└── utils/           # Utility functions
```
