"use client"
import { Sidebar } from '@/components/workspace/Sidebar';
import { Header } from '@/components/workspace/Header';

export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#121212] pt-20">
      <Sidebar className="mt-20"/>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
