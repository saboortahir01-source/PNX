import React from 'react';

export default function EvidenceDrawer({ open, evidence, onClose }:{ open:boolean; evidence?:any; onClose:()=>void }){
  if(!open) return null;
  return (
    <div className="evidence-drawer fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-[420px] bg-white border-l p-4 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Evidence</h3>
          <button onClick={onClose} aria-label="Close">Close</button>
        </div>
        {!evidence && <div className="text-sm text-muted-foreground">No evidence yet.</div>}
        {evidence && (
          <div className="space-y-3 text-sm">
            <div><strong>Snapshot:</strong> {evidence.snapshotId}</div>
            <div><strong>Sources:</strong> {evidence.sources?.join(', ')}</div>
            <div className="mt-2"><strong>Notes:</strong></div>
            <pre className="text-xs bg-muted p-2 rounded">{evidence.notes}</pre>
          </div>
        )}
      </aside>
    </div>
  )
}
