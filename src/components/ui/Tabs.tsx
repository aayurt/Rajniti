import React, { useState } from 'react';

export interface TabPanelProps {
  value: string;
  children: React.ReactNode;
}

export interface TabHeaderProps {
  value: string;
  onSelect: (value: string) => void;
  active: boolean;
  className?: string;
}

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function Tab({
  value,
  onSelect,
  active,
  className,
}: TabHeaderProps) {
  return (
    <button
      value={value}
      onClick={() => onSelect(value)}
      className={`flex-1 rounded-t-lg ${
        active ? 'border-b-2 border-lime text-lav bg-lime/10' : 'text-fog hover:text-lav'}
      ${className}`
    }
    aria-controls={`tab-panel-${value}`}
    aria-selected={active}
    role="tab"
    id={`tab-${value}`}
  >
    {value}
  </button>
  );
}

export function TabPanel({
  value,
  children,
}: TabPanelProps) {
  // @ts-ignore - value used for panel id generation
  return <div value={value} className="hidden p-4" id={`tab-panel-${value}`} role="tabpanel">{children}</div>;
}

export function Tabs({
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(value);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex">
        {React.Children.map(children, (child, index) => {
          const childValue = (child as any).props?.value;
          return React.cloneElement(child as React.ReactElement, {
            key: index,
            // @ts-ignore - onSelect is handled internally
            onSelect: setActiveTab,
            // @ts-ignore - className is constructed internally
            className: `flex-1 rounded-t-lg ${childValue === activeTab ? 'border-b-2 border-lime text-lav bg-lime/10' : 'text-fog hover:text-lav'} ${child.props.className || ''}`,
          });
        })}
        // @ts-ignore - onSelect is handled internally
      </div>
      {React.Children.map(children, (child) => {
const childValue = (child as any).props?.value;
        return React.cloneElement(child as React.ReactElement, {
          key: childValue,
          // @ts-ignore - value is forwarded to children
          value: childValue,
          // @ts-ignore - className is constructed internally
          className: `flex-1 rounded-t-lg ${childValue === activeTab ? 'border-b-2 border-lime text-lav bg-lime/10' : 'text-fog hover:text-lav'} ${child.props.className || ''}`,
        });
      })}
    </div>
  );
}

Tabs.displayName = 'Tabs';