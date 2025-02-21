import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

interface Message {
  sender: string;
  message: string;
}

const Chat = ({ eventId, userId, userName }: { eventId: number; userId: number; userName: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/messages/${eventId}/`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
      scrollToBottom();
    };

    return () => {
      socket.close();
    };
  }, [eventId]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    const data = { event_id: eventId, sender: userName, message };
    socketRef.current?.send(JSON.stringify(data));
    setMessage("");
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <div className="w-4/5 max-w-lg p-6 bg-white rounded-xl shadow-lg flex flex-col">
        <h1 className="text-xl font-bold text-center mb-4">Welcome to Event {eventId} Chat</h1>
        <div ref={chatContainerRef} className="h-80 overflow-y-auto p-2 border rounded-md bg-gray-100">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === userName ? "justify-end" : "justify-start"} mb-2`}>
              <div className={`p-2 rounded-md ${msg.sender === userName ? "bg-purple-600 text-white" : "bg-orange-500 text-white"}`}>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-right italic">{msg.sender === userName ? "Me" : msg.sender}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md focus:outline-none"
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            onClick={sendMessage}
          >
            &#10003;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
