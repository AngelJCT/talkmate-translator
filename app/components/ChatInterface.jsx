'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSender, ChatMode } from '../types';
import { generateChatResponse } from '../api/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Message from './Message';
import { SendIcon, ImageIcon, CloseIcon } from './IconComponent';


const ChatInterface = () => {
    const [chatMode, setChatMode] = useState(ChatMode.LEARN);

    const getWelcomeMessage = (mode) => ({
        id: '1',
        sender: MessageSender.BOT,
        text: mode === ChatMode.LEARN
            ? "こんにちは！ Welcome to your Japanese language tutor. Ask me a question or upload an image with Japanese text."
            : "Welcome to Quick Translation mode. I will translate your input between English and Japanese."
    });

    const [messages, setMessages] = useState([getWelcomeMessage(ChatMode.LEARN)]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleModeChange = (newMode) => {
        if (newMode === chatMode) return;
        setChatMode(newMode);
        setMessages([getWelcomeMessage(newMode)]);
        setInputValue('');
        setUploadedImage(null);
    };

    const handleSendMessage = async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput && !uploadedImage) return;

        setIsLoading(true);

        const userMessage = {
            id: Date.now().toString(),
            sender: MessageSender.USER,
            text: trimmedInput,
            image: uploadedImage?.preview
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        const currentUploadedImage = uploadedImage;
        setUploadedImage(null);

        let imagePayload;
        if (currentUploadedImage) {
            const base64Data = await fileToBase64(currentUploadedImage.file);
            imagePayload = {
                inlineData: {
                    data: base64Data,
                    mimeType: currentUploadedImage.file.type
                }
            };
        }

        const botResponseText = await generateChatResponse(trimmedInput, chatMode, imagePayload);

        const botMessage = {
            id: (Date.now() + 1).toString(),
            sender: MessageSender.BOT,
            text: botResponseText
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedImage({
                file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    return (
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-1 max-w-sm mx-auto">
                    <button
                        onClick={() => handleModeChange(ChatMode.LEARN)}
                        className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                            chatMode === ChatMode.LEARN ? 'bg-white dark:bg-gray-700 text-blue-500 shadow' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                        }`}
                        aria-pressed={chatMode === ChatMode.LEARN}
                    >
                        🎓 Learn Mode
                    </button>
                    <button
                        onClick={() => handleModeChange(ChatMode.TRANSLATE)}
                        className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                            chatMode === ChatMode.TRANSLATE ? 'bg-white dark:bg-gray-700 text-blue-500 shadow' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                        }`}
                         aria-pressed={chatMode === ChatMode.TRANSLATE}
                    >
                        🌐 Translate Mode
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex items-start">
                         <div className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 self-start rounded-lg px-4 py-2 max-w-xs md:max-w-md lg:max-w-2xl shadow-md">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
                {uploadedImage && (
                    <div className="relative w-24 h-24 mb-2 p-1 border border-gray-300 dark:border-gray-600 rounded-md">
                        <img src={uploadedImage.preview} alt="upload preview" className="w-full h-full object-cover rounded" />
                        <button onClick={() => setUploadedImage(null)} className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                            <CloseIcon />
                        </button>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <ImageIcon />
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button onClick={handleSendMessage} disabled={isLoading || (!inputValue.trim() && !uploadedImage)} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
