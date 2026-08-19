(function(){
"use strict";

const TABLE="poems";

function client(){
  if(!window.supabase || typeof window.supabase.createClient!=="function"){
    throw new Error("Supabase library belum dimuat.");
  }
  return window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_KEY);
}

function esc(v){
  return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}
function slugify(v){
  return String(v||"").toLowerCase().trim().normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g,"")
    .replace(/\s+/g,"-").replace(/-+/g,"-");
}
function date(v){
  if(!v)return "";
  const d=new Date(v); if(Number.isNaN(d.getTime()))return "";
  return new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"long",year:"numeric"}).format(d);
}
function normalize(r){
  const content=r.content||r.body||r.isi||r.poem||"";
  return {
    id:r.id,title:r.title||r.judul||"Tanpa judul",content,
    theme:r.theme||r.category||r.kategori||"Catatan",
    slug:r.slug||slugify(r.title||r.judul),
    publishedAt:r.published_at||r.publishedAt||r.created_at,
    excerpt:r.excerpt||content.replace(/\s+/g," ").trim().slice(0,180)+(content.length>180?"…":"")
  };
}

async function load(){
  const sb=client();
  const {data,error}=await sb.from(TABLE).select("*")
    .eq("status","published").order("published_at",{ascending:false,nullsFirst:false});
  if(error)throw error;
  return (data||[]).map(normalize);
}

function url(p){return "puisi.html?slug="+encodeURIComponent(p.slug);}

function render(ps){
  const feature=document.querySelector("[data-featured-poem]");
  const list=document.querySelector("[data-poem-list]");
  if(!ps.length){
    if(feature)feature.innerHTML="<p>Belum ada tulisan yang diterbitkan.</p>";
    if(list)list.innerHTML="";
    return;
  }
  const p=ps[0];
  if(feature)feature.innerHTML=`
    <div class="featured-poem-meta">${esc(date(p.publishedAt))} · ${esc(p.theme)}</div>
    <h2 class="featured-poem-title">${esc(p.title)}</h2>
    <p>${esc(p.excerpt)}</p>
    <a href="${url(p)}">baca selengkapnya →</a>`;
  if(list)list.innerHTML=ps.slice(1).map(p=>`
    <article class="poem-item">
      <div><div class="poem-item-meta">${esc(date(p.publishedAt))} · ${esc(p.theme)}</div>
      <h3 class="poem-item-title"><a href="${url(p)}">${esc(p.title)}</a></h3></div>
      <a class="poem-item-read" href="${url(p)}">baca →</a>
    </article>`).join("");
}

function filters(ps){
  const buttons=document.querySelectorAll("[data-poem-filter]");
  const list=document.querySelector("[data-poem-list]");
  const search=document.querySelector("[data-poem-search]");
  function draw(){
    const term=(search?.value||"").toLowerCase();
    const active=document.querySelector("[data-poem-filter].active")?.dataset.poemFilter||"Semua";
    const out=ps.filter(p=>(active==="Semua"||p.theme.toLowerCase()===active.toLowerCase()) &&
      (!term||(p.title+" "+p.theme+" "+p.content).toLowerCase().includes(term)));
    if(list)list.innerHTML=out.map(p=>`
      <article class="poem-item">
        <div><div class="poem-item-meta">${esc(date(p.publishedAt))} · ${esc(p.theme)}</div>
        <h3 class="poem-item-title"><a href="${url(p)}">${esc(p.title)}</a></h3></div>
        <a class="poem-item-read" href="${url(p)}">baca →</a>
      </article>`).join("")||"<p>Tak ada tulisan yang cocok.</p>";
  }
  buttons.forEach(b=>b.addEventListener("click",()=>{
    buttons.forEach(x=>x.classList.remove("active"));b.classList.add("active");draw();
  }));
  search?.addEventListener("input",draw);
}

load().then(ps=>{render(ps);filters(ps);}).catch(e=>{
  console.error(e);
  const f=document.querySelector("[data-featured-poem]");
  if(f)f.innerHTML="<p>Puisi belum dapat dimuat. Periksa koneksi atau konfigurasi Supabase.</p>";
});
})();