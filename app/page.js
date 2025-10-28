
import React from 'react';
import ChatInterface from './components/ChatInterface';

export default function App() {
  return (
    <div className="flex flex-col h-screen antialiased text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          TalkMate 🇯🇵
        </h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Your personal AI assistant for learning Japanese
        </p>
      </header>
      <main className="flex-grow flex flex-col p-4 md:p-6 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
