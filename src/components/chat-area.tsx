
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { MessageSquare, Paperclip, Send, File as FileIcon, Share2 } from "lucide-react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Room } from "./room-list";
import { getCurrentUser } from "@/lib/auth";
import Image from "next/image";

type Message = {
    id: number;
    sender: string;
    text?: string;
    attachment?: {
      name: string;
      type: 'image' | 'file';
      url: string;
    };
    timestamp: string;
    isMe: boolean;
};

type ChatAreaProps = {
    room: Room | null;
}

export default function ChatArea({ room }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = getCurrentUser() || "You";
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (room) {
      const storedMessages = localStorage.getItem(`messages_${room.id}`);
      setMessages(storedMessages ? JSON.parse(storedMessages) : []);
    } else {
        setMessages([]);
    }
  }, [room]);
  
  useEffect(() => {
      if (scrollViewportRef.current) {
          scrollViewportRef.current.scrollTo({ top: scrollViewportRef.current.scrollHeight, behavior: 'smooth' });
      }
  }, [messages]);

  const addMessage = (message: Message) => {
    if (!room) return;
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${room.id}`, JSON.stringify(updatedMessages));
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !room) return;

    const message: Message = {
      id: Date.now(),
      sender: currentUser,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    
    addMessage(message);
    setNewMessage("");
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !room) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const message: Message = {
        id: Date.now(),
        sender: currentUser,
        attachment: {
          name: file.name,
          type: file.type.startsWith("image/") ? 'image' : 'file',
          url: url,
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      };
      addMessage(message);
    };
    reader.readAsDataURL(file);

    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };


  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-transparent">
        <div className="mb-4 flex items-center justify-center rounded-full bg-primary/10 p-5">
           <Share2 className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold font-headline tracking-tight">
          Welcome to PearChat
        </h2>
        <p className="max-w-md mx-auto mt-2 text-muted-foreground">
          Select a room, create a new one, or connect with a peer to begin a secure P2P conversation.
        </p>
      </div>
    );
  }

  return (
      <div className="flex flex-col h-full bg-transparent">
          <div className="p-4 border-b flex items-center gap-4 shrink-0 bg-card/50 backdrop-blur-sm">
              <Avatar>
                  <AvatarFallback>{room.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold">{room.name}</h2>
                <p className="text-sm text-muted-foreground">{room.type === 'public' ? 'Public Room' : 'Private Room'}</p>
              </div>
          </div>
          
          <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
              <div className="p-4 space-y-4">
                  {messages.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                        <MessageSquare className="h-10 w-10 mb-4" />
                        <h3 className="font-semibold">It's quiet in here...</h3>
                        <p className="text-sm">Be the first to send a message!</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                      <div key={msg.id} className={cn("flex items-end gap-2", msg.isMe ? "justify-end" : "justify-start")}>
                          {!msg.isMe && (
                              <Avatar className="h-8 w-8">
                                  <AvatarImage src="" />
                                  <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                              </Avatar>
                          )}
                          <div className={cn(
                              "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-3 py-2",
                              msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                          )}>
                              {msg.text && <p className="text-sm break-words">{msg.text}</p>}
                              {msg.attachment && (
                                <div className="space-y-2">
                                  {msg.attachment.type === 'image' ? (
                                    <Image 
                                      src={msg.attachment.url} 
                                      alt={msg.attachment.name}
                                      width={250}
                                      height={250}
                                      className="rounded-md object-cover"
                                    />
                                  ) : (
                                    <a 
                                      href={msg.attachment.url} 
                                      download={msg.attachment.name}
                                      className="flex items-center gap-2 p-2 rounded-md bg-background/20 hover:bg-background/40 transition-colors"
                                    >
                                      <FileIcon className="h-6 w-6 shrink-0" />
                                      <span className="text-sm font-medium truncate">{msg.attachment.name}</span>
                                    </a>
                                  )}
                                </div>
                              )}
                              <p className="text-xs mt-1 text-right opacity-70">{msg.timestamp}</p>
                          </div>
                           {msg.isMe && (
                              <Avatar className="h-8 w-8">
                                   <AvatarImage src="" />
                                  <AvatarFallback>{currentUser.charAt(0)}</AvatarFallback>
                              </Avatar>
                          )}
                      </div>
                  ))}
              </div>
          </ScrollArea>
          
          <div className="p-4 border-t shrink-0 bg-card/50 backdrop-blur-sm">
              <form onSubmit={handleSendMessage} className="relative">
                  <Input 
                    placeholder="Type your message..." 
                    className="pr-20" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                      <Button type="button" variant="ghost" size="icon" onClick={handleAttachmentClick}>
                          <Paperclip className="h-5 w-5" />
                          <span className="sr-only">Attach file</span>
                      </Button>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                       <Button type="submit" size="icon">
                          <Send className="h-5 w-5" />
                          <span className="sr-only">Send message</span>
                      </Button>
                  </div>
              </form>
          </div>
      </div>
  )
}
