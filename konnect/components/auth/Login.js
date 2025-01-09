"use client"
import React, { useEffect, useState } from 'react';
import Database from "@/components/database/database.js";

const userDb = new Database("users");

const Login = ({ setIsAuthenticated, setShowRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const users = await userDb.get();
      const user = users.find(u => u.username === formData.username && u.password === formData.password);

      if (user) {
        localStorage.setItem('userid', user.id);
        setIsAuthenticated(true);
      } else {
        alert('Kullanıcı adı veya şifre hatalı!');
      }
    } catch (error) {
      console.error('Giriş yapılırken hata oluştu:', error);
      alert('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="bg-[#36393f] p-8 rounded-lg shadow-lg w-[480px]">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Tekrar Hoşgeldin!</h2>
      <p className="text-[#b9bbbe] text-center mb-6">Seni tekrar görmek güzel!</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-[#b9bbbe] uppercase mb-2 block">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            className="w-full p-2.5 bg-[#202225] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#b9bbbe] uppercase mb-2 block">
            Şifre
          </label>
          <input
            type="password"
            className="w-full p-2.5 bg-[#202225] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white p-3 rounded-md transition-colors font-medium"
        >
          Giriş Yap
        </button>
      </form>

      <p className="mt-4 text-[#b9bbbe] text-sm">
        Hesabın yok mu?{' '}
        <button
          onClick={() => setShowRegister(true)}
          className="text-[#00b0f4] hover:underline"
        >
          Hesap Oluştur
        </button>
      </p>
    </div>
  );
};

export default Login; 