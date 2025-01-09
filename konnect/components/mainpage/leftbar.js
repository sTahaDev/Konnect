"use client"
import React, { useEffect, useState } from 'react'
import Database from "@/components/database/database.js";

const userDb = new Database("users");
const serverDb = new Database("servers");

const leftbar = ({ userId, setIsMobileMenuOpen, setmessages, setCurrentServerId , currentServerId}) => {
    const [activeTab, setActiveTab] = useState("dm");
    const [user, setUser] = useState(null);
    const [dmUsers, setDmUsers] = useState({});
    const [servers, setServers] = useState({});
    



    useEffect(() => {
        const userData = localStorage.getItem('userid');
        if (userData) {
            userDb.getById(userData).then(data => setUser(data));
        }
    }, []);

    useEffect(() => {
        if (user?.dms) {
            user.dms.forEach(async (dmId) => {
                const dmUser = await userDb.getById(dmId);
                setDmUsers(prev => ({ ...prev, [dmId]: dmUser }));
            });
        }
    }, [user]);

    useEffect(() => {
        if (user?.servers) {
            user.servers.forEach(async (serverId) => {
                const serverData = await serverDb.getById(serverId);
                setServers(prev => ({ ...prev, [serverId]: serverData }));
            });
        }
    }, [user]);


    async function serverHandler(id) {

        setIsMobileMenuOpen(false)
        setCurrentServerId(id);
        const messages = await serverDb.getById(id);

        setmessages(messages);
    }

    function exitHandle() {
        localStorage.removeItem("userid")
        window.location.reload()
    }

    useEffect(() => {
        // WebSocket bağlantısı oluşturma
        const socket = new WebSocket('ws://localhost:8080');

        // Bağlantı açıldığında
        socket.onopen = () => {
            console.log('WebSocket bağlantısı kuruldu.');
            socket.send('Merhaba, sunucu!');
        };

        // Mesaj alındığında
        socket.onmessage = async (event) => {
            console.log(event.data.toString());
            
            if(event.data.toString() == "updateScreen-"+currentServerId){
                const messages = await serverDb.getById(currentServerId);
                setmessages(messages);
                console.log("evvettt");
                
            }
            
        };

        // Hata oluştuğunda
        socket.onerror = (error) => {
            console.error('WebSocket hatası:', error);
        };

        // Bağlantı kapandığında
        socket.onclose = () => {
            console.log('WebSocket bağlantısı kapandı.');
        };
    }, [currentServerId])

    return (
        <div className="bg-[#2f3136] h-full border-r border-[#202225] p-4 relative">
            {/* Mobil Kapatma Butonu */}
            <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Profil Bölümü */}
            <div className="flex items-center space-x-1 mb-6 mt-2">
                <img
                    className="rounded-full bg-[#36393f] mr-3 w-[50px] h-[50px] md:w-[70px] md:h-[70px]"
                    src={user?.imgUrl}
                    alt="Açıklama"
                />
                <div>
                    <h2 className="font-semibold text-white text-sm md:text-base">{user?.username}</h2>
                    <p className="text-xs md:text-sm text-[#b9bbbe]">Çevrimiçi</p>
                </div>
            </div>

            {/* Switch */}
            <div className="bg-[#36393f] p-1 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-1">
                    <button
                        onClick={() => setActiveTab("dm")}
                        className={`py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === "dm"
                            ? "bg-[#404249] text-white shadow-sm"
                            : "text-[#b9bbbe] hover:text-gray-100"
                            }`}
                    >
                        DM'ler
                    </button>
                    <button
                        onClick={() => setActiveTab("servers")}
                        className={`py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === "servers"
                            ? "bg-[#404249] text-white shadow-sm"
                            : "text-[#b9bbbe] hover:text-gray-100"
                            }`}
                    >
                        Sunucular
                    </button>
                </div>
            </div>

            {/* Arama Çubuğu */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={activeTab === "dm" ? "DM ara..." : "Sunucu ara..."}
                        className="w-full px-3 md:px-4 py-2 text-sm bg-[#202225] text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865f2] placeholder-[#72767d]"
                    />
                </div>
            </div>

            {/* Sohbet Listesi */}
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                {activeTab === "dm" ? (
                    // DM Listesi
                    user?.dms.map((dmId, index) => (
                        <div
                            key={index}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center p-2 md:p-3 hover:bg-[#36393f] rounded-md cursor-pointer transition-colors"
                        >
                            <img
                                className="rounded-full bg-[#36393f] mr-3 w-[40px] h-[40px] md:w-[50px] md:h-[50px]"
                                src={dmUsers[dmId]?.imgUrl}
                                alt="Açıklama"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-[#ffffff] text-sm md:text-base truncate">
                                    {dmUsers[dmId]?.username || 'Yükleniyor...'}
                                </h3>
                                <p className="text-xs md:text-sm text-[#b9bbbe] truncate">
                                    Son mesaj içeriği...
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    // Sunucu Listesi
                    user?.servers.map((serverId, index) => (
                        <div
                            key={index}
                            onClick={function () { serverHandler(serverId) }}
                            className="flex items-center p-2 md:p-3 hover:bg-[#36393f] rounded-md cursor-pointer transition-colors"
                        >
                            <img
                                className="rounded-full bg-[#36393f] mr-3 w-[40px] h-[40px] md:w-[50px] md:h-[50px]"
                                src={servers[serverId]?.imgUrl}
                                alt="Açıklama"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-[#ffffff] text-sm md:text-base truncate">
                                    {servers[serverId]?.name || 'Yükleniyor...'}
                                </h3>
                                <p className="text-xs md:text-sm text-[#b9bbbe] truncate">
                                    {servers[serverId]?.members.length} üye aktif
                                </p>
                            </div>
                        </div>
                    ))
                )}

                <button className=' absolute bottom-3 left-2 bg-red-500 p-3 rounded-md' onClick={exitHandle}>
                    Çıkış Yap
                </button>
            </div>
        </div>
    )
}

export default leftbar