import React from 'react';
import './header.css'; // Import your CSS file

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
      <div>
          <button className="menu-btn">
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <div>
          <h1 className="startup-heading">Startup</h1>
        </div>
      
      </nav>
    </header>
  );
};

export default Header;
