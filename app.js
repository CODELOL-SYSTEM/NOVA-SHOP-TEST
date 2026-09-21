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
  "https://placehold.co/400x300/111827/ffffff?text=NovaShop";


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
let favorites = [];
let reviewsCache = {};

try {
  cart = JSON.parse(
    localStorage.getItem("novaCart") || "[]"
  );

  if (!Array.isArray(cart)) {
    cart = [];
  }
} catch {
  cart = [];
}

try {
  favorites = JSON.parse(
    localStorage.getItem("novaFavorites") || "[]"
  );

  if (!Array.isArray(favorites)) {
    favorites = [];
  }
} catch {
  favorites = [];
}


// ============================================================
// UTILITAIRES
// ============================================================

function money(value) {
  return Number(value || 0).toLocaleString(
    "fr-FR",
    {
      style: "currency",
      currency: "EUR"
    }
  );
}


function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttr(value) {
  return escapeHTML(value);
}


function getProduct(id) {
  return products.find(
    product => product.id === id
  );
}


function saveCart() {
  localStorage.setItem(
    "novaCart",
    JSON.stringify(cart)
  );
}


function saveFavorites() {
  localStorage.setItem(
    "novaFavorites",
    JSON.stringify(favorites)
  );
}


function getCartCount() {
  return cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );
}


function getCartSubtotal() {
  return cart.reduce(
    (total, item) => {

      const product =
        getProduct(item.id);

      if (!product) {
        return total;
      }

      return (
        total +
        product.price *
        Number(item.quantity || 1)
      );

    },
    0
  );
}


// ============================================================
// TOAST
// ============================================================

function toast(message, type = "info") {

  if (!toastContainer) {
    return;
  }

  const item =
    document.createElement("div");

  item.className =
    `toast-item toast-${type}`;

  item.textContent = message;

  item.style.cssText = `
    padding:12px 16px;
    margin-top:10px;
    border-radius:12px;
    background:#111827;
    color:white;
    border:1px solid rgba(255,255,255,.1);
    box-shadow:0 10px 30px rgba(0,0,0,.35);
    animation:novaToastIn .2s ease;
  `;

  toastContainer.appendChild(item);

  setTimeout(() => {

    item.style.opacity = "0";

    setTimeout(() => {
      item.remove();
    }, 250);

  }, 2800);
}


// ============================================================
// MODAL
// ============================================================

function showModal(title, content) {

  if (!modal) {
    return;
  }

  if (modalTitle) {
    modalTitle.textContent = title;
  }

  if (modalContent) {
    modalContent.innerHTML = content;
  }

  modal.style.display = "flex";

  document.body.style.overflow = "hidden";
}


function closeModal() {

  if (!modal) {
    return;
  }

  modal.style.display = "none";

  document.body.style.overflow = "";
}


modalClose?.addEventListener(
  "click",
  closeModal
);


// ============================================================
// PANIER
// ============================================================

function openCart() {

  if (!cartDrawer) {
    return;
  }

  renderCart();

  cartDrawer.classList.add("open");

  if (cartOverlay) {
    cartOverlay.classList.add("open");
  }
}


function closeCart() {

  cartDrawer?.classList.remove("open");
  cartOverlay?.classList.remove("open");
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


function addToCart(id) {

  const product =
    getProduct(id);

  if (!product) {
    return;
  }

  const existing =
    cart.find(item => item.id === id);

  if (existing) {

    existing.quantity =
      Number(existing.quantity || 0) + 1;

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


function changeCartQuantity(id, quantity) {

  const item =
    cart.find(
      item => item.id === id
    );

  if (!item) {
    return;
  }

  item.quantity =
    Math.max(
      1,
      Number(quantity || 1)
    );

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

  if (!cart.length) {

    cartItems.innerHTML = `
      <div style="
        text-align:center;
        padding:30px 15px;
        opacity:.75;
      ">
        <div style="font-size:45px;">
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

      if (!product) {
        return "";
      }

      const quantity =
        Number(item.quantity || 1);

      return `
        <div style="
          display:grid;
          grid-template-columns:70px 1fr;
          gap:12px;
          padding:12px 0;
          border-bottom:1px solid rgba(255,255,255,.08);
        ">

          <div style="
            width:70px;
            height:60px;
            display:flex;
            align-items:center;
            justify-content:center;
            overflow:hidden;
            border-radius:10px;
            background:rgba(255,255,255,.04);
          ">

            <img
              src="${escapeAttr(product.image)}"
              alt="${escapeHTML(product.name)}"
              style="
                width:100%;
                height:100%;
                object-fit:contain;
                display:block;
              "
              onerror="
                this.onerror=null;
                this.src='${FALLBACK_IMAGE}';
              "
            >

          </div>

          <div>

            <strong style="
              display:block;
              font-size:14px;
              line-height:1.3;
            ">
              ${escapeHTML(product.name)}
            </strong>

            <div style="
              margin-top:5px;
              color:var(--accent,#2d8cff);
              font-weight:700;
            ">
              ${money(product.price)}
            </div>

            <div style="
              display:flex;
              align-items:center;
              gap:7px;
              margin-top:8px;
            ">

              <button
                type="button"
                class="view-btn cart-minus"
                data-id="${escapeAttr(item.id)}"
              >
                −
              </button>

              <strong>
                ${quantity}
              </strong>

              <button
                type="button"
                class="view-btn cart-plus"
                data-id="${escapeAttr(item.id)}"
              >
                +
              </button>

              <button
                type="button"
                class="view-btn cart-remove"
                data-id="${escapeAttr(item.id)}"
                style="margin-left:auto;"
              >
                Supprimer
              </button>

            </div>

          </div>

        </div>
      `;

    }).join("");

  if (cartTotal) {
    cartTotal.textContent =
      money(getCartSubtotal());
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
  }

  cartItems
    .querySelectorAll(".cart-minus")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const item =
            cart.find(
              x => x.id === button.dataset.id
            );

          if (!item) {
            return;
          }

          if (Number(item.quantity) <= 1) {

            removeFromCart(item.id);

          } else {

            changeCartQuantity(
              item.id,
              Number(item.quantity) - 1
            );

          }

        }
      );

    });

  cartItems
    .querySelectorAll(".cart-plus")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const item =
            cart.find(
              x => x.id === button.dataset.id
            );

          if (item) {

            changeCartQuantity(
              item.id,
              Number(item.quantity) + 1
            );

          }

        }
      );

    });

  cartItems
    .querySelectorAll(".cart-remove")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          removeFromCart(
            button.dataset.id
          );

        }
      );

    });
}


// ============================================================
// CATÉGORIES
// ============================================================

function renderCategories() {

  if (!categoriesEl) {
    return;
  }

  const categories = [
    "Tous",
    ...new Set(
      products.map(
        product => product.category
      )
    )
  ];

  categoriesEl.innerHTML =
    categories.map(category => `
      <button
        type="button"
        class="category-btn ${
          category === selectedCategory
            ? "active"
            : ""
        }"
        data-category="${escapeAttr(category)}"
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
            button.dataset.category;

          renderCategories();
          renderProducts();

        }
      );

    });
}


// ============================================================
// PRODUITS
// ============================================================

function getFilteredProducts() {

  let result =
    products.filter(product => {

      const categoryMatch =
        selectedCategory === "Tous" ||
        product.category === selectedCategory;

      const searchMatch =
        !searchValue ||
        product.name
          .toLowerCase()
          .includes(
            searchValue.toLowerCase()
          );

      return categoryMatch && searchMatch;
    });

  if (sortValue === "priceAsc") {

    result.sort(
      (a, b) => a.price - b.price
    );

  } else if (sortValue === "priceDesc") {

    result.sort(
      (a, b) => b.price - a.price
    );

  } else if (sortValue === "name") {

    result.sort(
      (a, b) =>
        a.name.localeCompare(
          b.name,
          "fr"
        )
    );

  } else if (sortValue === "new") {

    result.sort(
      (a, b) =>
        Number(!!b.new) -
        Number(!!a.new)
    );

  }

  return result;
}


function renderProducts() {

  if (!productsGrid) {
    return;
  }

  const filtered =
    getFilteredProducts();

  if (productCount) {

    productCount.textContent =
      `${filtered.length} produit${
        filtered.length > 1 ? "s" : ""
      }`;

  }

  if (!filtered.length) {

    productsGrid.innerHTML = `
      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:40px;
      ">

        <div style="font-size:50px;">
          🔎
        </div>

        <h3>
          Aucun produit trouvé
        </h3>

        <p>
          Essaie une autre recherche.
        </p>

      </div>
    `;

    return;
  }

  productsGrid.innerHTML =
    filtered.map(product => {

      const isFavorite =
        favorites.includes(product.id);

      return `
        <article
          class="product-card"
          data-product-id="${escapeAttr(product.id)}"
          style="
            overflow:hidden;
          "
        >

          <div
            class="product-image-wrap"
            style="
              width:100%;
              height:120px !important;
              min-height:120px !important;
              max-height:120px !important;
              display:flex;
              align-items:center;
              justify-content:center;
              overflow:hidden;
              border-radius:12px;
              background:rgba(255,255,255,.035);
              margin-bottom:10px;
            "
          >

            <img
              class="product-image"
              src="${escapeAttr(product.image)}"
              alt="${escapeHTML(product.name)}"
              loading="lazy"
              style="
                display:block;
                width:auto !important;
                height:auto !important;
                max-width:90% !important;
                max-height:110px !important;
                object-fit:contain !important;
                object-position:center;
                margin:auto;
              "
              onerror="
                this.onerror=null;
                this.src='${FALLBACK_IMAGE}';
              "
            >

          </div>

          <div
            class="product-info"
            style="
              min-width:0;
            "
          >

            ${
              product.new
                ? `
                  <span style="
                    display:inline-block;
                    padding:4px 7px;
                    border-radius:7px;
                    background:rgba(37,214,149,.12);
                    color:#25d695;
                    font-size:10px;
                    font-weight:800;
                    margin-bottom:6px;
                  ">
                    NOUVEAU
                  </span>
                `
                : ""
            }

            <div style="
              color:var(--muted,#8c96a8);
              font-size:11px;
              margin-bottom:4px;
            ">
              ${escapeHTML(product.category)}
            </div>

            <h3 style="
              font-size:14px;
              line-height:1.25;
              margin:0;
              min-height:35px;
            ">
              ${escapeHTML(product.name)}
            </h3>

            <div style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:8px;
              margin-top:9px;
            ">

              <strong style="
                font-size:17px;
                color:var(--accent,#2d8cff);
              ">
                ${money(product.price)}
              </strong>

              <button
                type="button"
                class="favorite-btn"
                data-favorite="${escapeAttr(product.id)}"
                title="Favori"
                style="
                  border:0;
                  background:transparent;
                  cursor:pointer;
                  font-size:17px;
                "
              >
                ${isFavorite ? "❤️" : "🤍"}
              </button>

            </div>

            <div style="
              display:grid;
              grid-template-columns:1fr;
              gap:6px;
              margin-top:9px;
            ">

              <button
                type="button"
                class="add-btn product-add"
                data-add="${escapeAttr(product.id)}"
                style="
                  width:100%;
                  padding:8px 10px;
                  font-size:12px;
                "
              >
                Ajouter
              </button>

              <button
                type="button"
                class="view-btn product-view"
                data-view="${escapeAttr(product.id)}"
                style="
                  width:100%;
                  padding:7px 10px;
                  font-size:12px;
                "
              >
                Voir
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
          addToCart(button.dataset.add);
        }
      );

    });

  productsGrid
    .querySelectorAll("[data-view]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {
          openProduct(button.dataset.view);
        }
      );

    });

  productsGrid
    .querySelectorAll("[data-favorite]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.dataset.favorite;

          if (favorites.includes(id)) {

            favorites =
              favorites.filter(
                item => item !== id
              );

          } else {

            favorites.push(id);

          }

          saveFavorites();
          renderProducts();

        }
      );

    });
}


// ============================================================
// RECHERCHE
// ============================================================

searchInput?.addEventListener(
  "input",
  () => {

    searchValue =
      searchInput.value.trim();

    renderProducts();

  }
);


// ============================================================
// TRI
// ============================================================

sortSelect?.addEventListener(
  "change",
  () => {

    sortValue =
      sortSelect.value;

    renderProducts();

  }
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

        <div style="
          width:100%;
          height:180px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          border-radius:15px;
          background:rgba(255,255,255,.04);
          margin-bottom:16px;
        ">

          <img
            src="${escapeAttr(product.image)}"
            alt="${escapeHTML(product.name)}"
            style="
              width:auto;
              height:auto;
              max-width:90%;
              max-height:165px;
              object-fit:contain;
            "
            onerror="
              this.onerror=null;
              this.src='${FALLBACK_IMAGE}';
            "
          >

        </div>

        <div style="
          opacity:.7;
          margin-bottom:7px;
        ">
          ${escapeHTML(product.category)}
        </div>

        <h2>
          ${escapeHTML(product.name)}
        </h2>

        <div style="
          font-size:24px;
          font-weight:800;
          color:var(--accent,#2d8cff);
          margin:12px 0;
        ">
          ${money(product.price)}
        </div>

        <button
          type="button"
          class="add-btn"
          id="modalAddProduct"
          style="width:100%;"
        >
          🛒 Ajouter au panier
        </button>

        <button
          type="button"
          class="view-btn"
          id="modalReviews"
          style="
            width:100%;
            margin-top:8px;
          "
        >
          ⭐ Voir les avis
        </button>

      </div>
    `
  );

  $("modalAddProduct")
    ?.addEventListener(
      "click",
      () => {
        addToCart(product.id);
      }
    );

  $("modalReviews")
    ?.addEventListener(
      "click",
      () => {
        openProductReviews(product.id);
      }
    );
}


// ============================================================
// AVIS
// ============================================================

async function openProductReviews(productId) {

  const product =
    getProduct(productId);

  if (!product) {
    return;
  }

  showModal(
    `Avis - ${product.name}`,
    `
      <div
        id="reviewsLoading"
        style="
          text-align:center;
          padding:25px;
        "
      >
        Chargement des avis...
      </div>

      <div id="reviewsList"></div>
    `
  );

  try {

    const reviewsQuery =
      query(
        collection(db, "reviews"),
        where(
          "productId",
          "==",
          productId
        )
      );

    const snapshot =
      await getDocs(reviewsQuery);

    const reviews = [];

    snapshot.forEach(item => {

      reviews.push({
        id: item.id,
        ...item.data()
      });

    });

    reviewsCache[productId] =
      reviews;

    $("reviewsLoading")?.remove();

    const list =
      $("reviewsList");

    if (!list) {
      return;
    }

    if (!reviews.length) {

      list.innerHTML = `
        <div style="
          text-align:center;
          padding:25px;
          opacity:.7;
        ">
          ⭐ Aucun avis pour le moment.
        </div>
      `;

      return;
    }

    list.innerHTML =
      reviews.map(review => {

        const rating =
          Math.max(
            1,
            Math.min(
              5,
              Number(review.rating || 5)
            )
          );

        const stars =
          "★".repeat(rating) +
          "☆".repeat(5 - rating);

        return `
          <div style="
            padding:14px 0;
            border-bottom:1px solid rgba(255,255,255,.08);
          ">

            <div style="
              color:#ffd45a;
              font-size:18px;
            ">
              ${stars}
            </div>

            <strong>
              ${escapeHTML(
                review.userName ||
                "Client"
              )}
            </strong>

            <p style="
              margin-top:7px;
              opacity:.85;
            ">
              ${escapeHTML(
                review.text || ""
              )}
            </p>

          </div>
        `;

      }).join("");

  } catch (error) {

    console.error(error);

    $("reviewsLoading")?.remove();

    const list =
      $("reviewsList");

    if (list) {

      list.innerHTML = `
        <div style="
          color:#ff7777;
          padding:20px;
        ">
          Impossible de charger les avis.
        </div>
      `;

    }
  }
}


// ============================================================
// AUTH
// ============================================================

function authError(error) {

  const code =
    error?.code || "";

  const messages = {

    "auth/invalid-credential":
      "E-mail ou mot de passe incorrect.",

    "auth/invalid-email":
      "Adresse e-mail invalide.",

    "auth/email-already-in-use":
      "Cette adresse e-mail est déjà utilisée.",

    "auth/weak-password":
      "Le mot de passe doit contenir au moins 6 caractères.",

    "auth/user-not-found":
      "Aucun compte trouvé avec cette adresse.",

    "auth/wrong-password":
      "Mot de passe incorrect.",

    "auth/too-many-requests":
      "Trop de tentatives. Réessaie plus tard.",

    "auth/network-request-failed":
      "Erreur réseau."

  };

  return (
    messages[code] ||
    error?.message ||
    "Une erreur est survenue."
  );
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
          style="margin-top:14px"
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
          $("loginEmail")?.value.trim() || "";

        const password =
          $("loginPassword")?.value || "";

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

        } catch (error) {

          console.error(error);

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
          style="margin-top:14px"
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
          style="margin-top:14px"
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
          $("registerEmail")?.value.trim() || "";

        const password =
          $("registerPassword")?.value || "";

        const password2 =
          $("registerPassword2")?.value || "";

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

        } catch (error) {

          console.error(error);

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
// ÉTAT AUTH
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
        isAdmin ? "" : "none";

    }

  }
);


// ============================================================
// COMPTE
// ============================================================

function openAccount() {

  if (!currentUser) {

    showLoginForm();

    return;
  }

  showModal(
    "Mon compte",
    `
      <div>

        <div style="
          padding:16px;
          border-radius:15px;
          background:rgba(80,120,255,.08);
          margin-bottom:15px;
        ">

          <strong>
            👤 Compte connecté
          </strong>

          <p style="
            margin-top:7px;
            opacity:.8;
          ">
            ${escapeHTML(
              currentUser.email || ""
            )}
          </p>

        </div>

        <button
          type="button"
          class="add-btn"
          id="accountOrders"
          style="
            width:100%;
            margin-bottom:8px;
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
          "
        >
          🚪 Se déconnecter
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

        } catch (error) {

          toast(
            authError(error),
            "error"
          );

        }

      }
    );
}


// ============================================================
// COMMANDES
// ============================================================

ordersBtn?.addEventListener(
  "click",
  openOrders
);


async function openOrders() {

  if (!currentUser) {

    showLoginForm();

    return;
  }

  showModal(
    "Mes commandes",
    `
      <div
        id="ordersLoading"
        style="
          text-align:center;
          padding:30px;
        "
      >
        Chargement des commandes...
      </div>

      <div id="ordersList"></div>
    `
  );

  try {

    const ordersQuery =
      query(
        collection(db, "orders"),
        where(
          "userId",
          "==",
          currentUser.uid
        )
      );

    const snapshot =
      await getDocs(ordersQuery);

    const orders = [];

    snapshot.forEach(item => {

      orders.push({
        id: item.id,
        ...item.data()
      });

    });

    orders.sort(
      (a, b) => {

        const dateA =
          a.createdAt?.seconds || 0;

        const dateB =
          b.createdAt?.seconds || 0;

        return dateB - dateA;

      }
    );

    $("ordersLoading")?.remove();

    const list =
      $("ordersList");

    if (!list) {
      return;
    }

    if (!orders.length) {

      list.innerHTML = `
        <div style="
          text-align:center;
          padding:30px;
        ">

          <div style="font-size:50px;">
            📦
          </div>

          <h3>
            Aucune commande
          </h3>

          <p>
            Tu n'as pas encore passé de commande.
          </p>

        </div>
      `;

      return;
    }

    list.innerHTML =
      orders.map(order => {

        const total =
          Number(order.total || 0);

        const status =
          order.status ||
          "Enregistrée";

        const customerName =
          `${order.firstName || ""} ${order.lastName || ""}`
            .trim();

        return `
          <div
            class="order-card"
            style="
              padding:16px;
              margin-bottom:12px;
              border:1px solid rgba(255,255,255,.08);
              border-radius:16px;
            "
          >

            <div style="
              display:flex;
              justify-content:space-between;
              gap:10px;
              margin-bottom:8px;
            ">

              <strong>
                Commande #${escapeHTML(
                  order.id.slice(0, 8)
                )}
              </strong>

              <strong>
                ${money(total)}
              </strong>

            </div>

            ${
              customerName
                ? `
                  <div style="
                    margin-bottom:8px;
                    opacity:.9;
                  ">
                    👤 ${escapeHTML(customerName)}
                  </div>
                `
                : ""
            }

            <div style="
              margin-bottom:12px;
            ">
              Statut :
              <strong>
                ${escapeHTML(status)}
              </strong>
            </div>

            <button
              type="button"
              class="view-btn"
              data-order-id="${escapeAttr(order.id)}"
            >
              Voir la commande
            </button>

          </div>
        `;

      }).join("");

    list.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "[data-order-id]"
          );

        if (!button) {
          return;
        }

        const order =
          orders.find(
            item =>
              item.id ===
              button.dataset.orderId
          );

        if (order) {
          openOrderDetails(order);
        }

      }
    );

  } catch (error) {

    console.error(
      "Firestore Orders Error:",
      error
    );

    const loading =
      $("ordersLoading");

    if (loading) {

      loading.innerHTML = `
        <div style="color:#ff7777;">
          Impossible de charger les commandes.
          <br><br>
          ${escapeHTML(
            error.message || ""
          )}
        </div>
      `;

    }
  }
}


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
        Number(item.quantity || 1);

      return `
        <div style="
          display:flex;
          justify-content:space-between;
          gap:12px;
          padding:10px 0;
          border-bottom:1px solid rgba(255,255,255,.07);
        ">

          <span>
            ${escapeHTML(name)}
            × ${quantity}
          </span>

          <strong>
            ${money(price * quantity)}
          </strong>

        </div>
      `;

    }).join("");

  const customerName =
    `${order.firstName || ""} ${order.lastName || ""}`
      .trim();

  const timelineHTML =
    status === "Annulée"
      ? `
        <div style="
          padding:12px;
          border-radius:12px;
          background:rgba(255,60,60,.12);
          color:#ff7777;
        ">
          ❌ Commande annulée
        </div>
      `
      : timeline.map(
          (step, index) => {

            const active =
              currentIndex >= index;

            return `
              <div style="
                display:flex;
                align-items:center;
                gap:10px;
                margin:8px 0;
                opacity:${active ? 1 : .4};
              ">

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
    `Commande #${escapeHTML(
      order.id.slice(0, 8)
    )}`,
    `
      <div>

        <div style="
          padding:16px;
          border-radius:16px;
          background:rgba(80,120,255,.08);
          margin-bottom:18px;
        ">

          ${
            customerName
              ? `
                <div style="
                  margin-bottom:9px;
                  font-weight:700;
                ">
                  👤 ${escapeHTML(customerName)}
                </div>
              `
              : ""
          }

          ${
            order.userEmail
              ? `
                <div style="
                  margin-bottom:9px;
                  opacity:.8;
                ">
                  📧 ${escapeHTML(order.userEmail)}
                </div>
              `
              : ""
          }

          <strong>
            Statut :
            ${escapeHTML(status)}
          </strong>

          ${
            order.tracking
              ? `
                <div style="margin-top:8px;">
                  Suivi :
                  ${escapeHTML(
                    order.tracking
                  )}
                </div>
              `
              : ""
          }

          ${
            order.estimatedDelivery
              ? `
                <div style="margin-top:8px;">
                  Livraison estimée :
                  ${escapeHTML(
                    order.estimatedDelivery
                  )}
                </div>
              `
              : ""
          }

          ${
            order.city
              ? `
                <div style="margin-top:8px;">
                  📍 Destination :
                  ${escapeHTML(order.city)}
                </div>
              `
              : ""
          }

        </div>

        <h3>
          Suivi
        </h3>

        <div style="
          margin:12px 0 20px;
        ">
          ${timelineHTML}
        </div>

        <h3>
          Produits
        </h3>

        <div style="
          margin:10px 0 20px;
        ">
          ${productsHTML}
        </div>

        ${
          order.address
            ? `
              <h3>
                Livraison
              </h3>

              <p style="
                margin:8px 0 20px;
              ">
                ${escapeHTML(
                  order.address
                )}
              </p>
            `
            : ""
        }

        <div style="
          display:flex;
          justify-content:space-between;
          font-size:20px;
          padding-top:15px;
          border-top:1px solid rgba(255,255,255,.1);
        ">

          <strong>
            Total
          </strong>

          <strong>
            ${money(order.total || 0)}
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
// CARTE LOCALE
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
    `9999 ${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`;

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
      <div style="
        padding:16px;
        border-radius:15px;
        background:rgba(255,255,255,.04);
        margin-top:15px;
      ">

        <strong>
          💳 Carte
        </strong>

        <p style="
          margin-top:7px;
          opacity:.7;
        ">
          Aucune carte créée.
        </p>

        <button
          type="button"
          class="add-btn"
          id="generateTestCard"
          style="
            width:100%;
            margin-top:12px;
          "
        >
          Générer une carte
        </button>

      </div>
    `;

  }

  return `
    <div style="
      margin-top:15px;
    ">

      <div style="
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
      ">

        <div style="
          font-size:24px;
          font-weight:700;
          letter-spacing:3px;
          color:#fff !important;
        ">
          ${escapeHTML(card.number)}
        </div>

        <div style="
          display:grid;
          grid-template-columns:1fr auto auto;
          gap:18px;
          align-items:end;
        ">

          <div>

            <div style="
              font-size:10px;
              letter-spacing:1.5px;
              color:#fff !important;
            ">
              TITULAIRE
            </div>

            <div style="
              font-size:15px;
              font-weight:700;
              color:#fff !important;
              margin-top:4px;
            ">
              ${escapeHTML(card.holder)}
            </div>

          </div>

          <div>

            <div style="
              font-size:10px;
              letter-spacing:1.5px;
              color:#fff !important;
            ">
              EXP
            </div>

            <div style="
              font-size:15px;
              font-weight:700;
              color:#fff !important;
              margin-top:4px;
            ">
              ${escapeHTML(card.expiry)}
            </div>

          </div>

          <div>

            <div style="
              font-size:10px;
              letter-spacing:1.5px;
              color:#fff !important;
            ">
              CVV
            </div>

            <div style="
              font-size:15px;
              font-weight:700;
              color:#fff !important;
              margin-top:4px;
            ">
              ${escapeHTML(card.cvv)}
            </div>

          </div>

        </div>

      </div>

      <button
        type="button"
        class="add-btn"
        id="generateTestCard"
        style="
          width:100%;
        "
      >
        🔄 Générer une nouvelle carte
      </button>

    </div>
  `;
}


// ============================================================
// CHECKOUT
// ============================================================

checkoutBtn?.addEventListener(
  "click",
  openCheckout
);


function openCheckout() {

  if (!cart.length) {

    toast(
      "Ton panier est vide 🛒"
    );

    return;
  }

  if (!currentUser) {

    toast(
      "Connecte-toi pour commander."
    );

    showLoginForm();

    return;
  }

  const subtotal =
    getCartSubtotal();

  showModal(
    "Finaliser la commande",
    `
      <form id="checkoutForm">

        <div style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
          margin-bottom:14px;
        ">

          <div>

            <label for="checkoutFirstName">
              Prénom
            </label>

            <input
              id="checkoutFirstName"
              type="text"
              autocomplete="given-name"
              placeholder="Ton prénom"
              required
            >

          </div>

          <div>

            <label for="checkoutLastName">
              Nom
            </label>

            <input
              id="checkoutLastName"
              type="text"
              autocomplete="family-name"
              placeholder="Ton nom"
              required
            >

          </div>

        </div>

        <div style="
          margin-bottom:14px;
        ">

          <label for="checkoutAddress">
            Adresse de livraison
          </label>

          <textarea
            id="checkoutAddress"
            required
            rows="4"
            autocomplete="street-address"
            placeholder="Adresse complète"
          ></textarea>

        </div>

        <div style="
          padding:15px;
          border-radius:14px;
          background:rgba(255,255,255,.05);
          margin:15px 0;
        ">

          <div style="
            display:flex;
            justify-content:space-between;
          ">

            <span>
              Sous-total
            </span>

            <strong id="checkoutSubtotal">
              ${money(subtotal)}
            </strong>

          </div>

          <div style="
            display:flex;
            justify-content:space-between;
            margin-top:12px;
            font-size:22px;
          ">

            <span>
              Total
            </span>

            <strong id="checkoutFinal">
              ${money(subtotal)}
            </strong>

          </div>

        </div>

        <h3>
          Mode de paiement
        </h3>

        <div style="
          display:grid;
          gap:10px;
          margin:12px 0 18px;
        ">

          <button
            type="button"
            class="view-btn payment-choice"
            data-payment="paypal"
          >
            🅿️ PayPal
          </button>

          <button
            type="button"
            class="view-btn payment-choice"
            data-payment="card"
          >
            💳 Carte bancaire
          </button>

        </div>

        <input
          type="hidden"
          id="paymentMethod"
          value=""
        >

        <div
          id="paymentInfo"
          style="margin-bottom:14px;"
        ></div>

        <button
          type="submit"
          class="add-btn"
          id="checkoutSubmit"
          style="width:100%;"
        >
          Continuer
        </button>

        <div
          id="checkoutError"
          style="
            display:none;
            color:#ff7777;
            margin-top:12px;
          "
        ></div>

      </form>
    `
  );

  let paymentMethod = "";

  document
    .querySelectorAll(".payment-choice")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          paymentMethod =
            button.dataset.payment || "";

          const input =
            $("paymentMethod");

          if (input) {
            input.value =
              paymentMethod;
          }

          document
            .querySelectorAll(
              ".payment-choice"
            )
            .forEach(item => {

              item.classList.remove(
                "selected"
              );

            });

          button.classList.add(
            "selected"
          );

          const info =
            $("paymentInfo");

          if (!info) {
            return;
          }

          if (
            paymentMethod ===
            "paypal"
          ) {

            info.innerHTML = `
              <div style="
                padding:12px;
                border-radius:12px;
                background:rgba(60,130,255,.1);
              ">
                Tu seras redirigé vers PayPal
                pour effectuer le paiement.
              </div>
            `;

          } else {

            info.innerHTML = `
              <div style="
                padding:15px;
                border-radius:14px;
                background:rgba(255,255,255,.05);
              ">

                <div style="
                  font-weight:700;
                  margin-bottom:12px;
                ">
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
                  style="margin-top:10px"
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

                <div style="
                  display:grid;
                  grid-template-columns:1fr 1fr;
                  gap:10px;
                  margin-top:10px;
                ">

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

                <p style="
                  margin-top:12px;
                  color:var(--muted);
                  font-size:13px;
                ">
                  Entre les informations de la carte
                  créée depuis l’administration.
                </p>

              </div>
            `;

          }

        }
      );

    });


  $("checkoutForm")
    ?.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        const firstName =
          $("checkoutFirstName")
            ?.value.trim() || "";

        const lastName =
          $("checkoutLastName")
            ?.value.trim() || "";

        const address =
          $("checkoutAddress")
            ?.value.trim() || "";

        const errorBox =
          $("checkoutError");

        if (!firstName) {

          if (errorBox) {

            errorBox.textContent =
              "Indique ton prénom.";

            errorBox.style.display =
              "block";

          }

          return;
        }

        if (!lastName) {

          if (errorBox) {

            errorBox.textContent =
              "Indique ton nom.";

            errorBox.style.display =
              "block";

          }

          return;
        }

        if (!address) {

          if (errorBox) {

            errorBox.textContent =
              "Indique ton adresse de livraison.";

            errorBox.style.display =
              "block";

          }

          return;
        }

        if (!paymentMethod) {

          if (errorBox) {

            errorBox.textContent =
              "Choisis un moyen de paiement.";

            errorBox.style.display =
              "block";

          }

          return;
        }

        const submit =
          $("checkoutSubmit");

        if (submit) {

          submit.disabled = true;
          submit.textContent =
            "Création...";

        }

        try {

          const total =
            getCartSubtotal();

          let paymentStatus =
            total === 0
              ? "Payé"
              : "En attente";

          if (
            paymentMethod ===
            "card"
          ) {

            const card =
              getTestCard();

            if (!card) {

              throw new Error(
                "Aucune carte n'a été créée dans l'administration."
              );

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
                .toLowerCase();

            const storedHolder =
              card.holder
                .trim()
                .toLowerCase();

            const enteredExpiry =
              (
                $("cardExpiry")
                  ?.value || ""
              ).trim();

            const enteredCvv =
              (
                $("cardCvv")
                  ?.value || ""
              ).trim();

            if (
              enteredNumber !==
                storedNumber ||
              enteredHolder !==
                storedHolder ||
              enteredExpiry !==
                card.expiry ||
              enteredCvv !==
                card.cvv
            ) {

              throw new Error(
                "Les informations de carte sont incorrectes."
              );

            }

            paymentStatus =
              "Payé";
          }

          const orderItems =
            cart.map(item => {

              const product =
                getProduct(item.id);

              return {
                id: item.id,
                name:
                  product?.name ||
                  "Produit",
                price:
                  product?.price ||
                  0,
                quantity:
                  Number(item.quantity || 1)
              };

            });

          const orderData = {

            userId:
              currentUser.uid,

            userEmail:
              currentUser.email || "",

            firstName,
            lastName,

            items:
              orderItems,

            subtotal:
              total,

            total,

            address,

            city:
              "",

            status:
              "Enregistrée",

            paymentMethod,

            paymentStatus,

            tracking:
              "",

            estimatedDelivery:
              "",

            createdAt:
              serverTimestamp()
          };

          const orderRef =
            await addDoc(
              collection(db, "orders"),
              orderData
            );

          cart = [];

          saveCart();
          renderCart();

          closeModal();

          toast(
            `Commande #${orderRef.id.slice(0, 8)} créée 🎉`,
            "success"
          );

          if (
            paymentMethod ===
              "paypal" &&
            total > 0
          ) {

            const paypalUrl =
              `https://paypal.me/SH0PNOVA/${encodeURIComponent(
                total.toFixed(2)
              )}EUR`;

            setTimeout(
              () => {

                window.open(
                  paypalUrl,
                  "_blank",
                  "noopener,noreferrer"
                );

              },
              400
            );

          }

        } catch (error) {

          console.error(
            "Firestore Checkout Error:",
            error
          );

          if (errorBox) {

            errorBox.textContent =
              `Erreur : ${
                error.message ||
                error.code ||
                "inconnue"
              }`;

            errorBox.style.display =
              "block";

          }

        } finally {

          if (submit) {

            submit.disabled = false;
            submit.textContent =
              "Continuer";

          }

        }

      }
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
        Number(item.quantity || 1);

      return `
        <tr>

          <td>
            ${escapeHTML(name)}
          </td>

          <td>
            ${quantity}
          </td>

          <td>
            ${money(price)}
          </td>

          <td>
            ${money(
              price * quantity
            )}
          </td>

        </tr>
      `;

    }).join("");

  const customerName =
    `${order.firstName || ""} ${order.lastName || ""}`
      .trim();

  const invoiceWindow =
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

  if (!invoiceWindow) {

    toast(
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
        Facture NovaShop
      </title>

      <style>

        body {
          font-family:Arial,sans-serif;
          padding:40px;
          color:#111827;
        }

        h1 {
          margin-bottom:5px;
        }

        .top {
          display:flex;
          justify-content:space-between;
          margin-bottom:40px;
        }

        table {
          width:100%;
          border-collapse:collapse;
          margin-top:30px;
        }

        th,
        td {
          border-bottom:1px solid #ddd;
          padding:12px;
          text-align:left;
        }

        .total {
          margin-top:30px;
          text-align:right;
          font-size:24px;
          font-weight:bold;
        }

        .small {
          color:#666;
          margin-top:30px;
        }

      </style>

    </head>

    <body>

      <div class="top">

        <div>

          <h1>
            NovaShop
          </h1>

          <p>
            Boutique gaming
          </p>

        </div>

        <div>

          <strong>
            Facture
          </strong>

          <p>
            Commande #${escapeHTML(
              order.id
            )}
          </p>

        </div>

      </div>

      <h3>
        Client
      </h3>

      ${
        customerName
          ? `
            <p>
              <strong>
                ${escapeHTML(customerName)}
              </strong>
            </p>
          `
          : ""
      }

      <p>
        ${escapeHTML(
          order.userEmail || ""
        )}
      </p>

      <p>
        ${escapeHTML(
          order.address || ""
        )}
      </p>

      ${
        order.city
          ? `
            <p>
              ${escapeHTML(order.city)}
            </p>
          `
          : ""
      }

      <h3>
        Produits
      </h3>

      <table>

        <thead>

          <tr>
            <th>Produit</th>
            <th>Qté</th>
            <th>Prix</th>
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

      <p class="small">
        Statut :
        ${escapeHTML(
          order.status ||
          "Enregistrée"
        )}
      </p>

      <script>
        window.onload = function() {
          window.print();
        };
      <\/script>

    </body>

    </html>
  `);

  invoiceWindow.document.close();
}


// ============================================================
// ADMIN
// ============================================================

adminBtn?.addEventListener(
  "click",
  openAdmin
);


function isAdminUser() {

  return (
    currentUser &&
    (
      currentUser.email || ""
    ).toLowerCase() ===
    ADMIN_EMAIL.toLowerCase()
  );
}


function openAdmin() {

  if (!isAdminUser()) {

    toast(
      "Accès administrateur refusé."
    );

    return;
  }

  const authorized =
    localStorage.getItem(
      ADMIN_ACCESS_KEY
    ) === "true";

  if (!authorized) {

    const code =
      prompt(
        "Code administrateur NovaShop :"
      );

    if (code !== ADMIN_CODE) {

      toast(
        "Code administrateur incorrect.",
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


async function loadAdmin() {

  showModal(
    "Administration NovaShop",
    `
      <div
        id="adminLoading"
        style="
          text-align:center;
          padding:30px;
        "
      >
        Chargement...
      </div>

      <div id="adminContent"></div>
    `
  );

  try {

    const snapshot =
      await getDocs(
        collection(db, "orders")
      );

    const orders = [];

    snapshot.forEach(item => {

      orders.push({
        id: item.id,
        ...item.data()
      });

    });

    orders.sort(
      (a, b) => {

        const aTime =
          a.createdAt?.seconds || 0;

        const bTime =
          b.createdAt?.seconds || 0;

        return bTime - aTime;

      }
    );

    renderAdmin(orders);

  } catch (error) {

    console.error(
      "Admin Firestore Error:",
      error
    );

    const loading =
      $("adminLoading");

    if (loading) {

      loading.innerHTML = `
        <div style="color:#ff7777;">
          Erreur Firestore :
          ${escapeHTML(
            error.message || ""
          )}
        </div>
      `;

    }
  }
}


function renderAdmin(orders) {

  $("adminLoading")?.remove();

  const content =
    $("adminContent");

  if (!content) {
    return;
  }

  const statuses = [
    "Enregistrée",
    "Acceptée",
    "Préparation",
    "En transit",
    "Livraison proche",
    "Livrée",
    "Annulée",
    "Remboursement en cours"
  ];

  content.innerHTML = `

    <div style="
      padding:15px;
      margin-bottom:18px;
      border-radius:16px;
      background:rgba(80,120,255,.08);
    ">

      <strong>
        🛡️ Administration
      </strong>

      <p style="margin-top:6px;">
        ${orders.length}
        commande${orders.length > 1 ? "s" : ""}
      </p>

    </div>

    <div style="
      padding:16px;
      margin-bottom:18px;
      border-radius:16px;
      background:rgba(255,255,255,.04);
    ">

      <strong>
        💳 Carte
      </strong>

      <p style="
        margin-top:6px;
        opacity:.7;
      ">
        Carte utilisable uniquement sur NovaShop.
      </p>

      <div id="testCardContainer">
        ${renderTestCardHTML()}
      </div>

    </div>

    <div style="
      display:flex;
      gap:10px;
      flex-wrap:wrap;
      margin-bottom:20px;
    ">

      <button
        type="button"
        class="view-btn"
        id="adminRefresh"
      >
        🔄 Actualiser
      </button>

      <button
        type="button"
        class="view-btn"
        id="adminLogout"
      >
        🔐 Quitter admin
      </button>

    </div>

    <div id="adminOrders">

      ${
        orders.length
          ? orders.map(order => {

              const items =
                Array.isArray(order.items)
                  ? order.items
                  : [];

              const productsText =
                items
                  .map(
                    item =>
                      `${
                        item.name ||
                        item.id
                      } ×${
                        item.quantity ||
                        1
                      }`
                  )
                  .join(", ");

              const customerName =
                `${order.firstName || ""} ${order.lastName || ""}`
                  .trim();

              return `

                <div
                  class="admin-order"
                  style="
                    padding:16px;
                    margin-bottom:15px;
                    border:1px solid rgba(255,255,255,.1);
                    border-radius:16px;
                  "
                >

                  <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:10px;
                    flex-wrap:wrap;
                  ">

                    <strong>
                      #${escapeHTML(
                        order.id.slice(0, 8)
                      )}
                    </strong>

                    <strong>
                      ${money(
                        order.total || 0
                      )}
                    </strong>

                  </div>

                  ${
                    customerName
                      ? `
                        <p style="
                          margin:8px 0;
                        ">
                          👤 <strong>
                            ${escapeHTML(customerName)}
                          </strong>
                        </p>
                      `
                      : `
                        <p style="
                          margin:8px 0;
                        ">
                          👤 Nom non renseigné
                        </p>
                      `
                  }

                  <p style="
                    margin:8px 0;
                    opacity:.85;
                  ">
                    📧 ${
                      escapeHTML(
                        order.userEmail ||
                        "Inconnu"
                      )
                    }
                  </p>

                  <p style="
                    margin:8px 0;
                  ">
                    💳 ${
                      escapeHTML(
                        order.paymentMethod ||
                        "N/A"
                      )
                    }
                    |
                    ${
                      escapeHTML(
                        order.paymentStatus ||
                        "En attente"
                      )
                    }
                  </p>

                  <p style="
                    margin:8px 0;
                    opacity:.8;
                  ">
                    ${escapeHTML(
                      productsText
                    )}
                  </p>

                  <label>
                    Statut
                  </label>

                  <select
                    class="admin-status"
                    data-id="${escapeAttr(
                      order.id
                    )}"
                    style="
                      width:100%;
                      margin:6px 0 10px;
                    "
                  >

                    ${
                      statuses
                        .map(
                          status => `
                            <option
                              value="${escapeAttr(
                                status
                              )}"
                              ${
                                order.status ===
                                status
                                  ? "selected"
                                  : ""
                              }
                            >
                              ${escapeHTML(
                                status
                              )}
                            </option>
                          `
                        )
                        .join("")
                    }

                  </select>

                  <input
                    class="admin-city"
                    data-id="${escapeAttr(
                      order.id
                    )}"
                    value="${escapeAttr(
                      order.city || ""
                    )}"
                    placeholder="Ville de destination"
                    style="
                      width:100%;
                      margin-bottom:8px;
                    "
                  >

                  <input
                    class="admin-tracking"
                    data-id="${escapeAttr(
                      order.id
                    )}"
                    value="${escapeAttr(
                      order.tracking || ""
                    )}"
                    placeholder="Numéro de suivi"
                    style="
                      width:100%;
                      margin-bottom:8px;
                    "
                  >

                  <input
                    class="admin-delivery"
                    data-id="${escapeAttr(
                      order.id
                    )}"
                    value="${escapeAttr(
                      order.estimatedDelivery ||
                      ""
                    )}"
                    placeholder="Livraison estimée"
                    style="
                      width:100%;
                      margin-bottom:10px;
                    "
                  >

                  <div style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                  ">

                    <button
                      type="button"
                      class="add-btn admin-save"
                      data-id="${escapeAttr(
                        order.id
                      )}"
                    >
                      💾 Enregistrer
                    </button>

                    <button
                      type="button"
                      class="view-btn admin-paid"
                      data-id="${escapeAttr(
                        order.id
                      )}"
                    >
                      💰 Marquer payé
                    </button>

                    <button
                      type="button"
                      class="view-btn admin-invoice"
                      data-id="${escapeAttr(
                        order.id
                      )}"
                    >
                      🧾 Facture
                    </button>

                    <button
                      type="button"
                      class="view-btn admin-delete"
                      data-id="${escapeAttr(
                        order.id
                      )}"
                      style="
                        color:#ff7777;
                      "
                    >
                      🗑️ Supprimer
                    </button>

                  </div>

                </div>

              `;

            }).join("")
          : `
            <div style="
              text-align:center;
              padding:30px;
            ">

              <div style="
                font-size:50px;
              ">
                📦
              </div>

              <h3>
                Aucune commande
              </h3>

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


  $("adminLogout")
    ?.addEventListener(
      "click",
      () => {

        localStorage.removeItem(
          ADMIN_ACCESS_KEY
        );

        closeModal();

        toast(
          "Mode admin fermé."
        );

      }
    );


  attachTestCardButton();


  document
    .querySelectorAll(".admin-save")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          await saveAdminOrder(
            button.dataset.id
          );

        }
      );

    });


  document
    .querySelectorAll(".admin-paid")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          await markOrderPaid(
            button.dataset.id
          );

        }
      );

    });


  document
    .querySelectorAll(".admin-invoice")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const order =
            orders.find(
              item =>
                item.id ===
                button.dataset.id
            );

          if (order) {
            printInvoice(order);
          }

        }
      );

    });


  document
    .querySelectorAll(".admin-delete")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          await deleteAdminOrder(
            button.dataset.id
          );

        }
      );

    });
}


function attachTestCardButton() {

  const button =
    $("generateTestCard");

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {

      generateTestCard();

      const container =
        $("testCardContainer");

      if (container) {

        container.innerHTML =
          renderTestCardHTML();

        attachTestCardButton();

      }

    }
  );
}


async function saveAdminOrder(id) {

  try {

    const safeId =
      typeof CSS !== "undefined" &&
      typeof CSS.escape === "function"
        ? CSS.escape(id)
        : id.replace(
            /["\\]/g,
            "\\$&"
          );

    const status =
      document.querySelector(
        `.admin-status[data-id="${safeId}"]`
      )?.value ||
      "Enregistrée";

    const city =
      document.querySelector(
        `.admin-city[data-id="${safeId}"]`
      )?.value ||
      "";

    const tracking =
      document.querySelector(
        `.admin-tracking[data-id="${safeId}"]`
      )?.value ||
      "";

    const estimatedDelivery =
      document.querySelector(
        `.admin-delivery[data-id="${safeId}"]`
      )?.value ||
      "";

    await updateDoc(
      doc(db, "orders", id),
      {
        status,
        city,
        tracking,
        estimatedDelivery
      }
    );

    toast(
      "Commande mise à jour ✅",
      "success"
    );

  } catch (error) {

    console.error(error);

    toast(
      `Erreur : ${
        error.message ||
        error.code
      }`,
      "error"
    );

  }
}


async function markOrderPaid(id) {

  try {

    await updateDoc(
      doc(db, "orders", id),
      {
        paymentStatus:
          "Payé"
      }
    );

    toast(
      "Paiement marqué comme payé 💰",
      "success"
    );

    loadAdmin();

  } catch (error) {

    console.error(error);

    toast(
      `Erreur : ${
        error.message ||
        error.code
      }`,
      "error"
    );

  }
}


async function deleteAdminOrder(id) {

  const confirmed =
    confirm(
      "Supprimer définitivement cette commande ?"
    );

  if (!confirmed) {
    return;
  }

  try {

    await deleteDoc(
      doc(db, "orders", id)
    );

    toast(
      "Commande supprimée 🗑️",
      "success"
    );

    loadAdmin();

  } catch (error) {

    console.error(error);

    toast(
      `Erreur : ${
        error.message ||
        error.code
      }`,
      "error"
    );

  }
}


// ============================================================
// SETTINGS
// ============================================================

settingsBtn?.addEventListener(
  "click",
  openSettings
);


function getTheme() {

  return (
    localStorage.getItem(
      "novaThemeChoice"
    ) || "dark"
  );
}


function applyTheme() {

  const theme =
    getTheme();

  if (theme === "light") {

    document.documentElement.dataset.theme =
      "light";

  } else if (theme === "dark") {

    document.documentElement.dataset.theme =
      "dark";

  } else {

    const prefersDark =
      window.matchMedia &&
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    document.documentElement.dataset.theme =
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
      <div>

        <h3>
          Apparence
        </h3>

        <div style="
          display:grid;
          gap:10px;
          margin-top:12px;
        ">

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

        <p style="
          margin-top:20px;
          opacity:.7;
        ">
          Thème actuel :
          ${escapeHTML(current)}
        </p>

      </div>
    `
  );

  document
    .querySelectorAll(".theme-choice")
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
// CLIC DEHORS MODAL
// ============================================================

modal?.addEventListener(
  "click",
  event => {

    if (event.target === modal) {
      closeModal();
    }

  }
);


// ============================================================
// ERREURS FIREBASE
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
// API PUBLIQUE
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
