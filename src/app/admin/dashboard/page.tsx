"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminUser, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, Globe, Ban, Trash2, LogOut } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data, in a real P2P app this would be dynamically populated
// from the admin's own peer connections.
const mockConnectedUsers = [
  { id: "user-1", username: "Alice", ip: "192.168.1.101", connectedAt: new Date() },
  { id: "user-2", username: "Bob", ip: "192.168.1.102", connectedAt: new Date(Date.now() - 5 * 60000) },
  { id: "user-3", username: "Charlie", ip: "192.168.1.103", connectedAt: new Date(Date.now() - 15 * 60000) },
];


export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<string | null>(null);

  useEffect(() => {
    const user = getAdminUser();
    if (!user) {
      router.replace("/admin");
    } else {
      setAdminUser(user);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace("/admin");
  };

  if (!adminUser) {
    return <div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-slate-900 px-6">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold font-headline">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, <strong className="text-foreground">{adminUser}</strong></span>
          <Button onClick={handleLogout} variant="destructive" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Connected Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{mockConnectedUsers.length}</div>
                    <p className="text-xs text-muted-foreground">Currently active P2P sessions</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Network Status</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">Healthy</div>
                    <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage users currently connected to your session.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead className="hidden md:table-cell">IP Address</TableHead>
                        <TableHead className="hidden sm:table-cell">Connected Since</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockConnectedUsers.map(user => (
                         <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.username}`} />
                                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{user.username}</div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell font-mono">{user.ip}</TableCell>
                            <TableCell className="hidden sm:table-cell text-muted-foreground">{user.connectedAt.toLocaleString()}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="icon" className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10">
                                    <Ban className="h-4 w-4" />
                                    <span className="sr-only">Ban User</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete Messages</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
