"use client"
import React, { useEffect, useState, useRef } from 'react';
import Database from "@/components/database/database.js";

const serverDb = new Database("servers");
const usersDb = new Database("users");

const MessageItem = ({ message }) => {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const user = await usersDb.getById(message.sender);
                setUsername(user.username || "Bilinmeyen Kullanıcı");
            } catch (error) {
                console.error("Kullanıcı adı alınamadı:", error);
                setUsername("Bilinmeyen Kullanıcı");
            }
        };

        fetchUsername();
    }, [message.sender]);

    const who = message.sender == localStorage.getItem('userid') ? 0 : 1;

    return who === 0 ? (
        <div className="flex items-start justify-end space-x-2 max-w-[70%] ml-auto">
            <div className="bg-[#5865f2] p-3 rounded-2xl rounded-tr-none">
                <p className="text-white">{message.message}</p>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-start space-x-2 max-w-[70%]">
            <div className=' ml-3 mb-1'>
                <p className="text-sm text-gray-400">{username}</p>
            </div>
            <div className="bg-[#2f3136] p-3 rounded-2xl rounded-tl-none">
                <p className="text-[#dcddde]">{message.message}</p>
            </div>
        </div>
    );
};

const MessagesBar = ({ messages }) => {
    const [localMessages, setLocalMessages] = useState(messages.messages || []);
    const messagesEndRef = useRef(null); // Kaydırma yapılacak referans

    useEffect(() => {
        setLocalMessages(messages.messages || []);
    }, [messages]);

    // Her mesaj eklendiğinde en alt kısma kaydırma işlemi
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [localMessages]); // localMessages değiştiğinde kaydırma yapılır

    return (
        <div className="flex-1 p-4 space-y-4 overflow-y-scroll">
            {localMessages.map((message, index) => (
                <MessageItem
                    message={message}
                    key={index}
                />
            ))}
            <div ref={messagesEndRef} /> {/* Kaydırma noktası */}
        </div>
    );
};

export default MessagesBar;
