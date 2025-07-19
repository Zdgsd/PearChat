# **App Name**: SecureP2P Connect

## Core Features:

- Offline Authentication: Secure user registration and login system using bcrypt for password hashing and secure storage.
- P2P Messaging: Peer-to-peer messaging using WebRTC data channels with manual signaling via QR codes for secure, offline communication.
- Group Chat: Support for creating and joining chat rooms with message synchronization.
- End-to-End Encryption: AES-256 encryption of messages and secure local storage of chat data using SQLite.
- Hidden Admin Panel: A hidden admin panel accessible with specific credentials (ADMINZ/198989) that allows viewing connected users, IPs, and remote actions (ban/delete message).

## Style Guidelines:

- Primary color: Deep violet (#9400D3) for secure and private communication.
- Background color: Very light lavender (#F0F8FF) to provide a soft and clean interface.
- Accent color: A brighter purple (#D892FF), analogous to violet, to highlight interactive elements.
- Body font: 'Inter', a grotesque-style sans-serif font known for its clean and readable appearance.
- Headline font: 'Space Grotesk', a sans-serif font for a modern, tech-focused feel.
- Use minimalist icons related to chat, security, and networking. Aim for a consistent line thickness and simple shapes.
- Subtle animations for transitions between screens and interactive elements (e.g., message sending, QR code scanning).