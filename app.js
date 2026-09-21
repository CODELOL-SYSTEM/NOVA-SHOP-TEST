// ============================================================
// NOVASHOP - APP.JS COMPLET
// Firebase Auth + Firestore
// ============================================================

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


// ============================================================
// FIREBASE
// ============================================================

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


// ============================================================
// CONFIGURATION
// ============================================================

const ADMIN_EMAIL = "pc2alex.les@gmail.com";
const ADMIN_CODE = "NOVA-ADMIN-2026";
const ADMIN_ACCESS_KEY = "novaAdminAuthorized";

const TEST_CARD_STORAGE_KEY = "novaTestCard";

const FALLBACK_IMAGE =
  "https://placehold.co/800x800/111827/ffffff?text=NovaShop";


// ============================================================
// DOM
// ============================================================

const $ = id => document.getElementById(id);

const searchInput = $("searchInput");
const categoriesEl = $("categories");
const productsGrid = $("productGrid");
const productCount = $("productCount");

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
const modalTitle = $("modalTitle");

const toastContainer = $("toast");

const heroCartBtn = $("heroCartBtn");
const sortSelect = $("sortSelect");


// ============================================================
// PRODUITS
// ============================================================

const products = [

  {
    id: "p1",
    name: "Gigabyte B650 AORUS Elite AX",
    category: "Composants",
    price: 189.99,
    image: "https://m.media-amazon.com/images/I/81JFKzNyl+L._AC_SL1500_.jpg"
  },

  {
    id: "p2",
    name: "PC Gamer AMD Ryzen 7 7800X3D | RX 9070 XT | 32 Go DDR5",
    category: "PC Gamer",
    price: 2237.65,
    image: "https://www.memorypc.fr/thumbnail/53/79/73/1786604635/019f8f1c2c6972a8a3ea1ee9516a0652_1784812416_800x800.png"
  },

  {
    id: "p3",
    name: "HyperX Cloud II",
    category: "Casques",
    price: 49.99,
    image: "https://fr.hyperx.com/cdn/shop/files/hyperx_cloud_ii_red_1_main.jpg?v=1764129756"
  },

  {
    id: "p4",
    name: "TECORS Clavier Gamer Mécanique 60% AZERTY",
    category: "Claviers",
    price: 30,
    image: "https://m.media-amazon.com/images/I/71-lhAU97VL._AC_SL1500_.jpg"
  },

  {
    id: "p5",
    name: "Clavier Magnétique 65% Celshading Noir",
    category: "Claviers",
    price: 120.90,
    image: "https://tryhard-gear.com/cdn/shop/files/TestCelshadingnoirV2.webp?v=1762273866&width=832"
  },

  {
    id: "p6",
    name: "Ajazz AJ199 MAX Carbon Fiber Wireless Gaming Mouse",
    category: "Souris",
    price: 49.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/S1e981b53ccfe4e1391cd5b5deb4fce87o.png_960x960.png_.avif"
  },

  {
    id: "p7",
    name: "Logitech G PRO X2 Superstrike Blanc et Noir",
    category: "Souris",
    price: 150.99,
    image: "https://static.fnac-static.com/multimedia/Images/FR/MDM/7a/34/bc/29111418/1540-1.jpg"
  },

  {
    id: "p8",
    name: "Samsung 990 PRO 1TB",
    category: "Stockage",
    price: 249.99,
    image: "https://content.pearl.fr/media/cache/default/article_ultralarge_high_nocrop/shared/images/articles/M/MW1/disque-dur-interne-ssd-990-pro-pcie-nvme-m-2-2280-1-to-ref_MW1148_2.jpg"
  },

  {
    id: "p9",
    name: "Samsung 990 PRO 2TB",
    category: "Stockage",
    price: 199.93,
    image: "https://pc.comparer.fr/500x500/310191422.webp"
  },

  {
    id: "p10",
    name: "CORSAIR RM1000x EU",
    category: "Alimentations",
    price: 159.90,
    image: "https://assets.corsair.com/image/upload/c_pad,q_85,h_608,w_608,f_auto/products/Power-Supply-Units/base-rmx-2024-config/gallery/black/1000/RM1000x_2024_01.webp"
  },

  {
    id: "p11",
    name: "CORSAIR RM850x EU",
    category: "Alimentations",
    price: 134.90,
    image: "https://assets.corsair.com/image/upload/c_pad,q_85,h_608,w_608,f_auto/products/Power-Supply-Units/base-rmx-2024-config/gallery/black/850/RM850x_2024_01.webp"
  },

  {
    id: "p12",
    name: "Corsair Frame 5000D RS ARGB Noir",
    category: "Boîtiers",
    price: 159.90,
    image: "https://media.ldlc.com/r1600/ld/products/00/06/26/05/LD0006260502.jpg"
  },

  {
    id: "p13",
    name: "ARCTIC Liquid Freezer III Pro 360 A-RGB Black",
    category: "Refroidissement",
    price: 129.90,
    image: "https://cdn.idealo.com/folder/Product/206182/0/206182034/s4_produktbild_gross/arctic-liquid-freezer-iii-pro-360-a-rgb-black.jpg"
  },

  {
    id: "p14",
    name: "Samsung 27 QD-OLED Odyssey G6",
    category: "Écrans",
    price: 399.95,
    image: "https://media.ldlc.com/r705/ld/products/00/06/32/99/LD0006329977.jpg"
  },

  {
    id: "p15",
    name: "ELGATO Wave Mic Arm Pro",
    category: "Streaming",
    price: 229.90,
    image: "https://www.digit-photo.com/images/produits/ELGATO10AAT9901/1.jpg"
  },

  {
    id: "p16",
    name: "Sony DualSense Cosmic Red PS5/PC",
    category: "Manettes",
    price: 74.90,
    image: "https://media.carrefour.fr/media/referential/media/cc07d7de4b9e4bea8c063e8f9bb46d94/p_200x200/0711719023005_0.jpg"
  },

  {
    id: "p17",
    name: "ASUS TUF Gaming B650-PLUS",
    category: "Composants",
    price: 179.90,
    image: "https://media.materiel.net/r550/products/MN0005986139.jpg"
  },

  {
    id: "p18",
    name: "MSI MAG B650 Tomahawk WiFi",
    category: "Composants",
    price: 189.90,
    image: "https://m.media-amazon.com/images/I/71TYAcZ4J8L._AC_SL1200_.jpg"
  },

  {
    id: "p19",
    name: "KOORUI Ecran PC Gamer 27 Pouces 200Hz IPS QHD HDR400 1ms",
    category: "Écrans",
    price: 74.99,
    image: "https://m.media-amazon.com/images/I/71CJ1DF-8sL._AC_SL1500_.jpg"
  },

  {
    id: "p20",
    name: 'iiyama 23.8" LED - G-Master GB2471HS-B1 Red Eagle',
    category: "Écrans",
    price: 65.99,
    image: "https://media.ldlc.com/r1600/ld/products/00/06/34/20/LD0006342033.jpg"
  },

  {
    id: "p21",
    name: "SONGMICS Chaise de jeu ergonomique avec repose-pieds 150 kg gris ardoise",
    category: "Chaises gaming",
    price: 129.99,
    image: "https://static.songmics.fr/fit-in/1000x1000/image/Product/B34OBG077G01/B34OBG077G01-1.jpg"
  },

  {
    id: "p22",
    name: "Dowinx Série Luxe Suède LS-66D68E Blanc",
    category: "Chaises gaming",
    price: 79.99,
    image: "https://eu.dowinx.com/cdn/shop/files/11_5f72b693-5f79-4d06-b48a-7cb2b2f0244a.png?v=1752139814&width=1220"
  },

  {
    id: "p23",
    name: "Chaise GTPLAYER Ergonomique Gaming Soutien Lombaire Repose-pieds",
    category: "Chaises gaming",
    price: 109.99,
    image: "https://thumb.pccomponentes.com/w-530-530/articles/1118/11186247/167-silla-gaming-gtplayer-ergonomica-con-reposapies-y-soporte-lumbar-4d.jpg"
  },

  {
    id: "p24",
    name: "Desk Lite - Height-Adjustable Desk",
    category: "Bureaux gaming",
    price: 110.99,
    image: "https://yaasa.com/cdn/shop/files/yaasa-desk-lite_nr01_black_100_01-04545-01_1200x.jpg?v=1753169928"
  },

  {
    id: "p25",
    name: "EUREKA ERGONOMIC Bureau Gaming LED 182x76cm en Forme d'Aile",
    category: "Bureaux gaming",
    price: 86.99,
    image: "https://m.media-amazon.com/images/I/71Gd5G3wRsL._AC_SL1500_.jpg"
  },

  {
    id: "p26",
    name: "Bureau gaming d’angle HOMCOM réversible support écran",
    category: "Bureaux gaming",
    price: 44.99,
    image: "https://cdn.manomano.com/pim-media/images/medium/74eca1cb1cefa063c8f600ee293ae6ee826794f8.jpg"
  },

  {
    id: "p27",
    name: "Logitech G Pro X 2 Lightspeed Noir + Repose casque",
    category: "Casques",
    price: 99.99,
    image: "https://static.fnac-static.com/multimedia/Images/FR/MDMFR/MDM/6d/e9/6e/24045933/1540-1/tsp20260429154901/Casque-PC-gaming-sans-fil-Logitech-G-Pro-X-2-Lightspeed-Noir-Repose-casque.jpg"
  },

  {
    id: "p28",
    name: "Razer BlackShark V2 Pro 2023 Noir",
    category: "Casques",
    price: 75.99,
    image: "https://media.ldlc.com/r1600/ld/products/00/06/07/71/LD0006077125.jpg"
  },

  {
    id: "p29",
    name: "beyerdynamic DT-990 Pro 250 Ohm",
    category: "Casques",
    price: 60.99,
    image: "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_10/106865/18443258_800.jpg"
  },

  {
    id: "p30",
    name: "Logitech PRO X TKL Rapid Noir, filaire AZERTY",
    category: "Claviers",
    price: 78.99,
    image: "https://static.fnac-static.com/multimedia/Images/FR/MDM/6a/89/8f/26184042/1540-1.jpg"
  },

  {
    id: "p31",
    name: "QwertyKey75 HE Striker, Magnetic Hall Effect, Rapid Trigger, Snap Tap",
    category: "Claviers",
    price: 56.99,
    image: "https://cdn.shopify.com/s/files/1/0814/2530/1746/files/QK75-HE-STRIKER-qwertykey-tastatura-mecanica-gaming-hotswap-2025_1eee355b-72ca-46e6-a458-751384d0595c_1800x.webp?v=1771799537"
  },

  {
    id: "p32",
    name: "GravaStar Mercury K1 Clavier Gamer sans Fil en Aluminium, Noir Dégradé",
    category: "Claviers",
    price: 91.99,
    image: "https://m.media-amazon.com/images/I/6144lt2l5JL._AC_SL1200_.jpg"
  },

  {
    id: "p33",
    name: "ATTACK SHARK R11 Ultra, fibre de carbone, 8000Hz, 49g, 42000 DPI",
    category: "Souris",
    price: 26.99,
    image: "https://m.media-amazon.com/images/I/71bMz15SqcL._AC_SL1500_.jpg"
  },

  {
    id: "p34",
    name: "HyperX QuadCast 2 – Microphone USB – RGB",
    category: "Microphones",
    price: 98.99,
    image: "https://fr.hyperx.com/cdn/shop/files/hyperx_quadcast_2_872v1aa_main_1_2d47a555-f537-457b-9002-8b9e9010dc00.jpg?v=1763067608"
  },

  {
    id: "p35",
    name: "Shure SM7 dB",
    category: "Microphones",
    price: 121.99,
    image: "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_57/573672/18492412_800.jpg"
  },

  {
    id: "p36",
    name: "Razer Seiren V3 Chroma Noir",
    category: "Microphones",
    price: 13.99,
    image: "https://media.ldlc.com/r1600/ld/products/00/06/13/25/LD0006132588.jpg"
  },

  {
    id: "p37",
    name: "Stairville LED Pixel Rail 40 RGB MKII",
    category: "Éclairage RGB",
    price: 18.90,
    image: "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_44/449739/14448905_800.jpg"
  },

  {
    id: "p38",
    name: "Govee LED Strip Light RGBIC Wi-Fi + Bluetooth 5m Matter",
    category: "Éclairage RGB",
    price: 8,
    image: "https://static.fnac-static.com/multimedia/Images/FR/MDM/ab/7a/9d/27097771/1520-2/tsp20260429155350/Ruban-LED-Govee-LED-Strip-Light-RGBIC-Wi-Fi-avec-BT-5M-Matter.jpg"
  },

  {
    id: "p39",
    name: "Lampe de plafond hexagone nid d’abeille LED 2.4m x 4.8m contour bleu",
    category: "Éclairage RGB",
    price: 91.10,
    image: "https://www.discount-autosport.com/wp-content/webp-express/webp-images/uploads/2025/02/lampe-hexagone-plafond-led-4m80-contour-bleu-.jpg.webp"
  },

  {
    id: "p40",
    name: "GIGABYTE GeForce RTX 5050 WINDFORCE OC 8G",
    category: "Cartes graphiques",
    price: 147,
    image: "https://m.media-amazon.com/images/I/41kmHFMFPOL._SL500_.jpg"
  },

  {
    id: "p41",
    name: "MSI GeForce RTX 3050 LP E 6G OC",
    category: "Cartes graphiques",
    price: 100,
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTCe_rha_tAAHPWnQ8VV7GIvF-uSqUaEyU61TSnwgM4CK8g3-x_3Hq4wOgH36Ri63eAiWHsvhmRJHzVrUQR9-IwMx31WH0w"
  },

  {
    id: "p42",
    name: "ASUS Dual Radeon RX 7600 EVO OC Edition 8GB GDDR6",
    category: "Cartes graphiques",
    price: 140,
    image: "https://m.media-amazon.com/images/I/81QItJufypL._AC_SL1500_.jpg"
  },

  {
    id: "p43",
    name: "PC Gamer Fixe, Ryzen 7 5700G, Vega 8, 16G DDR4, 1T SSD",
    category: "PC Gamer",
    price: 650,
    image: "https://m.media-amazon.com/images/I/81M3iU5S4QL._AC_SL1500_.jpg",
    new: true
  }

];


// ============================================================
// ÉTAT
// ============================================================

let currentUser = null;
let selectedCategory = "Tous";
let searchValue = "";
let sortValue = "default";
let cart = [];
let reviewsCache = {};

try {
  cart = JSON.parse(localStorage.getItem("novaCart") || "[]");

  if (!Array.isArray(cart)) {
    cart = [];
  }
} catch {
  cart = [];
}


// ============================================================
// OUTILS
// ============================================================

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function money(value) {
  return Number(value || 0).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR"
  });
}


function getProduct(id) {
  return products.find(product => product.id === id);
}


function saveCart() {
  localStorage.setItem("novaCart", JSON.stringify(cart));
}


function getCartCount() {
  return cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );
}


function getCartSubtotal() {
  return cart.reduce((total, item) => {

    const product = getProduct(item.id);

    if (!product) {
      return total;
    }

    return total +
      product.price *
      Number(item.quantity || 1);

  }, 0);
}


function toast(message, type = "info") {

  if (!toastContainer) {
    return;
  }

  const element = document.createElement("div");

  element.className =
    `toast-message ${type}`;

  element.textContent = message;

  toastContainer.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, 3500);
}


// ============================================================
// MODAL
// ============================================================

function showModal(title, html) {

  if (!modal || !modalContent) {
    return;
  }

  if (modalTitle) {
    modalTitle.textContent = title;
  }

  modalContent.innerHTML = html;

  modal.classList.add("open");

  modal.style.display = "flex";
}


function closeModal() {

  if (!modal) {
    return;
  }

  modal.classList.remove("open");

  modal.style.display = "none";
}


modalClose?.addEventListener(
  "click",
  closeModal
);

modal?.addEventListener(
  "click",
  event => {

    if (event.target === modal) {
      closeModal();
    }

  }
);


// ============================================================
// CATEGORIES
// ============================================================

function renderCategories() {

  if (!categoriesEl) {
    return;
  }

  const categories = [
    "Tous",
    ...new Set(
      products.map(product => product.category)
    )
  ];

  categoriesEl.innerHTML =
    categories.map(category => `
      <button
        type="button"
        class="category-btn ${
          selectedCategory === category
            ? "active"
            : ""
        }"
        data-category="${escapeHTML(category)}"
      >
        ${escapeHTML(category)}
      </button>
    `).join("");

  categoriesEl
    .querySelectorAll(".category-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          selectedCategory =
            button.dataset.category ||
            "Tous";

          renderCategories();
          renderProducts();

        }
      );

    });
}


// ============================================================
// FILTRAGE
// ============================================================

function getFilteredProducts() {

  let result = [...products];

  if (selectedCategory !== "Tous") {

    result =
      result.filter(
        product =>
          product.category ===
          selectedCategory
      );

  }

  if (searchValue.trim()) {

    const search =
      searchValue
        .trim()
        .toLowerCase();

    result =
      result.filter(product =>
        product.name
          .toLowerCase()
          .includes(search)
        ||
        product.category
          .toLowerCase()
          .includes(search)
      );

  }

  if (sortValue === "priceAsc") {

    result.sort(
      (a, b) =>
        a.price - b.price
    );

  }

  if (sortValue === "priceDesc") {

    result.sort(
      (a, b) =>
        b.price - a.price
    );

  }

  if (sortValue === "name") {

    result.sort(
      (a, b) =>
        a.name.localeCompare(
          b.name,
          "fr"
        )
    );

  }

  return result;
}


// ============================================================
// PRODUITS
// ============================================================

function renderProducts() {

  if (!productsGrid) {
    return;
  }

  const result =
    getFilteredProducts();

  if (productCount) {

    productCount.textContent =
      `${result.length} produit${
        result.length > 1 ? "s" : ""
      }`;

  }

  if (!result.length) {

    productsGrid.innerHTML = `
      <div style="
        grid-column:1/-1;
        padding:50px;
        text-align:center;
        color:var(--muted);
      ">
        Aucun produit trouvé.
      </div>
    `;

    return;
  }

  productsGrid.innerHTML =
    result.map(product => {

      const favorite =
        isFavorite(product.id);

      return `
        <article
          class="product-card"
          data-id="${escapeHTML(product.id)}"
        >

          <div
            class="product-image-wrap"
            style="
              width:100%;
              height:145px;
              min-height:145px;
              max-height:145px;
              display:flex;
              align-items:center;
              justify-content:center;
              overflow:hidden;
              border-radius:14px;
              background:rgba(255,255,255,.035);
            "
          >

            <img
              src="${escapeHTML(product.image)}"
              alt="${escapeHTML(product.name)}"
              loading="lazy"
              style="
                width:auto;
                height:auto;
                max-width:82%;
                max-height:125px;
                object-fit:contain;
                display:block;
              "
              onerror="
                this.onerror=null;
                this.src='${FALLBACK_IMAGE}';
              "
            >

            ${
              product.new
                ? `
                  <span
                    style="
                      position:absolute;
                      top:10px;
                      left:10px;
                      padding:5px 8px;
                      border-radius:8px;
                      background:#25d695;
                      color:#04100b;
                      font-size:11px;
                      font-weight:800;
                    "
                  >
                    NOUVEAU
                  </span>
                `
                : ""
            }

          </div>


          <div
            class="product-card-content"
            style="
              padding:12px;
            "
          >

            <div
              style="
                color:var(--muted);
                font-size:11px;
                margin-bottom:5px;
              "
            >
              ${escapeHTML(product.category)}
            </div>


            <h3
              style="
                font-size:14px;
                line-height:1.35;
                min-height:38px;
                margin:0;
              "
            >
              ${escapeHTML(product.name)}
            </h3>


            <div
              style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:8px;
                margin-top:11px;
              "
            >

              <strong
                style="
                  font-size:17px;
                "
              >
                ${money(product.price)}
              </strong>


              <button
                type="button"
                class="favorite-btn"
                data-favorite="${escapeHTML(product.id)}"
                title="Favoris"
                style="
                  width:32px;
                  height:32px;
                  padding:0;
                  border-radius:9px;
                "
              >
                ${favorite ? "❤️" : "♡"}
              </button>

            </div>


            <div
              style="
                display:grid;
                grid-template-columns:1fr;
                gap:7px;
                margin-top:10px;
              "
            >

              <button
                type="button"
                class="add-btn"
                data-add="${escapeHTML(product.id)}"
                style="
                  width:100%;
                  padding:9px 10px;
                  font-size:13px;
                "
              >
                Ajouter
              </button>


              <button
                type="button"
                class="view-btn"
                data-view="${escapeHTML(product.id)}"
                style="
                  width:100%;
                  padding:8px 10px;
                  font-size:12px;
                "
              >
                Voir le produit
              </button>

            </div>

          </div>

        </article>
      `;

    }).join("");


  productsGrid
    .querySelectorAll("[data-add]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          addToCart(
            button.dataset.add
          );

        }
      );

    });


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
    .querySelectorAll("[data-favorite]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          toggleFavorite(
            button.dataset.favorite
          );

        }
      );

    });

}


// ============================================================
// FAVORIS
// ============================================================

function getFavorites() {

  try {

    const value =
      JSON.parse(
        localStorage.getItem(
          "novaFavorites"
        ) || "[]"
      );

    return Array.isArray(value)
      ? value
      : [];

  } catch {

    return [];

  }
}


function isFavorite(id) {

  return getFavorites()
    .includes(id);

}


function toggleFavorite(id) {

  let favorites =
    getFavorites();

  if (favorites.includes(id)) {

    favorites =
      favorites.filter(
        item => item !== id
      );

    toast(
      "Retiré des favoris",
      "info"
    );

  } else {

    favorites.push(id);

    toast(
      "Ajouté aux favoris ❤️",
      "success"
    );

  }

  localStorage.setItem(
    "novaFavorites",
    JSON.stringify(favorites)
  );

  renderProducts();
}


// ============================================================
// PANIER
// ============================================================

function addToCart(id) {

  const product =
    getProduct(id);

  if (!product) {
    return;
  }

  const existing =
    cart.find(
      item => item.id === id
    );

  if (existing) {

    existing.quantity =
      Number(existing.quantity || 1) + 1;

  } else {

    cart.push({
      id,
      quantity: 1
    });

  }

  saveCart();
  renderCart();

  toast(
    `${product.name} ajouté au panier 🛒`,
    "success"
  );
}


function removeFromCart(id) {

  cart =
    cart.filter(
      item => item.id !== id
    );

  saveCart();
  renderCart();

}


function changeCartQuantity(id, change) {

  const item =
    cart.find(
      element => element.id === id
    );

  if (!item) {
    return;
  }

  item.quantity =
    Number(item.quantity || 1) +
    Number(change || 0);

  if (item.quantity <= 0) {

    removeFromCart(id);
    return;

  }

  saveCart();
  renderCart();
}


function renderCart() {

  if (cartBadge) {

    cartBadge.textContent =
      getCartCount();

  }

  if (!cartItems) {
    return;
  }

  const validCart =
    cart.filter(
      item => getProduct(item.id)
    );

  if (validCart.length !== cart.length) {

    cart = validCart;

    saveCart();

  }

  if (!cart.length) {

    cartItems.innerHTML = `
      <div style="
        text-align:center;
        padding:35px 10px;
        color:var(--muted);
      ">
        🛒<br>
        Ton panier est vide.
      </div>
    `;

    if (cartTotal) {
      cartTotal.textContent =
        money(0);
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = true;
    }

    return;
  }

  cartItems.innerHTML =
    cart.map(item => {

      const product =
        getProduct(item.id);

      const quantity =
        Number(item.quantity || 1);

      return `
        <div
          style="
            display:grid;
            grid-template-columns:58px 1fr;
            gap:10px;
            padding:10px 0;
            border-bottom:1px solid var(--line);
          "
        >

          <div
            style="
              width:58px;
              height:58px;
              border-radius:10px;
              overflow:hidden;
              background:rgba(255,255,255,.04);
              display:flex;
              align-items:center;
              justify-content:center;
            "
          >
            <img
              src="${escapeHTML(product.image)}"
              alt=""
              style="
                max-width:90%;
                max-height:90%;
                object-fit:contain;
              "
              onerror="
                this.onerror=null;
                this.src='${FALLBACK_IMAGE}';
              "
            >
          </div>


          <div>

            <div
              style="
                font-weight:700;
                font-size:13px;
                line-height:1.3;
              "
            >
              ${escapeHTML(product.name)}
            </div>


            <div
              style="
                color:var(--muted);
                margin-top:3px;
                font-size:12px;
              "
            >
              ${money(product.price)}
            </div>


            <div
              style="
                display:flex;
                align-items:center;
                gap:7px;
                margin-top:7px;
              "
            >

              <button
                type="button"
                class="view-btn"
                data-minus="${escapeHTML(product.id)}"
                style="
                  width:27px;
                  height:27px;
                  padding:0;
                "
              >
                −
              </button>

              <strong>
                ${quantity}
              </strong>

              <button
                type="button"
                class="view-btn"
                data-plus="${escapeHTML(product.id)}"
                style="
                  width:27px;
                  height:27px;
                  padding:0;
                "
              >
                +
              </button>

              <button
                type="button"
                class="view-btn"
                data-remove="${escapeHTML(product.id)}"
                style="
                  margin-left:auto;
                  padding:6px 8px;
                  font-size:11px;
                "
              >
                Supprimer
              </button>

            </div>

          </div>

        </div>
      `;

    }).join("");


  cartItems
    .querySelectorAll("[data-minus]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          changeCartQuantity(
            button.dataset.minus,
            -1
          )
      );

    });


  cartItems
    .querySelectorAll("[data-plus]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          changeCartQuantity(
            button.dataset.plus,
            1
          )
      );

    });


  cartItems
    .querySelectorAll("[data-remove]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          removeFromCart(
            button.dataset.remove
          )
      );

    });


  if (cartTotal) {

    cartTotal.textContent =
      money(getCartSubtotal());

  }

  if (checkoutBtn) {

    checkoutBtn.disabled =
      cart.length === 0;

  }

}


function openCart() {

  cartOverlay?.classList.add("open");
  cartDrawer?.classList.add("open");

  if (cartOverlay) {
    cartOverlay.style.display = "block";
  }

  if (cartDrawer) {
    cartDrawer.style.display = "block";
  }

  renderCart();
}


function closeCart() {

  cartOverlay?.classList.remove("open");
  cartDrawer?.classList.remove("open");

  if (cartOverlay) {
    cartOverlay.style.display = "none";
  }

  if (cartDrawer) {
    cartDrawer.style.display = "none";
  }

}


cartBtn?.addEventListener(
  "click",
  openCart
);

heroCartBtn?.addEventListener(
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


// ============================================================
// PRODUIT
// ============================================================

function openProduct(id) {

  const product =
    getProduct(id);

  if (!product) {
    return;
  }

  showModal(
    product.name,
    `
      <div>

        <div
          style="
            height:260px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:rgba(255,255,255,.035);
            border-radius:18px;
            overflow:hidden;
          "
        >
          <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            style="
              max-width:82%;
              max-height:235px;
              object-fit:contain;
            "
            onerror="
              this.onerror=null;
              this.src='${FALLBACK_IMAGE}';
            "
          >
        </div>


        <div
          style="
            margin-top:18px;
            color:var(--muted);
          "
        >
          ${escapeHTML(product.category)}
        </div>


        <div
          style="
            font-size:25px;
            font-weight:800;
            margin-top:7px;
          "
        >
          ${money(product.price)}
        </div>


        <div
          style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            margin-top:18px;
          "
        >

          <button
            type="button"
            class="add-btn"
            id="modalAddProduct"
          >
            Ajouter au panier
          </button>

          <button
            type="button"
            class="view-btn"
            id="modalReviews"
          >
            ⭐ Avis
          </button>

        </div>

      </div>
    `
  );


  $("modalAddProduct")
    ?.addEventListener(
      "click",
      () => {

        addToCart(product.id);
        closeModal();

      }
    );


  $("modalReviews")
    ?.addEventListener(
      "click",
      () =>
        openProductReviews(
          product.id
        )
    );

}


function openProductReviews(id) {

  const product =
    getProduct(id);

  if (!product) {
    return;
  }

  const reviews =
    reviewsCache[id] || [];

  const reviewsHTML =
    reviews.length
      ? reviews.map(review => `
          <div
            style="
              padding:13px 0;
              border-bottom:1px solid var(--line);
            "
          >
            <strong>
              ${escapeHTML(review.name || "Client")}
            </strong>

            <div style="margin-top:4px">
              ${"⭐".repeat(
                Math.max(
                  1,
                  Math.min(
                    5,
                    Number(review.rating || 5)
                  )
                )
              )}
            </div>

            <p
              style="
                color:var(--muted);
                margin-top:6px;
              "
            >
              ${escapeHTML(review.text || "")}
            </p>
          </div>
        `).join("")
      : `
        <p
          style="
            color:var(--muted);
            padding:15px 0;
          "
        >
          Aucun avis pour le moment.
        </p>
      `;


  showModal(
    `Avis • ${product.name}`,
    `
      <div>

        ${reviewsHTML}

        <form
          id="reviewForm"
          style="
            margin-top:18px;
          "
        >

          <label for="reviewRating">
            Note
          </label>

          <select
            id="reviewRating"
            required
          >
            <option value="5">5 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="1">1 ⭐</option>
          </select>


          <label
            for="reviewText"
            style="
              margin-top:12px;
            "
          >
            Avis
          </label>

          <textarea
            id="reviewText"
            required
            maxlength="500"
            placeholder="Ton avis..."
            style="
              min-height:100px;
              resize:vertical;
            "
          ></textarea>


          <button
            type="submit"
            class="add-btn"
            style="
              width:100%;
              margin-top:12px;
            "
          >
            Publier mon avis
          </button>

        </form>

      </div>
    `
  );


  $("reviewForm")
    ?.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        const rating =
          Number(
            $("reviewRating")?.value || 5
          );

        const text =
          $("reviewText")?.value.trim() || "";

        if (!text) {
          return;
        }

        const name =
          currentUser?.email
            ? currentUser.email
                .split("@")[0]
                .slice(0, 3) + "***"
            : "Client";

        try {

          await addDoc(
            collection(db, "reviews"),
            {
              productId: product.id,
              name,
              rating,
              text,
              createdAt:
                serverTimestamp()
            }
          );

          toast(
            "Avis publié ⭐",
            "success"
          );

          closeModal();

        } catch(error) {

          console.error(error);

          toast(
            "Impossible de publier l'avis.",
            "error"
          );

        }

      }
    );

}


// ============================================================
// AUTH
// ============================================================

function authError(error) {

  const code =
    error?.code || "";

  const errors = {

    "auth/invalid-credential":
      "E-mail ou mot de passe incorrect.",

    "auth/invalid-email":
      "Adresse e-mail invalide.",

    "auth/email-already-in-use":
      "Cette adresse e-mail est déjà utilisée.",

    "auth/weak-password":
      "Le mot de passe doit contenir au moins 6 caractères.",

    "auth/user-not-found":
      "Compte introuvable.",

    "auth/wrong-password":
      "Mot de passe incorrect."

  };

  return errors[code] ||
    "Une erreur est survenue.";
}


function showLoginForm() {

  showModal(
    "Connexion",
    `
      <form id="loginForm">

        <label for="loginEmail">
          Adresse e-mail
        </label>

        <input
          id="loginEmail"
          type="email"
          autocomplete="email"
          required
          placeholder="ton@email.com"
        >


        <label
          for="loginPassword"
          style="
            margin-top:14px;
          "
        >
          Mot de passe
        </label>

        <input
          id="loginPassword"
          type="password"
          autocomplete="current-password"
          required
          placeholder="Ton mot de passe"
        >


        <div
          id="loginError"
          style="
            display:none;
            margin-top:12px;
            color:#ff7777;
          "
        ></div>


        <button
          type="submit"
          class="add-btn"
          id="loginSubmit"
          style="
            width:100%;
            margin-top:16px;
          "
        >
          Se connecter
        </button>


        <button
          type="button"
          class="view-btn"
          id="goRegister"
          style="
            width:100%;
            margin-top:10px;
          "
        >
          Créer un compte
        </button>

      </form>
    `
  );


  $("loginForm")
    ?.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        const email =
          $("loginEmail")
            ?.value.trim() || "";

        const password =
          $("loginPassword")
            ?.value || "";

        const errorBox =
          $("loginError");

        const submit =
          $("loginSubmit");

        if (submit) {

          submit.disabled = true;
          submit.textContent =
            "Connexion...";

        }

        try {

          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          closeModal();

          toast(
            "Connexion réussie 👋",
            "success"
          );

        } catch(error) {

          if (errorBox) {

            errorBox.textContent =
              authError(error);

            errorBox.style.display =
              "block";

          }

        } finally {

          if (submit) {

            submit.disabled = false;
            submit.textContent =
              "Se connecter";

          }

        }

      }
    );


  $("goRegister")
    ?.addEventListener(
      "click",
      showRegisterForm
    );

}


function showRegisterForm() {

  showModal(
    "Créer un compte",
    `
      <form id="registerForm">

        <label for="registerEmail">
          Adresse e-mail
        </label>

        <input
          id="registerEmail"
          type="email"
          required
          placeholder="ton@email.com"
        >


        <label
          for="registerPassword"
          style="
            margin-top:14px;
          "
        >
          Mot de passe
        </label>

        <input
          id="registerPassword"
          type="password"
          minlength="6"
          required
          placeholder="Minimum 6 caractères"
        >


        <label
          for="registerPassword2"
          style="
            margin-top:14px;
          "
        >
          Confirmer le mot de passe
        </label>

        <input
          id="registerPassword2"
          type="password"
          minlength="6"
          required
          placeholder="Retape ton mot de passe"
        >


        <div
          id="registerError"
          style="
            display:none;
            margin-top:12px;
            color:#ff7777;
          "
        ></div>


        <button
          type="submit"
          class="add-btn"
          id="registerSubmit"
          style="
            width:100%;
            margin-top:16px;
          "
        >
          Créer mon compte
        </button>


        <button
          type="button"
          class="view-btn"
          id="goLogin"
          style="
            width:100%;
            margin-top:10px;
          "
        >
          J'ai déjà un compte
        </button>

      </form>
    `
  );


  $("registerForm")
    ?.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        const email =
          $("registerEmail")
            ?.value.trim() || "";

        const password =
          $("registerPassword")
            ?.value || "";

        const password2 =
          $("registerPassword2")
            ?.value || "";

        const errorBox =
          $("registerError");


        if (password !== password2) {

          if (errorBox) {

            errorBox.textContent =
              "Les deux mots de passe sont différents.";

            errorBox.style.display =
              "block";

          }

          return;
        }


        const submit =
          $("registerSubmit");

        if (submit) {

          submit.disabled = true;
          submit.textContent =
            "Création...";

        }


        try {

          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          closeModal();

          toast(
            "Compte créé avec succès 🎉",
            "success"
          );

        } catch(error) {

          if (errorBox) {

            errorBox.textContent =
              authError(error);

            errorBox.style.display =
              "block";

          }

        } finally {

          if (submit) {

            submit.disabled = false;
            submit.textContent =
              "Créer mon compte";

          }

        }

      }
    );


  $("goLogin")
    ?.addEventListener(
      "click",
      showLoginForm
    );

}


accountBtn?.addEventListener(
  "click",
  openAccount
);


// ============================================================
// COMPTE
// ============================================================

function openAccount() {

  if (!currentUser) {

    showLoginForm();
    return;

  }

  const email =
    currentUser.email || "";

  const username =
    email.split("@")[0] ||
    "Compte";


  showModal(
    "Mon compte",
    `
      <div>

        <div
          style="
            padding:16px;
            border-radius:16px;
            background:rgba(80,120,255,.08);
          "
        >

          <div
            style="
              font-size:20px;
              font-weight:800;
            "
          >
            👤 ${escapeHTML(username)}
          </div>

          <div
            style="
              color:var(--muted);
              margin-top:5px;
            "
          >
            ${escapeHTML(email)}
          </div>

        </div>


        <button
          type="button"
          class="add-btn"
          id="accountOrders"
          style="
            width:100%;
            margin-top:14px;
          "
        >
          📦 Mes commandes
        </button>


        <button
          type="button"
          class="view-btn"
          id="accountLogout"
          style="
            width:100%;
            margin-top:10px;
          "
        >
          Se déconnecter
        </button>

      </div>
    `
  );


  $("accountOrders")
    ?.addEventListener(
      "click",
      openOrders
    );


  $("accountLogout")
    ?.addEventListener(
      "click",
      async () => {

        try {

          await signOut(auth);

          closeModal();

          toast(
            "Déconnexion réussie.",
            "success"
          );

        } catch(error) {

          console.error(error);

        }

      }
    );

}


// ============================================================
// COMMANDES
// ============================================================

async function getUserOrders() {

  if (!currentUser) {
    return [];
  }

  const q =
    query(
      collection(db, "orders"),
      where(
        "userId",
        "==",
        currentUser.uid
      )
    );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    item => ({
      id: item.id,
      ...item.data()
    })
  );
}


async function openOrders() {

  if (!currentUser) {

    showLoginForm();
    return;

  }

  showModal(
    "Mes commandes",
    `
      <div
        id="ordersContent"
        style="
          min-height:100px;
        "
      >
        Chargement...
      </div>
    `
  );


  try {

    const orders =
      await getUserOrders();

    const content =
      $("ordersContent");

    if (!content) {
      return;
    }


    if (!orders.length) {

      content.innerHTML = `
        <div
          style="
            text-align:center;
            padding:30px 10px;
            color:var(--muted);
          "
        >
          📦<br><br>
          Tu n'as encore aucune commande.
        </div>
      `;

      return;

    }


    orders.sort(
      (a, b) =>
        Number(
          b.createdAt?.seconds || 0
        ) -
        Number(
          a.createdAt?.seconds || 0
        )
    );


    content.innerHTML =
      orders.map(order => `
        <button
          type="button"
          class="view-btn order-open-btn"
          data-order="${escapeHTML(order.id)}"
          style="
            width:100%;
            text-align:left;
            margin-bottom:10px;
            padding:14px;
          "
        >

          <div
            style="
              display:flex;
              justify-content:space-between;
              gap:10px;
            "
          >

            <strong>
              Commande #${escapeHTML(
                order.id.slice(0,8)
              )}
            </strong>

            <strong>
              ${money(order.total || 0)}
            </strong>

          </div>


          <div
            style="
              color:var(--muted);
              margin-top:5px;
            "
          >
            ${escapeHTML(
              order.status ||
              "Enregistrée"
            )}
          </div>

        </button>
      `).join("");


    content
      .querySelectorAll(".order-open-btn")
      .forEach(button => {

        const order =
          orders.find(
            item =>
              item.id ===
              button.dataset.order
          );

        button.addEventListener(
          "click",
          () => openOrderDetails(order)
        );

      });

  } catch(error) {

    console.error(error);

    $("ordersContent").innerHTML = `
      <p style="color:#ff7777">
        Impossible de charger les commandes.
      </p>
    `;

  }

}


ordersBtn?.addEventListener(
  "click",
  openOrders
);


// ============================================================
// DÉTAIL COMMANDE
// ============================================================

function openOrderDetails(order) {

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];


  const status =
    order.status ||
    "Enregistrée";


  const timeline = [
    "Enregistrée",
    "Acceptée",
    "Préparation",
    "En transit",
    "Livraison proche",
    "Livrée"
  ];


  const currentIndex =
    timeline.indexOf(status);


  const productsHTML =
    items.map(item => {

      const product =
        getProduct(item.id);

      const name =
        product?.name ||
        item.name ||
        "Produit";

      const price =
        Number(
          product?.price ??
          item.price ??
          0
        );

      const quantity =
        Number(
          item.quantity || 1
        );


      return `
        <div
          style="
            display:flex;
            justify-content:space-between;
            gap:12px;
            padding:10px 0;
            border-bottom:1px solid var(--line);
          "
        >

          <span>
            ${escapeHTML(name)}
            × ${quantity}
          </span>

          <strong>
            ${money(
              price * quantity
            )}
          </strong>

        </div>
      `;

    }).join("");


  const timelineHTML =
    status === "Annulée"
      ? `
        <div
          style="
            padding:12px;
            border-radius:12px;
            background:rgba(255,60,60,.12);
            color:#ff7777;
          "
        >
          ❌ Commande annulée
        </div>
      `
      :
      timeline.map(
        (step, index) => {

          const active =
            currentIndex >= index;

          return `
            <div
              class="timeline-step ${
                active
                  ? "active"
                  : ""
              }"
            >
              <span>
                ${active ? "●" : "○"}
              </span>

              <span>
                ${step}
              </span>
            </div>
          `;

        }
      ).join("");


  showModal(
    `Commande #${order.id.slice(0,8)}`,
    `
      <div>

        <div
          style="
            padding:16px;
            border-radius:16px;
            background:rgba(80,120,255,.08);
            margin-bottom:18px;
          "
        >

          <strong>
            Statut :
            ${escapeHTML(status)}
          </strong>


          ${
            order.tracking
              ? `
                <div
                  style="
                    margin-top:8px;
                  "
                >
                  Suivi :
                  ${escapeHTML(
                    order.tracking
                  )}
                </div>
              `
              : ""
          }


          ${
            order.city
              ? `
                <div
                  style="
                    margin-top:8px;
                  "
                >
                  📍 Ville :
                  ${escapeHTML(
                    order.city
                  )}
                </div>
              `
              : ""
          }


          ${
            order.estimatedDelivery
              ? `
                <div
                  style="
                    margin-top:8px;
                  "
                >
                  Livraison estimée :
                  ${escapeHTML(
                    order.estimatedDelivery
                  )}
                </div>
              `
              : ""
          }

        </div>


        <h3>
          Suivi
        </h3>


        <div
          style="
            margin:12px 0 20px;
          "
        >
          ${timelineHTML}
        </div>


        <h3>
          Produits
        </h3>


        <div
          style="
            margin:10px 0 20px;
          "
        >
          ${productsHTML}
        </div>


        ${
          order.address
            ? `
              <h3>
                Livraison
              </h3>

              <p
                style="
                  margin:8px 0 20px;
                  color:var(--muted);
                "
              >
                ${escapeHTML(
                  order.address
                )}
              </p>
            `
            : ""
        }


        <div
          style="
            display:flex;
            justify-content:space-between;
            font-size:20px;
            padding-top:15px;
            border-top:1px solid var(--line);
          "
        >

          <strong>
            Total
          </strong>

          <strong>
            ${money(
              order.total || 0
            )}
          </strong>

        </div>


        <button
          type="button"
          class="add-btn"
          id="invoiceBtn"
          style="
            width:100%;
            margin-top:18px;
          "
        >
          🧾 Voir la facture
        </button>

      </div>
    `
  );


  $("invoiceBtn")
    ?.addEventListener(
      "click",
      () => printInvoice(order)
    );

}


// ============================================================
// FACTURE
// ============================================================

function printInvoice(order) {

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];


  const rows =
    items.map(item => {

      const product =
        getProduct(item.id);

      const name =
        product?.name ||
        item.name ||
        "Produit";

      const price =
        Number(
          product?.price ??
          item.price ??
          0
        );

      const quantity =
        Number(
          item.quantity || 1
        );


      return `
        <tr>
          <td>
            ${escapeHTML(name)}
          </td>

          <td>
            ${quantity}
          </td>

          <td>
            ${money(
              price * quantity
            )}
          </td>
        </tr>
      `;

    }).join("");


  const invoice =
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );


  if (!invoice) {

    toast(
      "La facture n'a pas pu être ouverte.",
      "error"
    );

    return;

  }


  invoice.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">

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

        table{
          width:100%;
          border-collapse:collapse;
          margin-top:30px;
        }

        th,td{
          padding:12px;
          border-bottom:1px solid #ddd;
          text-align:left;
        }

        .total{
          text-align:right;
          margin-top:30px;
          font-size:24px;
          font-weight:bold;
        }

      </style>
    </head>

    <body>

      <h1>
        NovaShop
      </h1>

      <p>
        Facture commande #${escapeHTML(
          order.id
        )}
      </p>

      <p>
        ${escapeHTML(
          currentUser?.email || ""
        )}
      </p>

      <table>

        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>

      </table>

      <div class="total">
        Total :
        ${money(order.total || 0)}
      </div>

      <script>
        window.onload = () => {
          window.print();
        };
      <\/script>

    </body>
    </html>
  `);

  invoice.document.close();

}


// ============================================================
// CARTE LOCALE POUR LE SITE
// ============================================================

function getTestCard() {

  try {

    const raw =
      localStorage.getItem(
        TEST_CARD_STORAGE_KEY
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed.number !== "string" ||
      typeof parsed.expiry !== "string" ||
      typeof parsed.cvv !== "string" ||
      typeof parsed.holder !== "string"
    ) {

      return null;

    }

    return parsed;

  } catch {

    return null;

  }

}


function generateTestCard() {

  const digits =
    Array.from(
      { length: 12 },
      () =>
        Math.floor(
          Math.random() * 10
        )
    ).join("");


  const number =
    `9999 ${digits.slice(0,4)} ${digits.slice(4,8)} ${digits.slice(8,12)}`;


  const month =
    String(
      Math.floor(
        Math.random() * 12
      ) + 1
    ).padStart(2, "0");


  const year =
    String(
      new Date().getFullYear() +
      Math.floor(
        Math.random() * 5
      ) +
      1
    ).slice(-2);


  const cvv =
    String(
      Math.floor(
        Math.random() * 900
      ) + 100
    );


  const card = {
    number,
    holder: "NOVASHOP CARD",
    expiry: `${month}/${year}`,
    cvv
  };


  localStorage.setItem(
    TEST_CARD_STORAGE_KEY,
    JSON.stringify(card)
  );


  return card;
}


function renderTestCardHTML() {

  const card =
    getTestCard();


  if (!card) {

    return `
      <div
        style="
          padding:20px;
          border-radius:16px;
          background:rgba(255,255,255,.04);
          color:var(--muted);
          text-align:center;
        "
      >
        Aucune carte créée.
      </div>
    `;

  }


  return `
    <div
      style="
        width:100%;
        max-width:420px;
        min-height:235px;
        margin:12px auto 16px;
        padding:24px;
        border-radius:22px;
        background:#050505;
        color:#fff !important;
        border:1px solid #252525;
        box-shadow:0 18px 50px rgba(0,0,0,.45);
        display:flex;
        flex-direction:column;
        justify-content:space-between;
      "
    >

      <div
        style="
          font-size:24px;
          font-weight:700;
          letter-spacing:3px;
          color:#fff !important;
        "
      >
        ${escapeHTML(card.number)}
      </div>


      <div
        style="
          display:grid;
          grid-template-columns:1fr auto auto;
          gap:18px;
          align-items:end;
        "
      >

        <div>

          <div
            style="
              font-size:10px;
              letter-spacing:1.5px;
              color:#fff !important;
            "
          >
            TITULAIRE
          </div>

          <div
            style="
              font-size:15px;
              font-weight:700;
              color:#fff !important;
              margin-top:4px;
            "
          >
            ${escapeHTML(
              card.holder
            )}
          </div>

        </div>


        <div>

          <div
            style="
              font-size:10px;
              letter-spacing:1.5px;
              color:#fff !important;
            "
          >
            EXP
          </div>

          <div
            style="
              font-size:15px;
              font-weight:700;
              color:#fff !important;
              margin-top:4px;
            "
          >
            ${escapeHTML(
              card.expiry
            )}
          </div>

        </div>


        <div>

          <div
            style="
              font-size:10px;
              letter-spacing:1.5px;
              color:#fff !important;
            "
          >
            CVV
          </div>

          <div
            style="
              font-size:15px;
              font-weight:700;
              color:#fff !important;
              margin-top:4px;
            "
          >
            ${escapeHTML(
              card.cvv
            )}
          </div>

        </div>

      </div>

    </div>
  `;

}


// ============================================================
// CHECKOUT
// ============================================================

function openCheckout() {

  if (!cart.length) {

    toast(
      "Ton panier est vide.",
      "error"
    );

    return;

  }


  const subtotal =
    getCartSubtotal();


  showModal(
    "Paiement",
    `
      <form id="checkoutForm">

        <div
          style="
            padding:15px;
            border-radius:14px;
            background:rgba(255,255,255,.05);
            margin-bottom:15px;
          "
        >

          <div
            style="
              display:flex;
              justify-content:space-between;
            "
          >
            <span>
              Sous-total
            </span>

            <strong>
              ${money(subtotal)}
            </strong>
          </div>


          <div
            style="
              display:flex;
              justify-content:space-between;
              margin-top:8px;
              font-size:19px;
            "
          >
            <strong>
              Total
            </strong>

            <strong>
              ${money(subtotal)}
            </strong>
          </div>

        </div>


        <label for="checkoutName">
          Nom
        </label>

        <input
          id="checkoutName"
          required
          placeholder="Ton nom"
        >


        <label
          for="checkoutAddress"
          style="
            margin-top:12px;
          "
        >
          Adresse de livraison
        </label>

        <textarea
          id="checkoutAddress"
          required
          placeholder="Adresse complète"
          style="
            min-height:90px;
          "
        ></textarea>


        <label
          for="checkoutCity"
          style="
            margin-top:12px;
          "
        >
          Ville
        </label>

        <input
          id="checkoutCity"
          required
          placeholder="Ville"
        >


        <label
          for="paymentMethod"
          style="
            margin-top:12px;
          "
        >
          Mode de paiement
        </label>

        <select
          id="paymentMethod"
          required
        >

          <option value="">
            Choisir
          </option>

          <option value="card">
            💳 Carte bancaire
          </option>

          <option value="paypal">
            🅿️ PayPal
          </option>

        </select>


        <div
          id="paymentInfo"
          style="
            margin-top:14px;
          "
        ></div>


        <div
          id="checkoutError"
          style="
            display:none;
            margin-top:12px;
            color:#ff7777;
          "
        ></div>


        <button
          type="submit"
          class="add-btn"
          id="checkoutSubmit"
          style="
            width:100%;
            margin-top:18px;
          "
        >
          Confirmer la commande
        </button>

      </form>
    `
  );


  $("paymentMethod")
    ?.addEventListener(
      "change",
      () => {

        const method =
          $("paymentMethod")
            ?.value || "";

        const info =
          $("paymentInfo");

        if (!info) {
          return;
        }


        if (method === "card") {

          info.innerHTML = `
            <div
              style="
                padding:15px;
                border-radius:14px;
                background:rgba(255,255,255,.05);
              "
            >

              <div
                style="
                  font-weight:700;
                  margin-bottom:12px;
                "
              >
                💳 Informations de carte
              </div>


              <label for="cardNumber">
                Numéro de carte
              </label>

              <input
                id="cardNumber"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                value=""
                placeholder="Numéro de carte"
                required
              >


              <label
                for="cardHolder"
                style="
                  margin-top:10px;
                "
              >
                Nom sur la carte
              </label>

              <input
                id="cardHolder"
                type="text"
                autocomplete="off"
                value=""
                placeholder="Nom sur la carte"
                required
              >


              <div
                style="
                  display:grid;
                  grid-template-columns:1fr 1fr;
                  gap:10px;
                  margin-top:10px;
                "
              >

                <div>

                  <label for="cardExpiry">
                    Expiration
                  </label>

                  <input
                    id="cardExpiry"
                    type="text"
                    autocomplete="off"
                    value=""
                    placeholder="MM/AA"
                    required
                  >

                </div>


                <div>

                  <label for="cardCvv">
                    CVV
                  </label>

                  <input
                    id="cardCvv"
                    type="text"
                    inputmode="numeric"
                    autocomplete="off"
                    value=""
                    placeholder="CVV"
                    required
                  >

                </div>

              </div>


              <p
                style="
                  margin-top:12px;
                  color:var(--muted);
                  font-size:13px;
                "
              >
                Entre les informations de la carte créée depuis l’administration.
              </p>

            </div>
          `;

        }


        else if (method === "paypal") {

          info.innerHTML = `
            <div
              style="
                padding:15px;
                border-radius:14px;
                background:rgba(255,255,255,.05);
              "
            >

              🅿️ Tu seras redirigé vers PayPal pour effectuer le paiement.

            </div>
          `;

        }


        else {

          info.innerHTML = "";

        }

      }
    );


  $("checkoutForm")
    ?.addEventListener(
      "submit",
      submitCheckout
    );

}


async function submitCheckout(event) {

  event.preventDefault();


  if (!currentUser) {

    toast(
      "Connecte-toi avant de commander.",
      "error"
    );

    closeModal();
    showLoginForm();

    return;

  }


  if (!cart.length) {

    toast(
      "Ton panier est vide.",
      "error"
    );

    return;

  }


  const name =
    $("checkoutName")
      ?.value.trim() || "";


  const address =
    $("checkoutAddress")
      ?.value.trim() || "";


  const city =
    $("checkoutCity")
      ?.value.trim() || "";


  const paymentMethod =
    $("paymentMethod")
      ?.value || "";


  const errorBox =
    $("checkoutError");


  function checkoutError(message) {

    if (errorBox) {

      errorBox.textContent =
        message;

      errorBox.style.display =
        "block";

    }

  }


  if (!name) {

    checkoutError(
      "Indique ton nom."
    );

    return;

  }


  if (!address) {

    checkoutError(
      "Indique ton adresse de livraison."
    );

    return;

  }


  if (!city) {

    checkoutError(
      "Indique ta ville."
    );

    return;

  }


  if (!paymentMethod) {

    checkoutError(
      "Choisis un mode de paiement."
    );

    return;

  }


  const subtotal =
    getCartSubtotal();


  let paymentStatus =
    subtotal <= 0
      ? "Payé"
      : "En attente";


  if (
    paymentMethod === "card" &&
    subtotal > 0
  ) {

    const card =
      getTestCard();


    if (!card) {

      checkoutError(
        "Aucune carte n'a été créée depuis l'administration."
      );

      return;

    }


    const enteredNumber =
      (
        $("cardNumber")
          ?.value || ""
      )
        .replace(/\s+/g, "")
        .trim();


    const storedNumber =
      card.number
        .replace(/\s+/g, "")
        .trim();


    const enteredHolder =
      (
        $("cardHolder")
          ?.value || ""
      )
        .trim()
        .toUpperCase();


    const storedHolder =
      card.holder
        .trim()
        .toUpperCase();


    const enteredExpiry =
      (
        $("cardExpiry")
          ?.value || ""
      )
        .trim();


    const enteredCvv =
      (
        $("cardCvv")
          ?.value || ""
      )
        .trim();


    if (!enteredNumber) {

      checkoutError(
        "Entre le numéro de carte."
      );

      return;

    }


    if (!enteredHolder) {

      checkoutError(
        "Entre le nom sur la carte."
      );

      return;

    }


    if (!enteredExpiry) {

      checkoutError(
        "Entre la date d'expiration."
      );

      return;

    }


    if (!enteredCvv) {

      checkoutError(
        "Entre le CVV."
      );

      return;

    }


    if (
      enteredNumber !==
      storedNumber
      ||
      enteredHolder !==
      storedHolder
      ||
      enteredExpiry !==
      card.expiry
      ||
      enteredCvv !==
      card.cvv
    ) {

      checkoutError(
        "Les informations de carte sont incorrectes."
      );

      return;

    }


    paymentStatus =
      "Payé";

  }


  const items =
    cart.map(item => {

      const product =
        getProduct(item.id);

      return {
        id: item.id,
        name: product?.name || "",
        price: product?.price || 0,
        quantity:
          Number(
            item.quantity || 1
          )
      };

    });


  const orderData = {

    userId:
      currentUser.uid,

    email:
      currentUser.email || "",

    name,

    address,

    city,

    items,

    total:
      subtotal,

    paymentMethod,

    paymentStatus,

    status:
      "Enregistrée",

    tracking:
      "",

    estimatedDelivery:
      "",

    createdAt:
      serverTimestamp()

  };


  const submit =
    $("checkoutSubmit");


  if (submit) {

    submit.disabled = true;

    submit.textContent =
      "Création de la commande...";

  }


  try {

    const orderRef =
      await addDoc(
        collection(db, "orders"),
        orderData
      );


    cart = [];

    saveCart();
    renderCart();

    closeModal();
    closeCart();


    toast(
      "Commande enregistrée 🎉",
      "success"
    );


    if (
      paymentMethod === "paypal" &&
      subtotal > 0
    ) {

      const amount =
        subtotal
          .toFixed(2);

      window.open(
        `https://paypal.me/SH0PNOVA/${amount}EUR`,
        "_blank"
      );

    }


    console.log(
      "Commande créée :",
      orderRef.id
    );

  } catch(error) {

    console.error(error);

    checkoutError(
      "Impossible de créer la commande."
    );

  } finally {

    if (submit) {

      submit.disabled = false;

      submit.textContent =
        "Confirmer la commande";

    }

  }

}


checkoutBtn?.addEventListener(
  "click",
  openCheckout
);


// ============================================================
// ADMIN
// ============================================================

function isAdminUser() {

  return !!currentUser &&
    (
      currentUser.email || ""
    ).toLowerCase() ===
    ADMIN_EMAIL.toLowerCase();

}


function openAdmin() {

  if (!isAdminUser()) {

    toast(
      "Accès administrateur refusé.",
      "error"
    );

    return;

  }


  const alreadyAuthorized =
    localStorage.getItem(
      ADMIN_ACCESS_KEY
    ) === "true";


  if (!alreadyAuthorized) {

    const code =
      prompt(
        "Code administrateur :"
      );


    if (code !== ADMIN_CODE) {

      toast(
        "Code incorrect.",
        "error"
      );

      return;

    }


    localStorage.setItem(
      ADMIN_ACCESS_KEY,
      "true"
    );

  }


  loadAdmin();

}


adminBtn?.addEventListener(
  "click",
  openAdmin
);


// ============================================================
// ADMIN - CHARGEMENT
// ============================================================

async function loadAdmin() {

  showModal(
    "Dashboard administrateur",
    `
      <div
        id="adminContent"
        style="
          min-height:120px;
        "
      >
        Chargement...
      </div>
    `
  );


  try {

    const snapshot =
      await getDocs(
        collection(db, "orders")
      );


    const orders =
      snapshot.docs.map(
        item => ({
          id: item.id,
          ...item.data()
        })
      );


    orders.sort(
      (a, b) =>
        Number(
          b.createdAt?.seconds || 0
        ) -
        Number(
          a.createdAt?.seconds || 0
        )
    );


    renderAdmin(orders);

  } catch(error) {

    console.error(error);

    const content =
      $("adminContent");

    if (content) {

      content.innerHTML = `
        <p style="color:#ff7777">
          Impossible de charger le dashboard.
        </p>
      `;

    }

  }

}


// ============================================================
// ADMIN - AFFICHAGE
// ============================================================

function renderAdmin(orders) {

  const content =
    $("adminContent");

  if (!content) {
    return;
  }


  content.innerHTML = `

    <div
      style="
        display:flex;
        justify-content:space-between;
        gap:10px;
        flex-wrap:wrap;
        margin-bottom:18px;
      "
    >

      <div>

        <strong
          style="
            font-size:20px;
          "
        >
          ${orders.length}
          commande${
            orders.length > 1
              ? "s"
              : ""
          }
        </strong>

      </div>


      <div
        style="
          display:flex;
          gap:8px;
        "
      >

        <button
          type="button"
          class="view-btn"
          id="adminRefresh"
        >
          Actualiser
        </button>


        <button
          type="button"
          class="view-btn"
          id="adminExit"
        >
          Quitter
        </button>

      </div>

    </div>


    <div
      style="
        padding:16px;
        border-radius:18px;
        background:rgba(255,255,255,.04);
        margin-bottom:20px;
      "
    >

      <h3>
        Carte de test
      </h3>

      <p
        style="
          color:var(--muted);
          margin-top:5px;
          font-size:13px;
        "
      >
        Utilisable uniquement sur ce site.
      </p>


      <div id="testCardContainer">
        ${renderTestCardHTML()}
      </div>


      <button
        type="button"
        class="add-btn"
        id="generateTestCard"
        style="
          width:100%;
        "
      >
        Générer une carte
      </button>

    </div>


    <div
      style="
        display:grid;
        gap:14px;
      "
    >

      ${
        orders.length
          ? orders.map(
              renderAdminOrder
            ).join("")
          : `
            <div
              style="
                padding:30px;
                text-align:center;
                color:var(--muted);
              "
            >
              Aucune commande.
            </div>
          `
      }

    </div>
  `;


  $("adminRefresh")
    ?.addEventListener(
      "click",
      loadAdmin
    );


  $("adminExit")
    ?.addEventListener(
      "click",
      () => {

        localStorage.removeItem(
          ADMIN_ACCESS_KEY
        );

        closeModal();

      }
    );


  $("generateTestCard")
    ?.addEventListener(
      "click",
      () => {

        generateTestCard();

        const container =
          $("testCardContainer");

        if (container) {

          container.innerHTML =
            renderTestCardHTML();

        }

        toast(
          "Carte créée 💳",
          "success"
        );

      }
    );


  content
    .querySelectorAll("[data-save-order]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          saveAdminOrder(
            button.dataset.saveOrder
          )
      );

    });


  content
    .querySelectorAll("[data-paid-order]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          markOrderPaid(
            button.dataset.paidOrder
          )
      );

    });


  content
    .querySelectorAll("[data-delete-order]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          deleteAdminOrder(
            button.dataset.deleteOrder
          )
      );

    });


  content
    .querySelectorAll("[data-invoice-order]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const order =
            orders.find(
              item =>
                item.id ===
                button.dataset.invoiceOrder
            );

          if (order) {
            printInvoice(order);
          }

        }
      );

    });

}


// ============================================================
// ADMIN - COMMANDE
// ============================================================

function renderAdminOrder(order) {

  return `
    <div
      style="
        padding:16px;
        border:1px solid var(--line);
        border-radius:16px;
        background:rgba(255,255,255,.025);
      "
    >

      <div
        style="
          display:flex;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
        "
      >

        <strong>
          Commande #${escapeHTML(
            order.id.slice(0,8)
          )}
        </strong>


        <strong>
          ${money(order.total || 0)}
        </strong>

      </div>


      <div
        style="
          color:var(--muted);
          margin-top:7px;
          font-size:13px;
        "
      >
        ${escapeHTML(
          order.email || ""
        )}
      </div>


      <div
        style="
          display:grid;
          gap:9px;
          margin-top:14px;
        "
      >

        <label>
          Statut
        </label>

        <select
          id="status-${escapeHTML(order.id)}"
        >

          ${
            [
              "Enregistrée",
              "Acceptée",
              "Préparation",
              "En transit",
              "Livraison proche",
              "Livrée",
              "Annulée"
            ].map(status => `
              <option
                value="${escapeHTML(status)}"
                ${
                  (
                    order.status ||
                    "Enregistrée"
                  ) === status
                    ? "selected"
                    : ""
                }
              >
                ${escapeHTML(status)}
              </option>
            `).join("")
          }

        </select>


        <label>
          Ville de livraison
        </label>

        <input
          id="city-${escapeHTML(order.id)}"
          value="${escapeHTML(
            order.city || ""
          )}"
          placeholder="Ville"
        >


        <label>
          Numéro de suivi
        </label>

        <input
          id="tracking-${escapeHTML(order.id)}"
          value="${escapeHTML(
            order.tracking || ""
          )}"
          placeholder="Suivi"
        >


        <label>
          Livraison estimée
        </label>

        <input
          id="delivery-${escapeHTML(order.id)}"
          value="${escapeHTML(
            order.estimatedDelivery || ""
          )}"
          placeholder="Ex : demain entre 14h et 16h"
        >


        <div
          style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:8px;
            margin-top:5px;
          "
        >

          <button
            type="button"
            class="add-btn"
            data-save-order="${escapeHTML(order.id)}"
          >
            Enregistrer
          </button>


          <button
            type="button"
            class="view-btn"
            data-paid-order="${escapeHTML(order.id)}"
          >
            Marquer payé
          </button>

        </div>


        <div
          style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:8px;
          "
        >

          <button
            type="button"
            class="view-btn"
            data-invoice-order="${escapeHTML(order.id)}"
          >
            🧾 Facture
          </button>


          <button
            type="button"
            class="view-btn"
            data-delete-order="${escapeHTML(order.id)}"
            style="
              color:#ff7777;
            "
          >
            Supprimer
          </button>

        </div>

      </div>

    </div>
  `;

}


// ============================================================
// ADMIN - SAUVEGARDE
// ============================================================

async function saveAdminOrder(id) {

  try {

    await updateDoc(
      doc(db, "orders", id),
      {
        status:
          $(`status-${id}`)?.value ||
          "Enregistrée",

        city:
          $(`city-${id}`)?.value.trim() ||
          "",

        tracking:
          $(`tracking-${id}`)?.value.trim() ||
          "",

        estimatedDelivery:
          $(`delivery-${id}`)?.value.trim() ||
          ""
      }
    );


    toast(
      "Commande mise à jour ✅",
      "success"
    );

  } catch(error) {

    console.error(error);

    toast(
      "Impossible de modifier la commande.",
      "error"
    );

  }

}


// ============================================================
// ADMIN - MARQUER PAYÉ
// ============================================================

async function markOrderPaid(id) {

  try {

    await updateDoc(
      doc(db, "orders", id),
      {
        paymentStatus: "Payé"
      }
    );


    toast(
      "Commande marquée comme payée 💳",
      "success"
    );

  } catch(error) {

    console.error(error);

    toast(
      "Impossible de modifier le paiement.",
      "error"
    );

  }

}


// ============================================================
// ADMIN - SUPPRIMER
// ============================================================

async function deleteAdminOrder(id) {

  const confirmed =
    confirm(
      "Supprimer cette commande ?"
    );


  if (!confirmed) {
    return;
  }


  try {

    await deleteDoc(
      doc(db, "orders", id)
    );


    toast(
      "Commande supprimée.",
      "success"
    );


    loadAdmin();

  } catch(error) {

    console.error(error);

    toast(
      "Impossible de supprimer la commande.",
      "error"
    );

  }

}


// ============================================================
// PARAMÈTRES
// ============================================================

function getTheme() {

  return localStorage.getItem(
    "novaThemeChoice"
  ) || "dark";

}


function applyTheme() {

  const theme =
    getTheme();


  if (theme === "light") {

    document.documentElement
      .dataset.theme = "light";

  } else if (theme === "dark") {

    document.documentElement
      .dataset.theme = "dark";

  } else {

    const prefersDark =
      window.matchMedia?.(
        "(prefers-color-scheme: dark)"
      ).matches;

    document.documentElement
      .dataset.theme =
      prefersDark
        ? "dark"
        : "light";

  }

}


function openSettings() {

  const current =
    getTheme();


  showModal(
    "Paramètres",
    `
      <h3>
        Apparence
      </h3>

      <div
        style="
          display:grid;
          gap:10px;
          margin-top:12px;
        "
      >

        <button
          type="button"
          class="view-btn theme-choice"
          data-theme="dark"
        >
          🌙 Mode sombre
        </button>


        <button
          type="button"
          class="view-btn theme-choice"
          data-theme="light"
        >
          ☀️ Mode clair
        </button>


        <button
          type="button"
          class="view-btn theme-choice"
          data-theme="auto"
        >
          🖥️ Automatique
        </button>

      </div>


      <p
        style="
          margin-top:20px;
          color:var(--muted);
        "
      >
        Thème actuel :
        ${escapeHTML(current)}
      </p>
    `
  );


  document
    .querySelectorAll(
      ".theme-choice"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          localStorage.setItem(
            "novaThemeChoice",
            button.dataset.theme
          );

          applyTheme();

          toast(
            "Thème mis à jour ✨",
            "success"
          );

          closeModal();

        }
      );

    });

}


settingsBtn?.addEventListener(
  "click",
  openSettings
);


// ============================================================
// RECHERCHE
// ============================================================

searchInput?.addEventListener(
  "input",
  event => {

    searchValue =
      event.target.value || "";

    renderProducts();

  }
);


// ============================================================
// TRI
// ============================================================

sortSelect?.addEventListener(
  "change",
  event => {

    sortValue =
      event.target.value || "default";

    renderProducts();

  }
);


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(
  auth,
  user => {

    currentUser = user;


    if (accountBtn) {

      if (user) {

        const email =
          user.email || "";

        const username =
          email.split("@")[0] ||
          "Compte";


        accountBtn.textContent =
          `👤 ${username}`;

      } else {

        accountBtn.textContent =
          "👤 Compte";

      }

    }


    if (adminBtn) {

      const isAdmin =
        !!user &&
        (
          user.email || ""
        ).toLowerCase() ===
        ADMIN_EMAIL.toLowerCase();


      adminBtn.style.display =
        isAdmin
          ? ""
          : "none";

    }

  }
);


// ============================================================
// ESC
// ============================================================

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") {
      return;
    }

    closeModal();
    closeCart();

  }
);


// ============================================================
// ERREURS
// ============================================================

window.addEventListener(
  "unhandledrejection",
  event => {

    const error =
      event.reason;

    console.error(
      "Unhandled Promise Rejection:",
      error
    );


    if (
      error?.code?.startsWith(
        "auth/"
      )
    ) {

      toast(
        authError(error),
        "error"
      );

    }

  }
);


// ============================================================
// INITIALISATION
// ============================================================

applyTheme();
renderCategories();
renderProducts();
renderCart();


// ============================================================
// API NOVASHOP
// ============================================================

window.NovaShop = {

  products,

  get currentUser() {
    return currentUser;
  },

  addToCart,

  removeFromCart,

  changeCartQuantity,

  openCart,

  closeCart,

  openProduct,

  openProductReviews,

  openAccount,

  openOrders,

  openSettings,

  renderProducts,

  renderCart,

  getCartCount,

  getCartSubtotal,

  money

};


console.log(
  "NovaShop chargé avec succès 🚀"
);
