
import AuthForm from "@/components/auth-form";
import { Share2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background/90 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.3),rgba(255,255,255,0))]">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="h-4 w-4" /> Go back to PearChat
        </Link>
      </div>
      <AuthForm mode="admin" />
    </main>
  );
}
