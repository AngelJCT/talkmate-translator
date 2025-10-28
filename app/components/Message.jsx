
import React from 'react';
import { MessageSender } from '../types';

const Message = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  const userBubbleClasses = 'bg-blue-500 text-white self-end';
  const botBubbleClasses = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 self-start';

  return (
    <div className={`flex flex-col mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md lg:max-w-2xl shadow-md ${isUser ? userBubbleClasses : botBubbleClasses}`}>
        {message.image && (
          <img src={message.image} alt="User upload" className="rounded-md mb-2 max-h-60" />
        )}
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
