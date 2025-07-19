import AuthForm from "@/components/auth-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-900">
      <AuthForm mode="admin" />
    </main>
  );
}