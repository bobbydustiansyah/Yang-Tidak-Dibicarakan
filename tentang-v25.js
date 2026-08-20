(() => {
 const key="ykb-theme", btn=document.getElementById("themeToggle");
 if(localStorage.getItem(key)==="dark")document.body.classList.add("dark");
 btn?.addEventListener("click",()=>{
   document.body.classList.toggle("dark");
   localStorage.setItem(key,document.body.classList.contains("dark")?"dark":"light");
 });
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
