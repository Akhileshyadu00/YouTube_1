
import React from 'react';
import SideNavbar from '../Components/SideNavbar';
import Main from '../Components/Main';

function Home({ sideNavbar }) {
  return (
    <div className="flex w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <SideNavbar isOpen={sideNavbar} />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sideNavbar ? 'ml-0' : 'ml-10'}`}>
        <Main fullNav={sideNavbar} />
      </main>
    </div>
  );
}

export default Home;
