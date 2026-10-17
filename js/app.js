const K='ptc-v1';
const S=()=>{try{return JSON.parse(localStorage.getItem(K))||{done:{},n:{}}}catch(e){return{done:{},n:{}}}};
const save=s=>{try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}};
const modMin=m=>m.segs.reduce((a,s)=>a+s.m,0);
const doneMin=(s,i)=>LESSONS[i].segs.reduce((a,x,j)=>a+(s.done[i+'-'+j]?x.m:0),0);
const total=LESSONS.reduce((a,m)=>a+modMin(m),0);
const earned=s=>LESSONS.reduce((a,m,i)=>a+doneMin(s,i),0);
const fmt=m=>Math.floor(m/60)+'h '+(m%60)+'m';
function home(){const s=S(),e=earned(s);
 document.getElementById('prog').innerHTML=`<p><strong>${fmt(e)}</strong> of ${fmt(total)} completed together</p><div class="bar"><i style="width:${Math.min(100,e/total*100)}%"></i></div>`;
 document.getElementById('mods').innerHTML=LESSONS.map((m,i)=>{const d=doneMin(s,i);
  return`<a class="card" href="lesson.html?m=${i}"><span class="tag">Session ${i+1} · ${modMin(m)} min</span><h3 style="margin:.2rem 0">${m.title}</h3><p class="mut" style="margin:.2rem 0 .6rem">${m.blurb}</p><div class="bar"><i style="width:${d/modMin(m)*100}%"></i></div></a>`}).join('')}
function lesson(){const i=+new URLSearchParams(location.search).get('m')||0,m=LESSONS[i];if(!m)return;
 const s=S();document.title=m.title;
 let h=`<p class="tag">Session ${i+1} of ${LESSONS.length}</p><h1>${m.title}</h1><p class="mut">${modMin(m)} minutes · Do this together, undistracted. Phones away.</p>`;
 h+=m.segs.map((g,j)=>`<section class="card seg ${s.done[i+'-'+j]?'done':''}" id="s${j}"><span class="tag">${g.k} · ${g.m} min</span><h2 style="margin:.2rem 0">${g.t}</h2>${g.h}
 <div class="noprint" style="margin-top:.8rem"><span class="timer" id="t${j}">${String(g.m).padStart(2,'0')}:00</span><button onclick="tm(${j},${g.m})">Start / pause timer</button>
 <label><input type="checkbox" data-k="${i}-${j}" ${s.done[i+'-'+j]?'checked':''}> We both completed this part together</label></div></section>`).join('');
 h+=`<p class="noprint">${i>0?`<a class="btn" href="lesson.html?m=${i-1}">← Previous</a> `:''}${i<LESSONS.length-1?`<a class="btn" href="lesson.html?m=${i+1}">Next session →</a>`:`<a class="btn" href="log.html">Go to completion log →</a>`}</p>`;
 document.getElementById('app').innerHTML=h;
 document.querySelectorAll('input[data-k]').forEach(c=>c.onchange=()=>{const s=S();s.done[c.dataset.k]=c.checked;save(s);c.closest('.seg').classList.toggle('done',c.checked)})}
const T={};function tm(j,min){const el=document.getElementById('t'+j);T[j]=T[j]||{left:min*60,id:null};const t=T[j];
 if(t.id){clearInterval(t.id);t.id=null;return}
 t.id=setInterval(()=>{t.left--;el.textContent=String(Math.floor(t.left/60)).padStart(2,'0')+':'+String(t.left%60).padStart(2,'0');if(t.left<=0){clearInterval(t.id);t.id=null;el.textContent='Done!'}},1000)}
function log(){const s=S();
 document.getElementById('rows').innerHTML=LESSONS.map((m,i)=>`<tr><td>${i+1}. ${m.title}</td><td>${doneMin(s,i)} / ${modMin(m)} min</td></tr>`).join('');
 document.getElementById('tot').textContent=fmt(earned(s))+' of '+fmt(total);
 ['a','b'].forEach(k=>{const el=document.getElementById(k);el.value=s.n[k]||'';el.oninput=()=>{const x=S();x.n[k]=el.value;save(x)}});
 document.getElementById('reset').onclick=()=>{if(confirm('Erase ALL progress on this device?')){localStorage.removeItem(K);location.reload()}}}
