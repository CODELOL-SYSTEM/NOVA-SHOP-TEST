trop grand mes les comme saTRP GROS IMAGE MES LES IMAGE DE CETTE TAILLE COMME SE JS VTIEN LES IMAGE refait AVEC ELLES // ============================================================
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

const firebaseConfig = { apiKey: "AIzaSyAZ5vAkAEfIBpfLyhxgO7uvNdJ67KYKWD0", authDomain: "novashop-4ee63.firebaseapp.com", projectId: "novashop-4ee63", storageBucket: "novashop-4ee63.firebasestorage.app", messagingSenderId: "1044964015809", appId: "1:1044964015809:web:4eafe0b1aede48f8539e40", measurementId: "G-XNY5X2VMY9" };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);


// ============================================================
// CONFIGURATION
// ============================================================

const ADMIN_EMAIL = "pc2alex.les@gmail.com";
const ADMIN_CODE = "NOVA-ADMIN-2026";
const ADMIN_ACCESS_KEY = "novaAdminAuthorized";

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
// COMMANDES
// ============================================================

ordersBtn?.addEventListener("click", openOrders);


async function openOrders() {

  if (!currentUser) {

    showLoginForm();

    return;
  }

  showModal(
    "Mes commandes",
    `
      <div id="ordersLoading" style="text-align:center;padding:30px;">
        Chargement des commandes...
      </div>

      <div id="ordersList"></div>
    `
  );

  try {

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid)
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

    orders.sort((a, b) => {

      const dateA =
        a.createdAt?.seconds || 0;

      const dateB =
        b.createdAt?.seconds || 0;

      return dateB - dateA;
    });

    const loading = $("ordersLoading");
    const list = $("ordersList");

    if (loading) {
      loading.remove();
    }

    if (!list) {
      return;
    }

    if (!orders.length) {

      list.innerHTML = `
        <div style="text-align:center;padding:30px;">
          <div style="font-size:50px;">📦</div>
          <h3>Aucune commande</h3>
          <p>Tu n'as pas encore passé de commande.</p>
        </div>
      `;

      return;
    }

    list.innerHTML = orders.map(order => {

      const total =
        Number(order.total || 0);

      const status =
        order.status || "Enregistrée";

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
              Commande #${escapeHTML(order.id.slice(0, 8))}
            </strong>

            <strong>
              ${money(total)}
            </strong>

          </div>

          <div style="margin-bottom:12px;">
            Statut :
            <strong>${escapeHTML(status)}</strong>
          </div>

          <button
            type="button"
            class="view-btn"
            data-order-id="${escapeHTML(order.id)}"
          >
            Voir la commande
          </button>

        </div>
      `;

    }).join("");

    list.addEventListener("click", event => {

      const button =
        event.target.closest("[data-order-id]");

      if (!button) {
        return;
      }

      const order =
        orders.find(
          item => item.id === button.dataset.orderId
        );

      if (order) {
        openOrderDetails(order);
      }

    });

  } catch (error) {

    console.error("Firestore Orders Error:", error);

    const loading = $("ordersLoading");

    if (loading) {

      loading.innerHTML = `
        <div style="color:#ff7777;">
          Impossible de charger les commandes.
          <br><br>
          ${escapeHTML(error.message || "")}
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
    order.status || "Enregistrée";

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

  const productsHTML = items.map(item => {

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
      : timeline.map((step, index) => {

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

        }).join("");

  showModal(
    `Commande #${order.id.slice(0, 8)}`,
    `
      <div>

        <div style="
          padding:16px;
          border-radius:16px;
          background:rgba(80,120,255,.08);
          margin-bottom:18px;
        ">

          <strong>
            Statut : ${escapeHTML(status)}
          </strong>

          ${
            order.tracking
              ? `
                <div style="margin-top:8px;">
                  Suivi : ${escapeHTML(order.tracking)}
                </div>
              `
              : ""
          }

          ${
            order.estimatedDelivery
              ? `
                <div style="margin-top:8px;">
                  Livraison estimée :
                  ${escapeHTML(order.estimatedDelivery)}
                </div>
              `
              : ""
          }

        </div>

        <h3>Suivi</h3>

        <div style="margin:12px 0 20px;">
          ${timelineHTML}
        </div>

        <h3>Produits</h3>

        <div style="margin:10px 0 20px;">
          ${productsHTML}
        </div>

        ${
          order.address
            ? `
              <h3>Livraison</h3>
              <p style="margin:8px 0 20px;">
                ${escapeHTML(order.address)}
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
          <strong>Total</strong>
          <strong>${money(order.total || 0)}</strong>
        </div>

        <button
          type="button"
          class="add-btn"
          id="invoiceBtn"
          style="width:100%;margin-top:18px;"
        >
          🧾 Voir la facture
        </button>

      </div>
    `
  );

  $("invoiceBtn")?.addEventListener(
    "click",
    () => printInvoice(order)
  );
}


// ============================================================
// CHECKOUT
// ============================================================

checkoutBtn?.addEventListener("click", openCheckout);


function openCheckout() {

  if (!cart.length) {

    toast("Ton panier est vide 🛒");

    return;
  }

  if (!currentUser) {

    toast("Connecte-toi pour commander.");

    showLoginForm();

    return;
  }

  const subtotal = getCartSubtotal();

  showModal(
    "Finaliser la commande",
    `
      <form id="checkoutForm">

        <div style="margin-bottom:14px;">

          <label for="checkoutAddress">
            Adresse de livraison
          </label>

          <textarea
            id="checkoutAddress"
            required
            rows="4"
            placeholder="Adresse complète"
          ></textarea>

        </div>

        <div style="margin-bottom:14px;">

          <label for="promoCode">
            Code promo
          </label>

          <input
            id="promoCode"
            type="text"
            placeholder="Code promo"
          >

          <small>
            Entre NOVA100 pour bénéficier de la promotion.
          </small>

        </div>

        <div
          id="promoResult"
          style="margin:10px 0;"
        ></div>

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
            <span>Sous-total</span>
            <strong id="checkoutSubtotal">
              ${money(subtotal)}
            </strong>
          </div>

          <div style="
            display:flex;
            justify-content:space-between;
            margin-top:8px;
          ">
            <span>Réduction</span>
            <strong id="checkoutDiscount">
              ${money(0)}
            </strong>
          </div>

          <div style="
            display:flex;
            justify-content:space-between;
            margin-top:12px;
            font-size:22px;
          ">
            <span>Total</span>
            <strong id="checkoutFinal">
              ${money(subtotal)}
            </strong>
          </div>

        </div>

        <h3>Mode de paiement</h3>

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

  let promoApplied = false;
  let paymentMethod = "";

  const promoInput = $("promoCode");
  const promoResult = $("promoResult");

  const subtotalEl = $("checkoutSubtotal");
  const discountEl = $("checkoutDiscount");
  const finalEl = $("checkoutFinal");

  function updateCheckout() {

    const subtotal = getCartSubtotal();

    const discount =
      promoApplied ? subtotal : 0;

    const final =
      Math.max(0, subtotal - discount);

    if (subtotalEl) {
      subtotalEl.textContent = money(subtotal);
    }

    if (discountEl) {
      discountEl.textContent = money(discount);
    }

    if (finalEl) {
      finalEl.textContent = money(final);
    }
  }

  promoInput?.addEventListener("input", () => {

    const code =
      promoInput.value
        .trim()
        .toUpperCase();

    promoApplied =
      code === "NOVA100";

    if (promoApplied) {

      promoResult.innerHTML = `
        <span style="color:#4ade80;">
          ✅ Code NOVA100 appliqué
        </span>
      `;

    } else if (code) {

      promoResult.innerHTML = `
        <span style="color:#ff7777;">
          ❌ Code promo invalide
        </span>
      `;

    } else {

      promoResult.innerHTML = "";
    }

    updateCheckout();
  });


  document
    .querySelectorAll(".payment-choice")
    .forEach(button => {

      button.addEventListener("click", () => {

        paymentMethod =
          button.dataset.payment || "";

        const input =
          $("paymentMethod");

        if (input) {
          input.value = paymentMethod;
        }

        document
          .querySelectorAll(".payment-choice")
          .forEach(item => {
            item.classList.remove("selected");
          });

        button.classList.add("selected");

        const info = $("paymentInfo");

        if (!info) {
          return;
        }

        if (paymentMethod === "paypal") {

          info.innerHTML = `
            <div style="
              padding:12px;
              border-radius:12px;
              background:rgba(60,130,255,.1);
            ">
              Tu seras redirigé vers PayPal pour effectuer
              le paiement.
            </div>
          `;

        } else {

          info.innerHTML = `
            <div style="
              padding:12px;
              border-radius:12px;
              background:rgba(255,180,0,.1);
            ">
              💳 Le paiement CB direct est actuellement
              en mode démonstration.
            </div>
          `;
        }
      });

    });


  $("checkoutForm")?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      const address =
        $("checkoutAddress")?.value.trim() || "";

      const errorBox =
        $("checkoutError");

      if (!address) {

        if (errorBox) {
          errorBox.textContent =
            "Indique ton adresse de livraison.";
          errorBox.style.display = "block";
        }

        return;
      }

      if (!paymentMethod) {

        if (errorBox) {
          errorBox.textContent =
            "Choisis un moyen de paiement.";
          errorBox.style.display = "block";
        }

        return;
      }

      const submit =
        $("checkoutSubmit");

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Création...";
      }

      try {

        const subtotal =
          getCartSubtotal();

        const discount =
          promoApplied ? subtotal : 0;

        const total =
          Math.max(0, subtotal - discount);

        const orderItems =
          cart.map(item => {

            const product =
              getProduct(item.id);

            return {
              id: item.id,
              name: product?.name || "Produit",
              price: product?.price || 0,
              quantity: item.quantity
            };

          });

        const orderData = {

          userId: currentUser.uid,

          userEmail:
            currentUser.email || "",

          items: orderItems,

          subtotal,

          discount,

          total,

          promoCode:
            promoApplied ? "NOVA100" : "",

          address,

          status:
            "Enregistrée",

          paymentMethod,

          paymentStatus:
            total === 0
              ? "Payé"
              : "En attente",

          tracking: "",

          city: "",

          estimatedDelivery: "",

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

        if (paymentMethod === "paypal" && total > 0) {

          const paypalUrl =
            `https://paypal.me/SH0PNOVA/${encodeURIComponent(total.toFixed(2))}EUR`;

          setTimeout(() => {

            window.open(
              paypalUrl,
              "_blank",
              "noopener,noreferrer"
            );

          }, 400);

        } else if (
          paymentMethod === "card" &&
          total > 0
        ) {

          showModal(
            "Paiement CB",
            `
              <div style="text-align:center;padding:20px;">

                <div style="font-size:60px;">
                  💳
                </div>

                <h3>
                  Paiement bancaire
                </h3>

                <p style="margin:15px 0;">
                  Le paiement CB direct est actuellement
                  en mode démonstration.
                </p>

                <p style="opacity:.7;">
                  Aucune donnée bancaire n'est enregistrée
                  par NovaShop.
                </p>

                <button
                  type="button"
                  class="add-btn"
                  id="closePaymentDemo"
                  style="width:100%;margin-top:15px;"
                >
                  Fermer
                </button>

              </div>
            `
          );

          $("closePaymentDemo")
            ?.addEventListener(
              "click",
              closeModal
            );
        }

      } catch (error) {

        console.error(
          "Firestore Checkout Error:",
          error
        );

        if (errorBox) {

          errorBox.textContent =
            `Erreur : ${error.message || error.code || "inconnue"}`;

          errorBox.style.display = "block";
        }

      } finally {

        if (submit) {
          submit.disabled = false;
          submit.textContent = "Continuer";
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

  const rows = items.map(item => {

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
        <td>${escapeHTML(name)}</td>
        <td>${quantity}</td>
        <td>${money(price)}</td>
        <td>${money(price * quantity)}</td>
      </tr>
    `;

  }).join("");

  const invoiceWindow =
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

  if (!invoiceWindow) {

    toast("La fenêtre de facture a été bloquée.");

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
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #111827;
        }

        h1 {
          margin-bottom: 5px;
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
          <h1>NovaShop</h1>
          <p>Boutique gaming</p>
        </div>

        <div>
          <strong>
            Facture
          </strong>

          <p>
            Commande #${escapeHTML(order.id)}
          </p>
        </div>

      </div>

      <h3>Client</h3>

      <p>
        ${escapeHTML(order.userEmail || "")}
      </p>

      <p>
        ${escapeHTML(order.address || "")}
      </p>

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

      ${
        order.promoCode
          ? `
            <p>
              Code promo :
              <strong>
                ${escapeHTML(order.promoCode)}
              </strong>
            </p>
          `
          : ""
      }

      <div class="total">
        Total :
        ${money(order.total || 0)}
      </div>

      <p class="small">
        Statut :
        ${escapeHTML(order.status || "Enregistrée")}
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

adminBtn?.addEventListener("click", openAdmin);


function isAdminUser() {

  return (
    currentUser &&
    (currentUser.email || "").toLowerCase() ===
    ADMIN_EMAIL.toLowerCase()
  );
}


function openAdmin() {

  if (!isAdminUser()) {

    toast("Accès administrateur refusé.");

    return;
  }

  const authorized =
    localStorage.getItem(ADMIN_ACCESS_KEY) === "true";

  if (!authorized) {

    const code =
      prompt("Code administrateur NovaShop :");

    if (code !== ADMIN_CODE) {

      toast("Code administrateur incorrect.", "error");

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
      <div id="adminLoading" style="text-align:center;padding:30px;">
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

    orders.sort((a, b) => {

      const aTime =
        a.createdAt?.seconds || 0;

      const bTime =
        b.createdAt?.seconds || 0;

      return bTime - aTime;
    });

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
          ${escapeHTML(error.message || "")}
        </div>
      `;
    }
  }
}


function renderAdmin(orders) {

  const loading =
    $("adminLoading");

  const content =
    $("adminContent");

  loading?.remove();

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
        ${orders.length} commande${orders.length > 1 ? "s" : ""}
      </p>

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
                  .map(item =>
                    `${item.name || item.id} ×${item.quantity || 1}`
                  )
                  .join(", ");

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
                      #${escapeHTML(order.id.slice(0, 8))}
                    </strong>

                    <strong>
                      ${money(order.total || 0)}
                    </strong>

                  </div>

                  <p style="margin:8px 0;">
                    👤 ${escapeHTML(order.userEmail || "Inconnu")}
                  </p>

                  <p style="margin:8px 0;">
                    💳 ${escapeHTML(order.paymentMethod || "N/A")}
                    |
                    ${
                      escapeHTML(
                        order.paymentStatus || "En attente"
                      )
                    }
                  </p>

                  <p style="
                    margin:8px 0;
                    opacity:.8;
                  ">
                    ${escapeHTML(productsText)}
                  </p>

                  <label>
                    Statut
                  </label>

                  <select
                    class="admin-status"
                    data-id="${escapeHTML(order.id)}"
                    style="width:100%;margin:6px 0 10px;"
                  >

                    ${
                      statuses.map(status => `
                        <option
                          value="${escapeHTML(status)}"
                          ${
                            order.status === status
                              ? "selected"
                              : ""
                          }
                        >
                          ${escapeHTML(status)}
                        </option>
                      `).join("")
                    }

                  </select>

                  <input
                    class="admin-city"
                    data-id="${escapeHTML(order.id)}"
                    value="${escapeHTML(order.city || "")}"
                    placeholder="Ville"
                    style="width:100%;margin-bottom:8px;"
                  >

                  <input
                    class="admin-tracking"
                    data-id="${escapeHTML(order.id)}"
                    value="${escapeHTML(order.tracking || "")}"
                    placeholder="Numéro de suivi"
                    style="width:100%;margin-bottom:8px;"
                  >

                  <input
                    class="admin-delivery"
                    data-id="${escapeHTML(order.id)}"
                    value="${escapeHTML(order.estimatedDelivery || "")}"
                    placeholder="Livraison estimée"
                    style="width:100%;margin-bottom:10px;"
                  >

                  <div style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                  ">

                    <button
                      type="button"
                      class="add-btn admin-save"
                      data-id="${escapeHTML(order.id)}"
                    >
                      💾 Enregistrer
                    </button>

                    <button
                      type="button"
                      class="view-btn admin-paid"
                      data-id="${escapeHTML(order.id)}"
                    >
                      💰 Marquer payé
                    </button>

                    <button
                      type="button"
                      class="view-btn admin-invoice"
                      data-id="${escapeHTML(order.id)}"
                    >
                      🧾 Facture
                    </button>

                  </div>

                </div>
              `;

            }).join("")
          : `
            <div style="text-align:center;padding:30px;">
              <div style="font-size:50px;">📦</div>
              <h3>Aucune commande</h3>
            </div>
          `
      }

    </div>
  `;


  $("adminRefresh")?.addEventListener(
    "click",
    loadAdmin
  );


  $("adminLogout")?.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        ADMIN_ACCESS_KEY
      );

      closeModal();

      toast("Mode admin fermé.");
    }
  );


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

}


async function saveAdminOrder(id) {

  try {

    const status =
      document.querySelector(
        `.admin-status[data-id="${CSS.escape(id)}"]`
      )?.value || "Enregistrée";

    const city =
      document.querySelector(
        `.admin-city[data-id="${CSS.escape(id)}"]`
      )?.value || "";

    const tracking =
      document.querySelector(
        `.admin-tracking[data-id="${CSS.escape(id)}"]`
      )?.value || "";

    const estimatedDelivery =
      document.querySelector(
        `.admin-delivery[data-id="${CSS.escape(id)}"]`
      )?.value || "";

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
      `Erreur : ${error.message || error.code}`,
      "error"
    );
  }
}


async function markOrderPaid(id) {

  try {

    await updateDoc(
      doc(db, "orders", id),
      {
        paymentStatus: "Payé"
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
      `Erreur : ${error.message || error.code}`,
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
      prefersDark ? "dark" : "light";
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
// NOVA100
// ============================================================

function handleNova100() {

  const code =
    prompt(
      "Entre ton code promotionnel :"
    );

  if (!code) {
    return;
  }

  if (
    code.trim().toUpperCase() ===
    "NOVA100"
  ) {

    if (!cart.length) {

      toast(
        "Ajoute d'abord un produit au panier."
      );

      return;
    }

    toast(
      "NOVA100 est disponible au checkout 🎉",
      "success"
    );

    openCart();

  } else {

    toast(
      "Code promotionnel invalide.",
      "error"
    );
  }
}


// Détection de NOVA100 dans la recherche
searchInput?.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter" &&
      searchInput.value
        .trim()
        .toUpperCase() === "NOVA100"
    ) {

      event.preventDefault();

      handleNova100();
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
// CLIC EN DEHORS DU MODAL
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
// ERREURS GLOBALES FIREBASE
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
      error?.code?.startsWith("auth/")
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

  money,

  handleNova100

};

console.log(
  "NovaShop chargé avec succès 🚀"
);
