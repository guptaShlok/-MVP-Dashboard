"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Folder, Plus, LogOut, Mail } from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          Production Optimizer
        </h1>
        <p className="text-xs text-muted-foreground mt-2">{user?.username}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard">
          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Overview
          </Button>
        </Link>
        <Link href="/dashboard/resources">
          <Button
            variant={isActive("/dashboard/resources") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <Folder className="w-4 h-4 mr-2" />
            Resources
          </Button>
        </Link>
        <Link href="/dashboard/create-request">
          <Button
            variant={
              isActive("/dashboard/create-request") ? "default" : "ghost"
            }
            className="w-full justify-start"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="p-3 rounded-md bg-sidebar-accent/10 text-xs text-muted-foreground">
          <div className="font-medium text-sidebar-foreground mb-1 flex items-center">
            <Mail className="w-3 h-3 mr-2" />
            Contact
          </div>
          <p>support@example.com</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start bg-transparent"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
