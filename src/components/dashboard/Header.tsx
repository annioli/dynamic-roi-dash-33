
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/8d13554a-6df1-4e26-8bb5-2b8ea7687f01.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
