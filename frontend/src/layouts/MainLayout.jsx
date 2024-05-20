import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <div className="relative h-screen w-screen overflow-x-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        <Navbar />
        <div className="pt-16 px-4 pb-8 flex flex-col items-center">
          <div className="w-full max-w-4xl bg-gray-500 rounded-lg shadow-lg overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
