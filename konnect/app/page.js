"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import Leftbar from "@/components/mainpage/leftbar";
import Chatbar from "@/components/mainpage/chatbars/chatbar";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Database from "@/components/database/database.js";

const userDb = new Database("users");



export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messages, setmessages] = useState([])
  const [currentServerId, setCurrentServerId] = useState(0)
  

  useEffect(() => {
    const localuser = localStorage.getItem('userid');
    if (localuser) {
      setIsAuthenticated(true);
      setUserId(localuser.id);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="bg-[#202225] min-h-screen text-gray-100 flex items-center justify-center p-4">
        {showRegister ? (
          <Register 
            setIsAuthenticated={setIsAuthenticated} 
            setShowRegister={setShowRegister}
          />
        ) : (
          <Login 
            setIsAuthenticated={setIsAuthenticated} 
            setShowRegister={setShowRegister}
          />
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-[#202225] min-h-screen text-gray-100">
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#36393f] p-2 rounded-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="grid md:grid-cols-[300px_1fr] h-screen">
        <div className={`fixed md:relative w-[300px] h-full z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <Leftbar userId={userId} setIsMobileMenuOpen={setIsMobileMenuOpen} setmessages={setmessages} setCurrentServerId={setCurrentServerId} currentServerId={currentServerId} />
        </div>

        <div className="w-full">
          <Chatbar messages={messages} serverId={currentServerId} />
        </div>

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
