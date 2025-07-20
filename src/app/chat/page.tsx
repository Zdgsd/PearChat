
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
import { LogOut, UserCircle, Share2 } from "lucide-react";
import ChatArea from "@/components/chat-area";
import RoomList, { Room } from "@/components/room-list";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import ConnectPeerDialog from "@/components/connect-dialog";

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

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
    <SidebarProvider>
      <div className="h-svh w-full flex flex-col bg-background">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6 shrink-0 z-10 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Share2 className="h-8 w-8 text-primary"/>
              <h1 className="text-xl font-bold font-headline">PearChat</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Connected as <strong className="text-foreground">{currentUser}</strong>
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="" alt={currentUser || ''} />
                    <AvatarFallback>{currentUser.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar className="w-full md:w-80 lg:w-96 flex-col border-r bg-card/50 p-0" collapsible="offcanvas">
              <SidebarRail>R</SidebarRail>
              <SidebarContent className="p-2">
                <RoomList activeRoom={activeRoom} onSelectRoom={setActiveRoom} onConnectPeer={() => setIsConnectDialogOpen(true)} />
              </SidebarContent>
          </Sidebar>
          <main className="flex-1 flex flex-col overflow-hidden">
             <ChatArea room={activeRoom} />
          </main>
        </div>
      </div>
       <ConnectPeerDialog isOpen={isConnectDialogOpen} onClose={() => setIsConnectDialogOpen(false)} />
    </SidebarProvider>
  );
}
