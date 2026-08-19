const poems=[
["Hal-Hal yang Kita Simpan","19 Agustus 2026","Kehilangan","poem/hal-hal-yang-kita-simpan.html"],
["Setelah Lampu Dipadamkan","14 Agustus 2026","Malam","#"],
["Kita yang Tidak Jadi Pergi","08 Agustus 2026","Pulang","#"],
["Nama yang Tidak Kusebut","02 Agustus 2026","Rindu","#"],
["Jam Dua","28 Juli 2026","Malam","#"],
["Rumah yang Kita Tinggalkan","21 Juli 2026","Pulang","#"]
];
function renderArchive(q=""){const box=document.getElementById("archive");if(!box)return;const x=poems.filter(p=>p.join(" ").toLowerCase().includes(q.toLowerCase()));box.innerHTML='<div class="archive-year">2026</div>'+x.map(p=>`<a href="${p[3]}"><span>${p[1]}</span>${p[0]} <small>· ${p[2]}</small></a>`).join("")}
renderArchive();
document.getElementById("search")?.addEventListener("input",e=>renderArchive(e.target.value));
document.getElementById("random")?.addEventListener("click",()=>{location.href=poems[Math.floor(Math.random()*poems.length)][3]});
document.querySelectorAll("#theme").forEach(b=>b.addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.theme=document.body.classList.contains("dark")?"dark":"light"}));
if(localStorage.theme==="dark")document.body.classList.add("dark");
const save=document.getElementById("save"),publish=document.getElementById("publish"),draftBox=document.getElementById("draftBox");
function showDraft(){if(!draftBox)return;let d=JSON.parse(localStorage.drafts||"[]");draftBox.innerHTML=d.length?d.map(x=>`<div><span>${x.title||"Puisi tanpa judul"}<small>${x.tag}</small></span><small>${x.date}</small></div>`).join(""):"<div><span>Belum ada draft.</span></div>"}
function draft(){let x={title:document.getElementById("title")?.value,tag:document.getElementById("tag")?.value,date:new Date().toLocaleString("id-ID")};let d=JSON.parse(localStorage.drafts||"[]");d.unshift(x);localStorage.drafts=JSON.stringify(d);showDraft();alert("Draft tersimpan di perangkat ini.");}
save?.addEventListener("click",draft);showDraft();
publish?.addEventListener("click",()=>{alert("Mode publikasi akan kita sambungkan ke database/hosting pada tahap online.");});
