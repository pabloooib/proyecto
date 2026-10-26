gsap.registerPlugin(ScrollTrigger);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// libros y marquee
const hs=[60,85,48,100,72,90,55,78,95,66];
$('#stack').innerHTML=hs.map(h=>`<i style="height:${h}%"></i>`).join('');
$('#mq').innerHTML=('Strategy ✦ Hexagonal ✦ Clean Code ✦ SOLID ✦ ').repeat(6);
gsap.to('#mq',{xPercent:-35,ease:'none',duration:30,repeat:-1});
// dividir en palabras
$$('[data-split]').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(t=>`<span class="w"><span>${t}</span></span>`).join(' ')});
gsap.set('.w>span',{yPercent:110});
$$('[data-split]').forEach(el=>gsap.to(el.querySelectorAll('.w>span'),{yPercent:0,duration:1,stagger:.08,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 88%'},delay:el.closest('.hero')?.3||0}));
// hero: entrada orquestada
gsap.from('.giant',{yPercent:40,opacity:0,duration:1.6,ease:'power4.out'});
gsap.from('#stack i',{scaleY:0,transformOrigin:'bottom',duration:1.1,stagger:.07,ease:'back.out(1.4)',delay:.4});
gsap.from('.hero .sm',{opacity:0,y:30,duration:1,delay:1});
// revelado
$$('.card,.rv').forEach(el=>gsap.from(el,{y:70,opacity:0,scale:.96,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}}));
// paralaje
$$('[data-par]').forEach(el=>gsap.to(el,{yPercent:+el.dataset.par,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
// transición entre secciones
$$('.sec,footer').forEach(s=>gsap.fromTo(s,{borderRadius:'64px 64px 0 0',scale:.93},{borderRadius:'0px',scale:1,ease:'none',scrollTrigger:{trigger:s,start:'top bottom',end:'top 25%',scrub:true}}));
$$('[data-count]').forEach(el=>{const o={v:0};gsap.to(o,{v:+el.dataset.count,duration:1.6,onUpdate:()=>el.textContent=Math.round(o.v),scrollTrigger:{trigger:el,start:'top 90%'}})});
// cursor
$$('a,button,.card,input').forEach(el=>{el.addEventListener('mouseenter',()=>gsap.to('.halo',{scale:1.9,duration:.4}));el.addEventListener('mouseleave',()=>gsap.to('.halo',{scale:1,duration:.4}))});
// tilt 3D
$$('.tilt').forEach(el=>{
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(el,{rotateY:x*14,rotateX:-y*14,transformPerspective:900,duration:.5,ease:'power2.out'})});
  el.addEventListener('mouseleave',()=>gsap.to(el,{rotateX:0,rotateY:0,duration:.8,ease:'elastic.out(1,.5)'}));
});
// simulador Strategy
const S={est:{n:'Estudiante',rate:.5,grace:0,cap:null,cls:'EstudianteStrategy'},doc:{n:'Docente',rate:.25,grace:5,cap:null,cls:'DocenteStrategy'},vip:{n:'VIP',rate:.1,grace:10,cap:20,cls:'VipStrategy'}};
let key='est';const o={v:0};
const fine=(k,d,v)=>{const s=S[k];return Math.min(s.cap??v,Math.max(0,d-s.grace)*s.rate)};
$('#bars').innerHTML=Object.keys(S).map(k=>`<div data-k="${k}"><span class="v">$0</span><i></i><span>${S[k].n}</span></div>`).join('');
function update(){
  const d=+$('#days').value,v=+$('#val').value;
  $('#vd').textContent=d;$('#vv').textContent='$'+v;
  const vals=Object.keys(S).map(k=>fine(k,d,v)),max=Math.max(...vals,1);
  $$('#bars div').forEach((b,i)=>{b.classList.toggle('on',b.dataset.k===key);b.querySelector('.v').textContent='$'+vals[i].toFixed(2);gsap.to(b.querySelector('i'),{height:Math.max(2,vals[i]/max*85)+'%',duration:.8,ease:'power3.out'})});
  gsap.to(o,{v:fine(key,d,v),duration:.7,ease:'power3.out',onUpdate:()=>$('#out').textContent=o.v.toFixed(2)});
  let p='';for(let i=0;i<=40;i++){const f=fine(key,i,v);p+=(i?'L':'M')+(i*10)+' '+(86-f/Math.max(v,20)*80)}
  $('#curve').setAttribute('d',p);$('#mark').setAttribute('x1',d*10);$('#mark').setAttribute('x2',d*10);
  const s=S[key];
  $('#code').innerHTML=`<b>interface</b> FineStrategy { calculate(days) }\n<b>class</b> ${s.cls} {\n  rate = ${s.rate}  grace = ${s.grace} d\n  cap  = ${s.cap??'valor del libro'}\n}`;
}
$$('#seg button').forEach(b=>b.addEventListener('click',()=>{key=b.dataset.k;$$('#seg button').forEach(x=>x.classList.toggle('on',x===b));update()}));
$('#days').addEventListener('input',update);$('#val').addEventListener('input',update);
update();
// scroll suave en anclas
/* ===== ampliación ===== */
const hx=gsap.quickTo('.halo','x',{duration:.5}),hy=gsap.quickTo('.halo','y',{duration:.5});
addEventListener('mousemove',e=>{hx(e.clientX);hy(e.clientY)});
$$('.g3>*,.tw,.uml,.pyr div,.lead').forEach(el=>gsap.from(el,{y:60,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%'}}));
$$('.part .xl').forEach(el=>gsap.from(el,{scale:.6,opacity:0,ease:'none',scrollTrigger:{trigger:el,start:'top 95%',end:'top 40%',scrub:true}}));
$$('tbody tr').forEach((tr,i)=>gsap.from(tr,{x:-40,opacity:0,duration:.7,delay:(i%6)*.05,scrollTrigger:{trigger:tr,start:'top 95%'}}));
// Observer: publicar evento
$('#ret').addEventListener('click',()=>{
  const L=$('#log');
  ['LibroDevuelto publicado','NotificadorEmail avisa a la reserva #204','PanelBibliotecario actualizado','Auditoría registrada'].forEach((t,i)=>{
    const li=document.createElement('li');li.textContent=t;L.append(li);gsap.from(li,{x:-30,opacity:0,delay:i*.25});
    while(L.children.length>8)L.firstChild.remove();
  });
});
// Factory: elegir estrategia por tipo
$('#fk').addEventListener('change',e=>{
  const m={est:'EstudianteStrategy',doc:'DocenteStrategy',vip:'VipStrategy'};
  $('#fo').textContent='→ '+m[e.target.value];gsap.from('#fo',{scale:.8,opacity:0,duration:.5,ease:'back.out(2)'});
});
// Exportar a PDF (una página por bloque, conserva estilos oscuros)
async function exportPDF(){
  const btn=$('#pdf'),txt=btn.textContent;btn.textContent='Generando…';btn.disabled=true;
  ScrollTrigger.getAll().forEach(t=>t.kill());gsap.globalTimeline.clear();
  gsap.set('.w>span,.card,.rv,.sec,footer,[data-par],#stack i,.giant,.hero .sm,.g3>*,.tw,.uml,.pyr div,tbody tr,.part .xl,#mq',{clearProps:'all'});
  $$('[data-count]').forEach(e=>e.textContent=e.dataset.count);
  document.body.classList.add('pdf');scrollTo(0,0);
  await new Promise(r=>setTimeout(r,400));
  const {jsPDF}=window.jspdf;let pdf=null;
  for(const el of $$('.pg')){
    const c=await html2canvas(el,{backgroundColor:'#080808',scale:1.5,useCORS:true,windowWidth:1280});
    const w=c.width/1.5,h=c.height/1.5;
    if(!pdf)pdf=new jsPDF({orientation:w>h?'l':'p',unit:'px',format:[w,h],hotfixes:['px_scaling']});else pdf.addPage([w,h],w>h?'l':'p');
    pdf.addImage(c.toDataURL('image/jpeg',.92),'JPEG',0,0,w,h);
  }
  pdf.save('Biblio-Patrones-de-diseno-y-arquitectura.pdf');
  btn.textContent=txt;setTimeout(()=>location.reload(),600);
}
$$('.pdfbtn').forEach(b=>b.addEventListener('click',exportPDF));
