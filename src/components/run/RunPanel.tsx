"use client";
import React, { useEffect, useState } from 'react';
import StepItem from './StepItem';
import ResultCard from './ResultCard';
import EvidenceDrawer from './EvidenceDrawer';

const STEPS = [
  'Parse Input',
  'Crawl Page (rendered DOM)',
  'Snapshot SERP',
  'Fetch Search Console',
  'Run Lighthouse & CWV',
  'Synthesize Recommendations',
  'Draft Tasks'
];

export default function RunPanel(){
  const [stepStatus, setStepStatus] = useState(STEPS.map(s=>({ step:s, status:'pending', eta:0 })));
  const [results, setResults] = useState<any[]>([]);
  const [running, setRunning] = useState(false);
  const [evidence, setEvidence] = useState<any|undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(()=>{
    return () => {};
  },[]);

  function startMockRun(){
    setRunning(true);
    setResults([]);
    setEvidence(undefined);
    // sequence
    let time = 0;
    STEPS.forEach((s, i)=>{
      const start = 1000 + i*1200;
      setTimeout(()=>{
        setStepStatus(prev=>{
          const copy = [...prev]; copy[i] = { step:s, status:'in_progress', eta: Math.floor((i+1)*3) }; return copy;
        });
      }, start);

      // completion
      setTimeout(()=>{
        setStepStatus(prev=>{ const copy=[...prev]; copy[i] = { step:s, status:'success', eta:0 }; return copy; });

        // emit partial results on certain steps
        if(s.includes('Crawl')){
          setResults(r=>[...r,{ id:'r1', title:'Content audit', why:'H1 is brand-first and lacks target keyword', confidence:78, meta:'Crawl • 1 source', evidence:{ snapshotId:'snap-1', sources:['crawl'], notes:'H1: "Our brand — best bikes"' } }]);
        }
        if(s.includes('SERP')){
          setResults(r=>[...r,{ id:'r2', title:'SERP insight', why:'Top results favor longer how-to sections', confidence:84, meta:'SERP • 8 sources', evidence:{ snapshotId:'serp-1', sources:['serp'], notes:'Top 5 pages include long how-to sections' } }]);
          setEvidence({ snapshotId:'serp-1', sources:['serp','crawl'], notes:'SERP and crawl combined evidence.' });
        }
        if(s.includes('Synthesize')){
          setResults(r=>[...r,{ id:'r3', title:'Top fix', why:'Improve H1 to match intent and add TOC', confidence:80, meta:'Synthesis • 5 sources', evidence:{ snapshotId:'synth-1', sources:['serp','crawl','sconsole'], notes:'Recommendation synthesized.' } }]);
        }

        if(i===STEPS.length-1){
          setRunning(false);
        }
      }, start + 900);
    });
  }

  function retryStep(index:number){
    // simple retry: toggle to in_progress then success
    setStepStatus(prev=>{ const c=[...prev]; c[index]={...c[index], status:'in_progress'}; return c; });
    setTimeout(()=>{ setStepStatus(prev=>{ const c=[...prev]; c[index]={...c[index], status:'success'}; return c; }); }, 1200);
  }

  return (
    <div className="run-panel max-w-6xl mx-auto p-6">
      <div className="agent-status-bar flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold">PNX — Analyzing</div>
          <div className="text-xs text-muted-foreground">{running ? 'Live run' : 'Idle'}</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="cta-glass" onClick={startMockRun}>Start mock run</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="p-4 bg-white rounded-lg border">
            <div className="stepper space-y-2">
              {stepStatus.map((s,i)=> (
                <div key={s.step}><StepItem step={s.step} status={s.status as any} eta={s.eta as any} onRetry={()=>retryStep(i)} /></div>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {results.map(r=> (
              <ResultCard key={r.id} title={r.title} why={r.why} confidence={r.confidence} meta={r.meta} onView={()=>{ setEvidence(r.evidence); setDrawerOpen(true); }} />
            ))}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="glass-card p-4">
            <div className="text-sm font-semibold">Run Summary</div>
            <div className="text-xs text-muted-foreground mt-2">Steps: {STEPS.length} • Results: {results.length}</div>
            <div className="mt-4">
              <button className="cta-glass w-full" onClick={()=>{ if(evidence) setDrawerOpen(true); }}>View last evidence</button>
            </div>
          </div>
        </aside>
      </div>

      <EvidenceDrawer open={drawerOpen} evidence={evidence} onClose={()=>setDrawerOpen(false)} />
    </div>
  )
}
