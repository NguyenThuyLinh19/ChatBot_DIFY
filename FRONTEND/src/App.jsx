import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>HealthChat</h1>
        </div>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <button onClick={handleLogout}>Đăng xuất</button>
          ) : (
            <>
              <button onClick={handleLogin}>Đăng nhập</button>
              <button>Đăng ký</button>
            </>
          )}
        </div>
      </header>

      {/* Body */}
      <main className="main-content">
        <div className="create-chatbot">
          <h2>HEALTH CHAT</h2>
          <p>Chăm sóc khách hàng 24/7 với AI chatbot</p>
          <button className="create-button">Tạo Chatbot</button>
        </div>
      </main>
    </div>
  );
};

export default App;
