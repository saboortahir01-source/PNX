import React from 'react';

export default function ResultCard({ title, why, confidence, meta, onView }:{ title:string; why:string; confidence:number; meta?:string; onView?:()=>void }){
  return (
    <div className="result-card glass-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground mt-1">{why}</div>
        </div>
        <div className="text-right">
          <div className="text-xs">Confidence</div>
          <div className="font-semibold">{confidence}%</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{meta}</div>
        <div>
          <button className="cta-glass px-3 py-1 text-sm" onClick={onView}>View evidence</button>
        </div>
      </div>
    </div>
  )
}
