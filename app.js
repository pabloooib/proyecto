gsap.registerPlugin(ScrollTrigger);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

/* ================= PORTADA, MARQUEE, TEXTO DIVIDIDO ================= */
const hs=[60,85,48,100,72,90,55,78,95,66];
$('#stack').innerHTML=hs.map(h=>`<i style="height:${h}%"></i>`).join('');
$('#mq').innerHTML=('Strategy ✦ Factory ✦ Observer ✦ Hexagonal ✦ Buenas prácticas ✦ SOLID ✦ ').repeat(6);
gsap.to('#mq',{xPercent:-35,ease:'none',duration:30,repeat:-1});
$$('[data-split]').forEach(el=>{
  el.innerHTML=el.textContent.trim().split(/\s+/).map((t,i)=>`<span class="w"><span style="--i:${i}">${esc(t)}</span></span>`).join(' ');
});
gsap.from('#stack i',{scaleY:0,transformOrigin:'bottom',duration:1.1,stagger:.07,ease:'back.out(1.4)',delay:.4});
gsap.from('.hero .sm',{opacity:0,y:30,duration:1,delay:1});

/* ================= REVELADO (CSS + IntersectionObserver) ================= */
$$('.card,.lead,.tw,.dg,.rm,.acc,.rv,.tile,.stat,.exrow,.legend,.codecard').forEach(e=>{
  if(e.closest('.hero'))return;
  e.setAttribute('data-rv','');
  const i=[...e.parentElement.children].indexOf(e);e.style.setProperty('--d',(i%4)*.08+'s');
});
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:0,rootMargin:'0px 0px -8% 0px'});
$$('[data-rv],[data-split]').forEach(e=>io.observe(e));
$$('.hero .rv').forEach(e=>e.classList.add('in'));

/* ================= PARALAJE Y SCROLL ================= */
$$('[data-par]').forEach(el=>gsap.to(el,{yPercent:+el.dataset.par,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
$$('.part .xl').forEach(el=>gsap.from(el,{scale:.6,opacity:0,ease:'none',scrollTrigger:{trigger:el,start:'top 95%',end:'top 40%',scrub:true}}));
gsap.to('#prog',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});
$$('[data-count]').forEach(el=>{const o={v:0};gsap.to(o,{v:+el.dataset.count,duration:1.6,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v),scrollTrigger:{trigger:el,start:'top 92%',once:true}})});
const hero=$('.hero');
hero.addEventListener('mousemove',e=>{
  const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
  gsap.to('.stack',{rotateY:x*24,rotateX:-y*14,duration:.8,ease:'power2.out'});
  gsap.to('.b1',{x:x*-70,y:y*-40,duration:1.2});gsap.to('.b2',{x:x*60,y:y*30,duration:1.2});
});

/* ================= CURSOR (el nativo siempre visible) + MICROINTERACCIONES ================= */
if(matchMedia('(hover:hover)').matches){
  const hx=gsap.quickTo('.halo','x',{duration:.5}),hy=gsap.quickTo('.halo','y',{duration:.5});let shown=false;
  addEventListener('mousemove',e=>{if(!shown){shown=true;gsap.to('.halo',{opacity:1,duration:.4})}hx(e.clientX);hy(e.clientY)});
  document.addEventListener('mouseover',e=>{const t=e.target.closest('a,button,.card,input,select,.node,.dotr,.tile,.chip,.acc-item');gsap.to('.halo',{scale:t?1.9:1,duration:.4,overwrite:'auto'})});
}
$$('.card.tilt').forEach(el=>{
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--ry',(x*7).toFixed(2)+'deg');el.style.setProperty('--rx',(-y*7).toFixed(2)+'deg')});
  el.addEventListener('mouseleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
});
document.addEventListener('click',e=>{
  const b=e.target.closest('.pill,.ico,.seg button');
  if(b&&!RM){const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),sp=document.createElement('span');sp.className='ripple';sp.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;b.append(sp);setTimeout(()=>sp.remove(),650)}
  const w=e.target.closest('.who');
  if(w){w.classList.remove('pop');void w.offsetWidth;w.classList.add('pop');
    const f=w.dataset.focus;if(f){const c='focus-'+f,on=document.body.classList.contains(c);document.body.classList.remove('focus-p','focus-d');if(!on)document.body.classList.add(c)}}
});

/* ================= SIMULADOR STRATEGY ================= */
const S={est:{n:'Estudiante',rate:.5,grace:0,cap:null,cls:'EstudianteStrategy',limit:3,period:7},doc:{n:'Docente',rate:.25,grace:5,cap:null,cls:'DocenteStrategy',limit:5,period:15},vip:{n:'VIP',rate:.1,grace:10,cap:20,cls:'VipStrategy',limit:10,period:30}};
let key='est';const so={v:0};
const fine=(k,d,v)=>{const s=S[k];return Math.min(s.cap??v,Math.max(0,d-s.grace)*s.rate)};
$('#bars').innerHTML=Object.keys(S).map(k=>`<div data-k="${k}"><span class="v">$0</span><i></i><span>${S[k].n}</span></div>`).join('');
function update(){
  const d=+$('#days').value,v=+$('#val').value;
  $('#vd').textContent=d;$('#vv').textContent='$'+v;
  const vals=Object.keys(S).map(k=>fine(k,d,v)),max=Math.max(...vals,1);
  $$('#bars div').forEach((b,i)=>{b.classList.toggle('on',b.dataset.k===key);b.querySelector('.v').textContent='$'+vals[i].toFixed(2);gsap.to(b.querySelector('i'),{height:Math.max(2,vals[i]/max*85)+'%',duration:.8,ease:'power3.out'})});
  gsap.to(so,{v:fine(key,d,v),duration:.7,ease:'power3.out',onUpdate:()=>$('#out').textContent=so.v.toFixed(2)});
  let p='';for(let i=0;i<=40;i++){const f=fine(key,i,v);p+=(i?'L':'M')+(i*10)+' '+(86-f/Math.max(v,20)*80)}
  $('#curve').setAttribute('d',p);$('#mark').setAttribute('x1',d*10);$('#mark').setAttribute('x2',d*10);
  const s=S[key];
  $('#code').innerHTML=`<b>interface</b> FineStrategy { calculate(days) }\n<b>class</b> ${s.cls} {\n  rate = ${s.rate}  grace = ${s.grace} d\n  cap  = ${s.cap??'valor del libro'}\n}`;
}
function setKey(k){key=k;$$('#seg button').forEach(x=>x.classList.toggle('on',x.dataset.k===k));update()}
$$('#seg button').forEach(b=>b.addEventListener('click',()=>setKey(b.dataset.k)));
$('#days').addEventListener('input',update);$('#val').addEventListener('input',update);
update();

/* ================= MOTOR DE DIAGRAMAS INTERACTIVOS ================= */
const NS='http://www.w3.org/2000/svg';
const sv=(t,a={},p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.append(e);return e};
const ctr=n=>n.r?{x:n.x,y:n.y}:{x:n.x+n.w/2,y:n.y+n.h/2};
const fcen=n=>n.fx!=null?{x:n.fx,y:n.fy}:ctr(n);
function edgePt(n,t){
  const c=ctr(n);let dx=t.x-c.x,dy=t.y-c.y;const L=Math.hypot(dx,dy)||1;dx/=L;dy/=L;
  if(n.r)return{x:c.x+dx*(n.r+3),y:c.y+dy*(n.r+3)};
  const k=Math.min((n.w/2+3)/(Math.abs(dx)||1e-6),(n.h/2+3)/(Math.abs(dy)||1e-6));
  return{x:c.x+dx*k,y:c.y+dy*k};
}
const I=(k,t,d,b)=>({k,t,d,b});
function mountDG(root,cfg){
  const bar=root.querySelector('.dg-bar'),svg=root.querySelector('svg'),panel=root.querySelector('.dpanel');
  const uid='m'+Math.random().toString(36).slice(2,8);
  let view=cfg.views[0],tl=null,cur=null,map={},edges=[];
  const off=new Set(cfg.off||[]);
  const nodeOf=id=>view.nodes.find(n=>n.id===id);
  function draw(v){
    view=v;svg.innerHTML='';svg.setAttribute('viewBox',v.vb);map={};edges=[];
    const defs=sv('defs',{},svg),mk=sv('marker',{id:uid,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'},defs);
    sv('path',{d:'M0 0L10 5L0 10z',fill:'#9CA3AF'},mk);
    const ge=sv('g',{},svg),gn=sv('g',{},svg);sv('g',{class:'dots'},svg);
    (v.edges||[]).forEach(e=>{
      const A=nodeOf(e.a),B=nodeOf(e.b),p=edgePt(A,ctr(B)),q=edgePt(B,ctr(A));
      const l=sv('line',{x1:p.x,y1:p.y,x2:q.x,y2:q.y,class:'edge'+(e.dash?' dsh':''),'marker-end':`url(#${uid})`},ge);
      if(e.l){const t=sv('text',{x:(p.x+q.x)/2,y:(p.y+q.y)/2-6,class:'elabel'},ge);t.textContent=e.l}
      edges.push({l,a:e.a,b:e.b});
    });
    v.nodes.forEach(n=>{
      const g=sv('g',{class:'node '+(n.k||''),tabindex:0,role:'button','aria-label':n.t},gn),c=ctr(n);
      if(n.shape==='hex'){
        const pts=[0,1,2,3,4,5].map(i=>{const a=(-90+60*i)*Math.PI/180;return(c.x+n.r*Math.cos(a)).toFixed(1)+','+(c.y+n.r*Math.sin(a)).toFixed(1)}).join(' ');
        sv('polygon',{points:pts,class:'sh'},g);
      }else if(n.r)sv('circle',{cx:c.x,cy:c.y,r:n.r,class:'sh'},g);
      else sv('rect',{x:n.x,y:n.y,width:n.w,height:n.h,rx:14,class:'sh'},g);
      let ty,sy;
      if(n.lbl==='top'){ty=c.y-n.r+26;sy=ty+16}else if(n.s){ty=c.y-3;sy=c.y+15}else ty=c.y+5;
      const t=sv('text',{x:c.x,y:ty},g);t.textContent=n.t;
      if(n.s){const s=sv('text',{x:c.x,y:sy,class:'s'},g);s.textContent=n.s}
      g.addEventListener('click',()=>select(n.id));
      g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(n.id)}});
      map[n.id]=g;
    });
    off.forEach(applyOff);
  }
  function applyOff(id){
    const o=off.has(id);map[id]?.classList.toggle('off',o);
    edges.forEach(e=>{if(e.a===id||e.b===id)e.l.classList.toggle('offe',off.has(e.a)||off.has(e.b))});
  }
  function refresh(){
    Object.values(map).forEach(g=>g.classList.remove('hot'));
    edges.forEach(e=>e.l.classList.toggle('hot',cur!=null&&(e.a===cur||e.b===cur)));
  }
  function select(id){
    cur=id;
    Object.values(map).forEach(g=>g.classList.remove('sel'));map[id]?.classList.add('sel');
    refresh();
    const i=cfg.info[id];
    if(i){
      panel.innerHTML=`<span class="badge">${i.k||'Componente'}</span><h4>${i.t}</h4><p>${i.d}</p>${i.b?'<ul>'+i.b.map(x=>`<li>${x}</li>`).join('')+'</ul>':''}`;
      if(!RM)gsap.from(panel.children,{y:14,opacity:0,stagger:.06,duration:.45,ease:'power3.out'});
    }
    cfg.onSelect&&cfg.onSelect(id);
  }
  function mark(ids,prev){
    ids.forEach(id=>map[id]?.classList.add('hot'));
    edges.forEach(e=>{ids.forEach(id=>{if((prev.includes(e.a)&&e.b===id)||(prev.includes(e.b)&&e.a===id))e.l.classList.add('hot')})});
  }
  function flow(seq){
    if(tl)tl.kill();refresh();
    const gd=svg.querySelector('.dots');gd.innerHTML='';
    const steps=(typeof seq==='function'?seq():seq).map(s=>[].concat(s));
    tl=gsap.timeline({onComplete:()=>setTimeout(()=>{gd.innerHTML='';refresh()},1300)});
    let prev=steps[0]||[];
    tl.call(()=>mark(prev,[]));
    steps.slice(1).forEach(st=>{
      if(!st.length)return;
      const src=nodeOf(prev[0]),from=src?fcen(src):null,sub=gsap.timeline(),p=prev;
      st.forEach(id=>{
        const to=fcen(nodeOf(id)),f=from||to;
        const d=sv('circle',{r:7,cx:f.x,cy:f.y,class:'dot',opacity:0},gd);
        sub.set(d,{opacity:1},0);
        sub.to(d,{attr:{cx:to.x,cy:to.y},duration:.75,ease:'power2.inOut',onComplete:()=>{mark([id],p);gsap.to(d,{opacity:0,duration:.3})}},0);
      });
      tl.add(sub);prev=st;
    });
  }
  function run(f){cfg.onFlow&&cfg.onFlow(f);flow(f.seq)}
  function mkBtn(cls,txt,fn){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=txt;b.addEventListener('click',fn);return b}
  function buildBar(){
    bar.innerHTML='';
    if(cfg.views.length>1){
      const g=document.createElement('div');g.className='tabs';
      cfg.views.forEach(v=>g.append(mkBtn('pill'+(v===view?' on':''),v.label,()=>{
        if(tl)tl.kill();cur=null;draw(v);buildBar();
        if(!RM)gsap.from(svg,{opacity:0,duration:.5});
        select(v.init||v.nodes[0].id);
      })));
      bar.append(g);
    }
    const f=document.createElement('div');f.className='tabs';
    (view.flows||[]).forEach(fl=>f.append(mkBtn('pill play','▶ '+fl.label,()=>run(fl))));
    bar.append(f);
  }
  draw(view);buildBar();
  if(cfg.initial)select(cfg.initial);
  return{select,flow,run,isOff:id=>off.has(id),setOff(id,flag){flag?off.add(id):off.delete(id);applyOff(id)}};
}

/* ---------- 08 · Casos de uso ---------- */
mountDG($('#dg-casos'),{
  initial:'biblio',
  info:{
    lector:I('Actor','Lector','Estudiante, docente o VIP que consulta el catálogo y reserva libros desde la web.',['Busca por título, autor, código o materia','Reserva ejemplares prestados','Recibe avisos por correo']),
    biblio:I('Actor','Bibliotecario','Opera el mostrador: identifica al lector, presta y recibe devoluciones.',['Valida límite, multas y disponibilidad','Cobra multas pendientes','Es el actor principal de CU-01 y CU-03']),
    admin:I('Actor','Administrador','Define la política de la biblioteca y revisa los reportes.',['Cambia tarifas sin desarrollo (HU-03)','Consulta el reporte de morosos (HU-05)']),
    buscar:I('Caso de uso','Buscar en catálogo','RF-02. Consulta de solo lectura, disponible para lectores y bibliotecarios.',['Responde en menos de 200 ms (RNF-01)']),
    reservar:I('CU-02','Reservar ejemplar','El lector toma turno sobre un ejemplar prestado. Usa control de versión para evitar duplicados bajo concurrencia.',['Bloqueo optimista','Incluye el aviso de disponibilidad']),
    prestar:I('CU-01','Prestar libro','Registra el préstamo si el lector no tiene multas ni excede su límite.',['Alternativa: multa pendiente → se bloquea y se ofrece cobrarla']),
    devolver:I('CU-03','Devolver con multa','Cierra el préstamo, calcula la multa según el tipo de usuario y publica el evento LibroDevuelto.',['Incluye «Calcular multa»','Dispara a los observadores']),
    reportes:I('HU-05','Reporte de morosos','Lista de lectores con multas, con los mismos montos que se cobran en mostrador.',['Usa la misma estrategia de multa: cero duplicación']),
    tarifas:I('HU-03','Configurar tarifas','El administrador ajusta tasa, gracia y tope por tipo de usuario.',['Cambio de política en horas, no en semanas']),
    notif:I('Observer','Notificar disponibilidad','Aviso al primer lector de la cola cuando se libera el ejemplar.',['Canal email hoy, SMS mañana']),
    multa:I('Strategy + Factory','Calcular multa','Subproceso incluido: la Factory entrega la estrategia y esta calcula el monto.',['Una sola implementación para cobro y reportes'])
  },
  views:[{vb:'0 0 900 470',init:'biblio',
    nodes:[
      {id:'lector',x:20,y:50,w:150,h:64,t:'Lector',s:'Actor',k:'actor'},
      {id:'biblio',x:20,y:200,w:150,h:64,t:'Bibliotecario',s:'Actor',k:'actor'},
      {id:'admin',x:20,y:345,w:150,h:64,t:'Administrador',s:'Actor',k:'actor'},
      {id:'buscar',x:350,y:20,w:210,h:56,t:'Buscar en catálogo',s:'RF-02',k:'uc'},
      {id:'reservar',x:350,y:95,w:210,h:56,t:'Reservar ejemplar',s:'CU-02 · RF-06',k:'uc'},
      {id:'prestar',x:350,y:170,w:210,h:56,t:'Prestar libro',s:'CU-01 · RF-03',k:'uc'},
      {id:'devolver',x:350,y:245,w:210,h:56,t:'Devolver con multa',s:'CU-03 · RF-05',k:'uc'},
      {id:'reportes',x:350,y:320,w:210,h:56,t:'Reporte de morosos',s:'HU-05 · RF-08',k:'uc'},
      {id:'tarifas',x:350,y:395,w:210,h:56,t:'Configurar tarifas',s:'HU-03',k:'uc'},
      {id:'notif',x:670,y:95,w:200,h:56,t:'Notificar disponibilidad',s:'Observer',k:'ghost'},
      {id:'multa',x:670,y:245,w:200,h:56,t:'Calcular multa',s:'Strategy + Factory',k:'ghost'}],
    edges:[{a:'lector',b:'buscar'},{a:'lector',b:'reservar'},{a:'biblio',b:'buscar'},{a:'biblio',b:'prestar'},{a:'biblio',b:'devolver'},{a:'admin',b:'reportes'},{a:'admin',b:'tarifas'},
      {a:'reservar',b:'notif',l:'«include»',dash:1},{a:'devolver',b:'multa',l:'«include»',dash:1}],
    flows:[{label:'Flujo del lector',seq:['lector','reservar','notif']},{label:'Flujo del bibliotecario',seq:['biblio','devolver','multa']}]}]
});

/* ---------- 09 · Strategy ---------- */
mountDG($('#dg-strategy'),{
  initial:'iface',
  onSelect:id=>{if(['est','doc','vip'].includes(id))setKey(id)},
  info:{
    svc:I('Cliente','ReturnService','Servicio de aplicación que registra devoluciones. Depende solo de la interfaz FineStrategy y nunca pregunta el tipo de usuario.',['Recibe la estrategia ya elegida por la Factory','Cero condicionales por tipo de usuario','Se prueba inyectando una estrategia falsa']),
    iface:I('Contrato','«interface» FineStrategy','Contrato común de todas las políticas de multa.',['calculate(days, bookValue): Money','Principio abierto/cerrado (OCP)','Inversión de dependencias (DIP)']),
    est:I('Implementación','EstudianteStrategy','La tarifa más alta y sin periodo de gracia.',['$0.50 por día','Sin días de gracia','Tope: valor del libro']),
    doc:I('Implementación','DocenteStrategy','Tarifa intermedia con cinco días de gracia.',['$0.25 por día','5 días de gracia','Tope: valor del libro']),
    vip:I('Implementación','VipStrategy','Tarifa baja, diez días de gracia y tope fijo.',['$0.10 por día','10 días de gracia','Tope: $20']),
    new:I('Extensión futura','BecarioStrategy (ejemplo)','Agregar una categoría es crear una clase nueva y una línea en la Factory. Ninguna clase existente se modifica.',['Cumple RNF-03 (mantenibilidad)','Se prueba sola, sin tocar las demás'])
  },
  views:[{vb:'0 0 820 360',
    nodes:[
      {id:'svc',x:30,y:40,w:200,h:80,t:'ReturnService',s:'Servicio de aplicación',k:'port'},
      {id:'iface',x:300,y:40,w:220,h:80,t:'«interface» FineStrategy',s:'calculate(days, bookValue)',k:'core'},
      {id:'new',x:600,y:40,w:190,h:80,t:'BecarioStrategy',s:'Extensión futura',k:'ghost'},
      {id:'est',x:50,y:240,w:200,h:80,t:'EstudianteStrategy',s:'$0.50/día · gracia 0'},
      {id:'doc',x:310,y:240,w:200,h:80,t:'DocenteStrategy',s:'$0.25/día · gracia 5 d'},
      {id:'vip',x:570,y:240,w:200,h:80,t:'VipStrategy',s:'$0.10/día · gracia 10 d · tope $20'}],
    edges:[{a:'svc',b:'iface',l:'usa'},{a:'est',b:'iface',dash:1},{a:'doc',b:'iface',l:'implementa',dash:1},{a:'vip',b:'iface',dash:1},{a:'new',b:'iface',l:'extiende',dash:1}],
    flows:[{label:'Calcular multa',seq:['svc','iface','doc']},{label:'Agregar categoría (OCP)',seq:['new','iface']}]}]
});

/* ---------- 09 · Factory ---------- */
mountDG($('#dg-factory'),{
  initial:'fac',
  onFlow:f=>{if(f.key){const cls=S[f.key].cls;$('#fo').textContent='→ forUser("'+S[f.key].n+'") crea '+cls;gsap.from('#fo',{scale:.9,opacity:0,duration:.5,ease:'back.out(2)'})}},
  info:{
    svc:I('Cliente','ReturnService','Pide una estrategia por tipo de usuario y la usa. No conoce las clases concretas.',['Una sola línea: factory.forUser(type)']),
    fac:I('Factory','UserPolicyFactory','Único lugar que conoce las clases concretas. Crea el perfil del usuario (límite y plazo) y su estrategia de multa.',['forUser(type): FineStrategy','Elimina los if/else dispersos','Agregar un tipo = una línea aquí']),
    est:I('Producto','EstudianteStrategy','Estrategia creada para el tipo «estudiante».',['Límite 3 préstamos · plazo 7 días']),
    doc:I('Producto','DocenteStrategy','Estrategia creada para el tipo «docente».',['Límite 5 préstamos · plazo 15 días']),
    vip:I('Producto','VipStrategy','Estrategia creada para el tipo «VIP».',['Límite 10 préstamos · plazo 30 días'])
  },
  views:[{vb:'0 0 820 340',
    nodes:[
      {id:'svc',x:30,y:130,w:180,h:80,t:'ReturnService',s:'cliente',k:'port'},
      {id:'fac',x:290,y:130,w:220,h:80,t:'UserPolicyFactory',s:'forUser(type)',k:'core'},
      {id:'est',x:600,y:20,w:200,h:76,t:'EstudianteStrategy'},
      {id:'doc',x:600,y:132,w:200,h:76,t:'DocenteStrategy'},
      {id:'vip',x:600,y:244,w:200,h:76,t:'VipStrategy'}],
    edges:[{a:'svc',b:'fac',l:'forUser(type)'},{a:'fac',b:'est',l:'crea',dash:1},{a:'fac',b:'doc',dash:1},{a:'fac',b:'vip',dash:1}],
    flows:[{label:'Estudiante',key:'est',seq:['svc','fac','est']},{label:'Docente',key:'doc',seq:['svc','fac','doc']},{label:'VIP',key:'vip',seq:['svc','fac','vip']}]}]
});

/* ---------- 09 · Observer ---------- */
const OBS={ob_email:'NotificadorEmail avisa a la reserva #204',ob_panel:'PanelBibliotecario actualizado',ob_audit:'Auditoría registrada',ob_sms:'NotificadorSMS envía un mensaje al lector'};
let dgObs;
const obsActive=()=>Object.keys(OBS).filter(id=>!dgObs.isOff(id));
dgObs=mountDG($('#dg-observer'),{
  initial:'ob_pub',off:['ob_sms'],
  onFlow:()=>{
    const L=$('#log');L.innerHTML='';
    ['LibroDevuelto publicado',...obsActive().map(id=>OBS[id])].forEach((t,i)=>{const li=document.createElement('li');li.textContent=t;L.append(li);gsap.from(li,{x:-30,opacity:0,delay:.5+i*.45,duration:.5})});
  },
  info:{
    ob_src:I('Fuente del evento','RegistrarDevolucion','El caso de uso publica LibroDevuelto y termina. No sabe quién escucha.',['Acoplamiento mínimo','Agregar canales no lo modifica']),
    ob_pub:I('Subject','EventPublisher','Mantiene la lista de suscriptores y les entrega cada evento.',['subscribe(o) / unsubscribe(o)','publish(evt)']),
    ob_email:I('Observer','NotificadorEmail','Avisa al primer lector de la cola de reservas (HU-04).',['Se apoya en el puerto NotificationSender']),
    ob_panel:I('Observer','PanelBibliotecario','Actualiza el panel del mostrador en tiempo real.',['Sin recargar la pantalla']),
    ob_audit:I('Observer','Auditoría','Registra el evento en un log de solo-anexar (RNF-07).',['Quién, cuándo y qué cambió']),
    ob_sms:I('Observer nuevo','NotificadorSMS','Ejemplo de extensión: se suscribe una clase nueva y listo.',['Actívalo con el interruptor «SMS (nuevo)»','Cero cambios en la devolución'])
  },
  views:[{vb:'0 0 820 380',
    nodes:[
      {id:'ob_src',x:30,y:20,w:210,h:76,t:'RegistrarDevolucion',s:'publica LibroDevuelto',k:'port'},
      {id:'ob_pub',x:30,y:150,w:210,h:96,t:'EventPublisher',s:'subscribe · publish',k:'core'},
      {id:'ob_email',x:540,y:15,w:240,h:68,t:'NotificadorEmail',s:'onEvent(evt)'},
      {id:'ob_panel',x:540,y:105,w:240,h:68,t:'PanelBibliotecario',s:'onEvent(evt)'},
      {id:'ob_audit',x:540,y:195,w:240,h:68,t:'Auditoría',s:'onEvent(evt)'},
      {id:'ob_sms',x:540,y:285,w:240,h:68,t:'NotificadorSMS',s:'suscriptor nuevo',k:'ghost'}],
    edges:[{a:'ob_src',b:'ob_pub',l:'publish(evt)'},{a:'ob_pub',b:'ob_email',l:'notifica'},{a:'ob_pub',b:'ob_panel'},{a:'ob_pub',b:'ob_audit'},{a:'ob_pub',b:'ob_sms',dash:1}],
    flows:[{label:'Publicar LibroDevuelto',seq:()=>['ob_src','ob_pub',obsActive()]}]}]
});
$$('#subs input').forEach(i=>i.addEventListener('change',()=>{dgObs.setOff(i.dataset.sub,!i.checked);dgObs.select(i.dataset.sub)}));

/* ---------- 10 · Hexagonal ---------- */
mountDG($('#dg-hex'),{
  initial:'core',
  info:{
    api:I('Adaptador de entrada','API REST','Traduce HTTP a llamadas a los puertos de entrada.',['Controllers delgados','Valida formato, no reglas de negocio']),
    web:I('Adaptador de entrada','Interfaz web','Pantallas del mostrador y del lector. Invoca los mismos casos de uso que la API.',['Ninguna regla vive en la pantalla']),
    p1:I('Puerto de entrada','PrestarLibro','Caso de uso expuesto como interfaz. Orquesta el dominio y los puertos de salida.',['Define qué hace el sistema, no cómo']),
    p2:I('Puerto de entrada','ReservarEjemplar','Caso de uso que gestiona la cola de reservas con control de versión.',['Reintenta ante conflicto de versión']),
    core:I('Dominio','Dominio','Entidades y reglas puras: Préstamo, Reserva y las estrategias de multa. No importa ninguna librería de infraestructura.',['Strategy · Factory · Observer viven aquí','Se prueba en milisegundos con repositorios en memoria','Nada del interior conoce al exterior']),
    o1:I('Puerto de salida','LoanRepository','Interfaz definida por el dominio para guardar y leer préstamos.',['Implementada por adaptadores']),
    o2:I('Puerto de salida','NotificationSender','Interfaz para enviar avisos sin saber por qué canal.',['El Observer la usa para el correo']),
    a1:I('Adaptador de salida','Repositorio SQL','Implementa LoanRepository con la base real.',['Bloqueo optimista (columna version)','Restricción única contra reservas duplicadas']),
    a2:I('Adaptador de pruebas','Repositorio en memoria','Mismo puerto, sin base de datos. Hace las pruebas unitarias instantáneas.',['Solo se usa en pruebas']),
    a3:I('Adaptador de salida','Cliente SMTP','Implementa NotificationSender enviando correos.',['Cambiar de proveedor = otro adaptador']),
    l1:I('Capa 1','Entidades y dominio','Reglas de negocio de toda la institución. La capa más estable.',['Préstamo, Reserva, FineStrategy','No depende de nada']),
    l2:I('Capa 2','Casos de uso','Reglas de la aplicación: orquestan entidades y definen los puertos.',['PrestarLibro, ReservarEjemplar, RegistrarDevolucion','Solo depende del dominio']),
    l3:I('Capa 3','Adaptadores de interfaz','Convierten datos entre el formato de la web o la base y el de los casos de uso.',['Controllers, repositorios, gateways']),
    l4:I('Capa 4','Frameworks e infraestructura','Detalles reemplazables: framework web, motor de base de datos, servidor de correo.',['La capa más volátil y más externa'])
  },
  views:[
   {label:'Puertos y adaptadores',vb:'0 0 900 420',init:'core',
    nodes:[
      {id:'api',x:15,y:70,w:135,h:64,t:'API REST',s:'adaptador',k:'port'},
      {id:'web',x:15,y:286,w:135,h:64,t:'Interfaz web',s:'adaptador',k:'port'},
      {id:'p1',x:185,y:70,w:125,h:64,t:'PrestarLibro',s:'puerto de entrada'},
      {id:'p2',x:185,y:286,w:125,h:64,t:'ReservarEjemplar',s:'puerto de entrada'},
      {id:'core',shape:'hex',x:450,y:210,r:118,t:'DOMINIO',s:'Strategy · Factory · Observer',k:'core'},
      {id:'o1',x:590,y:70,w:125,h:64,t:'LoanRepository',s:'puerto de salida'},
      {id:'o2',x:590,y:286,w:125,h:64,t:'NotificationSender',s:'puerto de salida'},
      {id:'a1',x:745,y:20,w:140,h:60,t:'Repositorio SQL',s:'bloqueo optimista',k:'port'},
      {id:'a2',x:745,y:110,w:140,h:60,t:'Repo en memoria',s:'solo pruebas',k:'ghost'},
      {id:'a3',x:745,y:288,w:140,h:60,t:'Cliente SMTP',s:'correo',k:'port'}],
    edges:[{a:'api',b:'p1'},{a:'api',b:'p2'},{a:'web',b:'p2'},{a:'p1',b:'core'},{a:'p2',b:'core'},{a:'core',b:'o1'},{a:'core',b:'o2'},{a:'o1',b:'a1'},{a:'o1',b:'a2',dash:1},{a:'o2',b:'a3'}],
    flows:[{label:'Petición: prestar libro',seq:['api','p1','core','o1','a1']},{label:'Notificar al lector',seq:['web','p2','core','o2','a3']}]},
   {label:'Capas (regla de dependencias)',vb:'0 0 900 460',init:'l1',
    nodes:[
      {id:'l4',x:450,y:230,r:222,lbl:'top',fx:450,fy:34,t:'Frameworks e infraestructura',s:'BD · Web · SMTP',k:'r4'},
      {id:'l3',x:450,y:230,r:172,lbl:'top',fx:450,fy:84,t:'Adaptadores de interfaz',s:'Controllers · Repositorios · Gateways',k:'r3'},
      {id:'l2',x:450,y:230,r:122,lbl:'top',fx:450,fy:134,t:'Casos de uso',s:'PrestarLibro · ReservarEjemplar',k:'r2'},
      {id:'l1',x:450,y:230,r:72,fx:450,fy:232,t:'Entidades',s:'Préstamo · Reserva',k:'r1'}],
    edges:[],
    flows:[{label:'Regla de dependencia (hacia adentro)',seq:['l4','l3','l2','l1']}]}
  ]
});

/* ---------- 11 · Pirámide de pruebas ---------- */
mountDG($('#dg-tests'),{
  initial:'unit',
  info:{
    e2e:I('10% · pocas','E2E','Flujos completos por la API contra un entorno parecido al real.',['Prestar → reservar → devolver con multa → recibir el aviso','Minutos de ejecución, las más frágiles','Herramientas: Playwright o similar sobre la API']),
    int:I('20% · algunas','Integración','Adaptadores contra infraestructura real en contenedor.',['Repositorio SQL contra una base real','Prueba de dos reservas simultáneas: debe quedar una sola ganadora','Segundos de ejecución']),
    unit:I('70% · muchas','Unitarias','Dominio y servicios con repositorios en memoria.',['Cada FineStrategy con casos límite: día 0, justo en la gracia, tope','Factory y Observer con dobles de prueba','Corren en milisegundos y sostienen el 80% de cobertura'])
  },
  views:[{vb:'0 0 900 330',
    nodes:[
      {id:'e2e',x:300,y:20,w:300,h:85,t:'E2E · 10%',s:'Flujos completos por la API',k:'e'},
      {id:'int',x:170,y:120,w:560,h:85,t:'Integración · 20%',s:'Repositorio SQL real · concurrencia',k:'i'},
      {id:'unit',x:40,y:220,w:820,h:85,t:'Unitarias · 70%',s:'Dominio · Strategy · Factory · Observer',k:'u'}],
    edges:[],
    flows:[{label:'Subir la pirámide (más lento y costoso)',seq:['unit','int','e2e']}]}]
});

/* ---------- 13 · Infraestructura y despliegue ---------- */
const ci=(i,t,s,k)=>({id:'ci'+i,x:10+(i-1)*126,y:80,w:112,h:84,t,s,k});
mountDG($('#dg-deploy'),{
  initial:'ci1',
  info:{
    ci1:I('CI/CD','Commit','Cada push a main dispara el pipeline.',['Ramas pequeñas y revisión de código']),
    ci2:I('CI/CD','Build','Instala dependencias de forma reproducible y compila.',['npm ci · lint']),
    ci3:I('CI/CD','Pruebas','Unitarias e integración en cada cambio. Falla si la cobertura baja del 80%.',['Pirámide de pruebas automatizada']),
    ci4:I('CI/CD','Seguridad','Análisis estático y escaneo de dependencias antes de empaquetar.',['SAST · auditoría de dependencias']),
    ci5:I('CI/CD','Imagen Docker','Construye y publica una imagen inmutable etiquetada con el hash del commit.',['Multi-stage, usuario sin privilegios']),
    ci6:I('CI/CD','Staging','Despliegue automático a un entorno previo con las pruebas E2E.',['Mismos contenedores que producción']),
    ci7:I('CI/CD','Producción','Despliegue azul/verde con aprobación: la versión nueva se activa sin cortar el servicio.',['Health checks antes de cambiar el tráfico']),
    ci8:I('CI/CD','Rollback','Si la verificación falla, el tráfico vuelve a la versión anterior en segundos.',['La imagen anterior sigue disponible']),
    d_user:I('Cliente','Navegador','Lectores y bibliotecarios acceden por HTTPS.'),
    d_proxy:I('Contenedor','proxy · Nginx','Termina TLS y reenvía al API. Sirve los archivos estáticos.',['Único contenedor expuesto']),
    d_api:I('Contenedor','api','Aplicación con el dominio y los adaptadores REST. Sin estado: se puede replicar.',['Imagen construida por el pipeline','Healthcheck en /health']),
    d_worker:I('Contenedor','worker','Procesa la cola de notificaciones (patrón outbox) sin bloquear al API.',['Reintentos ante fallos del correo']),
    d_db:I('Contenedor','db · PostgreSQL','Base de datos con volumen persistente.',['Restricción única + versión para reservas']),
    d_cache:I('Contenedor','cache · Redis','Caché de búsquedas del catálogo y limitador de peticiones.',['Ayuda a cumplir RNF-01 (200 ms)']),
    d_smtp:I('Servicio externo','Servidor SMTP','Proveedor de correo, detrás del puerto NotificationSender.'),
    c_users:I('Cliente','Usuarios','Lectores, bibliotecarios y administradores.'),
    c_cdn:I('Nube','CDN + WAF','Entrega los estáticos desde el borde y filtra tráfico malicioso.',['Reduce la carga del API']),
    c_lb:I('Nube','Balanceador de carga','Reparte peticiones entre réplicas sanas y hace health checks.',['TLS 1.3']),
    c_api:I('Nube','API × 3','Réplicas sin estado con autoescalado según carga.',['Cumple el 99.9% en horario de atención']),
    c_dbp:I('Nube','DB primaria','PostgreSQL gestionado con copias automáticas y cifrado en reposo.',['Backups con restauración probada']),
    c_dbr:I('Nube','DB réplica','Réplica de lectura y destino de failover.',['Reportes sin cargar al primario']),
    c_cache:I('Nube','Caché Redis','Caché gestionada para catálogo y sesiones.'),
    c_q:I('Nube','Cola de mensajes','Desacopla las notificaciones del flujo principal.',['Reintentos y dead-letter']),
    c_mon:I('Nube','Observabilidad','Logs, métricas y alertas (latencia p95, errores, saturación).',['Alertas al equipo de mantenimiento'])
  },
  views:[
   {label:'CI/CD',vb:'0 0 900 270',init:'ci1',
    nodes:[ci(1,'Commit','git push'),ci(2,'Build','npm ci · lint'),ci(3,'Pruebas','unit + integración'),ci(4,'Seguridad','SAST · deps'),ci(5,'Imagen','Docker build'),ci(6,'Staging','E2E automático'),ci(7,'Producción','blue/green'),
      {id:'ci8',x:774,y:200,w:112,h:52,t:'Rollback',k:'ghost'}],
    edges:[1,2,3,4,5,6].map(i=>({a:'ci'+i,b:'ci'+(i+1)})).concat([{a:'ci7',b:'ci8',l:'si falla',dash:1}]),
    flows:[{label:'Pipeline completo',seq:['ci1','ci2','ci3','ci4','ci5','ci6','ci7']},{label:'Falla en producción',seq:['ci7','ci8']}]},
   {label:'Docker',vb:'0 0 900 380',init:'d_api',
    nodes:[
      {id:'d_user',x:20,y:150,w:120,h:70,t:'Navegador',k:'actor'},
      {id:'d_proxy',x:190,y:150,w:150,h:70,t:'proxy · Nginx',s:':80 / :443 · TLS',k:'port'},
      {id:'d_api',x:410,y:150,w:150,h:70,t:'api',s:'contenedor Node',k:'core'},
      {id:'d_worker',x:410,y:290,w:150,h:70,t:'worker',s:'notificaciones'},
      {id:'d_db',x:670,y:30,w:200,h:70,t:'db · PostgreSQL',s:'volumen pgdata'},
      {id:'d_cache',x:670,y:150,w:200,h:70,t:'cache · Redis'},
      {id:'d_smtp',x:670,y:290,w:200,h:70,t:'Servidor SMTP',s:'servicio externo',k:'ghost'}],
    edges:[{a:'d_user',b:'d_proxy'},{a:'d_proxy',b:'d_api'},{a:'d_api',b:'d_db'},{a:'d_api',b:'d_cache'},{a:'d_api',b:'d_worker',l:'cola (outbox)'},{a:'d_worker',b:'d_smtp'}],
    flows:[{label:'Petición HTTP',seq:['d_user','d_proxy','d_api',['d_db','d_cache']]},{label:'Notificación',seq:['d_api','d_worker','d_smtp']}]},
   {label:'Cloud',vb:'0 0 900 400',init:'c_api',
    nodes:[
      {id:'c_users',x:15,y:160,w:110,h:64,t:'Usuarios',k:'actor'},
      {id:'c_cdn',x:150,y:160,w:120,h:64,t:'CDN + WAF',k:'port'},
      {id:'c_lb',x:295,y:160,w:130,h:64,t:'Load Balancer',k:'port'},
      {id:'c_api',x:460,y:150,w:150,h:84,t:'API × 3',s:'autoescalado',k:'core'},
      {id:'c_mon',x:460,y:315,w:150,h:64,t:'Observabilidad',s:'logs · métricas',k:'ghost'},
      {id:'c_dbp',x:700,y:25,w:180,h:70,t:'DB primaria',s:'PostgreSQL gestionado'},
      {id:'c_dbr',x:700,y:115,w:180,h:70,t:'DB réplica',s:'lectura + failover'},
      {id:'c_cache',x:700,y:205,w:180,h:70,t:'Caché Redis'},
      {id:'c_q',x:700,y:295,w:180,h:70,t:'Cola de mensajes'}],
    edges:[{a:'c_users',b:'c_cdn'},{a:'c_cdn',b:'c_lb'},{a:'c_lb',b:'c_api'},{a:'c_api',b:'c_dbp'},{a:'c_api',b:'c_cache'},{a:'c_api',b:'c_q'},{a:'c_dbp',b:'c_dbr',l:'replica',dash:1},{a:'c_api',b:'c_mon',l:'telemetría',dash:1}],
    flows:[{label:'Petición de usuario',seq:['c_users','c_cdn','c_lb','c_api',['c_dbp','c_cache']]},{label:'Failover de base de datos',seq:['c_dbp','c_dbr']}]}
  ]
});
$$('#codetabs button').forEach(b=>b.addEventListener('click',()=>{
  $$('#codetabs button').forEach(x=>x.classList.toggle('on',x===b));
  $$('.code').forEach(c=>c.classList.toggle('on',c.id===b.dataset.code));
}));

/* ================= 12 · MATRIZ DE RIESGOS ================= */
const RISKS=[
 {id:'R1',n:'Condición de carrera en reservas',p:4,i:5,o:'Mantenedores',m:['Bloqueo optimista con columna version','Restricción única que impide dos turnos activos iguales','Prueba de integración con dos reservas simultáneas']},
 {id:'R2',n:'Migración de datos del sistema legacy',p:4,i:4,o:'Mantenedores',m:['Migración incremental con validación por lotes','Ejecución en paralelo antes del corte','Plan de reversa documentado']},
 {id:'R3',n:'Fuga de datos personales de lectores',p:2,i:5,o:'Administradores',m:['Cifrado en tránsito y en reposo','RBAC con mínimo privilegio','Auditoría de accesos']},
 {id:'R4',n:'Caída del servicio en horario de atención',p:2,i:4,o:'Mantenedores',m:['Réplicas con health checks y autoescalado','Despliegue azul/verde con rollback','Backups con restauración probada']},
 {id:'R5',n:'Resistencia al cambio del personal',p:3,i:3,o:'Administradores',m:['Piloto con un grupo de bibliotecarios','Capacitación corta y manual de mostrador']},
 {id:'R6',n:'Sobre-ingeniería y retraso del cronograma',p:3,i:3,o:'Mantenedores',m:['Entregas incrementales por historia de usuario','Revisión de alcance en cada sprint']},
 {id:'R7',n:'Fallo del proveedor de correo',p:3,i:2,o:'Mantenedores',m:['Cola con reintentos (outbox)','Adaptador alterno gracias al puerto NotificationSender']},
 {id:'R8',n:'Tarifa de multa mal aplicada tras un cambio',p:2,i:3,o:'Administradores',m:['Una sola estrategia para cobro y reportes','Pruebas con casos límite por cada estrategia']}
];
const lvl=r=>{const s=r.p*r.i;return s>=15?'Crítico':s>=10?'Alto':s>=5?'Medio':'Bajo'};
const grid=$('#rmgrid');
for(let i=5;i>=1;i--)for(let p=1;p<=5;p++){const c=document.createElement('div');c.className='cell';c.style.setProperty('--s',p*i/25);c.dataset.p=p;c.dataset.i=i;grid.append(c)}
RISKS.forEach(r=>{
  const b=document.createElement('button');b.type='button';b.className='dotr';b.textContent=r.id;b.dataset.id=r.id;b.setAttribute('aria-label',r.n);
  grid.querySelector(`[data-p="${r.p}"][data-i="${r.i}"]`).append(b);
  b.addEventListener('click',()=>pickRisk(r.id));
});
$('#rtable tbody').innerHTML=RISKS.map(r=>`<tr data-id="${r.id}"><td>${r.id}</td><td>${r.n}</td><td>${r.p}/5</td><td>${r.i}/5</td><td><span class="tag ${lvl(r)==='Crítico'||lvl(r)==='Alto'?'':lvl(r)==='Medio'?'m':'b'}">${lvl(r)}</span></td><td>${r.o}</td></tr>`).join('');
$$('#rtable tbody tr').forEach(tr=>tr.addEventListener('click',()=>pickRisk(tr.dataset.id)));
function pickRisk(id){
  const r=RISKS.find(x=>x.id===id);
  $$('.dotr').forEach(d=>d.classList.toggle('sel',d.dataset.id===id));
  $$('#rtable tbody tr').forEach(t=>t.classList.toggle('sel',t.dataset.id===id));
  const pn=$('#rpanel');
  pn.innerHTML=`<span class="badge">${r.id} · ${lvl(r)}</span><h4>${r.n}</h4><p>Probabilidad <b>${r.p}/5</b> × impacto <b>${r.i}/5</b> = puntaje <b>${r.p*r.i}</b>. Responsable: <b>${r.o}</b>.</p><h4 style="font-size:12px;color:var(--red);text-transform:uppercase;letter-spacing:.05em">Mitigación</h4><ul>${r.m.map(x=>`<li>${x}</li>`).join('')}</ul>`;
  if(!RM){gsap.from(pn.children,{y:14,opacity:0,stagger:.06,duration:.45,ease:'power3.out'});gsap.fromTo(`.dotr[data-id="${id}"]`,{scale:.6},{scale:1.25,duration:.6,ease:'elastic.out(1,.4)'})}
}
$$('.acc-h').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));
$$('.acc-item')[0].classList.add('open');

/* ================= LABORATORIO INTERACTIVO ================= */
const CAT0=()=>[
 {id:'LIB-001',t:'Don Quijote de la Mancha',a:'Miguel de Cervantes',tag:'Clásico',v:25,copies:3,av:3,q:[],ver:1},
 {id:'LIB-002',t:'Cien años de soledad',a:'Gabriel García Márquez',tag:'Clásico',v:22,copies:2,av:2,q:[],ver:1},
 {id:'LIB-003',t:'Refactoring',a:'Martin Fowler',tag:'Software',v:45,copies:1,av:0,q:['Marta Gómez'],ver:2},
 {id:'LIB-004',t:'Design Patterns',a:'Gamma, Helm, Johnson, Vlissides',tag:'Software',v:60,copies:2,av:1,q:[],ver:1},
 {id:'LIB-005',t:'Designing Data-Intensive Applications',a:'Martin Kleppmann',tag:'Software',v:50,copies:1,av:0,q:[],ver:3}
];
let CAT,LOANS,FINES;
function resetLab(){CAT=CAT0();LOANS=[{name:'Prof. Luis',type:'doc',book:'LIB-003'}];FINES={};renderCat();renderLoans()}
const f=$('#labf'),stepsEl=$('#steps'),resEl=$('#res');
let busy=false;
$('#catlist').innerHTML=CAT0().map(b=>`<option value="${b.t}">`).join('');
const money=n=>'$'+n.toFixed(2);
function renderCat(flashId){
  $('#cat').innerHTML=CAT.map(b=>`<div class="cb${b.id===flashId?' flash':''}"><div><b>${b.t}</b><small>${b.id} · ${b.a}${b.q.length?' · cola: '+b.q.length:''}</small></div><span class="av${b.av?'':' zero'}">${b.av}/${b.copies}</span></div>`).join('');
}
function renderLoans(){
  const l=LOANS.map(x=>`<div><b>${esc(x.name)}</b> · ${S[x.type].n} · ${CAT.find(b=>b.id===x.book).t}</div>`).join('')||'<div>Sin préstamos activos.</div>';
  const fl=Object.entries(FINES).filter(e=>e[1]>0).map(e=>`<div class="flash"><b>${esc(e[0])}</b> · multa pendiente ${money(e[1])}</div>`).join('');
  $('#loans').innerHTML=l+(fl?'<div style="margin-top:8px;color:var(--g)">Multas:</div>'+fl:'');
}
function findBook(q){const n=norm(q);if(!n)return null;return CAT.find(b=>norm(b.id)===n)||CAT.find(b=>norm(b.t+' '+b.a+' '+b.id).includes(n))}
function syncFields(){
  const op=f.op.value,show={name:op!=='buscar',type:op==='prestar'||op==='devolver',days:op==='devolver',sim:op==='reservar'};
  $$('[data-f]').forEach(e=>e.classList.toggle('hide',!show[e.dataset.f]));
}
f.op.addEventListener('change',syncFields);syncFields();
async function addStep(txt){
  if(stepsEl.querySelector('.idle'))stepsEl.innerHTML='';
  const li=document.createElement('li');li.innerHTML=`<span class="ic"></span><span>${txt}</span>`;stepsEl.append(li);
  if(!RM)gsap.from(li,{x:-24,opacity:0,duration:.4,ease:'power3.out'});
  await sleep(RM?60:520);
  return st=>{li.classList.add(st);li.querySelector('.ic').textContent=st==='ok'?'✓':st==='bad'?'✕':'!';if(!RM)gsap.fromTo(li.querySelector('.ic'),{scale:.4},{scale:1,duration:.4,ease:'back.out(3)'})};
}
async function runLab(){
  if(busy)return;busy=true;$('#runbtn').disabled=true;
  stepsEl.innerHTML='';resEl.hidden=true;resEl.className='res';
  const op=f.op.value,name=f.name.value.trim(),type=f.type.value,q=f.book.value.trim(),days=Math.max(0,+f.days.value||0),sim=f.sim.checked;
  const st=async(t,s='ok')=>{(await addStep(t))(s)};
  let result=null,flashId=null;
  const fail=(title,body)=>{result={bad:true,title,body}};
  try{
    if(op==='buscar'){
      await st(`Normalizar consulta «${esc(q)||'(vacía)'}»`);
      await st('Consultar el índice del catálogo (RF-02)');
      const hits=q?CAT.filter(b=>norm(b.t+' '+b.a+' '+b.id+' '+b.tag).includes(norm(q))):CAT;
      await st(`${hits.length} resultado(s) encontrado(s)`,hits.length?'ok':'warn');
      result={title:hits.length?`${hits.length} resultado(s)`:'Sin resultados',body:hits.length?'<ul>'+hits.map(b=>`<li><b>${b.t}</b> — ${b.a} · ${b.av}/${b.copies} disponibles</li>`).join('')+'</ul>':'<p>Prueba con otro título, autor o código.</p>',bad:!hits.length};
    }else{
      if(!name){await st('Validar lector: falta el nombre','bad');fail('Falta el lector','Escribe el nombre del lector para continuar.')}
      else{
        const book=findBook(q);
        if(op==='prestar'){
          const s=S[type];
          await st(`Validar lector: <code>${esc(name)}</code> (${s.n})`);
          const n=LOANS.filter(l=>norm(l.name)===norm(name)).length;
          if(n>=s.limit){await st(`Límite de préstamos: ${n}/${s.limit}`,'bad');fail('Límite alcanzado',`${esc(name)} ya tiene ${n} préstamos activos.`)}
          else{
            await st(`Límite de préstamos: ${n}/${s.limit}`);
            const fp=FINES[name]||0;
            if(fp>0){await st(`Multa pendiente de ${money(fp)}: préstamo bloqueado`,'bad');fail('Préstamo bloqueado',`Cobra la multa de ${money(fp)} antes de prestar (alternativa de CU-01).`)}
            else{
              await st('Sin multas pendientes');
              if(!book){await st('Buscar el ejemplar en el catálogo','bad');fail('Libro no encontrado','Revisa el título o el código.')}
              else{
                await st(`Ejemplar localizado: <code>${book.id}</code> ${book.t}`);
                if(book.av<1){await st('Disponibilidad: 0 ejemplares','bad');fail('No hay ejemplares',`Puedes <b>reservar</b> «${book.t}» y recibir un aviso cuando se libere.`)}
                else{
                  await st(`Disponibilidad: ${book.av}/${book.copies}`);
                  book.av--;LOANS.push({name,type,book:book.id});flashId=book.id;
                  await st('Registrar préstamo en una transacción');
                  const due=new Date(Date.now()+s.period*864e5).toLocaleDateString('es-GT',{day:'numeric',month:'long',year:'numeric'});
                  await st(`Vencimiento = hoy + ${s.period} días → <b>${due}</b>`);
                  result={title:'Préstamo registrado',body:`<p><b>${book.t}</b> para ${esc(name)} (${s.n}).</p><p>Vence el <b>${due}</b>. Quedan ${book.av} ejemplar(es).</p>`};
                }
              }
            }
          }
        }else if(op==='devolver'){
          const s=S[type];
          await st(`Buscar préstamo activo de <code>${esc(name)}</code>`);
          const li=book?LOANS.findIndex(l=>norm(l.name)===norm(name)&&l.book===book.id):-1;
          if(!book||li<0){await st('Préstamo activo no encontrado','bad');fail('Sin préstamo activo','Ese lector no tiene ese libro prestado.')}
          else{
            await st(`Préstamo encontrado: ${book.t}`);
            await st(`Días de retraso: <b>${days}</b>`,days?'warn':'ok');
            await st(`Factory.forUser("${s.n}") → <code>${s.cls}</code>`);
            const amt=fine(type,days,book.v),eff=Math.max(0,days-s.grace);
            await st(`calculate(${days}) = ${eff} d × $${s.rate} = <b>${money(amt)}</b>${s.cap&&eff*s.rate>s.cap?' (tope $'+s.cap+')':''}`,amt>0?'warn':'ok');
            LOANS.splice(li,1);book.av++;flashId=book.id;
            if(amt>0)FINES[name]=(FINES[name]||0)+amt;
            await st('Cerrar préstamo y liberar el ejemplar');
            await st('Publicar evento <code>LibroDevuelto</code>');
            if(book.q.length){const nx=book.q.shift();await st(`NotificadorEmail avisa a <b>${esc(nx)}</b> (primero en la cola)`)}
            await st('PanelBibliotecario actualizado');
            await st('Auditoría registrada');
            result={title:amt>0?`Devuelto con multa de ${money(amt)}`:'Devuelto sin multa',body:`<p><b>${book.t}</b> devuelto por ${esc(name)}.</p>${amt>0?`<p>${eff} día(s) cobrables según ${s.n}. La multa queda pendiente.</p>`:'<p>Sin retraso, no se genera multa.</p>'}`};
          }
        }else if(op==='reservar'){
          await st(`Validar lector: <code>${esc(name)}</code>`);
          if(!book){await st('Buscar el ejemplar en el catálogo','bad');fail('Libro no encontrado','Revisa el título o el código.')}
          else if(book.av>0){await st(`Hay ${book.av} ejemplar(es) disponible(s)`,'warn');fail('No hace falta reservar',`«${book.t}» está disponible: usa <b>Prestar libro</b>.`);result.bad=false}
          else if(book.q.some(x=>norm(x)===norm(name))){await st('INSERT reserva → viola la restricción única (lector, libro)','bad');fail('Reserva duplicada','Esa persona ya tiene turno en la cola.')}
          else{
            const v=book.ver;
            await st(`Leer cola de «${book.t}»: versión <code>v${v}</code>`);
            if(sim){
              await st(`Lector B también lee la versión <code>v${v}</code> al mismo tiempo`,'warn');
              await st(`A: <code>UPDATE … SET version=${v+1} WHERE version=${v}</code> → 1 fila`);
              book.q.push(name);book.ver=v+1;
              await st(`B: <code>UPDATE … WHERE version=${v}</code> → 0 filas (conflicto)`,'bad');
              await st(`B: reintenta con la versión <code>v${book.ver}</code>`,'warn');
              book.q.push('Otro lector (simultáneo)');book.ver++;
              await st('B: turno asignado tras el reintento');
              result={title:'Un solo ganador, sin duplicados',body:`<p>Turno 1: <b>${esc(name)}</b>. Turno 2: <b>Otro lector (simultáneo)</b>.</p><p>El bloqueo optimista evitó que ambos pisaran el mismo turno.</p>`};
            }else{
              await st(`<code>UPDATE … SET version=${v+1} WHERE version=${v}</code> → 1 fila`);
              book.q.push(name);book.ver=v+1;
              await st(`Posición en la cola: <b>${book.q.length}</b>`);
              result={title:'Reserva confirmada',body:`<p>${esc(name)} es el turno <b>${book.q.length}</b> para «${book.t}».</p><p>Recibirá un aviso al devolverse.</p>`};
            }
            flashId=book.id;
          }
        }
      }
    }
  }catch(e){console.error(e);fail('Error inesperado',esc(e.message))}
  if(result){
    resEl.className='res'+(result.bad?' bad':'');
    resEl.innerHTML=`<h4>${result.title}</h4>${result.body.startsWith('<')?result.body:'<p>'+result.body+'</p>'}`;
    resEl.hidden=false;
    if(!RM)gsap.from(resEl,{y:20,opacity:0,scale:.96,duration:.6,ease:'back.out(1.6)'});
  }
  renderCat(flashId);renderLoans();
  busy=false;$('#runbtn').disabled=false;
}
f.addEventListener('submit',e=>{e.preventDefault();runLab()});
$('#resetlab').addEventListener('click',()=>{if(busy)return;resetLab();stepsEl.innerHTML='<li class="idle">Datos reiniciados.</li>';resEl.hidden=true});
const EX={
 1:{op:'prestar',name:'Ana Morales',type:'est',book:'Don Quijote de la Mancha',days:0,sim:false},
 2:{op:'devolver',name:'Prof. Luis',type:'doc',book:'Refactoring',days:12,sim:false},
 3:{op:'reservar',name:'Ana Morales',type:'est',book:'Designing Data-Intensive Applications',days:0,sim:true},
 4:{op:'buscar',name:'',type:'est',book:'Martin',days:0,sim:false}
};
async function typeInto(el,txt){el.classList.add('typing');el.value='';for(const ch of txt){el.value+=ch;await sleep(RM?0:24)}el.classList.remove('typing')}
function flashFld(el){const w=el.closest('.fld');if(!w)return;w.classList.remove('flash');void w.offsetWidth;w.classList.add('flash')}
async function loadExample(n){
  if(busy)return;busy=true;
  const ex=EX[n];
  f.op.value=ex.op;syncFields();flashFld(f.op);
  f.type.value=ex.type;flashFld(f.type);
  f.days.value=ex.days;f.sim.checked=ex.sim;
  await typeInto(f.name,ex.name);
  await typeInto(f.book,ex.book);
  if(ex.op==='devolver')flashFld(f.days);
  await sleep(250);busy=false;
  runLab();
}
$$('.ex').forEach(b=>b.addEventListener('click',()=>loadExample(b.dataset.ex)));
resetLab();

/* ================= EXPORTAR A PDF ================= */
async function exportPDF(){
  const btns=$$('.pdfbtn');if(btns[0].classList.contains('busy'))return;
  btns.forEach(b=>b.classList.add('busy'));
  const y=scrollY;
  try{
    document.body.classList.remove('focus-p','focus-d');
    $$('[data-count]').forEach(e=>e.textContent=e.dataset.count);
    $$('.acc-item').forEach(a=>a.classList.add('open'));
    document.body.classList.add('pdf');scrollTo(0,0);
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    await sleep(500);
    const {jsPDF}=window.jspdf;let pdf=null;
    for(const el of $$('.pg')){
      const c=await html2canvas(el,{backgroundColor:'#0A0A0A',scale:1.5,useCORS:true,windowWidth:1280});
      const w=c.width/1.5,h=c.height/1.5;
      if(!pdf)pdf=new jsPDF({orientation:w>h?'l':'p',unit:'px',format:[w,h],hotfixes:['px_scaling']});else pdf.addPage([w,h],w>h?'l':'p');
      pdf.addImage(c.toDataURL('image/jpeg',.92),'JPEG',0,0,w,h);
    }
    pdf.save('Biblio-Patrones-de-diseno-y-arquitectura.pdf');
  }catch(err){console.error(err);alert('No se pudo generar el PDF. Revisa tu conexión (se cargan librerías externas) e inténtalo de nuevo.')}
  finally{
    document.body.classList.remove('pdf');
    $$('.acc-item').forEach((a,i)=>a.classList.toggle('open',i===0));
    scrollTo(0,y);ScrollTrigger.refresh();
    btns.forEach(b=>b.classList.remove('busy'));
  }
}
$$('.pdfbtn').forEach(b=>b.addEventListener('click',exportPDF));
