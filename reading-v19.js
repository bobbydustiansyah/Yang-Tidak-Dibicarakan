(() => {
  const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
  const root = document.getElementById("reader");
  const key = "ykb-theme";
  const esc = v => String(v ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
  const slugify = v => String(v||"").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");
  const fmt = v => v ? new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"long",year:"numeric"}).format(new Date(v)) : "";
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");

  function setupTheme(){
    const btn=document.getElementById("themeToggle");
    if(localStorage.getItem(key)==="dark")document.body.classList.add("dark");
    btn?.addEventListener("click",()=>{
      document.body.classList.toggle("dark");
      localStorage.setItem(key,document.body.classList.contains("dark")?"dark":"light");
    });
  }

  function paragraphs(text){
    const clean=String(text||"").trim();
    if(!clean)return "<p>Tulisan ini belum memiliki isi.</p>";
    return clean.split(/\n\s*\n/).map((p,i)=>{
      const safe=esc(p).replace(/\n/g,"<br>");
      return `<p class="${i===0?'dropcap':''}">${safe}</p>`;
    }).join("");
  }

  async function load(){
    if(!slug){
      showError("404","Tulisan tidak ditemukan","Tidak ada judul tulisan yang dipilih.");
      return;
    }
    const {data,error}=await sb.from("poems").select("*").eq("status","published");
    if(error){console.error(error);showError("500","Ruang sedang sunyi","Tulisan belum dapat dimuat. Coba lagi sebentar lagi.");return;}
    const rows=(data||[]).sort((a,b)=>new Date(b.published_at||b.created_at)-new Date(a.published_at||a.created_at));
    const item=rows.find(r=>(r.slug||slugify(r.title))===slug);
    if(!item){showError("404","Tulisan tidak ditemukan","Mungkin tulisan ini belum diterbitkan atau alamatnya berubah.");return;}
    document.title=`${item.title||"Tulisan"} — yang kita bicarakan`;

    const index=rows.indexOf(item);
    const prev=rows[index+1], next=rows[index-1];
    const type=item.type==="jurnal"?"JURNAL":"PUISI";
    const theme=item.theme||"Catatan";
    const date=fmt(item.published_at||item.created_at);
    const excerpt=String(item.content||"").replace(/\s+/g," ").trim().slice(0,180);

    root.innerHTML=`
      <section class="reader-top">
        <div class="back-mark"><a href="index.html">← kembali</a></div>
        <div>
          <div class="meta"><span class="type">${esc(type)}</span><span>${esc(date)}</span><span>${esc(theme)}</span></div>
          <h1 class="reader-title">${esc(item.title||"Tanpa judul")}</h1>
          <p class="deck">${esc(excerpt)}${excerpt.length>=180?"…":""}</p>
        </div>
      </section>
      <div class="paper-rule"></div>
      <section class="content-layout">
        <aside class="content-side"><span>02:17</span>${esc(type)}<br>${esc(date)}</aside>
        <article class="content">${paragraphs(item.content)}</article>
      </section>
      <div class="reader-end">
        <div><span class="maroon">—</span> selesai dibaca</div>
        <div>yang kita bicarakan · pukul dua dini hari</div>
      </div>
      <nav class="nav-posts">
        ${prev?`<a class="post-nav" href="puisi.html?slug=${encodeURIComponent(prev.slug||slugify(prev.title))}"><small>← sebelumnya</small><strong>${esc(prev.title||"Tanpa judul")}</strong></a>`:`<div class="post-nav"></div>`}
        ${next?`<a class="post-nav" href="puisi.html?slug=${encodeURIComponent(next.slug||slugify(next.title))}"><small>berikutnya →</small><strong>${esc(next.title||"Tanpa judul")}</strong></a>`:`<div class="post-nav"></div>`}
      </nav>`;
  }

  function showError(code,title,text){
    root.innerHTML=`<section class="error-state"><div class="code">${code}</div><h1>${esc(title)}</h1><p>${esc(text)}</p><a class="maroon-link" href="index.html">kembali ke awal →</a></section>`;
  }

  setupTheme();load();
})();