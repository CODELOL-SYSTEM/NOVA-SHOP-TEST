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

/* IDs matching the current index.html */
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

/* The HTML has one toast host already. */
const toastContainer = (() => {
  const el = document.createElement("div");
  el.id = "novaToastContainer";
  el.style.cssText = "position:fixed;z-index:9999;left:50%;bottom:25px;transform:translateX(-50%);display:flex;flex-direction:column;gap:8px;pointer-events:none;";
  document.body.appendChild(el);
  return el;
})();

/* These buttons do not exist in the current HTML. */
const heroShopBtn = $("heroShopBtn");
const heroSearchBtn = $("heroSearchBtn");


/* =========================================================
   IMAGE SYSTEM
========================================================= */

const FALLBACK_IMAGE = "";

function imageUrl(url){
  return url || "";
}

function imageSrc(url){
  return escapeAttribute(imageUrl(url));
}

function imageError(img, original){
  if(!img) return;

  if(img.dataset.imageFailed === "true"){
    img.style.display = "none";
    return;
  }

  if(original && img.src !== original){
    img.dataset.imageFailed = "true";
    img.src = original;
    return;
  }

  img.style.display = "none";
}

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
image:"https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_10/106865/18443258_800.jpg"
},

{
id:"p30",
name:"Logitech PRO X TKL Rapid Noir, filaire AZERTY",
category:"Claviers",
price:78.99,
image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/6a/89/8f/26184042/1540-1.jpg"
},

{
id:"p31",
name:"QwertyKey75 HE Striker, Magnetic Hall Effect, Rapid Trigger, Snap Tap",
category:"Claviers",
price:56.99,
image:"https://cdn.shopify.com/s/files/1/0814/2530/1746/files/QK75-HE-STRIKER-qwertykey-tastatura-mecanica-gaming-hotswap-2025_1eee355b-72ca-46e6-a458-751384d0595c_1800x.webp?v=1771799537"
},

{
id:"p32",
name:"GravaStar Mercury K1 Clavier Gamer sans Fil en Aluminium, Noir Dégradé",
category:"Claviers",
price:91.99,
image:"https://m.media-amazon.com/images/I/6144lt2l5JL._AC_SL1200_.jpg"
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
];let currentUser = null;
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
          src="${originalImage}"
          data-original="${originalImage}"
          data-product-id="${escapeAttribute(product.id)}"
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
   PRODUCTS
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

          if(product){

            addToCart(
              product,
              event.currentTarget
            );

          }

        }
      );

    });

}


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProduct(id){

  const product =
    products.find(
      p => p.id === id
    );

  if(!product) return;

  const reviews =
    reviewData(product);

  const demoReviews = [

    {
      name:"Client NovaShop",
      text:"Produit conforme à la présentation. Bonne expérience générale."
    },

    {
      name:"Client vérifié",
      text:"Fiche claire et produit intéressant pour un setup gaming."
    },

    {
      name:"Utilisateur",
      text:"Bonne présentation et informations faciles à trouver."
    }

  ];

  modalContent.innerHTML = `

    <div class="product-modal">

      <div class="modal-image">

        <img
          src="${imageSrc(product.image)}"
          data-original="${escapeAttribute(product.image)}"
          alt="${escapeAttribute(product.name)}"
          loading="eager"
          decoding="async"
          referrerpolicy="no-referrer"
          onerror="imageError(this,this.dataset.original)"
        >

      </div>

      <div class="modal-info">

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

          <span class="rating-score">
            ${reviews.rating
              .toFixed(1)
              .replace(".",",")}
          </span>

          <span class="rating-count">
            · ${reviews.count.toLocaleString("fr-FR")} avis
          </span>

        </div>

        <div class="modal-price">
          ${money(product.price)}
        </div>

        <button
          class="btn btn-primary btn-wide"
          id="modalAdd"
        >
          🛒 Ajouter au panier
        </button>

        <div style="margin-top:20px">

          <strong style="font-size:13px">
            Avis clients
          </strong>

          ${demoReviews
            .map(review => `

              <div class="review-box">

                <div class="review-head">

                  <span class="review-author">
                    ${escapeHTML(review.name)}
                  </span>

                  <span class="stars">
                    ★★★★★
                  </span>

                </div>

                <div class="review-text">
                  ${escapeHTML(review.text)}
                </div>

              </div>

            `)
            .join("")}

          <div class="demo-note">
            Les avis affichés ici sont des avis de démonstration.
          </div>

        </div>

      </div>

    </div>

  `;

  $("modalAdd").onclick =
    event => {

      addToCart(
        product,
        event.currentTarget
      );

    };

  openModal();

}


/* =========================================================
   MODAL
========================================================= */

function openModal(){

  modal.classList.add("open");
  document.body.style.overflow = "hidden";

}


function closeModal(){

  modal.classList.remove("open");
  document.body.style.overflow = "";

}


modalClose.onclick =
  closeModal;


modal.addEventListener(
  "click",
  event => {

    if(event.target === modal){
      closeModal();
    }

  }
);


/* =========================================================
   CART
========================================================= */

function addToCart(
  product,
  sourceButton
){

  const existing =
    cart.find(
      item =>
        item.id === product.id
    );

  if(existing){

    existing.qty += 1;

  }else{

    cart.push({
      id:product.id,
      qty:1
    });

  }

  saveCart();
  renderCart();

  animateToCart(
    sourceButton,
    product.image
  );

  showToast(
    "Produit ajouté au panier"
  );

}


function removeFromCart(id){

  cart =
    cart.filter(
      item => item.id !== id
    );

  saveCart();
  renderCart();

}


function changeQuantity(
  id,
  delta
){

  const item =
    cart.find(
      item => item.id === id
    );

  if(!item) return;

  item.qty += delta;

  if(item.qty <= 0){

    removeFromCart(id);
    return;

  }

  saveCart();
  renderCart();

}


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
        qty:item.qty
      };

    })
    .filter(Boolean);

}


/* =========================================================
   CART RENDER
========================================================= */

function renderCart(){

  const items =
    cartDetailed();

  const count =
    items.reduce(
      (sum,item) =>
        sum + item.qty,
      0
    );

  cartBadge.textContent =
    count > 99
      ? "99+"
      : count;

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
          Ajoute un produit pour commencer.
        </p>

        <button
          class="btn btn-primary btn-small"
          id="emptyShop"
        >
          Voir les produits
        </button>

      </div>

    `;

    $("emptyShop").onclick = () => {

      closeCart();

      document
        .getElementById("shop")
        .scrollIntoView({
          behavior:"smooth"
        });

    };

    cartTotal.textContent =
      money(0);

    return;

  }

  cartItems.innerHTML =
    items
      .map(item => `

        <div class="cart-item">

          <img
            src="${imageSrc(item.image)}"
            data-original="${escapeAttribute(item.image)}"
            alt=""
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
            onerror="imageError(this,this.dataset.original)"
          >

          <div>

            <div class="cart-item-name">
              ${escapeHTML(item.name)}
            </div>

            <div class="cart-item-price">
              ${money(item.price)}
            </div>

            <div class="qty">

              <button
                data-minus="${item.id}"
              >
                −
              </button>

              <span>
                ${item.qty}
              </span>

              <button
                data-plus="${item.id}"
              >
                +
              </button>

            </div>

          </div>

          <button
            class="remove"
            data-remove="${item.id}"
          >
            Suppr.
          </button>

        </div>

      `)
      .join("");

  let total = 0;

  items.forEach(item => {

    if(item.price > 0){

      total +=
        item.price *
        item.qty;

    }

  });

  cartTotal.textContent =
    money(total);

  cartItems
    .querySelectorAll("[data-minus]")
    .forEach(button => {

      button.onclick = () => {

        changeQuantity(
          button.dataset.minus,
          -1
        );

      };

    });

  cartItems
    .querySelectorAll("[data-plus]")
    .forEach(button => {

      button.onclick = () => {

        changeQuantity(
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
   CART OPEN/CLOSE
========================================================= */

function openCart(){

  cartOverlay.classList.add("open");
  cartDrawer.classList.add("open");

  document.body.style.overflow =
    "hidden";

}


function closeCart(){

  cartOverlay.classList.remove("open");
  cartDrawer.classList.remove("open");

  document.body.style.overflow =
    "";

}


cartBtn.onclick =
  openCart;

cartClose.onclick =
  closeCart;

cartOverlay.onclick =
  closeCart;


/* =========================================================
   CART IMAGE ANIMATION
========================================================= */

function animateToCart(
  button,
  image
){

  if(!button) return;

  const rect =
    button.getBoundingClientRect();

  const target =
    cartBtn.getBoundingClientRect();

  const img =
    document.createElement("img");

  img.className = "fly";

  img.src =
    imageUrl(image);

  img.onerror = () => {

    img.src =
      FALLBACK_IMAGE;

  };

  img.style.left =
    `${rect.left + rect.width / 2 - 23}px`;

  img.style.top =
    `${rect.top + rect.height / 2 - 23}px`;

  document.body.appendChild(img);

  requestAnimationFrame(() => {

    img.style.left =
      `${target.left + target.width / 2 - 23}px`;

    img.style.top =
      `${target.top + target.height / 2 - 23}px`;

    img.style.width =
      "26px";

    img.style.height =
      "26px";

    img.style.opacity =
      "0";

  });

  setTimeout(() => {

    img.remove();

    cartBtn.animate(
      [
        {
          transform:"scale(1)"
        },
        {
          transform:"scale(1.1)"
        },
        {
          transform:"scale(1)"
        }
      ],
      {
        duration:300,
        easing:"ease-out"
      }
    );

  },600);

}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
  "input",
  event => {

    searchValue =
      event.target.value;

    renderProducts();

  }
);if(heroShopBtn){
  heroShopBtn.onclick = () => {
    document.getElementById("shop")?.scrollIntoView({
      behavior:"smooth"
    });
  };
}

if(heroSearchBtn){
  heroSearchBtn.onclick = () => {
    document.getElementById("shop")?.scrollIntoView({
      behavior:"smooth"
    });

    setTimeout(
      () => searchInput?.focus(),
      400
    );
  };
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message){

  const toast =
    document.createElement("div");

  toast.className =
    "toast";

  toast.textContent =
    message;

  toastContainer.appendChild(
    toast
  );

  requestAnimationFrame(
    () =>
      toast.classList.add("show")
  );

  setTimeout(
    () => {

      toast.classList.remove("show");

      setTimeout(
        () => toast.remove(),
        250
      );

    },
    2200
  );

}


/* =========================================================
   SETTINGS
========================================================= */

function openSettings(){

  const theme =
    localStorage.getItem(
      "novaThemeChoice"
    ) || "dark";

  const language =
    localStorage.getItem(
      "novaLanguage"
    ) || "fr";

  const animations =
    localStorage.getItem(
      "novaAnimations"
    ) !== "false";


  modalContent.innerHTML = `

    <div class="panel">

      <h2>
        Paramètres
      </h2>

      <div class="setting">

        <label>
          Apparence
        </label>

        <small>
          Choisis l'apparence de NovaShop.
        </small>

        <select
          class="select"
          id="themeSelect"
        >

          <option
            value="dark"
            ${theme === "dark" ? "selected" : ""}
          >
            Sombre
          </option>

          <option
            value="light"
            ${theme === "light" ? "selected" : ""}
          >
            Claire
          </option>

          <option
            value="auto"
            ${theme === "auto" ? "selected" : ""}
          >
            Automatique
          </option>

        </select>

      </div>


      <div class="setting">

        <label>
          Langue
        </label>

        <small>
          Langue de l'interface.
        </small>

        <select
          class="select"
          id="languageSelect"
        >

          <option
            value="fr"
            ${language === "fr" ? "selected" : ""}
          >
            🇫🇷 Français
          </option>

          <option
            value="en"
            ${language === "en" ? "selected" : ""}
          >
            🇬🇧 English
          </option>

        </select>

      </div>


      <div class="setting">

        <div class="switch-row">

          <div>

            <label>
              Animations
            </label>

            <small>
              Animations du panier et de l'interface.
            </small>

          </div>

          <button
            class="switch ${animations ? "on" : ""}"
            id="animationSwitch"
          >
            <span></span>
          </button>

        </div>

      </div>


      <div class="setting">

        <label>
          Informations
        </label>

        <small>
          NovaShop contient actuellement
          ${products.length} produits.
        </small>

      </div>

    </div>

  `;


  $("themeSelect").onchange =
    event => {

      localStorage.setItem(
        "novaThemeChoice",
        event.target.value
      );

      applyTheme();

    };


  $("languageSelect").onchange =
    event => {

      localStorage.setItem(
        "novaLanguage",
        event.target.value
      );

      applyLanguage(
        event.target.value
      );

    };


  $("animationSwitch").onclick =
    () => {

      const current =
        localStorage.getItem(
          "novaAnimations"
        ) !== "false";

      localStorage.setItem(
        "novaAnimations",
        String(!current)
      );

      $("animationSwitch")
        .classList.toggle(
          "on",
          !current
        );

    };


  openModal();

}


/* =========================================================
   LANGUAGE
========================================================= */

function applyLanguage(language){

  if(language === "en"){

    searchInput.placeholder =
      "Search for a product...";

    if(heroShopBtn){

      heroShopBtn.innerHTML =
        `Discover products <span>→</span>`;

    }

    if(heroSearchBtn){

      heroSearchBtn.textContent =
        "View offers";

    }

    showToast(
      "English interface enabled"
    );

  }else{

    searchInput.placeholder =
      "Rechercher un produit...";

    if(heroShopBtn){

      heroShopBtn.innerHTML =
        `Découvrir les produits <span>→</span>`;

    }

    if(heroSearchBtn){

      heroSearchBtn.textContent =
        "Voir les offres";

    }

    showToast(
      "Interface française activée"
    );

  }

}


/* =========================================================
   ACCOUNT
========================================================= */

function openAccount(){

  if(currentUser){

    modalContent.innerHTML = `

      <div class="panel">

        <h2>
          Mon compte
        </h2>

        <div class="setting">

          <label>
            Compte connecté
          </label>

          <small>
            ${escapeHTML(
              currentUser.email || ""
            )}
          </small>

        </div>

        <button
          class="btn btn-danger btn-wide"
          id="logoutBtn"
        >
          Se déconnecter
        </button>

      </div>

    `;


    $("logoutBtn").onclick =
      async () => {

        try{

          await signOut(auth);

          localStorage.removeItem(
            ADMIN_ACCESS_KEY
          );

          closeModal();

          showToast(
            "Déconnexion effectuée"
          );

        }catch(error){

          showToast(
            error.message
          );

        }

      };


    openModal();

    return;

  }


  let mode =
    "login";


  function draw(){

    modalContent.innerHTML = `

      <div class="panel">

        <h2>
          ${
            mode === "login"
              ? "Connexion"
              : "Créer un compte"
          }
        </h2>

        <div class="form">

          <input
            id="authEmail"
            type="email"
            placeholder="Adresse e-mail"
          >

          <input
            id="authPassword"
            type="password"
            placeholder="Mot de passe"
          >

          <button
            class="btn btn-primary btn-wide"
            id="authSubmit"
          >
            ${
              mode === "login"
                ? "Se connecter"
                : "Créer mon compte"
            }
          </button>

          <button
            class="text-btn"
            id="authSwitch"
          >
            ${
              mode === "login"
                ? "Créer un compte"
                : "J'ai déjà un compte"
            }
          </button>

        </div>

      </div>

    `;


    $("authSubmit").onclick =
      async () => {

        const email =
          $("authEmail")
            .value
            .trim();

        const password =
          $("authPassword")
            .value;

        if(
          !email ||
          !password
        ){

          showToast(
            "Remplis tous les champs"
          );

          return;

        }


        try{

          if(mode === "login"){

            await signInWithEmailAndPassword(
              auth,
              email,
              password
            );

          }else{

            await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );

          }


          closeModal();

          showToast(
            "Compte connecté"
          );

        }catch(error){

          showToast(
            authError(error.code)
          );

        }

      };


    $("authSwitch").onclick =
      () => {

        mode =
          mode === "login"
            ? "register"
            : "login";

        draw();

      };

  }


  draw();
  openModal();

}


/* =========================================================
   ORDERS
========================================================= */

async function openOrders(){

  if(!currentUser){

    showToast(
      "Connecte-toi pour voir tes commandes"
    );

    openAccount();

    return;

  }


  modalContent.innerHTML = `
    <div class="panel nova-orders-panel">
      <h2>Mes commandes</h2>
      <div id="ordersList">
        Chargement...
      </div>
    </div>
  `;


  openModal();


  try{

    const snapshot =
      await getDocs(
        query(
          collection(db,"orders"),
          where(
            "userId",
            "==",
            currentUser.uid
          )
        )
      );


    const orders =
      snapshot.docs
        .map(
          d => ({
            id:d.id,
            ...d.data()
          })
        )
        .sort(
          (a,b) =>
            (
              b.createdAt?.seconds ||
              0
            ) -
            (
              a.createdAt?.seconds ||
              0
            )
        );


    const list =
      $("ordersList");


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
      orders
        .map(
          order => {

            const status =
              order.status ||
              "Enregistrée";

            const canDelete =
              status === "Livrée" ||
              status === "Annulée";

            const items =
              Array.isArray(
                order.items
              )
                ? order.items
                : [];


            return `

              <article
                class="order nova-order-card"
              >

                <div
                  class="order-top nova-order-head"
                >

                  <div>

                    <div class="order-id">

                      Commande #

                      ${escapeHTML(
                        order.id.slice(
                          0,
                          8
                        )
                      )}

                    </div>

                    <div class="order-date">

                      ${formatTimestamp(
                        order.createdAt
                      )}

                    </div>

                  </div>


                  <span
                    class="nova-status ${
                      statusClass(status)
                    }"
                  >

                    ${statusIcon(status)}

                    ${escapeHTML(status)}

                  </span>

                </div>


                <div
                  class="nova-order-preview"
                >

                  <strong>

                    ${
                      items.length
                    }

                    article${
                      items.length > 1
                        ? "s"
                        : ""
                    }

                  </strong>


                  <strong>

                    ${money(
                      Number(
                        order.total ||
                        0
                      )
                    )}

                  </strong>

                </div>


                <div
                  class="order-actions nova-order-actions"
                >

                  <button
                    type="button"
                    class="btn btn-primary btn-wide nova-view-order"
                    data-view-order="${escapeAttribute(
                      order.id
                    )}"
                  >

                    👁️ Voir la commande

                  </button>


                  ${
                    canDelete
                      ? `

                        <button
                          type="button"
                          class="btn btn-danger btn-wide nova-delete-order"
                          data-delete-order="${escapeAttribute(
                            order.id
                          )}"
                        >

                          🗑️ Supprimer la commande

                        </button>

                      `
                      : ""
                  }

                </div>

              </article>

            `;

          }
        )
        .join("");


    list
      .querySelectorAll(
        "[data-view-order]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              openOrderDetails(
                button.dataset.viewOrder
              );

            };

        }
      );


    list
      .querySelectorAll(
        "[data-delete-order]"
      )
      .forEach(
        button => {

          button.onclick =
            async () => {

              const orderId =
                button.dataset
                  .deleteOrder;

              if(
                !confirm(
                  "Supprimer définitivement cette commande ?"
                )
              ){
                return;
              }


              try{

                const snap =
                  await getDocs(
                    query(
                      collection(
                        db,
                        "orders"
                      ),
                      where(
                        "userId",
                        "==",
                        currentUser.uid
                      )
                    )
                  );


                const target =
                  snap.docs.find(
                    d =>
                      d.id ===
                      orderId
                  );


                if(!target){

                  showToast(
                    "Commande introuvable"
                  );

                  return;

                }


                const data =
                  target.data();

                const st =
                  data.status ||
                  "Enregistrée";


                if(
                  st !== "Livrée" &&
                  st !== "Annulée"
                ){

                  showToast(
                    "Cette commande ne peut pas encore être supprimée"
                  );

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
                  "Commande supprimée"
                );


                openOrders();

              }catch(error){

                showToast(
                  "Erreur : " +
                  error.message
                );

              }

            };

        }
      );


  }catch(error){

    $("ordersList").innerHTML = `

      <div class="empty">

        <h3>
          Impossible de charger les commandes
        </h3>

        <p>
          ${escapeHTML(
            error.message
          )}
        </p>

      </div>

    `;

  }

}function orderTimeline(status){

  const flow = [
    "Enregistrée",
    "Acceptée",
    "Préparation",
    "En transit",
    "Livraison proche",
    "Livrée"
  ];

  const currentIndex =
    flow.indexOf(status);

  return `
    <div class="order-timeline">

      ${flow.map(
        (step,index)=>{

          const done =
            status !== "Annulée" &&
            status !==
              "Remboursement en cours" &&
            currentIndex >= index;

          return `
            <div
              class="timeline-step ${
                done
                  ? "done"
                  : ""
              }"
            >

              <div class="timeline-dot">

                ${
                  done
                    ? "✓"
                    : index + 1
                }

              </div>

              <strong>
                ${escapeHTML(step)}
              </strong>

            </div>
          `;

        }
      ).join("")}


      ${
        status === "Annulée"
          ? `
            <div
              class="timeline-step done"
            >

              <div class="timeline-dot">
                ❌
              </div>

              <strong>
                Commande annulée
              </strong>

            </div>
          `
          : ""
      }


      ${
        status ===
          "Remboursement en cours"
          ? `
            <div
              class="timeline-step done"
            >

              <div class="timeline-dot">
                💸
              </div>

              <strong>
                Remboursement en cours
              </strong>

            </div>
          `
          : ""
      }

    </div>
  `;

}


async function openOrderDetails(
  orderId
){

  if(!currentUser)
    return;


  try{

    const snapshot =
      await getDocs(
        query(
          collection(
            db,
            "orders"
          ),
          where(
            "userId",
            "==",
            currentUser.uid
          )
        )
      );


    const found =
      snapshot.docs.find(
        d =>
          d.id === orderId
      );


    if(!found){

      showToast(
        "Commande introuvable"
      );

      return;

    }


    const order = {
      id:found.id,
      ...found.data()
    };


    const status =
      order.status ||
      "Enregistrée";


    const items =
      Array.isArray(
        order.items
      )
        ? order.items
        : [];


    const canDelete =
      status === "Livrée" ||
      status === "Annulée";


    modalContent.innerHTML = `

      <div
        class="panel nova-order-details"
      >

        <button
          class="btn btn-secondary btn-wide"
          id="backOrders"
        >
          ← Retour à mes commandes
        </button>


        <div
          class="order-top nova-order-head"
          style="margin-top:18px"
        >

          <div>

            <h2>
              📦 Votre commande
            </h2>

            <div class="order-id">
              #${escapeHTML(
                order.id.slice(
                  0,
                  8
                )
              )}
            </div>

            <div class="order-date">
              ${formatTimestamp(
                order.createdAt
              )}
            </div>

          </div>


          <span
            class="nova-status ${
              statusClass(status)
            }"
          >

            ${statusIcon(status)}
            ${escapeHTML(status)}

          </span>

        </div>


        <div
          class="nova-order-detail-section"
        >

          <h3>
            🛒 Produits
          </h3>


          <div
            class="nova-order-items"
          >

            ${
              items.length

                ? items
                    .map(
                      item =>
                        `
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
                              item.qty ||
                              1
                            )}

                          </span>


                          <strong>

                            ${money(
                              Number(
                                item.price ||
                                0
                              ) *
                              Number(
                                item.qty ||
                                1
                              )
                            )}

                          </strong>

                        </div>
                        `
                    )
                    .join("")

                : `
                  <div
                    class="order-date"
                  >
                    Aucun détail disponible.
                  </div>
                `
            }

          </div>

        </div>


        <div
          class="nova-order-detail-section"
        >

          <h3>
            🚚 Suivi du colis
          </h3>


          <div
            class="nova-package-box nova-mobile-package"
          >

            <div>

              📍 Destination :

              <strong>

                ${escapeHTML(
                  order.packageCity ||
                  order.address?.city ||
                  "Non renseignée"
                )}

              </strong>

            </div>


            <div>

              🚚 Numéro de suivi :

              <strong>

                ${escapeHTML(
                  order.trackingNumber ||
                  "Pas encore disponible"
                )}

              </strong>

            </div>


            <div>

              ⏱️ Livraison :

              ${escapeHTML(
                order.deliveryDuration ||
                "Non renseignée"
              )}

            </div>


            <div>

              📅 Date estimée :

              <strong>

                ${escapeHTML(
                  order.estimatedDelivery ||
                  "Non renseignée"
                )}

              </strong>

            </div>


            <div
              class="nova-detail-status"
            >

              ${statusIcon(status)}

              <strong>
                ${escapeHTML(status)}
              </strong>

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

              Méthode :

              ${escapeHTML(
                order.paymentMethod ||
                "Non définie"
              )}

            </div>


            <div>

              État :

              ${escapeHTML(
                order.paymentStatus ||
                "pending"
              )}

            </div>


            <div
              class="nova-detail-total"
            >

              Total :

              <strong>
                ${money(
                  Number(
                    order.total ||
                    0
                  )
                )}
              </strong>

            </div>

          </div>

        </div>


        ${orderTimeline(status)}


        ${
          canDelete
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


    openModal();


    $("backOrders").onclick =
      openOrders;


    if(canDelete){

      $("deleteDetailOrder").onclick =
        async () => {

          if(
            !confirm(
              "Supprimer définitivement cette commande ?"
            )
          ){
            return;
          }


          try{

            await deleteDoc(
              doc(
                db,
                "orders",
                order.id
              )
            );


            showToast(
              "Commande supprimée"
            );


            openOrders();

          }catch(error){

            showToast(
              "Erreur : " +
              error.message
            );

          }

        };

    }

  }catch(error){

    showToast(
      "Impossible d'afficher la commande"
    );

    console.error(
      error
    );

  }

}


/* =========================================================
   MOBILE ORDER UI
========================================================= */

const novaOrderViewStyle =
  document.createElement(
    "style"
  );


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

  .nova-order-actions .nova-view-order{
    display:flex!important;
    width:100%!important;
    min-height:52px!important;
    visibility:visible!important;
    opacity:1!important;
    align-items:center!important;
    justify-content:center!important;
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
   CHECKOUT
========================================================= */

checkoutBtn.onclick =
  async () => {

    const items =
      cartDetailed();


    if(!items.length){

      showToast(
        "Ton panier est vide"
      );

      return;

    }


    if(!currentUser){

      showToast(
        "Connecte-toi pour passer la commande"
      );

      openAccount();

      return;

    }


    let total = 0;


    items.forEach(
      item => {

        if(item.price > 0){

          total +=
            item.price *
            item.qty;

        }

      }
    );


    checkoutBtn.disabled =
      true;


    try{

      await addDoc(
        collection(
          db,
          "orders"
        ),
        {

          userId:
            currentUser.uid,

          email:
            currentUser.email ||
            "",

          items:
            items.map(
              item => ({

                id:item.id,
                name:item.name,
                price:item.price,
                qty:item.qty

              })
            ),

          total,

          status:
            "Enregistrée",

          paymentMethod:
            "Non défini",

          paymentStatus:
            "pending",

          createdAt:
            serverTimestamp()

        }
      );


      cart = [];


      saveCart();

      renderCart();

      closeCart();


      showToast(
        "Commande enregistrée"
      );


    }catch(error){

      showToast(
        "Erreur : " +
        error.message
      );


    }finally{

      checkoutBtn.disabled =
        false;

    }

  };


/* =========================================================
   ADMIN
========================================================= */

function isAdmin(){

  return Boolean(

    currentUser &&

    currentUser.email &&

    currentUser.email
      .trim()
      .toLowerCase() ===

    ADMIN_EMAIL
      .trim()
      .toLowerCase()

  );

}


function adminAuthorized(){

  return (
    localStorage.getItem(
      ADMIN_ACCESS_KEY
    ) === "true"
  );

}


function openAdmin(){

  if(!currentUser){

    showToast(
      "Connecte-toi avec le compte admin"
    );

    openAccount();

    return;

  }


  if(!isAdmin()){

    showToast(
      "Compte non autorisé"
    );

    return;

  }


  if(!adminAuthorized()){

    const code =
      prompt(
        "Code administrateur NovaShop :"
      );


    if(
      code !==
      ADMIN_CODE
    ){

      showToast(
        "Code administrateur incorrect"
      );

      return;

    }


    localStorage.setItem(
      ADMIN_ACCESS_KEY,
      "true"
    );

  }


  renderAdmin();

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
   ADMIN DASHBOARD
========================================================= */

async function renderAdmin(){

  modalContent.innerHTML = `

    <div class="panel">

      <h2>
        Dashboard NovaShop
      </h2>

      <div class="setting">

        <label>
          Administrateur
        </label>

        <small>

          ${escapeHTML(
            currentUser.email
          )}

        </small>

      </div>


      <div class="setting">

        <label>
          Catalogue
        </label>

        <small>

          ${products.length}
          produits actifs.

        </small>

      </div>


      <div class="setting">

        <button
          class="btn btn-secondary btn-wide"
          id="removeAdminAuth"
        >

          Retirer l'autorisation mémorisée

        </button>

      </div>


      <div
        class="setting"
      >

        <button
          class="btn btn-danger btn-wide"
          id="deleteOrders"
        >

          Supprimer toutes les commandes

        </button>

      </div>


      <div
        id="adminOrders"
        style="margin-top:20px"
      >

        Chargement...

      </div>

    </div>

  `;


  $("removeAdminAuth").onclick =
    () => {

      localStorage.removeItem(
        ADMIN_ACCESS_KEY
      );

      closeModal();

      showToast(
        "Autorisation administrateur supprimée"
      );

    };


  $("deleteOrders").onclick =
    async () => {

      const confirmed =
        confirm(
          "Supprimer toutes les commandes ?"
        );

      if(!confirmed)
        return;


      try{

        const snapshot =
          await getDocs(
            collection(
              db,
              "orders"
            )
          );


        for(
          const item
          of snapshot.docs
        ){

          await deleteDoc(
            doc(
              db,
              "orders",
              item.id
            )
          );

        }


        showToast(
          "Commandes supprimées"
        );


        renderAdmin();

      }catch(error){

        showToast(
          error.message
        );

      }

    };


  try{

    const snapshot =
      await getDocs(
        collection(
          db,
          "orders"
        )
      );


    const orders =
      snapshot.docs
        .map(
          d => ({

            id:d.id,
            ...d.data()

          })
        )
        .sort(
          (a,b) => {

            const ta =
              a.createdAt?.seconds ||
              0;

            const tb =
              b.createdAt?.seconds ||
              0;

            return tb - ta;

          }
        );


    if(!orders.length){

      $("adminOrders").innerHTML = `

        <div
          class="setting"
        >

          <label>
            Commandes
          </label>

          <small>
            Aucune commande enregistrée.
          </small>

        </div>

      `;

      openModal();

      return;

    }


    $("adminOrders").innerHTML = `

      <div
        class="setting"
      >

        <label>
          Commandes
        </label>

        <small>
          ${orders.length}
          commande(s)
        </small>

      </div>


      ${orders.map(
        order => {

          const status =
            order.status ||
            "Enregistrée";

          const accepted =
            order.paymentStatus ===
              "accepted" ||

            order.paymentStatus ===
              "free";


          return `

            <div
              class="order"
              style="
                margin-top:14px;
                padding:16px;
                border:1px solid rgba(255,255,255,.08);
                border-radius:14px;
              "
            >

              <div
                class="order-top"
              >

                <div>

                  <div
                    class="order-id"
                  >

                    #
                    ${escapeHTML(
                      order.id.slice(
                        0,
                        8
                      )
                    )}

                  </div>

                  <div
                    class="order-date"
                  >

                    ${escapeHTML(
                      order.email ||
                      ""
                    )}

                  </div>

                  <div
                    class="order-date"
                  >

                    ${formatTimestamp(
                      order.createdAt
                    )}

                  </div>

                </div>


                <span
                  class="rating-score"
                >

                  ${escapeHTML(
                    status
                  )}

                </span>

              </div>


              <div
                style="
                  margin-top:12px;
                  font-size:14px;
                  line-height:1.7;
                "
              >

                <div>

                  <strong>
                    Total :
                  </strong>

                  ${money(
                    Number(
                      order.total ||
                      0
                    )
                  )}

                </div>


                <div>

                  <strong>
                    Paiement :
                  </strong>

                  ${escapeHTML(
                    order.paymentMethod ||
                    "Non défini"
                  )}

                </div>


                <div>

                  <strong>
                    État paiement :
                  </strong>

                  ${escapeHTML(
                    order.paymentStatus ||
                    "pending"
                  )}

                </div>

              </div>


              ${
                order.paymentMethod ===
                  "PayPal.Me" &&
                !accepted

                  ? `
                    <button
                      class="btn btn-primary btn-wide"
                      style="margin-top:12px"
                      data-accept-paypal="${order.id}"
                    >

                      ✓ Accepter le paiement PayPal

                    </button>
                  `

                  : ""
              }


              <div
                style="
                  margin-top:14px;
                  display:grid;
                  gap:10px;
                "
              >

                <select
                  class="select"
                  data-status="${order.id}"
                >

                  ${ORDER_STATUSES
                    .map(
                      s => `

                        <option
                          value="${escapeAttribute(s)}"
                          ${
                            status === s
                              ? "selected"
                              : ""
                          }
                        >

                          ${escapeHTML(s)}

                        </option>

                      `
                    )
                    .join("")}

                </select>


                <input
                  class="input"
                  type="text"
                  placeholder="Ville du colis"
                  value="${escapeAttribute(
                    order.packageCity ||
                    ""
                  )}"
                  data-city="${order.id}"
                >


                <input
                  class="input"
                  type="text"
                  placeholder="Numéro de suivi"
                  value="${escapeAttribute(
                    order.trackingNumber ||
                    ""
                  )}"
                  data-tracking="${order.id}"
                >


                <input
                  class="input"
                  type="text"
                  placeholder="Durée estimée avant livraison"
                  value="${escapeAttribute(
                    order.deliveryDuration ||
                    ""
                  )}"
                  data-duration="${order.id}"
                >


                <input
                  class="input"
                  type="date"
                  value="${
                    order.estimatedDelivery ||
                    ""
                  }"
                  data-date="${order.id}"
                >


                <button
                  class="btn btn-secondary btn-wide"
                  data-save-order="${order.id}"
                >

                  💾 Enregistrer le suivi

                </button>


                <button
                  class="btn btn-secondary btn-wide"
                  data-print-order="${order.id}"
                >

                  🖨️ Imprimer la facture

                </button>

              </div>

            </div>

          `;

        }
      ).join("")}

    `;


    $("adminOrders")
      .querySelectorAll(
        "[data-accept-paypal]"
      )
      .forEach(
        button => {

          button.onclick =
            () =>
              acceptPaypalOrder(
                button.dataset
                  .acceptPaypal
              );

        }
      );


    $("adminOrders")
      .querySelectorAll(
        "[data-save-order]"
      )
      .forEach(
        button => {

          button.onclick =
            () =>
              saveAdminOrder(
                button.dataset
                  .saveOrder
              );

        }
      );


    $("adminOrders")
      .querySelectorAll(
        "[data-print-order]"
      )
      .forEach(
        button => {

          button.onclick =
            () =>
              printAdminInvoice(
                button.dataset
                  .printOrder
              );

        }
      );


  }catch(error){

    $("adminOrders").innerHTML = `

      <div
        class="setting"
      >

        <small>

          ${escapeHTML(
            error.message
          )}

        </small>

      </div>

    `;

  }


  openModal();

}


/* =========================================================
   ACCEPT PAYPAL
========================================================= */

async function acceptPaypalOrder(
  orderId
){

  if(!isAdmin())
    return;


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
      "Paiement PayPal accepté"
    );


    renderAdmin();

  }catch(error){

    showToast(
      "Erreur : " +
      error.message
    );

  }

}


/* =========================================================
   SAVE ADMIN ORDER
========================================================= */

async function saveAdminOrder(
  orderId
){

  if(!isAdmin())
    return;


  const statusEl =
    document.querySelector(
      `[data-status="${CSS.escape(orderId)}"]`
    );


  const cityEl =
    document.querySelector(
      `[data-city="${CSS.escape(orderId)}"]`
    );


  const trackingEl =
    document.querySelector(
      `[data-tracking="${CSS.escape(orderId)}"]`
    );


  const durationEl =
    document.querySelector(
      `[data-duration="${CSS.escape(orderId)}"]`
    );


  const dateEl =
    document.querySelector(
      `[data-date="${CSS.escape(orderId)}"]`
    );


  if(!statusEl)
    return;


  try{

    await updateDoc(
      doc(
        db,
        "orders",
        orderId
      ),
      {

        status:
          statusEl.value,

        packageCity:
          cityEl?.value.trim() ||
          "",

        trackingNumber:
          trackingEl?.value.trim() ||
          "",

        deliveryDuration:
          durationEl?.value.trim() ||
          "",

        estimatedDelivery:
          dateEl?.value ||
          "",

        updatedAt:
          serverTimestamp()

      }
    );


    showToast(
      "Suivi de commande enregistré"
    );


    renderAdmin();

  }catch(error){

    showToast(
      "Erreur : " +
      error.message
    );

  }

}


/* =========================================================
   PRINT INVOICE
========================================================= */

async function printAdminInvoice(
  orderId
){

  if(!isAdmin())
    return;


  try{

    const snapshot =
      await getDocs(
        collection(
          db,
          "orders"
        )
      );


    const orderDoc =
      snapshot.docs.find(
        d =>
          d.id === orderId
      );


    if(!orderDoc){

      showToast(
        "Commande introuvable"
      );

      return;

    }


    const order = {

      id:
        orderDoc.id,

      ...orderDoc.data()

    };


    printInvoiceHTML(
      order
    );

  }catch(error){

    showToast(
      error.message
    );

  }

}


function printInvoiceHTML(
  order
){

  const items =
    Array.isArray(
      order.items
    )
      ? order.items
      : [];


  const itemRows =
    items
      .map(
        item => `

          <tr>

            <td>

              ${escapeHTML(
                item.name ||
                ""
              )}

            </td>

            <td>

              ${Number(
                item.qty ||
                0
              )}

            </td>

            <td>

              ${money(
                Number(
                  item.price ||
                  0
                )
              )}

            </td>

            <td>

              ${money(
                Number(
                  item.price ||
                  0
                ) *
                Number(
                  item.qty ||
                  0
                )
              )}

            </td>

          </tr>

        `
      )
      .join("");


  const win =
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );


  if(!win){

    showToast(
      "Autorise les fenêtres popup pour imprimer."
    );

    return;

  }


  win.document.write(`

    <!doctype html>

    <html lang="fr">

    <head>

      <meta charset="utf-8">

      <title>
        Facture NovaShop
      </title>

      <style>

        body{
          font-family:Arial,sans-serif;
          padding:40px;
          color:#111;
          background:#fff;
        }

        h1{
          margin-bottom:5px;
        }

        .muted{
          color:#666;
        }

        table{
          width:100%;
          border-collapse:collapse;
          margin-top:30px;
        }

        th,
        td{
          padding:12px;
          border-bottom:1px solid #ddd;
          text-align:left;
        }

        .total{
          text-align:right;
          font-size:22px;
          font-weight:bold;
          margin-top:25px;
        }

        .box{
          padding:15px;
          border:1px solid #ddd;
          border-radius:10px;
          margin-top:20px;
        }

        @media print{

          body{
            padding:20px;
          }

        }

      </style>

    </head>

    <body>

      <h1>
        NovaShop
      </h1>

      <div class="muted">
        Facture / commande
      </div>

      <div class="box">

        <strong>
          Commande :
        </strong>

        #${escapeHTML(order.id)}

        <br>

        <strong>
          Client :
        </strong>

        ${escapeHTML(
          order.email ||
          ""
        )}

        <br>

        <strong>
          Date :
        </strong>

        ${formatTimestamp(
          order.createdAt
        )}

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

          ${itemRows}

        </tbody>

      </table>

      <div class="box">

        <strong>
          Paiement :
        </strong>

        ${escapeHTML(
          order.paymentMethod ||
          "Non défini"
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

      <div class="total">

        Total :

        ${money(
          Number(
            order.total ||
            0
          )
        )}

      </div>

      <script>

        window.onload =
          function(){

            window.print();

          };

      <\/script>

    </body>

    </html>

  `);


  win.document.close();

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
  auth,
  user => {

    currentUser =
      user;


    const connectedEmail =
      user?.email
        ?.trim()
        .toLowerCase() ||
      "";


    const adminEmail =
      ADMIN_EMAIL
        .trim()
        .toLowerCase();


    /*
      Le bouton apparaît dès que le compte
      admin est connecté.

      Le code admin est demandé seulement
      lorsqu'on ouvre le dashboard.
    */

    if(
      connectedEmail ===
      adminEmail
    ){

      adminBtn.style.display =
        "grid";

      adminBtn.title =
        "Administration";

    }else{

      adminBtn.style.display =
        "none";

      localStorage.removeItem(
        ADMIN_ACCESS_KEY
      );

    }

  }
);


accountBtn.onclick =
  openAccount;

ordersBtn.onclick =
  openOrders;

settingsBtn.onclick =
  openSettings;

adminBtn.onclick =
  openAdmin;


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
   HELPERS
========================================================= */

function escapeHTML(value){

  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function escapeAttribute(value){

  return escapeHTML(
    value
  );

}


function authError(code){

  const errors = {

    "auth/invalid-credential":
      "E-mail ou mot de passe incorrect.",

    "auth/email-already-in-use":
      "Cette adresse est déjà utilisée.",

    "auth/weak-password":
      "Le mot de passe est trop faible.",

    "auth/invalid-email":
      "Adresse e-mail invalide.",

    "auth/network-request-failed":
      "Problème de connexion réseau."

  };


  return (
    errors[code] ||
    "Une erreur est survenue."
  );

}


function formatTimestamp(
  timestamp
){

  if(!timestamp){

    return "Date inconnue";

  }


  try{

    const date =
      new Date(
        timestamp.seconds *
        1000
      );


    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        dateStyle:"medium",
        timeStyle:"short"
      }
    ).format(date);

  }catch{

    return "Date inconnue";

  }

}


/* =========================================================
   PRODUCT SIZE + REAL IMAGES
========================================================= */

const novaProductStyle =
  document.createElement(
    "style"
  );


novaProductStyle.textContent = `

#productGrid{

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(190px,1fr)
    )!important;

  gap:14px!important;

  align-items:start!important;

}


#productGrid .product-card{

  max-width:245px!important;

  width:100%!important;

  margin:0 auto!important;

  min-width:0!important;

}


#productGrid .product-image{

  height:140px!important;

  min-height:140px!important;

  max-height:140px!important;

  overflow:hidden!important;

}


#productGrid .product-image img{

  width:100%!important;

  height:100%!important;

  object-fit:contain!important;

}


#productGrid .product-body{

  padding:10px!important;

}


#productGrid .product-name{

  font-size:13px!important;

  line-height:1.3!important;

  min-height:34px!important;

  display:-webkit-box!important;

  -webkit-line-clamp:2!important;

  -webkit-box-orient:vertical!important;

  overflow:hidden!important;

}


#productGrid .product-actions{

  display:flex!important;

  gap:8px!important;

}


#productGrid .product-actions button{

  flex:1!important;

  min-height:38px!important;

  padding:8px 12px!important;

  border-radius:10px!important;

  font-size:13px!important;

  font-weight:700!important;

}


#productGrid .product-actions button:hover{

  transform:translateY(-2px);

  filter:brightness(1.08);

}


@media(max-width:700px){

  #productGrid{

    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      )!important;

    gap:10px!important;

  }


  #productGrid .product-card{

    max-width:none!important;

  }


  #productGrid .product-image{

    height:115px!important;

    min-height:115px!important;

    max-height:115px!important;

  }


  #productGrid .product-body{

    padding:8px!important;

  }


  #productGrid .product-name{

    font-size:12px!important;

    min-height:31px!important;

  }


  #productGrid .rating-count{

    display:none!important;

  }


  #productGrid .price{

    font-size:15px!important;

  }


  #productGrid .product-actions{

    display:grid!important;

    grid-template-columns:1fr!important;

    gap:6px!important;

  }

}

`;

document.head.appendChild(
  novaProductStyle
);


/* =========================================================
   RESPONSIVE ORDERS
========================================================= */

const novaOrderResponsiveStyle =
  document.createElement(
    "style"
  );


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
}

.nova-delete-order{
  margin-top:12px;
  width:100%;
}

.nova-order-actions{
  display:flex!important;
  flex-direction:column!important;
  gap:10px!important;
  width:100%!important;
}

.nova-view-order{
  display:flex!important;
  visibility:visible!important;
  opacity:1!important;
  width:100%!important;
  min-height:52px!important;
  align-items:center!important;
  justify-content:center!important;
  position:relative!important;
  z-index:20!important;
}

@media(max-width:600px){

  .nova-order-card{
    padding:12px!important;
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
  }

  .nova-package-box{
    font-size:12px;
  }

  #ordersList{
    width:100%;
    min-width:0;
  }

  #ordersList .order{
    width:100%;
    min-width:0;
  }

}

`;

document.head.appendChild(
  novaOrderResponsiveStyle
);


/* =========================================================
   INITIALISATION
========================================================= */

renderCategories();

renderProducts();

renderCart();


const savedLanguage =
  localStorage.getItem(
    "novaLanguage"
  ) || "fr";


applyLanguage(
  savedLanguage
);


/* =========================================================
   DEBUG / GLOBAL API
========================================================= */

window.NovaShop = {

  products,

  cart,

  openCart,

  closeCart,

  openProduct,

  renderProducts,

  renderCart,

  showToast,

  imageUrl,

  openOrders,

  openAdmin,

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


console.log(
  `%cNovaShop chargé : ${products.length} produits`,
  "font-weight:bold;font-size:14px"
);

console.log(
  "NovaShop images : URLs directes des produits"
);

console.log(
  "NovaShop commandes : bouton Voir la commande actif"
);
