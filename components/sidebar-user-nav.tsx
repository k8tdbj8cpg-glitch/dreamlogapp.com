"use client";

import type { User } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignOutForm } from "@/components/sign-out-form";

export function SidebarUserNav({ user }: { user: User }) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly" }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              <Avatar className="h-6 w-6 rounded-full">
                <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
                <AvatarFallback className="rounded-full">
                  {(user.email ?? user.name ?? "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{user.email}</span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-popper-anchor-width]"
            side="top"
          >
            {user.type === "guest" && (
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => signIn()}
              >
                Sign In
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={isUpgrading}
              onSelect={handleUpgrade}
            >
              {isUpgrading ? "Redirecting…" : "Upgrade to Premium"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <SignOutForm />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
