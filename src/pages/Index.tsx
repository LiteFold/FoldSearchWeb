
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <Sidebar />
        <main className="flex-1 flex flex-col border-l border-gray-200">
          <ChatInterface />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
