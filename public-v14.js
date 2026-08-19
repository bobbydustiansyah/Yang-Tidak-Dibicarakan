/* Yang Kita Bicarakan — Public V14
   Separate live sections for PUISI and JURNAL.
*/
(function(){
  const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
  const state = { all: [], poems: [], journals: [] };

  const esc = v => String(v ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));

  const slugify = v => String(v || "").toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");

  const fmt = v => v ? new Intl.DateTimeFormat("id-ID", {
    day:"2-digit", month:"long", year:"numeric"
  }).format(new Date(v)) : "";

  function normalize(r){
    const content = r.content || r.body || r.isi || "";
    return {
      ...r,
      title: r.title || r.judul || "Tanpa judul",
      content,
      theme: r.theme || r.category || r.kategori || "Catatan",
      type: r.type === "jurnal" ? "jurnal" : "puisi",
      slug: r.slug || slugify(r.title || r.judul),
      date: r.published_at || r.created_at
    };
  }

  function link(r){
    return "puisi.html?slug=" + encodeURIComponent(r.slug);
  }

  function excerpt(text, n=190){
    const t = String(text || "").replace(/\s+/g," ").trim();
    return esc(t.length > n ? t.slice(0,n) + "…" : t);
  }

  async function load(){
    const {data,error} = await sb.from("poems")
      .select("*")
      .eq("status","published")
      .order("published_at",{ascending:false,nullsFirst:false});

    if(error){
      console.error("Supabase:", error);
      showError(error.message);
      return;
    }

    state.all = (data || []).map(normalize);
    state.poems = state.all.filter(r => r.type === "puisi");
    state.journals = state.all.filter(r => r.type === "jurnal");

    renderPoems();
    renderJournals();
    setupArchive();
  }

  function renderPoems(){
    const feature = document.querySelector("[data-featured-poem]");
    const list = document.querySelector("[data-poem-list]");

    if(feature){
      const p = state.poems[0];
      feature.innerHTML = p ? `
        <div>
          <div class="kicker">${esc(fmt(p.date))} · ${esc(p.theme)}</div>
          <h3>${esc(p.title)}</h3>
          <p class="excerpt">${excerpt(p.content)}</p>
          <a class="read" href="${link(p)}">baca selengkapnya →</a>
        </div>
        <aside class="feature-aside">
          <div class="small">PUISI TERBARU</div>
          <p class="vertical">${excerpt(p.content,240)}</p>
        </aside>` :
        `<p>Belum ada puisi yang diterbitkan.</p>`;
    }

    if(list){
      const rows = state.poems.slice(1,8);
      list.innerHTML = rows.length ? rows.map(rowItem).join("") :
        `<p>Belum ada puisi lain.</p>`;
    }
  }

  function renderJournals(){
    const box = document.querySelector("[data-journal-list]");
    if(!box) return;

    if(!state.journals.length){
      box.innerHTML = `
        <article class="journal-card">
          <div class="kicker">BELUM ADA JURNAL</div>
          <h3>Ruang ini masih kosong.</h3>
          <p>Jurnal pertama akan muncul di sini setelah diterbitkan dari Ruang Tulis.</p>
        </article>`;
      return;
    }

    box.innerHTML = state.journals.slice(0,6).map(r => `
      <article class="journal-card">
        <div class="kicker">${esc(fmt(r.date))} · ${esc(r.theme)}</div>
        <h3>${esc(r.title)}</h3>
        <p>${excerpt(r.content,220)}</p>
        <a class="read" href="${link(r)}">baca selengkapnya →</a>
      </article>`).join("");
  }

  function rowItem(r){
    return `<a class="row" href="${link(r)}">
      <span class="row-date">${esc(fmt(r.date))}</span>
      <span class="row-title">${esc(r.title)}</span>
      <span class="row-theme">${esc(r.theme)}</span>
      <span class="arrow">→</span>
    </a>`;
  }

  function setupArchive(){
    const list = document.querySelector("[data-poem-list]");
    const search = document.querySelector("[data-poem-search]");
    const buttons = document.querySelectorAll("[data-poem-filter]");
    if(!list) return;

    let mode = "Semua";
    let query = "";

    function draw(){
      let rows = state.all;

      if(mode === "Puisi") rows = state.poems;
      else if(mode === "Jurnal") rows = state.journals;
      else if(!["Semua"].includes(mode))
        rows = rows.filter(r => (r.theme || "").toLowerCase() === mode.toLowerCase());

      if(query){
        const q=query.toLowerCase();
        rows=rows.filter(r =>
          (r.title+" "+r.theme+" "+r.content).toLowerCase().includes(q)
        );
      }

      list.innerHTML = rows.length ? rows.map(rowItem).join("") :
        "<p>Tidak ada tulisan yang cocok.</p>";
    }

    buttons.forEach(btn => btn.addEventListener("click",()=>{
      buttons.forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      mode=btn.dataset.poemFilter || "Semua";
      draw();
    }));

    search?.addEventListener("input",()=>{ query=search.value; draw(); });
    draw();
  }

  function showError(msg){
    const targets=[
      document.querySelector("[data-featured-poem]"),
      document.querySelector("[data-journal-list]")
    ].filter(Boolean);
    targets.forEach(x=>x.innerHTML=`<p>Belum dapat memuat tulisan.</p>`);
    console.error(msg);
  }

  document.getElementById("themeToggle")?.addEventListener("click",()=>{
    document.body.classList.toggle("dark");
  });

  load().catch(err=>showError(err.message || String(err)));
})();