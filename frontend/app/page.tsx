"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const OPTIONS = [
  {
    key: "chat",
    label: "Chat",
    icon: "💬",
    description: "Text-based conversation with our chat agent.",
    button: "Continue to Chat",
    route: "/chat",
  },
  {
    key: "voice",
    label: "Voice Agent",
    icon: "🎤",
    description: "Talk to our Vapi-powered voice agent.",
    button: "Continue to Voice Agent",
    route: "/voice",
  },
];

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState("chat");
  const option = OPTIONS.find((o) => o.key === selected);

  // Chat state
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsRecording(false);
        if (transcript) {
          handleVoiceInput(transcript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognition);
    }
  }, []);

  // Log messages for debugging
  useEffect(() => {
    console.log("Chat messages:", messages);
  }, [messages]);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handle chat send
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    scrollToBottom();
    try {
      const res = await fetch("http://0.0.0.0:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg.text }),
      });
      const data = await res.json();
      console.log("Backend response:", data);
      // data has keys {response, sources}
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: data.response },
        ...(data.sources && data.sources.length > 0
          ? [{ sender: "bot", text: `Sources: ${data.sources.join(", ")}` }]
          : []),
      ]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: "bot", text: "Sorry, there was an error." }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  // Handle voice input
  const handleVoiceInput = async (voiceText: string) => {
    if (!voiceText.trim() || loading) return;
    const userMsg = { sender: "user", text: voiceText };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    scrollToBottom();
    try {
      const res = await fetch("http://0.0.0.0:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: voiceText }),
      });
      const data = await res.json();
      console.log("Backend response:", data);
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: data.response },
        ...(data.sources && data.sources.length > 0
          ? [{ sender: "bot", text: `Sources: ${data.sources.join(", ")}` }]
          : []),
      ]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: "bot", text: "Sorry, there was an error." }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  // Reset chat when switching tabs
  const handleTab = (key: string) => {
    setSelected(key);
    if (key === "chat") {
      setMessages([{ sender: "bot", text: "Hello! How can I help you today?" }]);
      setInput("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h1 className="text-2xl font-bold text-center">AI Assistant</h1>
          <p className="text-blue-100 text-center mt-1">Choose your preferred interaction method</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              className={`flex-1 py-4 text-lg font-semibold transition-all duration-200 focus:outline-none relative
                ${selected === o.key
                  ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                  : "text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300"
                }
              `}
              onClick={() => handleTab(o.key)}
            >
              <span className="mr-2">{o.icon}</span>
              {o.label}
              {selected === o.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6" style={{ minHeight: '500px' }}>
          {selected === "chat" ? (
            <div className="w-full flex flex-col h-full">
              {/* Chat Messages */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 overflow-y-auto" style={{ minHeight: '300px', maxHeight: '400px' }}>
                <div className="space-y-3">
                  {/* Debug info */}
                  <div className="text-xs text-gray-500 mb-2">Messages count: {messages.length}</div>
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No messages yet. Start a conversation!
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                            msg.sender === "user"
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form className="flex gap-3" onSubmit={handleSend}>
                <input
                  type="text"
                  className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Type your message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center h-full">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎤</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Voice Agent</h2>
                <p className="text-gray-600 dark:text-gray-300">Click the microphone to start talking</p>
              </div>

              {/* Voice Recording Area */}
              <div className="w-full max-w-md">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-4">
                  <div className="text-center">
                    <button
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${
                        isRecording
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                      onClick={() => {
                        if (isRecording) {
                          setIsRecording(false);
                          recognition?.stop();
                        } else {
                          setIsRecording(true);
                          setTranscript("");
                          recognition?.start();
                        }
                      }}
                    >
                      {isRecording ? "⏹️" : "🎤"}
                    </button>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                    </p>
                    {transcript && (
                      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Transcript:</strong> {transcript}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Messages for Voice */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                            msg.sender === "user"
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-md"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-md px-3 py-2">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}