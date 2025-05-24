import React from 'react';

interface Tab {
  id: string;
  label: string;
  onClick: () => void;
  isActive: boolean;
  className?: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, className = '' }) => {
  return (
    <div className={`flex space-x-2 mb-6 border-b ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={tab.onClick}
          className={`py-2 px-4 ${
            tab.isActive 
              ? 'border-b-2 border-primary text-primary font-medium' 
              : 'text-foreground/70 hover:text-primary'
          } transition-colors ${tab.className || ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation; 