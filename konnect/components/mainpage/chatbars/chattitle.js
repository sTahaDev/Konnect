import React, { useEffect, useState } from 'react'
import Database from "@/components/database/database.js";

const serverDb = new Database("servers");

const chattitle = ({ serverId }) => {
    const [server, setServer] = useState({});

    useEffect(() => {
        async function getServer() {
            const serverInfo = await serverDb.getById(serverId);
            setServer(serverInfo);
        }
        getServer();
    }, [serverId])


    return (
        <div className="p-4 border-b border-[#202225] bg-[#36393f]">
            <div className="flex items-center space-x-4">
                
                <img
                    className="rounded-full bg-[#36393f] mr-3 w-[40px] h-[40px] md:w-[50px] md:h-[50px]"
                    src={server.imgUrl}
                    alt="Açıklama"
                />
                <div>
                    <h2 className="font-semibold text-white"> {server.name} </h2>
                    <p className="text-sm text-[#b9bbbe]">Son görülme: Az önce</p>
                </div>
            </div>
        </div>
    )
}

export default chattitle