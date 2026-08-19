(function(){
  const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const slugify = v => String(v||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
  const fmt = v => v ? new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(v)) : '';
  const params = new URLSearchParams(location.search);
  const wanted = params.get('slug') || '';
  const title = document.getElementById('readingTitle');
  const meta = document.getElementById('readingMeta');
  const content = document.getElementById('readingContent');
  const nav = document.getElementById('readingNav');

  function normalize(r){return {...r,title:r.title||r.judul||'Tanpa judul',content:r.content||r.body||r.isi||'',theme:r.theme||r.category||r.kategori||'Catatan',type:r.type==='jurnal'?'jurnal':'puisi',slug:r.slug||slugify(r.title||r.judul),date:r.published_at||r.created_at};}
  function setTheme(dark){document.body.classList.toggle('dark',dark);localStorage.setItem('ykb-theme',dark?'dark':'light');}
  const saved=localStorage.getItem('ykb-theme'); if(saved) setTheme(saved==='dark');
  document.getElementById('themeToggle')?.addEventListener('click',()=>setTheme(!document.body.classList.contains('dark')));

  function render(r){
    document.title = `${r.title} — Yang Kita Bicarakan`;
    meta.textContent = `${r.type==='jurnal'?'JURNAL':'PUISI'}  ·  ${fmt(r.date)}  ·  ${r.theme}`;
    title.textContent = r.title;
    content.innerHTML = r.content ? r.content.split(/\n\s*\n/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('') : '<p class="reading-empty">Tulisan ini belum memiliki isi.</p>';
  }
  function navLinks(rows, idx){
    const prev=rows[idx+1], next=rows[idx-1];
    const card=(r,label)=>r?`<a href="puisi.html?slug=${encodeURIComponent(r.slug)}"><small>${label} · ${r.type==='jurnal'?'Jurnal':'Puisi'}</small><strong>${esc(r.title)}</strong></a>`:'<span></span>';
    nav.innerHTML=card(prev,'sebelumnya')+card(next,'berikutnya');
  }
  async function load(){
    const {data,error}=await sb.from('poems').select('*').eq('status','published').order('published_at',{ascending:false,nullsFirst:false});
    if(error){meta.textContent='TIDAK DAPAT MEMUAT';title.textContent='Ada yang belum tersambung.';content.innerHTML=`<p class="reading-error">${esc(error.message)}</p>`;return;}
    const rows=(data||[]).map(normalize); const idx=rows.findIndex(r=>r.slug===wanted || slugify(r.title)===wanted);
    if(idx<0){meta.textContent='TULISAN TIDAK DITEMUKAN';title.textContent='Mungkin tulisan ini sudah berpindah.';content.innerHTML='<p class="reading-empty">Kembali ke arsip untuk menemukan tulisan lain.</p>';return;}
    render(rows[idx]); navLinks(rows,idx);
  }
  load();
})();
