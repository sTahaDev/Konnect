import React, { useState } from 'react';

const Register = ({ setIsAuthenticated, setShowRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kullanıcı adı kontrolü
    if (users.some(user => user.username === formData.username)) {
      alert('Bu kullanıcı adı zaten kullanılıyor!');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      username: formData.username,
      password: formData.password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsAuthenticated(true);
  };

  return (
    <div className="bg-[#36393f] p-8 rounded-lg shadow-lg w-[480px]">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Hesap Oluştur</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-[#b9bbbe] uppercase mb-2 block">
            Ad Soyad
          </label>
          <input
            type="text"
            className="w-full p-2.5 bg-[#202225] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#b9bbbe] uppercase mb-2 block">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            className="w-full p-2.5 bg-[#202225] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
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
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#b9bbbe] uppercase mb-2 block">
            Şifre Tekrar
          </label>
          <input
            type="password"
            className="w-full p-2.5 bg-[#202225] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white p-3 rounded-md transition-colors font-medium"
        >
          Kayıt Ol
        </button>
      </form>

      <p className="mt-4 text-[#b9bbbe] text-sm">
        Zaten bir hesabın var mı?{' '}
        <button
          onClick={() => setShowRegister(false)}
          className="text-[#00b0f4] hover:underline"
        >
          Giriş Yap
        </button>
      </p>
    </div>
  );
};

export default Register; 