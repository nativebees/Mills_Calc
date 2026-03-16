<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mills Act Tax Calculator — Stella</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0B0F19;--surface:#111827;--border:#1F2937;--border2:#374151;--text:#E5E7EB;--muted:#9CA3AF;--dim:#6B7280;--gold:#D4A054;--green:#10B981;--red:#EF4444;--blue:#3B82F6;--purple:#8B5CF6}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif}
button{font-family:inherit;cursor:pointer}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--surface)}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}

.header{background:linear-gradient(135deg,#111827,#1a1a2e);border-bottom:1px solid #D4A05440;padding:20px 24px 0}
.logo-row{display:flex;align-items:center;gap:12px;margin-bottom:4px}
.logo{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#D4A054,#B8860B);font-size:18px;font-weight:700;font-family:'Space Mono',monospace;color:#111827}
.title{font-size:18px;font-weight:700;letter-spacing:-0.02em}
.subtitle{font-size:11px;color:var(--gold);font-family:'Space Mono',monospace}
.meta{font-size:10px;color:var(--dim);margin-top:8px}
.tabs{display:flex;gap:2px;margin-top:14px;flex-wrap:wrap}
.tab{padding:8px 14px;font-size:11px;font-family:'Space Mono',monospace;background:transparent;color:var(--dim);border:1px solid transparent;border-bottom:none;border-radius:6px 6px 0 0;transition:all .2s;font-weight:400}
.tab.active{background:#D4A05420;color:var(--gold);border-color:#D4A05440;font-weight:700}

.content{padding:20px 24px;max-width:1200px;margin:0 auto}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.grid6{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px}
.panel{background:var(--surface);border-radius:10px;padding:16px;border:1px solid var(--border)}
.panel-gold{border-color:#D4A05430}
.panel-blue{border-color:#3B82F630}
.panel-purple{border-color:#8B5CF630}
.chart-panel{background:var(--surface);border-radius:12px;border:1px solid var(--border);padding:20px 20px 12px;margin-bottom:24px}

.stat{border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:2px;min-width:0}
.stat-label{font-size:10px;color:var(--muted);letter-spacing:0.05em;text-transform:uppercase}
.stat-value{font-size:22px;font-family:'Space Mono',monospace;font-weight:700;letter-spacing:-0.02em}
.stat-sub{font-size:10px;color:var(--dim)}
.stat-gold{background:#D4A05410;border:1px solid #D4A05440}.stat-gold .stat-value{color:var(--gold)}
.stat-green{background:#10B98110;border:1px solid #10B98140}.stat-green .stat-value{color:var(--green)}
.stat-red{background:#EF444410;border:1px solid #EF444440}.stat-red .stat-value{color:var(--red)}
.stat-blue{background:#3B82F610;border:1px solid #3B82F640}.stat-blue .stat-value{color:var(--blue)}
.stat-neutral{background:#374151;border:1px solid #4B5563}.stat-neutral .stat-value{color:var(--text)}

.section-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);padding-bottom:8px}
.section-title span{font-size:16px}

.slider-group{margin-bottom:16px}
.slider-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}
.slider-label{font-size:12px;color:var(--muted);letter-spacing:0.02em}
.slider-value{font-size:14px;font-family:'Space Mono',monospace;font-weight:700}
.slider-sub{font-size:10px;color:var(--dim);margin-bottom:4px}
.slider-track{position:relative;height:6px;border-radius:3px;background:var(--border)}
.slider-fill{position:absolute;height:100%;border-radius:3px;transition:width .1s}
.slider-thumb{position:absolute;top:-3px;width:12px;height:12px;border-radius:50%;border:2px solid var(--surface);transition:left .1s;pointer-events:none}
.slider-input{position:absolute;top:-6px;left:0;width:100%;height:18px;opacity:0;cursor:pointer;-webkit-appearance:none}

.toggle-row{display:flex;border-radius:6px;overflow:hidden;border:1px solid var(--border2);margin-bottom:16px}
.toggle-btn{flex:1;padding:6px 12px;font-size:11px;font-family:'Space Mono',monospace;border:none;transition:all .2s}
.toggle-btn.active{background:var(--gold);color:#111827;font-weight:700}
.toggle-btn:not(.active){background:var(--surface);color:var(--dim);font-weight:400}

.info-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #1F293766}
.info-row.indent{padding-left:16px}
.info-row .label{font-size:12px;color:var(--muted)}
.info-row.indent .label{color:var(--dim)}
.info-row .val{font-size:13px;font-family:'Space Mono',monospace}
.info-row .val.gold{color:var(--gold);font-weight:700}
.info-row .val.green{color:var(--green);font-weight:700}
.info-row .val.red{color:var(--red);font-weight:700}
.info-row .val.blue{color:var(--blue);font-weight:700}

.highlight-box{border-radius:6px;padding:10px;margin-top:8px}
.highlight-gold{background:#D4A05410;border:1px solid #D4A05430}
.highlight-green{background:#10B98110;border:1px solid #10B98130}
.highlight-blue{background:#3B82F610;border:1px solid #3B82F630}
.highlight-purple{background:#8B5CF610;border:1px solid #8B5CF630}

.viability-banner{border-radius:10px;padding:16px;margin-bottom:20px;display:flex;align-items:center;gap:16px}
.viability-icon{font-size:32px;width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center}
.viability-title{font-size:16px;font-weight:700}
.viability-sub{font-size:12px;color:var(--muted);margin-top:2px}

.ss-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ss-card{border-radius:8px;padding:12px}
.ss-title{font-size:11px;font-weight:700;margin-bottom:8px;font-family:'Space Mono',monospace}
.ss-body{font-size:10px;color:var(--muted);line-height:1.6}

.footer{margin-top:28px;padding:14px 0;border-top:1px solid var(--border);font-size:9px;color:#4B5563;font-family:'Space Mono',monospace;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}

.note{font-size:10px;color:var(--dim);line-height:1.6;margin-top:6px}
.spacer{height:8px}
.divider{height:6px;border-bottom:2px solid var(--border2)}
.hidden{display:none}

@media(max-width:768px){.grid2,.grid3{grid-template-columns:1fr}}
</style>
</head>
<body>

<div class="header">
  <div class="logo-row"><div class="logo">S</div><div><div class="title">Mills Act Tax Calculator</div><div class="subtitle">STELLA × CA Rev & Tax Code §439-439.4</div></div></div>
  <div class="meta">Income capitalization method · 2026 lien date · SBE LTA 2025/030 rates · Palm Springs defaults</div>
  <div class="tabs" id="tabs"></div>
</div>

<div class="content">
  <div id="tab-dashboard"></div>
  <div id="tab-millsact" class="hidden"></div>
  <div id="tab-str" class="hidden"></div>
  <div id="tab-costs" class="hidden"></div>
  <div id="tab-analysis" class="hidden"></div>
  <div class="footer">
    <span>Stella × Mills Act Calculator v1.0 · Not tax advice · Consult your CPA</span>
    <span>CA RTC §439-439.4 · SBE LTA 2025/030 · Palm Springs Muni Code §8.05</span>
  </div>
</div>

<script>
/* ── STATE ─── */
const S = {
  purchasePrice:845000, marketValue:870000, propTaxRate:1.25,
  interestComp:6.50, occupancyType:"owner", propTaxComp:1.10,
  remainingLife:50, improvementRatio:70,
  monthlyFairRent:4200, vacancyRate:5, monthlyOpEx:500,
  nightlyRate:250, strOccupancy:65, totRate:12.5,
  monthlyMortgage:5300, monthlyInsurance:250, monthlyUtilities:1000,
  monthlyLawn:200, monthlyPool:200, monthlyMaintenance:300,
  fedRate:35, stateRate:9.3, activeTab:"dashboard"
};

const fmt = n => n.toLocaleString("en-US",{maximumFractionDigits:0});
const fmtD = n => "$"+fmt(n);
const fmtP = n => n.toFixed(2)+"%";

/* ── CALCULATIONS ─── */
function calc() {
  const gai=S.monthlyFairRent*12, vd=gai*(S.vacancyRate/100), eg=gai-vd, aoe=S.monthlyOpEx*12, noi=eg-aoe;
  const rc=S.occupancyType==="owner"?4:2, ac=(1/S.remainingLife)*(S.improvementRatio/100)*100;
  const tcr=S.interestComp+rc+S.propTaxComp+ac, rv=noi/(tcr/100);
  const av=S.purchasePrice, ev=Math.min(rv,av,S.marketValue);
  const sat=av*(S.propTaxRate/100), mat=ev*(S.propTaxRate/100), sav=sat-mat;
  const sp=sat>0?(sav/sat)*100:0;
  const sg=S.nightlyRate*(S.strOccupancy/100)*365, st=sg*(S.totRate/100), sn=sg-st;
  const mpt=mat/12;
  const tmc=S.monthlyMortgage+S.monthlyInsurance+S.monthlyUtilities+S.monthlyLawn+S.monthlyPool+S.monthlyMaintenance+mpt;
  const tac=tmc*12;
  const mpts=sat/12;
  const tmcs=S.monthlyMortgage+S.monthlyInsurance+S.monthlyUtilities+S.monthlyLawn+S.monthlyPool+S.monthlyMaintenance+mpts;
  const tacs=tmcs*12;
  const anwm=sn-tac, anwom=sn-tacs;
  const cr=(S.fedRate+S.stateRate)/100, tdwm=mat*cr, tdwo=sat*cr, ntb=sav-(tdwo-tdwm);
  const yd=[];let cwm=0,cwom=0,cso=0;
  for(let y=1;y<=10;y++){cwm+=anwm;cwom+=anwom;cso+=sav;yd.push({year:y,wm:Math.round(cwm),wom:Math.round(cwom),so:Math.round(cso)});}
  const benr=tac/(365*(S.strOccupancy/100)*(1-S.totRate/100));
  return {gai,vd,aoe,noi,rc,ac,tcr,rv,av,ev,sat,mat,sav,sp,sg,st,sn,mpt,tmc,tac,tmcs,tacs,anwm,anwom,ntb,tdwm,yd,benr,
    viable:anwm+sav>0, netPos:anwm+sav};
}

/* ── DOM HELPERS ─── */
function h(tag,attrs,...children){
  const el=document.createElement(tag);
  if(attrs)Object.entries(attrs).forEach(([k,v])=>{
    if(k==='className')el.className=v;
    else if(k==='onclick')el.onclick=v;
    else if(k.startsWith('data'))el.setAttribute(k,v);
    else el[k]=v;
  });
  children.flat().forEach(c=>{if(c!=null)el.append(typeof c==='string'?document.createTextNode(c):c);});
  return el;
}

function slider(id,label,key,min,max,step,format,sublabel,color){
  const clr=color||'#D4A054';
  const grp=h('div',{className:'slider-group'});
  const hdr=h('div',{className:'slider-header'},
    h('span',{className:'slider-label'},label),
    h('span',{className:'slider-value',id:'sv-'+id,style:'color:'+clr})
  );
  grp.append(hdr);
  if(sublabel)grp.append(h('div',{className:'slider-sub'},sublabel));
  const track=h('div',{className:'slider-track'});
  const fill=h('div',{className:'slider-fill',id:'sf-'+id,style:'background:linear-gradient(90deg,'+clr+'44,'+clr+')'});
  const thumb=h('div',{className:'slider-thumb',id:'st-'+id,style:'background:'+clr});
  const input=h('input',{type:'range',className:'slider-input',min,max,step,value:S[key]});
  input.addEventListener('input',e=>{S[key]=Number(e.target.value);update();});
  track.append(fill,input,thumb);
  grp.append(track);
  return grp;
}

function updateSlider(id,key,min,max,format){
  const v=S[key],pct=((v-min)/(max-min))*100;
  const disp=format==='dollar'?fmtD(v):format==='percent'?fmtP(v):format==='years'?v+' yrs':format==='nights'?'$'+v+'/night':format==='pctInt'?v+'%':''+v;
  const sv=document.getElementById('sv-'+id);if(sv)sv.textContent=disp;
  const sf=document.getElementById('sf-'+id);if(sf)sf.style.width=pct+'%';
  const st=document.getElementById('st-'+id);if(st)st.style.left='calc('+pct+'% - 6px)';
}

function infoRow(label,value,hl,indent){
  return h('div',{className:'info-row'+(indent?' indent':'')},
    h('span',{className:'label'},label),
    h('span',{className:'val'+(hl?' '+hl:'')},value)
  );
}

function statCard(label,value,sublabel,variant,icon){
  return h('div',{className:'stat stat-'+variant},
    h('div',{className:'stat-label'},(icon?icon+' ':'')+label),
    h('div',{className:'stat-value'},value),
    sublabel?h('div',{className:'stat-sub'},sublabel):null
  );
}

function sectionTitle(emoji,text){
  return h('div',{className:'section-title'},h('span',null,emoji),text);
}

/* ── CHARTS ─── */
let areaChart=null, barChart=null;

function renderAreaChart(c){
  const ctx=document.getElementById('chart-area');
  if(!ctx)return;
  const data=c.yd;
  if(areaChart)areaChart.destroy();
  areaChart=new Chart(ctx,{type:'line',data:{
    labels:data.map(d=>'Y'+d.year),
    datasets:[
      {label:'With Mills Act',data:data.map(d=>d.wm),borderColor:'#10B981',backgroundColor:'#10B98130',fill:true,tension:0.3,borderWidth:2},
      {label:'Without Mills Act',data:data.map(d=>d.wom),borderColor:'#EF4444',backgroundColor:'#EF444415',fill:true,tension:0.3,borderWidth:2,borderDash:[5,5]},
      {label:'Tax Savings Only',data:data.map(d=>d.so),borderColor:'#D4A054',backgroundColor:'#D4A05420',fill:true,tension:0.3,borderWidth:1.5,borderDash:[2,2]}
    ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#9CA3AF',font:{family:'Space Mono',size:10}}},tooltip:{backgroundColor:'#1F2937',titleColor:'#9CA3AF',bodyColor:'#E5E7EB',borderColor:'#374151',borderWidth:1,bodyFont:{family:'Space Mono',size:11},callbacks:{label:ctx=>ctx.dataset.label+': '+fmtD(ctx.raw)}}},scales:{x:{ticks:{color:'#6B7280',font:{family:'Space Mono',size:10}},grid:{color:'#1F2937'}},y:{ticks:{color:'#6B7280',font:{family:'Space Mono',size:10},callback:v=>'$'+(v/1000).toFixed(0)+'k'},grid:{color:'#1F2937'}}}}});
}

function renderBarChart(c){
  const ctx=document.getElementById('chart-bar');
  if(!ctx)return;
  if(barChart)barChart.destroy();
  barChart=new Chart(ctx,{type:'bar',data:{
    labels:['STR Revenue','Tax Savings','Total Costs','Net Position'],
    datasets:[
      {label:'With Mills Act',data:[Math.round(c.sn),Math.round(c.sav),-Math.round(c.tac),Math.round(c.netPos)],backgroundColor:'#10B981',borderRadius:3},
      {label:'Without Mills Act',data:[Math.round(c.sn),0,-Math.round(c.tacs),Math.round(c.anwom)],backgroundColor:'#EF444499',borderRadius:3}
    ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#9CA3AF',font:{family:'Space Mono',size:10}}},tooltip:{backgroundColor:'#1F2937',titleColor:'#9CA3AF',bodyColor:'#E5E7EB',borderColor:'#374151',borderWidth:1,bodyFont:{family:'Space Mono',size:11},callbacks:{label:ctx=>ctx.dataset.label+': '+fmtD(ctx.raw)}}},scales:{x:{ticks:{color:'#6B7280',font:{family:'Space Mono',size:9}},grid:{color:'#1F2937'}},y:{ticks:{color:'#6B7280',font:{family:'Space Mono',size:9},callback:v=>'$'+(v/1000).toFixed(0)+'k'},grid:{color:'#1F2937'}}}}});
}

/* ── TABS ─── */
const TABS=[{id:'dashboard',label:'Dashboard',icon:'◈'},{id:'millsact',label:'Mills Act',icon:'§'},{id:'str',label:'STR Revenue',icon:'⌂'},{id:'costs',label:'Costs',icon:'⚙'},{id:'analysis',label:'Analysis',icon:'◉'}];

function initTabs(){
  const container=document.getElementById('tabs');
  TABS.forEach(t=>{
    const btn=h('button',{className:'tab'+(S.activeTab===t.id?' active':''),onclick:()=>{S.activeTab=t.id;switchTab();}},t.icon+' '+t.label);
    btn.dataset.tab=t.id;
    container.append(btn);
  });
}

function switchTab(){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===S.activeTab));
  TABS.forEach(t=>{const el=document.getElementById('tab-'+t.id);if(el)el.classList.toggle('hidden',t.id!==S.activeTab);});
  update();
}

/* ── BUILD TABS ─── */
function buildDashboard(){
  const el=document.getElementById('tab-dashboard');
  el.innerHTML='';
  el.append(
    h('div',{className:'grid6',id:'dash-stats'}),
    h('div',{className:'chart-panel'},
      h('div',{style:'font-size:12px;font-weight:700;margin-bottom:4px;letter-spacing:0.04em;text-transform:uppercase'},'10-Year Cumulative Position'),
      h('div',{style:'font-size:10px;color:#6B7280;margin-bottom:16px'},'STR net income + Mills Act savings − total cost of ownership'),
      h('div',{style:'position:relative;height:280px'},h('canvas',{id:'chart-area'}))
    ),
    h('div',{className:'grid3',id:'dash-sliders'})
  );
  // Build slider panels
  const s1=h('div',{className:'panel'},
    slider('d-nr','Nightly Rate','nightlyRate',100,600,10,'nights',null,'#D4A054'),
    slider('d-so','STR Occupancy','strOccupancy',30,95,1,'pctInt',null,'#3B82F6')
  );
  const s2=h('div',{className:'panel'},
    slider('d-mfr','Fair Market Rent','monthlyFairRent',1500,8000,100,'dollar',null,'#10B981'),
    slider('d-pp','Purchase Price','purchasePrice',200000,2000000,5000,'dollar',null,'#D4A054')
  );
  const s3=h('div',{className:'panel'},
    slider('d-fr','Federal Tax Rate','fedRate',10,37,1,'pctInt',null,'#8B5CF6'),
    slider('d-sr','CA State Rate','stateRate',0,13.3,0.1,'percent',null,'#8B5CF6')
  );
  document.getElementById('dash-sliders').append(s1,s2,s3);
}

function buildMillsAct(){
  const el=document.getElementById('tab-millsact');el.innerHTML='';
  const left=h('div',null,
    h('div',{style:'margin-bottom:28px'},sectionTitle('⌂','Property'),
      slider('m-pp','Purchase Price (Prop 13 Base)','purchasePrice',200000,2000000,5000,'dollar','Assessed value for recent purchase'),
      slider('m-mv','Current Market Value','marketValue',200000,2000000,5000,'dollar'),
      slider('m-ptr','Effective Property Tax Rate','propTaxRate',1.0,1.5,0.01,'percent','Palm Springs typical ~1.25%')
    ),
    h('div',{style:'margin-bottom:28px'},sectionTitle('§','Fair Market Rent (Mills Act Valuation)'),
      slider('m-mfr','Monthly Fair Market Rent','monthlyFairRent',1500,8000,100,'dollar','Assessor LTR value — NOT your STR revenue','#10B981'),
      slider('m-vr','Vacancy & Collection Loss','vacancyRate',0,15,1,'pctInt',null,'#10B981'),
      slider('m-moe','Monthly Operating Expenses','monthlyOpEx',100,1500,50,'dollar','Excludes debt, depreciation, prop tax','#10B981')
    )
  );
  // Toggle for occupancy type
  const toggleLabel=h('div',{style:'font-size:12px;color:#9CA3AF;margin-bottom:6px;letter-spacing:0.02em'},'Risk Component (RTC §439.2)');
  const toggleRow=h('div',{className:'toggle-row'});
  ['owner','rental'].forEach(val=>{
    const lbl=val==='owner'?'Owner-Occupied (4%)':'Rental (2%)';
    const btn=h('button',{className:'toggle-btn'+(S.occupancyType===val?' active':''),onclick:()=>{S.occupancyType=val;update();document.querySelectorAll('#tab-millsact .toggle-btn').forEach((b,i)=>b.classList.toggle('active',i===(val==='owner'?0:1)));}},lbl);
    toggleRow.append(btn);
  });

  const right=h('div',null,
    h('div',{style:'margin-bottom:28px'},sectionTitle('⚡','Capitalization Rate Components'),
      slider('m-ic','Interest Component (SBE LTA 2025/030)','interestComp',2.5,8.0,0.25,'percent','2026 lien date = 6.50%'),
      toggleLabel,toggleRow,
      slider('m-ptc','Property Tax Component','propTaxComp',0.8,1.5,0.05,'percent'),
      slider('m-rl','Remaining Economic Life','remainingLife',20,80,5,'years','Wexler home ~50 yrs remaining'),
      slider('m-ir','Improvement-to-Total Ratio','improvementRatio',40,90,5,'pctInt','% of value in improvements vs. land')
    ),
    h('div',{className:'panel panel-gold',id:'mills-worksheet'})
  );
  el.append(h('div',{className:'grid2'},left,right));
}

function buildSTR(){
  const el=document.getElementById('tab-str');el.innerHTML='';
  const left=h('div',null,
    h('div',{style:'margin-bottom:28px'},sectionTitle('⌂','Short-Term Rental Revenue'),
      slider('s-nr','Nightly Rate','nightlyRate',100,600,10,'nights','Average across peak + off-peak','#3B82F6'),
      slider('s-so','Annual Occupancy Rate','strOccupancy',30,95,1,'pctInt','PS avg ~55-70%','#3B82F6'),
      slider('s-tr','TOT + TBID Rate','totRate',10,15,0.5,'percent','Palm Springs: 11.5% TOT + 1% TBID','#3B82F6')
    ),
    h('div',{className:'panel panel-blue',style:'margin-top:16px'},h('div',{id:'str-note',style:'font-size:10px;color:#6B7280;line-height:1.6'}))
  );
  const right=h('div',null,h('div',{className:'panel',id:'str-breakdown'}));
  el.append(h('div',{className:'grid2'},left,right));
}

function buildCosts(){
  const el=document.getElementById('tab-costs');el.innerHTML='';
  const left=h('div',null,
    h('div',{style:'margin-bottom:28px'},sectionTitle('⚙','Fixed Monthly Costs'),
      slider('c-mm','Monthly Mortgage (P&I + PMI)','monthlyMortgage',0,10000,50,'dollar','$750K @ 6.625% 30yr fixed'),
      slider('c-mi','Monthly Insurance','monthlyInsurance',100,800,25,'dollar')
    ),
    h('div',{style:'margin-bottom:28px'},sectionTitle('⚡','Operating Expenses'),
      slider('c-mu','Utilities (Electric/Gas/Water/Trash)','monthlyUtilities',200,2000,50,'dollar','Desert AC drives summer costs','#10B981'),
      slider('c-ml','Lawn / Landscaping','monthlyLawn',0,500,25,'dollar',null,'#10B981'),
      slider('c-mp','Pool Maintenance','monthlyPool',0,500,25,'dollar',null,'#10B981'),
      slider('c-mmt','Maintenance Reserve','monthlyMaintenance',0,1000,50,'dollar','General upkeep, repairs, turnover','#10B981')
    )
  );
  const right=h('div',null,
    h('div',{style:'margin-bottom:28px'},sectionTitle('⊘','Tax Bracket'),
      slider('c-fr','Federal Marginal Rate','fedRate',10,37,1,'pctInt','35% at $223K W2 + STR (MFJ)','#8B5CF6'),
      slider('c-sr','CA State Marginal Rate','stateRate',0,13.3,0.1,'percent','9.3% bracket','#8B5CF6')
    ),
    h('div',{className:'panel',id:'cost-tco'}),
    h('div',{className:'panel panel-purple',style:'margin-top:16px',id:'cost-deduction'})
  );
  el.append(h('div',{className:'grid2'},left,right));
}

function buildAnalysis(){
  const el=document.getElementById('tab-analysis');el.innerHTML='';
  el.append(
    h('div',{id:'analysis-banner'}),
    h('div',{className:'grid2'},
      h('div',null,h('div',{className:'panel',style:'margin-bottom:16px',id:'analysis-ss'}),h('div',{className:'panel',id:'analysis-pl'})),
      h('div',null,
        h('div',{className:'panel',style:'margin-bottom:16px;padding-bottom:8px'},
          h('div',{style:'font-size:11px;font-weight:700;margin-bottom:4px;letter-spacing:0.04em;text-transform:uppercase'},'Annual With vs Without Mills Act'),
          h('div',{style:'position:relative;height:200px'},h('canvas',{id:'chart-bar'}))
        ),
        h('div',{className:'panel',id:'analysis-metrics'}),
        h('div',{className:'highlight-purple',style:'margin-top:16px;padding:12px',id:'analysis-reps'})
      )
    )
  );
}

/* ── UPDATE ─── */
function update(){
  const c=calc();
  // Update all sliders
  const sliders=[
    ['d-nr','nightlyRate',100,600,'nights'],['d-so','strOccupancy',30,95,'pctInt'],
    ['d-mfr','monthlyFairRent',1500,8000,'dollar'],['d-pp','purchasePrice',200000,2000000,'dollar'],
    ['d-fr','fedRate',10,37,'pctInt'],['d-sr','stateRate',0,13.3,'percent'],
    ['m-pp','purchasePrice',200000,2000000,'dollar'],['m-mv','marketValue',200000,2000000,'dollar'],
    ['m-ptr','propTaxRate',1.0,1.5,'percent'],['m-mfr','monthlyFairRent',1500,8000,'dollar'],
    ['m-vr','vacancyRate',0,15,'pctInt'],['m-moe','monthlyOpEx',100,1500,'dollar'],
    ['m-ic','interestComp',2.5,8.0,'percent'],['m-ptc','propTaxComp',0.8,1.5,'percent'],
    ['m-rl','remainingLife',20,80,'years'],['m-ir','improvementRatio',40,90,'pctInt'],
    ['s-nr','nightlyRate',100,600,'nights'],['s-so','strOccupancy',30,95,'pctInt'],
    ['s-tr','totRate',10,15,'percent'],
    ['c-mm','monthlyMortgage',0,10000,'dollar'],['c-mi','monthlyInsurance',100,800,'dollar'],
    ['c-mu','monthlyUtilities',200,2000,'dollar'],['c-ml','monthlyLawn',0,500,'dollar'],
    ['c-mp','monthlyPool',0,500,'dollar'],['c-mmt','monthlyMaintenance',0,1000,'dollar'],
    ['c-fr','fedRate',10,37,'pctInt'],['c-sr','stateRate',0,13.3,'percent']
  ];
  sliders.forEach(([id,key,min,max,fmt])=>updateSlider(id,key,min,max,fmt));

  // Dashboard stats
  const ds=document.getElementById('dash-stats');
  if(ds){ds.innerHTML='';ds.append(
    statCard('Annual Tax Savings',fmtD(c.sav),c.sp.toFixed(0)+'% reduction','gold','§'),
    statCard('Mills Act Tax',fmtD(c.mat),'was '+fmtD(c.sat),'green','⊘'),
    statCard('Restricted Value',fmtD(c.ev),'vs '+fmtD(c.av)+' assessed','blue','▽'),
    statCard('STR Net Revenue',fmtD(c.sn),fmtD(c.sg)+' gross - TOT','neutral','⌂'),
    statCard('Annual Net Position',fmtD(c.netPos),c.viable?'Rental is viable':'Operating at a loss',c.viable?'green':'red',c.viable?'✓':'✕'),
    statCard('Break-Even Rate','$'+c.benr.toFixed(0)+'/nt','at '+S.strOccupancy+'% occupancy','neutral','⊙')
  );}
  renderAreaChart(c);

  // Mills Act worksheet
  const mw=document.getElementById('mills-worksheet');
  if(mw){mw.innerHTML='';mw.append(
    h('div',{style:'font-size:11px;font-weight:700;color:#D4A054;margin-bottom:10px;letter-spacing:0.06em;text-transform:uppercase'},'◈ Income Capitalization Worksheet'),
    infoRow('Gross Annual Income',fmtD(c.gai)),
    infoRow('Less Vacancy ('+S.vacancyRate+'%)','('+fmtD(c.vd)+')',null,true),
    infoRow('Less Operating Expenses','('+fmtD(c.aoe)+')',null,true),
    infoRow('Net Operating Income',fmtD(c.noi),'gold'),
    h('div',{className:'spacer'}),
    infoRow('Interest Component',fmtP(S.interestComp),null,true),
    infoRow('Risk Component',fmtP(c.rc),null,true),
    infoRow('Property Tax Component',fmtP(S.propTaxComp),null,true),
    infoRow('Amortization (1/'+S.remainingLife+' × '+S.improvementRatio+'%)',fmtP(c.ac),null,true),
    infoRow('Total Capitalization Rate',fmtP(c.tcr),'gold'),
    h('div',{className:'spacer'}),
    infoRow('Restricted Value (NOI ÷ Cap Rate)',fmtD(c.rv),'blue'),
    infoRow('Prop 13 Assessed Value',fmtD(c.av)),
    infoRow('Enrolled Value (lower of)',fmtD(c.ev),'green'),
    h('div',{style:'height:12px'}),
    h('div',{className:'highlight-gold'},
      infoRow('Standard Annual Property Tax',fmtD(c.sat)),
      infoRow('Mills Act Annual Property Tax',fmtD(c.mat),'green'),
      infoRow('Annual Savings ('+c.sp.toFixed(0)+'%)',fmtD(c.sav),'gold')
    )
  );}

  // STR breakdown
  const sb=document.getElementById('str-breakdown');
  if(sb){sb.innerHTML='';sb.append(
    h('div',{style:'font-size:11px;font-weight:700;color:#3B82F6;margin-bottom:10px;letter-spacing:0.06em;text-transform:uppercase'},'⌂ STR Revenue Breakdown'),
    infoRow('Rental Nights / Year',Math.round(365*S.strOccupancy/100)+' nights'),
    infoRow('Gross Annual Revenue',fmtD(c.sg),'blue'),
    infoRow('Less TOT + TBID ('+S.totRate+'%)','('+fmtD(c.st)+')',null,true),
    infoRow('Net STR Revenue',fmtD(c.sn),'green'),
    h('div',{style:'height:12px'}),
    infoRow('Monthly Net STR',fmtD(c.sn/12)),
    infoRow('Effective Per-Night (after TOT)','$'+(c.sn/(365*S.strOccupancy/100)).toFixed(0)),
    h('div',{style:'height:12px'}),
    h('div',{className:'highlight-blue'},
      infoRow('Break-Even Nightly Rate','$'+c.benr.toFixed(0)+'/night','blue'),
      h('div',{className:'note'},'Minimum rate at '+S.strOccupancy+'% occupancy to cover all costs')
    )
  );}
  const sn2=document.getElementById('str-note');
  if(sn2)sn2.innerHTML='<strong style="color:#3B82F6">⚡ SOUND vs SASSY NOTE:</strong> The Mills Act valuation uses long-term fair market rent ('+fmtD(S.monthlyFairRent)+'/mo) to determine restricted value. Your actual STR revenue ('+fmtD(c.sg)+'/yr gross) is completely separate. The assessor cares what a 12-month tenant would pay.';

  // Costs TCO
  const ct=document.getElementById('cost-tco');
  if(ct){ct.innerHTML='';ct.append(
    h('div',{style:'font-size:11px;font-weight:700;margin-bottom:10px;letter-spacing:0.06em;text-transform:uppercase'},'⚙ Total Cost of Ownership'),
    infoRow('Mortgage',fmtD(S.monthlyMortgage)),
    infoRow('Property Tax (with Mills Act)',fmtD(c.mpt),null,true),
    infoRow('Insurance',fmtD(S.monthlyInsurance),null,true),
    infoRow('Utilities',fmtD(S.monthlyUtilities),null,true),
    infoRow('Lawn',fmtD(S.monthlyLawn),null,true),
    infoRow('Pool',fmtD(S.monthlyPool),null,true),
    infoRow('Maintenance',fmtD(S.monthlyMaintenance),null,true),
    h('div',{className:'spacer'}),
    infoRow('Total Monthly Cost',fmtD(c.tmc),'red'),
    infoRow('Total Annual Cost',fmtD(c.tac),'red'),
    h('div',{style:'height:12px'}),
    h('div',{className:'highlight-green'},
      infoRow('Without Mills Act (monthly)',fmtD(c.tmcs)),
      infoRow('Mills Act Monthly Savings',fmtD((c.tacs-c.tac)/12),'green')
    )
  );}
  const cd=document.getElementById('cost-deduction');
  if(cd){cd.innerHTML='';cd.append(
    h('div',{style:'font-size:11px;font-weight:700;color:#8B5CF6;margin-bottom:10px;letter-spacing:0.06em;text-transform:uppercase'},'Tax Deduction Impact'),
    infoRow('Combined Marginal Rate',fmtP(S.fedRate+S.stateRate)),
    infoRow('Prop Tax Deduction (with Mills)',fmtD(c.tdwm),null,true),
    infoRow('Net Tax Benefit of Mills Act',fmtD(c.ntb),'green'),
    h('div',{className:'note'},'Lower property tax = less to deduct, but direct savings far outweigh the lost deduction.')
  );}

  // Analysis
  const ab=document.getElementById('analysis-banner');
  if(ab){ab.innerHTML='';
    const banner=h('div',{className:'viability-banner',style:'background:'+(c.viable?'#10B98110':'#EF444410')+';border:1px solid '+(c.viable?'#10B98140':'#EF444440')});
    banner.append(
      h('div',{className:'viability-icon',style:'background:'+(c.viable?'#10B98120':'#EF444420')},c.viable?'✓':'✕'),
      h('div',null,
        h('div',{className:'viability-title',style:'color:'+(c.viable?'#10B981':'#EF4444')},c.viable?'STR is Viable with Mills Act':'STR is Not Viable at Current Settings'),
        h('div',{className:'viability-sub'},'Annual net: '+fmtD(c.netPos)+' · Break-even: $'+c.benr.toFixed(0)+'/nt · '+fmtP(S.fedRate+S.stateRate)+' combined rate')
      )
    );
    ab.append(banner);
  }
  const ss=document.getElementById('analysis-ss');
  if(ss){ss.innerHTML='';ss.append(
    h('div',{style:'font-size:11px;font-weight:700;color:#D4A054;margin-bottom:12px;letter-spacing:0.06em;text-transform:uppercase'},'Sound vs Sassy Analysis'),
    h('div',{className:'ss-grid'},
      h('div',{className:'ss-card',style:'background:#10B98108;border:1px solid #10B98120'},
        h('div',{className:'ss-title',style:'color:#10B981'},'🔒 SOUND'),
        h('div',{className:'ss-body'},'Owner-occupied with 4% risk component. Apply 2027. Use Junior Permit or 29+ day rentals interim. Savings: '),
        h('strong',{style:'color:#10B981;font-size:10px'},fmtD(S.occupancyType==='owner'?c.sav:c.sav*1.17)+'/yr')
      ),
      h('div',{className:'ss-card',style:'background:#D4A05408;border:1px solid #D4A05420'},
        h('div',{className:'ss-title',style:'color:#D4A054'},'💅 SASSY'),
        h('div',{className:'ss-body'},'Classify as owner-occupied while running STR. No SBE definition or case law on part-time STR. Risk: reclassification to 2%. Extra: '),
        h('strong',{style:'color:#D4A054;font-size:10px'},fmtD(Math.abs(c.sav-c.sav*(S.occupancyType==='owner'?1:0.83)))+'/yr')
      )
    )
  );}
  const pl=document.getElementById('analysis-pl');
  if(pl){pl.innerHTML='';pl.append(
    h('div',{style:'font-size:11px;font-weight:700;margin-bottom:10px;letter-spacing:0.06em;text-transform:uppercase'},'Annual P&L Statement'),
    infoRow('STR Gross Revenue',fmtD(c.sg)),
    infoRow('TOT + TBID ('+S.totRate+'%)','('+fmtD(c.st)+')',null,true),
    infoRow('STR Net Revenue',fmtD(c.sn),'green'),
    infoRow('Mills Act Tax Savings',fmtD(c.sav),'gold'),
    h('div',{className:'divider'}),
    infoRow('Total Annual Income + Savings',fmtD(c.sn+c.sav),'green'),
    h('div',{className:'spacer'}),
    infoRow('Annual Cost of Ownership','('+fmtD(c.tac)+')','red'),
    h('div',{className:'divider'}),
    infoRow('NET ANNUAL POSITION',fmtD(c.netPos),c.netPos>=0?'green':'red'),
    h('div',{className:'spacer'}),
    infoRow('Without Mills Act',fmtD(c.anwom)),
    infoRow('Mills Act Net Advantage',fmtD(c.sav),'gold')
  );}
  renderBarChart(c);
  const am=document.getElementById('analysis-metrics');
  if(am){am.innerHTML='';am.append(
    h('div',{style:'font-size:11px;font-weight:700;margin-bottom:10px;letter-spacing:0.06em;text-transform:uppercase'},'Key Metrics'),
    infoRow('Monthly Net Cash Flow',fmtD(c.netPos/12),c.netPos>=0?'green':'red'),
    infoRow('Break-Even Nightly Rate','$'+c.benr.toFixed(0)+'/night','blue'),
    infoRow('10-Year Cumulative (with Mills)',fmtD(c.yd[9].wm),c.yd[9].wm>=0?'green':'red'),
    infoRow('10-Year Cumulative (without)',fmtD(c.yd[9].wom)),
    infoRow('10-Year Mills Act Savings Total',fmtD(c.yd[9].so),'gold'),
    h('div',{className:'spacer'}),
    infoRow('Cancellation Penalty (12.5% FMV)',fmtD(S.marketValue*0.125),'red'),
    h('div',{className:'note'},'Penalty exceeds cumulative savings until year '+(c.sav>0?Math.ceil((S.marketValue*0.125)/c.sav):'∞')+'. Non-renewal (10yr phase-out) avoids penalty.')
  );}
  const ar=document.getElementById('analysis-reps');
  if(ar)ar.innerHTML='<div style="font-size:10px;font-weight:700;color:#8B5CF6;margin-bottom:4px;font-family:Space Mono,monospace">REPS + MILLS ACT STACK</div><div style="font-size:10px;color:#9CA3AF;line-height:1.6">REPS allows passive rental losses to offset W2 income. Mills Act reduces property tax (a deductible expense), but direct savings far outweigh the lost deduction. Net benefit after REPS interaction: <strong style="color:#8B5CF6">'+fmtD(c.ntb)+'/yr</strong></div>';
}

/* ── INIT ─── */
initTabs();
buildDashboard();
buildMillsAct();
buildSTR();
buildCosts();
buildAnalysis();
update();
</script>
</body>
</html>
