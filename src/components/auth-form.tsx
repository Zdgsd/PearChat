"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, LogIn, UserPlus, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "./logo";
import { login, register, adminLogin } from "@/lib/auth";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters.").max(50),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type AuthFormProps = {
  mode: "login" | "register" | "admin";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // Use a small timeout to allow UI to update before blocking the thread
    setTimeout(() => {
      try {
        if (mode === 'admin') {
          const success = adminLogin(values.username, values.password);
          if (success) {
            toast({ title: "Admin access granted." });
            router.push("/admin/dashboard");
            router.refresh(); // Ensure the page reloads to check auth state
          } else {
             throw new Error("Invalid admin credentials.");
          }
        } else if (mode === "register") {
          register(values.username, values.password);
          toast({ title: "Success", description: "Registration successful. Please log in." });
          router.push("/");
        } else { // mode === "login"
          const success = login(values.username, values.password);
          if (success) {
            toast({ title: "Welcome back!" });
            router.push("/chat");
            router.refresh();
          } else {
            throw new Error("Invalid username or password.");
          }
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  const titles = {
    login: {
      title: "Welcome Back",
      description: "Log in to access your secure messages.",
      button: "Login",
      icon: <LogIn className="mr-2 h-4 w-4" />,
    },
    register: {
      title: "Create Account",
      description: "Join PearChat to start messaging securely.",
      button: "Register",
      icon: <UserPlus className="mr-2 h-4 w-4" />,
    },
    admin: {
      title: "Admin Access",
      description: "Enter credentials for the admin panel.",
      button: "Enter",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
  };

  const { title, description, button, icon } = titles[mode];

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Logo className="w-16 h-16" />
        </div>
        <CardTitle className="text-3xl font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your_username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : <>{icon} {button}</>}
            </Button>
            {mode === "login" && (
              <p className="text-sm text-muted-foreground">
                No account?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Register here
                </Link>
              </p>
            )}
            {mode === "register" && (
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/" className="font-semibold text-primary hover:underline">
                  Login here
                </Link>
              </p>
            )}
             {mode === 'admin' && (
               <p className="text-sm text-muted-foreground">
                 Not an admin?{' '}
                 <Link href="/" className="font-semibold text-primary hover:underline">
                   Go to user login
                 </Link>
               </p>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
