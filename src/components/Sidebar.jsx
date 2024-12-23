import React from 'react';
import { Home, BarChart2, Users, Calendar, Star, Archive } from 'lucide-react';
import TeamSection from './TeamSection';

const navigation = [
  { name: 'Dashboard', icon: Home },
  { name: 'Projects', icon: Star },
  { name: 'Team', icon: Users },
  { name: 'Reports', icon: BarChart2 },
  { name: 'Archive', icon: Archive },
];

function Sidebar({ onNavigate, currentView }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col h-full">
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavigate(item.name.toLowerCase())}
            className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md ${
              currentView === item.name.toLowerCase()
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
            {item.name}
          </button>
        ))}
      </nav>
      <TeamSection />
    </div>
  );
}

export default Sidebar;