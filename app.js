import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

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


/* ============================================================
   FIREBASE
============================================================ */

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


/* ============================================================
   ADMIN
============================================================ */

const ADMIN_EMAIL = "pc2alex.les@gmail.com";
const ADMIN_CODE = "NOVA-ADMIN-2026";
const ADMIN_ACCESS_KEY = "novaAdminAuthorized";


/* ============================================================
   DOM
============================================================ */

const $ = id => document.getElementById(id);

const searchInput = $("searchInput");
const categoriesEl = $("categories");
const productsGrid = $("productGrid");

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

const toastContainer = $("toast");
const heroCartBtn = $("heroCartBtn");


/* ============================================================
   FALLBACK IMAGE
============================================================ */

const FALLBACK_IMAGE =
  "https://placehold.co/800x800/111827/ffffff?text=NovaShop";


/* ============================================================
   IMAGE SYSTEM
============================================================ */

function imageUrl(url) {

  if (!url) {
    return FALLBACK_IMAGE;
  }

  if (
    url.startsWith("./") ||
    url.startsWith("../") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  return "https://wsrv.nl/?url=" +
    encodeURIComponent(url);
}

window.imageError = function(img, original) {

  if (!img) return;

  const stage =
    img.dataset.imageStage || "proxy";

  if (stage === "proxy") {

    img.dataset.imageStage = "original";

    if (original) {
      img.src = original;
      return;
    }
  }

  img.dataset.imageStage = "fallback";
  img.src = FALLBACK_IMAGE;
};

function imageSrc(url) {
  return escapeAttribute(imageUrl(url));
}


/* ============================================================
   PRODUCTS
============================================================ */

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
    price:0,
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


/* ============================================================
   STATE
============================================================ */

let currentUser = null;
let selectedCategory = "Toutes";
let searchValue = "";
let cart = [];


/* ============================================================
   STORAGE
============================================================ */

function loadCart(){

  try{

    const saved =
      JSON.parse(
        localStorage.getItem("novaCart") || "[]"
      );

    if(Array.isArray(saved)){
      cart = saved;
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


/* ============================================================
   THEME
============================================================ */

function applyTheme(){

  const choice =
    localStorage.getItem("novaThemeChoice") || "dark";

  document.body.classList.remove("light");

  if(choice === "light"){
    document.body.classList.add("light");
  }

  if(choice === "auto"){

    if(
      window.matchMedia &&
      window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches
    ){
      document.body.classList.add("light");
    }
  }
}

applyTheme();


/* ============================================================
   MONEY
============================================================ */

function money(value){

  value = Number(value) || 0;

  if(value === 0){
    return "Gratuit";
  }

  return new Intl.NumberFormat(
    "fr-FR",
    {
      style:"currency",
      currency:"EUR"
    }
  ).format(value);
}


/* ============================================================
   TOAST
============================================================ */

function showToast(message){

  if(!toastContainer){
    console.log(message);
    return;
  }

  toastContainer.textContent = message;
  toastContainer.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer =
    setTimeout(() => {
      toastContainer.classList.remove("show");
    },2300);
}


/* ============================================================
   REVIEWS
============================================================ */

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
    rating:Number(
      rating.toFixed(1)
    )
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


/* ============================================================
   CATEGORIES
============================================================ */

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

  if(!categoriesEl) return;

  categoriesEl.innerHTML =
    getCategories()
      .map(category => `
        <button
          class="category ${
            category === selectedCategory
              ? "active"
              : ""
          }"
          data-category="${escapeAttribute(category)}"
        >
          ${escapeHTML(category)}
        </button>
      `)
      .join("");
}


/* ============================================================
   FILTER
============================================================ */

function filteredProducts(){

  const search =
    searchValue
      .trim()
      .toLowerCase();

  let list =
    products.filter(product => {

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

  const sort =
    $("sortSelect")?.value || "default";

  if(sort === "priceAsc"){
    list.sort(
      (a,b) => a.price - b.price
    );
  }

  if(sort === "priceDesc"){
    list.sort(
      (a,b) => b.price - a.price
    );
  }

  if(sort === "rating"){
    list.sort(
      (a,b) =>
        reviewData(b).rating -
        reviewData(a).rating
    );
  }

  return list;
}


/* ============================================================
   PRODUCT CARD
============================================================ */

function productCardHTML(product){

  const reviews =
    reviewData(product);

  return `
    <article class="product">

      <div class="product-img">

        ${
          product.new
            ? `
              <span
                style="
                  position:absolute;
                  top:12px;
                  left:12px;
                  z-index:2;
                  background:#25d695;
                  color:#03150e;
                  padding:5px 9px;
                  border-radius:999px;
                  font-size:11px;
                  font-weight:900;
                "
              >
                Nouveau
              </span>
            `
            : ""
        }

        <img
          src="${imageSrc(product.image)}"
          data-original="${escapeAttribute(product.image)}"
          alt="${escapeAttribute(product.name)}"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          onerror="imageError(this,this.dataset.original)"
        >

      </div>

      <div class="product-body">

        <div class="product-cat">
          ${escapeHTML(product.category)}
        </div>

        <h3>
          ${escapeHTML(product.name)}
        </h3>

        <div class="rating">

          <span class="stars">
            ${starsHTML(reviews.rating)}
          </span>

          <span>
            ${reviews.rating
              .toFixed(1)
              .replace(".",",")}
          </span>

          <span>
            · ${reviews.count.toLocaleString("fr-FR")} avis
          </span>

        </div>

        <div class="product-bottom">

          <div class="price">
            ${money(product.price)}
          </div>

          <div class="product-actions">

            <button
              class="view-btn"
              data-view="${product.id}"
            >
              Voir
            </button>

            <button
              class="add-btn"
              data-add="${product.id}"
            >
              🛒 Ajouter
            </button>

          </div>

        </div>

      </div>

    </article>
  `;
}


/* ============================================================
   RENDER PRODUCTS
============================================================ */

function renderProducts(){

  if(!productsGrid) return;

  const list =
    filteredProducts();

  productsGrid.innerHTML =
    list.length
      ? list.map(productCardHTML).join("")
      : `
        <div
          style="
            grid-column:1/-1;
            text-align:center;
            padding:50px 20px;
          "
        >

          <div style="font-size:40px">
            🔎
          </div>

          <h3>
            Aucun produit trouvé
          </h3>

          <p
            style="
              color:var(--muted);
              margin:10px 0 20px;
            "
          >
            Essaie une autre recherche ou une autre catégorie.
          </p>

          <button
            class="secondary"
            id="resetFilters"
          >
            Réinitialiser
          </button>

        </div>
      `;
}


/* ============================================================
   PRODUCT CLICK
============================================================ */

if(productsGrid){

  productsGrid.addEventListener(
    "click",
    event => {

      const viewButton =
        event.target.closest("[data-view]");

      const addButton =
        event.target.closest("[data-add]");

      const resetButton =
        event.target.closest("#resetFilters");

      if(viewButton){

        openProduct(
          viewButton.dataset.view
        );

        return;
      }

      if(addButton){

        const product =
          products.find(
            p => p.id === addButton.dataset.add
          );

        if(product){
          addToCart(
            product,
            addButton
          );
        }

        return;
      }

      if(resetButton){

        searchValue = "";

        if(searchInput){
          searchInput.value = "";
        }

        selectedCategory = "Toutes";

        renderCategories();
        renderProducts();
      }

    }
  );
}


/* ============================================================
   PRODUCT MODAL
============================================================ */

function openProduct(id){

  const product =
    products.find(
      p => p.id === id
    );

  if(!product || !modalContent) return;

  const reviews =
    reviewData(product);

  modalContent.innerHTML = `

    <div
      style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:25px;
      "
    >

      <div
        style="
          min-height:330px;
          background:#fff;
          border-radius:16px;
          overflow:hidden;
        "
      >

        <img
          src="${imageSrc(product.image)}"
          data-original="${escapeAttribute(product.image)}"
          alt="${escapeAttribute(product.name)}"
          style="
            width:100%;
            height:330px;
            object-fit:contain;
            padding:20px;
          "
          onerror="imageError(this,this.dataset.original)"
        >

      </div>

      <div>

        <div
          style="
            color:#5ea7ff;
            font-size:12px;
            font-weight:900;
            text-transform:uppercase;
            margin-bottom:10px;
          "
        >
          ${escapeHTML(product.category)}
        </div>

        <h2 style="line-height:1.2">
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
            · ${reviews.count.toLocaleString("fr-FR")} avis
          </span>

        </div>

        <div
          style="
            font-size:27px;
            font-weight:950;
            margin:18px 0;
          "
        >
          ${money(product.price)}
        </div>

        <button
          class="primary"
          id="modalAdd"
          style="width:100%"
        >
          🛒 Ajouter au panier
        </button>

        <div
          style="
            margin-top:25px;
            border-top:1px solid var(--line);
            padding-top:20px;
          "
        >

          <strong>
            Avis clients
          </strong>

          <div
            style="
              margin-top:12px;
              padding:13px;
              border:1px solid var(--line);
              border-radius:12px;
            "
          >
            <strong>
              Client NovaShop
            </strong>

            <div class="stars">
              ★★★★★
            </div>

            <p
              style="
                color:var(--muted);
                margin-top:6px;
              "
            >
              Produit conforme à la présentation.
              Bonne expérience générale.
            </p>
          </div>

          <div
            style="
              margin-top:10px;
              padding:13px;
              border:1px solid var(--line);
              border-radius:12px;
            "
          >
            <strong>
              Client vérifié
            </strong>

            <div class="stars">
              ★★★★★
            </div>

            <p
              style="
                color:var(--muted);
                margin-top:6px;
              "
            >
              Fiche claire et produit intéressant
              pour un setup gaming.
            </p>
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


/* ============================================================
   MODAL
============================================================ */

function openModal(){

  if(!modal) return;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(){

  if(!modal) return;

  modal.classList.remove("open");
  document.body.style.overflow = "";
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


/* ============================================================
   CART
============================================================ */

function addToCart(product, sourceButton){

  const existing =
    cart.find(
      item => item.id === product.id
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

function changeQuantity(id,delta){

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

function getCartTotal(){

  return cartDetailed()
    .reduce(
      (sum,item) =>
        sum +
        (Number(item.price) || 0) *
        Number(item.qty || 0),
      0
    );
}


/* ============================================================
   CART RENDER
============================================================ */

function renderCart(){

  if(!cartItems) return;

  const items =
    cartDetailed();

  const count =
    items.reduce(
      (sum,item) =>
        sum + item.qty,
      0
    );

  if(cartBadge){

    cartBadge.textContent =
      count > 99
        ? "99+"
        : count;
  }

  const total =
    getCartTotal();

  if(cartTotal){
    cartTotal.textContent =
      money(total);
  }

  if(!items.length){

    cartItems.innerHTML = `

      <div
        style="
          text-align:center;
          padding:50px 15px;
        "
      >

        <div style="font-size:45px">
          🛒
        </div>

        <h3>
          Ton panier est vide
        </h3>

        <p
          style="
            color:var(--muted);
            margin:8px 0 20px;
          "
        >
          Ajoute un produit pour commencer.
        </p>

        <button
          class="primary"
          id="emptyShop"
        >
          Voir les produits
        </button>

      </div>
    `;

    return;
  }

  cartItems.innerHTML =
    items.map(item => `

      <div class="cart-item">

        <img
          src="${imageSrc(item.image)}"
          data-original="${escapeAttribute(item.image)}"
          alt=""
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="imageError(this,this.dataset.original)"
        >

        <div>

          <h4>
            ${escapeHTML(item.name)}
          </h4>

          <p>
            ${money(item.price)}
          </p>

          <div class="qty">

            <button
              data-minus="${item.id}"
            >
              −
            </button>

            <strong>
              ${item.qty}
            </strong>

            <button
              data-plus="${item.id}"
            >
              +
            </button>

          </div>

        </div>

        <button
          data-remove="${item.id}"
          style="
            align-self:start;
            border:1px solid var(--line);
            background:transparent;
            color:var(--danger);
            border-radius:8px;
            padding:6px;
          "
        >
          ×
        </button>

      </div>

    `).join("");
}


/* ============================================================
   CART EVENTS
============================================================ */

if(cartItems){

  cartItems.addEventListener(
    "click",
    event => {

      const minus =
        event.target.closest("[data-minus]");

      const plus =
        event.target.closest("[data-plus]");

      const remove =
        event.target.closest("[data-remove]");

      const emptyShop =
        event.target.closest("#emptyShop");

      if(minus){

        changeQuantity(
          minus.dataset.minus,
          -1
        );

        return;
      }

      if(plus){

        changeQuantity(
          plus.dataset.plus,
          1
        );

        return;
      }

      if(remove){

        removeFromCart(
          remove.dataset.remove
        );

        return;
      }

      if(emptyShop){

        closeCart();

        $("shop")?.scrollIntoView({
          behavior:"smooth"
        });
      }

    }
  );
}


/* ============================================================
   CART OPEN / CLOSE
============================================================ */

function openCart(){

  if(cartOverlay){
    cartOverlay.classList.add("open");
  }

  if(cartDrawer){
    cartDrawer.classList.add("open");
  }

  document.body.style.overflow = "hidden";
}

function closeCart(){

  if(cartOverlay){
    cartOverlay.classList.remove("open");
  }

  if(cartDrawer){
    cartDrawer.classList.remove("open");
  }

  document.body.style.overflow = "";
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

if(heroCartBtn){
  heroCartBtn.onclick = openCart;
}


/* ============================================================
   CART ANIMATION
============================================================ */

function animateToCart(button,image){

  const animations =
    localStorage.getItem("novaAnimations") !== "false";

  if(!animations) return;
  if(!button || !cartBtn) return;

  const rect =
    button.getBoundingClientRect();

  const target =
    cartBtn.getBoundingClientRect();

  const img =
    document.createElement("img");

  img.src =
    imageUrl(image);

  img.onerror =
    () => {
      img.src = FALLBACK_IMAGE;
    };

  img.style.position = "fixed";
  img.style.zIndex = "9999";
  img.style.width = "46px";
  img.style.height = "46px";
  img.style.objectFit = "contain";
  img.style.background = "#fff";
  img.style.borderRadius = "10px";
  img.style.pointerEvents = "none";
  img.style.transition =
    "all .55s cubic-bezier(.2,.8,.2,1)";

  img.style.left =
    `${rect.left + rect.width / 2 - 23}px`;

  img.style.top =
    `${rect.top + rect.height / 2 - 23}px`;

  document.body.appendChild(img);

  requestAnimationFrame(() => {

    img.style.left =
      `${target.left + target.width / 2 - 13}px`;

    img.style.top =
      `${target.top + target.height / 2 - 13}px`;

    img.style.width = "26px";
    img.style.height = "26px";
    img.style.opacity = "0";
  });

  setTimeout(() => {

    img.remove();

    if(cartBtn.animate){

      cartBtn.animate(
        [
          {transform:"scale(1)"},
          {transform:"scale(1.12)"},
          {transform:"scale(1)"}
        ],
        {
          duration:300
        }
      );
    }

  },600);
}


/* ============================================================
   SEARCH
============================================================ */

if(searchInput){

  searchInput.addEventListener(
    "input",
    event => {

      searchValue =
        event.target.value;

      renderProducts();
    }
  );
}


/* ============================================================
   SORT
============================================================ */

const sortSelect =
  $("sortSelect");

if(sortSelect){

  sortSelect.addEventListener(
    "change",
    renderProducts
  );
}


/* ============================================================
   CATEGORY
============================================================ */

if(categoriesEl){

  categoriesEl.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest("[data-category]");

      if(!button) return;

      selectedCategory =
        button.dataset.category;

      renderCategories();
      renderProducts();
    }
  );
}


/* ============================================================
   SETTINGS
============================================================ */

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

    <div>

      <h2>
        Paramètres
      </h2>

      <div
        style="
          margin-top:22px;
          display:grid;
          gap:20px;
        "
      >

        <div>

          <strong>
            Apparence
          </strong>

          <p
            style="
              color:var(--muted);
              font-size:13px;
              margin:5px 0 8px;
            "
          >
            Choisis l'apparence de NovaShop.
          </p>

          <select
            id="themeSelect"
            style="width:100%"
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

        <div>

          <strong>
            Langue
          </strong>

          <select
            id="languageSelect"
            style="width:100%;margin-top:8px"
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

        <div>

          <strong>
            Animations
          </strong>

          <p
            style="
              color:var(--muted);
              font-size:13px;
              margin:5px 0 10px;
            "
          >
            Animations du panier et de l'interface.
          </p>

          <button
            id="animationSwitch"
            style="
              width:60px;
              height:32px;
              border:0;
              border-radius:20px;
              background:${
                animations
                  ? "var(--blue)"
                  : "var(--line)"
              };
              position:relative;
            "
          >

            <span
              style="
                position:absolute;
                top:4px;
                left:${
                  animations
                    ? "32px"
                    : "4px"
                };
                width:24px;
                height:24px;
                border-radius:50%;
                background:white;
                transition:.2s;
              "
            ></span>

          </button>

        </div>

        <div
          style="
            padding:15px;
            border:1px solid var(--line);
            border-radius:13px;
            background:var(--card);
          "
        >

          <strong>
            Informations
          </strong>

          <p
            style="
              color:var(--muted);
              font-size:13px;
              margin-top:6px;
            "
          >
            NovaShop contient actuellement
            ${products.length} produits.
          </p>

        </div>

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

      openSettings();
    };

  openModal();
}


/* ============================================================
   LANGUAGE
============================================================ */

function applyLanguage(language){

  if(searchInput){

    searchInput.placeholder =
      language === "en"
        ? "Search for a product..."
        : "Rechercher un produit...";
  }

  if(heroCartBtn){

    heroCartBtn.textContent =
      language === "en"
        ? "View my cart"
        : "Voir mon panier";
  }
}


/* ============================================================
   ACCOUNT
============================================================ */

function openAccount(){

  if(currentUser){

    modalContent.innerHTML = `

      <div>

        <h2>
          Mon compte
        </h2>

        <div
          style="
            margin:20px 0;
            padding:15px;
            border:1px solid var(--line);
            border-radius:13px;
            background:var(--card);
          "
        >

          <strong>
            Compte connecté
          </strong>

          <p
            style="
              color:var(--muted);
              margin-top:7px;
            "
          >
            ${escapeHTML(
              currentUser.email || ""
            )}
          </p>

        </div>

        <button
          class="secondary"
          id="logoutBtn"
          style="
            width:100%;
            color:var(--danger);
          "
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
            authError(error.code)
          );
        }
      };

    openModal();
    return;
  }

  let mode = "login";

  function draw(){

    modalContent.innerHTML = `

      <div>

        <h2>
          ${
            mode === "login"
              ? "Connexion"
              : "Créer un compte"
          }
        </h2>

        <div
          style="
            display:grid;
            gap:12px;
            margin-top:20px;
          "
        >

          <input
            id="authEmail"
            type="email"
            autocomplete="email"
            placeholder="Adresse e-mail"
            style="width:100%"
          >

          <input
            id="authPassword"
            type="password"
            autocomplete="${
              mode === "login"
                ? "current-password"
                : "new-password"
            }"
            placeholder="Mot de passe"
            style="width:100%"
          >

          <button
            class="primary"
            id="authSubmit"
          >
            ${
              mode === "login"
                ? "Se connecter"
                : "Créer mon compte"
            }
          </button>

          <button
            class="secondary"
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
            ?.value
            ?.trim();

        const password =
          $("authPassword")
            ?.value || "";

        if(!email || !password){

          showToast(
            "Remplis tous les champs"
          );

          return;
        }

        if(
          mode === "register" &&
          password.length < 6
        ){

          showToast(
            "Mot de passe : 6 caractères minimum"
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
            "Connexion réussie ✓"
          );

        }catch(error){

          console.error(
            "Firebase Auth:",
            error
          );

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


/* ============================================================
   CHECKOUT HELPERS
============================================================ */

function calculateDiscountedTotal(total,promo){

  if(
    String(promo || "")
      .trim()
      .toUpperCase() === "NOVA100"
  ){
    return 0;
  }

  return Number(
    total.toFixed(2)
  );
}

function validateAddress(address){

  if(!address){
    return false;
  }

  const firstName =
    String(
      address.firstName || ""
    ).trim();

  const lastName =
    String(
      address.lastName || ""
    ).trim();

  const street =
    String(
      address.street || ""
    ).trim();

  const postal =
    String(
      address.postalCode || ""
    ).trim();

  const city =
    String(
      address.city || ""
    ).trim();

  const country =
    String(
      address.country || ""
    ).trim();

  if(
    firstName.length < 2 ||
    lastName.length < 2 ||
    street.length < 5 ||
    postal.length < 4 ||
    city.length < 2 ||
    country.length < 2
  ){
    return false;
  }

  if(
    country
      .toLowerCase()
      .includes("france") &&
    !/^\d{5}$/.test(postal)
  ){
    return false;
  }

  return true;
}


/* ============================================================
   CHECKOUT
============================================================ */

function openCheckout(){

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
      "Connecte-toi pour commander"
    );

    openAccount();

    return;
  }

  const subtotal =
    getCartTotal();

  modalContent.innerHTML = `

    <div>

      <h2>
        Finaliser ma commande
      </h2>

      <p
        style="
          color:var(--muted);
          margin-top:6px;
        "
      >
        Livraison et paiement
      </p>

      <div
        style="
          margin-top:20px;
          display:grid;
          gap:12px;
        "
      >

        <h3>
          📍 Adresse de livraison
        </h3>

        <input
          id="checkoutFirstName"
          type="text"
          autocomplete="given-name"
          placeholder="Prénom *"
          style="width:100%"
        >

        <input
          id="checkoutLastName"
          type="text"
          autocomplete="family-name"
          placeholder="Nom *"
          style="width:100%"
        >

        <input
          id="checkoutStreet"
          type="text"
          autocomplete="street-address"
          placeholder="Adresse *"
          style="width:100%"
        >

        <div
          style="
            display:grid;
            grid-template-columns:130px 1fr;
            gap:10px;
          "
        >

          <input
            id="checkoutPostal"
            type="text"
            inputmode="numeric"
            autocomplete="postal-code"
            placeholder="Code postal *"
            style="width:100%"
          >

          <input
            id="checkoutCity"
            type="text"
            autocomplete="address-level2"
            placeholder="Ville *"
            style="width:100%"
          >

        </div>

        <input
          id="checkoutCountry"
          type="text"
          autocomplete="country-name"
          value="France"
          placeholder="Pays *"
          style="width:100%"
        >

        <h3 style="margin-top:10px">
          🎟️ Code promo
        </h3>

        <div
          style="
            display:grid;
            grid-template-columns:1fr auto;
            gap:8px;
          "
        >

          <input
            id="promoCode"
            type="text"
            placeholder="Code promo"
            style="width:100%"
          >

          <button
            class="secondary"
            id="applyPromo"
          >
            Appliquer
          </button>

        </div>

        <div
          id="promoMessage"
          style="
            min-height:20px;
            font-size:13px;
          "
        ></div>

        <div
          style="
            margin-top:5px;
            padding:16px;
            border:1px solid var(--line);
            border-radius:14px;
            background:var(--card);
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
              margin-top:10px;
            "
          >

            <span>
              Réduction
            </span>

            <strong id="discountValue">
              0,00 €
            </strong>

          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              margin-top:14px;
              padding-top:14px;
              border-top:1px solid var(--line);
              font-size:20px;
            "
          >

            <strong>
              Total
            </strong>

            <strong id="checkoutFinalTotal">
              ${money(subtotal)}
            </strong>

          </div>

        </div>

        <h3 style="margin-top:7px">
          💳 Moyen de paiement
        </h3>

        <div class="payment-buttons">

          <button
            class="primary paypal-button"
            id="paypalPaymentButton"
          >
            🅿️ Payer avec PayPal
          </button>

          <button
            class="primary card-button"
            id="cardPaymentButton"
          >
            💳 Payer par CB
          </button>

        </div>

        <button
          class="primary"
          id="confirmCheckout"
          style="width:100%;margin-top:3px"
        >
          Continuer avec PayPal
        </button>

      </div>

    </div>
  `;

  let promoApplied = false;
  let paymentMode = "paypal";

  $("applyPromo").onclick =
    () => {

      const code =
        $("promoCode")
          ?.value
          ?.trim()
          .toUpperCase();

      const message =
        $("promoMessage");

      const discount =
        $("discountValue");

      const finalTotal =
        $("checkoutFinalTotal");

      if(code === "NOVA100"){

        promoApplied = true;

        if(message){

          message.textContent =
            "✓ Code NOVA100 appliqué : commande gratuite";

          message.style.color =
            "#25d695";
        }

        if(discount){
          discount.textContent =
            money(subtotal);
        }

        if(finalTotal){
          finalTotal.textContent =
            money(0);
        }

        showToast(
          "NOVA100 activé ✓"
        );

        return;
      }

      promoApplied = false;

      if(message){

        message.textContent =
          code
            ? "Code promo invalide."
            : "Entre un code promo.";

        message.style.color =
          "var(--danger)";
      }

      if(discount){
        discount.textContent =
          "0,00 €";
      }

      if(finalTotal){
        finalTotal.textContent =
          money(subtotal);
      }
    };


  $("paypalPaymentButton").onclick =
    () => {

      paymentMode = "paypal";

      $("confirmCheckout").textContent =
        "Continuer avec PayPal";

      showToast(
        "PayPal sélectionné"
      );
    };


  $("cardPaymentButton").onclick =
    () => {

      paymentMode = "card-demo";

      openDemoCardPayment(
        items,
        subtotal,
        promoApplied
      );
    };


  $("confirmCheckout").onclick =
    async () => {

      if(paymentMode !== "paypal"){
        return;
      }

      const address = {

        firstName:
          $("checkoutFirstName")
            ?.value
            ?.trim() || "",

        lastName:
          $("checkoutLastName")
            ?.value
            ?.trim() || "",

        street:
          $("checkoutStreet")
            ?.value
            ?.trim() || "",

        postalCode:
          $("checkoutPostal")
            ?.value
            ?.trim() || "",

        city:
          $("checkoutCity")
            ?.value
            ?.trim() || "",

        country:
          $("checkoutCountry")
            ?.value
            ?.trim() || ""
      };

      if(!validateAddress(address)){

        showToast(
          "Adresse de livraison invalide ou incomplète"
        );

        return;
      }

      const enteredCode =
        $("promoCode")
          ?.value
          ?.trim()
          .toUpperCase() || "";

      if(enteredCode === "NOVA100"){
        promoApplied = true;
      }

      const finalTotal =
        calculateDiscountedTotal(
          subtotal,
          promoApplied
            ? "NOVA100"
            : ""
        );

      await createCheckoutOrder(
        items,
        subtotal,
        finalTotal,
        address,
        promoApplied
      );
    };

  openModal();
}


/* ============================================================
   DEMO CB
============================================================ */

function openDemoCardPayment(
  items,
  subtotal,
  promoApplied
){

  modalContent.innerHTML = `

    <div>

      <button
        class="secondary"
        id="backToPayment"
        style="margin-bottom:15px"
      >
        ← Retour
      </button>

      <h2>
        💳 Paiement par CB
      </h2>

      <p
        style="
          color:var(--muted);
          margin-top:6px;
        "
      >
        Interface de démonstration
      </p>

      <div class="demo-warning">
        ⚠️ <strong>Démo uniquement.</strong><br>
        N'entre aucune vraie donnée bancaire.
        Ces champs ne sont pas connectés à un service bancaire
        et les données saisies ne sont ni envoyées ni enregistrées.
      </div>

      <div
        style="
          margin-top:20px;
          display:grid;
          gap:12px;
        "
      >

        <input
          id="demoCardName"
          type="text"
          autocomplete="off"
          placeholder="Nom complet (démo)"
        >

        <input
          id="demoCardNumber"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          placeholder="XXXX XXXX XXXX XXXX"
          maxlength="19"
        >

        <div
          style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
          "
        >

          <input
            id="demoCardExpiry"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="MM/AA"
            maxlength="5"
          >

          <input
            id="demoCardCvv"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="CVV"
            maxlength="4"
          >

        </div>

        <div
          id="demoCardError"
          class="card-error"
        >
          ❌ Carte incorrecte
        </div>

        <button
          class="primary"
          id="demoCardPayButton"
          style="
            width:100%;
            margin-top:5px;
          "
        >
          💳 Valider le paiement
        </button>

      </div>

    </div>
  `;


  $("backToPayment").onclick =
    () => {

      closeModal();

      setTimeout(() => {

        openCheckout();

      },50);
    };


  /*
    IMPORTANT :
    Les valeurs saisies ne sont jamais stockées,
    jamais envoyées à Firebase et jamais ajoutées à la commande.
  */

  $("demoCardPayButton").onclick =
    () => {

      const name =
        $("demoCardName")?.value || "";

      const number =
        $("demoCardNumber")?.value || "";

      const expiry =
        $("demoCardExpiry")?.value || "";

      const cvv =
        $("demoCardCvv")?.value || "";

      /*
        On vérifie seulement que les champs
        ne sont pas complètement vides.
        Les valeurs sont immédiatement abandonnées.
      */

      const filled =
        Boolean(
          name.trim() &&
          number.trim() &&
          expiry.trim() &&
          cvv.trim()
        );

      const error =
        $("demoCardError");

      if(error){

        error.textContent =
          filled
            ? "❌ Carte incorrecte"
            : "❌ Carte incorrecte";

        error.classList.add("show");
      }

      showToast(
        "Carte incorrecte"
      );

      /*
        Suppression des références locales.
        Aucune donnée n'est enregistrée.
      */

      void name;
      void number;
      void expiry;
      void cvv;
    };
}


/* ============================================================
   CREATE ORDER
============================================================ */

async function createCheckoutOrder(
  items,
  subtotal,
  total,
  address,
  promoApplied
){

  if(!currentUser){

    showToast(
      "Connecte-toi pour commander"
    );

    return;
  }

  const button =
    $("confirmCheckout");

  if(button){
    button.disabled = true;
    button.textContent =
      "Création de la commande...";
  }

  try{

    const orderData = {

      userId:
        currentUser.uid,

      email:
        currentUser.email || "",

      items:
        items.map(item => ({
          id:item.id,
          name:item.name,
          price:Number(item.price) || 0,
          qty:Number(item.qty) || 1
        })),

      subtotal:
        Number(subtotal.toFixed(2)),

      total:
        Number(total.toFixed(2)),

      promoCode:
        promoApplied
          ? "NOVA100"
          : "",

      discount:
        Number(
          (subtotal - total).toFixed(2)
        ),

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
    };


    const ref =
      await addDoc(
        collection(db,"orders"),
        orderData
      );


    if(total === 0){

      cart = [];

      saveCart();
      renderCart();

      closeModal();
      closeCart();

      showToast(
        "Commande gratuite enregistrée ✓"
      );

      printInvoiceHTML({
        ...orderData,
        id:ref.id
      });

      return;
    }


    const paypalAmount =
      Number(total.toFixed(2));

    const paypalURL =
      "https://paypal.me/SH0PNOVA/" +
      encodeURIComponent(
        paypalAmount.toFixed(2)
      ) +
      "EUR";


    cart = [];

    saveCart();
    renderCart();

    closeModal();
    closeCart();

    showToast(
      "Redirection vers PayPal..."
    );

    setTimeout(() => {

      window.location.href =
        paypalURL;

    },700);


  }catch(error){

    console.error(
      "Create order:",
      error
    );

    showToast(
      "Impossible de créer la commande."
    );

    if(button){

      button.disabled = false;

      button.textContent =
        "Continuer avec PayPal";
    }
  }
}


/* ============================================================
   CHECKOUT BUTTON
============================================================ */

if(checkoutBtn){

  checkoutBtn.onclick =
    openCheckout;
}


/* ============================================================
   ORDERS
============================================================ */

async function openOrders(){

  if(!currentUser){

    showToast(
      "Connecte-toi pour voir tes commandes"
    );

    openAccount();

    return;
  }

  modalContent.innerHTML = `

    <div>

      <h2>
        📦 Mes commandes
      </h2>

      <p
        style="
          color:var(--muted);
          margin-top:6px;
        "
      >
        Chargement...
      </p>

      <div id="ordersList"></div>

    </div>
  `;

  openModal();

  const ordersList =
    $("ordersList");

  try{

    const q =
      query(
        collection(db,"orders"),
        where(
          "userId",
          "==",
          currentUser.uid
        )
      );

    const snapshot =
      await getDocs(q);

    if(snapshot.empty){

      ordersList.innerHTML = `

        <div
          style="
            text-align:center;
            padding:40px 10px;
            color:var(--muted);
          "
        >
          Aucune commande pour le moment.
        </div>

      `;

      return;
    }

    const orders =
      snapshot.docs
        .map(docSnap => ({
          id:docSnap.id,
          ...docSnap.data()
        }))
        .sort(
          (a,b) =>
            getTimestampValue(b.createdAt) -
            getTimestampValue(a.createdAt)
        );

    ordersList.innerHTML =
      orders.map(order => {

        const estimated =
          order.estimatedDelivery
            ? new Date(
                order.estimatedDelivery
              ).toLocaleDateString("fr-FR")
            : "Non définie";

        return `

          <div class="admin-order">

            <strong>
              Commande #${escapeHTML(
                order.id.slice(0,8)
              )}
            </strong>

            <p
              style="
                color:var(--muted);
                margin-top:6px;
              "
            >
              ${formatTimestamp(order.createdAt)}
            </p>

            <div
              style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;
                margin-top:12px;
              "
            >

              <div>
                <small style="color:var(--muted)">
                  Total
                </small>
                <strong style="display:block">
                  ${money(order.total)}
                </strong>
              </div>

              <div>
                <small style="color:var(--muted)">
                  Statut
                </small>
                <strong style="display:block">
                  ${escapeHTML(
                    order.status || "Enregistrée"
                  )}
                </strong>
              </div>

              <div>
                <small style="color:var(--muted)">
                  Ville
                </small>
                <strong style="display:block">
                  ${escapeHTML(
                    order.address?.city || ""
                  )}
                </strong>
              </div>

              <div>
                <small style="color:var(--muted)">
                  Livraison estimée
                </small>
                <strong style="display:block">
                  ${estimated}
                </strong>
              </div>

            </div>

          </div>

        `;
      }).join("");

  }catch(error){

    console.error(
      "Orders:",
      error
    );

    ordersList.innerHTML = `

      <p style="color:var(--danger)">
        Impossible de charger les commandes.
      </p>

    `;
  }
}


/* ============================================================
   ADMIN
============================================================ */

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

async function openAdmin(){

  if(!currentUser){

    showToast(
      "Connecte-toi avec le compte admin"
    );

    openAccount();

    return;
  }

  if(!isAdmin()){

    showToast(
      "Accès administrateur refusé"
    );

    return;
  }

  if(!adminAuthorized()){

    const code =
      prompt(
        "Code administrateur :"
      );

    if(code !== ADMIN_CODE){

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


/* ============================================================
   ORDER STATUSES
============================================================ */

const ORDER_STATUSES = [
  "Enregistrée",
  "Acceptée",
  "Préparation",
  "En transit",
  "Livraison proche",
  "Livrée"
];


/* ============================================================
   ADMIN RENDER
============================================================ */

async function renderAdmin(){

  if(!isAdmin() || !adminAuthorized()){
    return;
  }

  modalContent.innerHTML = `

    <div>

      <h2>
        🛡️ Administration NovaShop
      </h2>

      <p
        style="
          color:var(--muted);
          margin-top:6px;
        "
      >
        ${escapeHTML(
          currentUser.email
        )}
      </p>

      <div
        style="
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:10px;
          margin-top:20px;
        "
      >

        <div
          style="
            padding:15px;
            border:1px solid var(--line);
            border-radius:13px;
            background:var(--card);
          "
        >
          <small style="color:var(--muted)">
            Produits
          </small>
          <strong
            style="
              display:block;
              font-size:25px;
              margin-top:5px;
            "
          >
            ${products.length}
          </strong>
        </div>

        <div
          style="
            padding:15px;
            border:1px solid var(--line);
            border-radius:13px;
            background:var(--card);
          "
        >
          <small style="color:var(--muted)">
            Admin
          </small>
          <strong
            style="
              display:block;
              font-size:14px;
              margin-top:8px;
            "
          >
            Autorisé ✓
          </strong>
        </div>

      </div>

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:15px;
        "
      >

        <button
          class="secondary"
          id="removeAdminAuth"
        >
          Retirer accès admin
        </button>

        <button
          class="secondary"
          id="deleteAllOrders"
          style="color:var(--danger)"
        >
          Supprimer toutes les commandes
        </button>

      </div>

      <h3 style="margin-top:25px">
        Commandes
      </h3>

      <div id="adminOrders">
        Chargement...
      </div>

    </div>
  `;

  openModal();

  $("removeAdminAuth").onclick =
    () => {

      localStorage.removeItem(
        ADMIN_ACCESS_KEY
      );

      closeModal();

      showToast(
        "Accès admin retiré"
      );
    };

  $("deleteAllOrders").onclick =
    async () => {

      if(
        !confirm(
          "Supprimer toutes les commandes ?"
        )
      ){
        return;
      }

      try{

        const snapshot =
          await getDocs(
            collection(db,"orders")
          );

        for(const item of snapshot.docs){

          await deleteDoc(
            doc(
              db,
              "orders",
              item.id
            )
          );
        }

        showToast(
          "Toutes les commandes ont été supprimées"
        );

        renderAdmin();

      }catch(error){

        console.error(error);

        showToast(
          "Erreur pendant la suppression"
        );
      }
    };


  try{

    const snapshot =
      await getDocs(
        collection(db,"orders")
      );

    const container =
      $("adminOrders");

    if(snapshot.empty){

      container.innerHTML = `
        <p
          style="
            color:var(--muted);
            margin-top:15px;
          "
        >
          Aucune commande.
        </p>
      `;

      return;
    }

    const orders =
      snapshot.docs
        .map(docSnap => ({
          id:docSnap.id,
          ...docSnap.data()
        }))
        .sort(
          (a,b) =>
            getTimestampValue(b.createdAt) -
            getTimestampValue(a.createdAt)
        );

    container.innerHTML =
      orders.map(order => {

        const accepted =
          order.paymentStatus === "accepted" ||
          order.paymentStatus === "free";

        return `

          <div class="admin-order">

            <strong>
              #${escapeHTML(order.id.slice(0,8))}
            </strong>

            <p
              style="
                color:var(--muted);
                margin-top:5px;
              "
            >
              ${escapeHTML(
                order.email || ""
              )}
            </p>

            <div
              style="
                margin-top:10px;
                display:grid;
                gap:5px;
                font-size:13px;
              "
            >

              <div>
                Total :
                <strong>
                  ${money(order.total)}
                </strong>
              </div>

              <div>
                Paiement :
                <strong>
                  ${escapeHTML(
                    order.paymentMethod || ""
                  )}
                </strong>
              </div>

              <div>
                État paiement :
                <strong>
                  ${escapeHTML(
                    order.paymentStatus || ""
                  )}
                </strong>
              </div>

              <div>
                Promo :
                <strong>
                  ${escapeHTML(
                    order.promoCode || "Aucune"
                  )}
                </strong>
              </div>

              <div>
                Adresse :
                ${escapeHTML(
                  order.address?.street || ""
                )},
                ${escapeHTML(
                  order.address?.postalCode || ""
                )}
                ${escapeHTML(
                  order.address?.city || ""
                )}
              </div>

            </div>

            ${
              order.paymentMethod === "PayPal.Me" &&
              !accepted
                ? `
                  <button
                    class="primary"
                    style="
                      width:100%;
                      margin-top:12px;
                    "
                    data-accept-paypal="${order.id}"
                  >
                    ✓ Accepter le paiement PayPal
                  </button>
                `
                : ""
            }

            <div class="admin-grid">

              <select
                data-status="${order.id}"
              >

                ${ORDER_STATUSES.map(status => `
                  <option
                    value="${escapeAttribute(status)}"
                    ${
                      order.status === status
                        ? "selected"
                        : ""
                    }
                  >
                    ${escapeHTML(status)}
                  </option>
                `).join("")}

              </select>

              <input
                data-package-city="${order.id}"
                placeholder="Ville du colis"
                value="${escapeAttribute(
                  order.packageCity || ""
                )}"
              >

              <input
                data-tracking="${order.id}"
                placeholder="Numéro de suivi"
                value="${escapeAttribute(
                  order.trackingNumber || ""
                )}"
              >

              <input
                data-duration="${order.id}"
                placeholder="Délai livraison"
                value="${escapeAttribute(
                  order.deliveryDuration || ""
                )}"
              >

              <input
                data-estimated="${order.id}"
                type="date"
                value="${
                  order.estimatedDelivery || ""
                }"
              >

            </div>

            <div
              style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;
                margin-top:10px;
              "
            >

              <button
                class="primary"
                data-save-order="${order.id}"
              >
                💾 Enregistrer
              </button>

              <button
                class="secondary"
                data-print-order="${order.id}"
              >
                🖨️ Facture
              </button>

            </div>

          </div>

        `;
      }).join("");


    container.onclick =
      async event => {

        const accept =
          event.target.closest(
            "[data-accept-paypal]"
          );

        const save =
          event.target.closest(
            "[data-save-order]"
          );

        const print =
          event.target.closest(
            "[data-print-order]"
          );

        if(accept){

          await acceptPaypalOrder(
            accept.dataset.acceptPaypal
          );

          return;
        }

        if(save){

          await saveAdminOrder(
            save.dataset.saveOrder
          );

          return;
        }

        if(print){

          await printAdminInvoice(
            print.dataset.printOrder
          );

        }
      };

  }catch(error){

    console.error(
      "Admin:",
      error
    );

    $("adminOrders").innerHTML = `
      <p style="color:var(--danger)">
        Impossible de charger les commandes.
      </p>
    `;
  }
}


/* ============================================================
   ACCEPT PAYPAL
============================================================ */

async function acceptPaypalOrder(orderId){

  if(!isAdmin()){
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
        paymentStatus:"accepted",
        status:"Acceptée",
        paymentAcceptedAt:
          serverTimestamp()
      }
    );

    showToast(
      "Paiement PayPal accepté ✓"
    );

    renderAdmin();

  }catch(error){

    console.error(error);

    showToast(
      "Impossible d'accepter le paiement"
    );
  }
}


/* ============================================================
   SAVE ADMIN ORDER
============================================================ */

async function saveAdminOrder(orderId){

  if(!isAdmin()){
    return;
  }

  const status =
    document.querySelector(
      `[data-status="${CSS.escape(orderId)}"]`
    )?.value || "Enregistrée";

  const packageCity =
    document.querySelector(
      `[data-package-city="${CSS.escape(orderId)}"]`
    )?.value || "";

  const trackingNumber =
    document.querySelector(
      `[data-tracking="${CSS.escape(orderId)}"]`
    )?.value || "";

  const deliveryDuration =
    document.querySelector(
      `[data-duration="${CSS.escape(orderId)}"]`
    )?.value || "";

  const estimatedDelivery =
    document.querySelector(
      `[data-estimated="${CSS.escape(orderId)}"]`
    )?.value || "";

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
      "Commande mise à jour ✓"
    );

    renderAdmin();

  }catch(error){

    console.error(error);

    showToast(
      "Erreur de mise à jour"
    );
  }
}


/* ============================================================
   PRINT ADMIN INVOICE
============================================================ */

async function printAdminInvoice(orderId){

  try{

    const snapshot =
      await getDocs(
        collection(db,"orders")
      );

    const found =
      snapshot.docs.find(
        item => item.id === orderId
      );

    if(!found){

      showToast(
        "Commande introuvable"
      );

      return;
    }

    printInvoiceHTML({
      id:found.id,
      ...found.data()
    });

  }catch(error){

    console.error(error);

    showToast(
      "Impossible d'imprimer la facture"
    );
  }
}


/* ============================================================
   PRINT INVOICE
============================================================ */

function printInvoiceHTML(order){

  const popup =
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

  if(!popup){

    showToast(
      "Autorise les fenêtres popup pour imprimer"
    );

    return;
  }

  const productsHTML =
    (order.items || [])
      .map(item => `

        <tr>

          <td>
            ${escapeHTML(item.name)}
          </td>

          <td>
            ${item.qty}
          </td>

          <td>
            ${money(item.price)}
          </td>

        </tr>

      `)
      .join("");

  popup.document.write(`

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
          margin-top:25px;
          font-size:24px;
          font-weight:bold;
          text-align:right;
        }

        .box{
          margin-top:25px;
          padding:15px;
          background:#f5f5f5;
          border-radius:10px;
        }

      </style>

    </head>

    <body>

      <h1>
        NovaShop
      </h1>

      <p>
        Facture / commande
      </p>

      <div class="box">

        <strong>
          Commande :
        </strong>

        ${escapeHTML(order.id)}

        <br>

        <strong>
          Client :
        </strong>

        ${escapeHTML(order.email || "")}

        <br>

        <strong>
          Statut :
        </strong>

        ${escapeHTML(order.status || "")}

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

          </tr>

        </thead>

        <tbody>

          ${productsHTML}

        </tbody>

      </table>

      <div class="box">

        <strong>
          Livraison
        </strong>

        <br><br>

        ${escapeHTML(
          order.address?.firstName || ""
        )}
        ${escapeHTML(
          order.address?.lastName || ""
        )}

        <br>

        ${escapeHTML(
          order.address?.street || ""
        )}

        <br>

        ${escapeHTML(
          order.address?.postalCode || ""
        )}
        ${escapeHTML(
          order.address?.city || ""
        )}

        <br>

        ${escapeHTML(
          order.address?.country || ""
        )}

      </div>

      <div class="box">

        Moyen de paiement :
        <strong>
          ${escapeHTML(
            order.paymentMethod || ""
          )}
        </strong>

        <br>

        Statut paiement :
        <strong>
          ${escapeHTML(
            order.paymentStatus || ""
          )}
        </strong>

        <br>

        Code promo :
        <strong>
          ${escapeHTML(
            order.promoCode || "Aucun"
          )}
        </strong>

      </div>

      <div class="total">

        Total :
        ${money(order.total)}

      </div>

      <script>
        window.onload = () => {
          window.print();
        };
      <\/script>

    </body>

    </html>

  `);

  popup.document.close();
}


/* ============================================================
   AUTH STATE
============================================================ */

onAuthStateChanged(
  auth,
  user => {

    currentUser =
      user || null;

    if(adminBtn){

      const connectedEmail =
        user?.email
          ?.trim()
          .toLowerCase() || "";

      const adminEmail =
        ADMIN_EMAIL
          .trim()
          .toLowerCase();

      if(
        connectedEmail === adminEmail
      ){

        adminBtn.style.display =
          "grid";

      }else{

        adminBtn.style.display =
          "none";

        localStorage.removeItem(
          ADMIN_ACCESS_KEY
        );
      }
    }
  }
);


/* ============================================================
   BUTTONS
============================================================ */

if(settingsBtn){
  settingsBtn.onclick =
    openSettings;
}

if(accountBtn){
  accountBtn.onclick =
    openAccount;
}

if(ordersBtn){
  ordersBtn.onclick =
    openOrders;
}

if(adminBtn){
  adminBtn.onclick =
    openAdmin;
}


/* ============================================================
   ESCAPE
============================================================ */

document.addEventListener(
  "keydown",
  event => {

    if(event.key === "Escape"){

      closeModal();
      closeCart();

    }

  }
);


/* ============================================================
   HELPERS
============================================================ */

function escapeHTML(value){

  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function escapeAttribute(value){
  return escapeHTML(value);
}

function authError(code){

  const errors = {

    "auth/invalid-credential":
      "E-mail ou mot de passe incorrect.",

    "auth/invalid-login-credentials":
      "E-mail ou mot de passe incorrect.",

    "auth/email-already-in-use":
      "Cette adresse est déjà utilisée.",

    "auth/weak-password":
      "Le mot de passe doit contenir au moins 6 caractères.",

    "auth/invalid-email":
      "Adresse e-mail invalide.",

    "auth/network-request-failed":
      "Problème de connexion réseau.",

    "auth/too-many-requests":
      "Trop de tentatives. Réessaie plus tard.",

    "auth/user-not-found":
      "Compte introuvable.",

    "auth/operation-not-allowed":
      "Email / mot de passe n'est pas activé dans Firebase.",

    "auth/unauthorized-domain":
      "Ce domaine n'est pas autorisé dans Firebase.",

    "auth/invalid-api-key":
      "La clé API Firebase est invalide."
  };

  return (
    errors[code] ||
    "Une erreur est survenue."
  );
}


/* ============================================================
   TIMESTAMP
============================================================ */

function getTimestampValue(timestamp){

  if(!timestamp){
    return 0;
  }

  if(
    typeof timestamp.toMillis ===
    "function"
  ){
    return timestamp.toMillis();
  }

  if(
    typeof timestamp.toDate ===
    "function"
  ){
    return timestamp.toDate().getTime();
  }

  if(timestamp instanceof Date){
    return timestamp.getTime();
  }

  const date =
    new Date(timestamp);

  return isNaN(
    date.getTime()
  )
    ? 0
    : date.getTime();
}

function formatTimestamp(timestamp){

  const value =
    getTimestampValue(timestamp);

  if(!value){
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle:"medium",
      timeStyle:"short"
    }
  ).format(
    new Date(value)
  );
}


/* ============================================================
   INIT
============================================================ */

renderCategories();
renderProducts();
renderCart();

applyLanguage(
  localStorage.getItem(
    "novaLanguage"
  ) || "fr"
);


/* ============================================================
   PUBLIC API
============================================================ */

window.NovaShop = {

  products,

  openCart,

  closeCart,

  openProduct,

  openAccount,

  openOrders,

  openSettings,

  openAdmin,

  openCheckout,

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
        currentUser?.email || null
    };
  }
};


console.log(
  "NovaShop chargé ✓",
  products.length,
  "produits"
);
