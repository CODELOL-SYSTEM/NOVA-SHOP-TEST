import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAZ5vAkAEfIBpfLyhxgO7uvNdJ67KYKWD0",
  authDomain: "novashop-4ee63.firebaseapp.com",
  projectId: "novashop-4ee63",
  storageBucket: "novashop-4ee63.firebasestorage.app",
  messagingSenderId: "1044964015809",
  appId: "1:1044964015809:web:4eafe0b1aede48f8539e40",
  measurementId: "G-XNY5X2VMY9"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);


/* =========================================================
   ADMIN
========================================================= */

const ADMIN_EMAIL = "pc2alex.les@gmail.com";
const ADMIN_CODE = "NOVA-ADMIN-2026";
const ADMIN_ACCESS_KEY = "novaAdminAuthorized";


/* =========================================================
   DOM
========================================================= */

const $ = id => document.getElementById(id);

const searchInput = $("searchInput");
const categoriesEl = $("categories");

const productsGrid = $("productGrid");
const productCount = $("productCount") || { textContent:"" };

const cartBtn = $("cartBtn");
const cartBadge = $("cartBadge");
const cartOverlay = $("overlay");
const cartDrawer = $("cartDrawer");
const cartClose = $("closeCart");
const cartItems = $("cartItems");
const cartTotal = $("cartTotal");
const checkoutBtn = $("checkoutBtn");

const settingsBtn = $("settingsBtn");
const accountBtn = $("accountBtn");
const ordersBtn = $("ordersBtn");
const adminBtn = $("adminBtn");

const modal = $("modalLayer");
const modalContent = $("modalContent");
const modalClose = $("modalClose");


/* =========================================================
   TOAST
========================================================= */

const toastContainer = (() => {

  const el = document.createElement("div");

  el.id = "novaToastContainer";

  el.style.cssText =
    "position:fixed;" +
    "z-index:9999;" +
    "left:50%;" +
    "bottom:25px;" +
    "transform:translateX(-50%);" +
    "display:flex;" +
    "flex-direction:column;" +
    "gap:8px;" +
    "pointer-events:none;";

  document.body.appendChild(el);

  return el;

})();


/* =========================================================
   IMAGE SYSTEM
========================================================= */

const FALLBACK_IMAGE =
  "https://placehold.co/800x800/111827/ffffff?text=NovaShop";


function imageUrl(url){

  if(!url){
    return FALLBACK_IMAGE;
  }

  if(
    url.startsWith("./") ||
    url.startsWith("../") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ){
    return url;
  }

  return "https://wsrv.nl/?url=" +
    encodeURIComponent(url);

}


function imageSrc(url){

  return escapeAttribute(
    imageUrl(url)
  );

}


function imageError(img, original){

  if(!img) return;

  const stage =
    img.dataset.imageStage || "proxy";

  if(stage === "proxy"){

    img.dataset.imageStage = "original";
    img.src = original || FALLBACK_IMAGE;
    return;

  }

  img.dataset.imageStage = "fallback";
  img.src = FALLBACK_IMAGE;

}


/* Inline HTML onerror handlers run outside the ES module scope. */
window.imageError = imageError;


/* =========================================================
   PRODUCTS
========================================================= */

const products = [

{
id:"p1",
name:"Gigabyte B650 AORUS Elite AX",
category:"Composants",
price:189.99,
image:"https://m.media-amazon.com/images/I/81JFKzNyl+L._AC_SL1500_.jpg"
},

{
id:"p2",
name:"PC Gamer AMD Ryzen 7 7800X3D | RX 9070 XT | 32 Go DDR5",
category:"PC Gamer",
price:2237.65,
image:"https://www.memorypc.fr/thumbnail/53/79/73/1786604635/019f8f1c2c6972a8a3ea1ee9516a0652_1784812416_800x800.png"
},

{
id:"p3",
name:"HyperX Cloud II",
category:"Casques",
price:49.99,
image:"https://fr.hyperx.com/cdn/shop/files/hyperx_cloud_ii_red_1_main.jpg?v=1764129756"
},

{
id:"p4",
name:"TECORS Clavier Gamer Mécanique 60% AZERTY",
category:"Claviers",
price:30,
image:"https://m.media-amazon.com/images/I/71-lhAU97VL._AC_SL1500_.jpg"
},

{
id:"p5",
name:"Clavier Magnétique 65% Celshading Noir",
category:"Claviers",
price:120.90,
image:"https://tryhard-gear.com/cdn/shop/files/TestCelshadingnoirV2.webp?v=1762273866&width=832"
},

{
id:"p6",
name:"Ajazz AJ199 MAX Carbon Fiber Wireless Gaming Mouse",
category:"Souris",
price:49.99,
image:"https://ae-pic-a1.aliexpress-media.com/kf/S1e981b53ccfe4e1391cd5b5deb4fce87o.png_960x960.png_.avif"
},

{
id:"p7",
name:"Logitech G PRO X2 Superstrike Blanc et Noir",
category:"Souris",
price:150.99,
image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/7a/34/bc/29111418/1540-1.jpg"
},

{
id:"p8",
name:"Samsung 990 PRO 1TB",
category:"Stockage",
price:249.99,
image:"https://content.pearl.fr/media/cache/default/article_ultralarge_high_nocrop/shared/images/articles/M/MW1/disque-dur-interne-ssd-990-pro-pcie-nvme-m-2-2280-1-to-ref_MW1148_2.jpg"
},

{
id:"p9",
name:"Samsung 990 PRO 2TB",
category:"Stockage",
price:199.93,
image:"https://pc.comparer.fr/500x500/310191422.webp"
},

{
id:"p10",
name:"CORSAIR RM1000x EU",
category:"Alimentations",
price:159.90,
image:"https://assets.corsair.com/image/upload/c_pad,q_85,h_608,w_608,f_auto/products/Power-Supply-Units/base-rmx-2024-config/gallery/black/1000/RM1000x_2024_01.webp"
},

{
id:"p11",
name:"CORSAIR RM850x EU",
category:"Alimentations",
price:134.90,
image:"https://assets.corsair.com/image/upload/c_pad,q_85,h_608,w_608,f_auto/products/Power-Supply-Units/base-rmx-2024-config/gallery/black/850/RM850x_2024_01.webp"
},

{
id:"p12",
name:"Corsair Frame 5000D RS ARGB Noir",
category:"Boîtiers",
price:159.90,
image:"https://media.ldlc.com/r1600/ld/products/00/06/26/05/LD0006260502.jpg"
},

{
id:"p13",
name:"ARCTIC Liquid Freezer III Pro 360 A-RGB Black",
category:"Refroidissement",
price:129.90,
image:"https://cdn.idealo.com/folder/Product/206182/0/206182034/s4_produktbild_gross/arctic-liquid-freezer-iii-pro-360-a-rgb-black.jpg"
},

{
id:"p14",
name:"Samsung 27 QD-OLED Odyssey G6",
category:"Écrans",
price:399.95,
image:"https://media.ldlc.com/r705/ld/products/00/06/32/99/LD0006329977.jpg"
},

{
id:"p15",
name:"ELGATO Wave Mic Arm Pro",
category:"Streaming",
price:229.90,
image:"https://www.digit-photo.com/images/produits/ELGATO10AAT9901/1.jpg"
},

{
id:"p16",
name:"Sony DualSense Cosmic Red PS5/PC",
category:"Manettes",
price:74.90,
image:"https://media.carrefour.fr/media/referential/media/cc07d7de4b9e4bea8c063e8f9bb46d94/p_200x200/0711719023005_0.jpg"
},

{
id:"p17",
name:"ASUS TUF Gaming B650-PLUS",
category:"Composants",
price:179.90,
image:"https://media.materiel.net/r550/products/MN0005986139.jpg"
},

{
id:"p18",
name:"MSI MAG B650 Tomahawk WiFi",
category:"Composants",
price:189.90,
image:"https://m.media-amazon.com/images/I/71TYAcZ4J8L._AC_SL1200_.jpg"
},

{
id:"p19",
name:"KOORUI Ecran PC Gamer 27 Pouces 200Hz IPS QHD HDR400 1ms",
category:"Écrans",
price:74.99,
image:"https://m.media-amazon.com/images/I/71CJ1DF-8sL._AC_SL1500_.jpg"
},

{
id:"p20",
name:'iiyama 23.8" LED - G-Master GB2471HS-B1 Red Eagle',
category:"Écrans",
price:65.99,
image:"https://media.ldlc.com/r1600/ld/products/00/06/34/20/LD0006342033.jpg"
},

{
id:"p21",
name:"SONGMICS Chaise de jeu ergonomique avec repose-pieds 150 kg gris ardoise",
category:"Chaises gaming",
price:129.99,
image:"https://static.songmics.fr/fit-in/1000x1000/image/Product/B34OBG077G01/B34OBG077G01-1.jpg"
},

{
id:"p22",
name:"Dowinx Série Luxe Suède LS-66D68E Blanc",
category:"Chaises gaming",
price:79.99,
image:"https://eu.dowinx.com/cdn/shop/files/11_5f72b693-5f79-4d06-b48a-7cb2b2f0244a.png?v=1752139814&width=1220"
},

{
id:"p23",
name:"Chaise GTPLAYER Ergonomique Gaming Soutien Lombaire Repose-pieds",
category:"Chaises gaming",
price:109.99,
image:"https://thumb.pccomponentes.com/w-530-530/articles/1118/11186247/167-silla-gaming-gtplayer-ergonomica-con-reposapies-y-soporte-lumbar-4d.jpg"
},

{
id:"p24",
name:"Desk Lite - Height-Adjustable Desk",
category:"Bureaux gaming",
price:110.99,
image:"https://yaasa.com/cdn/shop/files/yaasa-desk-lite_nr01_black_100_01-04545-01_1200x.jpg?v=1753169928"
},

{
id:"p25",
name:"EUREKA ERGONOMIC Bureau Gaming LED 182x76cm en Forme d'Aile",
category:"Bureaux gaming",
price:86.99,
image:"https://m.media-amazon.com/images/I/71Gd5G3wRsL._AC_SL1500_.jpg"
},

{
id:"p26",
name:"Bureau gaming d’angle HOMCOM réversible support écran",
category:"Bureaux gaming",
price:44.99,
image:"https://cdn.manomano.com/pim-media/images/medium/74eca1cb1cefa063c8f600ee293ae6ee826794f8.jpg"
},

{
id:"p27",
name:"Logitech G Pro X 2 Lightspeed Noir + Repose casque",
category:"Casques",
price:99.99,
image:"https://static.fnac-static.com/multimedia/Images/FR/MDMFR/MDM/6d/e9/6e/24045933/1540-1/tsp20260429154901/Casque-PC-gaming-sans-fil-Logitech-G-Pro-X-2-Lightspeed-Noir-Repose-casque.jpg"
},

{
id:"p28",
name:"Razer BlackShark V2 Pro 2023 Noir",
category:"Casques",
price:75.99,
image:"https://media.ldlc.com/r1600/ld/products/00/06/07/71/LD0006077125.jpg"
},

{
id:"p29",
name:"beyerdynamic DT-990 Pro 250 Ohm",
category:"Casques",
price:60.99,
image:"https://m.media-amazon.com/images/I/71R5YQ0T1wL._AC_SL1500_.jpg"
},

{
id:"p30",
name:"Logitech PRO X TKL Rapid Noir, filaire AZERTY",
category:"Claviers",
price:78.99,
image:"https://m.media-amazon.com/images/I/71z4m4vYVQL._AC_SL1500_.jpg"
},

{
id:"p31",
name:"QwertyKey75 HE Striker, Magnetic Hall Effect, Rapid Trigger, Snap Tap",
category:"Claviers",
price:56.99,
image:"https://qwertykey.ro/cdn/shop/files/striker-1.webp"
},

{
id:"p32",
name:"GravaStar Mercury K1 Clavier Gamer sans Fil en Aluminium, Noir Dégradé",
category:"Claviers",
price:91.99,
image:"https://m.media-amazon.com/images/I/71d4h7u8mLL._AC_SL1500_.jpg"
},

{
id:"p33",
name:"ATTACK SHARK R11 Ultra, fibre de carbone, 8000Hz, 49g, 42000 DPI",
category:"Souris",
price:26.99,
image:"https://m.media-amazon.com/images/I/71bMz15SqcL._AC_SL1500_.jpg"
},

{
id:"p34",
name:"HyperX QuadCast 2 – Microphone USB – RGB",
category:"Microphones",
price:98.99,
image:"https://fr.hyperx.com/cdn/shop/files/hyperx_quadcast_2_872v1aa_main_1_2d47a555-f537-457b-9002-8b9e9010dc00.jpg?v=1763067608"
},

{
id:"p35",
name:"Shure SM7 dB",
category:"Microphones",
price:121.99,
image:"https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_57/573672/18492412_800.jpg"
},

{
id:"p36",
name:"Razer Seiren V3 Chroma Noir",
category:"Microphones",
price:13.99,
image:"https://media.ldlc.com/r1600/ld/products/00/06/13/25/LD0006132588.jpg"
},

{
id:"p37",
name:"Stairville LED Pixel Rail 40 RGB MKII",
category:"Éclairage RGB",
price:18.90,
image:"https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_44/449739/14448905_800.jpg"
},

{
id:"p38",
name:"Govee LED Strip Light RGBIC Wi-Fi + Bluetooth 5m Matter",
category:"Éclairage RGB",
price:8,
image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/ab/7a/9d/27097771/1520-2/tsp20260429155350/Ruban-LED-Govee-LED-Strip-Light-RGBIC-Wi-Fi-avec-BT-5M-Matter.jpg"
},

{
id:"p39",
name:"Lampe de plafond hexagone nid d’abeille LED 2.4m x 4.8m contour bleu",
category:"Éclairage RGB",
price:91.10,
image:"https://www.discount-autosport.com/wp-content/webp-express/webp-images/uploads/2025/02/lampe-hexagone-plafond-led-4m80-contour-bleu-.jpg.webp"
},

{
id:"p40",
name:"GIGABYTE GeForce RTX 5050 WINDFORCE OC 8G",
category:"Cartes graphiques",
price:147,
image:"https://m.media-amazon.com/images/I/41kmHFMFPOL._SL500_.jpg"
},

{
id:"p41",
name:"MSI GeForce RTX 3050 LP E 6G OC",
category:"Cartes graphiques",
price:100,
image:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTCe_rha_tAAHPWnQ8VV7GIvF-uSqUaEyU61TSnwgM4CK8g3-x_3Hq4wOgH36Ri63eAiWHsvhmRJHzVrUQR9-IwMx31WH0w"
},

{
id:"p42",
name:"ASUS Dual Radeon RX 7600 EVO OC Edition 8GB GDDR6",
category:"Cartes graphiques",
price:140,
image:"https://m.media-amazon.com/images/I/81QItJufypL._AC_SL1500_.jpg"
},

{
id:"p43",
name:"PC Gamer Fixe, Ryzen 7 5700G, Vega 8, 16G DDR4, 1T SSD",
category:"PC Gamer",
price:650,
image:"https://m.media-amazon.com/images/I/81M3iU5S4QL._AC_SL1500_.jpg",
new:true
}

];


/* =========================================================
   STATE
========================================================= */

let currentUser = null;
let selectedCategory = "Toutes";
let searchValue = "";
let cart = [];
let reviewsCache = {};


/* =========================================================
   STORAGE
========================================================= */

function loadCart(){

  try{

    const data =
      JSON.parse(
        localStorage.getItem("novaCart") || "[]"
      );

    if(Array.isArray(data)){
      cart = data;
    }

  }catch{

    cart = [];

  }

}


function saveCart(){

  localStorage.setItem(
    "novaCart",
    JSON.stringify(cart)
  );

}


loadCart();


/* =========================================================
   THEME
========================================================= */

function applyTheme(){

  const choice =
    localStorage.getItem("novaThemeChoice") || "dark";

  document.body.classList.remove("light");

  if(choice === "light"){
    document.body.classList.add("light");
  }

  if(choice === "auto"){

    const isLight =
      window.matchMedia &&
      window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;

    if(isLight){
      document.body.classList.add("light");
    }

  }

}


applyTheme();


/* =========================================================
   CURRENCY
========================================================= */

function money(value){

  if(value === 0){
    return "Prix à venir";
  }

  return new Intl.NumberFormat(
    "fr-FR",
    {
      style:"currency",
      currency:"EUR"
    }
  ).format(value);

}


/* =========================================================
   REVIEWS
========================================================= */

function reviewData(product){

  const number =
    parseInt(
      product.id.replace("p",""),
      10
    );

  const count =
    132 + ((number * 173) % 1604);

  const rating =
    4.4 + ((number % 6) * 0.1);

  return {
    count,
    rating:Number(rating.toFixed(1))
  };

}


function starsHTML(rating){

  const rounded =
    Math.round(rating);

  let html = "";

  for(let i=1;i<=5;i++){

    html +=
      i <= rounded
        ? "★"
        : "☆";

  }

  return html;

}


/* =========================================================
   CATEGORIES
========================================================= */

function getCategories(){

  return [
    "Toutes",
    ...new Set(
      products.map(
        product => product.category
      )
    )
  ];

}


function renderCategories(){

  categoriesEl.innerHTML =
    getCategories()
      .map(category => {

        const active =
          category === selectedCategory
            ? "active"
            : "";

        return `
          <button
            class="category-btn ${active}"
            data-category="${escapeHTML(category)}"
          >
            ${escapeHTML(category)}
          </button>
        `;

      })
      .join("");

  categoriesEl
    .querySelectorAll("[data-category]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          selectedCategory =
            button.dataset.category;

          renderCategories();
          renderProducts();

        }
      );

    });

}


/* =========================================================
   FILTER
========================================================= */

function filteredProducts(){

  const search =
    searchValue
      .trim()
      .toLowerCase();

  return products.filter(product => {

    const categoryOK =
      selectedCategory === "Toutes" ||
      product.category === selectedCategory;

    const searchOK =
      !search ||
      product.name
        .toLowerCase()
        .includes(search) ||
      product.category
        .toLowerCase()
        .includes(search);

    return categoryOK && searchOK;

  });

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function productCardHTML(product){

  const reviews =
    reviewData(product);

  const originalImage =
    escapeAttribute(product.image);

  const proxiedImage =
    imageSrc(product.image);

  return `

    <article class="product-card">

      <div class="product-image">

        ${
          product.new
            ? `<span class="new-badge">Nouveau</span>`
            : ""
        }

        <img
          src="${proxiedImage}"
          data-original="${originalImage}"
          alt="${escapeAttribute(product.name)}"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          onerror="imageError(this,this.dataset.original)"
        >

      </div>

      <div class="product-body">

        <div class="product-category">
          ${escapeHTML(product.category)}
        </div>

        <div class="product-name">
          ${escapeHTML(product.name)}
        </div>

        <div class="rating">

          <span class="stars">
            ${starsHTML(reviews.rating)}
          </span>

          <span class="rating-score">
            ${reviews.rating
              .toFixed(1)
              .replace(".",",")}
          </span>

          <span class="rating-count">
            · ${reviews.count.toLocaleString("fr-FR")} avis
          </span>

        </div>

        <div class="product-bottom">

          <div class="price ${
            product.price === 0
              ? "free"
              : ""
          }">
            ${money(product.price)}
          </div>

        </div>

        <div class="product-actions">

          <button
            class="btn btn-secondary btn-small view-btn"
            data-view="${product.id}"
          >
            Voir
          </button>

          <button
            class="btn btn-primary btn-small add-btn"
            data-add="${product.id}"
          >
            🛒 Ajouter
          </button>

        </div>

      </div>

    </article>

  `;

}


/* =========================================================
   PRODUCTS RENDER
========================================================= */

function renderProducts(){

  const list =
    filteredProducts();

  if(productCount){

    productCount.textContent =
      `${list.length} produit${
        list.length > 1 ? "s" : ""
      }`;

  }

  if(!list.length){

    productsGrid.innerHTML = `

      <div class="empty">

        <div class="empty-icon">
          ⌕
        </div>

        <h3>
          Aucun produit trouvé
        </h3>

        <p>
          Essaie une autre recherche ou une autre catégorie.
        </p>

        <button
          class="btn btn-secondary btn-small"
          id="resetFilters"
        >
          Réinitialiser
        </button>

      </div>

    `;

    $("resetFilters").onclick = () => {

      searchValue = "";
      searchInput.value = "";
      selectedCategory = "Toutes";

      renderCategories();
      renderProducts();

    };

    return;

  }

  productsGrid.innerHTML =
    list
      .map(productCardHTML)
      .join("");


  productsGrid
    .querySelectorAll("[data-view]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openProduct(
            button.dataset.view
          );

        }
      );

    });


  productsGrid
    .querySelectorAll("[data-add]")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          const product =
            products.find(
              p =>
                p.id ===
                button.dataset.add
            );

          if(!product) return;

          addToCart(product.id);

        }
      );

    });

}


/* =========================================================
   SEARCH
========================================================= */

if(searchInput){

  searchInput.addEventListener(
    "input",
    event => {

      searchValue =
        event.target.value || "";

      renderProducts();

    }
  );

}


/* =========================================================
   ESCAPE HELPERS
========================================================= */

function escapeHTML(value){

  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


function escapeAttribute(value){

  return escapeHTML(value);

}


/* =========================================================
   MODAL
========================================================= */

function openModal(html){

  if(!modal || !modalContent) return;

  modalContent.innerHTML = html;

  modal.classList.add("open");

  document.body.classList.add("modal-open");

}


function closeModal(){

  if(!modal) return;

  modal.classList.remove("open");

  document.body.classList.remove("modal-open");

}


if(modalClose){

  modalClose.onclick = closeModal;

}


if(modal){

  modal.addEventListener(
    "click",
    event => {

      if(event.target === modal){
        closeModal();
      }

    }
  );

}


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProduct(productId){

  const product =
    products.find(
      p => p.id === productId
    );

  if(!product) return;

  const reviews =
    reviewData(product);

  openModal(`

    <div class="product-modal">

      <button
        class="modal-product-close"
        id="modalProductClose"
      >
        ✕
      </button>

      <div class="product-modal-image">

        <img
          src="${imageSrc(product.image)}"
          data-original="${escapeAttribute(product.image)}"
          alt="${escapeAttribute(product.name)}"
          referrerpolicy="no-referrer"
          onerror="imageError(this,this.dataset.original)"
        >

      </div>

      <div class="product-modal-info">

        <div class="product-category">
          ${escapeHTML(product.category)}
        </div>

        <h2>
          ${escapeHTML(product.name)}
        </h2>

        <div class="rating">

          <span class="stars">
            ${starsHTML(reviews.rating)}
          </span>

          <strong>
            ${reviews.rating
              .toFixed(1)
              .replace(".",",")}
          </strong>

          <span>
            ${reviews.count.toLocaleString("fr-FR")} avis
          </span>

        </div>

        <div class="product-modal-price">
          ${money(product.price)}
        </div>

        <button
          class="btn btn-primary btn-wide"
          id="modalAddProduct"
        >
          🛒 Ajouter au panier
        </button>

      </div>

    </div>

  `);


  const closeBtn =
    $("modalProductClose");

  if(closeBtn){
    closeBtn.onclick = closeModal;
  }


  const addBtn =
    $("modalAddProduct");

  if(addBtn){

    addBtn.onclick = () => {

      addToCart(product.id);
      closeModal();

    };

  }

}


/* =========================================================
   CART
========================================================= */

function cartDetailed(){

  return cart
    .map(item => {

      const product =
        products.find(
          p => p.id === item.id
        );

      if(!product) return null;

      return {
        ...product,
        qty:Math.max(
          1,
          Number(item.qty) || 1
        )
      };

    })
    .filter(Boolean);

}


function cartCount(){

  return cartDetailed()
    .reduce(
      (total,item) =>
        total + item.qty,
      0
    );

}


function cartSubtotal(){

  return cartDetailed()
    .reduce(
      (total,item) =>
        total +
        item.price *
        item.qty,
      0
    );

}


function addToCart(productId){

  const product =
    products.find(
      p => p.id === productId
    );

  if(!product) return;

  const existing =
    cart.find(
      item =>
        item.id === productId
    );

  if(existing){

    existing.qty =
      Number(existing.qty || 0) + 1;

  }else{

    cart.push({
      id:productId,
      qty:1
    });

  }

  saveCart();
  renderCart();

  showToast(
    `${product.name} ajouté au panier`
  );

}


function removeFromCart(productId){

  cart =
    cart.filter(
      item =>
        item.id !== productId
    );

  saveCart();
  renderCart();

}


function changeCartQty(productId, amount){

  const item =
    cart.find(
      x =>
        x.id === productId
    );

  if(!item) return;

  item.qty =
    Math.max(
      1,
      Number(item.qty || 1) +
      Number(amount || 0)
    );

  saveCart();
  renderCart();

}


/* =========================================================
   CART RENDER
========================================================= */

function renderCart(){

  const items =
    cartDetailed();

  const count =
    cartCount();

  if(cartBadge){

    cartBadge.textContent =
      count;

    cartBadge.style.display =
      count > 0
        ? ""
        : "none";

  }


  if(cartTotal){

    cartTotal.textContent =
      money(cartSubtotal());

  }


  if(!cartItems) return;


  if(!items.length){

    cartItems.innerHTML = `

      <div class="empty">

        <div class="empty-icon">
          🛒
        </div>

        <h3>
          Ton panier est vide
        </h3>

        <p>
          Ajoute des produits pour commencer.
        </p>

      </div>

    `;

    return;

  }


  cartItems.innerHTML =
    items
      .map(item => `

        <div class="cart-item">

          <img
            src="${imageSrc(item.image)}"
            data-original="${escapeAttribute(item.image)}"
            alt="${escapeAttribute(item.name)}"
            onerror="imageError(this,this.dataset.original)"
          >

          <div class="cart-item-info">

            <div class="cart-item-name">
              ${escapeHTML(item.name)}
            </div>

            <div class="cart-item-price">
              ${money(item.price)}
            </div>

            <div class="cart-item-controls">

              <button
                class="qty-btn"
                data-minus="${item.id}"
              >
                −
              </button>

              <span>
                ${item.qty}
              </span>

              <button
                class="qty-btn"
                data-plus="${item.id}"
              >
                +
              </button>

              <button
                class="remove-btn"
                data-remove="${item.id}"
              >
                🗑️
              </button>

            </div>

          </div>

        </div>

      `)
      .join("");


  cartItems
    .querySelectorAll("[data-minus]")
    .forEach(button => {

      button.onclick = () => {

        const id =
          button.dataset.minus;

        const item =
          cart.find(
            x => x.id === id
          );

        if(!item) return;

        if(Number(item.qty) <= 1){

          removeFromCart(id);

        }else{

          changeCartQty(id,-1);

        }

      };

    });


  cartItems
    .querySelectorAll("[data-plus]")
    .forEach(button => {

      button.onclick = () => {

        changeCartQty(
          button.dataset.plus,
          1
        );

      };

    });


  cartItems
    .querySelectorAll("[data-remove]")
    .forEach(button => {

      button.onclick = () => {

        removeFromCart(
          button.dataset.remove
        );

      };

    });

}


/* =========================================================
   CART OPEN / CLOSE
========================================================= */

function openCart(){

  if(cartOverlay){
    cartOverlay.classList.add("open");
  }

  if(cartDrawer){
    cartDrawer.classList.add("open");
  }

}


function closeCart(){

  if(cartOverlay){
    cartOverlay.classList.remove("open");
  }

  if(cartDrawer){
    cartDrawer.classList.remove("open");
  }

}


if(cartBtn){
  cartBtn.onclick = openCart;
}


if(cartClose){
  cartClose.onclick = closeCart;
}


if(cartOverlay){
  cartOverlay.onclick = closeCart;
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message){

  const toast =
    document.createElement("div");

  toast.textContent =
    message;

  toast.style.cssText =
    "background:#111827;" +
    "color:white;" +
    "padding:12px 16px;" +
    "border-radius:12px;" +
    "font-weight:700;" +
    "font-size:14px;" +
    "box-shadow:0 12px 30px rgba(0,0,0,.35);" +
    "border:1px solid rgba(255,255,255,.08);";

  toastContainer.appendChild(toast);

  setTimeout(() => {

    toast.style.opacity = "0";
    toast.style.transform = "translateY(5px)";
    toast.style.transition =
      "opacity .2s,transform .2s";

    setTimeout(
      () => toast.remove(),
      220
    );

  },2600);

}


/* =========================================================
   ACCOUNT ERRORS
========================================================= */

function authErrorMessage(error){

  const code =
    error?.code || "";

  const map = {

    "auth/invalid-email":
      "Adresse e-mail invalide.",

    "auth/user-not-found":
      "Aucun compte avec cette adresse.",

    "auth/wrong-password":
      "Mot de passe incorrect.",

    "auth/invalid-credential":
      "E-mail ou mot de passe incorrect.",

    "auth/email-already-in-use":
      "Cette adresse e-mail est déjà utilisée.",

    "auth/weak-password":
      "Le mot de passe est trop faible.",

    "auth/network-request-failed":
      "Erreur réseau. Réessaie.",

    "auth/too-many-requests":
      "Trop de tentatives. Réessaie plus tard."

  };

  return (
    map[code] ||
    "Une erreur est survenue. Réessaie."
  );

}


/* =========================================================
   ACCOUNT MODAL
========================================================= */

function openAccount(){

  if(currentUser){

    openModal(`

      <div class="account-panel">

        <div class="modal-header">

          <div>

            <div class="eyebrow">
              COMPTE
            </div>

            <h2>
              Mon compte
            </h2>

          </div>

          <button
            class="modal-close-inside"
            id="accountClose"
          >
            ✕
          </button>

        </div>

        <div class="account-connected">

          <div class="account-avatar">
            👤
          </div>

          <div>

            <strong>
              Connecté
            </strong>

            <p>
              ${escapeHTML(
                currentUser.email || ""
              )}
            </p>

          </div>

        </div>

        <button
          class="btn btn-secondary btn-wide"
          id="logoutBtn"
        >
          🚪 Se déconnecter
        </button>

      </div>

    `);


    $("accountClose").onclick =
      closeModal;


    $("logoutBtn").onclick =
      async () => {

        try{

          await signOut(auth);

          closeModal();

          showToast(
            "Déconnexion réussie."
          );

        }catch(error){

          showToast(
            authErrorMessage(error)
          );

        }

      };

    return;

  }


  openModal(`

    <div class="account-panel">

      <div class="modal-header">

        <div>

          <div class="eyebrow">
            NOVASHOP
          </div>

          <h2>
            Connexion
          </h2>

        </div>

        <button
          class="modal-close-inside"
          id="accountClose"
        >
          ✕
        </button>

      </div>

      <div class="auth-tabs">

        <button
          class="auth-tab active"
          id="loginTab"
        >
          Connexion
        </button>

        <button
          class="auth-tab"
          id="registerTab"
        >
          Créer un compte
        </button>

      </div>

      <div id="authFormContainer">

        <form id="loginForm">

          <label>
            E-mail
          </label>

          <input
            id="loginEmail"
            type="email"
            autocomplete="email"
            required
          >

          <label>
            Mot de passe
          </label>

          <input
            id="loginPassword"
            type="password"
            autocomplete="current-password"
            required
          >

          <div
            id="loginError"
            class="form-error"
          ></div>

          <button
            class="btn btn-primary btn-wide"
            type="submit"
          >
            Se connecter
          </button>

        </form>

      </div>

    </div>

  `);


  $("accountClose").onclick =
    closeModal;


  const loginTab =
    $("loginTab");

  const registerTab =
    $("registerTab");

  const container =
    $("authFormContainer");


  function showLogin(){

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    container.innerHTML = `

      <form id="loginForm">

        <label>
          E-mail
        </label>

        <input
          id="loginEmail"
          type="email"
          autocomplete="email"
          required
        >

        <label>
          Mot de passe
        </label>

        <input
          id="loginPassword"
          type="password"
          autocomplete="current-password"
          required
        >

        <div
          id="loginError"
          class="form-error"
        ></div>

        <button
          class="btn btn-primary btn-wide"
          type="submit"
        >
          Se connecter
        </button>

      </form>

    `;

    bindLogin();

  }


  function showRegister(){

    loginTab.classList.remove("active");
    registerTab.classList.add("active");

    container.innerHTML = `

      <form id="registerForm">

        <label>
          E-mail
        </label>

        <input
          id="registerEmail"
          type="email"
          autocomplete="email"
          required
        >

        <label>
          Mot de passe
        </label>

        <input
          id="registerPassword"
          type="password"
          autocomplete="new-password"
          minlength="6"
          required
        >

        <label>
          Confirmer le mot de passe
        </label>

        <input
          id="registerPassword2"
          type="password"
          autocomplete="new-password"
          minlength="6"
          required
        >

        <div
          id="registerError"
          class="form-error"
        ></div>

        <button
          class="btn btn-primary btn-wide"
          type="submit"
        >
          Créer mon compte
        </button>

      </form>

    `;

    bindRegister();

  }


  function bindLogin(){

    const form =
      $("loginForm");

    if(!form) return;

    form.onsubmit =
      async event => {

        event.preventDefault();

        const email =
          $("loginEmail")
            .value
            .trim();

        const password =
          $("loginPassword")
            .value;

        const errorEl =
          $("loginError");

        errorEl.textContent = "";

        try{

          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          closeModal();

          showToast(
            "Connexion réussie."
          );

        }catch(error){

          errorEl.textContent =
            authErrorMessage(error);

        }

      };

  }


  function bindRegister(){

    const form =
      $("registerForm");

    if(!form) return;

    form.onsubmit =
      async event => {

        event.preventDefault();

        const email =
          $("registerEmail")
            .value
            .trim();

        const password =
          $("registerPassword")
            .value;

        const password2 =
          $("registerPassword2")
            .value;

        const errorEl =
          $("registerError");

        errorEl.textContent = "";

        if(password !== password2){

          errorEl.textContent =
            "Les mots de passe ne correspondent pas.";

          return;

        }

        try{

          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          closeModal();

          showToast(
            "Compte créé avec succès."
          );

        }catch(error){

          errorEl.textContent =
            authErrorMessage(error);

        }

      };

  }


  loginTab.onclick =
    showLogin;

  registerTab.onclick =
    showRegister;

  bindLogin();

}


/* =========================================================
   SETTINGS
========================================================= */

function openSettings(){

  const current =
    localStorage.getItem(
      "novaThemeChoice"
    ) || "dark";

  openModal(`

    <div class="settings-panel">

      <div class="modal-header">

        <div>

          <div class="eyebrow">
            NOVASHOP
          </div>

          <h2>
            Paramètres
          </h2>

        </div>

        <button
          class="modal-close-inside"
          id="settingsClose"
        >
          ✕
        </button>

      </div>

      <div class="settings-section">

        <h3>
          Apparence
        </h3>

        <div class="settings-options">

          <label class="setting-option">

            <input
              type="radio"
              name="theme"
              value="dark"
              ${current === "dark" ? "checked" : ""}
            >

            <span>
              🌙 Mode sombre
            </span>

          </label>

          <label class="setting-option">

            <input
              type="radio"
              name="theme"
              value="light"
              ${current === "light" ? "checked" : ""}
            >

            <span>
              ☀️ Mode clair
            </span>

          </label>

          <label class="setting-option">

            <input
              type="radio"
              name="theme"
              value="auto"
              ${current === "auto" ? "checked" : ""}
            >

            <span>
              🖥️ Automatique
            </span>

          </label>

        </div>

      </div>

    </div>

  `);


  $("settingsClose").onclick =
    closeModal;


  document
    .querySelectorAll(
      'input[name="theme"]'
    )
    .forEach(input => {

      input.onchange = () => {

        localStorage.setItem(
          "novaThemeChoice",
          input.value
        );

        applyTheme();

      };

    });

}


/* =========================================================
   CHECKOUT START
========================================================= */

let promoApplied = false;


function openCheckout(){

  if(!currentUser){

    showToast(
      "Connecte-toi pour passer commande."
    );

    openAccount();

    return;

  }


  const items =
    cartDetailed();

  if(!items.length){

    showToast(
      "Ton panier est vide."
    );

    return;

  }


  promoApplied = false;

  renderCheckout();

}


if(checkoutBtn){

  checkoutBtn.onclick =
    openCheckout;

}


/* =========================================================
   CHECKOUT RENDER
========================================================= */

function renderCheckout(){

  const items =
    cartDetailed();

  const subtotal =
    cartSubtotal();

  const total =
    promoApplied
      ? 0
      : subtotal;


  openModal(`

    <div class="checkout-panel">

      <div class="modal-header">

        <div>

          <div class="eyebrow">
            NOVASHOP
          </div>

          <h2>
            Finaliser la commande
          </h2>

        </div>

        <button
          class="modal-close-inside"
          id="checkoutClose"
        >
          ✕
        </button>

      </div>


      <div class="checkout-grid">


        <div class="checkout-form">


          <h3>
            📦 Adresse de livraison
          </h3>


          <div class="form-row">

            <div>

              <label>
                Prénom
              </label>

              <input
                id="checkoutFirstName"
                autocomplete="given-name"
                required
              >

            </div>


            <div>

              <label>
                Nom
              </label>

              <input
                id="checkoutLastName"
                autocomplete="family-name"
                required
              >

            </div>

          </div>


          <label>
            Adresse
          </label>

          <input
            id="checkoutStreet"
            autocomplete="street-address"
            required
          >


          <div class="form-row">

            <div>

              <label>
                Code postal
              </label>

              <input
                id="checkoutPostal"
                autocomplete="postal-code"
                required
              >

            </div>


            <div>

              <label>
                Ville
              </label>

              <input
                id="checkoutCity"
                autocomplete="address-level2"
                required
              >

            </div>

          </div>


          <label>
            Pays
          </label>

          <input
            id="checkoutCountry"
            value="France"
            autocomplete="country-name"
            required
          >


          <h3 style="margin-top:20px;">
            🎟️ Code promotionnel
          </h3>


          <div class="promo-row">

            <input
              id="promoCode"
              placeholder="Code promo"
              autocomplete="off"
            >

            <button
              class="btn btn-secondary"
              id="applyPromo"
              type="button"
            >
              Appliquer
            </button>

          </div>


          <div
            id="promoMessage"
            class="form-message"
          ></div>


          <h3 style="margin-top:20px;">
            💳 Paiement
          </h3>


          <div class="payment-options">

            <button
              class="payment-option"
              id="paypalPayment"
              type="button"
            >

              <strong>
                PayPal
              </strong>

              <span>
                Paiement via PayPal.Me
              </span>

            </button>


            <button
              class="payment-option"
              id="cardPayment"
              type="button"
            >

              <strong>
                💳 Payer par CB
              </strong>

              <span>
                Carte bancaire
              </span>

            </button>

          </div>


        </div>


        <div class="checkout-summary">

          <h3>
            🛒 Résumé
          </h3>

          <div class="checkout-items">

            ${items.map(item => `

              <div class="checkout-item">

                <span>
                  ${escapeHTML(item.name)}
                  × ${item.qty}
                </span>

                <strong>
                  ${money(
                    item.price *
                    item.qty
                  )}
                </strong>

              </div>

            `).join("")}

          </div>


          <div class="checkout-total-row">

            <span>
              Sous-total
            </span>

            <strong>
              ${money(subtotal)}
            </strong>

          </div>


          ${
            promoApplied
              ? `
                <div class="checkout-total-row promo-applied">

                  <span>
                    Réduction NOVA100
                  </span>

                  <strong>
                    -${money(subtotal)}
                  </strong>

                </div>
              `
              : ""
          }


          <div class="checkout-total-final">

            <span>
              Total
            </span>

            <strong>
              ${total === 0
                ? "Gratuit"
                : money(total)}
            </strong>

          </div>

        </div>

      </div>

    </div>

  `);


  $("checkoutClose").onclick =
    closeModal;


  $("applyPromo").onclick =
    () => {

      const code =
        $("promoCode")
          .value
          .trim()
          .toUpperCase();

      if(code === "NOVA100"){

        promoApplied = true;

        $("promoMessage").innerHTML =
          `
            <span class="success">
              ✓ Code NOVA100 appliqué : commande gratuite
            </span>
          `;

        renderCheckout();

      }else{

        promoApplied = false;

        $("promoMessage").innerHTML =
          `
            <span class="form-error">
              Code promotionnel invalide.
            </span>
          `;

      }

    };


  $("paypalPayment").onclick =
    () => {

      submitCheckout("paypal");

    };


  $("cardPayment").onclick =
    () => {

      openCardPayment();

    };

}/* =========================================================
   CHECKOUT / ORDER CREATION
========================================================= */

async function submitCheckout(method){

  if(!currentUser){

    showToast(
      "Connecte-toi pour passer commande."
    );

    openAccount();
    return;

  }


  const items =
    cartDetailed();

  if(!items.length){

    showToast(
      "Ton panier est vide."
    );

    return;

  }


  const firstName =
    $("checkoutFirstName")?.value.trim() || "";

  const lastName =
    $("checkoutLastName")?.value.trim() || "";

  const street =
    $("checkoutStreet")?.value.trim() || "";

  const postalCode =
    $("checkoutPostal")?.value.trim() || "";

  const city =
    $("checkoutCity")?.value.trim() || "";

  const country =
    $("checkoutCountry")?.value.trim() || "France";


  if(
    !firstName ||
    !lastName ||
    !street ||
    !postalCode ||
    !city ||
    !country
  ){

    showToast(
      "Remplis toute l'adresse de livraison."
    );

    return;

  }


  const subtotal =
    cartSubtotal();

  const total =
    promoApplied
      ? 0
      : subtotal;


  if(method === "card"){

    openCardPayment();
    return;

  }


  await createCheckoutOrder({

    items,
    subtotal,
    total,

    address:{
      firstName,
      lastName,
      street,
      postalCode,
      city,
      country
    }

  });

}


/* =========================================================
   CREATE FIRESTORE ORDER
========================================================= */

async function createCheckoutOrder(data){

  if(!currentUser){

    showToast(
      "Connecte-toi pour continuer."
    );

    return;

  }


  try{

    const orderData = {

      userId:currentUser.uid,

      email:
        currentUser.email || "",

      items:
        data.items.map(item => ({

          id:item.id,
          name:item.name,
          price:item.price,
          qty:item.qty

        })),

      subtotal:
        Number(data.subtotal || 0),

      total:
        Number(data.total || 0),

      promoCode:
        promoApplied
          ? "NOVA100"
          : "",

      discount:
        Number(data.subtotal || 0) -
        Number(data.total || 0),

      address:data.address,

      status:"Enregistrée",

      paymentMethod:
        data.total === 0
          ? "NOVA100"
          : "PayPal.Me",

      paymentStatus:
        data.total === 0
          ? "free"
          : "pending",

      createdAt:
        serverTimestamp()

    };


    const orderRef =
      await addDoc(
        collection(db,"orders"),
        orderData
      );


    cart = [];

    saveCart();
    renderCart();
    closeModal();


    if(data.total === 0){

      showToast(
        "Commande gratuite enregistrée 🎉"
      );

      setTimeout(
        () => openOrders(),
        300
      );

      return;

    }


    const paypalAmount =
      Number(data.total || 0);


    const paypalURL =
      "https://paypal.me/SH0PNOVA/" +
      encodeURIComponent(
        paypalAmount.toFixed(2)
      ) +
      "EUR";


    showToast(
      "Commande enregistrée. Ouverture de PayPal..."
    );


    setTimeout(
      () => {

        window.location.href =
          paypalURL;

      },
      700
    );


  }catch(error){

    console.error(
      "Création commande:",
      error
    );

    showToast(
      "Impossible d'enregistrer la commande."
    );

  }

}


/* =========================================================
   CARD PAYMENT UI
========================================================= */

function openCardPayment(){

  openModal(`

    <div class="card-payment-panel">

      <div class="modal-header">

        <div>

          <div class="eyebrow">
            NOVASHOP
          </div>

          <h2>
            💳 Paiement par carte
          </h2>

        </div>

        <button
          class="modal-close-inside"
          id="cardClose"
        >
          ✕
        </button>

      </div>


      <div class="card-payment-box">

        <div class="card-brand">
          💳
        </div>


        <label>
          Nom complet
        </label>

        <input
          id="cardName"
          type="text"
          autocomplete="off"
          placeholder="Nom sur la carte"
        >


        <label>
          Numéro de carte
        </label>

        <input
          id="cardNumber"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          maxlength="19"
          placeholder="0000 0000 0000 0000"
        >


        <div class="form-row">

          <div>

            <label>
              Expiration
            </label>

            <input
              id="cardExpiry"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              maxlength="5"
              placeholder="MM/AA"
            >

          </div>


          <div>

            <label>
              CVV
            </label>

            <input
              id="cardCVV"
              type="password"
              inputmode="numeric"
              autocomplete="off"
              maxlength="4"
              placeholder="•••"
            >

          </div>

        </div>


        <div
          id="cardPaymentMessage"
          class="form-message"
        ></div>


        <button
          class="btn btn-primary btn-wide"
          id="validateCardPayment"
          type="button"
        >
          💳 Valider le paiement
        </button>


        <button
          class="btn btn-secondary btn-wide"
          id="backToCheckout"
          type="button"
        >
          ← Retour
        </button>

      </div>

    </div>

  `);


  $("cardClose").onclick =
    closeModal;


  const numberInput =
    $("cardNumber");


  if(numberInput){

    numberInput.addEventListener(
      "input",
      () => {

        let value =
          numberInput.value
            .replace(/\D/g,"")
            .slice(0,16);

        let groups = [];

        for(
          let i=0;
          i<value.length;
          i+=4
        ){

          groups.push(
            value.slice(
              i,
              i + 4
            )
          );

        }

        numberInput.value =
          groups.join(" ");

      }
    );

  }


  const expiryInput =
    $("cardExpiry");


  if(expiryInput){

    expiryInput.addEventListener(
      "input",
      () => {

        let value =
          expiryInput.value
            .replace(/\D/g,"")
            .slice(0,4);

        if(value.length > 2){

          value =
            value.slice(0,2) +
            "/" +
            value.slice(2);

        }

        expiryInput.value =
          value;

      }
    );

  }


  const cvvInput =
    $("cardCVV");


  if(cvvInput){

    cvvInput.addEventListener(
      "input",
      () => {

        cvvInput.value =
          cvvInput.value
            .replace(/\D/g,"")
            .slice(0,4);

      }
    );

  }


  $("validateCardPayment").onclick =
    () => {

      const message =
        $("cardPaymentMessage");

      if(message){

        message.innerHTML = `
          <span class="form-error">
            Carte incorrecte
          </span>
        `;

      }


      showToast(
        "Carte incorrecte"
      );


      $("cardName").value = "";
      $("cardNumber").value = "";
      $("cardExpiry").value = "";
      $("cardCVV").value = "";

    };


  $("backToCheckout").onclick =
    () => {

      renderCheckout();

    };

}


/* =========================================================
   ORDER STATUSES
========================================================= */

const ORDER_STATUSES = [

  "Enregistrée",
  "Acceptée",
  "Préparation",
  "En transit",
  "Livraison proche",
  "Livrée",
  "Annulée",
  "Remboursement en cours"

];


function statusClass(status){

  const value =
    String(status || "")
      .toLowerCase();


  if(value === "livrée"){
    return "delivered";
  }

  if(value === "annulée"){
    return "cancelled";
  }

  if(
    value ===
      "remboursement en cours"
  ){

    return "refund";

  }

  if(
    value === "en transit" ||
    value === "acceptée" ||
    value === "préparation"
  ){

    return "transit";

  }

  if(
    value ===
      "livraison proche"
  ){

    return "nearby";

  }

  return "";

}


function statusIcon(status){

  const map = {

    "Enregistrée":"📝",
    "Acceptée":"✅",
    "Préparation":"📦",
    "En transit":"🚚",
    "Livraison proche":"📍",
    "Livrée":"🎉",
    "Annulée":"❌",
    "Remboursement en cours":"💸"

  };

  return (
    map[status] ||
    "📦"
  );

}


function canDeleteOrder(order){

  return (
    order?.status === "Livrée" ||
    order?.status === "Annulée"
  );

}


/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(value){

  if(!value){
    return "Date inconnue";
  }


  let date;


  if(
    typeof value === "object" &&
    typeof value.toDate === "function"
  ){

    date = value.toDate();

  }else if(
    value instanceof Date
  ){

    date = value;

  }else{

    date = new Date(value);

  }


  if(
    !date ||
    Number.isNaN(
      date.getTime()
    )
  ){

    return "Date inconnue";

  }


  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle:"medium",
      timeStyle:"short"
    }
  ).format(date);

}


/* =========================================================
   ORDER ID
========================================================= */

function shortOrderId(id){

  if(!id){
    return "Commande";
  }

  return id.length > 12
    ? id.slice(0,12) + "..."
    : id;

}


/* =========================================================
   ORDER TIMELINE
========================================================= */

function orderTimelineHTML(order){

  const currentStatus =
    order.status ||
    "Enregistrée";


  const currentIndex =
    ORDER_STATUSES.indexOf(
      currentStatus
    );


  const timelineStatuses = [

    "Enregistrée",
    "Acceptée",
    "Préparation",
    "En transit",
    "Livraison proche",
    "Livrée"

  ];


  let html = `

    <div class="order-timeline">

  `;


  timelineStatuses.forEach(
    (status,index) => {

      let state = "";

      if(
        currentStatus ===
          "Annulée"
      ){

        state =
          index === 0
            ? "done"
            : "";

      }else if(
        currentStatus ===
          "Remboursement en cours"
      ){

        state =
          index === 0
            ? "done"
            : "";

      }else if(
        currentIndex >= index
      ){

        state = "done";

      }


      html += `

        <div
          class="timeline-step ${state}"
        >

          <div class="timeline-dot">
            ${state === "done"
              ? "✓"
              : index + 1}
          </div>

          <div class="timeline-content">

            <strong>
              ${escapeHTML(status)}
            </strong>

          </div>

        </div>

      `;

    }
  );


  if(
    currentStatus ===
      "Annulée"
  ){

    html += `

      <div
        class="timeline-step done cancelled"
      >

        <div class="timeline-dot">
          ❌
        </div>

        <div class="timeline-content">

          <strong>
            Commande annulée
          </strong>

        </div>

      </div>

    `;

  }


  if(
    currentStatus ===
      "Remboursement en cours"
  ){

    html += `

      <div
        class="timeline-step done refund"
      >

        <div class="timeline-dot">
          💸
        </div>

        <div class="timeline-content">

          <strong>
            Remboursement en cours
          </strong>

        </div>

      </div>

    `;

  }


  html += `
    </div>
  `;


  return html;

}


/* =========================================================
   ORDERS
========================================================= */

async function getUserOrders(){

  if(!currentUser){
    return [];
  }


  const ordersQuery =
    query(
      collection(db,"orders"),
      where(
        "userId",
        "==",
        currentUser.uid
      )
    );


  const snapshot =
    await getDocs(
      ordersQuery
    );


  const orders =
    snapshot.docs.map(
      orderDoc => ({
        id:orderDoc.id,
        ...orderDoc.data()
      })
    );


  orders.sort(
    (a,b) => {

      const getTime =
        value => {

          if(
            value &&
            typeof value.toDate ===
              "function"
          ){

            return value
              .toDate()
              .getTime();

          }

          const date =
            new Date(value || 0);

          return Number.isNaN(
            date.getTime()
          )
            ? 0
            : date.getTime();

        };


      return (
        getTime(b.createdAt) -
        getTime(a.createdAt)
      );

    }
  );


  return orders;

}


/* =========================================================
   OPEN ORDERS
========================================================= */

async function openOrders(){

  if(!currentUser){

    showToast(
      "Connecte-toi pour voir tes commandes."
    );

    openAccount();

    return;

  }


  openModal(`

    <div class="nova-orders-panel">

      <div class="modal-header">

        <div>

          <div class="eyebrow">
            NOVASHOP
          </div>

          <h2>
            📦 Mes commandes
          </h2>

        </div>

        <button
          class="modal-close-inside"
          id="ordersClose"
        >
          ✕
        </button>

      </div>


      <div
        id="ordersLoading"
        class="empty"
      >

        <div class="empty-icon">
          ⏳
        </div>

        <h3>
          Chargement...
        </h3>

      </div>


      <div
        id="ordersList"
      ></div>

    </div>

  `);


  $("ordersClose").onclick =
    closeModal;


  const list =
    $("ordersList");

  const loading =
    $("ordersLoading");


  try{

    const orders =
      await getUserOrders();


    if(loading){
      loading.remove();
    }


    if(!orders.length){

      list.innerHTML = `

        <div class="empty">

          <div class="empty-icon">
            📦
          </div>

          <h3>
            Aucune commande
          </h3>

          <p>
            Tes commandes apparaîtront ici.
          </p>

        </div>

      `;

      return;

    }


    list.innerHTML =
      orders.map(
        order => {

          const status =
            order.status ||
            "Enregistrée";

          const items =
            Array.isArray(order.items)
              ? order.items
              : [];

          const itemCount =
            items.reduce(
              (sum,item) =>
                sum +
                Number(item.qty || 0),
              0
            );

          const canDelete =
            canDeleteOrder(
              order
            );


          return `

            <div
              class="order nova-order-card"
              data-order-id="${escapeAttribute(order.id)}"
            >

              <div class="order-head nova-order-head">

                <div>

                  <strong>
                    Commande #${escapeHTML(
                      shortOrderId(order.id)
                    )}
                  </strong>

                  <div class="order-date">

                    ${escapeHTML(
                      formatDate(
                        order.createdAt
                      )
                    )}

                  </div>

                </div>


                <span
                  class="nova-status ${statusClass(status)}"
                >

                  ${statusIcon(status)}
                  ${escapeHTML(status)}

                </span>

              </div>


              <div class="nova-order-preview">

                <span>
                  📦 ${itemCount}
                  article${itemCount > 1 ? "s" : ""}
                </span>

                <strong>
                  ${money(
                    Number(order.total || 0)
                  )}
                </strong>

              </div>


              <div class="nova-order-actions">

                <button
                  class="btn btn-primary btn-wide nova-view-order"
                  data-view-order="${escapeAttribute(order.id)}"
                >
                  👁️ Voir la commande
                </button>

                ${
                  canDelete
                    ? `
                      <button
                        class="btn btn-danger btn-wide nova-delete-order"
                        data-delete-order="${escapeAttribute(order.id)}"
                      >
                        🗑️ Supprimer la commande
                      </button>
                    `
                    : ""
                }

              </div>

            </div>

          `;

        }
      ).join("");


    list
      .querySelectorAll(
        "[data-view-order]"
      )
      .forEach(button => {

        button.onclick =
          () => {

            openOrderDetails(
              button.dataset.viewOrder
            );

          };

      });


    list
      .querySelectorAll(
        "[data-delete-order]"
      )
      .forEach(button => {

        button.onclick =
          () => {

            deleteUserOrder(
              button.dataset.deleteOrder
            );

          };

      });


  }catch(error){

    console.error(
      "Chargement commandes:",
      error
    );


    if(loading){
      loading.remove();
    }


    list.innerHTML = `

      <div class="empty">

        <div class="empty-icon">
          ⚠️
        </div>

        <h3>
          Impossible de charger les commandes
        </h3>

        <p>
          Vérifie ta connexion puis réessaie.
        </p>

        <button
          class="btn btn-primary btn-small"
          id="retryOrders"
        >
          Réessayer
        </button>

      </div>

    `;


    $("retryOrders").onclick =
      openOrders;

  }

}/* =========================================================
   ORDER DETAILS
========================================================= */

async function openOrderDetails(orderId){

  if(!currentUser){

    showToast(
      "Connecte-toi pour voir cette commande."
    );

    openAccount();
    return;

  }


  openModal(`

    <div class="nova-order-details">

      <div class="modal-header">

        <div>

          <div class="eyebrow">
            NOVASHOP
          </div>

          <h2>
            📦 Détails de la commande
          </h2>

        </div>

        <button
          class="modal-close-inside"
          id="orderDetailsClose"
        >
          ✕
        </button>

      </div>


      <div
        id="orderDetailsLoading"
        class="empty"
      >

        <div class="empty-icon">
          ⏳
        </div>

        <h3>
          Chargement de la commande...
        </h3>

      </div>


      <div
        id="orderDetailsContent"
      ></div>

    </div>

  `);


  $("orderDetailsClose").onclick =
    closeModal;


  const content =
    $("orderDetailsContent");

  const loading =
    $("orderDetailsLoading");


  try{

    const orders =
      await getUserOrders();


    const order =
      orders.find(
        item =>
          item.id === orderId
      );


    if(loading){
      loading.remove();
    }


    if(!order){

      content.innerHTML = `

        <div class="empty">

          <div class="empty-icon">
            ❌
          </div>

          <h3>
            Commande introuvable
          </h3>

          <button
            class="btn btn-secondary btn-small"
            id="backOrders"
          >
            ← Mes commandes
          </button>

        </div>

      `;


      $("backOrders").onclick =
        openOrders;

      return;

    }


    const status =
      order.status ||
      "Enregistrée";


    const items =
      Array.isArray(order.items)
        ? order.items
        : [];


    const address =
      order.address || {};


    const packageCity =
      order.packageCity ||
      address.city ||
      "Non renseignée";


    const trackingNumber =
      order.trackingNumber ||
      "Pas encore renseigné";


    const deliveryDuration =
      order.deliveryDuration ||
      "Non renseignée";


    const estimatedDelivery =
      order.estimatedDelivery ||
      "Non renseignée";


    const paymentMethod =
      order.paymentMethod ||
      "Non renseigné";


    const paymentStatus =
      order.paymentStatus ||
      "Non renseigné";


    const total =
      Number(order.total || 0);


    content.innerHTML = `

      <div class="nova-detail-top">

        <button
          class="btn btn-secondary btn-small"
          id="backOrders"
        >
          ← Retour à mes commandes
        </button>

      </div>


      <div class="nova-order-card">

        <div class="nova-order-head">

          <div>

            <div class="eyebrow">
              COMMANDE
            </div>

            <h3>
              #${escapeHTML(order.id)}
            </h3>

            <div class="order-date">
              ${escapeHTML(
                formatDate(
                  order.createdAt
                )
              )}
            </div>

          </div>


          <span
            class="nova-status ${statusClass(status)}"
          >

            ${statusIcon(status)}
            ${escapeHTML(status)}

          </span>

        </div>


        <div
          class="nova-order-detail-section"
        >

          <h3>
            🛍️ Articles
          </h3>


          <div class="nova-order-items">

            ${
              items.length
                ? items.map(item => `

                    <div
                      class="nova-order-item"
                    >

                      <span>

                        ${escapeHTML(
                          item.name ||
                          "Produit"
                        )}

                        ×
                        ${Number(
                          item.qty || 0
                        )}

                      </span>


                      <strong>

                        ${money(
                          Number(
                            item.price || 0
                          ) *
                          Number(
                            item.qty || 0
                          )
                        )}

                      </strong>

                    </div>

                  `).join("")
                : `
                    <div class="empty">
                      Aucun article
                    </div>
                  `
            }

          </div>


          <div
            class="nova-detail-total"
          >

            <span>
              Total
            </span>

            <strong>
              ${total === 0
                ? "Gratuit"
                : money(total)}
            </strong>

          </div>

        </div>


        <div
          class="nova-order-detail-section"
        >

          <h3>
            🚚 Suivi du colis
          </h3>


          <div class="nova-package-box">

            <div>
              <strong>
                📍 Destination :
              </strong>

              ${escapeHTML(
                packageCity
              )}
            </div>


            <div>
              <strong>
                🔎 Numéro de suivi :
              </strong>

              <span>
                ${escapeHTML(
                  trackingNumber
                )}
              </span>
            </div>


            <div>
              <strong>
                ⏱️ Durée de livraison :
              </strong>

              ${escapeHTML(
                String(
                  deliveryDuration
                )
              )}
            </div>


            <div>
              <strong>
                📅 Livraison estimée :
              </strong>

              ${escapeHTML(
                String(
                  estimatedDelivery
                )
              )}
            </div>


            <div
              class="nova-detail-status"
            >

              <strong>
                📦 Statut actuel :
              </strong>

              <span
                class="nova-status ${statusClass(status)}"
              >

                ${statusIcon(status)}
                ${escapeHTML(status)}

              </span>

            </div>

          </div>

        </div>


        <div
          class="nova-order-detail-section"
        >

          <h3>
            🏠 Adresse
          </h3>


          <div
            class="nova-package-box"
          >

            <div>
              ${escapeHTML(
                (
                  address.firstName ||
                  ""
                ) +
                " " +
                (
                  address.lastName ||
                  ""
                )
              )}
            </div>


            <div>
              ${escapeHTML(
                address.street ||
                ""
              )}
            </div>


            <div>
              ${escapeHTML(
                (
                  address.postalCode ||
                  ""
                ) +
                " " +
                (
                  address.city ||
                  ""
                )
              )}
            </div>


            <div>
              ${escapeHTML(
                address.country ||
                ""
              )}
            </div>

          </div>

        </div>


        <div
          class="nova-order-detail-section"
        >

          <h3>
            💳 Paiement
          </h3>


          <div
            class="nova-package-box"
          >

            <div>

              <strong>
                Méthode :
              </strong>

              ${escapeHTML(
                paymentMethod
              )}

            </div>


            <div>

              <strong>
                Statut :
              </strong>

              ${escapeHTML(
                paymentStatus
              )}

            </div>

          </div>

        </div>


        <div
          class="nova-order-detail-section"
        >

          <h3>
            📍 Progression
          </h3>

          ${orderTimelineHTML(order)}

        </div>


        ${
          canDeleteOrder(order)
            ? `

              <button
                class="btn btn-danger btn-wide nova-delete-detail"
                id="deleteDetailOrder"
              >
                🗑️ Supprimer cette commande
              </button>

            `
            : ""
        }

      </div>

    `;


    $("backOrders").onclick =
      openOrders;


    const deleteButton =
      $("deleteDetailOrder");


    if(deleteButton){

      deleteButton.onclick =
        () => {

          deleteUserOrder(
            order.id
          );

        };

    }


  }catch(error){

    console.error(
      "Détails commande:",
      error
    );


    if(loading){
      loading.remove();
    }


    content.innerHTML = `

      <div class="empty">

        <div class="empty-icon">
          ⚠️
        </div>

        <h3>
          Impossible de charger la commande
        </h3>

        <button
          class="btn btn-secondary btn-small"
          id="backOrders"
        >
          ← Mes commandes
        </button>

      </div>

    `;


    $("backOrders").onclick =
      openOrders;

  }

}


/* =========================================================
   DELETE USER ORDER
========================================================= */

async function deleteUserOrder(orderId){

  if(!currentUser){
    return;
  }


  try{

    const orders =
      await getUserOrders();


    const order =
      orders.find(
        item =>
          item.id === orderId
      );


    if(!order){

      showToast(
        "Commande introuvable."
      );

      return;

    }


    if(!canDeleteOrder(order)){

      showToast(
        "Cette commande ne peut pas encore être supprimée."
      );

      return;

    }


    const confirmed =
      window.confirm(
        "Supprimer définitivement cette commande ?"
      );


    if(!confirmed){
      return;
    }


    await deleteDoc(
      doc(
        db,
        "orders",
        orderId
      )
    );


    showToast(
      "Commande supprimée."
    );


    openOrders();


  }catch(error){

    console.error(
      "Suppression commande:",
      error
    );


    showToast(
      "Impossible de supprimer la commande."
    );

  }

}


/* =========================================================
   ADMIN AUTH
========================================================= */

function isAdminUser(){

  if(!currentUser){
    return false;
  }


  return (
    String(
      currentUser.email || ""
    )
      .trim()
      .toLowerCase() ===
    ADMIN_EMAIL
      .trim()
      .toLowerCase()
  );

}


function isAdminAuthorized(){

  return (
    isAdminUser() &&
    localStorage.getItem(
      ADMIN_ACCESS_KEY
    ) === "true"
  );

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function openAdminLogin(){

  openModal(`

    <div class="admin-login">

      <div class="modal-header">

        <div>

          <div class="eyebrow">
            NOVASHOP
          </div>

          <h2>
            🔐 Administration
          </h2>

        </div>

        <button
          class="modal-close-inside"
          id="adminLoginClose"
        >
          ✕
        </button>

      </div>


      <p>
        Entre le code administrateur pour continuer.
      </p>


      <label>
        Code administrateur
      </label>

      <input
        id="adminCodeInput"
        type="password"
        autocomplete="off"
        placeholder="Code"
      >


      <div
        id="adminLoginError"
        class="form-error"
      ></div>


      <button
        class="btn btn-primary btn-wide"
        id="adminLoginButton"
      >
        🔓 Accéder au dashboard
      </button>

    </div>

  `);


  $("adminLoginClose").onclick =
    closeModal;


  $("adminLoginButton").onclick =
    () => {

      const code =
        $("adminCodeInput")
          .value
          .trim();


      if(code === ADMIN_CODE){

        localStorage.setItem(
          ADMIN_ACCESS_KEY,
          "true"
        );


        closeModal();

        openAdmin();

      }else{

        $("adminLoginError")
          .textContent =
          "Code incorrect.";

      }

    };


  $("adminCodeInput").addEventListener(
    "keydown",
    event => {

      if(event.key === "Enter"){

        $("adminLoginButton")
          .click();

      }

    }
  );

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

async function openAdmin(){

  if(!isAdminUser()){

    showToast(
      "Accès administrateur refusé."
    );

    return;

  }


  if(!isAdminAuthorized()){

    openAdminLogin();
    return;

  }


  openModal(`

    <div class="admin-panel">

      <div class="modal-header">

        <div>

          <div class="eyebrow">
            NOVASHOP
          </div>

          <h2>
            🛠️ Dashboard administrateur
          </h2>

        </div>

        <button
          class="modal-close-inside"
          id="adminClose"
        >
          ✕
        </button>

      </div>


      <div
        class="admin-top-actions"
      >

        <button
          class="btn btn-secondary"
          id="adminRefresh"
        >
          🔄 Actualiser
        </button>

        <button
          class="btn btn-secondary"
          id="adminLogout"
        >
          🔒 Verrouiller
        </button>

      </div>


      <div
        id="adminStats"
        class="admin-stats"
      ></div>


      <div
        id="adminOrdersList"
        class="admin-orders-list"
      >

        <div class="empty">

          <div class="empty-icon">
            ⏳
          </div>

          <h3>
            Chargement...
          </h3>

        </div>

      </div>

    </div>

  `);


  $("adminClose").onclick =
    closeModal;


  $("adminRefresh").onclick =
    () => {

      loadAdminOrders();

    };


  $("adminLogout").onclick =
    () => {

      localStorage.removeItem(
        ADMIN_ACCESS_KEY
      );

      closeModal();

      showToast(
        "Administration verrouillée."
      );

    };


  await loadAdminOrders();

}


/* =========================================================
   GET ALL ORDERS FOR ADMIN
========================================================= */

async function getAllOrders(){

  const snapshot =
    await getDocs(
      collection(db,"orders")
    );


  const orders =
    snapshot.docs.map(
      orderDoc => ({
        id:orderDoc.id,
        ...orderDoc.data()
      })
    );


  orders.sort(
    (a,b) => {

      const getTime =
        value => {

          if(
            value &&
            typeof value.toDate ===
              "function"
          ){

            return value
              .toDate()
              .getTime();

          }


          const date =
            new Date(value || 0);


          return Number.isNaN(
            date.getTime()
          )
            ? 0
            : date.getTime();

        };


      return (
        getTime(b.createdAt) -
        getTime(a.createdAt)
      );

    }
  );


  return orders;

}


/* =========================================================
   ADMIN ORDERS
========================================================= */

async function loadAdminOrders(){

  const list =
    $("adminOrdersList");

  const stats =
    $("adminStats");


  if(!list) return;


  list.innerHTML = `

    <div class="empty">

      <div class="empty-icon">
        ⏳
      </div>

      <h3>
        Chargement des commandes...
      </h3>

    </div>

  `;


  try{

    const orders =
      await getAllOrders();


    const totalOrders =
      orders.length;


    const delivered =
      orders.filter(
        order =>
          order.status ===
          "Livrée"
      ).length;


    const cancelled =
      orders.filter(
        order =>
          order.status ===
          "Annulée"
      ).length;


    const revenue =
      orders.reduce(
        (sum,order) =>
          sum +
          Number(
            order.total || 0
          ),
        0
      );


    if(stats){

      stats.innerHTML = `

        <div class="admin-stat">

          <span>
            📦 Commandes
          </span>

          <strong>
            ${totalOrders}
          </strong>

        </div>


        <div class="admin-stat">

          <span>
            🎉 Livrées
          </span>

          <strong>
            ${delivered}
          </strong>

        </div>


        <div class="admin-stat">

          <span>
            ❌ Annulées
          </span>

          <strong>
            ${cancelled}
          </strong>

        </div>


        <div class="admin-stat">

          <span>
            💶 Total
          </span>

          <strong>
            ${money(revenue)}
          </strong>

        </div>

      `;

    }


    if(!orders.length){

      list.innerHTML = `

        <div class="empty">

          <div class="empty-icon">
            📦
          </div>

          <h3>
            Aucune commande
          </h3>

        </div>

      `;

      return;

    }


    list.innerHTML =
      orders
        .map(
          order =>
            adminOrderHTML(order)
        )
        .join("");


    bindAdminOrderEvents();


  }catch(error){

    console.error(
      "Admin orders:",
      error
    );


    list.innerHTML = `

      <div class="empty">

        <div class="empty-icon">
          ⚠️
        </div>

        <h3>
          Erreur de chargement
        </h3>

        <p>
          Impossible de récupérer les commandes.
        </p>

        <button
          class="btn btn-primary btn-small"
          id="adminRetry"
        >
          Réessayer
        </button>

      </div>

    `;


    $("adminRetry").onclick =
      loadAdminOrders;

  }

}


/* =========================================================
   ADMIN ORDER HTML
========================================================= */

function adminOrderHTML(order){

  const status =
    order.status ||
    "Enregistrée";


  const address =
    order.address || {};


  const items =
    Array.isArray(order.items)
      ? order.items
      : [];


  return `

    <div
      class="admin-order"
      data-admin-order="${escapeAttribute(order.id)}"
    >

      <div class="admin-order-head">

        <div>

          <div class="eyebrow">
            COMMANDE
          </div>

          <h3>
            #${escapeHTML(order.id)}
          </h3>

          <div class="admin-order-info">

            <div>
              👤
              ${escapeHTML(
                order.email ||
                "E-mail inconnu"
              )}
            </div>

            <div>
              📅
              ${escapeHTML(
                formatDate(
                  order.createdAt
                )
              )}
            </div>

            <div>
              💶
              ${money(
                Number(
                  order.total || 0
                )
              )}
            </div>

          </div>

        </div>


        <span
          class="nova-status ${statusClass(status)}"
        >

          ${statusIcon(status)}
          ${escapeHTML(status)}

        </span>

      </div>


      <div
        class="admin-order-grid"
      >

        <div>

          <label>
            Statut
          </label>

          <select
            data-status-input="${escapeAttribute(order.id)}"
          >

            ${
              ORDER_STATUSES
                .map(
                  option => `

                    <option
                      value="${escapeAttribute(option)}"
                      ${
                        option === status
                          ? "selected"
                          : ""
                      }
                    >
                      ${escapeHTML(option)}
                    </option>

                  `
                )
                .join("")
            }

          </select>

        </div>


        <div>

          <label>
            Ville de livraison
          </label>

          <input
            type="text"
            data-city-input="${escapeAttribute(order.id)}"
            value="${escapeAttribute(
              order.packageCity ||
              address.city ||
              ""
            )}"
            placeholder="Ville"
          >

        </div>


        <div>

          <label>
            Numéro de suivi
          </label>

          <input
            type="text"
            data-tracking-input="${escapeAttribute(order.id)}"
            value="${escapeAttribute(
              order.trackingNumber ||
              ""
            )}"
            placeholder="Ex : FR123456789"
          >

        </div>


        <div>

          <label>
            Durée de livraison
          </label>

          <input
            type="text"
            data-duration-input="${escapeAttribute(order.id)}"
            value="${escapeAttribute(
              order.deliveryDuration ||
              ""
            )}"
            placeholder="Ex : 2 à 4 jours"
          >

        </div>


        <div>

          <label>
            Livraison estimée
          </label>

          <input
            type="text"
            data-date-input="${escapeAttribute(order.id)}"
            value="${escapeAttribute(
              order.estimatedDelivery ||
              ""
            )}"
            placeholder="Ex : 25 septembre"
          >

        </div>

      </div>


      <div class="admin-actions">

        <button
          class="btn btn-primary"
          data-save-order="${escapeAttribute(order.id)}"
        >
          💾 Enregistrer les changements
        </button>


        <button
          class="btn btn-secondary"
          data-invoice-order="${escapeAttribute(order.id)}"
        >
          🧾 Voir la facture
        </button>


        <button
          class="btn btn-danger"
          data-admin-delete-order="${escapeAttribute(order.id)}"
        >
          🗑️ Supprimer
        </button>

      </div>


      <div
        class="admin-items"
      >

        <strong>
          Articles :
        </strong>

        ${
          items.length
            ? items
                .map(
                  item => `
                    <div>
                      ${escapeHTML(
                        item.name ||
                        "Produit"
                      )}
                      × ${Number(
                        item.qty || 0
                      )}
                    </div>
                  `
                )
                .join("")
            : `
                <div>
                  Aucun article
                </div>
              `
        }

      </div>


      <div
        class="admin-address"
      >

        <strong>
          Adresse :
        </strong>

        <div>
          ${escapeHTML(
            (
              address.firstName ||
              ""
            ) +
            " " +
            (
              address.lastName ||
              ""
            )
          )}
        </div>

        <div>
          ${escapeHTML(
            address.street ||
            ""
          )}
        </div>

        <div>
          ${escapeHTML(
            (
              address.postalCode ||
              ""
            ) +
            " " +
            (
              address.city ||
              ""
            )
          )}
        </div>

        <div>
          ${escapeHTML(
            address.country ||
            ""
          )}
        </div>

      </div>

    </div>

  `;

}


/* =========================================================
   ADMIN EVENTS
========================================================= */

function bindAdminOrderEvents(){

  document
    .querySelectorAll(
      "[data-save-order]"
    )
    .forEach(button => {

      button.onclick =
        () => {

          saveAdminOrder(
            button.dataset.saveOrder
          );

        };

    });


  document
    .querySelectorAll(
      "[data-invoice-order]"
    )
    .forEach(button => {

      button.onclick =
        () => {

          printOrderInvoice(
            button.dataset.invoiceOrder
          );

        };

    });


  document
    .querySelectorAll(
      "[data-admin-delete-order]"
    )
    .forEach(button => {

      button.onclick =
        () => {

          adminDeleteOrder(
            button.dataset.adminDeleteOrder
          );

        };

    });

}


/* =========================================================
   SAVE ADMIN ORDER
========================================================= */

async function saveAdminOrder(orderId){

  if(!isAdminAuthorized()){

    showToast(
      "Administration verrouillée."
    );

    return;

  }


  const statusInput =
    document.querySelector(
      `[data-status-input="${CSS.escape(orderId)}"]`
    );


  const cityInput =
    document.querySelector(
      `[data-city-input="${CSS.escape(orderId)}"]`
    );


  const trackingInput =
    document.querySelector(
      `[data-tracking-input="${CSS.escape(orderId)}"]`
    );


  const durationInput =
    document.querySelector(
      `[data-duration-input="${CSS.escape(orderId)}"]`
    );


  const dateInput =
    document.querySelector(
      `[data-date-input="${CSS.escape(orderId)}"]`
    );


  const status =
    statusInput?.value ||
    "Enregistrée";


  const packageCity =
    cityInput?.value.trim() ||
    "";


  const trackingNumber =
    trackingInput?.value.trim() ||
    "";


  const deliveryDuration =
    durationInput?.value.trim() ||
    "";


  const estimatedDelivery =
    dateInput?.value.trim() ||
    "";


  try{

    await updateDoc(
      doc(
        db,
        "orders",
        orderId
      ),
      {

        status,

        packageCity,

        trackingNumber,

        deliveryDuration,

        estimatedDelivery,

        updatedAt:
          serverTimestamp()

      }
    );


    showToast(
      "Commande mise à jour ✅"
    );


    await loadAdminOrders();


  }catch(error){

    console.error(
      "Sauvegarde admin:",
      error
    );


    showToast(
      "Impossible de mettre à jour la commande."
    );

  }

}


/* =========================================================
   ADMIN DELETE ORDER
========================================================= */

async function adminDeleteOrder(orderId){

  if(!isAdminAuthorized()){

    showToast(
      "Administration verrouillée."
    );

    return;

  }


  const confirmed =
    window.confirm(
      "Supprimer définitivement cette commande ?"
    );


  if(!confirmed){
    return;
  }


  try{

    await deleteDoc(
      doc(
        db,
        "orders",
        orderId
      )
    );


    showToast(
      "Commande supprimée."
    );


    await loadAdminOrders();


  }catch(error){

    console.error(
      "Suppression admin:",
      error
    );


    showToast(
      "Impossible de supprimer la commande."
    );

  }

}


/* =========================================================
   ADMIN PAYPAL ACCEPT
========================================================= */

async function acceptPaypalOrder(orderId){

  if(!isAdminAuthorized()){

    showToast(
      "Administration verrouillée."
    );

    return;

  }


  try{

    await updateDoc(
      doc(
        db,
        "orders",
        orderId
      ),
      {

        paymentStatus:
          "accepted",

        status:
          "Acceptée",

        paymentAcceptedAt:
          serverTimestamp()

      }
    );


    showToast(
      "Paiement accepté ✅"
    );


    await loadAdminOrders();


  }catch(error){

    console.error(
      "Acceptation PayPal:",
      error
    );


    showToast(
      "Impossible d'accepter le paiement."
    );

  }

}


/* =========================================================
   PRINT INVOICE
========================================================= */

async function printOrderInvoice(orderId){

  try{

    const orders =
      await getAllOrders();


    const order =
      orders.find(
        item =>
          item.id === orderId
      );


    if(!order){

      showToast(
        "Commande introuvable."
      );

      return;

    }


    const items =
      Array.isArray(order.items)
        ? order.items
        : [];


    const address =
      order.address || {};


    const invoiceWindow =
      window.open(
        "",
        "_blank"
      );


    if(!invoiceWindow){

      showToast(
        "La fenêtre de facture a été bloquée."
      );

      return;

    }


    invoiceWindow.document.write(`

      <!DOCTYPE html>

      <html lang="fr">

      <head>

        <meta charset="UTF-8">

        <title>
          Facture ${escapeHTML(order.id)}
        </title>

        <style>

          body{
            font-family:Arial,sans-serif;
            padding:40px;
            color:#111;
          }

          h1{
            margin-bottom:5px;
          }

          .muted{
            color:#666;
          }

          .box{
            border:1px solid #ddd;
            padding:18px;
            border-radius:10px;
            margin-top:20px;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:20px;
          }

          th,
          td{
            border-bottom:1px solid #ddd;
            padding:10px;
            text-align:left;
          }

          .total{
            text-align:right;
            font-size:20px;
            font-weight:bold;
            margin-top:20px;
          }

        </style>

      </head>

      <body>

        <h1>
          NovaShop
        </h1>

        <div class="muted">
          Facture de commande
        </div>


        <div class="box">

          <strong>
            Commande :
          </strong>

          #${escapeHTML(order.id)}

          <br>

          <strong>
            Date :
          </strong>

          ${escapeHTML(
            formatDate(
              order.createdAt
            )
          )}

          <br>

          <strong>
            Statut :
          </strong>

          ${escapeHTML(
            order.status ||
            "Enregistrée"
          )}

        </div>


        <div class="box">

          <strong>
            Client
          </strong>

          <p>
            ${escapeHTML(
              order.email ||
              ""
            )}
          </p>

          <strong>
            Adresse
          </strong>

          <p>

            ${escapeHTML(
              (
                address.firstName ||
                ""
              ) +
              " " +
              (
                address.lastName ||
                ""
              )
            )}

            <br>

            ${escapeHTML(
              address.street ||
              ""
            )}

            <br>

            ${escapeHTML(
              (
                address.postalCode ||
                ""
              ) +
              " " +
              (
                address.city ||
                ""
              )
            )}

            <br>

            ${escapeHTML(
              address.country ||
              ""
            )}

          </p>

        </div>


        <table>

          <thead>

            <tr>

              <th>
                Produit
              </th>

              <th>
                Quantité
              </th>

              <th>
                Prix
              </th>

              <th>
                Total
              </th>

            </tr>

          </thead>


          <tbody>

            ${
              items
                .map(
                  item => {

                    const qty =
                      Number(
                        item.qty || 0
                      );

                    const price =
                      Number(
                        item.price || 0
                      );

                    return `

                      <tr>

                        <td>
                          ${escapeHTML(
                            item.name ||
                            "Produit"
                          )}
                        </td>

                        <td>
                          ${qty}
                        </td>

                        <td>
                          ${money(price)}
                        </td>

                        <td>
                          ${money(
                            price * qty
                          )}
                        </td>

                      </tr>

                    `;

                  }
                )
                .join("")
            }

          </tbody>

        </table>


        <div class="total">

          Total :
          ${
            Number(order.total || 0) === 0
              ? "Gratuit"
              : money(
                  Number(
                    order.total || 0
                  )
                )
          }

        </div>


        <script>

          window.onload = function(){

            window.print();

          };

        <\/script>

      </body>

      </html>

    `);


    invoiceWindow.document.close();


  }catch(error){

    console.error(
      "Facture:",
      error
    );


    showToast(
      "Impossible de générer la facture."
    );

  }

}/* =========================================================
   ADMIN / ACCOUNT / ORDERS BUTTONS
========================================================= */

if(accountBtn){

  accountBtn.onclick =
    openAccount;

}


if(ordersBtn){

  ordersBtn.onclick =
    openOrders;

}


if(settingsBtn){

  settingsBtn.onclick =
    openSettings;

}


if(adminBtn){

  adminBtn.onclick =
    openAdmin;

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
  auth,
  user => {

    currentUser = user;


    const connectedEmail =
      user?.email
        ?.trim()
        .toLowerCase() || "";


    const adminEmail =
      ADMIN_EMAIL
        .trim()
        .toLowerCase();


    if(
      connectedEmail ===
      adminEmail
    ){

      if(adminBtn){

        adminBtn.style.display =
          "grid";

        adminBtn.title =
          "Administration";

      }

    }else{

      if(adminBtn){

        adminBtn.style.display =
          "none";

      }


      localStorage.removeItem(
        ADMIN_ACCESS_KEY
      );

    }


    if(accountBtn){

      if(user){

        accountBtn.title =
          user.email ||
          "Mon compte";

      }else{

        accountBtn.title =
          "Mon compte";

      }

    }

  }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if(event.key === "Escape"){

      closeModal();
      closeCart();

    }

  }
);


/* =========================================================
   ORDER RESPONSIVE STYLE
========================================================= */

const novaOrderResponsiveStyle =
  document.createElement("style");


novaOrderResponsiveStyle.textContent = `

.nova-order-card{
  overflow:hidden;
}

.nova-order-head{
  gap:12px;
  align-items:flex-start;
}

.nova-status{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:7px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:800;
  white-space:nowrap;
  background:rgba(255,255,255,.08);
}

.nova-status.delivered{
  background:rgba(34,197,94,.15);
  color:#4ade80;
}

.nova-status.cancelled{
  background:rgba(239,68,68,.15);
  color:#f87171;
}

.nova-status.refund{
  background:rgba(245,158,11,.15);
  color:#fbbf24;
}

.nova-status.transit{
  background:rgba(59,130,246,.15);
  color:#60a5fa;
}

.nova-status.nearby{
  background:rgba(168,85,247,.15);
  color:#c084fc;
}

.nova-order-items{
  margin-top:12px;
  display:grid;
  gap:6px;
}

.nova-order-item{
  display:flex;
  justify-content:space-between;
  gap:12px;
  padding:8px 10px;
  border-radius:10px;
  background:rgba(255,255,255,.035);
  font-size:13px;
}

.nova-package-box{
  margin-top:12px;
  padding:12px;
  border-radius:12px;
  background:rgba(255,255,255,.035);
  font-size:13px;
  line-height:1.65;
  overflow-wrap:anywhere;
  word-break:break-word;
}

.nova-delete-order{
  margin-top:12px;
  width:100%;
}

.admin-order{
  overflow:hidden;
}

.admin-order-grid{
  display:grid;
  grid-template-columns:
    repeat(
      auto-fit,
      minmax(180px,1fr)
    );
  gap:12px;
  margin-top:16px;
}

.admin-order-grid label{
  display:block;
  margin-bottom:6px;
  font-size:12px;
  font-weight:800;
  opacity:.8;
}

.admin-order-grid input,
.admin-order-grid select{
  width:100%;
}

.admin-actions{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:16px;
}

.admin-actions button{
  flex:1;
  min-width:180px;
}

.admin-order-info{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:15px;
  font-size:13px;
}

.admin-order-info > div{
  padding:8px 10px;
  border-radius:10px;
  background:rgba(255,255,255,.04);
}

.admin-items{
  margin-top:16px;
  padding:12px;
  border-radius:12px;
  background:rgba(255,255,255,.035);
  font-size:13px;
  line-height:1.6;
  overflow-wrap:anywhere;
}

.admin-address{
  margin-top:12px;
  padding:12px;
  border-radius:12px;
  background:rgba(255,255,255,.035);
  font-size:13px;
  line-height:1.6;
  overflow-wrap:anywhere;
}

.admin-top-actions{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-bottom:18px;
}

.admin-stats{
  display:grid;
  grid-template-columns:
    repeat(
      auto-fit,
      minmax(150px,1fr)
    );
  gap:12px;
  margin-bottom:20px;
}

.admin-stat{
  padding:16px;
  border-radius:14px;
  background:rgba(255,255,255,.045);
  display:flex;
  flex-direction:column;
  gap:7px;
}

.admin-stat span{
  font-size:12px;
  opacity:.75;
}

.admin-stat strong{
  font-size:22px;
}

.admin-order-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:15px;
}

.nova-orders-panel,
.nova-order-details{
  width:100%;
  max-width:100%;
  overflow-x:hidden;
}

.nova-detail-top{
  margin-bottom:15px;
}

.nova-order-preview{
  display:flex;
  justify-content:space-between;
  gap:12px;
  margin-top:12px;
  padding:10px 12px;
  border-radius:10px;
  background:rgba(255,255,255,.035);
}

.nova-order-actions{
  display:flex;
  flex-direction:column;
  gap:10px;
  margin-top:12px;
  width:100%;
}

.nova-order-actions button{
  width:100%!important;
  min-width:0!important;
  min-height:48px;
}

.nova-order-detail-section{
  margin-top:20px;
}

.nova-order-detail-section h3{
  margin-bottom:10px;
}

.nova-detail-status{
  margin-top:10px;
  padding-top:10px;
  border-top:1px solid rgba(255,255,255,.08);
}

.nova-detail-total{
  margin-top:10px;
  padding-top:10px;
  border-top:1px solid rgba(255,255,255,.08);
  display:flex;
  justify-content:space-between;
  gap:10px;
}

.nova-delete-detail{
  margin-top:18px;
}

.order-timeline{
  display:flex;
  flex-direction:column;
  gap:0;
  margin-top:15px;
}

.timeline-step{
  display:flex;
  align-items:flex-start;
  gap:12px;
  position:relative;
  padding-bottom:18px;
  opacity:.45;
}

.timeline-step.done{
  opacity:1;
}

.timeline-dot{
  width:30px;
  height:30px;
  min-width:30px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(255,255,255,.08);
  font-size:12px;
  font-weight:800;
}

.timeline-step.done .timeline-dot{
  background:rgba(34,197,94,.18);
}

.timeline-content{
  padding-top:5px;
}

.timeline-step:not(:last-child)::after{
  content:"";
  position:absolute;
  left:14px;
  top:30px;
  bottom:0;
  width:2px;
  background:rgba(255,255,255,.08);
}

.timeline-step.done:not(:last-child)::after{
  background:rgba(34,197,94,.25);
}


/* =========================================================
   MOBILE
========================================================= */

@media(max-width:600px){

  .nova-order-card{
    padding:12px!important;
    width:100%;
    max-width:100%;
  }

  .nova-order-head{
    display:flex;
    flex-direction:column!important;
    align-items:stretch!important;
  }

  .nova-status{
    width:100%;
    white-space:normal;
    text-align:center;
  }

  .nova-order-item{
    font-size:12px;
    align-items:flex-start;
  }

  .nova-package-box,
  .nova-mobile-package{
    font-size:12px;
    width:100%;
    max-width:100%;
    overflow-wrap:anywhere;
    word-break:break-word;
  }

  #ordersList{
    width:100%;
    min-width:0;
  }

  #ordersList .order{
    width:100%;
    min-width:0;
  }

  .admin-order-grid{
    grid-template-columns:1fr;
  }

  .admin-actions{
    flex-direction:column;
  }

  .admin-actions button{
    width:100%;
    min-width:0;
  }

  .admin-order-head{
    flex-direction:column;
  }

  .admin-order-head .nova-status{
    width:100%;
  }

  .admin-top-actions{
    flex-direction:column;
  }

  .admin-top-actions button{
    width:100%;
  }

  .admin-stats{
    grid-template-columns:
      repeat(2,1fr);
  }

  .nova-order-preview{
    font-size:12px;
  }

}


/* =========================================================
   EXTRA MOBILE VIEW ORDER BUTTON
========================================================= */

@media(max-width:600px){

  .nova-view-order{
    display:flex!important;
    align-items:center;
    justify-content:center;
    width:100%!important;
    min-height:50px!important;
    font-size:14px!important;
    font-weight:800!important;
  }

  .nova-order-actions{
    width:100%!important;
  }

  .nova-order-actions button{
    width:100%!important;
    max-width:100%!important;
  }

}

`;


document.head.appendChild(
  novaOrderResponsiveStyle
);


/* =========================================================
   EXTRA ORDER VIEW STYLE
========================================================= */

const novaOrderViewStyle =
  document.createElement("style");


novaOrderViewStyle.textContent = `

.nova-order-preview{
  display:flex;
  justify-content:space-between;
  gap:12px;
  margin-top:12px;
  padding:10px 12px;
  border-radius:10px;
  background:rgba(255,255,255,.035);
}

.nova-order-actions{
  display:flex;
  flex-direction:column;
  gap:10px;
  margin-top:12px;
  width:100%;
}

.nova-order-actions button{
  width:100%!important;
  min-width:0!important;
  min-height:48px;
}

.nova-order-detail-section{
  margin-top:20px;
}

.nova-order-detail-section h3{
  margin-bottom:10px;
}

.nova-detail-status{
  margin-top:10px;
  padding-top:10px;
  border-top:1px solid rgba(255,255,255,.08);
}

.nova-detail-total{
  margin-top:10px;
  padding-top:10px;
  border-top:1px solid rgba(255,255,255,.08);
}

.nova-delete-detail{
  margin-top:18px;
}

@media(max-width:600px){

  .nova-orders-panel,
  .nova-order-details{
    width:100%;
    max-width:100%;
    overflow-x:hidden;
  }

  .nova-order-card{
    width:100%;
    max-width:100%;
  }

  .nova-package-box,
  .nova-mobile-package{
    width:100%;
    overflow-wrap:anywhere;
    word-break:break-word;
  }

  .nova-order-item{
    align-items:flex-start;
  }

}

`;

document.head.appendChild(
  novaOrderViewStyle
);


/* =========================================================
   INITIALIZATION
========================================================= */

renderCategories();

renderProducts();

renderCart();


const savedLanguage =
  localStorage.getItem(
    "novaLanguage"
  ) || "fr";


if(
  typeof applyLanguage ===
  "function"
){

  applyLanguage(
    savedLanguage
  );

}


/* =========================================================
   GLOBAL NOVASHOP API
========================================================= */

window.NovaShop = {

  products,

  get cart(){

    return cartDetailed();

  },

  openCart,

  closeCart,

  openProduct,

  renderProducts,

  renderCart,

  showToast,

  imageUrl,

  state(){

    return {

      products:
        products.length,

      cart:
        cartDetailed(),

      category:
        selectedCategory,

      search:
        searchValue,

      user:
        currentUser?.email ||
        null

    };

  }

};


/* =========================================================
   DEBUG
========================================================= */

console.log(
  "NovaShop chargé:",
  products.length,
  "produits"
);

console.log(
  "NovaShop commandes:",
  "système de suivi actif"
);

console.log(
  "NovaShop mobile:",
  "bouton Voir la commande actif"
);


/* =========================================================
   END
========================================================= */
