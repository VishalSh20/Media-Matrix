import React, { useState } from 'react';
import { Home, Folder, Bell, Camera, Video, Pencil, Music, CreditCard, Download, ChevronLeft, ChevronRight, FolderCog2 } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  return (
    <aside 
      className={cn(
        "bg-black text-white transition-all duration-300 flex flex-col h-screen relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-blue-600 rounded-full p-1.5 hover:bg-blue-700 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 p-6 mb-4">
        {!isCollapsed && <span className="text-xl font-semibold">Workspace</span>}
       </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        <TooltipProvider>
          {/* Main Links */}
          <div className="space-y-2">
            {[
              { href: '/workspace', icon: Home, label: 'Home' },
              { href: '/workspace/storage', icon: Folder, label: 'My Storage' },
              { href: '/workspace/projects', icon: FolderCog2, label: 'projects' },
            ].map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          {/* Studios Section */}
          <div>
            <button
              onClick={() => toggleSection('studios')}
              className="w-full text-left mb-2"
            >
              <h3 className="text-sm font-semibold text-gray-400">
                {!isCollapsed && "Studios"}
              </h3>
            </button>
            <div className={cn(
              "space-y-2 transition-all",
              activeSection === 'studios' || isCollapsed ? "block" : "hidden"
            )}>
              <NavItem
                href="/workspace/photogen"
                icon={Camera}
                label="PhotoGen"
                isCollapsed={isCollapsed}
              />
              <NavItem
                href="/workspace/videocraft"
                icon={Video}
                label="VideoCraft"
                isCollapsed={isCollapsed}
              />
              <NavItem
                href="/workspace/sketch"
                icon={Pencil}
                label="Imagine Sketch"
                badge={{ text: "Beta", color: "bg-blue-600" }}
                isCollapsed={isCollapsed}
              />
              <NavItem
                href="/workspace/music"
                icon={Music}
                label="Music Studio"
                badge={{ text: "Waitlist", color: "bg-gray-700" }}
                isCollapsed={isCollapsed}
              />
            </div>
          </div>

          {/* Subscription Section */}
          <div>
            <button
              onClick={() => toggleSection('subscription')}
              className="w-full text-left mb-2"
            >
              <h3 className="text-sm font-semibold text-gray-400">
                {!isCollapsed && "Subscription & Billing"}
              </h3>
            </button>
            <div className={cn(
              "space-y-2 transition-all",
              activeSection === 'subscription' || isCollapsed ? "block" : "hidden"
            )}>
              <NavItem
                href="/workspace/subscription"
                icon={CreditCard}
                label="Manage Subscription"
                isCollapsed={isCollapsed}
              />
              <NavItem
                href="/workspace/download"
                icon={Download}
                label="Download"
                isCollapsed={isCollapsed}
              />
            </div>
          </div>
        </TooltipProvider>
      </nav>
    </aside>
  );
}

// NavItem component for consistent styling
const NavItem = ({ href, icon: Icon, label, badge, isCollapsed }) => {
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors group"
          >
            <Icon size={20} className="flex-shrink-0" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
          <p>{label}</p>
          {badge && (
            <span className={cn("ml-2 text-xs px-2 py-1 rounded", badge.color)}>
              {badge.text}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors group"
    >
      <Icon size={20} className="flex-shrink-0" />
      <span>{label}</span>
      {badge && (
        <span className={cn("ml-auto text-xs px-2 py-1 rounded", badge.color)}>
          {badge.text}
        </span>
      )}
    </Link>
  );
};

export default Sidebar;