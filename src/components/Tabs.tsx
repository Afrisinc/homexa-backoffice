import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export const Tabs = ({ tabs, defaultTab, onChange, variant = 'default', className = '' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  const getTabStyles = (isActive: boolean, disabled: boolean) => {
    if (disabled) {
      return 'opacity-50 cursor-not-allowed text-muted-foreground';
    }

    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-primary text-primary-foreground rounded-full'
          : 'text-foreground hover:bg-muted/50 rounded-full';

      case 'underline':
        return isActive
          ? 'text-primary border-b-2 border-primary'
          : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent';

      default:
        return isActive
          ? 'bg-card text-foreground border-b-2 border-primary rounded-t-lg'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-t-lg';
    }
  };

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        className={`flex gap-1 border-b border-border ${
          variant === 'pills' ? 'bg-muted/20 p-1 rounded-lg w-fit' : ''
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${getTabStyles(
              activeTab === tab.id,
              tab.disabled || false
            )}`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? 'block' : 'hidden'} animate-in fade-in duration-200`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
