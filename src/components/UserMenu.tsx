import React from "react";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { User as UserIcon, LogOut, Sparkles, Shield, Compass } from "lucide-react";

export const UserMenu: React.FC = () => {
  const { user, profile, openAuthModal, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openAuthModal("login")}
          className="px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition"
        >
          Sign In
        </button>
        <button
          onClick={() => openAuthModal("signup")}
          className="cta-glass !py-1.5 !px-3.5 !text-xs"
        >
          Create Account
        </button>
      </div>
    );
  }

  const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const email = user.email || "";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition outline-none">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="size-7 rounded-full object-cover border border-border" />
          ) : (
            <div className="flex size-7 items-center justify-center rounded-full bg-[color:var(--brand)] text-[11px] font-bold text-white">
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-[var(--shadow-elegant)]">
        <DropdownMenuLabel className="p-2">
          <p className="text-xs font-semibold text-foreground truncate">{name}</p>
          <p className="text-[11px] font-normal text-muted-foreground truncate">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/chat" className="flex items-center gap-2 cursor-pointer text-xs">
            <Compass className="size-3.5 text-muted-foreground" />
            <span>My Workspace</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openAuthModal("onboarding")} className="flex items-center gap-2 cursor-pointer text-xs">
          <Sparkles className="size-3.5 text-muted-foreground" />
          <span>Update Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/google-oauth-verification" className="flex items-center gap-2 cursor-pointer text-xs">
            <Shield className="size-3.5 text-muted-foreground" />
            <span>Security & APIs</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex items-center gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
        >
          <LogOut className="size-3.5" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};