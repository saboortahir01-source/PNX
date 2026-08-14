"use client";

import React from "react";
import pnxLogo from "@/assets/pnx-logo.png";
import semrushLogo from "@/assets/semrush-logo.svg";

export default function ComparisonSection() {
  const prompt = `“Why is my SaaS page still stuck on page 2 even after I fixed the SEO basics?”`;

  return (
    <div className="mx-auto max-w-[1200px] px-4">
      <h2 className="text-center text-2xl font-semibold">See the Difference</h2>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-7" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Semrush Card */}
        <div className="rounded-[18px] bg-[#0f0f10] text-white p-6 flex flex-col items-center text-center" aria-label="Semrush card">
          <div className="w-full flex justify-center pt-2">
            <img src={semrushLogo} alt="Semrush" className="w-32 h-auto object-contain" />
          </div>

          <div className="mt-6 w-2/3">
            <div className="bg-white/12 text-white rounded-full px-4 py-3 mx-auto text-sm leading-tight">
              {prompt}
            </div>
          </div>

          <div className="mt-5 w-2/3 flex items-start gap-3">
            <img src={semrushLogo} alt="Semrush mark" className="w-5 h-5 object-contain mt-1" />
            <div className="text-[16px] leading-snug">
              Check keyword difficulty, ranking competitors, backlinks, on-page issues and SERP features to identify what may be holding the page back.
            </div>
          </div>
        </div>

        {/* PNX Card */}
        <div className="rounded-[18px] bg-white text-slate-900 p-6 flex flex-col items-center text-center border border-border" aria-label="PNX card">
          <div className="w-full flex justify-center pt-2">
            <img src={pnxLogo} alt="PNX" className="w-28 h-auto object-contain" />
          </div>

          <div className="mt-6 w-2/3">
            <div className="bg-slate-100 rounded-full px-4 py-3 mx-auto text-sm leading-tight">
              {prompt}
            </div>
          </div>

          <div className="mt-5 w-2/3 flex items-start gap-3">
            <img src={pnxLogo} alt="PNX small" className="w-5 h-5 object-contain mt-1" />
            <div className="text-[16px] leading-snug">
              Because the problem may not be your SEO checklist at all. I’d compare the page-one winners against your page first — then expose the one gap that’s actually keeping you out.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
