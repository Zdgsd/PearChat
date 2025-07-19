"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { MessageSquare, QrCode } from "lucide-react";
import ConnectPeerDialog from "./connect-dialog";
import { Input } from "./ui/input";
import { Paperclip, Send } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Room } from "./room-list";

type ChatAreaProps = {
    room: Room | null;
}

export default function ChatArea({ room }: ChatAreaProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  
  // This is a placeholder. In a real app, this would come from the connection.
  const messages = [
      { id: 1, sender: "Alice", text: "Hey there!", timestamp: "10:30 AM", isMe: false },
      { id: 2, sender: "You", text: "Hey! How's it going?", timestamp: "10:31 AM", isMe: true },
      { id: 3, sender: "Alice", text: "Going great! Just setting up this new P2P chat app. It's pretty cool.", timestamp: "10:31 AM", isMe: false },
      { id: 4, sender: "You", text: "Yeah, I agree. The room feature is neat.", timestamp: "10:32 AM", isMe: true },
  ];
  const currentUser = "You";


  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-muted bg-card/50 p-8 text-center">
        <>
          <div className="mb-4 flex items-center justify-center rounded-full bg-primary/10 p-4">
             <MessageSquare className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-headline tracking-tight">
            Select a room to start chatting
          </h2>
          <p className="max-w-md mx-auto mt-2 text-muted-foreground">
            Join a room or create a new one to begin a secure conversation. Your messages are end-to-end encrypted.
          </p>
        </>
      </div>
    );
  }

  return (
      <div className="flex-1 flex flex-col h-full rounded-lg border bg-card/50">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center gap-4">
              <Avatar>
                  <AvatarFallback>{room.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold">{room.name}</h2>
                <p className="text-sm text-muted-foreground">{room.type === 'public' ? 'Public Room' : 'Private Room'}</p>
              </div>
          </div>
          
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                  {messages.map((msg) => (
                      <div key={msg.id} className={cn("flex items-end gap-2", msg.isMe ? "justify-end" : "justify-start")}>
                          {!msg.isMe && (
                              <Avatar className="h-8 w-8">
                                  <AvatarImage src={`https://i.pravatar.cc/150?u=${msg.sender}`} />
                                  <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                              </Avatar>
                          )}
                          <div className={cn(
                              "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2",
                              msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                          )}>
                              <p className="text-sm">{msg.text}</p>
                              <p className="text-xs mt-1 text-right opacity-70">{msg.timestamp}</p>
                          </div>
                           {msg.isMe && (
                              <Avatar className="h-8 w-8">
                                   <AvatarImage src={`https://i.pravatar.cc/150?u=${currentUser}`} />
                                  <AvatarFallback>{currentUser.charAt(0)}</AvatarFallback>
                              </Avatar>
                          )}
                      </div>
                  ))}
              </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="p-4 border-t">
              <div className="relative">
                  <Input placeholder="Type your message..." className="pr-20" />
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                          <Paperclip className="h-5 w-5" />
                      </Button>
                       <Button size="icon">
                          <Send className="h-5 w-5" />
                      </Button>
                  </div>
              </div>
          </div>
      </div>
  )
}
