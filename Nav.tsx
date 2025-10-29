import React from 'react';

interface NavProps {
  activeView: 'dashboard' | 'my-schedule';
  setActiveView: (view: 'dashboard' | 'my-schedule') => void;
}

const Nav: React.FC<NavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-schedule', label: 'My Schedule' },
  ] as const;

  return (
    <nav className="flex justify-center border-b-2 border-[#A7A9AC]/30 mb-8">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveView(item.id)}
          className={`w-1/2 py-3 text-center text-sm font-bold uppercase tracking-wider transition-colors duration-200 focus:outline-none focus:bg-[#3A3A3C] ${
            activeView === item.id
              ? 'text-white border-b-2 border-[#c8102e]'
              : 'text-[#A7A9AC] hover:text-white'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default Nav;
