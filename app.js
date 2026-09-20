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
const ADMIN_KEY = "novaAdminAuthorized";


/* =========================================================
   DOM
========================================================= */

const $ = id => document.getElementById(id);

const searchInput = $("searchInput");
const categoriesEl = $("categories");
const productsGrid = $("productGrid");
const productCount = $("productCount") || { textContent: "" };

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

const toastContainer = document.createElement("div");

toastContainer.id = "novaToastContainer";

toastContainer.style.cssText =
  "position:fixed;" +
  "z-index:99999;" +
  "left:50%;" +
  "bottom:24px;" +
  "transform:translateX(-50%);" +
  "display:flex;" +
  "flex-direction:column;" +
  "gap:8px;" +
  "pointer-events:none;" +
  "width:max-content;" +
  "max-width:90vw;";

document.body.appendChild(toastContainer);


function toast(message) {

  const element = document.createElement("div");

  element.textContent = message;

  element.style.cssText =
    "background:#111827;" +
    "color:white;" +
    "padding:12px 16px;" +
    "border-radius:12px;" +
    "font-weight:700;" +
    "font-size:14px;" +
    "box-shadow:0 12px 30px rgba(0,0,0,.35);" +
    "border:1px solid rgba(255,255,255,.08);" +
    "text-align:center;";

  toastContainer.appendChild(element);

  setTimeout(() => {

    element.style.opacity = "0";
    element.style.transform = "translateY(5px)";
    element.style.transition = "opacity .2s,transform .2s";

    setTimeout(() => element.remove(), 220);

  }, 2400);

}


/* =========================================================
   IMAGE SYSTEM
========================================================= */

const FALLBACK_IMAGE =
  "https://placehold.co/800x800/111827/ffffff?text=NovaShop";


function imageUrl(url) {

  if (!url) {
    return FALLBACK_IMAGE;
  }

  return url;
}


function imageSrc(url) {

  return escapeHTML(
    imageUrl(url)
  );
}


function imageError(img, original) {

  if (!img) return;

  const stage =
    img.dataset.imageStage ||
    "original";

  if (stage === "original") {

    img.dataset.imageStage = "fallback";
    img.src = FALLBACK_IMAGE;

  }

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
    image:"https://thumb.pccomponentes.com/w-530-530/articles/1118/11186247/167-silla-gaming-ergonomica-con-reposapies-y-soporte-lumbar-4d.jpg"
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

];


/* =========================================================
   STATE
========================================================= */

let currentUser = null;
let selectedCategory = "Toutes";
let searchValue = "";
let cart = [];
let promoApplied = false;


/* =========================================================
   STORAGE
========================================================= */

try {

  cart =
    JSON.parse(
      localStorage.getItem("novaCart") || "[]"
    );

  if (!Array.isArray(cart)) {
    cart = [];
  }

} catch {

  cart = [];

}


function saveCart() {

  localStorage.setItem(
    "novaCart",
    JSON.stringify(cart)
  );

}


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


function money(value) {

  const number =
    Number(value || 0);

  if (number === 0) {
    return "Gratuit";
  }

  return new Intl.NumberFormat(
    "fr-FR",
    {
      style:"currency",
      currency:"EUR"
    }
  ).format(number);

}


function reviewData(product) {

  const number =
    Number(
      product.id
        .replace("p","")
    );

  return {
    count:
      132 +
      ((number * 173) % 1604),

    rating:
      Number(
        (
          4.4 +
          ((number % 6) * 0.1)
        ).toFixed(1)
      )
  };

}


function starsHTML(rating) {

  const rounded =
    Math.round(rating);

  return (
    "★".repeat(rounded) +
    "☆".repeat(5-rounded)
  );

}


/* =========================================================
   THEME
========================================================= */

function applyTheme() {

  const choice =
    localStorage.getItem(
      "novaThemeChoice"
    ) || "dark";

  document.body.classList.toggle(
    "light",
    choice === "light" ||
    (
      choice === "auto" &&
      window.matchMedia &&
      window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches
    )
  );

}

applyTheme();


/* =========================================================
   MODAL
========================================================= */

function openModal(html) {

  if (!modal || !modalContent) {
    return;
  }

  modalContent.innerHTML =
    html || "";

  modal.classList.add("open");

  document.body.classList.add(
    "modal-open"
  );

  document.body.style.overflow =
    "hidden";

}


function closeModal() {

  if (!modal) {
    return;
  }

  modal.classList.remove("open");

  document.body.classList.remove(
    "modal-open"
  );

  document.body.style.overflow =
    "";

}


if (modalClose) {
  modalClose.onclick =
    closeModal;
}

if (modal) {

  modal.addEventListener(
    "click",
    event => {

      if (event.target === modal) {
        closeModal();
      }

    }
  );

}


/* =========================================================
   CATEGORIES
========================================================= */

function getCategories() {

  return [
    "Toutes",
    ...new Set(
      products.map(
        product =>
          product.category
      )
    )
  ];

}


function renderCategories() {

  if (!categoriesEl) {
    return;
  }

  categoriesEl.innerHTML =
    getCategories()
      .map(
        category =>
          `
          <button
            class="category-btn ${
              category === selectedCategory
                ? "active"
                : ""
            }"
            data-category="${escapeHTML(category)}"
          >
            ${escapeHTML(category)}
          </button>
          `
      )
      .join("");

  categoriesEl
    .querySelectorAll(
      "[data-category]"
    )
    .forEach(
      button => {

        button.onclick = () => {

          selectedCategory =
            button.dataset.category;

          renderCategories();
          renderProducts();

        };

      }
    );

}


/* =========================================================
   FILTER
========================================================= */

function filteredProducts() {

  const search =
    searchValue
      .trim()
      .toLowerCase();

  return products.filter(
    product => {

      const categoryOK =
        selectedCategory === "Toutes" ||
        product.category ===
          selectedCategory;

      const searchOK =
        !search ||
        product.name
          .toLowerCase()
          .includes(search) ||
        product.category
          .toLowerCase()
          .includes(search);

      return (
        categoryOK &&
        searchOK
      );

    }
  );

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function productCardHTML(product) {

  const reviews =
    reviewData(product);

  return `
    <article
      class="product-card nova-compact-card"
    >

      <div
        class="product-image nova-compact-image"
      >

        ${
          product.new
            ? `
              <span class="new-badge">
                Nouveau
              </span>
            `
            : ""
        }

        <img
          src="${imageSrc(product.image)}"
          data-original="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
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

          <span>
            ${reviews.rating
              .toFixed(1)
              .replace(".",",")}
          </span>

          <span class="rating-count">
            · ${reviews.count.toLocaleString("fr-FR")} avis
          </span>

        </div>

        <div class="product-bottom">

          <div class="price">
            ${money(product.price)}
          </div>

        </div>

        <div class="product-actions">

          <button
            class="btn btn-secondary btn-small"
            data-view="${product.id}"
          >
            Voir
          </button>

          <button
            class="btn btn-primary btn-small"
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

function renderProducts() {

  if (!productsGrid) {
    return;
  }

  const list =
    filteredProducts();

  if (productCount) {

    productCount.textContent =
      `${list.length} produit${
        list.length > 1
          ? "s"
          : ""
      }`;

  }

  if (!list.length) {

    productsGrid.innerHTML =
      `
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

      </div>
      `;

    return;

  }

  productsGrid.innerHTML =
    list
      .map(productCardHTML)
      .join("");

  productsGrid
    .querySelectorAll(
      "[data-view]"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            openProduct(
              button.dataset.view
            );

          };

      }
    );

  productsGrid
    .querySelectorAll(
      "[data-add]"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            addToCart(
              button.dataset.add
            );

          };

      }
    );

}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

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
   PRODUCT MODAL
========================================================= */

function openProduct(productId) {

  const product =
    products.find(
      p =>
        p.id === productId
    );

  if (!product) {
    return;
  }

  const reviews =
    reviewData(product);

  openModal(
    `
    <div class="panel">

      <button
        class="modal-close-inside"
        id="closeProduct"
      >
        ✕
      </button>

      <div class="product-modal">

        <div class="modal-image">

          <img
            src="${imageSrc(product.image)}"
            data-original="${escapeHTML(product.image)}"
            onerror="imageError(this,this.dataset.original)"
            alt="${escapeHTML(product.name)}"
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

            ${reviews.rating
              .toFixed(1)
              .replace(".",",")}

            · ${reviews.count.toLocaleString("fr-FR")} avis

          </div>

          <div class="modal-price">
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

    </div>
    `
  );

  if ($("closeProduct")) {

    $("closeProduct").onclick =
      closeModal;

  }

  if ($("modalAddProduct")) {

    $("modalAddProduct").onclick =
      () => {

        addToCart(product.id);
        closeModal();

      };

  }

}


/* =========================================================
   CART
========================================================= */

function cartDetailed() {

  return cart
    .map(
      item => {

        const product =
          products.find(
            p =>
              p.id === item.id
          );

        if (!product) {
          return null;
        }

        return {
          ...product,
          qty:
            Math.max(
              1,
              Number(item.qty) || 1
            )
        };

      }
    )
    .filter(Boolean);

}


function cartSubtotal() {

  return cartDetailed()
    .reduce(
      (sum,item) =>
        sum +
        item.price *
        item.qty,
      0
    );

}


function addToCart(productId) {

  const existing =
    cart.find(
      item =>
        item.id === productId
    );

  if (existing) {

    existing.qty =
      Number(existing.qty || 0) + 1;

  } else {

    cart.push({
      id:productId,
      qty:1
    });

  }

  saveCart();
  renderCart();

  toast(
    "Produit ajouté au panier 🛒"
  );

}


function removeFromCart(productId) {

  cart =
    cart.filter(
      item =>
        item.id !== productId
    );

  saveCart();
  renderCart();

}


function changeCartQty(
  productId,
  amount
) {

  const item =
    cart.find(
      x =>
        x.id === productId
    );

  if (!item) {
    return;
  }

  item.qty =
    Number(item.qty || 1) +
    Number(amount || 0);

  if (item.qty <= 0) {

    removeFromCart(
      productId
    );

    return;

  }

  saveCart();
  renderCart();

}


/* =========================================================
   CART RENDER
========================================================= */

function renderCart() {

  const items =
    cartDetailed();

  const count =
    items.reduce(
      (sum,item) =>
        sum + item.qty,
      0
    );

  if (cartBadge) {

    cartBadge.textContent =
      count > 99
        ? "99+"
        : count;

    cartBadge.style.display =
      count
        ? ""
        : "none";

  }

  if (cartTotal) {

    cartTotal.textContent =
      money(
        cartSubtotal()
      );

  }

  if (!cartItems) {
    return;
  }

  if (!items.length) {

    cartItems.innerHTML =
      `
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
      .map(
        item =>
          `
          <div class="cart-item">

            <img
              src="${imageSrc(item.image)}"
              data-original="${escapeHTML(item.image)}"
              alt=""
              onerror="imageError(this,this.dataset.original)"
            >

            <div class="cart-item-info">

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
              🗑️
            </button>

          </div>
          `
      )
      .join("");

  cartItems
    .querySelectorAll(
      "[data-minus]"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            changeCartQty(
              button.dataset.minus,
              -1
            );

          };

      }
    );

  cartItems
    .querySelectorAll(
      "[data-plus]"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            changeCartQty(
              button.dataset.plus,
              1
            );

          };

      }
    );

  cartItems
    .querySelectorAll(
      "[data-remove]"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            removeFromCart(
              button.dataset.remove
            );

          };

      }
    );

}


/* =========================================================
   CART OPEN / CLOSE
========================================================= */

function openCart() {

  cartOverlay?.classList.add(
    "open"
  );

  cartDrawer?.classList.add(
    "open"
  );

}


function closeCart() {

  cartOverlay?.classList.remove(
    "open"
  );

  cartDrawer?.classList.remove(
    "open"
  );

}


cartBtn?.addEventListener(
  "click",
  openCart
);

cartClose?.addEventListener(
  "click",
  closeCart
);

cartOverlay?.addEventListener(
  "click",
  closeCart
);


/* =========================================================
   END PART 1
========================================================= *//* =========================================================
   ACCOUNT
========================================================= */

function authErrorMessage(
  error
) {

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
      "Cette adresse est déjà utilisée.",

    "auth/weak-password":
      "Le mot de passe est trop faible.",

    "auth/network-request-failed":
      "Erreur réseau. Réessaie.",

    "auth/too-many-requests":
      "Trop de tentatives. Réessaie plus tard."

  };

  return (
    map[code] ||
    "Une erreur est survenue."
  );

}


function openAccount() {

  if (currentUser) {

    openModal(
      `
      <div class="panel">

        <h2>
          Mon compte
        </h2>

        <p>
          ${escapeHTML(
            currentUser.email || ""
          )}
        </p>

        <button
          class="btn btn-secondary btn-wide"
          id="logoutButton"
        >
          🚪 Se déconnecter
        </button>

      </div>
      `
    );

    $("logoutButton").onclick =
      async () => {

        try {

          await signOut(auth);

          closeModal();

          toast(
            "Déconnexion réussie."
          );

        } catch (error) {

          toast(
            authErrorMessage(error)
          );

        }

      };

    return;

  }


  let mode = "login";


  function drawAuth() {

    openModal(
      `
      <div class="panel">

        <h2>
          ${
            mode === "login"
              ? "Connexion"
              : "Créer un compte"
          }
        </h2>

        <div class="auth-tabs">

          <button
            type="button"
            id="loginTab"
            class="auth-tab ${
              mode === "login"
                ? "active"
                : ""
            }"
          >
            Connexion
          </button>

          <button
            type="button"
            id="registerTab"
            class="auth-tab ${
              mode === "register"
                ? "active"
                : ""
            }"
          >
            Créer un compte
          </button>

        </div>

        <form id="authForm">

          <label>
            E-mail
          </label>

          <input
            id="authEmail"
            type="email"
            autocomplete="email"
            required
          >

          <label>
            Mot de passe
          </label>

          <input
            id="authPassword"
            type="password"
            autocomplete="${
              mode === "login"
                ? "current-password"
                : "new-password"
            }"
            minlength="6"
            required
          >

          ${
            mode === "register"
              ? `
                <label>
                  Confirmer le mot de passe
                </label>

                <input
                  id="authPassword2"
                  type="password"
                  autocomplete="new-password"
                  minlength="6"
                  required
                >
              `
              : ""
          }

          <div
            id="authError"
            class="form-error"
          ></div>

          <button
            class="btn btn-primary btn-wide"
            type="submit"
          >
            ${
              mode === "login"
                ? "Se connecter"
                : "Créer mon compte"
            }
          </button>

        </form>

      </div>
      `
    );


    $("loginTab").onclick =
      () => {

        mode = "login";
        drawAuth();

      };


    $("registerTab").onclick =
      () => {

        mode = "register";
        drawAuth();

      };


    $("authForm").onsubmit =
      async event => {

        event.preventDefault();

        const email =
          $("authEmail")
            .value
            .trim();

        const password =
          $("authPassword")
            .value;

        const error =
          $("authError");

        if (
          mode === "register" &&
          password !==
            $("authPassword2").value
        ) {

          error.textContent =
            "Les mots de passe ne correspondent pas.";

          return;

        }


        try {

          if (mode === "login") {

            await signInWithEmailAndPassword(
              auth,
              email,
              password
            );

          } else {

            await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );

          }

          closeModal();

          toast(
            mode === "login"
              ? "Connexion réussie ✅"
              : "Compte créé ✅"
          );

        } catch (authError) {

          error.textContent =
            authErrorMessage(
              authError
            );

        }

      };

  }


  drawAuth();

}


/* =========================================================
   SETTINGS
========================================================= */

function openSettings() {

  const theme =
    localStorage.getItem(
      "novaThemeChoice"
    ) || "dark";


  openModal(
    `
    <div class="panel">

      <h2>
        ⚙️ Paramètres
      </h2>

      <label>
        Apparence
      </label>

      <select
        id="themeSelect"
      >

        <option
          value="dark"
          ${
            theme === "dark"
              ? "selected"
              : ""
          }
        >
          🌙 Mode sombre
        </option>

        <option
          value="light"
          ${
            theme === "light"
              ? "selected"
              : ""
          }
        >
          ☀️ Mode clair
        </option>

        <option
          value="auto"
          ${
            theme === "auto"
              ? "selected"
              : ""
          }
        >
          🖥️ Automatique
        </option>

      </select>

    </div>
    `
  );


  $("themeSelect").onchange =
    event => {

      localStorage.setItem(
        "novaThemeChoice",
        event.target.value
      );

      applyTheme();

    };

}


/* =========================================================
   CHECKOUT
========================================================= */

function addressFromForm() {

  return {

    firstName:
      $("checkoutFirstName")
        ?.value
        .trim() || "",

    lastName:
      $("checkoutLastName")
        ?.value
        .trim() || "",

    street:
      $("checkoutStreet")
        ?.value
        .trim() || "",

    postalCode:
      $("checkoutPostal")
        ?.value
        .trim() || "",

    city:
      $("checkoutCity")
        ?.value
        .trim() || "",

    country:
      $("checkoutCountry")
        ?.value
        .trim() || "France"

  };

}


function openCheckout() {

  if (!currentUser) {

    toast(
      "Connecte-toi pour passer commande."
    );

    openAccount();

    return;

  }

  if (!cartDetailed().length) {

    toast(
      "Ton panier est vide."
    );

    return;

  }

  promoApplied = false;

  renderCheckout();

}


function renderCheckout() {

  const items =
    cartDetailed();

  const subtotal =
    cartSubtotal();

  const total =
    promoApplied
      ? 0
      : subtotal;


  openModal(
    `
    <div class="panel">

      <h2>
        Finaliser la commande
      </h2>

      <div class="checkout-grid">

        <div>

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

          <h3>
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
          ></div>

          <h3>
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

        <div
          class="checkout-summary"
        >

          <h3>
            🛒 Résumé
          </h3>

          ${
            items.map(
              item =>
                `
                <div
                  class="checkout-item"
                >

                  <span>
                    ${escapeHTML(item.name)}
                    ×${item.qty}
                  </span>

                  <strong>
                    ${money(
                      item.price *
                      item.qty
                    )}
                  </strong>

                </div>
                `
            ).join("")
          }

          <div
            class="checkout-total-final"
          >

            <span>
              Total
            </span>

            <strong>
              ${
                total === 0
                  ? "Gratuit"
                  : money(total)
              }
            </strong>

          </div>

        </div>

      </div>

    </div>
    `
  );


  $("applyPromo").onclick =
    () => {

      const code =
        $("promoCode")
          .value
          .trim()
          .toUpperCase();

      if (code === "NOVA100") {

        promoApplied = true;

        toast(
          "NOVA100 appliqué 🎉"
        );

        renderCheckout();

      } else {

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

      submitCheckout(
        "paypal"
      );

    };


  $("cardPayment").onclick =
    openCardPayment;

}


/* =========================================================
   SUBMIT CHECKOUT
========================================================= */

async function submitCheckout(
  method
) {

  if (!currentUser) {

    toast(
      "Connecte-toi pour continuer."
    );

    openAccount();

    return;

  }

  const items =
    cartDetailed();

  if (!items.length) {

    toast(
      "Ton panier est vide."
    );

    return;

  }

  const address =
    addressFromForm();

  if (
    Object.values(address)
      .some(
        value => !value
      )
  ) {

    toast(
      "Remplis toute l'adresse."
    );

    return;

  }

  const subtotal =
    cartSubtotal();

  const total =
    promoApplied
      ? 0
      : subtotal;


  if (method === "card") {

    openCardPayment();

    return;

  }


  try {

    await addDoc(
      collection(
        db,
        "orders"
      ),
      {

        userId:
          currentUser.uid,

        email:
          currentUser.email || "",

        items:
          items.map(
            item => ({

              id:item.id,
              name:item.name,
              price:item.price,
              qty:item.qty

            })
          ),

        subtotal:
          Number(subtotal),

        total:
          Number(total),

        promoCode:
          promoApplied
            ? "NOVA100"
            : "",

        discount:
          subtotal-total,

        address,

        status:
          "Enregistrée",

        paymentMethod:
          total === 0
            ? "NOVA100"
            : "PayPal.Me",

        paymentStatus:
          total === 0
            ? "free"
            : "pending",

        createdAt:
          serverTimestamp()

      }
    );


    cart = [];

    saveCart();
    renderCart();
    closeModal();


    if (total === 0) {

      toast(
        "Commande gratuite enregistrée 🎉"
      );

      setTimeout(
        openOrders,
        300
      );

    } else {

      toast(
        "Commande enregistrée. Ouverture de PayPal..."
      );

      const paypalURL =
        "https://paypal.me/SH0PNOVA/" +
        encodeURIComponent(
          Number(total)
            .toFixed(2)
        ) +
        "EUR";

      setTimeout(
        () => {

          window.location.href =
            paypalURL;

        },
        700
      );

    }

  } catch (error) {

    console.error(
      "Création commande:",
      error
    );

    toast(
      "Impossible d'enregistrer la commande."
    );

  }

}


/* =========================================================
   CARD PAYMENT
========================================================= */

function openCardPayment() {

  openModal(
    `
    <div class="panel">

      <h2>
        💳 Paiement par carte
      </h2>

      <label>
        Nom complet
      </label>

      <input
        id="cardName"
        autocomplete="off"
      >

      <label>
        Numéro de carte
      </label>

      <input
        id="cardNumber"
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
      ></div>

      <button
        class="btn btn-primary btn-wide"
        id="validateCard"
        type="button"
      >
        💳 Valider le paiement
      </button>

      <button
        class="btn btn-secondary btn-wide"
        id="backCheckout"
        type="button"
      >
        ← Retour
      </button>

    </div>
    `
  );


  $("cardNumber").oninput =
    () => {

      let value =
        $("cardNumber")
          .value
          .replace(/\D/g,"")
          .slice(0,16);

      $("cardNumber").value =
        value
          .replace(
            /(.{4})/g,
            "$1 "
          )
          .trim();

    };


  $("cardExpiry").oninput =
    () => {

      let value =
        $("cardExpiry")
          .value
          .replace(/\D/g,"")
          .slice(0,4);

      $("cardExpiry").value =
        value.length > 2
          ? value.slice(0,2) +
            "/" +
            value.slice(2)
          : value;

    };


  $("cardCVV").oninput =
    () => {

      $("cardCVV").value =
        $("cardCVV")
          .value
          .replace(/\D/g,"")
          .slice(0,4);

    };


  $("validateCard").onclick =
    () => {

      $("cardPaymentMessage").innerHTML =
        `
        <span class="form-error">
          Carte incorrecte
        </span>
        `;

      toast(
        "Carte incorrecte"
      );

      $("cardName").value = "";
      $("cardNumber").value = "";
      $("cardExpiry").value = "";
      $("cardCVV").value = "";

    };


  $("backCheckout").onclick =
    renderCheckout;

}


/* =========================================================
   ORDER STATUS
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


function statusClass(status) {

  const value =
    String(status || "")
      .toLowerCase();

  if (value === "livrée") {
    return "delivered";
  }

  if (value === "annulée") {
    return "cancelled";
  }

  if (
    value ===
    "remboursement en cours"
  ) {
    return "refund";
  }

  if (
    value === "en transit" ||
    value === "acceptée" ||
    value === "préparation"
  ) {
    return "transit";
  }

  if (
    value === "livraison proche"
  ) {
    return "nearby";
  }

  return "";

}


function statusIcon(status) {

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


function canDeleteOrder(order) {

  return (
    order?.status === "Livrée" ||
    order?.status === "Annulée"
  );

}


/* =========================================================
   DATE
========================================================= */

function formatDate(value) {

  if (!value) {
    return "Date inconnue";
  }

  let date;

  if (
    typeof value === "object" &&
    typeof value.toDate === "function"
  ) {

    date = value.toDate();

  } else {

    date =
      value instanceof Date
        ? value
        : new Date(value);

  }

  if (
    !date ||
    Number.isNaN(
      date.getTime()
    )
  ) {

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
   END PART 2
========================================================= *//* =========================================================
   ORDER TIMELINE
========================================================= */

function orderTimelineHTML(order) {

  const currentStatus =
    order.status ||
    "Enregistrée";

  const flow = [

    "Enregistrée",
    "Acceptée",
    "Préparation",
    "En transit",
    "Livraison proche",
    "Livrée"

  ];

  const currentIndex =
    flow.indexOf(
      currentStatus
    );


  let html =
    `
    <div class="order-timeline">
    `;


  flow.forEach(
    (status,index) => {

      let done = false;

      if (
        currentStatus !== "Annulée" &&
        currentStatus !==
          "Remboursement en cours" &&
        currentIndex >= index
      ) {

        done = true;

      }


      if (
        (
          currentStatus ===
            "Annulée" ||
          currentStatus ===
            "Remboursement en cours"
        ) &&
        index === 0
      ) {

        done = true;

      }


      html +=
        `
        <div
          class="timeline-step ${
            done ? "done" : ""
          }"
        >

          <div class="timeline-dot">
            ${
              done
                ? "✓"
                : index + 1
            }
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


  if (
    currentStatus ===
    "Annulée"
  ) {

    html +=
      `
      <div
        class="timeline-step done"
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


  if (
    currentStatus ===
    "Remboursement en cours"
  ) {

    html +=
      `
      <div
        class="timeline-step done"
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


  html +=
    `
    </div>
    `;


  return html;

}


/* =========================================================
   GET USER ORDERS
========================================================= */

async function getUserOrders() {

  if (!currentUser) {
    return [];
  }

  const orderQuery =
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
    );


  const snapshot =
    await getDocs(
      orderQuery
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

          if (
            value &&
            typeof value.toDate ===
              "function"
          ) {

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

async function openOrders() {

  if (!currentUser) {

    toast(
      "Connecte-toi pour voir tes commandes."
    );

    openAccount();

    return;

  }


  openModal(
    `
    <div class="panel nova-orders-panel">

      <h2>
        📦 Mes commandes
      </h2>

      <div
        id="ordersList"
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
    `
  );


  const list =
    $("ordersList");


  try {

    const orders =
      await getUserOrders();


    if (!orders.length) {

      list.innerHTML =
        `
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

            const items =
              Array.isArray(
                order.items
              )
                ? order.items
                : [];

            const itemCount =
              items.reduce(
                (sum,item) =>
                  sum +
                  Number(
                    item.qty || 0
                  ),
                0
              );


            return `
              <article
                class="order nova-order-card"
                data-order-id="${escapeHTML(order.id)}"
              >

                <div
                  class="nova-order-head"
                >

                  <div>

                    <strong>
                      Commande #
                      ${escapeHTML(
                        order.id.slice(
                          0,
                          10
                        )
                      )}
                    </strong>

                    <div
                      class="order-date"
                    >
                      ${escapeHTML(
                        formatDate(
                          order.createdAt
                        )
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

                  <span>
                    📦 ${itemCount}
                    article${
                      itemCount > 1
                        ? "s"
                        : ""
                    }
                  </span>

                  <strong>
                    ${
                      Number(
                        order.total || 0
                      ) === 0
                        ? "Gratuit"
                        : money(
                            order.total
                          )
                    }
                  </strong>

                </div>


                <div
                  class="nova-order-actions"
                >

                  <button
                    type="button"
                    class="btn btn-primary btn-wide nova-view-order"
                    data-view-order="${escapeHTML(order.id)}"
                  >
                    👁️ Voir la commande
                  </button>

                  ${
                    canDeleteOrder(
                      order
                    )
                      ? `
                        <button
                          type="button"
                          class="btn btn-danger btn-wide"
                          data-delete-order="${escapeHTML(order.id)}"
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
            () => {

              deleteUserOrder(
                button.dataset.deleteOrder
              );

            };

        }
      );


  } catch (error) {

    console.error(
      "Commandes:",
      error
    );


    list.innerHTML =
      `
      <div class="empty">

        <div class="empty-icon">
          ⚠️
        </div>

        <h3>
          Impossible de charger les commandes
        </h3>

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

}


/* =========================================================
   ORDER DETAILS
========================================================= */

async function openOrderDetails(
  orderId
) {

  if (!currentUser) {
    return;
  }


  try {

    const orders =
      await getUserOrders();


    const order =
      orders.find(
        item =>
          item.id === orderId
      );


    if (!order) {

      toast(
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

    const status =
      order.status ||
      "Enregistrée";


    openModal(
      `
      <div
        class="panel nova-order-details"
      >

        <button
          type="button"
          class="btn btn-secondary btn-small"
          id="backOrders"
        >
          ← Mes commandes
        </button>


        <div
          class="nova-order-head"
          style="margin-top:16px;"
        >

          <div>

            <div class="eyebrow">
              COMMANDE
            </div>

            <h2>
              📦 Commande #${escapeHTML(
                order.id
              )}
            </h2>

            <div
              class="order-date"
            >
              ${escapeHTML(
                formatDate(
                  order.createdAt
                )
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
            🛍️ Articles
          </h3>

          <div
            class="nova-order-items"
          >

            ${
              items.length
                ? items.map(
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
                          ×${Number(
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
                      `
                  ).join("")
                : `
                    <div class="empty">
                      Aucun article.
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
              ${
                Number(
                  order.total || 0
                ) === 0
                  ? "Gratuit"
                  : money(
                      order.total
                    )
              }
            </strong>

          </div>

        </div>


        <div
          class="nova-order-detail-section"
        >

          <h3>
            🚚 Suivi du colis
          </h3>

          <div
            class="nova-package-box"
          >

            <div>
              📍 Destination :
              <strong>
                ${escapeHTML(
                  order.packageCity ||
                  address.city ||
                  "Non renseignée"
                )}
              </strong>
            </div>

            <div>
              🔎 Numéro de suivi :
              <strong>
                ${escapeHTML(
                  order.trackingNumber ||
                  "Pas encore disponible"
                )}
              </strong>
            </div>

            <div>
              ⏱️ Durée de livraison :
              ${escapeHTML(
                order.deliveryDuration ||
                "Non renseignée"
              )}
            </div>

            <div>
              📅 Livraison estimée :
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
              📦 Statut actuel :
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
            🏠 Adresse
          </h3>

          <div
            class="nova-package-box"
          >

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

            Méthode :
            ${escapeHTML(
              order.paymentMethod ||
              "Non renseignée"
            )}

            <br>

            Statut :
            ${escapeHTML(
              order.paymentStatus ||
              "pending"
            )}

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
                type="button"
                class="btn btn-danger btn-wide nova-delete-detail"
                id="deleteDetailOrder"
              >
                🗑️ Supprimer cette commande
              </button>
            `
            : ""
        }

      </div>
      `
    );


    $("backOrders").onclick =
      openOrders;


    if ($("deleteDetailOrder")) {

      $("deleteDetailOrder").onclick =
        () => {

          deleteUserOrder(
            order.id
          );

        };

    }

  } catch (error) {

    console.error(
      "Détails commande:",
      error
    );

    toast(
      "Impossible d'afficher la commande."
    );

  }

}


/* =========================================================
   DELETE USER ORDER
========================================================= */

async function deleteUserOrder(
  orderId
) {

  if (!currentUser) {
    return;
  }


  try {

    const orders =
      await getUserOrders();


    const order =
      orders.find(
        item =>
          item.id === orderId
      );


    if (
      !order ||
      !canDeleteOrder(order)
    ) {

      toast(
        "Cette commande ne peut pas encore être supprimée."
      );

      return;

    }


    if (
      !window.confirm(
        "Supprimer définitivement cette commande ?"
      )
    ) {

      return;

    }


    await deleteDoc(
      doc(
        db,
        "orders",
        orderId
      )
    );


    toast(
      "Commande supprimée."
    );


    openOrders();

  } catch (error) {

    console.error(
      "Suppression:",
      error
    );

    toast(
      "Impossible de supprimer la commande."
    );

  }

}


/* =========================================================
   ADMIN
========================================================= */

function isAdminUser() {

  if (!currentUser) {
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


function isAdminAuthorized() {

  return (
    isAdminUser() &&
    localStorage.getItem(
      ADMIN_KEY
    ) === "true"
  );

}


function openAdmin() {

  if (!isAdminUser()) {

    toast(
      "Accès administrateur refusé."
    );

    return;

  }


  if (!isAdminAuthorized()) {

    openModal(
      `
      <div class="panel">

        <h2>
          🔐 Administration
        </h2>

        <p>
          Entre le code administrateur.
        </p>

        <input
          id="adminCodeInput"
          type="password"
          autocomplete="off"
        >

        <div
          id="adminError"
          class="form-error"
        ></div>

        <button
          class="btn btn-primary btn-wide"
          id="adminLoginButton"
        >
          🔓 Accéder au dashboard
        </button>

      </div>
      `
    );


    $("adminLoginButton").onclick =
      () => {

        if (
          $("adminCodeInput").value ===
          ADMIN_CODE
        ) {

          localStorage.setItem(
            ADMIN_KEY,
            "true"
          );

          closeModal();

          renderAdmin();

        } else {

          $("adminError")
            .textContent =
            "Code incorrect.";

        }

      };


    return;

  }


  renderAdmin();

}


/* =========================================================
   ADMIN RENDER
========================================================= */

async function renderAdmin() {

  if (!isAdminAuthorized()) {
    return;
  }


  openModal(
    `
    <div class="panel">

      <h2>
        🛠️ Dashboard administrateur
      </h2>

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
          id="adminLock"
        >
          🔒 Verrouiller
        </button>

      </div>

      <div
        id="adminOrders"
      >
        Chargement...
      </div>

    </div>
    `
  );


  $("adminRefresh").onclick =
    renderAdmin;


  $("adminLock").onclick =
    () => {

      localStorage.removeItem(
        ADMIN_KEY
      );

      closeModal();

      toast(
        "Administration verrouillée."
      );

    };


  try {

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


    const container =
      $("adminOrders");


    if (!orders.length) {

      container.innerHTML =
        `
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


    container.innerHTML =
      orders
        .map(
          order => {

            const status =
              order.status ||
              "Enregistrée";

            const address =
              order.address ||
              {};


            return `
              <div
                class="admin-order"
              >

                <div
                  class="nova-order-head"
                >

                  <div>

                    <strong>
                      #${escapeHTML(
                        order.id
                      )}
                    </strong>

                    <div>
                      ${escapeHTML(
                        order.email ||
                        ""
                      )}
                    </div>

                    <div>
                      ${escapeHTML(
                        formatDate(
                          order.createdAt
                        )
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
                  class="admin-order-grid"
                >

                  <div>

                    <label>
                      Statut
                    </label>

                    <select
                      data-admin-status="${escapeHTML(order.id)}"
                    >

                      ${
                        ORDER_STATUSES
                          .map(
                            statusOption =>
                              `
                              <option
                                value="${escapeHTML(statusOption)}"
                                ${
                                  statusOption ===
                                  status
                                    ? "selected"
                                    : ""
                                }
                              >
                                ${escapeHTML(
                                  statusOption
                                )}
                              </option>
                              `
                          )
                          .join("")
                      }

                    </select>

                  </div>


                  <div>

                    <label>
                      Ville
                    </label>

                    <input
                      data-admin-city="${escapeHTML(order.id)}"
                      value="${escapeHTML(
                        order.packageCity ||
                        address.city ||
                        ""
                      )}"
                    >

                  </div>


                  <div>

                    <label>
                      Numéro de suivi
                    </label>

                    <input
                      data-admin-tracking="${escapeHTML(order.id)}"
                      value="${escapeHTML(
                        order.trackingNumber ||
                        ""
                      )}"
                    >

                  </div>


                  <div>

                    <label>
                      Durée
                    </label>

                    <input
                      data-admin-duration="${escapeHTML(order.id)}"
                      value="${escapeHTML(
                        order.deliveryDuration ||
                        ""
                      )}"
                    >

                  </div>


                  <div>

                    <label>
                      Livraison estimée
                    </label>

                    <input
                      type="text"
                      data-admin-date="${escapeHTML(order.id)}"
                      value="${escapeHTML(
                        order.estimatedDelivery ||
                        ""
                      )}"
                      placeholder="25 septembre"
                    >

                  </div>

                </div>


                <div
                  class="admin-actions"
                >

                  <button
                    class="btn btn-primary"
                    data-save-admin="${escapeHTML(order.id)}"
                  >
                    💾 Enregistrer
                  </button>

                  ${
                    order.paymentMethod ===
                      "PayPal.Me" &&
                    order.paymentStatus !==
                      "accepted"
                      ? `
                        <button
                          class="btn btn-primary"
                          data-accept-paypal="${escapeHTML(order.id)}"
                        >
                          ✅ Accepter PayPal
                        </button>
                      `
                      : ""
                  }

                  <button
                    class="btn btn-secondary"
                    data-print-invoice="${escapeHTML(order.id)}"
                  >
                    🧾 Facture
                  </button>

                  <button
                    class="btn btn-danger"
                    data-delete-admin="${escapeHTML(order.id)}"
                  >
                    🗑️ Supprimer
                  </button>

                </div>

              </div>
            `;

          }
        )
        .join("");


    container
      .querySelectorAll(
        "[data-save-admin]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              saveAdminOrder(
                button.dataset.saveAdmin
              );

            };

        }
      );


    container
      .querySelectorAll(
        "[data-accept-paypal]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              acceptPaypalOrder(
                button.dataset.acceptPaypal
              );

            };

        }
      );


    container
      .querySelectorAll(
        "[data-print-invoice]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              printInvoice(
                button.dataset.printInvoice
              );

            };

        }
      );


    container
      .querySelectorAll(
        "[data-delete-admin]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              adminDeleteOrder(
                button.dataset.deleteAdmin
              );

            };

        }
      );

  } catch (error) {

    console.error(
      "Admin:",
      error
    );

    $("adminOrders").innerHTML =
      `
      <div class="empty">

        <div class="empty-icon">
          ⚠️
        </div>

        <h3>
          Erreur de chargement
        </h3>

      </div>
      `;

  }

}


/* =========================================================
   END PART 3
========================================================= *//* =========================================================
   ADMIN SAVE
========================================================= */

async function saveAdminOrder(
  orderId
) {

  if (!isAdminAuthorized()) {

    toast(
      "Administration verrouillée."
    );

    return;

  }


  try {

    const status =
      document.querySelector(
        `[data-admin-status="${CSS.escape(orderId)}"]`
      )?.value ||
      "Enregistrée";


    const packageCity =
      document.querySelector(
        `[data-admin-city="${CSS.escape(orderId)}"]`
      )?.value
        .trim() ||
      "";


    const trackingNumber =
      document.querySelector(
        `[data-admin-tracking="${CSS.escape(orderId)}"]`
      )?.value
        .trim() ||
      "";


    const deliveryDuration =
      document.querySelector(
        `[data-admin-duration="${CSS.escape(orderId)}"]`
      )?.value
        .trim() ||
      "";


    const estimatedDelivery =
      document.querySelector(
        `[data-admin-date="${CSS.escape(orderId)}"]`
      )?.value
        .trim() ||
      "";


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


    toast(
      "Commande mise à jour ✅"
    );


    renderAdmin();

  } catch (error) {

    console.error(
      "Sauvegarde admin:",
      error
    );

    toast(
      "Impossible de mettre à jour la commande."
    );

  }

}


/* =========================================================
   ADMIN PAYPAL
========================================================= */

async function acceptPaypalOrder(
  orderId
) {

  if (!isAdminAuthorized()) {

    toast(
      "Administration verrouillée."
    );

    return;

  }


  try {

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


    toast(
      "Paiement accepté ✅"
    );


    renderAdmin();

  } catch (error) {

    console.error(
      "PayPal:",
      error
    );

    toast(
      "Impossible d'accepter le paiement."
    );

  }

}


/* =========================================================
   ADMIN DELETE
========================================================= */

async function adminDeleteOrder(
  orderId
) {

  if (!isAdminAuthorized()) {

    toast(
      "Administration verrouillée."
    );

    return;

  }


  if (
    !window.confirm(
      "Supprimer définitivement cette commande ?"
    )
  ) {

    return;

  }


  try {

    await deleteDoc(
      doc(
        db,
        "orders",
        orderId
      )
    );


    toast(
      "Commande supprimée."
    );


    renderAdmin();

  } catch (error) {

    console.error(
      "Suppression admin:",
      error
    );

    toast(
      "Impossible de supprimer la commande."
    );

  }

}


/* =========================================================
   INVOICE
========================================================= */

async function printInvoice(
  orderId
) {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "orders"
        )
      );


    const orderDoc =
      snapshot.docs.find(
        document =>
          document.id === orderId
      );


    if (!orderDoc) {

      toast(
        "Commande introuvable."
      );

      return;

    }


    const order = {

      id:
        orderDoc.id,

      ...orderDoc.data()

    };


    const invoiceWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=700"
      );


    if (!invoiceWindow) {

      toast(
        "Fenêtre bloquée par le navigateur."
      );

      return;

    }


    const items =
      Array.isArray(
        order.items
      )
        ? order.items
        : [];


    invoiceWindow.document.write(
      `
      <!DOCTYPE html>

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
          }

          h1{
            margin-bottom:5px;
          }

          .box{
            padding:18px;
            border:1px solid #ddd;
            border-radius:12px;
            margin-top:20px;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:20px;
          }

          th,
          td{
            padding:10px;
            border-bottom:1px solid #ddd;
            text-align:left;
          }

          .total{
            text-align:right;
            font-size:22px;
            font-weight:bold;
            margin-top:20px;
          }

        </style>

      </head>

      <body>

        <h1>
          NovaShop
        </h1>

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
            order.email || ""
          )}

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
                  item =>
                    `
                    <tr>

                      <td>
                        ${escapeHTML(
                          item.name ||
                          "Produit"
                        )}
                      </td>

                      <td>
                        ${Number(
                          item.qty || 0
                        )}
                      </td>

                      <td>
                        ${money(
                          item.price
                        )}
                      </td>

                      <td>
                        ${money(
                          Number(
                            item.price || 0
                          ) *
                          Number(
                            item.qty || 0
                          )
                        )}
                      </td>

                    </tr>
                    `
                )
                .join("")
            }

          </tbody>

        </table>


        <div class="total">

          Total :
          ${
            Number(
              order.total || 0
            ) === 0
              ? "Gratuit"
              : money(
                  order.total
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
      `
    );


    invoiceWindow.document.close();

  } catch (error) {

    console.error(
      "Facture:",
      error
    );

    toast(
      "Impossible de générer la facture."
    );

  }

}


/* =========================================================
   BUTTONS
========================================================= */

accountBtn?.addEventListener(
  "click",
  openAccount
);

ordersBtn?.addEventListener(
  "click",
  openOrders
);

settingsBtn?.addEventListener(
  "click",
  openSettings
);

adminBtn?.addEventListener(
  "click",
  openAdmin
);

checkoutBtn?.addEventListener(
  "click",
  openCheckout
);


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
  auth,
  user => {

    currentUser =
      user;


    if (adminBtn) {

      adminBtn.style.display =
        isAdminUser()
          ? "grid"
          : "none";

    }


    if (!isAdminUser()) {

      localStorage.removeItem(
        ADMIN_KEY
      );

    }


    if (accountBtn) {

      accountBtn.title =
        user?.email ||
        "Mon compte";

    }

  }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeModal();
      closeCart();

    }

  }
);


/* =========================================================
   NOVASHOP CSS
========================================================= */

const novaStyle =
  document.createElement(
    "style"
  );


novaStyle.textContent = `

/* =========================================================
   PRODUITS PC
========================================================= */

#productGrid{

  display:grid!important;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(190px,1fr)
    )!important;

  gap:14px!important;

  align-items:start!important;

}

#productGrid .product-card{

  width:100%!important;

  max-width:245px!important;

  margin:0 auto!important;

  min-width:0!important;

}

#productGrid .product-image{

  height:140px!important;

  min-height:140px!important;

  max-height:140px!important;

  overflow:hidden!important;

  border-radius:12px!important;

}

#productGrid .product-image img{

  width:100%!important;

  height:100%!important;

  object-fit:contain!important;

  display:block!important;

}

#productGrid .product-body{

  padding:10px!important;

}

#productGrid .product-category{

  font-size:10px!important;

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

#productGrid .rating{

  font-size:10px!important;

  gap:3px!important;

}

#productGrid .stars{

  letter-spacing:0!important;

}

#productGrid .price{

  font-size:16px!important;

}


/* =========================================================
   BOUTONS PRODUITS PC
========================================================= */

#productGrid .product-actions{

  display:flex!important;

  gap:8px!important;

  margin-top:10px!important;

}

#productGrid .product-actions button{

  flex:1!important;

  min-height:38px!important;

  padding:8px 12px!important;

  border-radius:10px!important;

  font-size:13px!important;

  font-weight:700!important;

  cursor:pointer!important;

  transition:
    transform .15s ease,
    filter .15s ease,
    box-shadow .15s ease!important;

}

#productGrid .product-actions button:hover{

  transform:translateY(-2px);

  filter:brightness(1.08);

}

#productGrid .product-actions button:active{

  transform:translateY(0);

}


/* =========================================================
   COMMANDES
========================================================= */

.nova-orders-panel,
.nova-order-details{

  width:100%!important;

  max-width:100%!important;

  overflow-x:hidden!important;

}

.nova-order-card{

  width:100%!important;

  max-width:100%!important;

  overflow:hidden!important;

  overflow-wrap:anywhere!important;

  word-break:break-word!important;

}

.nova-order-head{

  display:flex;

  justify-content:space-between;

  align-items:flex-start;

  gap:12px;

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

  display:flex!important;

  flex-direction:column!important;

  gap:10px!important;

  width:100%!important;

  margin-top:12px!important;

}

.nova-order-actions button.nova-view-order{

  display:flex!important;

  visibility:visible!important;

  opacity:1!important;

  width:100%!important;

  max-width:100%!important;

  min-height:52px!important;

  align-items:center!important;

  justify-content:center!important;

  position:relative!important;

  z-index:20!important;

  flex:none!important;

}

.nova-order-item{

  display:flex;

  justify-content:space-between;

  align-items:flex-start;

  gap:12px;

  padding:8px 10px;

  border-radius:10px;

  background:rgba(255,255,255,.035);

  font-size:13px;

}

.nova-order-items{

  display:grid;

  gap:6px;

  margin-top:10px;

}

.nova-package-box{

  margin-top:10px;

  padding:12px;

  border-radius:12px;

  background:rgba(255,255,255,.035);

  line-height:1.7;

  overflow-wrap:anywhere;

  word-break:break-word;

}

.nova-detail-total{

  display:flex;

  justify-content:space-between;

  gap:12px;

  margin-top:10px;

  padding-top:10px;

  border-top:1px solid rgba(255,255,255,.08);

}

.nova-detail-status{

  margin-top:10px;

  padding-top:10px;

  border-top:1px solid rgba(255,255,255,.08);

}

.nova-status{

  display:inline-flex;

  align-items:center;

  justify-content:center;

  gap:5px;

  padding:7px 10px;

  border-radius:999px;

  background:rgba(255,255,255,.08);

  font-size:12px;

  font-weight:800;

  white-space:nowrap;

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


/* =========================================================
   TIMELINE
========================================================= */

.order-timeline{

  display:flex;

  flex-direction:column;

  gap:14px;

  margin-top:12px;

}

.timeline-step{

  display:flex;

  align-items:center;

  gap:10px;

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


/* =========================================================
   ADMIN
========================================================= */

.admin-order{

  margin-top:15px;

  padding:15px;

  border-radius:14px;

  background:rgba(255,255,255,.035);

  border:1px solid rgba(255,255,255,.06);

  overflow:hidden;

}

.admin-order-grid{

  display:grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(180px,1fr)
    );

  gap:10px;

  margin-top:14px;

}

.admin-order-grid label{

  display:block;

  margin-bottom:5px;

  font-size:12px;

  font-weight:800;

}

.admin-order-grid input,
.admin-order-grid select{

  width:100%;

}

.admin-actions{

  display:flex;

  flex-wrap:wrap;

  gap:8px;

  margin-top:12px;

}

.admin-actions button{

  flex:1;

  min-width:170px;

}

.admin-top-actions{

  display:flex;

  flex-wrap:wrap;

  gap:10px;

  margin-bottom:15px;

}


/* =========================================================
   MOBILE
========================================================= */

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

  #productGrid .product-actions button{

    width:100%!important;

    min-height:38px!important;

  }

  .nova-order-head{

    flex-direction:column!important;

    align-items:stretch!important;

  }

  .nova-order-head .nova-status{

    width:100%!important;

    white-space:normal!important;

    text-align:center!important;

  }

  .nova-order-preview{

    font-size:12px;

  }

  .nova-order-actions{

    width:100%!important;

  }

  .nova-order-actions button{

    width:100%!important;

    max-width:100%!important;

  }

  .nova-order-actions button.nova-view-order{

    display:flex!important;

    visibility:visible!important;

    opacity:1!important;

    width:100%!important;

    min-height:52px!important;

  }

  .nova-order-item{

    font-size:12px;

  }

  .nova-package-box{

    font-size:12px;

    width:100%!important;

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

  .admin-top-actions{

    flex-direction:column;

  }

  .admin-top-actions button{

    width:100%;

  }

}

`;


document.head.appendChild(
  novaStyle
);


/* =========================================================
   INIT
========================================================= */

renderCategories();

renderProducts();

renderCart();


/* =========================================================
   GLOBAL API
========================================================= */

window.NovaShop = {

  products,

  get cart() {
    return cartDetailed();
  },

  openCart,

  closeCart,

  openProduct,

  renderProducts,

  renderCart,

  openOrders,

  openAdmin,

  state() {

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
  "NovaShop chargé :",
  products.length,
  "produits"
);

console.log(
  "NovaShop images :",
  "URLs directes"
);

console.log(
  "NovaShop commandes :",
  "bouton Voir la commande actif"
);


/* =========================================================
   END
========================================================= */
