const add = document.getElementById("add");
const modi = document.getElementById("modi");

function opentask() {
  add.showModal();
}
window.opentask = opentask;
document.addEventListener("click", function (e) {
  if (e.target === add) {
    add.close();
  }
});
document.addEventListener("click", function (e) {
  if (e.target === modi) {
    modi.close();
  }
});
function verif(t, d) {
  const title = document.getElementById(t).value.trim();
  const desc = document.getElementById(d).value.trim();
  if (title.length > 30 || !title) {
    alert("maximum title length is 30\n cannot be an empty string");
    return false;
  }
  if (desc.length > 255 || !desc) {
    alert("maximum description length is 255 \n cannot be an empty string");
    return false;
  }
  return true;
}
document.getElementById("addform").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!verif("title", "desc")) return;

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("desc").value.trim();
  await fetch("/ajout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  add.close();
  document.getElementById("addform").reset();
  loader();
});
document.getElementById("modiform").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!verif("titlem", "descm")) return;

  const idm = document.getElementById("idm").value.trim();
  const title = document.getElementById("titlem").value.trim();
  const description = document.getElementById("descm").value.trim();
  await fetch("/modi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idm, title, description }),
  });
  modi.close();
  document.getElementById("modiform").reset();
  loader();
});
async function loader() {
  let res = await fetch("/api/task").then((r) => r.json());
  let n = 0;
  const t = [
    "bg-amber-500",
    "bg-fuchsia-900",
    "bg-gray-600",
    "bg-teal-600",
    "bg-yellow-900",
  ];
  document.getElementById("contenu").innerHTML = "";
  for (const i of res) {
    const pdiv = document.createElement("div");
    const div1 = document.createElement("div");
    const br = document.createElement("br");
    const p = document.createElement("p");
    const ar = document.createElement("article");
    const div2 = document.createElement("div");
    const bm = document.createElement("button");
    const btd = document.createElement("button");
    pdiv.className = "flex flex-row space-x-3";
    bm.className =
      "text-white bg-blue-500 px-6 py-3 rounded-lg transition duration-300 hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]";
    bm.textContent = "Modify";
    bm.addEventListener("click", () => {
      modi.showModal();
      document.getElementById("idm").value = i._id;
      document.getElementById("titlem").value = i.title;
      document.getElementById("descm").value = i.description;
    });
    btd.className =
      "text-white bg-green-500 px-6 py-3 rounded-lg transition duration-300 hover:bg-green-600 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]";
    btd.textContent = "Done";
    btd.addEventListener("click", async () => {
      await fetch("/del", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: i._id }),
      });
      loader();
    });
    div2.className = "flex flex-col space-y-1";
    div2.append(bm, btd);
    div1.className =
      "flex flex-col " + t[n % 5] + " rounded-2xl w-[40%] pl-2 py-4 mb-2";
    p.textContent = i.title;
    p.className = "text-white text-3xl ";
    p.style.cssText = "font-family:algerian,fantasy;";
    ar.textContent = i.description;
    ar.className = "text-white text-[26px]";
    div1.append(p, ar);
    pdiv.append(div1, div2, br);
    document.getElementById("contenu").appendChild(pdiv);
    n++;
  }
}
loader();
