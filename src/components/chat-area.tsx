"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { QrCode, WifiOff } from "lucide-react";
import ConnectPeerDialog from "./connect-dialog";

export default function ChatArea() {
  const [isConnecting, setIsConnecting] = useState(false);

  // This is a placeholder. In a real app, you would have logic to determine
  // if you are connected to a peer.
  const isConnected = false; 

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-muted bg-card/50 p-8 text-center">
      {isConnected ? (
        // This part will be shown when a peer is connected.
        // For now, it's unreachable to focus on the connection flow.
        <div>
          <h2 className="text-2xl font-bold">Chatting with Peer</h2>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-center rounded-full bg-primary/10 p-4">
             <QrCode className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-headline tracking-tight">
            Ready for a secure chat?
          </h2>
          <p className="max-w-md mx-auto mt-2 text-muted-foreground">
            Establish a direct, end-to-end encrypted connection with another peer by scanning a QR code. No servers, no logs.
          </p>
          <Button onClick={() => setIsConnecting(true)} className="mt-6">
            Connect to a Peer
          </Button>

          <ConnectPeerDialog
            isOpen={isConnecting}
            onClose={() => setIsConnecting(false)}
          />
        </>
      )}
    </div>
  );
}
