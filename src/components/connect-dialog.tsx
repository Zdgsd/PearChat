"use client";

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import QRCode from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, ScanLine, Wifi, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ConnectPeerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

enum ConnectionStep {
  Idle,
  ShowingOffer,
  ScanningOffer,
  ShowingAnswer,
  ScanningAnswer,
  Connected,
}

export default function ConnectPeerDialog({ isOpen, onClose }: ConnectPeerDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<ConnectionStep>(ConnectionStep.Idle);
  const [offer, setOffer] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRegionId = "qr-code-full-region";

  // Placeholder for WebRTC logic
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const resetState = () => {
    setStep(ConnectionStep.Idle);
    setOffer(null);
    setAnswer(null);
    if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
    }
    stopScanner();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = event => {
        if (event.candidate) {
            // In a real app with a signaling server, you'd send this candidate
        } else {
            if (pc.localDescription?.type === 'offer') {
                setOffer(JSON.stringify(pc.localDescription));
                setStep(ConnectionStep.ShowingOffer);
            } else if (pc.localDescription?.type === 'answer') {
                setAnswer(JSON.stringify(pc.localDescription));
                setStep(ConnectionStep.ShowingAnswer);
            }
        }
    };
    
    pc.ondatachannel = event => {
        const dataChannel = event.channel;
        dataChannel.onopen = () => {
            setStep(ConnectionStep.Connected);
            toast({ title: 'Success', description: 'Peer connected!', variant: 'default' });
            setTimeout(handleClose, 2000);
        };
        dataChannel.onmessage = (e) => console.log("Got message:", e.data);
    };

    peerConnectionRef.current = pc;
    return pc;
  }

  const createOffer = async () => {
    const pc = initializePeerConnection();
    const dataChannel = pc.createDataChannel("chat");
    dataChannel.onopen = () => {
       setStep(ConnectionStep.Connected);
       toast({ title: 'Success', description: 'Peer connected!', variant: 'default' });
       setTimeout(handleClose, 2000);
    };
    dataChannel.onmessage = (e) => console.log("Got message:", e.data);
    const sdpOffer = await pc.createOffer();
    await pc.setLocalDescription(sdpOffer);
  };
  
  const handleScannedOffer = async (decodedText: string) => {
    try {
        const pc = initializePeerConnection();
        const offerSdp = JSON.parse(decodedText);
        await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));
        const answerSdp = await pc.createAnswer();
        await pc.setLocalDescription(answerSdp);
        stopScanner();
    } catch (e) {
        toast({ variant: 'destructive', title: 'Invalid QR Code', description: 'Could not parse the connection offer.' });
        resetState();
    }
  }

  const handleScannedAnswer = async (decodedText: string) => {
    try {
        if(!peerConnectionRef.current) throw new Error("Peer connection not initialized");
        const answerSdp = JSON.parse(decodedText);
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answerSdp));
        stopScanner();
    } catch(e) {
        toast({ variant: 'destructive', title: 'Connection Failed', description: 'Could not apply the connection answer.' });
        resetState();
    }
  }

  const startScanner = (onScanSuccess: (decodedText: string, decodedResult: any) => void) => {
    const html5QrCode = new Html5Qrcode(scannerRegionId);
    scannerRef.current = html5QrCode;
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        (errorMessage) => {} // scan error callback
    ).catch(err => {
        toast({variant: 'destructive', title: 'Scanner Error', description: 'Could not start QR code scanner. Check camera permissions.'});
    });
  }

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner", err));
        scannerRef.current = null;
    }
  }

  useEffect(() => {
    if (isOpen && step === ConnectionStep.ScanningOffer) {
        startScanner(handleScannedOffer);
    }
    if (isOpen && step === ConnectionStep.ScanningAnswer) {
        startScanner(handleScannedAnswer);
    }
    return () => stopScanner();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isOpen]);


  const renderContent = () => {
    switch (step) {
      case ConnectionStep.ShowingOffer:
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <h3 className="font-semibold">1. Share this Offer</h3>
            <p className="text-sm text-muted-foreground">Let your peer scan this QR code to generate a response.</p>
            <div className="p-4 bg-white rounded-lg shadow-inner">
              <QRCode value={offer || ''} size={256} />
            </div>
            <Button onClick={() => setStep(ConnectionStep.ScanningAnswer)}>Scan Answer</Button>
          </div>
        );
      case ConnectionStep.ScanningAnswer:
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <h3 className="font-semibold">2. Scan their Answer</h3>
                <p className="text-sm text-muted-foreground">Scan the QR code your peer generated.</p>
                <div id={scannerRegionId} className="w-full h-64 rounded-lg bg-slate-900" />
            </div>
        );
      case ConnectionStep.ScanningOffer:
         return (
            <div className="flex flex-col items-center gap-4 text-center">
                <h3 className="font-semibold">Scan Peer's Offer</h3>
                <p className="text-sm text-muted-foreground">Use your camera to scan their QR code.</p>
                <div id={scannerRegionId} className="w-full h-64 rounded-lg bg-slate-900" />
            </div>
        );
       case ConnectionStep.ShowingAnswer:
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <h3 className="font-semibold">Return this Answer</h3>
            <p className="text-sm text-muted-foreground">Show this QR code to your peer to complete the connection.</p>
             <div className="p-4 bg-white rounded-lg shadow-inner">
                <QRCode value={answer || ''} size={256} />
             </div>
             <p className="text-sm text-muted-foreground animate-pulse">Waiting for peer to scan...</p>
          </div>
        );
      case ConnectionStep.Connected:
        return (
          <div className="flex flex-col items-center gap-4 text-center py-10">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h3 className="text-2xl font-bold font-headline">Connection Established!</h3>
            <p className="text-muted-foreground">You can now chat securely.</p>
          </div>
        );
      default: // Idle
        return (
          <div className="flex flex-col sm:flex-row gap-6 p-4">
            <div className="flex-1 flex flex-col items-center text-center gap-3 p-6 rounded-lg border bg-card/50">
                <QrCode className="w-10 h-10 text-primary" />
                <h3 className="font-headline font-semibold">Create Invite</h3>
                <p className="text-sm text-muted-foreground">Generate a QR code that another peer can scan to connect with you.</p>
                <Button onClick={createOffer}>Generate Offer</Button>
            </div>
            <div className="flex-1 flex flex-col items-center text-center gap-3 p-6 rounded-lg border bg-card/50">
                <ScanLine className="w-10 h-10 text-primary" />
                <h3 className="font-headline font-semibold">Scan Invite</h3>
                <p className="text-sm text-muted-foreground">Use your camera to scan a peer's QR code and initiate a connection.</p>
                <Button onClick={() => setStep(ConnectionStep.ScanningOffer)}>Scan Offer</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">Connect to Peer</DialogTitle>
          <DialogDescription className="text-center">
            Establish a secure P2P connection using QR codes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[300px] flex items-center justify-center">
            {renderContent()}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
