import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";

const Bot = () => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])


    const onSendMessage = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const trimmed = input.trim();
        if (!trimmed) {
            alert("Please enter a message.");
            setIsLoading(false);
            return;
        }

        // Agregar mensaje del usuario de inmediato
        setMessages((prev) => [...prev, { sender: "user", message: trimmed }]);
        setInput("");

        try {
            const resp = await axios.post('http://localhost:4000/bot/message', { message: trimmed });

            if (resp.status === 200) {
                const botText = resp?.data?.bot?.text ?? resp?.data?.message ?? ""; // Se intenta obtener el texto del bot.
                setMessages((prev) => [...prev, { sender: "bot", message: botText }]);  // Agregar respuesta del bot.

            } else {
                setMessages((prev) => [...prev, { sender: "bot", message: "Hubo un problema al procesar tu mensaje." }]);   // Mensaje de error genérico.
            }

            console.log("Message sent successfully:", resp.data);

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [...prev, { sender: "bot", message: "No se pudo enviar el mensaje. Intenta nuevamente." }]);
        } finally {
            setIsLoading(false);
        }
    }


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') onSendMessage()
    }


    return (
        <div className='flex flex-col min-h-screen bg-[#0d0d0d] text-white'>
            {/* Navbar & Header */}
            <header className="fixed top-0 left-0 w-full border-b border-gray-800 bg-[#0d0d0d] z-10">
                <div className=" container mx-auto flex justify-between items-center px-6 py-4">
                    <h1 className="text-lg font-bold">Bot-XumtechChallege</h1>
                    <FaUserCircle size={30} className="cursor-pointer" />
                </div>
            </header>

            {/* Chat area */}
            <main className="flex-1 overflow-y-auto pt-20 pb-24 flex items-center justify-center">
                <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-3">
                    {messages.length === 0 ? (
                        // Centered welcome message
                        <div className="text-center text-gray-400 text-lg">
                            👋 Hi, I'm{" "}
                            <span className="text-green-500 font-semibold">BotSpoof</span>.
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`px-4 py-2 rounded-xl max-w-[75%] ${msg.sender === "user"
                                        ? "bg-blue-600 text-white self-end"
                                        : "bg-gray-800 text-gray-100 self-start"
                                        }`}
                                >
                                    {msg.message}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-xl max-w-[60%] self-start">
                                    Bot is typing...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </main>

            {/* Input & Footer */}
            <footer className="fixed bottom-0 left-0 w-full border-t border-gray-800 bg-[#0d0d0d] z-10">
                <div className="max-w-4xl mx-auto flex justify-center px-4 py-3">
                    <div className="w-full flex bg-gray-900 rounded-full px-4 py-2 shadow-lg">
                        <input
                            type="text"
                            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2"
                            placeholder="Ask BotSpoof..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button
                            onClick={onSendMessage}
                            className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-full text-white font-medium transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Bot;