      


let products = [];

// truy xuat phan tu
let productForm = document.getElementById("productForm");
let productName = document.getElementById("productName");
let productCategory = document.getElementById("productCategory");
let productPrice = document.getElementById("productPrice");
let productQuantity = document.getElementById("productQuantity");
let productDescription = document.getElementById("productDescription");

let productTableBody = document.getElementById("productTableBody")

let submitBtn = document.getElementById("submitBtn")
let formTitle = document.getElementById("formTitle")
let editingProductId = null

// bat su kien them
productForm.addEventListener("submit", createProduct);


// lấy dữ liệu từ localStoreage
function getData(){
    let getProduct = localStorage.getItem('products')
    if(getProduct){
        products = JSON.parse(getProduct);
        renderData()
    }
}

//gọi hàm 
getData()

// create product
function createProduct(e) {
  e.preventDefault();

  if (editingProductId !== null) {
    let itemNeedUpdate = products.find((item) => item.id === editingProductId);
    if (itemNeedUpdate) {
      itemNeedUpdate.productName = productName.value.trim();
      itemNeedUpdate.productCategory = productCategory.value;
      itemNeedUpdate.productPrice = Number(productPrice.value);
      itemNeedUpdate.productQuantity = Number(productQuantity.value);
      itemNeedUpdate.productDescription = productDescription.value;
    }

    localStorage.setItem("products", JSON.stringify(products));
    productForm.reset();
    editingProductId = null;
    submitBtn.textContent = "➕ Thêm Sản Phẩm";
    formTitle.textContent = "Thêm Sản Phẩm Mới";
    renderData();
    return;
  }

  let newProduct = {
    id: Date.now(),
    productName: productName.value.trim(),
    productCategory: productCategory.value,
    productPrice: Number(productPrice.value),
    productQuantity: Number(productQuantity.value),
    productDescription: productDescription.value,
  };
  products.push(newProduct);
  console.log(products);

  //lưu dữ liệu vào  localStorage
  localStorage.setItem("products", JSON.stringify(products));

  productForm.reset();

  renderData()
}

//  render Data

function renderData() {
    productTableBody.innerHTML = ''
  products.forEach((product) => {
    // - Tạo tờ giấy A4
    let createTr = document.createElement("tr");

    // - Viết nội dung vào tờ giấy a4 đó (innerHTML)
    createTr.innerHTML = `
         <td>${product.id}</td>
        <td>${product.productName}</td>
        <td>${product.productCategory}</td>
        <td>${product.productPrice}</td>
        <td>${product.productQuantity}</td>
        <td>${product.productDescription}</td>
        <td>
            <button onClick = "updateProduct(${product.id})">✏️ Sửa</button>
            <button>🗑️ Xóa</button>
        </td>
    `;
    // - Dính tờ giấy a4 vào nơi muốn hiển thị -> appendChild()
    productTableBody.appendChild(createTr)
  });
}

function updateProduct(id){
  let itemNeedUpdate = products.find((item) => {
    return item.id === id
  })
  if(itemNeedUpdate){
    editingProductId = id
    productName.value = itemNeedUpdate.productName;
    productCategory.value = itemNeedUpdate.productCategory
    productPrice.value = itemNeedUpdate.productPrice
    productQuantity.value = itemNeedUpdate.productQuantity
    productDescription.value= itemNeedUpdate.productDescription

    submitBtn.textContent = "💾 Cap nhat san pham 9999";
    formTitle.textContent = "Chỉnh Sửa Sản Phẩm"
  }
  productName.focus();
}


    