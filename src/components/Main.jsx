import { useState } from "react";
import Bot from "./Bot";

const Main = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);


    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white relative">
            {/* Contenido principal simple */}
            <div className="container mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold">Bienvenido a mi Challenge de Xumtech</h1>
                <p className="text-gray-400 mt-2">
                    En esta pantalla. Usa el botón “Chat” para conversar con el mi Bot.
                </p>
            </div>

            {/* Botón flotante para abrir el chat */}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg transition-colors"
                    aria-label="Abrir chat"
                >
                    Chat
                </button>
            )}

            {/* Ventana de chat modal */}
            {isChatOpen && (
                <div className="fixed inset-0 z-40 pointer-events-none">
                    {/* Capa oscura opcional: reducida opacidad para no distraer */}
                    <div className="absolute inset-0 bg-black/10" />

                    {/* Contenedor del widget */}
                    <div className="absolute bottom-6 right-6 w-[360px] h-[520px] max-w-[95vw] max-h-[85vh] pointer-events-auto">
                        <div className="relative h-full w-full shadow-2xl rounded-xl overflow-hidden">
                            {/* Botón cerrar  */}
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="absolute -top-0 -right-0 z-50 bg-gray-900 text-white w-8 h-8 rounded-full text-sm shadow-md hover:bg-gray-800"
                                aria-label="Cerrar chat"
                                title="Cerrar"
                            >
                                ✕
                            </button>

                            {/* Bot en modo embebido (tema claro) */}
                            <Bot embedded />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;
