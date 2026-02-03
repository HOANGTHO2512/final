import { GoogleGenerativeAI } from '@google/generative-ai';
import { useEffect, useRef, useState } from 'react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const genAI = useRef(null);

    const SYSTEM_PROMPT = `你是一個專業的職涯導師和品牌顧問。你的角色是幫助用戶：
1. 探索職業適配性和天賦優勢（基於Holland興趣代碼和Gallup天賦系統）
2. 優化個人品牌定位和履歷
3. 提供職涯發展建議和行動計劃
4. 回答關於CareerFit Pro應用的功能和使用方法

請用繁體中文回答。保持友善、專業和具有建設性。如果用戶問與職涯、品牌或履歷無關的問題，請禮貌地引導他們回到相關主題。`;

    // Initialize Gemini API and load conversation history
    useEffect(() => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log('API Key loaded:', apiKey ? '✅ Yes' : '❌ No');
        console.log('API Key value:', apiKey);
        
        if (apiKey) {
            try {
                genAI.current = new GoogleGenerativeAI(apiKey);
                console.log('✅ GoogleGenerativeAI initialized successfully');
            } catch (error) {
                console.error('❌ Error initializing GoogleGenerativeAI:', error);
            }
        } else {
            console.warn('❌ VITE_GEMINI_API_KEY not found in environment variables');
        }

        // Load saved messages from localStorage
        const savedMessages = localStorage.getItem('chatbot_history');
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error('Error loading chat history:', e);
                setMessages([
                    { role: 'assistant', text: '你好！👋 我是您的 AI 職涯顧問。我可以幫助您探索職業適配性、優化個人品牌，以及規劃職涯發展。有什麼我可以協助的嗎？' }
                ]);
            }
        } else {
            setMessages([
                { role: 'assistant', text: '你好！👋 我是您的 AI 職涯顧問。我可以幫助您探索職業適配性、優化個人品牌，以及規劃職涯發展。有什麼我可以協助的嗎？' }
            ]);
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatbot_history', JSON.stringify(messages));
        }
    }, [messages]);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        console.log('🔵 Sending message...');
        console.log('genAI.current exists:', !!genAI.current);

        // Add user message
        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!genAI.current) {
                console.error('❌ genAI.current is not initialized');
                throw new Error('Gemini API key not configured');
            }

            console.log('✅ Initializing model...');
            const model = genAI.current.getGenerativeModel({ model: 'gemini-2.5-flash' });
            
            // Prepare chat history with system prompt
            const chatHistory = [
                {
                    role: 'user',
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                {
                    role: 'model',
                    parts: [{ text: '明白了。我會作為一個專業的職涯導師和品牌顧問來協助您。' }]
                },
                ...messages.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.text }]
                }))
            ];

            console.log('✅ Starting chat...');
            const chat = model.startChat({
                history: chatHistory
            });

            console.log('✅ Sending message to Gemini API...');
            const result = await chat.sendMessage(input);
            const response = await result.response;
            const text = response.text();

            console.log('✅ Response received:', text.substring(0, 50) + '...');
            // Add assistant message
            setMessages(prev => [...prev, { role: 'assistant', text }]);
        } catch (error) {
            console.error('❌ Error:', error);
            console.error('Error details:', error.message);
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: `抱歉，發生了錯誤：${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = () => {
        if (confirm('確定要清除所有聊天記錄嗎？')) {
            setMessages([
                { role: 'assistant', text: '你好！👋 我是您的 AI 職涯顧問。我可以幫助您探索職業適配性、優化個人品牌，以及規劃職涯發展。有什麼我可以協助的嗎？' }
            ]);
            localStorage.removeItem('chatbot_history');
        }
    };

    return (
        <>
            {/* Chat Button */}
            <div className="fixed bottom-6 right-6 z-[60]">
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
                        title="Open ChatBot"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                )}

                {/* Chat Window */}
                {isOpen && (
                    <div className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col animate-fade-in-up fixed bottom-6 right-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">職涯 AI 顧問</h3>
                            <p className="text-xs text-blue-100">由 Gemini 驅動</p>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={handleClearHistory}
                                className="text-white hover:bg-blue-700 p-1 rounded transition"
                                title="Clear chat history"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-blue-700 p-1 rounded transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg text-sm leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none max-w-sm'
                                    }`}
                                >
                                    {msg.role === 'user' ? (
                                        <p>{msg.text}</p>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-slate-800 border border-slate-200 px-4 py-2 rounded-lg rounded-bl-none">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="輸入您的問題..."
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
                )}
            </div>
        </>
    );
};

export default ChatBot;
