import { useEffect, useRef, useState } from "react";
import axios from 'axios';

// Modo embebido: el chat se renderiza como un widget/ventana modal ligera dentro de un contenedor,
// sin ocupar la pantalla completa ni usar cabecera/pie fijos al viewport.
const Bot = ({ embedded = false }) => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])


    const onSendMessage = async () => {
        setIsLoading(true);

        
        if (!input.trim()) {
            alert("Por favor ingresa un mensaje.");
            setIsLoading(false);
            return;
        }

        setMessages((prev) => [...prev, { sender: "user", message: input }]);   // Agregar mensaje del usuario.
        setInput("");

        try {
            const config = conversationId ? { params: { conversationId } } : undefined;
            const resp = await axios.post('http://localhost:4000/bot/message', { message: input }, config);

            if (resp.status === 200) {
                // Guardar/actualizar conversationId devuelto por el backend
                setConversationId((prev) => resp?.data?.conversationId ?? prev);
                const botText = resp?.data?.bot?.text ?? resp?.data?.message ?? ""; // Se intenta obtener el texto del bot.
                setMessages((prev) => [...prev, { sender: "assistant", message: botText }]);  // Agregar respuesta del bot.

            } else {
                setMessages((prev) => [...prev, { sender: "assistant", message: "Hubo un problema al procesar tu mensaje." }]);   // Mensaje de error genérico.
            }

            console.log("Message sent successfully:", resp.data);

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [...prev, { sender: "assistant", message: "No se pudo enviar el mensaje. Intenta nuevamente." }]);
        } finally {
            setIsLoading(false);
        }
    }


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') onSendMessage()
    }


    // Estilos condicionales por modo
    const outerClass = embedded
        ? 'flex flex-col h-full bg-white text-gray-900 rounded-xl'
        : 'flex flex-col min-h-screen bg-[#0d0d0d] text-white';

    const headerClass = embedded
        ? 'border-b border-gray-200 bg-white rounded-t-xl'
        : 'fixed top-0 left-0 w-full border-b border-gray-800 bg-[#0d0d0d] z-10';

    const mainClass = embedded
        ? 'flex-1 overflow-y-auto p-4'
        : 'flex-1 overflow-y-auto pt-20 pb-24 flex items-center justify-center';

    const containerClass = embedded
        ? 'w-full h-full px-0 flex flex-col space-y-3'
        : 'w-full max-w-4xl mx-auto px-4 flex flex-col space-y-3';

    const chatClass = embedded
        ? 'border-t border-gray-200 bg-white rounded-b-xl'
        : 'fixed bottom-0 left-0 w-full border-t border-gray-800 bg-[#0d0d0d] z-10';

    const inputWrapperClass = embedded
        ? 'w-full flex bg-gray-50 rounded-full px-4 py-2 shadow-sm'
        : 'w-full flex bg-gray-900 rounded-full px-4 py-2 shadow-lg';

    const inputClass = embedded
        ? 'flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 px-2'
        : 'flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2';

    const assistantMsgClass = embedded
        ? 'bg-gray-100 text-gray-900 self-start'
        : 'bg-gray-800 text-gray-100 self-start';

    const loadingClass = embedded
        ? 'bg-gray-200 text-gray-600'
        : 'bg-gray-700 text-gray-300';

    return (
        <div className={outerClass}>
            {/*  Header */}
            <header className={headerClass}>
                <div className={`container mx-auto flex justify-between items-center ${embedded ? 'px-4 py-3' : 'px-6 py-4'}`}>
                    <h3 className="text-lg font-bold">Chat</h3>
                   {/*  <FaUserCircle size={24} className="cursor-pointer" /> */}
                </div>
            </header>

            {/* Chat area */}
            <main className={mainClass}>
                <div className={containerClass}>
                    {messages.length === 0 ? (
                        // Mensaje de bienvenida
                        <div className={`text-center ${embedded ? 'text-gray-500' : 'text-gray-400'} text-lg`}>
                            👋 Hola, Soy <span className="text-green-600 font-semibold">Xumtech-Bot</span>.
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`px-4 py-2 rounded-xl max-w-[75%] ${msg.sender === 'user' ? 'bg-blue-600 text-white self-end' : assistantMsgClass}`}
                                >
                                    {msg.message}
                                </div>
                            ))}

                            {isLoading && (
                                <div className={`${loadingClass} px-4 py-2 rounded-xl max-w-[60%] self-start`}>
                                    Bot is typing...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </main>

            {/* Input */}
            <div className={chatClass}>
                <div className={`${embedded ? 'mx-0' : 'max-w-4xl mx-auto'} flex justify-center ${embedded ? 'px-3 py-3' : 'px-4 py-3'}`}>
                    <div className={inputWrapperClass}>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="¿Qué quieres saber?"
                            value={input}
                            onChange={(evt) => setInput(evt.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button
                            onClick={onSendMessage}
                            className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-full text-white font-medium transition-colors"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bot;