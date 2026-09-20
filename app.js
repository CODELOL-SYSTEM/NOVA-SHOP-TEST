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
const productCount = $("productCount") || {
  textContent:""
};

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

  return (
    "https://wsrv.nl/?url=" +
    encodeURIComponent(url)
  );

}


function imageSrc(url){

  return escapeAttribute(
    imageUrl(url)
  );

}


function imageError(
  img,
  original
){

  if(!img) return;

  const stage =
    img.dataset.imageStage ||
    "proxy";

  if(stage === "proxy"){

    img.dataset.imageStage =
      "original";

    img.src =
      original ||
      FALLBACK_IMAGE;

    return;

  }

  img.dataset.imageStage =
    "fallback";

  img.src =
    FALLBACK_IMAGE;

}


window.imageError =
  imageError;


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
  image:"https://m.media-amazon.com/images/I/61nK6kQqWYL._AC_SL1500_.jpg"
},

{
  id:"p30",
  name:"Logitech PRO X TKL Rapid Noir, filaire AZERTY",
  category:"Claviers",
  price:78.99,
  image:"https://m.media-amazon.com/images/I/71Q5K2x8cVL._AC_SL1500_.jpg"
},

{
  id:"p31",
  name:"QwertyKey75 HE Striker, Magnetic Hall Effect, Rapid Trigger, Snap Tap",
  category:"Claviers",
  price:56.99,
  image:"https://qwertykeys.com/cdn/shop/files/Striker_1.png?v=1756894378"
},

{
  id:"p32",
  name:"GravaStar Mercury K1 Clavier Gamer sans Fil en Aluminium, Noir Dégradé",
  category:"Claviers",
  price:91.99,
  image:"https://m.media-amazon.com/images/I/71P2Y5YJk7L._AC_SL1500_.jpg"
},

{
  id:"p33",
  name:"ATTACK SHARK R11 Ultra, fibre de carbone, 8000Hz, 49g, 42000 DPI",
  category:"Souris",
  price:26.99,
  image:"https://m.media-amazon.com/images/I/71l8yGJrjQL._AC_SL1500_.jpg"
},

{
  id:"p34",
  name:"HyperX QuadCast 2 – Microphone USB – RGB",
  category:"Microphones",
  price:98.99,
  image:"https://fr.hyperx.com/cdn/shop/files/hyperx_quadcast_2_black_1_main.jpg?v=1726837696"
},

{
  id:"p35",
  name:"Shure SM7 dB",
  category:"Microphones",
  price:121.99,
  image:"https://www.shure.com/damfiles/default/product/images/SM7dB/SM7dB_01.jpg"
},

{
  id:"p36",
  name:"Razer Seiren V3 Chroma Noir",
  category:"Microphones",
  price:13.99,
  image:"https://assets2.razerzone.com/images/pnx.assets/6b0f3e9a8c4f4a2b0fdb4d8f4a4e8a0b/razer-seiren-v3-chroma-500x500.png"
},

{
  id:"p37",
  name:"Stairville LED Pixel Rail 40 RGB MKII",
  category:"Éclairage RGB",
  price:18.90,
  image:"https://images.thomann.de/pics/prod/570118.jpg"
},

{
  id:"p38",
  name:"Govee LED Strip Light RGBIC Wi-Fi + Bluetooth 5m Matter",
  category:"Éclairage RGB",
  price:8,
  image:"https://m.media-amazon.com/images/I/71t9d2M3fVL._AC_SL1500_.jpg"
},

{
  id:"p39",
  name:"Lampe de plafond hexagone nid d'abeille LED 2.4m x 4.8m contour bleu",
  category:"Éclairage RGB",
  price:91.10,
  image:"https://m.media-amazon.com/images/I/71sYvR0G5LL._AC_SL1500_.jpg"
},

{
  id:"p40",
  name:"GIGABYTE GeForce RTX 5050 WINDFORCE OC 8G",
  category:"Cartes graphiques",
  price:147,
  image:"https://m.media-amazon.com/images/I/71FJxKQ8WUL._AC_SL1500_.jpg"
},

{
  id:"p41",
  name:"MSI GeForce RTX 3050 LP E 6G OC",
  category:"Cartes graphiques",
  price:100,
  image:"https://m.media-amazon.com/images/I/81j5s8nXyBL._AC_SL1500_.jpg"
},

{
  id:"p42",
  name:"ASUS Dual Radeon RX 7600 EVO OC Edition 8GB GDDR6",
  category:"Cartes graphiques",
  price:140,
  image:"https://m.media-amazon.com/images/I/81qKQY5r9OL._AC_SL1500_.jpg"
},

{
  id:"p43",
  name:"PC Gamer Fixe, Ryzen 7 5700G, Vega 8, 16G DDR4, 1T SSD",
  category:"PC Gamer",
  price:650,
  new:true,
  image:"https://m.media-amazon.com/images/I/71Pc7gqXWGL._AC_SL1500_.jpg"
}

];


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let selectedCategory =
  "Toutes";

let searchValue = "";

let cart = [];


/* =========================================================
   CART STORAGE
========================================================= */

function loadCart(){

  try{

    const saved =
      JSON.parse(
        localStorage.getItem(
          "novaCart"
        ) || "[]"
      );

    if(
      Array.isArray(saved)
    ){

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

function applyTheme(
  choice
){

  document.documentElement
    .dataset.theme =
      choice;

}


function loadTheme(){

  const saved =
    localStorage.getItem(
      "novaThemeChoice"
    ) || "dark";

  applyTheme(
    saved
  );

}


loadTheme();


/* =========================================================
   MONEY
========================================================= */

function money(
  value
){

  const number =
    Number(value) || 0;

  if(number === 0){

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


/* =========================================================
   TOAST
========================================================= */

function showToast(
  message
){

  const toast =
    document.createElement(
      "div"
    );

  toast.textContent =
    message;

  toast.style.cssText =
    "background:#0c1525;" +
    "color:#fff;" +
    "border:1px solid rgba(255,255,255,.12);" +
    "padding:12px 18px;" +
    "border-radius:12px;" +
    "box-shadow:0 15px 40px rgba(0,0,0,.35);" +
    "font-size:14px;" +
    "font-weight:700;";

  toastContainer
    .appendChild(
      toast
    );

  setTimeout(
    () => {

      toast.style.opacity =
        "0";

      toast.style.transform =
        "translateY(10px)";

      toast.style.transition =
        ".25s";

      setTimeout(
        () => toast.remove(),
        250
      );

    },
    2600
  );

}


/* =========================================================
   REVIEWS
========================================================= */

function reviewData(
  product
){

  let hash = 0;

  for(
    let i = 0;
    i < product.id.length;
    i++
  ){

    hash =
      (
        hash * 31 +
        product.id.charCodeAt(i)
      ) >>> 0;

  }

  const rating =
    4.4 +
    (hash % 6) / 10;

  const reviews =
    35 +
    (hash % 430);

  return {

    rating:
      Math.min(
        5,
        Number(
          rating.toFixed(1)
        )
      ),

    reviews

  };

}


function starsHTML(
  rating
){

  const rounded =
    Math.round(
      Number(rating)
    );

  return `
    <span class="stars"
      aria-label="${escapeAttribute(
        rating + " sur 5"
      )}">
      ${"★".repeat(rounded)}
      <span class="stars-empty">
        ${"★".repeat(
          5 - rounded
        )}
      </span>
    </span>
  `;

}


/* =========================================================
   CATEGORIES
========================================================= */

function getCategories(){

  return [
    "Toutes",
    ...new Set(
      products.map(
        p => p.category
      )
    )
  ];

}


function renderCategories(){

  if(!categoriesEl)
    return;

  categoriesEl.innerHTML =
    getCategories()
      .map(
        category => `

          <button
            class="category-pill ${
              selectedCategory ===
              category
                ? "active"
                : ""
            }"
            data-category="${
              escapeAttribute(
                category
              )
            }"
          >
            ${escapeHTML(
              category
            )}
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

        button.onclick =
          () => {

            selectedCategory =
              button.dataset
                .category;

            renderCategories();
            renderProducts();

          };

      }
    );

}


/* =========================================================
   PRODUCT FILTER
========================================================= */

function getFilteredProducts(){

  let list =
    [...products];

  const search =
    searchValue
      .trim()
      .toLowerCase();

  if(
    selectedCategory !==
    "Toutes"
  ){

    list =
      list.filter(
        product =>
          product.category ===
          selectedCategory
      );

  }

  if(search){

    list =
      list.filter(
        product =>
          (
            product.name +
            " " +
            product.category
          )
          .toLowerCase()
          .includes(
            search
          )
      );

  }

  const sort =
    $("sortSelect")
      ?.value ||
    "default";

  if(sort === "priceAsc"){

    list.sort(
      (a,b) =>
        a.price -
        b.price
    );

  }

  if(sort === "priceDesc"){

    list.sort(
      (a,b) =>
        b.price -
        a.price
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


/* =========================================================
   PRODUCT CARD
========================================================= */

function productCard(
  product
){

  const review =
    reviewData(
      product
    );

  return `

    <article
      class="product-card"
      data-product-id="${
        escapeAttribute(
          product.id
        )
      }"
    >

      <div class="product-image-wrap">

        ${
          product.new
            ? `
              <span class="new-badge">
                NOUVEAU
              </span>
            `
            : ""
        }

        <img
          class="product-image"
          src="${imageSrc(
            product.image
          )}"
          data-image-stage="proxy"
          data-original="${escapeAttribute(
            product.image
          )}"
          onerror="imageError(this,this.dataset.original)"
          alt="${escapeAttribute(
            product.name
          )}"
          loading="lazy"
        >

      </div>

      <div class="product-info">

        <div class="product-category">
          ${escapeHTML(
            product.category
          )}
        </div>

        <h3>
          ${escapeHTML(
            product.name
          )}
        </h3>

        <div class="product-rating">

          ${starsHTML(
            review.rating
          )}

          <span>
            ${review.rating}
            (${review.reviews})
          </span>

        </div>

        <div class="product-bottom">

          <strong class="product-price">
            ${money(
              product.price
            )}
          </strong>

          <div class="product-actions">

            <button
              class="secondary small"
              data-view-product="${
                escapeAttribute(
                  product.id
                )
              }"
            >
              Voir
            </button>

            <button
              class="primary small"
              data-add-product="${
                escapeAttribute(
                  product.id
                )
              }"
            >
              Ajouter
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

  if(!productsGrid)
    return;

  const list =
    getFilteredProducts();

  productsGrid.innerHTML =
    list
      .map(
        product =>
          productCard(
            product
          )
      )
      .join("");

  if(
    productCount &&
    "textContent" in productCount
  ){

    productCount.textContent =
      `${list.length} produit${
        list.length > 1
          ? "s"
          : ""
      }`;

  }

  productsGrid
    .querySelectorAll(
      "[data-view-product]"
    )
    .forEach(
      button => {

        button.onclick =
          () =>
            openProduct(
              button.dataset
                .viewProduct
            );

      }
    );

  productsGrid
    .querySelectorAll(
      "[data-add-product]"
    )
    .forEach(
      button => {

        button.onclick =
          () =>
            addToCart(
              button.dataset
                .addProduct
            );

      }
    );

}


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


$("sortSelect")
  ?.addEventListener(
    "change",
    renderProducts
  );


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProduct(
  productId
){

  const product =
    products.find(
      p =>
        p.id ===
        productId
    );

  if(!product)
    return;

  const review =
    reviewData(
      product
    );

  modalContent.innerHTML = `

    <div class="product-modal">

      <div class="product-modal-image">

        <img
          src="${imageSrc(
            product.image
          )}"
          data-image-stage="proxy"
          data-original="${escapeAttribute(
            product.image
          )}"
          onerror="imageError(this,this.dataset.original)"
          alt="${escapeAttribute(
            product.name
          )}"
        >

      </div>

      <div class="product-modal-info">

        <div class="product-category">
          ${escapeHTML(
            product.category
          )}
        </div>

        <h2>
          ${escapeHTML(
            product.name
          )}
        </h2>

        <div class="product-rating">

          ${starsHTML(
            review.rating
          )}

          <span>
            ${review.rating}/5
            •
            ${review.reviews} avis
          </span>

        </div>

        <div class="product-modal-price">
          ${money(
            product.price
          )}
        </div>

        <p class="muted">
          Produit disponible chez NovaShop.
        </p>

        <button
          class="primary"
          id="modalAddProduct"
        >
          Ajouter au panier
        </button>

      </div>

    </div>

  `;

  $("modalAddProduct")
    .onclick = () => {

      addToCart(
        product.id
      );

      closeModal();

    };

  openModal();

}


function openModal(){

  modal.classList.add(
    "open"
  );

  document.body.classList.add(
    "modal-open"
  );

}


function closeModal(){

  modal.classList.remove(
    "open"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


modalClose.onclick =
  closeModal;

modal.addEventListener(
  "click",
  event => {

    if(
      event.target ===
      modal
    ){

      closeModal();

    }

  }
);


/* =========================================================
   CART
========================================================= */

function cartCount(){

  return cart.reduce(
    (total,item) =>
      total +
      Number(
        item.qty || 0
      ),
    0
  );

}


function cartSubtotal(){

  return cart.reduce(
    (total,item) => {

      const product =
        products.find(
          p =>
            p.id ===
            item.id
        );

      if(!product)
        return total;

      return (
        total +
        product.price *
        Number(
          item.qty || 0
        )
      );

    },
    0
  );

}


function cartDetailed(){

  return cart
    .map(
      item => {

        const product =
          products.find(
            p =>
              p.id ===
              item.id
          );

        if(!product)
          return null;

        return {

          ...product,

          qty:
            Number(
              item.qty || 1
            )

        };

      }
    )
    .filter(Boolean);

}


function addToCart(
  productId
){

  const product =
    products.find(
      p =>
        p.id ===
        productId
    );

  if(!product)
    return;

  const existing =
    cart.find(
      item =>
        item.id ===
        productId
    );

  if(existing){

    existing.qty =
      Number(
        existing.qty || 0
      ) + 1;

  }else{

    cart.push({
      id:productId,
      qty:1
    });

  }

  saveCart();
  renderCart();

  showToast(
    "Produit ajouté au panier 🛒"
  );

}


function removeFromCart(
  productId
){

  cart =
    cart.filter(
      item =>
        item.id !==
        productId
    );

  saveCart();
  renderCart();

}


function changeCartQty(
  productId,
  delta
){

  const item =
    cart.find(
      x =>
        x.id ===
        productId
    );

  if(!item)
    return;

  item.qty =
    Number(
      item.qty || 0
    ) + delta;

  if(item.qty <= 0){

    removeFromCart(
      productId
    );

    return;

  }

  saveCart();
  renderCart();

}


function renderCart(){

  const detailed =
    cartDetailed();

  if(cartBadge){

    cartBadge.textContent =
      cartCount();

    cartBadge.style.display =
      cartCount() > 0
        ? "flex"
        : "none";

  }

  if(!cartItems)
    return;

  if(!detailed.length){

    cartItems.innerHTML = `

      <div class="empty-state">

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

    if(cartTotal)
      cartTotal.textContent =
        money(0);

    return;

  }

  cartItems.innerHTML =
    detailed
      .map(
        item => `

          <div
            class="cart-item"
            data-cart-item="${
              escapeAttribute(
                item.id
              )
            }"
          >

            <img
              src="${imageSrc(
                item.image
              )}"
              data-image-stage="proxy"
              data-original="${escapeAttribute(
                item.image
              )}"
              onerror="imageError(this,this.dataset.original)"
              alt="${escapeAttribute(
                item.name
              )}"
            >

            <div class="cart-item-info">

              <strong>
                ${escapeHTML(
                  item.name
                )}
              </strong>

              <span>
                ${money(
                  item.price
                )}
              </span>

              <div class="qty-controls">

                <button
                  data-cart-minus="${
                    escapeAttribute(
                      item.id
                    )
                  }"
                >
                  −
                </button>

                <span>
                  ${item.qty}
                </span>

                <button
                  data-cart-plus="${
                    escapeAttribute(
                      item.id
                    )
                  }"
                >
                  +
                </button>

              </div>

            </div>

            <button
              class="cart-remove"
              data-cart-remove="${
                escapeAttribute(
                  item.id
                )
              }"
              aria-label="Supprimer"
            >
              ×
            </button>

          </div>

        `
      )
      .join("");

  cartItems
    .querySelectorAll(
      "[data-cart-minus]"
    )
    .forEach(
      button => {

        button.onclick =
          () =>
            changeCartQty(
              button.dataset
                .cartMinus,
              -1
            );

      }
    );

  cartItems
    .querySelectorAll(
      "[data-cart-plus]"
    )
    .forEach(
      button => {

        button.onclick =
          () =>
            changeCartQty(
              button.dataset
                .cartPlus,
              1
            );

      }
    );

  cartItems
    .querySelectorAll(
      "[data-cart-remove]"
    )
    .forEach(
      button => {

        button.onclick =
          () =>
            removeFromCart(
              button.dataset
                .cartRemove
            );

      }
    );

  if(cartTotal){

    cartTotal.textContent =
      money(
        cartSubtotal()
      );

  }

}


function openCart(){

  cartDrawer.classList.add(
    "open"
  );

  cartOverlay.classList.add(
    "open"
  );

  document.body.classList.add(
    "cart-open"
  );

}


function closeCart(){

  cartDrawer.classList.remove(
    "open"
  );

  cartOverlay.classList.remove(
    "open"
  );

  document.body.classList.remove(
    "cart-open"
  );

}


cartBtn.onclick =
  openCart;

cartClose.onclick =
  closeCart;

cartOverlay.onclick =
  closeCart;


/* =========================================================
   AUTH
========================================================= */

function isLogged(){

  return !!currentUser;

}


function isAdmin(){

  return (
    currentUser &&
    currentUser.email
      ?.trim()
      .toLowerCase() ===
      ADMIN_EMAIL
        .trim()
        .toLowerCase() &&
    localStorage.getItem(
      ADMIN_ACCESS_KEY
    ) === "true"
  );

}


function authError(
  code
){

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


/* =========================================================
   ACCOUNT
========================================================= */

function openAccount(){

  if(isLogged()){

    modalContent.innerHTML = `

      <div class="modal-box">

        <h2>
          Mon compte
        </h2>

        <p class="muted">
          ${escapeHTML(
            currentUser.email ||
            ""
          )}
        </p>

        <div class="modal-actions">

          <button
            class="primary"
            id="logoutButton"
          >
            Se déconnecter
          </button>

        </div>

      </div>

    `;

    $("logoutButton")
      .onclick =
        async () => {

          await signOut(
            auth
          );

          closeModal();

          showToast(
            "Déconnexion réussie"
          );

        };

    openModal();

    return;

  }

  modalContent.innerHTML = `

    <div class="modal-box">

      <h2>
        Mon compte
      </h2>

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

      <form
        id="authForm"
      >

        <input
          id="authEmail"
          type="email"
          placeholder="Adresse e-mail"
          required
        >

        <input
          id="authPassword"
          type="password"
          placeholder="Mot de passe"
          required
        >

        <button
          class="primary"
          type="submit"
          id="authSubmit"
        >
          Se connecter
        </button>

      </form>

      <p
        id="authMessage"
        class="auth-message"
      ></p>

    </div>

  `;

  let mode =
    "login";

  const loginTab =
    $("loginTab");

  const registerTab =
    $("registerTab");

  const submit =
    $("authSubmit");

  loginTab.onclick =
    () => {

      mode =
        "login";

      loginTab.classList.add(
        "active"
      );

      registerTab.classList.remove(
        "active"
      );

      submit.textContent =
        "Se connecter";

    };

  registerTab.onclick =
    () => {

      mode =
        "register";

      registerTab.classList.add(
        "active"
      );

      loginTab.classList.remove(
        "active"
      );

      submit.textContent =
        "Créer mon compte";

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

      const message =
        $("authMessage");

      try{

        if(mode === "login"){

          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          message.textContent =
            "Connexion réussie.";

          setTimeout(
            closeModal,
            500
          );

        }else{

          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          message.textContent =
            "Compte créé.";

          setTimeout(
            closeModal,
            500
          );

        }

      }catch(error){

        message.textContent =
          authError(
            error.code
          );

      }

    };

  openModal();

}


/* =========================================================
   SETTINGS
========================================================= */

function openSettings(){

  const current =
    localStorage.getItem(
      "novaThemeChoice"
    ) || "dark";

  modalContent.innerHTML = `

    <div class="modal-box">

      <h2>
        Paramètres
      </h2>

      <label>
        Thème
      </label>

      <select id="themeChoice">

        <option
          value="dark"
          ${
            current === "dark"
              ? "selected"
              : ""
          }
        >
          Sombre
        </option>

        <option
          value="light"
          ${
            current === "light"
              ? "selected"
              : ""
          }
        >
          Clair
        </option>

        <option
          value="auto"
          ${
            current === "auto"
              ? "selected"
              : ""
          }
        >
          Automatique
        </option>

      </select>

    </div>

  `;

  $("themeChoice")
    .onchange =
      event => {

        const value =
          event.target.value;

        localStorage.setItem(
          "novaThemeChoice",
          value
        );

        applyTheme(
          value
        );

        showToast(
          "Thème modifié"
        );

      };

  openModal();

}


/* =========================================================
   ORDERS
========================================================= */

function statusClass(
  status
){

  if(status === "Livrée")
    return "delivered";

  if(status === "Annulée")
    return "cancelled";

  if(
    status ===
    "Remboursement en cours"
  )
    return "refund";

  if(status === "En transit")
    return "transit";

  if(
    status ===
    "Livraison proche"
  )
    return "nearby";

  return "";

}


function statusIcon(
  status
){

  const icons = {

    "Enregistrée":
      "📝",

    "Acceptée":
      "✅",

    "Préparation":
      "📦",

    "En transit":
      "🚚",

    "Livraison proche":
      "🏠",

    "Livrée":
      "🎉",

    "Annulée":
      "❌",

    "Remboursement en cours":
      "💸"

  };

  return (
    icons[status] ||
    "📦"
  );

}


function canDeleteOrder(
  order
){

  return (
    order.status ===
      "Livrée" ||
    order.status ===
      "Annulée"
  );

}


async function deleteUserOrder(
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
          d.id ===
          orderId
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

    if(
      !canDeleteOrder(
        order
      )
    ){

      showToast(
        "Cette commande ne peut pas encore être supprimée."
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

}


async function openOrders(){

  if(!currentUser){

    showToast(
      "Connecte-toi pour voir tes commandes."
    );

    openAccount();

    return;

  }

  modalContent.innerHTML = `

    <div class="orders-modal">

      <h2>
        Mes commandes
      </h2>

      <div
        id="ordersList"
        class="orders-list"
      >

        <div class="loading">
          Chargement...
        </div>

      </div>

    </div>

  `;

  openModal();

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

    const list =
      $("ordersList");

    if(!orders.length){

      list.innerHTML = `

        <div class="empty-state">

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

            const deletable =
              canDeleteOrder(
                order
              );

            return `

              <article
                class="order nova-order-card"
              >

                <div
                  class="order-head nova-order-head"
                >

                  <div>

                    <strong>
                      Commande #${
                        escapeHTML(
                          order.id
                        )
                      }
                    </strong>

                    <div class="muted">
                      ${formatTimestamp(
                        order.createdAt
                      )}
                    </div>

                  </div>

                  <span
                    class="nova-status ${statusClass(
                      status
                    )}"
                  >
                    ${statusIcon(
                      status
                    )}
                    ${escapeHTML(
                      status
                    )}
                  </span>

                </div>

                <div
                  class="nova-order-items"
                >

                  ${
                    items
                      .map(
                        item => `

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
                  }

                </div>

                <div
                  class="nova-package-box"
                >

                  <div>
                    <strong>
                      📦 Livraison
                    </strong>
                  </div>

                  ${
                    order.packageCity
                      ? `
                        <div>
                          📍
                          ${escapeHTML(
                            order.packageCity
                          )}
                        </div>
                      `
                      : ""
                  }

                  ${
                    order.trackingNumber
                      ? `
                        <div>
                          🚚 Suivi :
                          <strong>
                            ${escapeHTML(
                              order.trackingNumber
                            )}
                          </strong>
                        </div>
                      `
                      : ""
                  }

                  ${
                    order.deliveryDuration
                      ? `
                        <div>
                          ⏱️
                          ${escapeHTML(
                            order.deliveryDuration
                          )}
                        </div>
                      `
                      : ""
                  }

                  ${
                    order.estimatedDelivery
                      ? `
                        <div>
                          📅 Livraison prévue :
                          ${escapeHTML(
                            order.estimatedDelivery
                          )}
                        </div>
                      `
                      : ""
                  }

                  ${
                    !order.packageCity &&
                    !order.trackingNumber &&
                    !order.deliveryDuration &&
                    !order.estimatedDelivery
                      ? `
                        <div class="muted">
                          Les informations de livraison
                          seront ajoutées prochainement.
                        </div>
                      `
                      : ""
                  }

                </div>

                <div class="order-total">

                  <strong>
                    Total :
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

                ${
                  deletable
                    ? `

                      <button
                        class="secondary nova-delete-order"
                        data-delete-order="${
                          escapeAttribute(
                            order.id
                          )
                        }"
                      >
                        🗑️ Supprimer cette commande
                      </button>

                    `
                    : ""
                }

              </article>

            `;

          }
        )
        .join("");

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
                confirm(
                  "Supprimer définitivement cette commande ?"
                )
              ){

                await deleteUserOrder(
                  orderId
                );

              }

            };

        }
      );

  }catch(error){

    $("ordersList")
      .innerHTML = `

        <div class="setting">

          <small>
            ${escapeHTML(
              error.message
            )}
          </small>

        </div>

      `;

  }

}


/* =========================================================
   CHECKOUT
========================================================= */

let promoApplied =
  false;


function checkoutAddress(){

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
      $("checkoutPostalCode")
        ?.value
        .trim() || "",

    city:
      $("checkoutCity")
        ?.value
        .trim() || "",

    country:
      $("checkoutCountry")
        ?.value
        .trim() || ""

  };

}


function checkoutForm(){

  const subtotal =
    cartSubtotal();

  const total =
    promoApplied
      ? 0
      : subtotal;

  modalContent.innerHTML = `

    <div class="checkout">

      <h2>
        Finaliser la commande
      </h2>

      <div class="checkout-layout">

        <div>

          <h3>
            Adresse de livraison
          </h3>

          <div class="form-grid">

            <input
              id="checkoutFirstName"
              placeholder="Prénom"
              required
            >

            <input
              id="checkoutLastName"
              placeholder="Nom"
              required
            >

            <input
              id="checkoutStreet"
              placeholder="Adresse"
              required
            >

            <input
              id="checkoutPostalCode"
              placeholder="Code postal"
              required
            >

            <input
              id="checkoutCity"
              placeholder="Ville"
              required
            >

            <input
              id="checkoutCountry"
              placeholder="Pays"
              value="France"
              required
            >

          </div>

          <h3>
            Code promo
          </h3>

          <div class="promo-row">

            <input
              id="promoInput"
              placeholder="Code promo"
            >

            <button
              class="secondary"
              id="promoButton"
            >
              Appliquer
            </button>

          </div>

          <div
            id="promoMessage"
            class="promo-message"
          >
            ${
              promoApplied
                ? "✓ Code NOVA100 appliqué : commande gratuite"
                : ""
            }
          </div>

        </div>

        <div class="checkout-summary">

          <h3>
            Résumé
          </h3>

          <div class="summary-row">

            <span>
              Sous-total
            </span>

            <strong>
              ${money(
                subtotal
              )}
            </strong>

          </div>

          <div class="summary-row total-row">

            <span>
              Total
            </span>

            <strong>
              ${money(
                total
              )}
            </strong>

          </div>

          <h3>
            Paiement
          </h3>

          ${
            total === 0
              ? `
                <button
                  class="primary full"
                  id="freeOrderButton"
                >
                  🎁 Valider la commande gratuite
                </button>
              `
              : `

                <div
                  class="payment-choice"
                >

                  <button
                    class="primary full"
                    id="paypalPaymentButton"
                  >
                    PayPal
                  </button>

                  <button
                    class="secondary full"
                    id="cardPaymentButton"
                  >
                    💳 Payer par CB
                  </button>

                </div>

              `
          }

        </div>

      </div>

    </div>

  `;

  $("promoButton")
    .onclick =
      () => {

        const code =
          $("promoInput")
            .value
            .trim()
            .toUpperCase();

        if(code === "NOVA100"){

          promoApplied =
            true;

          checkoutForm();

          showToast(
            "Code NOVA100 appliqué"
          );

        }else{

          showToast(
            "Code promo incorrect"
          );

        }

      };

  $("freeOrderButton")
    ?.addEventListener(
      "click",
      () =>
        createCheckoutOrder(
          "free"
        )
    );

  $("paypalPaymentButton")
    ?.addEventListener(
      "click",
      () =>
        createCheckoutOrder(
          "paypal"
        )
    );

  $("cardPaymentButton")
    ?.addEventListener(
      "click",
      openCardPayment
    );

}


async function createCheckoutOrder(
  paymentType
){

  if(!currentUser){

    showToast(
      "Connecte-toi avant de commander."
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

  const address =
    checkoutAddress();

  if(
    !address.firstName ||
    !address.lastName ||
    !address.street ||
    !address.postalCode ||
    !address.city ||
    !address.country
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

  try{

    const orderRef =
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

          subtotal,

          total,

          promoCode:
            promoApplied
              ? "NOVA100"
              : "",

          discount:
            subtotal -
            total,

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

    if(total === 0){

      showToast(
        "Commande gratuite enregistrée 🎉"
      );

      setTimeout(
        () => {

          openOrders();

        },
        700
      );

      return;

    }

    if(
      paymentType ===
      "paypal"
    ){

      const paypalAmount =
        Number(total);

      const paypalURL =
        "https://paypal.me/SH0PNOVA/" +
        encodeURIComponent(
          paypalAmount.toFixed(2)
        ) +
        "EUR";

      showToast(
        "Redirection vers PayPal..."
      );

      window.location.href =
        paypalURL;

    }

  }catch(error){

    showToast(
      "Erreur : " +
      error.message
    );

  }

}


/* =========================================================
   CARD PAYMENT
========================================================= */

function openCardPayment(){

  const total =
    promoApplied
      ? 0
      : cartSubtotal();

  modalContent.innerHTML = `

    <div class="modal-box card-payment">

      <button
        class="secondary"
        id="backToCheckout"
      >
        ← Retour
      </button>

      <h2>
        Paiement par carte
      </h2>

      <p class="muted">
        Total à payer :
        <strong>
          ${money(total)}
        </strong>
      </p>

      <label>
        Nom complet
      </label>

      <input
        id="cardDemoName"
        type="text"
        placeholder="Nom complet"
        autocomplete="off"
      >

      <label>
        Numéro de carte
      </label>

      <input
        id="cardDemoNumber"
        type="text"
        inputmode="numeric"
        maxlength="19"
        placeholder="1234 5678 9012 3456"
        autocomplete="off"
      >

      <div class="card-row">

        <div>

          <label>
            Expiration
          </label>

          <input
            id="cardDemoExpiry"
            type="text"
            inputmode="numeric"
            maxlength="5"
            placeholder="MM/AA"
            autocomplete="off"
          >

        </div>

        <div>

          <label>
            CVV
          </label>

          <input
            id="cardDemoCvv"
            type="password"
            inputmode="numeric"
            maxlength="4"
            placeholder="CVV"
            autocomplete="off"
          >

        </div>

      </div>

      <button
        class="primary full"
        id="validateCardPayment"
      >
        💳 Valider le paiement
      </button>

      <p
        id="cardPaymentMessage"
        class="card-payment-message"
      ></p>

    </div>

  `;


  $("backToCheckout")
    .onclick =
      checkoutForm;


  $("cardDemoNumber")
    .addEventListener(
      "input",
      event => {

        let value =
          event.target.value
            .replace(
              /\D/g,
              ""
            )
            .slice(
              0,
              16
            );

        value =
          value.match(
            /.{1,4}/g
          )?.join(" ") ||
          "";

        event.target.value =
          value;

      }
    );


  $("cardDemoExpiry")
    .addEventListener(
      "input",
      event => {

        let value =
          event.target.value
            .replace(
              /\D/g,
              ""
            )
            .slice(
              0,
              4
            );

        if(
          value.length >
          2
        ){

          value =
            value.slice(
              0,
              2
            ) +
            "/" +
            value.slice(
              2
            );

        }

        event.target.value =
          value;

      }
    );


  $("cardDemoCvv")
    .addEventListener(
      "input",
      event => {

        event.target.value =
          event.target.value
            .replace(
              /\D/g,
              ""
            )
            .slice(
              0,
              4
            );

      }
    );


  $("validateCardPayment")
    .onclick =
      () => {

        const message =
          $("cardPaymentMessage");

        message.textContent =
          "Carte incorrecte";

        showToast(
          "Carte incorrecte"
        );

        $("cardDemoName")
          .value = "";

        $("cardDemoNumber")
          .value = "";

        $("cardDemoExpiry")
          .value = "";

        $("cardDemoCvv")
          .value = "";

      };

}


/* =========================================================
   ADMIN STATUS
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


function adminStatusBadge(
  status
){

  return `
    <span
      class="nova-status ${statusClass(
        status
      )}"
    >
      ${statusIcon(
        status
      )}
      ${escapeHTML(
        status
      )}
    </span>
  `;

}


async function openAdmin(){

  if(!currentUser){

    showToast(
      "Connecte-toi avec le compte admin."
    );

    openAccount();

    return;

  }

  if(
    currentUser.email
      ?.trim()
      .toLowerCase() !==
    ADMIN_EMAIL
      .trim()
      .toLowerCase()
  ){

    showToast(
      "Accès administrateur refusé."
    );

    return;

  }

  const saved =
    localStorage.getItem(
      ADMIN_ACCESS_KEY
    );

  if(saved !== "true"){

    const code =
      prompt(
        "Code administrateur :"
      );

    if(code !== ADMIN_CODE){

      showToast(
        "Code administrateur incorrect."
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


async function renderAdmin(){

  modalContent.innerHTML = `

    <div class="admin-panel">

      <div class="admin-header">

        <div>

          <h2>
            Dashboard NovaShop
          </h2>

          <p class="muted">
            Gestion des commandes
          </p>

        </div>

        <button
          class="secondary"
          id="refreshAdmin"
        >
          🔄 Actualiser
        </button>

      </div>

      <div
        id="adminOrders"
        class="admin-orders"
      >

        <div class="loading">
          Chargement des commandes...
        </div>

      </div>

    </div>

  `;

  $("refreshAdmin")
    .onclick =
      renderAdmin;

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

      $("adminOrders")
        .innerHTML = `

          <div class="empty-state">

            <div class="empty-icon">
              📦
            </div>

            <h3>
              Aucune commande
            </h3>

          </div>

        `;

      openModal();

      return;

    }

    $("adminOrders")
      .innerHTML = orders
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

            return `

              <article
                class="admin-order"
              >

                <div
                  class="admin-order-top"
                >

                  <div>

                    <strong>
                      #${escapeHTML(
                        order.id
                      )}
                    </strong>

                    <div class="muted">
                      ${escapeHTML(
                        order.email ||
                        ""
                      )}
                    </div>

                    <div class="muted">
                      ${formatTimestamp(
                        order.createdAt
                      )}
                    </div>

                  </div>

                  ${adminStatusBadge(
                    status
                  )}

                </div>

                <div class="admin-items">

                  ${
                    items
                      .map(
                        item => `

                          <div
                            class="admin-item"
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
                  }

                </div>

                <div
                  class="admin-order-grid"
                >

                  <div>

                    <label>
                      Statut
                    </label>

                    <select
                      data-status="${
                        escapeAttribute(
                          order.id
                        )
                      }"
                    >

                      ${ORDER_STATUSES
                        .map(
                          s => `

                            <option
                              value="${escapeAttribute(
                                s
                              )}"
                              ${
                                s === status
                                  ? "selected"
                                  : ""
                              }
                            >
                              ${escapeHTML(
                                s
                              )}
                            </option>

                          `
                        )
                        .join("")}

                    </select>

                  </div>

                  <div>

                    <label>
                      Ville du colis
                    </label>

                    <input
                      data-city="${
                        escapeAttribute(
                          order.id
                        )
                      }"
                      value="${escapeAttribute(
                        order.packageCity ||
                        ""
                      )}"
                      placeholder="Ex : Lille"
                    >

                  </div>

                  <div>

                    <label>
                      Numéro de suivi
                    </label>

                    <input
                      data-tracking="${
                        escapeAttribute(
                          order.id
                        )
                      }"
                      value="${escapeAttribute(
                        order.trackingNumber ||
                        ""
                      )}"
                      placeholder="Ex : FR123456789"
                    >

                  </div>

                  <div>

                    <label>
                      Durée
                    </label>

                    <input
                      data-duration="${
                        escapeAttribute(
                          order.id
                        )
                      }"
                      value="${escapeAttribute(
                        order.deliveryDuration ||
                        ""
                      )}"
                      placeholder="Ex : 2 à 3 jours"
                    >

                  </div>

                  <div>

                    <label>
                      Date estimée
                    </label>

                    <input
                      type="date"
                      data-date="${
                        escapeAttribute(
                          order.id
                        )
                      }"
                      value="${escapeAttribute(
                        order.estimatedDelivery ||
                        ""
                      )}"
                    >

                  </div>

                </div>

                <div
                  class="admin-order-info"
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
                      "Non défini"
                    )}
                  </div>

                </div>

                <div
                  class="admin-actions"
                >

                  ${
                    order.paymentMethod ===
                      "PayPal.Me" &&
                    order.paymentStatus !==
                      "accepted"
                      ? `

                        <button
                          class="primary"
                          data-accept-paypal="${
                            escapeAttribute(
                              order.id
                            )
                          }"
                        >
                          ✅ Accepter PayPal
                        </button>

                      `
                      : ""
                  }

                  <button
                    class="primary"
                    data-save-order="${
                      escapeAttribute(
                        order.id
                      )
                    }"
                  >
                    💾 Enregistrer le suivi
                  </button>

                  <button
                    class="secondary"
                    data-print-order="${
                      escapeAttribute(
                        order.id
                      )
                    }"
                  >
                    🖨️ Facture
                  </button>

                </div>

              </article>

            `;

          }
        )
        .join("");

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

    $("adminOrders")
      .innerHTML = `

        <div class="setting">

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


async function saveAdminOrder(
  orderId
){

  if(!isAdmin())
    return;

  const statusEl =
    document.querySelector(
      `[data-status="${CSS.escape(
        orderId
      )}"]`
    );

  const cityEl =
    document.querySelector(
      `[data-city="${CSS.escape(
        orderId
      )}"]`
    );

  const trackingEl =
    document.querySelector(
      `[data-tracking="${CSS.escape(
        orderId
      )}"]`
    );

  const durationEl =
    document.querySelector(
      `[data-duration="${CSS.escape(
        orderId
      )}"]`
    );

  const dateEl =
    document.querySelector(
      `[data-date="${CSS.escape(
        orderId
      )}"]`
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

}/* =========================================================
   ADMIN TRACKING
========================================================= */

async function saveOrderTracking(orderId){

  if(!isAdmin()) return;

  const statusEl =
    document.getElementById(
      "status-" + orderId
    );

  const cityEl =
    document.getElementById(
      "city-" + orderId
    );

  const trackingEl =
    document.getElementById(
      "tracking-" + orderId
    );

  const durationEl =
    document.getElementById(
      "duration-" + orderId
    );

  const dateEl =
    document.getElementById(
      "date-" + orderId
    );

  if(!statusEl) return;

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
          cityEl?.value.trim() || "",

        trackingNumber:
          trackingEl?.value.trim() || "",

        deliveryDuration:
          durationEl?.value.trim() || "",

        estimatedDelivery:
          dateEl?.value || "",

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
   ADMIN DELETE ALL ORDERS
========================================================= */

async function deleteAllOrders(){

  if(!isAdmin()) return;

  const confirmation =
    prompt(
      "Tape SUPPRIMER pour supprimer toutes les commandes."
    );

  if(
    confirmation !==
    "SUPPRIMER"
  ){

    showToast(
      "Suppression annulée"
    );

    return;

  }

  try{

    const snapshot =
      await getDocs(
        collection(
          db,
          "orders"
        )
      );

    for(
      const orderDoc
      of snapshot.docs
    ){

      await deleteDoc(
        doc(
          db,
          "orders",
          orderDoc.id
        )
      );

    }

    showToast(
      "Toutes les commandes ont été supprimées."
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
   ADMIN INVOICE
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

    const found =
      snapshot.docs.find(
        d =>
          d.id ===
          orderId
      );

    if(!found){

      showToast(
        "Commande introuvable"
      );

      return;

    }

    const order = {
      id:
        found.id,
      ...found.data()
    };

    const items =
      Array.isArray(
        order.items
      )
        ? order.items
        : [];

    const address =
      order.address ||
      {};

    const invoiceItems =
      items
        .map(
          item => `

            <tr>

              <td>
                ${escapeHTML(
                  item.name ||
                  "Produit"
                )}
              </td>

              <td>
                ${Number(
                  item.qty ||
                  1
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
                    1
                  )
                )}
              </td>

            </tr>

          `
        )
        .join("");

    const invoiceWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=700"
      );

    if(!invoiceWindow){

      showToast(
        "Autorise les fenêtres pop-up pour imprimer la facture."
      );

      return;

    }

    invoiceWindow.document.write(`

      <!DOCTYPE html>

      <html lang="fr">

      <head>

        <meta charset="UTF-8">

        <title>
          Facture NovaShop #${escapeHTML(
            order.id
          )}
        </title>

        <style>

          *{
            box-sizing:border-box;
          }

          body{
            margin:0;
            padding:40px;
            font-family:Arial,sans-serif;
            color:#111827;
            background:#fff;
          }

          .invoice{
            max-width:850px;
            margin:auto;
          }

          .top{
            display:flex;
            justify-content:space-between;
            gap:30px;
            border-bottom:2px solid #111827;
            padding-bottom:25px;
            margin-bottom:25px;
          }

          h1{
            margin:0 0 8px;
            font-size:30px;
          }

          h2{
            margin-top:30px;
            font-size:18px;
          }

          .muted{
            color:#6b7280;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:15px;
          }

          th,
          td{
            padding:12px;
            border-bottom:1px solid #e5e7eb;
            text-align:left;
          }

          th{
            background:#f3f4f6;
          }

          .total{
            margin-top:25px;
            text-align:right;
            font-size:22px;
            font-weight:800;
          }

          .status{
            display:inline-block;
            padding:8px 12px;
            border-radius:999px;
            background:#f3f4f6;
            font-weight:700;
          }

          @media print{

            body{
              padding:0;
            }

            .no-print{
              display:none;
            }

          }

        </style>

      </head>

      <body>

        <div class="invoice">

          <div class="top">

            <div>

              <h1>
                NovaShop
              </h1>

              <div class="muted">
                Facture de commande
              </div>

            </div>

            <div>

              <strong>
                Commande #${escapeHTML(
                  order.id
                )}
              </strong>

              <div class="muted">
                ${formatTimestamp(
                  order.createdAt
                )}
              </div>

            </div>

          </div>

          <h2>
            Client
          </h2>

          <p>

            ${escapeHTML(
              address.firstName ||
              ""
            )}
            ${escapeHTML(
              address.lastName ||
              ""
            )}

            <br>

            ${escapeHTML(
              address.street ||
              ""
            )}

            <br>

            ${escapeHTML(
              address.postalCode ||
              ""
            )}
            ${escapeHTML(
              address.city ||
              ""
            )}

            <br>

            ${escapeHTML(
              address.country ||
              ""
            )}

          </p>

          <h2>
            Livraison
          </h2>

          <p>

            <span class="status">
              ${escapeHTML(
                order.status ||
                "Enregistrée"
              )}
            </span>

          </p>

          ${
            order.trackingNumber
              ? `
                <p>
                  Numéro de suivi :
                  <strong>
                    ${escapeHTML(
                      order.trackingNumber
                    )}
                  </strong>
                </p>
              `
              : ""
          }

          <table>

            <thead>

              <tr>

                <th>
                  Produit
                </th>

                <th>
                  Qté
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

              ${invoiceItems}

            </tbody>

          </table>

          <div class="total">

            Total :
            ${money(
              Number(
                order.total ||
                0
              )
            )}

          </div>

          <p class="muted">

            Paiement :
            ${escapeHTML(
              order.paymentMethod ||
              "Non défini"
            )}

          </p>

          <button
            class="no-print"
            onclick="window.print()"
          >
            🖨️ Imprimer
          </button>

        </div>

      </body>

      </html>

    `);

    invoiceWindow.document.close();

  }catch(error){

    showToast(
      "Erreur : " +
      error.message
    );

  }

}


/* =========================================================
   ORDER RESPONSIVE STYLE
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
        minmax(
          180px,
          1fr
        )
      );
    gap:12px;
    margin-top:16px;
  }

  .admin-order-grid
  label{
    display:block;
    margin-bottom:6px;
    font-size:12px;
    font-weight:800;
    opacity:.8;
  }

  .admin-order-grid
  input,
  .admin-order-grid
  select{
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
      width:100%;
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

  }

`;

document.head.appendChild(
  novaOrderResponsiveStyle
);


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(
  value
){

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


function escapeAttribute(
  value
){

  return escapeHTML(
    value
  );

}


function formatTimestamp(
  timestamp
){

  if(!timestamp)
    return "Date inconnue";

  try{

    let date;

    if(
      typeof timestamp.toDate ===
      "function"
    ){

      date =
        timestamp.toDate();

    }else if(
      timestamp.seconds
    ){

      date =
        new Date(
          timestamp.seconds *
          1000
        );

    }else{

      date =
        new Date(
          timestamp
        );

    }

    if(
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
    ).format(
      date
    );

  }catch{

    return "Date inconnue";

  }

}


/* =========================================================
   GLOBAL ACTIONS
========================================================= */

window.openCart =
  openCart;

window.closeCart =
  closeCart;

window.openProduct =
  openProduct;

window.renderProducts =
  renderProducts;

window.renderCart =
  renderCart;

window.showToast =
  showToast;

window.openOrders =
  openOrders;

window.openAdmin =
  openAdmin;

window.saveOrderTracking =
  saveOrderTracking;

window.saveAdminOrder =
  saveAdminOrder;

window.deleteAllOrders =
  deleteAllOrders;

window.printAdminInvoice =
  printAdminInvoice;


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

}/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
  auth,
  user => {

    currentUser = user;

    const connectedEmail =
      user?.email
        ?.trim()
        .toLowerCase() ||
      "";

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

  }
);


/* =========================================================
   BUTTON EVENTS
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
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if(
      event.key ===
      "Escape"
    ){

      closeModal();

      closeCart();

    }

  }
);


/* =========================================================
   CHECKOUT BUTTON
========================================================= */

if(checkoutBtn){

  checkoutBtn.onclick =
    () => {

      if(!cartDetailed().length){

        showToast(
          "Ton panier est vide."
        );

        return;

      }

      if(!currentUser){

        showToast(
          "Connecte-toi pour commander."
        );

        openAccount();

        return;

      }

      promoApplied =
        false;

      checkoutForm();

      openModal();

    };

}


/* =========================================================
   CART DRAWER
========================================================= */

function refreshCartUI(){

  renderCart();

  if(
    cartDetailed().length ===
    0
  ){

    closeCart();

  }

}


/* =========================================================
   ACCOUNT EXTRA ACTIONS
========================================================= */

function updateAccountButton(){

  if(!accountBtn)
    return;

  if(currentUser){

    accountBtn.dataset
      .connected = "true";

    accountBtn.title =
      currentUser.email ||
      "Mon compte";

  }else{

    accountBtn.dataset
      .connected = "false";

    accountBtn.title =
      "Mon compte";

  }

}


/* =========================================================
   ADMIN ACCESS CHECK
========================================================= */

function checkAdminAccess(){

  if(!currentUser)
    return false;

  const email =
    currentUser.email
      ?.trim()
      .toLowerCase() ||
    "";

  return (
    email ===
    ADMIN_EMAIL
      .trim()
      .toLowerCase()
  );

}


/* =========================================================
   ADMIN DASHBOARD EXTRA
========================================================= */

function adminOrderStatusOptions(
  currentStatus
){

  return ORDER_STATUSES
    .map(
      status => `

        <option
          value="${escapeAttribute(
            status
          )}"
          ${
            status ===
            currentStatus
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
    .join("");

}


/* =========================================================
   ORDER STATUS DESCRIPTION
========================================================= */

function statusDescription(
  status
){

  const descriptions = {

    "Enregistrée":
      "La commande a bien été enregistrée.",

    "Acceptée":
      "La commande a été acceptée.",

    "Préparation":
      "La commande est en préparation.",

    "En transit":
      "Le colis est en cours de transport.",

    "Livraison proche":
      "Le colis est proche de l'adresse de livraison.",

    "Livrée":
      "La commande a été livrée.",

    "Annulée":
      "La commande a été annulée.",

    "Remboursement en cours":
      "Le remboursement est en cours."

  };

  return (
    descriptions[status] ||
    ""
  );

}


/* =========================================================
   ORDER TIMELINE
========================================================= */

function orderTimeline(
  currentStatus
){

  const statuses = [
    "Enregistrée",
    "Acceptée",
    "Préparation",
    "En transit",
    "Livraison proche",
    "Livrée"
  ];

  if(
    currentStatus ===
    "Annulée"
  ){

    return `

      <div class="order-timeline">

        <div class="timeline-step cancelled">

          <div class="timeline-dot">
            ❌
          </div>

          <div class="timeline-content">

            <strong>
              Commande annulée
            </strong>

            <span>
              ${escapeHTML(
                statusDescription(
                  currentStatus
                )
              )}
            </span>

          </div>

        </div>

      </div>

    `;

  }

  if(
    currentStatus ===
    "Remboursement en cours"
  ){

    return `

      <div class="order-timeline">

        <div class="timeline-step refund">

          <div class="timeline-dot">
            💸
          </div>

          <div class="timeline-content">

            <strong>
              Remboursement en cours
            </strong>

            <span>
              ${escapeHTML(
                statusDescription(
                  currentStatus
                )
              )}
            </span>

          </div>

        </div>

      </div>

    `;

  }

  const currentIndex =
    statuses.indexOf(
      currentStatus
    );

  return `

    <div class="order-timeline">

      ${
        statuses
          .map(
            (status,index) => {

              const active =
                index <=
                currentIndex;

              const isCurrent =
                status ===
                currentStatus;

              return `

                <div
                  class="
                    timeline-step
                    ${
                      active
                        ? "active"
                        : ""
                    }
                    ${
                      isCurrent
                        ? "current"
                        : ""
                    }
                  "
                >

                  <div class="timeline-dot">

                    ${
                      active
                        ? "✓"
                        : ""
                    }

                  </div>

                  <div class="timeline-content">

                    <strong>
                      ${escapeHTML(
                        status
                      )}
                    </strong>

                    ${
                      isCurrent
                        ? `
                          <span>
                            ${escapeHTML(
                              statusDescription(
                                status
                              )
                            )}
                          </span>
                        `
                        : ""
                    }

                  </div>

                </div>

              `;

            }
          )
          .join("")
      }

    </div>

  `;

}


/* =========================================================
   ADD TIMELINE STYLE
========================================================= */

const novaTimelineStyle =
  document.createElement(
    "style"
  );

novaTimelineStyle.textContent = `

  .order-timeline{
    display:grid;
    gap:0;
    margin-top:14px;
    padding:4px 0;
  }

  .timeline-step{
    display:flex;
    gap:10px;
    position:relative;
    min-height:48px;
    opacity:.42;
  }

  .timeline-step::after{
    content:"";
    position:absolute;
    left:13px;
    top:28px;
    bottom:0;
    width:2px;
    background:rgba(255,255,255,.1);
  }

  .timeline-step:last-child{
    min-height:40px;
  }

  .timeline-step:last-child::after{
    display:none;
  }

  .timeline-step.active{
    opacity:1;
  }

  .timeline-step.current{
    font-weight:700;
  }

  .timeline-step.cancelled,
  .timeline-step.refund{
    opacity:1;
  }

  .timeline-dot{
    width:28px;
    height:28px;
    min-width:28px;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(255,255,255,.08);
    position:relative;
    z-index:2;
    font-size:12px;
  }

  .timeline-step.active
  .timeline-dot{
    background:rgba(59,130,246,.22);
  }

  .timeline-step.current
  .timeline-dot{
    box-shadow:
      0 0 0 4px
      rgba(59,130,246,.1);
  }

  .timeline-step.cancelled
  .timeline-dot{
    background:rgba(239,68,68,.18);
  }

  .timeline-step.refund
  .timeline-dot{
    background:rgba(245,158,11,.18);
  }

  .timeline-content{
    display:flex;
    flex-direction:column;
    gap:2px;
    padding-top:3px;
    min-width:0;
  }

  .timeline-content strong{
    font-size:13px;
  }

  .timeline-content span{
    font-size:12px;
    opacity:.7;
    line-height:1.4;
  }

  @media(max-width:600px){

    .timeline-content strong{
      font-size:12px;
    }

    .timeline-content span{
      font-size:11px;
    }

  }

`;

document.head.appendChild(
  novaTimelineStyle
);


/* =========================================================
   REBUILD ORDERS WITH TIMELINE
========================================================= */

async function openOrdersDetailed(){

  if(!currentUser){

    showToast(
      "Connecte-toi pour voir tes commandes."
    );

    openAccount();

    return;

  }

  modalContent.innerHTML = `

    <div class="orders-modal">

      <h2>
        Mes commandes
      </h2>

      <div
        id="ordersList"
        class="orders-list"
      >

        <div class="loading">
          Chargement...
        </div>

      </div>

    </div>

  `;

  openModal();

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

    const list =
      $("ordersList");

    if(!list)
      return;

    if(!orders.length){

      list.innerHTML = `

        <div class="empty-state">

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

            const deletable =
              canDeleteOrder(
                order
              );

            return `

              <article
                class="order nova-order-card"
              >

                <div
                  class="order-head nova-order-head"
                >

                  <div>

                    <strong>
                      Commande #${
                        escapeHTML(
                          order.id
                        )
                      }
                    </strong>

                    <div class="muted">
                      ${formatTimestamp(
                        order.createdAt
                      )}
                    </div>

                  </div>

                  <span
                    class="nova-status ${statusClass(
                      status
                    )}"
                  >

                    ${statusIcon(
                      status
                    )}

                    ${escapeHTML(
                      status
                    )}

                  </span>

                </div>

                <div class="order-status-description">

                  ${escapeHTML(
                    statusDescription(
                      status
                    )
                  )}

                </div>

                ${orderTimeline(
                  status
                )}

                <div
                  class="nova-order-items"
                >

                  ${
                    items
                      .map(
                        item => `

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
                  }

                </div>

                <div
                  class="nova-package-box"
                >

                  <div>

                    <strong>
                      📦 Informations du colis
                    </strong>

                  </div>

                  ${
                    order.packageCity
                      ? `
                        <div>
                          📍 Destination :
                          <strong>
                            ${escapeHTML(
                              order.packageCity
                            )}
                          </strong>
                        </div>
                      `
                      : ""
                  }

                  ${
                    order.trackingNumber
                      ? `
                        <div>
                          🚚 Numéro de suivi :
                          <strong>
                            ${escapeHTML(
                              order.trackingNumber
                            )}
                          </strong>
                        </div>
                      `
                      : ""
                  }

                  ${
                    order.deliveryDuration
                      ? `
                        <div>
                          ⏱️ Livraison :
                          ${escapeHTML(
                            order.deliveryDuration
                          )}
                        </div>
                      `
                      : ""
                  }

                  ${
                    order.estimatedDelivery
                      ? `
                        <div>
                          📅 Date estimée :
                          <strong>
                            ${escapeHTML(
                              order.estimatedDelivery
                            )}
                          </strong>
                        </div>
                      `
                      : ""
                  }

                  ${
                    order.updatedAt
                      ? `
                        <div class="muted">
                          Dernière mise à jour :
                          ${formatTimestamp(
                            order.updatedAt
                          )}
                        </div>
                      `
                      : ""
                  }

                  ${
                    !order.packageCity &&
                    !order.trackingNumber &&
                    !order.deliveryDuration &&
                    !order.estimatedDelivery
                      ? `
                        <div class="muted">
                          Aucun détail de suivi
                          n'a encore été ajouté.
                        </div>
                      `
                      : ""
                  }

                </div>

                <div
                  class="order-total"
                >

                  <strong>
                    Total :
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

                ${
                  deletable
                    ? `

                      <button
                        class="secondary nova-delete-order"
                        data-delete-order="${
                          escapeAttribute(
                            order.id
                          )
                        }"
                      >
                        🗑️ Supprimer cette commande
                      </button>

                    `
                    : ""
                }

              </article>

            `;

          }
        )
        .join("");

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
                confirm(
                  "Supprimer définitivement cette commande ?"
                )
              ){

                await deleteUserOrder(
                  orderId
                );

              }

            };

        }
      );

  }catch(error){

    const list =
      $("ordersList");

    if(list){

      list.innerHTML = `

        <div class="setting">

          <small>
            ${escapeHTML(
              error.message
            )}
          </small>

        </div>

      `;

    }

  }

}


/* =========================================================
   USE DETAILED ORDERS
========================================================= */

ordersBtn.onclick =
  openOrdersDetailed;


/* =========================================================
   EXTRA ORDER STYLE
========================================================= */

const novaExtraOrderStyle =
  document.createElement(
    "style"
  );

novaExtraOrderStyle.textContent = `

  .order-status-description{
    margin-top:10px;
    font-size:13px;
    line-height:1.5;
    opacity:.75;
  }

  .orders-list{
    display:grid;
    gap:14px;
  }

  .nova-order-card{
    padding:16px;
    border-radius:16px;
    border:1px solid
      rgba(255,255,255,.08);
    background:
      rgba(255,255,255,.025);
  }

  .nova-order-card
  .order-total{
    display:flex;
    justify-content:space-between;
    gap:10px;
    margin-top:15px;
    padding-top:13px;
    border-top:1px solid
      rgba(255,255,255,.08);
  }

  @media(max-width:600px){

    .nova-order-card{
      border-radius:13px;
    }

    .order-status-description{
      font-size:12px;
    }

  }

`;

document.head.appendChild(
  novaExtraOrderStyle
);


/* =========================================================
   ADMIN ORDER CARD STYLE
========================================================= */

const novaAdminStyle =
  document.createElement(
    "style"
  );

novaAdminStyle.textContent = `

  .admin-panel{
    width:100%;
  }

  .admin-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:15px;
    margin-bottom:18px;
  }

  .admin-orders{
    display:grid;
    gap:14px;
  }

  .admin-order{
    padding:16px;
    border-radius:16px;
    background:
      rgba(255,255,255,.035);
    border:1px solid
      rgba(255,255,255,.08);
  }

  .admin-order-top{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:15px;
  }

  .admin-items{
    display:grid;
    gap:6px;
    margin-top:14px;
  }

  .admin-item{
    display:flex;
    justify-content:space-between;
    gap:10px;
    padding:9px 10px;
    border-radius:10px;
    background:
      rgba(255,255,255,.03);
    font-size:13px;
  }

  .admin-order-grid{
    margin-top:15px;
  }

  .admin-actions{
    margin-top:15px;
  }

  @media(max-width:600px){

    .admin-header{
      flex-direction:column;
      align-items:stretch;
    }

    .admin-header button{
      width:100%;
    }

    .admin-order{
      padding:12px;
    }

    .admin-order-top{
      flex-direction:column;
    }

  }

`;

document.head.appendChild(
  novaAdminStyle
);


/* =========================================================
   FIX ADMIN BUTTON VISIBILITY
========================================================= */

if(adminBtn){

  adminBtn.style.display =
    "none";

}


/* =========================================================
   ACCOUNT STATE UPDATE
========================================================= */

onAuthStateChanged(
  auth,
  user => {

    currentUser =
      user;

    updateAccountButton();

    if(
      user &&
      user.email
        ?.trim()
        .toLowerCase() ===
      ADMIN_EMAIL
        .trim()
        .toLowerCase()
    ){

      if(adminBtn){

        adminBtn.style.display =
          "grid";

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

  }
);


/* =========================================================
   CART CLICK SAFETY
========================================================= */

document.addEventListener(
  "click",
  event => {

    const addButton =
      event.target.closest(
        "[data-add-product]"
      );

    if(
      addButton &&
      productsGrid &&
      productsGrid.contains(
        addButton
      )
    ){

      return;

    }

  }
);


/* =========================================================
   LANGUAGE SYSTEM
========================================================= */

function applyLanguage(
  language
){

  document.documentElement
    .lang =
      language || "fr";

  localStorage.setItem(
    "novaLanguage",
    language || "fr"
  );

}


window.applyLanguage =
  applyLanguage;


/* =========================================================
   NOVASHOP DEBUG
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
   CONSOLE
========================================================= */

console.log(
  `%cNovaShop chargé : ${products.length} produits`,
  "font-weight:bold;font-size:14px"
);


/* =========================================================
   FINAL SAFETY CHECK
========================================================= */

if(
  typeof renderCategories ===
  "function"
){

  renderCategories();

}

if(
  typeof renderProducts ===
  "function"
){

  renderProducts();

}

if(
  typeof renderCart ===
  "function"
){

  renderCart();

}/* =========================================================
   SUITE FINALE
========================================================= */

function escapeHTML(value){

  return String(value)
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


function formatTimestamp(timestamp){

  if(!timestamp){

    return "Date inconnue";

  }

  try{

    const date =
      new Date(
        timestamp.seconds * 1000
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
   RESPONSIVE COMMANDES / COLIS
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
    width:100%;
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


if(
  typeof applyLanguage ===
  "function"
){

  applyLanguage(
    savedLanguage
  );

}


/* =========================================================
   NOVASHOP GLOBAL
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
  `%cNovaShop chargé : ${products.length} produits`,
  "font-weight:bold;font-size:14px"
);


/* =========================================================
   FINAL CHECK
========================================================= */

if(
  typeof renderCategories ===
  "function"
){

  renderCategories();

}

if(
  typeof renderProducts ===
  "function"
){

  renderProducts();

}

if(
  typeof renderCart ===
  "function"
){

  renderCart();

}


/* =========================================================
   FIN NOVASHOP
========================================================= */
