(() => {
 const key="ykb-theme", btn=document.getElementById("themeToggle");
 if(localStorage.getItem(key)==="dark")document.body.classList.add("dark");
 btn?.addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem(key,document.body.classList.contains("dark")?"dark":"light")});
 const sb=window.supabase?.createClient(window.SUPABASE_URL,window.SUPABASE_KEY);
 async function load(){if(!sb)return;const {data,error}=await sb.from("site_content").select("key,value");if(error)return;const map=Object.fromEntries((data||[]).map(x=>[x.key,x.value]));document.querySelectorAll("[data-content]").forEach(el=>{const key=el.dataset.content;if(map[key]!==undefined)el.textContent=map[key]})}
 load();
})();
(() => {const btn=document.getElementById("mobileMenu"),nav=document.getElementById("mobileNav");if(!btn||!nav)return;btn.addEventListener("click",()=>{const open=nav.classList.toggle("open");btn.setAttribute("aria-expanded",String(open));btn.textContent=open?"×":"☰";nav.setAttribute("aria-hidden",String(!open))});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");btn.setAttribute("aria-expanded","false");btn.textContent="☰";nav.setAttribute("aria-hidden","true")}))})();
