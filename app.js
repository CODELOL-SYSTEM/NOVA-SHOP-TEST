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


/* =========================================================
   FALLBACK IMAGE
========================================================= */

const FALLBACK_IMAGE =
  "https://placehold.co/800x800/111827/ffffff?text=NovaShop";


function imageUrl(url) {

  if (!url) return FALLBACK_IMAGE;

  if (
    url.startsWith("./") ||
    url.startsWith("../") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  return "https://wsrv.nl/?url=" + encodeURIComponent(url);
}


window.imageError = function(img, original) {

  if (!img) return;

  const stage = img.dataset.imageStage || "proxy";

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


/* =========================================================
   STATE
========================================================= */

let currentUser = null;
let selectedCategory = "Toutes";
let searchValue = "";
let cart = [];


/* =========================================================
   STORAGE
========================================================= */

function loadCart(){

  try{

    const saved =
      JSON.parse(localStorage.getItem("novaCart") || "[]");

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

    if(
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ){
      document.body.classList.add("light");
    }
  }
}


applyTheme();


/* =========================================================
   MONEY
========================================================= */

function money(value){

  value = Number(value) || 0;

  if(value === 0){
    return "Gratuit";
  }

  return new Intl.NumberFormat("fr-FR",{
    style:"currency",
    currency:"EUR"
  }).format(value);
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message){

  if(!toastContainer){
    return;
  }

  toastContainer.textContent = message;
  toastContainer.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(()=>{
    toastContainer.classList.remove("show");
  },2300);
}


/* =========================================================
   REVIEWS
========================================================= */

function reviewData(product){

  const number =
    parseInt(product.id.replace("p",""),10);

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

  const rounded = Math.round(rating);

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
      products.map(product => product.category)
    )
  ];
}


function renderCategories(){

  if(!categoriesEl){
    return;
  }

  categoriesEl.innerHTML =
    getCategories()
      .map(category => `
        <button
          class="category ${category === selectedCategory ? "active" : ""}"
          data-category="${escapeAttribute(category)}"
        >
          ${escapeHTML(category)}
        </button>
      `)
      .join("");
}


/* =========================================================
   FILTER
========================================================= */

function filteredProducts(){

  const search =
    searchValue.trim().toLowerCase();

  let list =
    products.filter(product => {

      const categoryOK =
        selectedCategory === "Toutes" ||
        product.category === selectedCategory;

      const searchOK =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      return categoryOK && searchOK;
    });

  const sort =
    $("sortSelect")?.value || "default";

  if(sort === "priceAsc"){
    list.sort((a,b)=>a.price-b.price);
  }

  if(sort === "priceDesc"){
    list.sort((a,b)=>b.price-a.price);
  }

  if(sort === "rating"){
    list.sort(
      (a,b)=>
        reviewData(b).rating -
        reviewData(a).rating
    );
  }

  return list;
}


/* =========================================================
   PRODUCT CARD
========================================================= */

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
            ${reviews.rating.toFixed(1).replace(".",",")}
          </span>

          <span>
            · ${reviews.count.toLocaleString("fr-FR")} avis
          </span>
        </div>

        <div class="product-bottom">

          <div
            class="price"
            style="font-size:19px"
          >
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


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(){

  if(!productsGrid){
    return;
  }

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


/* =========================================================
   PRODUCT CLICK
========================================================= */

if(productsGrid){

  productsGrid.addEventListener("click",event=>{

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
          p =>
            p.id ===
            addButton.dataset.add
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

  });
}


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProduct(id){

  const product =
    products.find(p=>p.id===id);

  if(!product || !modalContent){
    return;
  }

  const reviews =
    reviewData(product);

  if(modalTitle){
    modalTitle.textContent =
      product.name;
  }

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
            ${reviews.rating.toFixed(1).replace(".",",")}
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

      </div>

    </div>
  `;

  const addButton =
    $("modalAdd");

  if(addButton){

    addButton.onclick =
      event =>
        addToCart(
          product,
          event.currentTarget
        );
  }

  openModal();
}


/* =========================================================
   MODAL
========================================================= */

function openModal(){

  if(!modal){
    return;
  }

  modal.classList.add("open");

  document.body.style.overflow =
    "hidden";
}


function closeModal(){

  if(!modal){
    return;
  }

  modal.classList.remove("open");

  document.body.style.overflow = "";
}


if(modalClose){
  modalClose.onclick =
    closeModal;
}


if(modal){

  modal.addEventListener("click",event=>{

    if(event.target === modal){
      closeModal();
    }

  });
}


/* =========================================================
   CART
========================================================= */

function addToCart(product,sourceButton){

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

  showToast(
    "Produit ajouté au panier"
  );

  closeModal();
}


function removeFromCart(id){

  cart =
    cart.filter(
      item =>
        item.id !== id
    );

  saveCart();
  renderCart();
}


function changeQuantity(id,delta){

  const item =
    cart.find(
      item =>
        item.id === id
    );

  if(!item){
    return;
  }

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
    .map(item=>{

      const product =
        products.find(
          p =>
            p.id === item.id
        );

      if(!product){
        return null;
      }

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
      (sum,item)=>
        sum +
        (Number(item.price)||0) *
        Number(item.qty||0),
      0
    );
}


function renderCart(){

  if(!cartItems){
    return;
  }

  const items =
    cartDetailed();

  const count =
    items.reduce(
      (sum,item)=>
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

      <div class="empty">

        <div style="font-size:45px">
          🛒
        </div>

        <h3>
          Ton panier est vide
        </h3>

        <p style="margin-top:8px">
          Ajoute des produits pour commencer.
        </p>

        <button
          class="primary"
          id="emptyShop"
          style="margin-top:18px"
        >
          Explorer la boutique
        </button>

      </div>
    `;

    return;
  }


  cartItems.innerHTML =
    items.map(item=>`

      <div class="cart-item">

        <img
          src="${imageSrc(item.image)}"
          data-original="${escapeAttribute(item.image)}"
          alt="${escapeAttribute(item.name)}"
          onerror="imageError(this,this.dataset.original)"
        >

        <div>

          <div class="cart-name">
            ${escapeHTML(item.name)}
          </div>

          <div class="cart-price">
            ${money(item.price)}
          </div>

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

          <button
            class="remove"
            data-remove="${item.id}"
          >
            Supprimer
          </button>

        </div>

        <strong>
          ${money(item.price * item.qty)}
        </strong>

      </div>

    `).join("");
}


if(cartItems){

  cartItems.addEventListener(
    "click",
    event=>{

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


/* =========================================================
   CART OPEN / CLOSE
========================================================= */

function openCart(){

  if(cartOverlay){
    cartOverlay.classList.add("open");
  }
}


function closeCart(){

  if(cartOverlay){
    cartOverlay.classList.remove("open");
  }
}


if(cartBtn){
  cartBtn.onclick =
    openCart;
}


if(heroCartBtn){
  heroCartBtn.onclick =
    openCart;
}


if(cartClose){
  cartClose.onclick =
    closeCart;
}


if(cartOverlay){

  cartOverlay.addEventListener(
    "click",
    event=>{

      if(event.target === cartOverlay){
        closeCart();
      }

    }
  );
}


/* =========================================================
   SEARCH
========================================================= */

if(searchInput){

  searchInput.addEventListener(
    "input",
    ()=>{
      searchValue =
        searchInput.value;

      renderProducts();
    }
  );
}


/* =========================================================
   SORT
========================================================= */

const sortSelect =
  $("sortSelect");

if(sortSelect){

  sortSelect.addEventListener(
    "change",
    renderProducts
  );
}


/* =========================================================
   CATEGORIES
========================================================= */

if(categoriesEl){

  categoriesEl.addEventListener(
    "click",
    event=>{

      const button =
        event.target.closest("[data-category]");

      if(!button){
        return;
      }

      selectedCategory =
        button.dataset.category;

      renderCategories();
      renderProducts();
    }
  );
}


/* =========================================================
   ACCOUNT
========================================================= */

function openAccount(){

  if(currentUser){

    modalTitle.textContent =
      "Mon compte";

    modalContent.innerHTML = `

      <div class="checkout-section">

        <h3>👤 Compte connecté</h3>

        <p
          style="
            color:var(--muted);
            margin-bottom:16px;
          "
        >
          ${escapeHTML(currentUser.email || "")}
        </p>

        <button
          class="danger-btn"
          id="logoutBtn"
        >
          Se déconnecter
        </button>

      </div>
    `;

    $("logoutBtn").onclick =
      async ()=>{
        try{
          await signOut(auth);
          closeModal();
          showToast("Déconnexion réussie");
        }catch{
          showToast("Impossible de se déconnecter");
        }
      };

    openModal();
    return;
  }


  modalTitle.textContent =
    "Connexion";

  modalContent.innerHTML = `

    <div class="checkout-section">

      <h3>🔐 Se connecter</h3>

      <div class="field">
        <label>E-mail</label>
        <input
          id="loginEmail"
          type="email"
          placeholder="ton@email.com"
        >
      </div>

      <div class="field">
        <label>Mot de passe</label>
        <input
          id="loginPassword"
          type="password"
          placeholder="Mot de passe"
        >
      </div>

      <div
        id="authMessage"
        class="error-message"
      ></div>

      <button
        class="primary"
        id="loginBtn"
        style="width:100%"
      >
        Se connecter
      </button>

    </div>

    <div class="checkout-section">

      <h3>Créer un compte</h3>

      <div class="field">
        <label>E-mail</label>
        <input
          id="registerEmail"
          type="email"
          placeholder="ton@email.com"
        >
      </div>

      <div class="field">
        <label>Mot de passe</label>
        <input
          id="registerPassword"
          type="password"
          placeholder="6 caractères minimum"
        >
      </div>

      <button
        class="secondary"
        id="registerBtn"
        style="width:100%"
      >
        Créer mon compte
      </button>

    </div>
  `;


  $("loginBtn").onclick =
    async ()=>{

      const email =
        $("loginEmail")?.value.trim();

      const password =
        $("loginPassword")?.value;

      const message =
        $("authMessage");


      try{

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        showToast(
          "Connexion réussie ✓"
        );

        closeModal();

      }catch(error){

        if(message){
          message.textContent =
            authError(error.code);
        }
      }
    };


  $("registerBtn").onclick =
    async ()=>{

      const email =
        $("registerEmail")?.value.trim();

      const password =
        $("registerPassword")?.value;

      const message =
        $("authMessage");


      try{

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        showToast(
          "Compte créé ✓"
        );

        closeModal();

      }catch(error){

        if(message){
          message.textContent =
            authError(error.code);
        }
      }
    };


  openModal();
}


/* =========================================================
   SETTINGS
========================================================= */

function openSettings(){

  modalTitle.textContent =
    "Paramètres";

  const current =
    localStorage.getItem("novaThemeChoice") ||
    "dark";

  modalContent.innerHTML = `

    <div class="checkout-section">

      <h3>🎨 Apparence</h3>

      <div class="field">

        <label>Thème</label>

        <select id="themeChoice">

          <option
            value="dark"
            ${current==="dark" ? "selected" : ""}
          >
            Sombre
          </option>

          <option
            value="light"
            ${current==="light" ? "selected" : ""}
          >
            Clair
          </option>

          <option
            value="auto"
            ${current==="auto" ? "selected" : ""}
          >
            Automatique
          </option>

        </select>

      </div>

    </div>

  `;


  $("themeChoice").onchange =
    event=>{

      localStorage.setItem(
        "novaThemeChoice",
        event.target.value
      );

      applyTheme();

      showToast(
        "Thème modifié ✓"
      );
    };


  openModal();
}


/* =========================================================
   CHECKOUT
========================================================= */

function validateAddress(address){

  return Boolean(
    address.firstName &&
    address.lastName &&
    address.street &&
    address.postalCode &&
    address.city &&
    address.country
  );
}


function calculateDiscountedTotal(
  subtotal,
  promo
){

  if(
    String(promo || "")
      .trim()
      .toUpperCase() === "NOVA100"
  ){
    return 0;
  }

  return subtotal;
}


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


  let paymentMode = "choice";


  function drawCheckout(){

    const subtotal =
      getCartTotal();


    if(modalTitle){
      modalTitle.textContent =
        "Finaliser ma commande";
    }


    modalContent.innerHTML = `

      <div class="checkout-section">

        <h3>📍 Adresse de livraison</h3>

        <div class="form-grid">

          <div class="field">
            <label>Prénom</label>
            <input
              id="checkoutFirstName"
              placeholder="Prénom"
            >
          </div>

          <div class="field">
            <label>Nom</label>
            <input
              id="checkoutLastName"
              placeholder="Nom"
            >
          </div>

          <div class="field full">
            <label>Adresse</label>
            <input
              id="checkoutStreet"
              placeholder="Adresse"
            >
          </div>

          <div class="field">
            <label>Code postal</label>
            <input
              id="checkoutPostal"
              placeholder="59000"
            >
          </div>

          <div class="field">
            <label>Ville</label>
            <input
              id="checkoutCity"
              placeholder="Ville"
            >
          </div>

          <div class="field full">
            <label>Pays</label>
            <input
              id="checkoutCountry"
              value="France"
            >
          </div>

        </div>

      </div>


      <div class="checkout-section">

        <h3>🎟️ Code promo</h3>

        <div
          style="
            display:flex;
            gap:8px;
          "
        >

          <input
            id="promoCode"
            placeholder="Code promo"
            style="
              flex:1;
              background:var(--card2);
              border:1px solid var(--line);
              color:var(--text);
              border-radius:12px;
              padding:13px;
              outline:none;
            "
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
            margin-top:8px;
          "
        ></div>

      </div>


      <div class="checkout-section">

        <h3>💳 Paiement</h3>

        ${
          paymentMode === "choice"

          ? `

            <div class="payment-choice">

              <button
                class="payment-button paypal-button"
                id="paypalChoice"
              >
                PayPal
              </button>

              <button
                class="payment-button"
                id="cardChoice"
              >
                💳 Payer par CB
              </button>

            </div>

          `

          : ""
        }

      </div>


      <div
        style="
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
          <span>Sous-total</span>
          <strong id="checkoutSubtotal">
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
          <span>Réduction</span>
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
          <strong>Total</strong>

          <strong id="checkoutFinalTotal">
            ${money(subtotal)}
          </strong>

        </div>

      </div>


      <button
        class="primary"
        id="confirmCheckout"
        style="
          width:100%;
          margin-top:14px;
        "
      >
        Continuer avec PayPal
      </button>
    `;


    const promoInput =
      $("promoCode");

    const applyPromo =
      $("applyPromo");


    if(applyPromo){

      applyPromo.onclick =
        ()=>{

          const code =
            promoInput?.value
              ?.trim()
              .toUpperCase();

          const message =
            $("promoMessage");

          const discount =
            $("discountValue");

          const finalTotal =
            $("checkoutFinalTotal");


          if(code === "NOVA100"){

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
    }


    const cardChoice =
      $("cardChoice");

    if(cardChoice){

      cardChoice.onclick =
        ()=>{

          openCardPayment();

        };
    }


    const paypalChoice =
      $("paypalChoice");

    if(paypalChoice){

      paypalChoice.onclick =
        ()=>{

          const button =
            $("confirmCheckout");

          if(button){
            button.click();
          }

        };
    }


    const confirm =
      $("confirmCheckout");

    if(confirm){

      confirm.onclick =
        async ()=>{

          const address = {

            firstName:
              $("checkoutFirstName")
                ?.value?.trim() || "",

            lastName:
              $("checkoutLastName")
                ?.value?.trim() || "",

            street:
              $("checkoutStreet")
                ?.value?.trim() || "",

            postalCode:
              $("checkoutPostal")
                ?.value?.trim() || "",

            city:
              $("checkoutCity")
                ?.value?.trim() || "",

            country:
              $("checkoutCountry")
                ?.value?.trim() || ""
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


          const promoApplied =
            enteredCode === "NOVA100";


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
    }
  }


  function openCardPayment(){

    modalTitle.textContent =
      "Paiement par CB";


    modalContent.innerHTML = `

      <div class="card-box">

        <div class="card-logo">

          <div class="card-chip"></div>

          <div class="card-number">
            •••• •••• •••• ••••
          </div>

        </div>


        <div class="checkout-section">

          <div class="field">

            <label>
              Nom complet
            </label>

            <input
              id="cardDemoName"
              type="text"
              autocomplete="off"
              placeholder="Nom complet"
            >

          </div>


          <div class="field">

            <label>
              Numéro de carte
            </label>

            <input
              id="cardDemoNumber"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              maxlength="19"
              placeholder="XXXX XXXX XXXX XXXX"
            >

          </div>


          <div class="form-grid">

            <div class="field">

              <label>
                Expiration
              </label>

              <input
                id="cardDemoExpiry"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                maxlength="5"
                placeholder="MM/AA"
              >

            </div>


            <div class="field">

              <label>
                CVV
              </label>

              <input
                id="cardDemoCvv"
                type="password"
                inputmode="numeric"
                autocomplete="off"
                maxlength="4"
                placeholder="CVV"
              >

            </div>

          </div>


          <div
            id="cardError"
            class="error-message"
          ></div>


          <button
            class="primary"
            id="demoCardPayButton"
            style="width:100%"
          >
            💳 Valider le paiement
          </button>


          <button
            class="secondary"
            id="backToPaymentMethods"
            style="
              width:100%;
              margin-top:9px;
            "
          >
            ← Retour
          </button>

        </div>

      </div>
    `;


    const cardNumber =
      $("cardDemoNumber");

    if(cardNumber){

      cardNumber.addEventListener(
        "input",
        ()=>{

          let value =
            cardNumber.value
              .replace(/\D/g,"")
              .slice(0,16);

          value =
            value.match(/.{1,4}/g)?.join(" ")
            || "";

          cardNumber.value =
            value;
        }
      );
    }


    const expiry =
      $("cardDemoExpiry");

    if(expiry){

      expiry.addEventListener(
        "input",
        ()=>{

          let value =
            expiry.value
              .replace(/\D/g,"")
              .slice(0,4);

          if(value.length > 2){

            value =
              value.slice(0,2) +
              "/" +
              value.slice(2);
          }

          expiry.value =
            value;
        }
      );
    }


    const cvv =
      $("cardDemoCvv");

    if(cvv){

      cvv.addEventListener(
        "input",
        ()=>{

          cvv.value =
            cvv.value
              .replace(/\D/g,"")
              .slice(0,4);
        }
      );
    }


    $("demoCardPayButton").onclick =
      ()=>{

        const error =
          $("cardError");

        if(error){

          error.textContent =
            "Carte incorrecte";
        }

        showToast(
          "Carte incorrecte"
        );


        /*
          Les valeurs du formulaire ne sont :
          - ni enregistrées
          - ni envoyées à Firebase
          - ni envoyées à un serveur
          - ni ajoutées à une commande
        */

        $("cardDemoName").value = "";
        $("cardDemoNumber").value = "";
        $("cardDemoExpiry").value = "";
        $("cardDemoCvv").value = "";
      };


    $("backToPaymentMethods").onclick =
      ()=>{
        drawCheckout();
      };
  }


  drawCheckout();
  openModal();
}


/* =========================================================
   CREATE ORDER
========================================================= */

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
      "Enregistrement...";
  }


  try{

    const orderData = {

      userId:
        currentUser.uid,

      email:
        currentUser.email || "",

      items:
        items.map(item=>({
          id:item.id,
          name:item.name,
          price:item.price,
          qty:item.qty
        })),

      subtotal:
        Number(subtotal),

      total:
        Number(total),

      promoCode:
        promoApplied
          ? "NOVA100"
          : "",

      discount:
        Number(subtotal) -
        Number(total),

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

      setTimeout(
        ()=>printInvoiceHTML({
          ...orderData,
          id:ref.id
        }),
        300
      );

      return;
    }


    const paypalAmount =
      Number(total);


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


    setTimeout(
      ()=>{
        window.location.href =
          paypalURL;
      },
      700
    );


  }catch(error){

    console.error(error);

    showToast(
      "Impossible d'enregistrer la commande"
    );


    if(button){

      button.disabled = false;

      button.textContent =
        "Continuer avec PayPal";
    }
  }
}


/* =========================================================
   CHECKOUT BUTTON
========================================================= */

if(checkoutBtn){

  checkoutBtn.onclick =
    openCheckout;
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


  modalTitle.textContent =
    "Mes commandes";


  modalContent.innerHTML = `

    <div
      style="
        text-align:center;
        padding:30px;
      "
    >
      Chargement...
    </div>
  `;


  openModal();


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

      modalContent.innerHTML = `

        <div class="empty">

          <div style="font-size:45px">
            📦
          </div>

          <h3>
            Aucune commande
          </h3>

          <p style="margin-top:8px">
            Tes commandes apparaîtront ici.
          </p>

        </div>
      `;

      return;
    }


    const orders =
      snapshot.docs
        .map(d=>({
          id:d.id,
          ...d.data()
        }))
        .sort(
          (a,b)=>
            getTimestampValue(b.createdAt) -
            getTimestampValue(a.createdAt)
        );


    modalContent.innerHTML =
      orders.map(order=>`

        <div class="order">

          <div class="order-top">

            <div>

              <strong>
                Commande #${escapeHTML(order.id.slice(0,8))}
              </strong>

              <br>

              <small>
                ${formatTimestamp(order.createdAt)}
              </small>

            </div>

            <strong>
              ${money(order.total)}
            </strong>

          </div>

          <div
            style="
              margin-top:12px;
              color:var(--muted);
              line-height:1.6;
            "
          >

            <div>
              Statut :
              <strong style="color:var(--text)">
                ${escapeHTML(order.status || "Enregistrée")}
              </strong>
            </div>

            <div>
              Paiement :
              ${escapeHTML(order.paymentMethod || "")}
            </div>

            <div>
              Ville :
              ${escapeHTML(order.address?.city || "")}
            </div>

            ${
              order.trackingNumber
              ? `
                <div>
                  Suivi :
                  ${escapeHTML(order.trackingNumber)}
                </div>
              `
              : ""
            }

            ${
              order.estimatedDelivery
              ? `
                <div>
                  Livraison estimée :
                  ${escapeHTML(order.estimatedDelivery)}
                </div>
              `
              : ""
            }

          </div>

        </div>

      `).join("");


  }catch(error){

    console.error(error);

    modalContent.innerHTML = `

      <div class="error-message">
        Impossible de charger les commandes.
      </div>
    `;
  }
}


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


async function openAdmin(){

  if(!currentUser){

    showToast(
      "Connecte-toi avec le compte administrateur"
    );

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
        "Code incorrect"
      );

      return;
    }


    localStorage.setItem(
      ADMIN_ACCESS_KEY,
      "true"
    );
  }


  await renderAdmin();
}


const ORDER_STATUSES = [

  "Enregistrée",
  "Acceptée",
  "Préparation",
  "En transit",
  "Livraison proche",
  "Livrée"

];


async function renderAdmin(){

  modalTitle.textContent =
    "Administration";


  modalContent.innerHTML = `

    <div
      style="
        padding:15px;
        border:1px solid var(--line);
        background:var(--card);
        border-radius:15px;
        margin-bottom:15px;
      "
    >

      <strong>
        🛠️ NovaShop Admin
      </strong>

      <p
        style="
          color:var(--muted);
          margin-top:6px;
        "
      >
        ${escapeHTML(ADMIN_EMAIL)}
      </p>

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:12px;
        "
      >

        <button
          class="secondary"
          id="removeAdminAuth"
        >
          Déconnecter admin
        </button>

        <button
          class="danger-btn"
          id="deleteAllOrders"
        >
          Supprimer toutes les commandes
        </button>

      </div>

    </div>

    <div id="adminOrders">
      Chargement...
    </div>
  `;


  openModal();


  $("removeAdminAuth").onclick =
    ()=>{
      localStorage.removeItem(
        ADMIN_ACCESS_KEY
      );

      closeModal();

      showToast(
        "Session admin fermée"
      );
    };


  $("deleteAllOrders").onclick =
    async ()=>{

      const ok =
        confirm(
          "Supprimer toutes les commandes ?"
        );

      if(!ok){
        return;
      }


      try{

        const snapshot =
          await getDocs(
            collection(db,"orders")
          );


        for(const order of snapshot.docs){

          await deleteDoc(
            doc(
              db,
              "orders",
              order.id
            )
          );
        }


        showToast(
          "Commandes supprimées"
        );

        await renderAdmin();

      }catch(error){

        console.error(error);

        showToast(
          "Erreur lors de la suppression"
        );
      }
    };


  try{

    const snapshot =
      await getDocs(
        collection(db,"orders")
      );


    const orders =
      snapshot.docs
        .map(d=>({
          id:d.id,
          ...d.data()
        }))
        .sort(
          (a,b)=>
            getTimestampValue(b.createdAt) -
            getTimestampValue(a.createdAt)
        );


    const adminOrders =
      $("adminOrders");


    if(!orders.length){

      adminOrders.innerHTML = `

        <div class="empty">
          Aucune commande.
        </div>
      `;

      return;
    }


    adminOrders.innerHTML =
      orders.map(order=>{

        const accepted =
          order.paymentStatus === "accepted" ||
          order.paymentStatus === "free";


        return `

          <div
            class="admin-card"
            data-order="${order.id}"
          >

            <div
              style="
                display:flex;
                justify-content:space-between;
                gap:15px;
              "
            >

              <div>

                <strong>
                  #${escapeHTML(order.id.slice(0,10))}
                </strong>

                <div
                  style="
                    color:var(--muted);
                    font-size:12px;
                    margin-top:5px;
                  "
                >
                  ${escapeHTML(order.email || "")}
                </div>

              </div>

              <strong>
                ${money(order.total)}
              </strong>

            </div>


            <div
              style="
                color:var(--muted);
                font-size:13px;
                margin-top:10px;
                line-height:1.6;
              "
            >

              <div>
                Date :
                ${formatTimestamp(order.createdAt)}
              </div>

              <div>
                Paiement :
                ${escapeHTML(order.paymentMethod || "")}
              </div>

              <div>
                État paiement :
                ${escapeHTML(order.paymentStatus || "")}
              </div>

              <div>
                Promo :
                ${escapeHTML(order.promoCode || "Aucune")}
              </div>

              <div>
                Adresse :
                ${escapeHTML(
                  order.address?.street || ""
                )}
                ,
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

              <div class="field">

                <label>
                  Statut
                </label>

                <select data-status="${order.id}">

                  ${ORDER_STATUSES.map(status=>`

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

              </div>


              <div class="field">

                <label>
                  Ville du colis
                </label>

                <input
                  data-package-city="${order.id}"
                  value="${escapeAttribute(
                    order.packageCity || ""
                  )}"
                  placeholder="Paris"
                >

              </div>


              <div class="field">

                <label>
                  Numéro de suivi
                </label>

                <input
                  data-tracking="${order.id}"
                  value="${escapeAttribute(
                    order.trackingNumber || ""
                  )}"
                  placeholder="FR123456789"
                >

              </div>


              <div class="field">

                <label>
                  Durée livraison
                </label>

                <input
                  data-duration="${order.id}"
                  value="${escapeAttribute(
                    order.deliveryDuration || ""
                  )}"
                  placeholder="2-4 jours"
                >

              </div>


              <div class="field">

                <label>
                  Livraison estimée
                </label>

                <input
                  type="date"
                  data-estimated="${order.id}"
                  value="${escapeAttribute(
                    order.estimatedDelivery || ""
                  )}"
                >

              </div>

            </div>


            <div
              style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
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


    if(adminOrders){

      adminOrders.onclick =
        async event=>{

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

            return;
          }
        };
    }


  }catch(error){

    console.error(error);

    $("adminOrders").innerHTML = `

      <div class="error-message">
        Impossible de charger les commandes.
      </div>
    `;
  }
}


/* =========================================================
   ACCEPT PAYPAL
========================================================= */

async function acceptPaypalOrder(orderId){

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
      "Paiement accepté ✓"
    );

    await renderAdmin();

  }catch(error){

    console.error(error);

    showToast(
      "Impossible d'accepter le paiement"
    );
  }
}


/* =========================================================
   SAVE ADMIN ORDER
========================================================= */

async function saveAdminOrder(orderId){

  const status =
    document.querySelector(
      `[data-status="${CSS.escape(orderId)}"]`
    )?.value || "Enregistrée";


  const packageCity =
    document.querySelector(
      `[data-package-city="${CSS.escape(orderId)}"]`
    )?.value?.trim() || "";


  const trackingNumber =
    document.querySelector(
      `[data-tracking="${CSS.escape(orderId)}"]`
    )?.value?.trim() || "";


  const deliveryDuration =
    document.querySelector(
      `[data-duration="${CSS.escape(orderId)}"]`
    )?.value?.trim() || "";


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

  }catch(error){

    console.error(error);

    showToast(
      "Erreur de mise à jour"
    );
  }
}


/* =========================================================
   ADMIN INVOICE
========================================================= */

async function printAdminInvoice(orderId){

  try{

    const snapshot =
      await getDocs(
        collection(db,"orders")
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


    printInvoiceHTML(order);

  }catch(error){

    console.error(error);

    showToast(
      "Impossible d'imprimer la facture"
    );
  }
}


/* =========================================================
   PRINT INVOICE
========================================================= */

function printInvoiceHTML(order){

  const win =
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );


  if(!win){
    showToast(
      "Autorise les fenêtres pop-up"
    );
    return;
  }


  const items =
    Array.isArray(order.items)
      ? order.items
      : [];


  win.document.write(`

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

        .muted{
          color:#666;
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
          font-size:24px;
          font-weight:bold;
          margin-top:25px;
        }

        .box{
          padding:15px;
          background:#f5f5f5;
          margin-top:20px;
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
          Date :
        </strong>

        ${escapeHTML(
          formatTimestamp(order.createdAt)
        )}

        <br>

        <strong>
          Client :
        </strong>

        ${escapeHTML(order.email || "")}

      </div>


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


      <table>

        <thead>

          <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Qté</th>
            <th>Total</th>
          </tr>

        </thead>

        <tbody>

          ${
            items.map(item=>`

              <tr>

                <td>
                  ${escapeHTML(item.name || "")}
                </td>

                <td>
                  ${money(item.price)}
                </td>

                <td>
                  ${Number(item.qty || 0)}
                </td>

                <td>
                  ${money(
                    Number(item.price || 0) *
                    Number(item.qty || 0)
                  )}
                </td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>


      <div class="box">

        <strong>
          Paiement :
        </strong>

        ${escapeHTML(
          order.paymentMethod || ""
        )}

        <br>

        <strong>
          Statut :
        </strong>

        ${escapeHTML(
          order.status || ""
        )}

        <br>

        <strong>
          Promo :
        </strong>

        ${escapeHTML(
          order.promoCode || "Aucune"
        )}

      </div>


      <div class="total">

        Total :
        ${money(order.total)}

      </div>


      <script>

        window.onload = function(){

          setTimeout(
            function(){
              window.print();
            },
            300
          );

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
        connectedEmail ===
        adminEmail
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


/* =========================================================
   BUTTONS
========================================================= */

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


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
  "keydown",
  event=>{

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


/* =========================================================
   TIMESTAMP
========================================================= */

function getTimestampValue(timestamp){

  if(!timestamp){
    return 0;
  }


  if(
    typeof timestamp.seconds === "number"
  ){

    return (
      timestamp.seconds * 1000 +
      Math.floor(
        (timestamp.nanoseconds || 0) /
        1000000
      )
    );
  }


  if(
    timestamp instanceof Date
  ){

    return timestamp.getTime();
  }


  if(
    typeof timestamp === "string"
  ){

    const value =
      Date.parse(timestamp);

    return Number.isNaN(value)
      ? 0
      : value;
  }


  return 0;
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


/* =========================================================
   INITIALIZATION
========================================================= */

renderCategories();
renderProducts();
renderCart();

applyTheme();


/* =========================================================
   PUBLIC API
========================================================= */

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
