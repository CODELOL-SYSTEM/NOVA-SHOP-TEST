import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore,collection,addDoc,getDocs,query,where,serverTimestamp,deleteDoc,doc,updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig={
  apiKey:"AIzaSyAZ5vAkAEfIBpfLyhxgO7uvNdJ67KYKWD0",
  authDomain:"novashop-4ee63.firebaseapp.com",
  projectId:"novashop-4ee63",
  storageBucket:"novashop-4ee63.firebasestorage.app",
  messagingSenderId:"1044964015809",
  appId:"1:1044964015809:web:4eafe0b1aede48f8539e40",
  measurementId:"G-XNY5X2VMY9"
};

const firebaseApp=initializeApp(firebaseConfig);
const auth=getAuth(firebaseApp);
const db=getFirestore(firebaseApp);

const ADMIN_EMAIL="pc2alex.les@gmail.com";
const ADMIN_CODE="NOVA-ADMIN-2026";
const ADMIN_KEY="novaAdminAuthorized";
const PAYPAL_URL="https://paypal.me/SH0PNOVA";

const $=id=>document.getElementById(id);

const searchInput=$("searchInput");
const categoriesEl=$("categories");
const productsGrid=$("productGrid");
const productCount=$("productCount");

const cartBtn=$("cartBtn");
const cartBadge=$("cartBadge");
const overlay=$("overlay");
const cartDrawer=$("cartDrawer");
const cartClose=$("closeCart");
const cartItems=$("cartItems");
const cartTotal=$("cartTotal");
const checkoutBtn=$("checkoutBtn");

const settingsBtn=$("settingsBtn");
const accountBtn=$("accountBtn");
const ordersBtn=$("ordersBtn");
const adminBtn=$("adminBtn");

const modal=$("modalLayer");
const modalContent=$("modalContent");
const modalClose=$("modalClose");

const FALLBACK_IMAGE="https://placehold.co/800x800/111827/ffffff?text=NovaShop";

const toastContainer=document.createElement("div");
toastContainer.id="novaToastContainer";
toastContainer.style.cssText="position:fixed;z-index:9999;left:50%;bottom:22px;transform:translateX(-50%);display:flex;flex-direction:column;gap:8px;pointer-events:none";
document.body.appendChild(toastContainer);

let currentUser=null;
let selectedCategory="Toutes";
let searchValue="";
let cart=[];
let reviewCache={};

function esc(v){
  return String(v??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function imageUrl(url){
  if(!url)return FALLBACK_IMAGE;

  if(/^(\.|data:|blob:)/.test(url)){
    return url;
  }

  return "https://wsrv.nl/?url="+encodeURIComponent(url);
}

function imageSrc(url){
  return esc(imageUrl(url));
}

function imageError(img){
  if(!img)return;

  const original=img.dataset.original;

  if(img.dataset.stage!=="original"){
    img.dataset.stage="original";
    img.src=original||FALLBACK_IMAGE;
  }else{
    img.src=FALLBACK_IMAGE;
  }
}

window.imageError=imageError;

function money(v){
  return new Intl.NumberFormat(
    "fr-FR",
    {
      style:"currency",
      currency:"EUR"
    }
  ).format(Number(v)||0);
}

function productPrice(v){
  return Number(v)===0
    ? "Prix à venir"
    : money(v);
}

function toast(message){
  const t=document.createElement("div");
  t.className="toast";
  t.textContent=message;

  toastContainer.appendChild(t);

  requestAnimationFrame(()=>{
    t.classList.add("show");
  });

  setTimeout(()=>{
    t.classList.remove("show");

    setTimeout(()=>{
      t.remove();
    },250);

  },2200);
}


const products=[

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
},

{
  id:"p44",
  name:"Apple iPhone 14 Pro 6,1\" 5G Double SIM 128 Go Argent",
  category:"Téléphones",
  price:400,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/07/3b/32/20069127/1540-1/tsp20260630131025/Apple-iPhone-14-Pro-6-1-5G-Double-SIM-128-Go-Argent.jpg"
},

{
  id:"p45",
  name:"Apple iPhone 15 6,1\" 5G Double SIM 128 Go Noir",
  category:"Téléphones",
  price:750,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/cd/f0/52/22212813/1540-1/tsp20260914144304/Apple-iPhone-15-6-1-5G-Double-SIM-128-Go-Noir.jpg"
},

{
  id:"p46",
  name:"Apple iPhone 16 6,1\" 5G 128 Go Double SIM Noir",
  category:"Téléphones",
  price:949.99,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDMFR/MDM/fe/47/66/23480318/3756-1/tsp20260920085557/Apple-iPhone-16-6-1-5G-128-Go-Double-SIM-Noir.jpg"
},

{
  id:"p47",
  name:"Apple iPhone 17 6,3\" 5G Double SIM 256 Go Noir",
  category:"Téléphones",
  price:0,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/19/86/b6/28739097/3756-1/tsp20260909180923/Apple-iPhone-17-6-3-5G-Double-SIM-256-Go-Noir.jpg"
},

{
  id:"p48",
  name:"Apple iPhone 18 Pro 6,3\" 5G Double SIM 256 Go Noir",
  category:"Téléphones",
  price:1199.99,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/62/73/c7/29848418/1540-1/tsp20260920091102/Apple-iPhone-18-Pro-6-3-5G-Double-SIM-256-Go-Noir.jpg"
},

{
  id:"p49",
  name:"Smartphone Samsung Galaxy S23 6.1\" Nano SIM 5G 8 Go RAM 256 Go Noir",
  category:"Téléphones",
  price:230,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/0d/c0/44/21282829/1540-1/tsp20260829031739/Smartphone-Samsung-Galaxy-S23-6-1-Nano-SIM-5G-8-Go-RAM-256-Go-Noir.jpg"
},

{
  id:"p50",
  name:"Smartphone Samsung Galaxy S24 6,2\" 5G Nano SIM 256 Go Noir",
  category:"Téléphones",
  price:449.90,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/a6/f6/5a/22738598/1540-1/tsp20260319135101/Smartphone-Samsung-Galaxy-S24-6-2-5G-Nano-SIM-256-Go-Noir.jpg"
},

{
  id:"p51",
  name:"Smartphone Samsung Galaxy S25 Edge 6,7\" 5G Nano SIM 256 Go Noir absolu Titane",
  category:"Téléphones",
  price:469.99,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/42/7b/ab/28015426/1540-1/tsp20260909180103/Smartphone-Samsung-Galaxy-S25-Edge-6-7-5G-Nano-SIM-256-Go-Noir-absolu-Titane.jpg"
},

{
  id:"p52",
  name:"Pack Smartphone Samsung Galaxy S26 6,3\" 5G Nano SIM 256 Go Noir + Buds4 Noir",
  category:"Téléphones",
  price:650.99,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/e8/a2/c7/29860584/1540-1/tsp20260903144909/Pack-Smartphone-Samsung-Galaxy-S26-6-3-5G-Nano-SIM-256-Go-Noir-Buds4-Noir.jpg"
},

{
  id:"p53",
  name:"Smartphone Google Pixel 8 6.2\" 5G Double SIM 128 Go Vert Sauge",
  category:"Téléphones",
  price:200,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/37/bc/52/22199351/1540-1/tsp20260722081937/Smartphone-Google-Pixel-8-6-2-5G-Double-SIM-128-Go-Vert-Sauge.jpg"
},

{
  id:"p54",
  name:"Smartphone Google Pixel 9 6,3\" 5G Double nano-SIM 128 Go Noir Obsidienne",
  category:"Téléphones",
  price:400,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/f6/00/6d/23920886/1540-1/tsp20260914084700/Smartphone-Google-Pixel-9-6-3-5G-Double-nano-SIM-128-Go-Noir-Obsidienne.jpg"
},

{
  id:"p55",
  name:"Smartphone Google Pixel 10 6,3\" 5G Double SIM 256 Go Noir Volcanique",
  category:"Téléphones",
  price:600,
  image:"https://static.fnac-static.com/multimedia/Images/FR/MDM/4a/5f/b3/28532554/1540-1/tsp20260717111851/Smartphone-Google-Pixel-10-6-3-5G-Double-SIM-256-Go-Noir-Volcanique.jpg"
}

];const seedCart=()=>{
  try{
    const x=JSON.parse(localStorage.getItem("novaCart")||"[]");
    return Array.isArray(x)?x:[];
  }catch{
    return[];
  }
};

cart=seedCart();

const saveCart=()=>{
  localStorage.setItem(
    "novaCart",
    JSON.stringify(cart)
  );
};

const reviews=p=>{
  const n=parseInt(
    p.id.replace("p",""),
    10
  )||1;

  return{
    rating:Number(
      (4.4+(n%6)*.1).toFixed(1)
    ),
    count:132+(n*173%1604)
  };
};

const stars=r=>
  "★★★★★".slice(
    0,
    Math.round(r)
  )+
  "☆☆☆☆☆".slice(
    0,
    5-Math.round(r)
  );

function getCategories(){
  return[
    "Toutes",
    ...new Set(
      products.map(p=>p.category)
    )
  ];
}

function renderCategories(){
  if(!categoriesEl)return;

  categoriesEl.innerHTML=
    getCategories()
      .map(c=>`
        <button
          class="category-btn ${c===selectedCategory?"active":""}"
          data-category="${esc(c)}"
        >
          ${esc(c)}
        </button>
      `)
      .join("");

  categoriesEl
    .querySelectorAll("[data-category]")
    .forEach(b=>{
      b.onclick=()=>{
        selectedCategory=
          b.dataset.category;

        renderCategories();
        renderProducts();
      };
    });
}

function filtered(){
  const q=
    searchValue
      .trim()
      .toLowerCase();

  return products.filter(p=>
    (
      selectedCategory==="Toutes"||
      p.category===selectedCategory
    )&&(
      !q||
      p.name
        .toLowerCase()
        .includes(q)||
      p.category
        .toLowerCase()
        .includes(q)
    )
  );
}

function card(p){
  const r=reviews(p);

  return`
    <article class="product-card">

      <div class="product-image">
        ${
          p.new
            ? '<span class="new-badge">Nouveau</span>'
            : ''
        }

        <img
          src="${imageSrc(p.image)}"
          data-original="${esc(p.image)}"
          alt="${esc(p.name)}"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          onerror="imageError(this)"
        >
      </div>

      <div class="product-body">

        <div class="product-category">
          ${esc(p.category)}
        </div>

        <div class="product-name">
          ${esc(p.name)}
        </div>

        <div class="rating">

          <span class="stars">
            ${stars(r.rating)}
          </span>

          <span class="rating-score">
            ${r.rating
              .toFixed(1)
              .replace(".",",")}
          </span>

          <span class="rating-count">
            · ${r.count.toLocaleString("fr-FR")} avis
          </span>

        </div>

        <div class="product-bottom">

          <div class="price">
            ${productPrice(p.price)}
          </div>

        </div>

        <div class="product-actions">

          <button
            class="btn btn-secondary btn-small"
            data-view="${p.id}"
          >
            Voir
          </button>

          <button
            class="btn btn-primary btn-small"
            data-add="${p.id}"
          >
            🛒 Ajouter
          </button>

        </div>

      </div>

    </article>
  `;
}

function renderProducts(){
  if(!productsGrid)return;

  const list=filtered();

  if(productCount){
    productCount.textContent=
      `${list.length} produit${
        list.length>1?"s":""
      }`;
  }

  productsGrid.innerHTML=
    list.length
      ? list.map(card).join("")
      : `
        <div class="empty">
          <h3>Aucun produit trouvé</h3>
          <p>
            Essaie une autre recherche ou catégorie.
          </p>
        </div>
      `;

  productsGrid
    .querySelectorAll("[data-view]")
    .forEach(b=>{
      b.onclick=()=>{
        openProduct(
          b.dataset.view
        );
      };
    });

  productsGrid
    .querySelectorAll("[data-add]")
    .forEach(b=>{
      b.onclick=e=>{
        const p=products.find(
          x=>x.id===b.dataset.add
        );

        if(p){
          addToCart(
            p,
            e.currentTarget
          );
        }
      };
    });
}

function openModal(){
  modal?.classList.add("open");
  document.body.style.overflow="hidden";
}

function closeModal(){
  modal?.classList.remove("open");
  document.body.style.overflow="";
}

function openProduct(id){

  const p=products.find(
    x=>x.id===id
  );

  if(!p||!modalContent)return;

  const r=reviews(p);

  modalContent.innerHTML=`
    <div class="product-modal">

      <div class="modal-image">

        <img
          src="${imageSrc(p.image)}"
          data-original="${esc(p.image)}"
          alt="${esc(p.name)}"
          onerror="imageError(this)"
        >

      </div>

      <div class="modal-info">

        <div class="product-category">
          ${esc(p.category)}
        </div>

        <h2>
          ${esc(p.name)}
        </h2>

        <div class="rating">
          <span class="stars">
            ${stars(r.rating)}
          </span>

          <span>
            ${r.rating
              .toFixed(1)
              .replace(".",",")}
          </span>

          <span>
            · ${r.count.toLocaleString("fr-FR")} avis
          </span>
        </div>

        <div class="modal-price">
          ${productPrice(p.price)}
        </div>

        <button
          class="btn btn-primary btn-wide"
          id="modalAdd"
        >
          🛒 Ajouter au panier
        </button>

      </div>

    </div>
  `;

  $("modalAdd").onclick=e=>
    addToCart(
      p,
      e.currentTarget
    );

  openModal();
}

function addToCart(p,button){

  const x=cart.find(
    i=>i.id===p.id
  );

  if(x){
    x.qty++;
  }else{
    cart.push({
      id:p.id,
      qty:1
    });
  }

  saveCart();
  renderCart();

  if(button){
    animateToCart(
      button,
      p.image
    );
  }

  toast(
    "Produit ajouté au panier"
  );
}

function removeFromCart(id){

  cart=cart.filter(
    i=>i.id!==id
  );

  saveCart();
  renderCart();
}

function changeQty(id,d){

  const x=cart.find(
    i=>i.id===id
  );

  if(!x)return;

  x.qty+=d;

  if(x.qty<=0){
    removeFromCart(id);
    return;
  }

  saveCart();
  renderCart();
}

function cartData(){

  return cart
    .map(i=>{
      const p=products.find(
        x=>x.id===i.id
      );

      return p
        ? {...p,qty:i.qty}
        : null;
    })
    .filter(Boolean);
}

function renderCart(){

  if(!cartItems)return;

  const items=cartData();

  const count=items.reduce(
    (s,i)=>s+i.qty,
    0
  );

  if(cartBadge){
    cartBadge.textContent=
      count>99
        ?"99+"
        :count;
  }

  cartItems.innerHTML=
    items.length
      ? items.map(i=>`
          <div class="cart-item">

            <img
              src="${imageSrc(i.image)}"
              data-original="${esc(i.image)}"
              alt=""
              onerror="imageError(this)"
            >

            <div>

              <div class="cart-item-name">
                ${esc(i.name)}
              </div>

              <div class="cart-item-price">
                ${productPrice(i.price)}
              </div>

              <div class="qty">

                <button
                  data-minus="${i.id}"
                >
                  −
                </button>

                <span>
                  ${i.qty}
                </span>

                <button
                  data-plus="${i.id}"
                >
                  +
                </button>

              </div>

            </div>

            <button
              class="remove"
              data-remove="${i.id}"
            >
              Suppr.
            </button>

          </div>
        `).join("")
      : `
        <div class="empty">
          <div class="empty-icon">🛒</div>

          <h3>
            Ton panier est vide
          </h3>

          <p>
            Ajoute un produit pour commencer.
          </p>
        </div>
      `;

  let total=0;

  items.forEach(i=>{
    total+=
      Number(i.price)*
      i.qty;
  });

  if(cartTotal){
    cartTotal.textContent=
      money(total);
  }

  cartItems
    .querySelectorAll("[data-minus]")
    .forEach(b=>{
      b.onclick=()=>{
        changeQty(
          b.dataset.minus,
          -1
        );
      };
    });

  cartItems
    .querySelectorAll("[data-plus]")
    .forEach(b=>{
      b.onclick=()=>{
        changeQty(
          b.dataset.plus,
          1
        );
      };
    });

  cartItems
    .querySelectorAll("[data-remove]")
    .forEach(b=>{
      b.onclick=()=>{
        removeFromCart(
          b.dataset.remove
        );
      };
    });
}

function openCart(){

  overlay?.classList.add("open");
  cartDrawer?.classList.add("open");

  document.body.style.overflow=
    "hidden";
}

function closeCart(){

  overlay?.classList.remove("open");
  cartDrawer?.classList.remove("open");

  document.body.style.overflow="";
}

function animateToCart(button,url){

  if(!button||!cartBtn)return;

  const a=button.getBoundingClientRect();
  const b=cartBtn.getBoundingClientRect();

  const img=document.createElement("img");

  img.src=imageUrl(url);
  img.className="fly";

  img.style.cssText=`
    position:fixed;
    z-index:10000;
    left:${a.left+a.width/2-23}px;
    top:${a.top+a.height/2-23}px;
    width:46px;
    height:46px;
    object-fit:contain;
    transition:all .55s ease;
    pointer-events:none;
  `;

  document.body.appendChild(img);

  requestAnimationFrame(()=>{

    img.style.left=
      `${b.left+b.width/2-13}px`;

    img.style.top=
      `${b.top+b.height/2-13}px`;

    img.style.width="26px";
    img.style.height="26px";
    img.style.opacity="0";

  });

  setTimeout(()=>{
    img.remove();
  },650);
}

function total(){
  return cartData().reduce(
    (s,i)=>
      s+
      Number(i.price)*
      i.qty,
    0
  );
}

function checkout(){

  if(!currentUser){
    return openAccount();
  }

  const items=cartData();

  if(!items.length){
    return toast("Panier vide");
  }

  const t=total();

  modalContent.innerHTML=`
    <div class="panel">

      <h2>
        Finaliser la commande
      </h2>

      <div class="form">

        <input
          id="firstName"
          placeholder="Prénom"
        >

        <input
          id="lastName"
          placeholder="Nom"
        >

        <input
          id="orderAddress"
          placeholder="Adresse"
        >

        <input
          id="orderCity"
          placeholder="Ville"
        >

        <select
          id="paymentMethod"
          class="select"
        >

          <option value="card">
            Carte bancaire
          </option>

          <option value="paypal">
            PayPal
          </option>

        </select>

        <div id="cardFields">

          <input
            id="cardNumber"
            inputmode="numeric"
            autocomplete="off"
            placeholder="Numéro de carte"
          >

          <input
            id="cardHolder"
            autocomplete="off"
            placeholder="Titulaire"
          >

          <div
            style="
              display:grid;
              grid-template-columns:1fr 1fr;
              gap:10px;
            "
          >

            <input
              id="cardExpiry"
              inputmode="numeric"
              autocomplete="off"
              placeholder="MM/AA"
            >

            <input
              id="cardCVV"
              inputmode="numeric"
              autocomplete="off"
              placeholder="CVV"
            >

          </div>

        </div>

        <div
          style="
            font-weight:800;
            font-size:20px;
          "
        >
          Total : ${money(t)}
        </div>

        <button
          class="btn btn-primary btn-wide"
          id="placeOrder"
        >
          Payer / commander
        </button>

      </div>

    </div>
  `;

  const pm=$("paymentMethod");
  const cf=$("cardFields");

  pm.onchange=()=>{
    cf.style.display=
      pm.value==="card"
        ?"grid"
        :"none";
  };

  $("placeOrder").onclick=()=>{
    placeOrder(
      t,
      items,
      pm.value
    );
  };

  openModal();
}

function validAddress(v){
  return v.trim().length>=5;
}

function normCard(v){
  return v.replace(/\s+/g,"");
}

function getTestCard(){

  try{
    return JSON.parse(
      localStorage.getItem(
        "novaTestCard"
      )||"null"
    );
  }catch{
    return null;
  }
}

function createTestCard(){

  const digits=
    Array.from(
      {length:12},
      ()=>Math.floor(
        Math.random()*10
      )
    ).join("");

  return{
    number:"9999"+digits,
    holder:"NOVASHOP CARD",
    expiry:
      String(
        Math.floor(
          Math.random()*12
        )+1
      ).padStart(2,"0")+
      "/"+
      String(
        new Date().getFullYear()+3
      ).slice(-2),

    cvv:String(
      Math.floor(
        100+
        Math.random()*900
      )
    )
  };
}

async function placeOrder(
  t,
  items,
  pm
){

  const first=
    $("firstName")?.value.trim();

  const last=
    $("lastName")?.value.trim();

  const address=
    $("orderAddress")?.value.trim();

  const city=
    $("orderCity")?.value.trim();

  if(
    !first||
    !last||
    !validAddress(address)||
    !city
  ){
    return toast(
      "Remplis correctement le prénom, nom, adresse et ville."
    );
  }

  let paymentStatus=
    t===0
      ?"Payé"
      :"En attente";

  if(
    pm==="card"&&
    t>0
  ){

    const c=getTestCard();

    const ok=
      c&&
      normCard(
        $("cardNumber")?.value||""
      )===
      normCard(c.number)&&

      (
        $("cardHolder")?.value||""
      )
      .trim()
      .toUpperCase()===
      c.holder.toUpperCase()&&

      (
        $("cardExpiry")?.value||""
      )
      .trim()===
      c.expiry&&

      (
        $("cardCVV")?.value||""
      )
      .trim()===
      c.cvv;

    if(!ok){
      return toast(
        "Carte incorrecte."
      );
    }

    paymentStatus="Payé";
  }

  if(
    pm==="paypal"&&
    t>0
  ){
    window.open(
      PAYPAL_URL,
      "_blank"
    );
  }

  try{

    const order={
      firstName:first,
      lastName:last,
      userEmail:currentUser.email,

      items:items.map(
        ({
          id,
          name,
          price,
          qty,
          image,
          category
        })=>({
          id,
          name,
          price,
          qty,
          image,
          category
        })
      ),

      subtotal:t,
      total:t,
      address,
      city,

      status:"Enregistrée",

      paymentMethod:
        pm==="paypal"
          ?"PayPal.Me"
          :"Carte bancaire",

      paymentStatus,

      tracking:"",
      packageCity:city,
      trackingNumber:"",
      deliveryDuration:"",
      estimatedDelivery:"",

      createdAt:
        serverTimestamp()
    };

    await addDoc(
      collection(
        db,
        "orders"
      ),
      order
    );

    cart=[];
    saveCart();
    renderCart();

    closeModal();

    toast(
      "Commande enregistrée"
    );

    openOrders();

  }catch(e){

    toast(
      "Erreur : "+
      e.message
    );
  }
}

function openAccount(){

  if(currentUser){

    modalContent.innerHTML=`
      <div class="panel">

        <h2>
          Mon compte
        </h2>

        <p>
          ${esc(currentUser.email)}
        </p>

        <button
          class="btn btn-danger btn-wide"
          id="logoutBtn"
        >
          Se déconnecter
        </button>

      </div>
    `;

    $("logoutBtn").onclick=
      async()=>{

        await signOut(auth);

        localStorage.removeItem(
          ADMIN_KEY
        );

        closeModal();

        toast(
          "Déconnexion effectuée"
        );
      };

    openModal();
    return;
  }

  let mode="login";

  const draw=()=>{

    modalContent.innerHTML=`
      <div class="panel">

        <h2>
          ${
            mode==="login"
              ?"Connexion"
              :"Créer un compte"
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
              mode==="login"
                ?"Se connecter"
                :"Créer mon compte"
            }
          </button>

          <button
            class="text-btn"
            id="authSwitch"
          >
            ${
              mode==="login"
                ?"Créer un compte"
                :"J’ai déjà un compte"
            }
          </button>

        </div>

      </div>
    `;

    $("authSwitch").onclick=()=>{
      mode=
        mode==="login"
          ?"signup"
          :"login";

      draw();
    };

    $("authSubmit").onclick=
      async()=>{

        const email=
          $("authEmail")
            .value
            .trim();

        const pass=
          $("authPassword")
            .value;

        if(!email||!pass){
          return toast(
            "Remplis les champs."
          );
        }

        try{

          if(mode==="login"){
            await signInWithEmailAndPassword(
              auth,
              email,
              pass
            );
          }else{
            await createUserWithEmailAndPassword(
              auth,
              email,
              pass
            );
          }

          closeModal();

          toast(
            "Compte connecté"
          );

        }catch(e){

          toast(
            authError(
              e.code
            )
          );
        }
      };
  };

  draw();
  openModal();
}

function authError(code){

  return{

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

  }[code]||
  "Une erreur est survenue.";
}

function formatDate(t){

  if(!t){
    return "Date inconnue";
  }

  try{

    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        dateStyle:"medium",
        timeStyle:"short"
      }
    ).format(
      new Date(
        (t.seconds||0)*1000
      )
    );

  }catch{

    return "Date inconnue";
  }
}

async function loadOrders(){

  if(!currentUser)return[];

  const q=query(
    collection(db,"orders"),
    where(
      "userEmail",
      "==",
      currentUser.email
    )
  );

  const snap=
    await getDocs(q);

  return snap.docs
    .map(d=>({
      id:d.id,
      ...d.data()
    }))
    .sort(
      (a,b)=>
        (b.createdAt?.seconds||0)-
        (a.createdAt?.seconds||0)
    );
}

function statusClass(status){

  const s=
    (status||"")
      .toLowerCase();

  if(s.includes("livr")){
    return "delivered";
  }

  if(s.includes("annul")){
    return "cancelled";
  }

  if(
    s.includes("transport")||
    s.includes("expédi")
  ){
    return "transit";
  }

  if(s.includes("proche")){
    return "nearby";
  }

  return "";
}

async function openOrders(){

  if(!currentUser){
    return openAccount();
  }

  try{

    const orders=
      await loadOrders();

    modalContent.innerHTML=`
      <div class="panel">

        <h2>
          Mes commandes
        </h2>

        ${
          orders.length

          ? orders.map(o=>`

              <div
                class="order nova-order-card"
              >

                <div
                  class="order-top nova-order-head"
                >

                  <div>

                    <strong>
                      #${esc(
                        o.id.slice(0,8)
                      )}
                    </strong>

                    <div
                      class="order-date"
                    >
                      ${formatDate(
                        o.createdAt
                      )}
                    </div>

                  </div>

                  <span
                    class="
                      nova-status
                      ${statusClass(
                        o.status
                      )}
                    "
                  >
                    ${esc(
                      o.status||
                      "Enregistrée"
                    )}
                  </span>

                </div>

                <div
                  class="nova-order-items"
                >

                  ${
                    (o.items||[])
                      .map(i=>`
                        <div
                          class="nova-order-item"
                        >

                          <span>
                            ${esc(i.name)}
                            × ${i.qty}
                          </span>

                          <strong>
                            ${money(
                              Number(i.price)*
                              Number(i.qty)
                            )}
                          </strong>

                        </div>
                      `)
                      .join("")
                  }

                </div>

                <div
                  class="nova-package-box"
                >

                  <div>
                    Total :
                    <strong>
                      ${money(o.total)}
                    </strong>
                  </div>

                  <div>
                    Destination :
                    <strong>
                      ${esc(
                        o.city||
                        o.packageCity||
                        ""
                      )}
                    </strong>
                  </div>

                  <div>
                    Suivi :
                    <strong>
                      ${esc(
                        o.trackingNumber||
                        o.tracking||
                        "Non renseigné"
                      )}
                    </strong>
                  </div>

                  <div>
                    Livraison estimée :
                    <strong>
                      ${esc(
                        o.estimatedDelivery||
                        o.deliveryDuration||
                        "Non renseignée"
                      )}
                    </strong>
                  </div>

                </div>

                <button
                  class="btn btn-secondary btn-wide"
                  data-print="${o.id}"
                >
                  🖨️ Facture
                </button>

              </div>

            `).join("")

          : "<p>Aucune commande.</p>"
        }

      </div>
    `;

    modalContent
      .querySelectorAll("[data-print]")
      .forEach(b=>{
        b.onclick=()=>{
          printOrder(
            b.dataset.print,
            orders
          );
        };
      });

    openModal();

  }catch(e){

    toast(e.message);
  }
}

function isAdmin(){

  return !!currentUser&&
    currentUser.email?.toLowerCase()===
    ADMIN_EMAIL.toLowerCase()&&
    localStorage.getItem(
      ADMIN_KEY
    )==="1";
}

function ensureAdmin(){

  if(
    !currentUser||
    currentUser.email?.toLowerCase()!==
    ADMIN_EMAIL.toLowerCase()
  ){
    return false;
  }

  if(
    localStorage.getItem(
      ADMIN_KEY
    )==="1"
  ){
    return true;
  }

  const code=
    prompt("Code admin");

  if(code===ADMIN_CODE){

    localStorage.setItem(
      ADMIN_KEY,
      "1"
    );

    return true;
  }

  toast(
    "Code admin incorrect"
  );

  return false;
}

async function openAdmin(){

  if(!ensureAdmin())return;

  try{

    const snap=
      await getDocs(
        collection(
          db,
          "orders"
        )
      );

    const orders=
      snap.docs
        .map(d=>({
          id:d.id,
          ...d.data()
        }))
        .sort(
          (a,b)=>
            (b.createdAt?.seconds||0)-
            (a.createdAt?.seconds||0)
        );

    const testCard=
      getTestCard();

    modalContent.innerHTML=`
      <div class="panel">

        <h2>
          NovaShop Admin
        </h2>

        <div class="setting">

          <label>
            Carte de test locale
          </label>

          <small>
            Stockée uniquement dans le navigateur,
            jamais dans Firestore.
          </small>

          ${
            testCard

            ? `
              <div
                style="
                  background:#050505;
                  color:#fff;
                  border-radius:16px;
                  padding:18px;
                  margin-top:10px;
                  border:1px solid #222;
                "
              >

                <div
                  style="
                    font-size:12px;
                    opacity:.8;
                  "
                >
                  NOVASHOP
                </div>

                <div
                  style="
                    margin:28px 0 14px;
                    font-size:22px;
                    letter-spacing:2px;
                  "
                >
                  ${esc(
                    testCard.number
                  )}
                </div>

                <div
                  style="
                    display:flex;
                    justify-content:space-between;
                    gap:10px;
                    font-size:12px;
                  "
                >

                  <b>
                    NOVASHOP CARD
                  </b>

                  <span>
                    ${esc(
                      testCard.expiry
                    )}
                    ·
                    ${esc(
                      testCard.cvv
                    )}
                  </span>

                </div>

              </div>
            `

            : "<p>Aucune carte de test.</p>"
          }

          <button
            class="btn btn-secondary btn-wide"
            id="newTestCard"
          >
            Générer une nouvelle carte
          </button>

        </div>

        <div id="adminOrders">

          ${
            orders.length

            ? orders
                .map(adminOrderHTML)
                .join("")

            : "<p>Aucune commande.</p>"
          }

        </div>

      </div>
    `;

    $("newTestCard").onclick=()=>{
      localStorage.setItem(
        "novaTestCard",
        JSON.stringify(
          createTestCard()
        )
      );

      openAdmin();
    };

    modalContent
      .querySelectorAll(
        "[data-accept-paypal]"
      )
      .forEach(b=>{
        b.onclick=()=>{
          acceptPaypal(
            b.dataset.acceptPaypal
          );
        };
      });

    modalContent
      .querySelectorAll(
        "[data-save-order]"
      )
      .forEach(b=>{
        b.onclick=()=>{
          saveAdminOrder(
            b.dataset.saveOrder
          );
        };
      });

    modalContent
      .querySelectorAll(
        "[data-delete-order]"
      )
      .forEach(b=>{
        b.onclick=()=>{
          deleteOrder(
            b.dataset.deleteOrder
          );
        };
      });

    modalContent
      .querySelectorAll(
        "[data-print-order]"
      )
      .forEach(b=>{
        b.onclick=()=>{
          printOrder(
            b.dataset.printOrder,
            orders
          );
        };
      });

    openModal();

  }catch(e){

    toast(
      "Erreur : "+
      e.message
    );
  }
}

function adminOrderHTML(o){

  const st=
    o.status||
    "Enregistrée";

  return`
    <div
      class="order"
      style="
        margin-top:14px;
        padding:16px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:14px;
      "
    >

      <div class="order-top">

        <div>

          <strong>
            #${esc(
              o.id.slice(0,8)
            )}
          </strong>

          <div>
            ${esc(
              o.firstName||""
            )}
            ${esc(
              o.lastName||""
            )}
          </div>

          <div
            class="order-date"
          >
            ${esc(
              o.userEmail||
              o.email||
              ""
            )}
          </div>

          <div
            class="order-date"
          >
            ${formatDate(
              o.createdAt
            )}
          </div>

        </div>

        <span
          class="
            nova-status
            ${statusClass(st)}
          "
        >
          ${esc(st)}
        </span>

      </div>

      <div
        style="
          margin-top:10px;
        "
      >
        Total :
        <strong>
          ${money(o.total)}
        </strong>
      </div>

      <div
        style="
          margin-top:12px;
          display:grid;
          gap:10px;
        "
      >

        ${
          o.paymentMethod==="PayPal.Me"&&
          o.paymentStatus!=="Payé"

          ? `
            <button
              class="btn btn-primary btn-wide"
              data-accept-paypal="${o.id}"
            >
              ✓ Paiement PayPal reçu
            </button>
          `

          : ""
        }

        <select
          class="select"
          data-status="${o.id}"
        >

          ${
            [
              "Enregistrée",
              "Préparation",
              "Expédiée",
              "En transit",
              "Proche de la destination",
              "Livrée",
              "Annulée"
            ]
            .map(s=>`
              <option
                value="${esc(s)}"
                ${
                  s===st
                    ?"selected"
                    :""
                }
              >
                ${esc(s)}
              </option>
            `)
            .join("")
          }

        </select>

        <input
          class="input"
          data-city="${o.id}"
          placeholder="Ville du colis"
          value="${esc(
            o.packageCity||
            o.city||
            ""
          )}"
        >

        <input
          class="input"
          data-tracking="${o.id}"
          placeholder="Numéro de suivi"
          value="${esc(
            o.trackingNumber||
            o.tracking||
            ""
          )}"
        >

        <input
          class="input"
          data-duration="${o.id}"
          placeholder="Durée estimée avant livraison"
          value="${esc(
            o.deliveryDuration||
            ""
          )}"
        >

        <input
          class="input"
          type="date"
          data-date="${o.id}"
          value="${esc(
            o.estimatedDelivery||
            ""
          )}"
        >

        <button
          class="btn btn-secondary btn-wide"
          data-save-order="${o.id}"
        >
          💾 Enregistrer le suivi
        </button>

        <button
          class="btn btn-secondary btn-wide"
          data-print-order="${o.id}"
        >
          🖨️ Facture
        </button>

        <button
          class="btn btn-danger btn-wide"
          data-delete-order="${o.id}"
        >
          Supprimer la commande
        </button>

      </div>

    </div>
  `;
}

async function acceptPaypal(id){

  if(!isAdmin())return;

  try{

    await updateDoc(
      doc(
        db,
        "orders",
        id
      ),
      {
        paymentStatus:"Payé",
        status:"Acceptée",
        paymentAcceptedAt:
          serverTimestamp()
      }
    );

    toast(
      "Paiement PayPal accepté"
    );

    openAdmin();

  }catch(e){

    toast(
      e.message
    );
  }
}

async function saveAdminOrder(id){

  if(!isAdmin())return;

  const get=sel=>
    document.querySelector(sel);

  try{

    await updateDoc(
      doc(
        db,
        "orders",
        id
      ),
      {
        status:
          get(
            `[data-status="${CSS.escape(id)}"]`
          ).value,

        packageCity:
          get(
            `[data-city="${CSS.escape(id)}"]`
          )?.value.trim()||
          "",

        trackingNumber:
          get(
            `[data-tracking="${CSS.escape(id)}"]`
          )?.value.trim()||
          "",

        deliveryDuration:
          get(
            `[data-duration="${CSS.escape(id)}"]`
          )?.value.trim()||
          "",

        estimatedDelivery:
          get(
            `[data-date="${CSS.escape(id)}"]`
          )?.value||
          "",

        updatedAt:
          serverTimestamp()
      }
    );

    toast(
      "Suivi enregistré"
    );

    openAdmin();

  }catch(e){

    toast(
      e.message
    );
  }
}

async function deleteOrder(id){

  if(!isAdmin())return;

  try{

    await deleteDoc(
      doc(
        db,
        "orders",
        id
      )
    );

    toast(
      "Commande supprimée"
    );

    openAdmin();

  }catch(e){

    toast(
      e.message
    );
  }
}

function printOrder(
  id,
  orders
){

  const o=
    orders.find(
      x=>x.id===id
    );

  if(!o)return;

  const w=
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

  if(!w){
    return toast(
      "Autorise les fenêtres popup pour imprimer."
    );
  }

  w.document.write(`
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
            background:#fff
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:25px
          }

          th,td{
            padding:12px;
            border-bottom:1px solid #ddd;
            text-align:left
          }

          .box{
            padding:15px;
            border:1px solid #ddd;
            border-radius:10px;
            margin-top:20px
          }

          .total{
            text-align:right;
            font-size:22px;
            font-weight:700;
            margin-top:25px
          }

        </style>

      </head>

      <body>

        <h1>
          NovaShop
        </h1>

        <div class="box">

          <b>Commande :</b>
          #${esc(o.id)}

          <br>

          <b>Client :</b>
          ${esc(o.firstName||"")}
          ${esc(o.lastName||"")}

          <br>

          <b>E-mail :</b>
          ${esc(
            o.userEmail||
            o.email||
            ""
          )}

          <br>

          <b>Date :</b>
          ${formatDate(
            o.createdAt
          )}

          <br>

          <b>Adresse :</b>
          ${esc(
            o.address||
            ""
          )},
          ${esc(
            o.city||
            ""
          )}

        </div>

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

            ${
              (o.items||[])
                .map(i=>`
                  <tr>

                    <td>
                      ${esc(
                        i.name
                      )}
                    </td>

                    <td>
                      ${i.qty}
                    </td>

                    <td>
                      ${money(
                        i.price
                      )}
                    </td>

                    <td>
                      ${money(
                        Number(i.price)*
                        Number(i.qty)
                      )}
                    </td>

                  </tr>
                `)
                .join("")
            }

          </tbody>

        </table>

        <div class="box">

          <b>Paiement :</b>
          ${esc(
            o.paymentMethod||
            ""
          )}

          <br>

          <b>État paiement :</b>
          ${esc(
            o.paymentStatus||
            ""
          )}

          <br>

          <b>Statut :</b>
          ${esc(
            o.status||
            ""
          )}

        </div>

        <div class="total">
          Total :
          ${money(o.total)}
        </div>

        <script>
          window.onload=()=>window.print()
        <\/script>

      </body>

    </html>
  `);

  w.document.close();
}

function openSettings(){

  const theme=
    localStorage.getItem(
      "novaThemeChoice"
    )||"dark";

  const lang=
    localStorage.getItem(
      "novaLanguage"
    )||"fr";

  const anim=
    localStorage.getItem(
      "novaAnimations"
    )!=="false";

  modalContent.innerHTML=`
    <div class="panel">

      <h2>
        Paramètres
      </h2>

      <div class="setting">

        <label>
          Apparence
        </label>

        <select
          id="themeSelect"
          class="select"
        >

          <option
            value="dark"
            ${
              theme==="dark"
                ?"selected"
                :""
            }
          >
            Sombre
          </option>

          <option
            value="light"
            ${
              theme==="light"
                ?"selected"
                :""
            }
          >
            Claire
          </option>

          <option
            value="auto"
            ${
              theme==="auto"
                ?"selected"
                :""
            }
          >
            Automatique
          </option>

        </select>

      </div>

      <div class="setting">

        <label>
          Langue
        </label>

        <select
          id="languageSelect"
          class="select"
        >

          <option
            value="fr"
            ${
              lang==="fr"
                ?"selected"
                :""
            }
          >
            🇫🇷 Français
          </option>

          <option
            value="en"
            ${
              lang==="en"
                ?"selected"
                :""
            }
          >
            🇬🇧 English
          </option>

        </select>

      </div>

      <div class="setting">

        <label>
          Animations
        </label>

        <button
          class="switch ${anim?"on":""}"
          id="animationSwitch"
        >
          <span></span>
        </button>

      </div>

      <div class="setting">

        <small>
          NovaShop contient actuellement
          ${products.length} produits.
        </small>

      </div>

    </div>
  `;

  $("themeSelect").onchange=e=>{

    localStorage.setItem(
      "novaThemeChoice",
      e.target.value
    );

    applyTheme();
  };

  $("languageSelect").onchange=e=>{

    localStorage.setItem(
      "novaLanguage",
      e.target.value
    );

    applyLanguage(
      e.target.value
    );
  };

  $("animationSwitch").onclick=()=>{

    const x=
      localStorage.getItem(
        "novaAnimations"
      )!=="false";

    localStorage.setItem(
      "novaAnimations",
      String(!x)
    );

    $("animationSwitch")
      .classList.toggle(
        "on",
        !x
      );
  };

  openModal();
}

function applyTheme(){

  const c=
    localStorage.getItem(
      "novaThemeChoice"
    )||"dark";

  document.body.classList.toggle(
    "light",
    c==="light"||
    (
      c==="auto"&&
      matchMedia(
        "(prefers-color-scheme:light)"
      ).matches
    )
  );
}

function applyLanguage(language){

  if(searchInput){

    searchInput.placeholder=
      language==="en"
        ?"Search for a product..."
        :"Rechercher un produit...";
  }
}

onAuthStateChanged(
  auth,
  user=>{
    currentUser=user;

    const ok=
      user?.email?.toLowerCase()===
      ADMIN_EMAIL.toLowerCase();

    if(adminBtn){
      adminBtn.style.display=
        ok
          ?"grid"
          :"none";
    }

    if(!ok){
      localStorage.removeItem(
        ADMIN_KEY
      );
    }
  }
);

if(modalClose){
  modalClose.onclick=
    closeModal;
}

if(modal){

  modal.addEventListener(
    "click",
    e=>{
      if(e.target===modal){
        closeModal();
      }
    }
  );
}

if(cartBtn){
  cartBtn.onclick=
    openCart;
}

if(cartClose){
  cartClose.onclick=
    closeCart;
}

if(overlay){
  overlay.onclick=
    closeCart;
}

if(checkoutBtn){
  checkoutBtn.onclick=
    checkout;
}

if(accountBtn){
  accountBtn.onclick=
    openAccount;
}

if(ordersBtn){
  ordersBtn.onclick=
    openOrders;
}

if(settingsBtn){
  settingsBtn.onclick=
    openSettings;
}

if(adminBtn){
  adminBtn.onclick=
    openAdmin;
}

if(searchInput){

  searchInput.addEventListener(
    "input",
    e=>{
      searchValue=
        e.target.value;

      renderProducts();
    }
  );
}

document.addEventListener(
  "keydown",
  e=>{
    if(e.key==="Escape"){
      closeModal();
      closeCart();
    }
  }
);

const responsiveStyle=
  document.createElement(
    "style"
  );

responsiveStyle.textContent=`

  .nova-order-card{
    overflow:hidden
  }

  .nova-order-head{
    gap:12px;
    align-items:flex-start
  }

  .nova-status{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding:7px 10px;
    border-radius:999px;
    font-size:12px;
    font-weight:800;
    background:rgba(255,255,255,.08)
  }

  .nova-status.delivered{
    background:rgba(34,197,94,.15);
    color:#4ade80
  }

  .nova-status.cancelled{
    background:rgba(239,68,68,.15);
    color:#f87171
  }

  .nova-status.transit{
    background:rgba(59,130,246,.15);
    color:#60a5fa
  }

  .nova-status.nearby{
    background:rgba(168,85,247,.15);
    color:#c084fc
  }

  @media(max-width:600px){

    .nova-order-head{
      flex-direction:column
    }

    .nova-status{
      width:100%
    }

  }

`;

document.head.appendChild(
  responsiveStyle
);

applyTheme();

applyLanguage(
  localStorage.getItem(
    "novaLanguage"
  )||"fr"
);

renderCategories();
renderProducts();
renderCart();

window.NovaShop={
  products,
  openCart,
  closeCart,
  openProduct,
  renderProducts,
  renderCart,
  showToast:toast,

  state:()=>({
    products:products.length,
    cart:cartData(),
    category:selectedCategory,
    search:searchValue,
    user:
      currentUser?.email||
      null
  })
};

console.log(
  `NovaShop chargé : ${products.length} produits`
);
