"use client"
import { Sidebar } from '@/components/workspace/Sidebar';
import { Header } from '@/components/workspace/Header';

export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex min-h-svh bg-[#121212] pt-20">
      <Sidebar className="mt-20"/>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}
