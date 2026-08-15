"use client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RunPanel from "@/components/run/RunPanel";

export const Route = createFileRoute("/run-demo")({ component: RunDemo });

function RunDemo(){
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold">PNX Run Demo</h1>
          <p className="text-muted-foreground mt-2">This interactive demo simulates a live PNX run (searching, crawling, synthesizing).</p>
        </div>
        <RunPanel />
      </main>
      <SiteFooter />
    </div>
  )
}
