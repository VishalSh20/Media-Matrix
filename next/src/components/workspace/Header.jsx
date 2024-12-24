import { ChevronDown, Crown, Sun } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  return (
    <header className="h-16 border-b border-gray-800 bg-[#121212] flex items-center justify-end px-6 gap-4">
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800">
        Join community
        <ChevronDown size={16} />
      </button>
      
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800">
        <span>50</span>
        <span className="text-yellow-400">★</span>
      </div>
      
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700">
        <Crown size={16} />
        Upgrade
      </button>
      
      <button className="p-2 rounded-lg hover:bg-gray-800">
        <Sun size={20} />
      </button>
      
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <Image
          src="/placeholder-avatar.jpg"
          alt="User avatar"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
    </header>
  );
}
