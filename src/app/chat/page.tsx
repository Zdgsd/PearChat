"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, MessageSquarePlus, Users } from "lucide-react";
import ChatArea from "@/components/chat-area";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

type Peer = {
  id: string;
  connection: RTCPeerConnection;
};

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const user = getCurrentUser();
    if (!user) {
      router.replace("/");
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };
  
  if (!isClient || !currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
           <p className="text-muted-foreground">Loading Secure Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
            <MessageSquarePlus className="h-8 w-8 text-primary"/>
            <h1 className="text-xl font-bold font-headline">SecureP2P Chat</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Connected as <strong className="text-foreground">{currentUser}</strong>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${currentUser}`} alt={currentUser} />
                  <AvatarFallback>{currentUser.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col md:flex-row gap-4 p-4 overflow-hidden">
        <ChatArea />
      </main>
    </div>
  );
}
