
import AuthForm from "@/components/auth-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.3),rgba(255,255,255,0))]">
      <AuthForm mode="admin" />
    </main>
  );
}
