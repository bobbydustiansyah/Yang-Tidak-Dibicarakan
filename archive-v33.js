(() => {
 const sb=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_KEY);
 const list=document.getElementById("archiveList"), count=document.getElementById("count"), search=document.getElementById("search");
 let rows=[],filter="semua",q="";
 const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
 const slug=v=>String(v||"").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");
 const date=v=>v?new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"long",year:"numeric"}).format(new Date(v)):"";
 const year=v=>v?new Date(v).getFullYear():"";
 function render(){
   let r=rows;
   if(filter!=="semua")r=r.filter(x=>(x.type||"puisi").toLowerCase()===filter);
   if(q){const x=q.toLowerCase();r=r.filter(a=>(a.title+" "+(a.theme||"")+" "+(a.content||"")+" "+(a.image_caption||"")).toLowerCase().includes(x))}
   count.textContent=`${r.length} tulisan`;
   if(!r.length){list.innerHTML='<div class="empty">Tidak ada tulisan yang cocok dengan pencarianmu.</div>';return}
   let html="",last="";
   r.forEach(x=>{
     const y=year(x.published_at||x.created_at);
     if(y!==last){html+=`<div class="year">${y}</div>`;last=y}
     html+=`<a class="archive-row" href="puisi.html?slug=${encodeURIComponent(x.slug||slug(x.title))}">
       <span class="date">${esc(date(x.published_at||x.created_at))}</span>
       <span class="type type-${esc((x.type||"puisi").toLowerCase())}">${esc((x.type||"puisi").toUpperCase())}</span>
       <span class="title">${esc(x.title||"Tanpa judul")}</span>
       <span class="arrow">→</span>
     </a>`;
   });
   list.innerHTML=html;
 }
 document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;render()}));
 search.addEventListener("input",()=>{q=search.value.trim();render()});
 const key="ykb-theme",toggle=document.getElementById("themeToggle");
 if(localStorage.getItem(key)==="dark")document.body.classList.add("dark");
 toggle.addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem(key,document.body.classList.contains("dark")?"dark":"light")});
 (async()=>{const {data,error}=await sb.from("poems").select("*").eq("status","published").order("published_at",{ascending:false,nullsFirst:false});if(error){console.error(error);list.innerHTML='<div class="empty">Arsip belum dapat dimuat.</div>';return}rows=data||[];render()})();
})();

/* V23 mobile menu */
(() => {
  const btn = document.getElementById("mobileMenu");
  const nav = document.getElementById("mobileNav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "×" : "☰";
    nav.setAttribute("aria-hidden", String(!open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded","false");
    btn.textContent="☰";
    nav.setAttribute("aria-hidden","true");
  }));
})();
