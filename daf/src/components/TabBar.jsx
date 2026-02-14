import React from 'react';

const tabs = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'tree', label: 'My Tree', icon: '🌳' },
  { id: 'explore', label: 'Explore', icon: '🔍' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
