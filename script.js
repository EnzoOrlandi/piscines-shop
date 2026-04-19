
/* =========================
   🌊 AQUALEx SAFE MODE FIX
========================= */

/* 🔥 RESET SAFE (évite bugs anciens) */
let products = JSON.parse(localStorage.getItem("products"));
if (!products) {
  products = [
    { name: "Piscine Bodard", price: 3500, desc: "Idéale famille", img: "images/piscine1.jpg" },
    { name: "Piscine Pegasus", price: 5000, desc: "Design moderne", img: "images/piscine2.jpg" },
    { name: "Piscine Lidon", price: 10000, desc: "Relax total", img: "images/piscine3.jpg" }
  ];
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favs = JSON.parse(localStorage.getItem("favs")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

let user = JSON.parse(localStorage.getItem("user")) || null;

const ADMIN_USER = "Mohamed93";
const ADMIN_PASSWORD = "Mapiscine93200";

let isAdmin = false;

/* =========================
   💾 SAVE SAFE
========================= */
function save() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("favs", JSON.stringify(favs));
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("user", JSON.stringify(user));
}

/* =========================
   🔐 REGISTER (FIX TOTAL)
========================= */
function register() {

  let name = document.getElementById("user").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;
  let region = document.getElementById("region").value;
  let country = document.getElementById("country").value;
  let pass = document.getElementById("password").value;

  if (!name || !email || !phone || !address || !region || !country || !pass) {
    alert("❌ Remplis tous les champs");
    return;
  }

  for (let u of users) {
    if (u.name.toLowerCase() === name.toLowerCase()) {
      alert("❌ Utilisateur déjà existant");
      return;
    }
  }

  let newUser = {
    name,
    password: pass,
    email,
    phone,
    address,
    region,
    country,
    role: "client"
  };

  users.push(newUser);
  user = newUser;

  save();
  show("shop");
}

/* =========================
   🔑 LOGIN (ULTRA SIMPLE SAFE)
========================= */
function login() {

  let name = document.getElementById("user").value;
  let pass = document.getElementById("password").value;

  if (!name || !pass) {
    alert("❌ Remplis tout");
    return;
  }

  if (name === ADMIN_USER && pass === ADMIN_PASSWORD) {
    user = { name, role: "admin" };
    isAdmin = true;
    save();
    show("shop");
    return;
  }

  for (let u of users) {
    if (u.name === name && u.password === pass) {
      user = u;
      isAdmin = false;
      save();
      show("shop");
      return;
    }
  }

  alert("❌ Login incorrect");
}

/* =========================
   🧭 SHOW PAGE (SAFE)
========================= */
function show(page) {

  if (!user && page !== "login") {
    page = "login";
  }

  if (page === "admin") {
    let pass = prompt("Mot de passe admin ?");
    if (pass !== ADMIN_PASSWORD) {
      alert("❌ Refusé");
      return;
    }
    isAdmin = true;
  }

  if (page === "ordersPage" && !isAdmin) {
    alert("❌ Admin seulement");
    return;
  }

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  let el = document.getElementById(page);
  if (el) el.classList.add("active");

  render();
}

/* =========================
   🧠 RENDER SAFE
========================= */
function render() {

  document.getElementById("count").innerText = cart.length;

  let shop = document.getElementById("shop");
  if (shop) {
    shop.innerHTML = "";
    for (let i = 0; i < products.length; i++) {
      let p = products[i];
      shop.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <div class="content">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <p class="price">${p.price}€</p>

          <button onclick="add(${i})">Ajouter</button>
          <button onclick="fav(${i})">❤️</button>
        </div>
      </div>`;
    }
  }

  let c = document.getElementById("cart");
  if (c) {
    c.innerHTML = "";
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
      total += cart[i].price;
      c.innerHTML += `
      <p>${cart[i].name} - ${cart[i].price}€
      <button onclick="remove(${i})">❌</button></p>`;
    }

    let t = document.getElementById("total");
    if (t) t.innerText = "Total : " + total + "€";
  }

  let f = document.getElementById("fav");
  if (f) {
    f.innerHTML = "";
    for (let p of favs) {
      f.innerHTML += `<p>${p.name} - ${p.price}€</p>`;
    }
  }

  let o = document.getElementById("orders");
  if (o) {
    o.innerHTML = isAdmin
      ? orders.map(or => `
        <div style="background:white;padding:10px;margin:10px;border-radius:10px">
        📦 ${or.date} - ${or.total}€
        </div>`).join("")
      : "<p>🔒 Admin seulement</p>";
  }
}

/* =========================
   🛒 ACTIONS
========================= */
function add(i) {
  cart.push(products[i]);
  save();
  render();
}

function remove(i) {
  cart.splice(i, 1);
  save();
  render();
}

function fav(i) {
  if (!favs.find(x => x.name === products[i].name)) {
    favs.push(products[i]);
    save();
    render();
  }
}

/* =========================
   💳 PAY
========================= */
function pay() {
  if (cart.length === 0) return alert("Panier vide");

  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price;
  }

  orders.push({
    date: new Date().toLocaleString(),
    total: total,
    items: [...cart]
  });

  cart = [];
  save();
  render();

  alert("Paiement OK ✅");
}

/* INIT */
render();
