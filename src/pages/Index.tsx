import { useState, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const chatInterfaceRef = useRef<any>(null);

  const handleNewSearch = () => {
    // Clear chat messages
    if ((window as any).clearChatMessages) {
      (window as any).clearChatMessages();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <Sidebar onNewSearch={handleNewSearch} />
        <main className="flex-1 flex flex-col">
          <ChatInterface ref={chatInterfaceRef} onClearMessages={handleNewSearch} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
