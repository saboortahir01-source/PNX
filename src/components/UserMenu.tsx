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
import { LogOut, Sparkles, Shield, Compass } from "lucide-react";

export const UserMenu: React.FC = () => {
  const { user, profile, openAuthModal, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openAuthModal("login")}
          className="px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition-colors cursor-pointer"
        >
          Sign In
        </button>
        <button
          onClick={() => openAuthModal("signup")}
          className="cta-glass !py-1.5 !px-3.5 !text-xs cursor-pointer"
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
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none cursor-pointer">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="size-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-800" />
          ) : (
            <div className="flex size-7 items-center justify-center rounded-full bg-[color:var(--brand)] text-[11px] font-bold text-white shadow-2xs">
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <DropdownMenuLabel className="p-2">
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{name}</p>
          <p className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400 truncate">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
        <DropdownMenuItem asChild>
          <Link to="/chat" className="flex items-center gap-2 cursor-pointer text-xs rounded-xl px-2.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <Compass className="size-3.5 text-zinc-400" />
            <span>My Workspace</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openAuthModal("onboarding")} className="flex items-center gap-2 cursor-pointer text-xs rounded-xl px-2.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
          <Sparkles className="size-3.5 text-zinc-400" />
          <span>Update Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/google-oauth-verification" className="flex items-center gap-2 cursor-pointer text-xs rounded-xl px-2.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <Shield className="size-3.5 text-zinc-400" />
            <span>Security & APIs</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex items-center gap-2 cursor-pointer text-xs text-red-600 dark:text-red-400 focus:text-red-600 rounded-xl px-2.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/40"
        >
          <LogOut className="size-3.5" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};