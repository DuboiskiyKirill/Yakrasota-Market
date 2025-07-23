
let cart=JSON.parse(localStorage.getItem("cart")||"[]");
document.getElementById('cartCount')?.textContent=cart.length;

const productsDB={
  "Wella":{
    "color":[
      {name:"Color Touch",price:520,img:"images/wella_color_touch.jpg",shades:["5/71","6/16","7/43","9/65","10/0"]},
      {name:"Koleston Perfect",price:580,img:"images/wella_koleston.jpg",shades:["6/0","7/0","8/0","9/0"]}
    ],
    "shampoo":[
      {name:"Wella Repair Shampoo",price:450,img:"images/wella_shampoo1.jpg"},
      {name:"Wella Volume Boost",price:470,img:"images/wella_shampoo2.jpg"}
    ]
  },
  "Londa":{
    "color":[
      {name:"Londa Professional Color",price:500,img:"images/londa_color1.jpg",shades:["5/0","6/1","7/3","8/7","9/7"]}
    ]
  }
};

let filteredProducts=[];
let perPage=6;
let currentPage=1;

function loadProducts(brand,category){
  const brandData=productsDB[brand]||{};
  const prodList=brandData[category]||[];
  filteredProducts=prodList;
  renderProducts(category);
}

function renderProducts(category){
  const grid=document.getElementById("productGrid");
  grid.innerHTML="";
  const start=(currentPage-1)*perPage;
  const end=start+perPage;
  const pageItems=filteredProducts.slice(start,end);
  pageItems.forEach(p=>{
    const card=document.createElement('div');
    card.className='product-card';
    let html=`<img src='${p.img}'><div>${p.name}</div><div>${p.price} ₽</div>`;
    if(category==="color" && p.shades){
      html+=`<div class='shade-scroll'>`+p.shades.map(s=>`<button class='shade-btn' onclick='selectShade(this)'>${s}</button>`).join("")+`</div>`;
      html+=`<button class='login-btn' onclick="addShadeProduct('${p.name}',${p.price},this)">Добавить</button>`;
    }else{
      html+=`<button class='login-btn' onclick="addToCart('${p.name}',${p.price})">Добавить</button>`;
    }
    card.innerHTML=html;
    grid.appendChild(card);
  });
  document.getElementById("pageInfo").textContent=`Стр. ${currentPage} из ${Math.ceil(filteredProducts.length/perPage)}`;
}

function selectShade(btn){
  btn.parentElement.querySelectorAll(".shade-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
}

function addShadeProduct(name,price,btn){
  const activeShade=btn.parentElement.querySelector(".shade-btn.active");
  if(!activeShade){alert("Выберите оттенок!");return;}
  const shade=activeShade.textContent;
  cart.push({name:`${name} (${shade})`,price:price});
  localStorage.setItem("cart",JSON.stringify(cart));
  document.getElementById("cartCount").textContent=cart.length;
}

function addToCart(name,price){
  cart.push({name,price});
  localStorage.setItem("cart",JSON.stringify(cart));
  document.getElementById("cartCount").textContent=cart.length;
}

function goToCart(){ window.location.href='cart.html'; }

function filterProducts(){
  const search=document.querySelector(".search-box").value.toLowerCase();
  filteredProducts=filteredProducts.filter(p=>p.name.toLowerCase().includes(search));
  renderProducts();
}

function prevPage(){ if(currentPage>1){currentPage--;renderProducts();}}
function nextPage(){ if(currentPage<Math.ceil(filteredProducts.length/perPage)){currentPage++;renderProducts();}}
