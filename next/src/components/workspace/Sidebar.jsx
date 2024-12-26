import { Home, Folder, Bell, Camera, Video, Pencil, Music, CreditCard, Download } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white p-6 flex flex-col h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
        <span className="text-xl font-semibold">Cloud Project</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-6">
        <div className="space-y-2">
          <Link href="/workspace" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link href="/workspace/storage" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
            <Folder size={20} />
            <span>My Storage</span>
          </Link>
          <Link href="/workspace/updates" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
            <Bell size={20} />
            <span>Updates</span>
          </Link>
        </div>

        {/* Studios Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Studios</h3>
          <div className="space-y-2">
            <Link href="/workspace/photogen" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
              <Camera size={20} />
              <span>PhotoGen</span>
            </Link>
            <Link href="/workspace/videocraft" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
              <Video size={20} />
              <span>VideoCraft</span>
            </Link>
            <Link href="/workspace/sketch" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
              <Pencil size={20} />
              <span>Imagine Sketch</span>
              <span className="ml-auto text-xs bg-blue-600 px-2 py-1 rounded">Beta</span>
            </Link>
            <Link href="/workspace/music" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
              <Music size={20} />
              <span>Music Studio</span>
              <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded">Waitlist</span>
            </Link>
          </div>
        </div>

        {/* Subscription Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Subscription & Billing</h3>
          <div className="space-y-2">
            <Link href="/workspace/subscription" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
              <CreditCard size={20} />
              <span>Manage Subscription</span>
            </Link>
            <Link href="/workspace/download" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
              <Download size={20} />
              <span>Download</span>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
