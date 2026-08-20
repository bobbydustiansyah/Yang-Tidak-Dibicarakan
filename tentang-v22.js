(() => {
 const key="ykb-theme", btn=document.getElementById("themeToggle");
 if(localStorage.getItem(key)==="dark")document.body.classList.add("dark");
 btn?.addEventListener("click",()=>{
   document.body.classList.toggle("dark");
   localStorage.setItem(key,document.body.classList.contains("dark")?"dark":"light");
 });
})();