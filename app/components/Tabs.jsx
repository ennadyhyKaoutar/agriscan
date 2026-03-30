'use client';

import { useState } from 'react';

export function Tabs({ tabs, defaultTab = 0, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === index
                ? 'text-primary-600 border-primary-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
