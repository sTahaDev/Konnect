import React from 'react'
import Chattitle from './chattitle'
import Messagesbar from './messagesbar'
import Sendmassagebar from './sendmassagebar'

const chatbar = ({ messages, serverId }) => {
    if (serverId != 0) {
        return (
            <div className="flex flex-col h-screen bg-[#36393f]">
                {/* Sohbet Başlığı */}
                <Chattitle serverId={serverId} />

                {/* Mesajlar Alanı */}
                <Messagesbar messages={messages} />

                {/* Mesaj Gönderme Alanı */}
                <Sendmassagebar serverId={serverId} />
            </div>
        )
    }else{
        return(
            <div className="flex flex-col h-screen bg-[#36393f]">

            </div>
        )
    }

}

export default chatbar