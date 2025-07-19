"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Search, Lock, Users, Share2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";

export type Room = {
  id: string;
  name: string;
  type: "public" | "private";
};

// Mock data
const mockRooms: Room[] = [
  { id: "room-1", name: "General Chat", type: "public" },
];

type RoomListProps = {
  onSelectRoom: (room: Room) => void;
  activeRoom: Room | null;
  onConnectPeer: () => void;
};

export default function RoomList({ onSelectRoom, activeRoom, onConnectPeer }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roomName = formData.get("roomName") as string;
    const roomType = formData.get("roomType") as "public" | "private";
    const password = formData.get("password") as string;

    if (!roomName) {
      toast({ variant: "destructive", title: "Error", description: "Room name is required." });
      return;
    }
    if (roomType === "private" && !password) {
      toast({ variant: "destructive", title: "Error", description: "Password is required for private rooms." });
      return;
    }

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: roomName,
      type: roomType,
    };

    setRooms([newRoom, ...rooms]);
    toast({ title: "Room Created!", description: `"${roomName}" has been created.` });
    setIsCreateDialogOpen(false);
    onSelectRoom(newRoom);
  };

  return (
    <div className="flex flex-col h-full">
      <SidebarHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold font-headline">Rooms</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create or Join a Room</DialogTitle>
                <DialogDescription>
                  Create a new chat room or join an existing one by name.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="create">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="join">Join</TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                  <form onSubmit={handleCreateRoom}>
                    <CreateRoomForm />
                    <DialogFooter className="mt-4">
                      <Button type="submit">Create Room</Button>
                    </DialogFooter>
                  </form>
                </TabsContent>
                <TabsContent value="join">
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="join-room-name">Room Name</Label>
                      <Input id="join-room-name" placeholder="Exact room name..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="join-password">Password (if any)</Label>
                      <Input id="join-password" type="password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => toast({title: "Not Implemented", description: "Joining rooms will be available soon."})}>Join Room</Button>
                  </DialogFooter>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search rooms..." className="pl-8" />
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel>Your Rooms</SidebarGroupLabel>
          <SidebarMenu>
            {rooms.map((room) => (
              <SidebarMenuItem key={room.id}>
                <button
                  className={cn(
                      "w-full text-left p-2 flex items-center gap-4 rounded-lg hover:bg-muted transition-colors",
                      activeRoom?.id === room.id && "bg-muted"
                  )}
                  onClick={() => onSelectRoom(room)}
                >
                  <Avatar>
                    <AvatarFallback>{room.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-semibold truncate">{room.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                        {room.type === 'private' ? <Lock className="h-3 w-3 mr-1" /> : <Users className="h-3 w-3 mr-1" />}
                        {room.type === 'private' ? 'Private' : 'Public'}
                    </div>
                  </div>
                </button>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <div className="flex justify-center p-4">
            <Button variant="outline" size="icon">R</Button>
        </div>
      </ScrollArea>
      <SidebarFooter>
        <Button onClick={onConnectPeer}>
            <Share2 className="mr-2 h-4 w-4" />
            Connect to a Peer
        </Button>
      </SidebarFooter>
    </div>
  );
}


function CreateRoomForm() {
    const [roomType, setRoomType] = useState<"public" | "private">("public");
    
    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input id="roomName" name="roomName" placeholder="My awesome chat room" />
            </div>
            <div className="space-y-2">
                <Label>Room Type</Label>
                <RadioGroup name="roomType" defaultValue="public" onValueChange={(value: "public" | "private") => setRoomType(value)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="r-public" />
                        <Label htmlFor="r-public">Public</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="r-private" />
                        <Label htmlFor="r-private">Private</Label>
                    </div>
                </RadioGroup>
            </div>
            {roomType === "private" && (
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" />
                </div>
            )}
        </div>
    )
}
