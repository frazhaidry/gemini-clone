'use client';
import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { FaPlus, FaUser, FaQuestion, FaMessage } from 'react-icons/fa';
import { FaRegCommentDots } from "react-icons/fa"; // or any relevant icon from "react-icons/fa"    
import { IoMdSettings } from 'react-icons/io';
import { SiStagetimer } from 'react-icons/si';
import { IoSend } from 'react-icons/io5';

const ChatPage = () => {
  const [extended, setExtended] = useState(true);
  const [chats, setChats] = useState([
    { id: Date.now(), name: 'New Chat', messages: [] }
  ]);
  const [currentChatId, setCurrentChatId] = useState(chats[0].id);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedChats = chats.map(chat =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    );

    setChats(updatedChats);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botMessage = { role: 'bot', content: data.reply };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, botMessage] }
            : chat
        )
      );
    } catch (err) {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, { role: 'bot', content: '⚠️ Error getting response.' }]
              }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      name: 'New Chat',
      messages: []
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f4f8]">
      {/* Sidebar */}
      <div className="min-h-screen w-fit bg-[#e4e7eb] py-6 px-4 flex flex-col justify-between">
        <div>
          <FiMenu
            onClick={() => setExtended(!extended)}
            className="text-2xl cursor-pointer mb-6"
          />
          <div
            onClick={createNewChat}
            className="inline-flex items-center gap-3 py-2 px-4 text-sm text-gray-600 cursor-pointer bg-gray-300 rounded-full"
          >
            <FaPlus className="text-xl" />
            {extended && <p>New Chat</p>}
          </div>

          {extended && (
            <div className="mt-6">
              <p className="mb-3 text-gray-700 font-semibold">Recent</p>
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`flex items-center gap-2 py-2 px-4 text-sm text-gray-600 cursor-pointer rounded-full hover:bg-gray-300 ${
                    chat.id === currentChatId ? 'bg-gray-300 font-semibold' : ''
                  }`}
                >
                  <FaRegCommentDots className="text-xl" />
                  <p>{chat.messages[0]?.content?.slice(0, 20) || chat.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2 p-2 pr-10 rounded-full text-slate-700 cursor-pointer hover:bg-gray-300">
            <FaQuestion className="text-xl" />
            {extended && <p className="font-bold">Help</p>}
          </div>
          <div className="flex items-center gap-2 p-2 pr-10 rounded-full text-slate-700 cursor-pointer hover:bg-gray-300">
            <SiStagetimer className="text-xl" />
            {extended && <p className="font-bold">Activity</p>}
          </div>
          <div className="flex items-center gap-2 p-2 pr-10 rounded-full text-slate-700 cursor-pointer hover:bg-gray-300">
            <IoMdSettings className="text-xl" />
            {extended && <p className="font-bold">Settings</p>}
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col min-h-screen bg-white text-gray-800 w-full">
        {/* Header */}
        <header className="flex items-center justify-between p-6 shadow-md w-full">
          <h1 className="text-4xl font-bold text-indigo-600">Gemini</h1>
          <FaUser className="text-3xl text-indigo-600 cursor-pointer hover:text-indigo-800 transition duration-200" />
        </header>

        {/* Greeting */}
        <div className="mt-20 px-6 text-center">
          <h2 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Hello Fraz, how can I help you?
          </h2>
        </div>

        {/* Chat Area */}
        <main className="flex flex-col h-full flex-grow w-full items-center">
  {/* Message List */}
  <div className="flex flex-col-reverse w-full max-w-3xl flex-grow overflow-y-auto px-4 py-6 gap-4">
    {[...currentChat?.messages].reverse().map((msg, i) => (
      <div
        key={i}
        className={`w-fit max-w-[80%] px-4 py-3 rounded-xl text-base whitespace-pre-wrap ${
          msg.role === 'user'
            ? 'self-end bg-indigo-100 text-gray-800'
            : 'self-start bg-gray-200 text-gray-900'
        }`}
      >
        {msg.content}
      </div>
    ))}

    {loading && (
      <div className="self-start bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-500 italic">
        Gemini is thinking...
      </div>
    )}
  </div>

  {/* Input Box (Fixed at bottom of chat container) */}
  <div className="w-full max-w-3xl px-4 py-3 bg-white border-t">
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 shadow-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask me anything..."
        className="flex-grow bg-transparent focus:outline-none px-4 text-gray-700 placeholder-gray-500 text-base"
      />
      <IoSend
        className="text-2xl text-indigo-600 cursor-pointer hover:text-indigo-800 transition duration-200"
        onClick={handleSend}
      />
    </div>
  </div>
</main>





      </div>
    </div>
  );
};

export default ChatPage;
