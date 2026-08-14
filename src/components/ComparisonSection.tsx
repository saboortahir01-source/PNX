"use client";

import React from "react";
import pnxLogo from "@/assets/pnx-logo.png";
import semrushLogo from "@/assets/semrush-logo.svg";

export default function ComparisonSection() {
  const prompt = `“Why is my SaaS page still stuck on page 2 even after I fixed the SEO basics?”`;

  return (
    <div className="mx-auto max-w-[1200px] px-4">
      <h2 className="text-center text-2xl font-semibold">See the Difference</h2>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-7" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Semrush Card */}
        <div className="rounded-[18px] bg-[#0f0f10] text-white p-8 flex flex-col items-center justify-start" style={{ minHeight: 420 }}>
          <div className="flex flex-col items-center mt-2">
            <img src={semrushLogo} alt="Semrush" className="w-44 h-auto object-contain" />
          </div>

          <div className="mt-8 w-3/4">
            <div className="bg-white/8 text-white rounded-full px-4 py-2 mx-auto text-sm text-center max-w-[100%] leading-snug">
              {prompt}
            </div>
          </div>

          <div className="mt-10 w-3/4 flex items-center gap-3">
            <img src="/favicon.png" alt="Semrush small mark" className="w-6 h-6 object-contain opacity-90 rounded" />
            <div className="text-[16px] leading-snug">
              Check keyword difficulty, ranking competitors, backlinks, on-page issues and SERP features to identify what may be holding the page back.
            </div>
          </div>
        </div>

        {/* PNX Card */}
        <div className="rounded-[18px] bg-white text-slate-900 p-8 flex flex-col items-center justify-start border border-border" style={{ minHeight: 420 }}>
          <div className="flex flex-col items-center mt-2">
            <img src={pnxLogo} alt="PNX" className="w-28 h-auto object-contain" />
          </div>

          <div className="mt-8 w-3/4">
            <div className="bg-slate-100 rounded-full px-4 py-2 mx-auto text-sm text-center max-w-[100%] leading-snug">
              {prompt}
            </div>
          </div>

          <div className="mt-10 w-3/4 flex items-center gap-3">
            <img src={pnxLogo} alt="PNX small" className="w-6 h-6 object-contain rounded" />
            <div className="text-[16px] leading-snug">
              Because the problem may not be your SEO checklist at all. I’d compare the page-one winners against your page first — then expose the one gap that’s actually keeping you out.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
