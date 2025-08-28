import { useEffect, useRef, useState } from "react";
import axios from 'axios';

// Versión única: widget claro embebido (no pantalla completa)
const Bot = () => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null)

    useEffect(() => {
        // Para desplazar la vista hacia abajo cuando hay nuevos mensajes.
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
            const thisConversation = conversationId ? { params: { conversationId } } : undefined;   // Se extrae conversationId si existe.
            const resp = await axios.post('http://localhost:4000/bot/message', { message: input }, thisConversation);

            if (resp.status === 200) {
                // Guardar/actualizar conversationId devuelto por el backend
                setConversationId((prev) => resp?.data?.conversationId ?? prev);
                const botText = resp?.data?.bot?.text; //  texto del bot.
                setMessages((prev) => [...prev, { sender: "assistant", message: botText }]);  // Agregar respuesta del bot.

            } else {
                setMessages((prev) => [...prev, { sender: "assistant", message: "Hubo un problema al procesar tu mensaje." }]);   
            }

            //console.log("Message sent successfully:", resp.data);

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [...prev, { sender: "assistant", message: "No se pudo enviar el mensaje. Intenta nuevamente." }]); // Mensaje de error genérico.

        } finally {
            setIsLoading(false);
        }
    }


    const onKeyPress = (evt) => {
        if (evt.key === 'Enter') onSendMessage()
    }


    // Variables Estilos
    const outerClass = 'flex flex-col h-full bg-white text-gray-900 rounded-xl';
    const headerClass = 'border-b border-gray-200 bg-white rounded-t-xl';
    const mainClass = 'flex-1 overflow-y-auto p-4';
    const containerClass = 'w-full h-full px-0 flex flex-col space-y-3';
    const chatClass = 'border-t border-gray-200 bg-white rounded-b-xl';
    const inputWrapperClass = 'w-full flex bg-gray-50 rounded-full px-4 py-2 shadow-sm';
    const inputClass = 'flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 px-2';
    const assistantMsgClass = 'bg-gray-100 text-gray-900 self-start';
    const loadingClass = 'bg-gray-200 text-gray-600';





    return (
        <div className={outerClass}>
            {/*  Header */}
            <header className={headerClass}>
                <div className={`container mx-auto flex justify-between items-center px-4 py-3`}>
                    <h3 className="text-lg font-bold">Chat</h3>
                </div>
            </header>

            {/* Chat area */}
            <section className={mainClass}>
                <div className={containerClass}>
                    {messages.length === 0 ? (
                        // Mensaje de bienvenida
                        <div className={`text-center text-gray-500 text-lg`}>
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
                                    Esperando un momento...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </section>

            {/* Input */}
            <section className={chatClass}>
                <div className={`mx-0 flex justify-center px-3 py-3`}>
                    <div className={inputWrapperClass}>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="¿Qué quieres saber?"
                            value={input}
                            onChange={(evt) => setInput(evt.target.value)}
                            onKeyDown={onKeyPress}
                        />
                        <button
                            onClick={onSendMessage}
                            className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-full text-white font-medium transition-colors"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Bot;