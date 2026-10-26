// Live feedback loop: room heating with a PI controller, plotted over the last hour.
(function(){
var root=document.getElementById('loop-sim');
if(!root) return;

// Simulated minutes. The room loses heat to the outside; an open window loses more.
var OUTSIDE=5, LOSS=0.05, LOSS_WINDOW=0.08, HEATER_GAIN=2;
var KP=0.25, KI=0.04, STEP=0.05, SPEED=4, WINDOW=60, SAMPLE=0.25;
var SETPOINTS=[21,24,18];
// Plot geometry must match the SVG grid: 26 °C at y=30, 14 °C at y=230.
var X0=40, X1=540, Y_TOP=30, Y_BOTTOM=230, T_TOP=26, T_BOTTOM=14;

var sim={t:0, temp:21, integral:0, power:0, spIndex:0, windowOpen:false, feedback:true, nextSample:0};
var history=[];
var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
var running=false, visible=false, last=0;

function setpoint(){ return SETPOINTS[sim.spIndex]; }
function clamp(v,lo,hi){ return Math.min(hi,Math.max(lo,v)); }

function step(dt){
  var sp=setpoint();
  if(sim.feedback){
    var e=sp-sim.temp, u=KP*e+sim.integral;
    // Anti-windup: integrate only while the heater is not saturated in that direction.
    if((u<1||e<0)&&(u>0||e>0)) sim.integral+=KI*e*dt;
    sim.power=clamp(KP*e+sim.integral,0,1);
  } else {
    // Without feedback the heater runs at the power that would suit a closed window.
    sim.power=clamp(LOSS*(sp-OUTSIDE)/HEATER_GAIN,0,1);
  }
  var loss=sim.windowOpen?LOSS_WINDOW:LOSS;
  sim.temp+=(HEATER_GAIN*sim.power-loss*(sim.temp-OUTSIDE))*dt;
  sim.t+=dt;
  if(sim.t>=sim.nextSample){
    history.push({t:sim.t, temp:sim.temp, sp:sp, open:sim.windowOpen});
    sim.nextSample+=SAMPLE;
    while(history.length&&history[0].t<sim.t-WINDOW) history.shift();
  }
}

function advance(minutes){
  for(var n=Math.round(minutes/STEP);n>0;n--) step(STEP);
}

function x(t){ return X0+(X1-X0)*(1-(sim.t-t)/WINDOW); }
function y(temp){ return Y_TOP+(Y_BOTTOM-Y_TOP)*(T_TOP-clamp(temp,T_BOTTOM,T_TOP))/(T_TOP-T_BOTTOM); }
function fmt(v){ return v.toFixed(1).replace('.',','); }

function draw(){
  var temp='', sp='', shade='', runStart=null;
  history.forEach(function(p,i){
    var px=x(p.t).toFixed(1);
    temp+=(i?'L':'M')+px+' '+y(p.temp).toFixed(1);
    sp+=(i?'L':'M')+px+' '+y(p.sp).toFixed(1);
    if(p.open&&runStart===null) runStart=px;
    if(runStart!==null&&(!p.open||i===history.length-1)){
      shade+='M'+runStart+' '+Y_TOP+'H'+px+'V'+Y_BOTTOM+'H'+runStart+'Z';
      runStart=null;
    }
  });
  document.getElementById('loop-sim-temp').setAttribute('d',temp);
  document.getElementById('loop-sim-setpoint').setAttribute('d',sp);
  document.getElementById('loop-sim-window').setAttribute('d',shade);
  root.querySelector('[data-sim-out="setpoint"]').textContent=fmt(setpoint())+' °C';
  root.querySelector('[data-sim-out="temp"]').textContent=fmt(sim.temp)+' °C';
  root.querySelector('[data-sim-out="power"]').textContent=Math.round(sim.power*100)+' %';
}

function frame(now){
  if(!running) return;
  var dt=Math.min((now-last)/1000,0.1); last=now;
  advance(dt*SPEED);
  draw();
  requestAnimationFrame(frame);
}

function update(){
  var should=visible&&!(reduced&&reduced.matches);
  if(should&&!running){ running=true; last=performance.now(); requestAnimationFrame(frame); }
  if(!should) running=false;
}

function syncButtons(){
  var w=root.querySelector('[data-sim="window"]'), f=root.querySelector('[data-sim="feedback"]');
  w.setAttribute('aria-pressed',String(sim.windowOpen));
  w.textContent=sim.windowOpen?'Zapri okno':'Odpri okno';
  f.setAttribute('aria-pressed',String(sim.feedback));
  f.textContent='Povratna zveza: '+(sim.feedback?'vklopljena':'izklopljena');
}

root.addEventListener('click',function(e){
  var b=e.target.closest('[data-sim]'); if(!b) return;
  var action=b.dataset.sim;
  if(action==='setpoint') sim.spIndex=(sim.spIndex+1)%SETPOINTS.length;
  if(action==='window') sim.windowOpen=!sim.windowOpen;
  if(action==='feedback'){ sim.feedback=!sim.feedback; sim.integral=sim.power; }
  syncButtons();
  // With reduced motion the response is computed at once instead of animated.
  if(!running){ advance(30); draw(); }
});

// Start from a settled room so the first view shows a flat line at the setpoint.
sim.integral=LOSS*(setpoint()-OUTSIDE)/HEATER_GAIN;
advance(WINDOW);
draw();

if('IntersectionObserver' in window){
  new IntersectionObserver(function(entries){ visible=entries[0].isIntersecting; update(); }).observe(root);
} else { visible=true; update(); }
if(reduced){
  if(reduced.addEventListener) reduced.addEventListener('change',update);
  else if(reduced.addListener) reduced.addListener(update);
}
})();
