(function(){
  'use strict';
  var WA='5555996626654';

  // ano
  var y=document.querySelector('.js-year'); if(y) y.textContent=new Date().getFullYear();

  // menu mobile
  var mb=document.querySelector('.menu-btn'), mn=document.getElementById('mnav');
  if(mb&&mn){
    var setMenu=function(open){mn.classList.toggle('open',open);mb.setAttribute('aria-expanded',open?'true':'false');mb.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')};
    mb.addEventListener('click',function(){setMenu(!mn.classList.contains('open'))});
    mn.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mn.classList.contains('open')){setMenu(false);mb.focus()}});
  }

  // aberto/fechado no fuso da loja (Seg a sex 8h-12h e 13h30-18h, Sáb 8h-12h)
  try{
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return (p.find(function(x){return x.type===t})||{}).value};
    var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday'));
    var m=(parseInt(g('hour'),10)%24)*60+parseInt(g('minute'),10);
    var wk=d>=1&&d<=5, sat=d===6, txt, open=false;
    if(wk&&m>=480&&m<720){open=true;txt='Aberto agora · fecha às 12h'}
    else if(wk&&m>=810&&m<1080){open=true;txt='Aberto agora · fecha às 18h'}
    else if(sat&&m>=480&&m<720){open=true;txt='Aberto agora · fecha às 12h'}
    else if((wk||sat)&&m<480){txt='Fechado · abre hoje às 8h'}
    else if(wk&&m>=720&&m<810){txt='Fechado para o almoço · volta às 13h30'}
    else if(d>=1&&d<=4){txt='Fechado · abre amanhã às 8h'}
    else{txt='Fechado · abre segunda às 8h'}
    document.querySelectorAll('.js-status,.js-status-2').forEach(function(e){e.textContent=txt});
    if(!open){document.querySelectorAll('.js-dot,.js-status-pill .dot').forEach(function(e){e.classList.add('off')});var pill=document.querySelector('.js-status-pill');if(pill)pill.classList.add('off')}
    var row=document.querySelector('.hours tr[data-d="'+d+'"]'); if(row) row.classList.add('today');
  }catch(e){}

  // entrada suave
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(function(e){if(e.getBoundingClientRect().top>innerHeight){e.classList.add('pre');io.observe(e)}});
  }

  // carrossel
  document.querySelectorAll('.car').forEach(function(car){
    var tr=car.querySelector('.car-track'), sl=[].slice.call(tr.children), prev=car.querySelector('.js-prev'), next=car.querySelector('.js-next'), dots=car.querySelector('.car-dots');
    var step=function(){var a=sl[0],b=sl[1];return b?b.offsetLeft-a.offsetLeft:tr.clientWidth};
    var idx=function(){return Math.round(tr.scrollLeft/step())};
    var maxI=function(){return Math.max(0,Math.round((tr.scrollWidth-tr.clientWidth)/step()))};
    var go=function(i){tr.scrollTo({left:Math.max(0,Math.min(i,maxI()))*step(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
    sl.forEach(function(s,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Ir para a oferta '+(i+1));b.addEventListener('click',function(){go(i)});dots.appendChild(b)});
    var db=[].slice.call(dots.children);
    var sync=function(){var i=idx(),mx=maxI();prev.disabled=i<=0;next.disabled=i>=mx;db.forEach(function(b,j){b.setAttribute('aria-current',j===i||(i>=mx&&j>mx&&false)?'true':'false');b.hidden=j>mx})};
    prev.addEventListener('click',function(){go(idx()-1)}); next.addEventListener('click',function(){go(idx()+1)});
    var t; tr.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(sync,60)},{passive:true});
    tr.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(idx()+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(idx()-1)}});
    addEventListener('resize',sync); sync();
  });

  // formulários: abre o WhatsApp com os dados
  var onlyD=function(v){return v.replace(/\D/g,'')};
  var maskCPF=function(v){v=onlyD(v).slice(0,11);return v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2')};
  var maskTel=function(v){v=onlyD(v).slice(0,11);if(v.length>10)return v.replace(/(\d{2})(\d)(\d{4})(\d{0,4})/,'($1) $2 $3-$4');if(v.length>6)return v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3');if(v.length>2)return v.replace(/(\d{2})(\d{0,5})/,'($1) $2');return v};
  var cpfOk=function(c){c=onlyD(c);if(c.length!==11||/^(\d)\1+$/.test(c))return false;var s=0,r;for(var i=0;i<9;i++)s+=+c[i]*(10-i);r=(s*10)%11%10;if(r!==+c[9])return false;s=0;for(i=0;i<10;i++)s+=+c[i]*(11-i);r=(s*10)%11%10;return r===+c[10]};
  document.querySelectorAll('.js-lead').forEach(function(f){
    var cpf=f.querySelector('[name=cpf]'), tel=f.querySelector('[name=whatsapp]');
    cpf.addEventListener('input',function(){cpf.value=maskCPF(cpf.value)});
    tel.addEventListener('input',function(){tel.value=maskTel(tel.value)});
    var setErr=function(inp,msg){inp.setAttribute('aria-invalid',msg?'true':'false');var e=inp.parentNode.querySelector('.err');if(e)e.textContent=msg||''};
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var n=f.querySelector('[name=nome]'), em=f.querySelector('[name=email]'), first=null;
      var chk=function(inp,ok,msg){setErr(inp,ok?'':msg);if(!ok&&!first)first=inp};
      chk(n,n.value.trim().length>=3,'Digite seu nome completo.');
      chk(cpf,cpfOk(cpf.value),'Confira o CPF.');
      chk(em,/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim()),'Confira o e-mail.');
      chk(tel,onlyD(tel.value).length>=10,'Digite o WhatsApp com DDD.');
      if(first){first.focus();return}
      var msg='Olá, Fábio Cell! Quero fazer a análise para comprar celular no boleto.\n\nNome: '+n.value.trim()+'\nCPF: '+cpf.value+'\nE-mail: '+em.value.trim()+'\nWhatsApp: '+tel.value;
      window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
    });
  });

  // trilha que acompanha a rolagem
  var rail=document.querySelector('.rail');
  if(rail){
    var fill=rail.querySelector('.rail-fill'),head=rail.querySelector('.rail-head'),lab=rail.querySelector('.rail-label'),nodesBox=rail.querySelector('.rail-nodes');
    var secs=[].slice.call(document.querySelectorAll('[data-rail]')),marks=[],H=0,max=1,ticking=false;
    var update=function(){
      ticking=false; var pr=Math.min(1,Math.max(0,scrollY/max));
      fill.style.transform='scaleY('+pr+')'; head.style.transform='translateY('+(pr*H)+'px)';
      var cur=marks[0]; marks.forEach(function(mk){var on=pr>=mk.p-0.0005; mk.el.classList.toggle('on',on); if(on)cur=mk});
      if(cur&&lab.textContent!==cur.name)lab.textContent=cur.name;
    };
    var layout=function(){
      H=rail.clientHeight; max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      nodesBox.innerHTML=''; marks=secs.map(function(sec){
        var top=sec.getBoundingClientRect().top+scrollY, pr=Math.min(1,Math.max(0,(top-innerHeight*.35)/max));
        var i=document.createElement('i'); i.style.top=(pr*H)+'px'; nodesBox.appendChild(i); return {p:pr,el:i,name:sec.getAttribute('data-rail')};
      }); update();
    };
    addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
    addEventListener('resize',layout); addEventListener('load',layout); layout();
  }

  // esconde o botão flutuante perto do rodapé
  var fab=document.querySelector('.fab'),ftr=document.querySelector('.ftr');
  if(fab&&ftr&&'IntersectionObserver' in window){new IntersectionObserver(function(es){fab.classList.toggle('hide',es[0].isIntersecting)}).observe(ftr)}
})();
