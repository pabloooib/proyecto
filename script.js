const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const S=$$('.sl'),W={1:'Expositor: José Pablo Ibañez Ibañez',2:'Expositor: Diego Josue Melgar Monzón'};let cur=0;

/* ---- contenido generado ---- */
$('#pb').innerHTML=[['Registro en fichas de papel','Datos duplicados y ejemplares que figuran disponibles estando prestados.'],['Multas calculadas a mano','Cada turno aplica un criterio distinto y los estudiantes reclaman.'],['Colas al inicio del ciclo','Un mostrador atiende préstamos, devoluciones y consultas a la vez.'],['Escalabilidad limitada','Un monolito: cambiar la regla de multas obliga a redesplegar todo.']]
.map(([t,d])=>`<div class="card" style="border-color:rgba(245,158,11,.3)"><svg class="ic"><use href="#w"/></svg><h3>${t}</h3><p>${d}</p></div>`).join('');
$('#cmp').innerHTML=[['Cambios de reglas','Reescribir y redesplegar todo','Nueva clase, sin tocar las existentes'],['Pruebas','Manuales y lentas','Automatizadas en cada commit'],['Escalado','Todo el sistema a la vez','Solo el servicio saturado'],['Avisos','Código mezclado con préstamos','Observer desacoplado'],['Multas','if/else por perfil','Strategy intercambiable']]
.map(r=>`<div class="row"><div style="color:#fff;font-weight:600">${r[0]}</div><div class="t">${r[1]}</div><div class="m">${r[2]}</div></div>`).join('');
$('#sk').innerHTML=[['E','Estudiante','Busca rápido, ve disponibilidad y recibe avisos antes del vencimiento.'],['D','Docente','Plazos más largos, material de curso reservado y renovación en línea.'],['B','Bibliotecario','Registra préstamos y devoluciones sin errores y gestiona multas con reglas claras.'],['A','Administrador','Controla usuarios y roles, y consulta reportes de uso y desempeño.']]
.map(([l,n,d])=>`<div class="card" data-i="<b>${n}:</b> ${d}" style="text-align:center;padding:30px 14px"><div style="width:64px;height:64px;margin:0 auto 14px;border-radius:50%;border:1px solid var(--p);display:grid;place-items:center;font:700 26px Outfit;color:#fff;box-shadow:0 0 22px rgba(139,92,246,.5)">${l}</div><h3>${n}</h3></div>`).join('');
const RQ=[[['Préstamos','Solicitar, renovar y devolver con límites por perfil.'],['Catálogo','Búsqueda por título, autor e ISBN con disponibilidad en tiempo real.'],['Multas','Cálculo automático, registro y consulta de sanciones.']],[['Seguridad','Autenticación con OAuth2 y control de acceso por rol.'],['Rendimiento','Respuesta menor a 2 segundos en consultas y préstamos.'],['Disponibilidad','99.9 % de tiempo activo durante el ciclo académico.']]];
function rq(k){$('#rq').innerHTML=RQ[k].map(([t,d])=>`<div class="card" style="min-height:190px;border-color:${k?'rgba(59,130,246,.45)':'rgba(139,92,246,.45)'}"><h3 style="font-size:24px;margin-bottom:12px">${t}</h3><p style="font-size:15px">${d}</p></div>`).join('')}
$$('[data-r]').forEach(b=>b.onclick=()=>{$$('[data-r]').forEach(x=>x.classList.toggle('on',x==b));rq(+b.dataset.r)});rq(0);
$('#kb').innerHTML=[['Backlog','#8B8B95',[['Como administrador, quiero reportes de uso.','Baja'],['Como estudiante, quiero un aviso antes del vencimiento.','Media']]],['Sprint 1 · En curso','#3B82F6',[['Como estudiante, quiero buscar libros y ver ejemplares.','Alta'],['Como bibliotecario, quiero registrar un préstamo.','Alta']]],['Sprint 2 · Planificado','#8B5CF6',[['Como docente, quiero renovar sin ir al mostrador.','Media'],['Como bibliotecario, quiero multas automáticas por perfil.','Alta']]]]
.map(([t,c,cs])=>`<div class="card" style="border-top:2px solid ${c};box-shadow:0 -8px 30px -12px ${c}"><h3 style="margin-bottom:14px">${t}</h3>${cs.map(([x,p])=>`<div class="kc">${x}<b style="color:${p=='Alta'?'#F59E0B':'#8B8B95'}">Prioridad ${p}</b></div>`).join('')}</div>`).join('');
$('#pl').innerHTML=['Commit y pull request','Compilación y pruebas unitarias','Pruebas de integración','Análisis estático y cobertura 80 %','Despliegue a staging y E2E','Producción con aprobación'].map((t,k)=>`<div class="st1"><b>${k+1}</b>${t}</div>`).join('');
$('#so').innerHTML=[['S','Responsabilidad única','Una clase, una razón de cambio. CalculadoraMulta solo calcula; PrestamoService solo coordina.','class CalculadoraMulta {}'],['O','Abierto / Cerrado','Una multa nueva es una clase nueva; Sancion no se modifica.','class MultaEgresado\n implements PoliticaMulta'],['L','Sustitución de Liskov','Ordinario, Especial e Interbibliotecario se usan donde se espera un Prestamo.','void registrar(Prestamo p)'],['I','Segregación de interfaces','Contratos pequeños: quien busca no depende de prestar.','interface Buscable {}\ninterface Prestable {}'],['D','Inversión de dependencias','El servicio recibe abstracciones, no clases concretas.','PrestamoService(\n PrestamoRepository r)']]
.map(([l,n,d,c])=>`<div class="fl"><div class="fi"><div class="fa"><b>${l}</b><span>${n}</span></div><div class="fb"><h3 style="font-size:16px">${n}</h3>${d}<code><pre style="margin:0;font:inherit">${c}</pre></code></div></div></div>`).join('');

/* ---- grafos interactivos ---- */
function build(id,nodes,edges){const root=$(id),svg=root.querySelector('svg');
  nodes.forEach(([i,t,x,y,w,d,a])=>{const n=document.createElement('div');n.className='nd'+(a?' a':'');n.dataset.id=i;n.dataset.i=d;n.innerHTML=t;Object.assign(n.style,{left:x+'px',top:y+'px',width:w+'px'});root.append(n)});
  edges.forEach(([a,b])=>{const A=root.querySelector(`[data-id=${a}]`),B=root.querySelector(`[data-id=${b}]`);let ax,bx;
    if(A.offsetLeft<B.offsetLeft){ax=A.offsetLeft+A.offsetWidth;bx=B.offsetLeft}else{ax=A.offsetLeft;bx=B.offsetLeft+B.offsetWidth}
    const ay=A.offsetTop+30,by=B.offsetTop+30,m=(ax+bx)/2,p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',`M${ax} ${ay}C${m} ${ay} ${m} ${by} ${bx} ${by}`);p.setAttribute('class','ln');p.dataset.e=a+' '+b;svg.append(p)})}
function lit(root,id){const ls=[...root.querySelectorAll('.ln')];ls.forEach(p=>p.classList.toggle('on',p.dataset.e.split(' ').includes(id)));
  const on=ls.filter(p=>p.classList.contains('on')).flatMap(p=>p.dataset.e.split(' '));
  root.querySelectorAll('.nd').forEach(n=>{const l=n.dataset.id==id||on.includes(n.dataset.id);n.classList.toggle('on',l);n.classList.toggle('dim',!l)})}
build('#uc',[['e','Estudiante',0,20,190,'<b>Estudiante:</b> busca en el catálogo, solicita y renueva préstamos y consulta sus multas.',1],['d','Docente',0,160,190,'<b>Docente:</b> igual que el estudiante, con plazos más largos.',1],['b','Bibliotecario',0,300,190,'<b>Bibliotecario:</b> atiende el mostrador, registra devoluciones y gestiona multas.',1],['a','Administrador',930,160,190,'<b>Administrador:</b> gestiona usuarios, multas y reportes.',1],
 ['c1','Buscar en catálogo',280,10,250,'<b>Buscar en catálogo:</b> consulta con caché en Redis.'],['c2','Solicitar préstamo',280,110,250,'<b>Solicitar préstamo:</b> la fábrica elige Ordinario, Especial o Interbibliotecario.'],['c3','Renovar préstamo',280,210,250,'<b>Renovar préstamo:</b> extiende el plazo si no hay reservas.'],['c4','Consultar multas',280,310,250,'<b>Consultar multas:</b> muestra sanciones vigentes del usuario.'],
 ['c5','Registrar devolución',600,10,250,'<b>Registrar devolución:</b> dispara el Observer de notificaciones.'],['c6','Gestionar multas',600,110,250,'<b>Gestionar multas:</b> aplica la estrategia según el perfil.'],['c7','Administrar usuarios',600,210,250,'<b>Administrar usuarios:</b> altas, roles y permisos.'],['c8','Generar reportes',600,310,250,'<b>Generar reportes:</b> uso del catálogo y morosidad.']],
 [['e','c1'],['e','c2'],['e','c3'],['e','c4'],['d','c1'],['d','c2'],['d','c3'],['d','c4'],['b','c1'],['b','c2'],['b','c5'],['b','c6'],['a','c6'],['a','c7'],['a','c8']]);
build('#ar',[['fe','Frontend<br>React',0,160,190,'<b>Frontend (React):</b> interfaz web responsiva; solo habla con el API Gateway.',1],['gw','API Gateway',270,160,200,'<b>API Gateway:</b> valida tokens OAuth2, enruta y limita solicitudes por usuario.',1],
 ['s1','Servicio de Préstamos<br>Spring Boot',560,20,250,'<b>Préstamos:</b> Factory Method para crear cada tipo de préstamo.'],['s2','Servicio de Catálogo<br>Node.js',560,160,250,'<b>Catálogo:</b> lectura intensiva respaldada por caché.'],['s3','Multas y Avisos<br>Spring Boot',560,300,250,'<b>Multas y avisos:</b> Strategy para sanciones y Observer para notificar.'],
 ['pg','PostgreSQL',900,80,220,'<b>PostgreSQL:</b> datos transaccionales con integridad referencial.',1],['rd','Redis',900,240,220,'<b>Redis:</b> caché de búsquedas frecuentes para sostener la meta de 2 s.',1]],
 [['fe','gw'],['gw','s1'],['gw','s2'],['gw','s3'],['s1','pg'],['s3','pg'],['s2','rd'],['s2','pg']]);

/* ---- patrones ---- */
const P={Singleton:{f:'ConnectionPool.java',n:[['Servicios','Los servicios piden la conexión al pool, nunca lo crean.'],['getInstance()','Punto de acceso global y seguro entre hilos.'],['ConnectionPool','Instancia única con doble verificación.'],['PostgreSQL','Recurso protegido: un solo pool de conexiones.']],i:'Una sola instancia administra las conexiones y evita agotar recursos.',c:`public final class ConnectionPool {
  private static volatile ConnectionPool instance;
  private final HikariDataSource ds = new HikariDataSource(cfg());
  private ConnectionPool() {}
  public static ConnectionPool getInstance() {
    if (instance == null) synchronized (ConnectionPool.class) {
      if (instance == null) instance = new ConnectionPool();
    }
    return instance;
  }
  public Connection get() throws SQLException { return ds.getConnection(); }
}`},
'Factory Method':{f:'PrestamoFactory.java',n:[['Cliente','Solo conoce PrestamoFactory.'],['PrestamoFactory','Declara crear(); las subclases deciden el tipo.'],['«interface» Prestamo','Contrato común de todos los préstamos.'],['Ordinario · Especial · Inter','Productos concretos con plazos de 8, 3 y 15 días.']],i:'Cada fábrica decide qué préstamo crear sin que el cliente conozca la clase concreta.',c:`interface Prestamo { int dias(); }
class Ordinario implements Prestamo { public int dias() { return 8; } }
class Especial implements Prestamo { public int dias() { return 3; } }
class Interbibliotecario implements Prestamo { public int dias() { return 15; } }

abstract class PrestamoFactory { abstract Prestamo crear(); }
class EspecialFactory extends PrestamoFactory {
  Prestamo crear() { return new Especial(); }
}
// El cliente solo conoce PrestamoFactory`},
Observer:{f:'Devolucion.java',n:[['Devolucion','Sujeto: mantiene la lista de suscriptores.'],['«interface» Observador','Contrato notificar(Prestamo).'],['Email','Observador concreto: envía correo.'],['SMS · Panel','Se agregan sin tocar Devolucion.']],i:'Al registrar una devolución, todos los suscriptores reciben el aviso sin acoplarse al módulo de préstamos.',c:`interface Observador { void notificar(Prestamo p); }

class Devolucion {
  private final List<Observador> obs = new ArrayList<>();
  void suscribir(Observador o) { obs.add(o); }
  void registrar(Prestamo p) { obs.forEach(o -> o.notificar(p)); }
}
class EmailNotificador implements Observador {
  public void notificar(Prestamo p) { /* enviar correo */ }
}`},
Strategy:{f:'Sancion.java',n:[['Sancion','Contexto: usa una política sin conocer su cálculo.'],['«interface» PoliticaMulta','Contrato calcular(diasRetraso).'],['MultaEstudiante','Q1.00 por día de retraso.'],['MultaDocente','Q0.50 por día de retraso.']],i:'La política de sanción se intercambia en tiempo de ejecución según el perfil del usuario.',c:`interface PoliticaMulta { double calcular(int diasRetraso); }

class MultaEstudiante implements PoliticaMulta {
  public double calcular(int d) { return d * 1.00; } // Q1.00 por día
}
class MultaDocente implements PoliticaMulta {
  public double calcular(int d) { return d * 0.50; }
}
class Sancion {
  private final PoliticaMulta p;
  double total(int dias) { return p.calcular(dias); }
}`}};
const KW='public|private|static|final|class|interface|abstract|extends|implements|new|return|void|if|volatile|synchronized|throws|int|double|this';
function hl(c){return c.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(new RegExp(`(\\/\\/.*|\\/\\*.*?\\*\\/)|("[^"]*")|\\b(${KW})\\b|\\b([A-Z]\\w*)\\b|\\b(\\d+(?:\\.\\d+)?)\\b`,'g'),(m,a,b,c2,d,e)=>a?`<span class="cm">${a}</span>`:b?`<span class="st">${b}</span>`:c2?`<span class="kw">${c2}</span>`:d?`<span class="ty">${d}</span>`:`<span class="nu">${e}</span>`)}
function pat(k){const p=P[k];$$('.pt').forEach(b=>b.classList.toggle('on',b.dataset.k==k));
  $('#dg').innerHTML=p.n.map(([n,d],j)=>(j?'<span class="ar">▸</span>':'')+`<span class="bx" data-d="${d}">${n}</span>`).join('');
  $('#fn').textContent=p.f;$('#cd').innerHTML=hl(p.c);$('#pi').innerHTML='<b>'+k+'.</b> '+p.i}
$('#pt').innerHTML=Object.keys(P).map(k=>`<button class="tab pt" data-k="${k}">${k}</button>`).join('');
$$('.pt').forEach(b=>b.onclick=()=>pat(b.dataset.k));pat('Singleton');

/* ---- navegación ---- */
S.forEach((s,k)=>{const b=document.createElement('button');b.textContent=(k+1)+'. '+s.dataset.t;b.onclick=()=>{go(k);$('#menu').classList.remove('on')};$('#menu').append(b)});
function go(n){cur=Math.max(0,Math.min(S.length-1,n));S.forEach((s,k)=>s.classList.toggle('on',k==cur));
  const w=S[cur].dataset.w;$('#bd').className='bd b'+w;$('#bd span').textContent=W[w];
  $('#ctr').textContent=`${cur+1} / ${S.length}  ${S[cur].dataset.t}`;$('#pg').style.width=(cur+1)/S.length*100+'%';
  $('#pv').disabled=!cur;$('#nx').disabled=cur==S.length-1}
$('#pv').onclick=()=>go(cur-1);$('#nx').onclick=()=>go(cur+1);$('#mn').onclick=()=>$('#menu').classList.toggle('on');
document.addEventListener('click',e=>{
  const k=e.target.closest('[data-i]');
  if(k){const sl=k.closest('.sl');sl.querySelector('.info').innerHTML=k.dataset.i;
    if(k.dataset.id)lit(k.closest('.gl'),k.dataset.id);else sl.querySelectorAll('[data-i]').forEach(x=>x.classList.toggle('on',x==k))}
  const d=e.target.closest('[data-d]');if(d){$$('.bx').forEach(x=>x.classList.toggle('on',x==d));$('#pi').innerHTML=d.dataset.d}
  if(!e.target.closest('#menu,#mn'))$('#menu').classList.remove('on')});
document.addEventListener('keydown',e=>{
  if(e.key=='ArrowRight'||e.key==' '){e.preventDefault();go(cur+1)}else if(e.key=='ArrowLeft')go(cur-1);else if(e.key=='Home')go(0);else if(e.key=='End')go(S.length-1)});
function rs(){$('#fr').style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/1310,(innerHeight-72)/730)})`}
addEventListener('resize',()=>{rs();sz()});

/* ---- fondo de puntos interactivo ---- */
const cv=$('#bg'),cx=cv.getContext('2d');let mx=-999,my=-999;
function sz(){cv.width=innerWidth;cv.height=innerHeight}
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
function draw(t){cx.clearRect(0,0,cv.width,cv.height);
  for(let x=18;x<cv.width;x+=34)for(let y=18;y<cv.height;y+=34){
    const d=Math.hypot(x-mx,y-my),h=Math.max(0,1-d/190),w=.5+.5*Math.sin(t/1400+x/130+y/170);
    cx.fillStyle=h>0?`rgba(${96+90*h|0},${130-40*h|0},246,${.1+.75*h})`:`rgba(110,110,150,${.08+.1*w})`;
    cx.beginPath();cx.arc(x,y,1+1.6*h,0,7);cx.fill()}
  requestAnimationFrame(draw)}
rs();sz();go(0);requestAnimationFrame(draw);

/* ===== Capa dinámica v3 ===== */
const _go=go;
go=function(n){_go(n);
  S.forEach((s,k)=>s.style.setProperty('--dx',(k<cur?-70:70)+'px'));
  S[cur].querySelectorAll('.card,.cap,.row,.kc,.fl,.st1,.pl,.tab,.nd,.bx').forEach((el,k)=>el.style.setProperty('--d',k));
  S[cur].querySelectorAll('.big').forEach(countUp);
  if(cur==0)typeIt()};
function countUp(el){const raw=el.dataset.raw||(el.dataset.raw=el.textContent),m=raw.match(/[\d.]+/);if(!m)return;
  const end=parseFloat(m[0]),dec=(m[0].split('.')[1]||'').length,t0=performance.now();
  (function f(t){const k=Math.min(1,(t-t0)/1300),e=1-Math.pow(1-k,3);el.textContent=raw.replace(m[0],(end*e).toFixed(dec));if(k<1)requestAnimationFrame(f)})(t0)}
const ty=$('#ty'),tyText=ty.textContent;
function typeIt(){let i=0;clearInterval(typeIt.t);ty.classList.add('typing');
  typeIt.t=setInterval(()=>{ty.textContent=tyText.slice(0,++i);if(i>=tyText.length){clearInterval(typeIt.t);ty.classList.remove('typing')}},26)}
const glow=document.createElement('div');glow.id='cur';document.body.append(glow);
document.addEventListener('mousemove',e=>{
  glow.style.transform=`translate(${e.clientX-190}px,${e.clientY-190}px)`;
  const c=e.target.closest('.card,.nd');if(!c)return;
  const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');
  if(c.classList.contains('card'))c.style.transform=`perspective(700px) rotateY(${(x-.5)*9}deg) rotateX(${(.5-y)*9}deg)`});
document.addEventListener('mouseout',e=>{const c=e.target.closest('.card');if(c)c.style.transform=''});
go(cur);
