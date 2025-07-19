import AuthForm from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <AuthForm mode="register" />
    </main>
  );
}
