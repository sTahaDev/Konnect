"use client"
import React, { useState } from 'react';
import Database from "@/components/database/database.js";

const serverDb = new Database("servers");

const Sendmassagebar = ({ serverId }) => {
    const [messageInput, setMessageInput] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage = {
            sender: localStorage.getItem('userid'),
            message: messageInput,
            timestamp: new Date().toISOString(),
        };

        try {
            const currentServer = await serverDb.getById(serverId); // Sunucu verilerini getir
            const updatedServer = {
                ...currentServer,
                messages: [...(currentServer.messages || []), newMessage], // Mesajları güncelle
            };

            await serverDb.addById(serverId, updatedServer); // Güncellenmiş veriyi gönder
            setMessageInput("");
            // Sayfayı yenilemek için window.location.reload() kullanabilirsiniz
            //window.location.reload();
        } catch (error) {
            console.error("Mesaj gönderilirken hata oluştu:", error);
        }
    };


    return (
        <div className="p-4 bg-[#36393f] border-t border-gray-700">
            <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 bg-[#40444b] text-[#dcddde] rounded-lg px-4 py-2 focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-[#5865f2] text-white px-4 py-2 rounded-lg hover:bg-[#4752c4] transition-colors"
                >
                    Gönder
                </button>
            </form>
        </div>
    );
};

export default Sendmassagebar;