"use client";

import React from "react";
import { Link } from "@tanstack/react-router";
import agentSvgRaw from "@/assets/agent-visual-anim.svg?raw";
import pnxLogo from "@/assets/pnx-logo.png";
import { ShieldCheck } from "lucide-react";

export default function HeroV2() {
  return (
    <section className="hero-v2">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-inner mx-auto max-w-7xl px-6 py-14 lg:py-24">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="font-medium">100% Free · No limits</span>
            </div>

            <h1 className="hero-title">
              Your SEO work.
              <br />
              <span className="hero-accent">One intelligent agent.</span>
            </h1>

            <p className="hero-lead">
              Research, audit and optimize — hand PNX a question, URL or topic and it returns prioritized,
              evidence-backed tasks you can run.
            </p>

            <div className="hero-ctas">
              <Link to="/chat" className="cta-glass hero-cta" aria-label="Start PNX with a URL">Start with a URL</Link>
              <a href="#demo" className="hero-demo link-muted">See demo</a>
            </div>

            <div className="hero-prompts" aria-hidden>
              <button className="chip">Why is this page not ranking?</button>
              <button className="chip">Find keyword opportunities</button>
              <button className="chip">Audit this page — top fixes</button>
            </div>

            <div className="hero-note text-sm text-muted-foreground mt-4">
              <strong>Human-first:</strong> PNX explains recommendations with sources, confidence and exact steps.
            </div>
          </div>

          <div className="hero-right">
            <div className="agent-shell glass-card">
              <div className="agent-top">
                <img src={pnxLogo} alt="PNX" width={44} height={44} className="pnx-logo" />
                <div className="agent-meta">
                  <div className="agent-title">PNX</div>
                  <div className="agent-sub">Analyzing · 7 sources</div>
                </div>
              </div>
              <div className="agent-viz" aria-hidden>
                <div dangerouslySetInnerHTML={{ __html: agentSvgRaw }} />
              </div>

              <div className="agent-outs">
                <div className="out-card">
                  <div className="o-title">Top fix</div>
                  <div className="o-body">Improve H1 to target 'commuter bike' intent</div>
                  <div className="o-meta">Sources · SERP snapshot · Aug 12</div>
                </div>
                <div className="out-card">
                  <div className="o-title">Keyword</div>
                  <div className="o-body">Opportunity: "best commuter ebike" — KD 22</div>
                  <div className="o-meta">Search volume · 1.3k</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
