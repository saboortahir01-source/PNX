import React from 'react';

export default function StepItem({ step, status, eta, onRetry }: { step: string; status: 'pending'|'in_progress'|'success'|'failed'; eta?: number; onRetry?: ()=>void }){
  return (
    <div className="step-item flex items-center gap-3 p-3 rounded-md" role="group">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status==='success'? 'bg-emerald-100 text-emerald-700' : status==='failed'? 'bg-rose-100 text-rose-600' : status==='in_progress'? 'bg-sky-100 text-sky-600' : 'bg-muted'}`}>
        {status==='success' ? '✓' : status==='failed' ? '!' : status==='in_progress' ? '…' : '·' }
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{step}</div>
        <div className="text-xs text-muted-foreground">{status === 'in_progress' ? `Running • ETA ${eta ?? '–'}s` : status === 'success' ? 'Completed' : status === 'failed' ? 'Failed' : 'Pending' }</div>
      </div>
      {status==='failed' && <button className="btn-retry text-sm text-sky-600" onClick={onRetry}>Retry</button>}
    </div>
  )
}
