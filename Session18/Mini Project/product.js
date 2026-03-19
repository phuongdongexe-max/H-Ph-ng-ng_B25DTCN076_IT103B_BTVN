const STORAGE_KEY = 'products_data';
let products = [];
let productIdCounter = 1;
let editingProductId = null;
const productForm = document.getElementById('productForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const productName = document.getElementById('productName');
const productCategory = document.getElementById('productCategory');
const productPrice = document.getElementById('productPrice');
const productQuantity = document.getElementById('productQuantity');
const productDescription = document.getElementById('productDescription');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const productTableBody = document.getElementById('productTableBody');
const emptyState = document.getElementById('emptyState');
const totalProducts = document.getElementById('totalProducts');
const totalValue = document.getElementById('totalValue');
const totalQuantity = document.getElementById('totalQuantity');
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, idCounter: productIdCounter }));
}
function loadFromLocalStorage() {
    let data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        let parsed = JSON.parse(data);
        products = parsed.products || [];
        productIdCounter = parsed.idCounter || 1;
    }
}
function clearAllData() {
    if (confirm('Bạn có chắc chắn muốn xóa TẤT CẢ sản phẩm?')) {
        products = [];
        productIdCounter = 1;
        saveToLocalStorage();
        renderProducts();
        updateStats();
    }
}
function handleTableClick(e) {
    let editBtn = e.target.closest('.btn-edit');
    let deleteBtn = e.target.closest('.btn-delete');
    if (editBtn) {
        editProduct(Number(editBtn.dataset.id));
    } else if (deleteBtn) {
        deleteProduct(Number(deleteBtn.dataset.id));
    }
}
function handleFormSubmit(e) {
    e.preventDefault();
    let name = productName.value;
    let category = productCategory.value;
    let price = Number(productPrice.value);
    let quantity = Number(productQuantity.value);
    let description = productDescription.value;
    if (!name || !category || isNaN(price) || isNaN(quantity)) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    if (price < 0 || quantity < 0) {
        alert('Giá và số lượng không được âm!');
        return;
    }
    if (editingProductId) {
        updateProduct(editingProductId, name, category, price, quantity, description);
    } else {
        addProduct(name, category, price, quantity, description);
    }
    resetForm();
}
function addProduct(name, category, price, quantity, description) {
    products.push({ id: productIdCounter++, name, category, price, quantity, description });
    saveToLocalStorage();
    renderProducts();
    updateStats();
}
function updateProduct(id, name, category, price, quantity, description) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products[i].name = name;
            products[i].category = category;
            products[i].price = price;
            products[i].quantity = quantity;
            products[i].description = description;
            break;
        }
    }
    saveToLocalStorage();
    renderProducts();
    updateStats();
}
function deleteProduct(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        let newProducts = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i].id !== id) {
                newProducts.push(products[i]);
            }
        }
        products = newProducts;
        saveToLocalStorage();
        renderProducts();
        updateStats();
        if (editingProductId === id) resetForm();
    }
}
function editProduct(id) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            productName.value = products[i].name;
            productCategory.value = products[i].category;
            productPrice.value = products[i].price;
            productQuantity.value = products[i].quantity;
            productDescription.value = products[i].description;
            formTitle.textContent = 'Chỉnh Sửa Sản Phẩm';
            submitBtn.innerHTML = '✏️ Cập Nhật';
            cancelBtn.style.display = 'inline-block';
            editingProductId = id;
            break;
        }
    }
}
function cancelEdit() {
    resetForm();
}
function resetForm() {
    productForm.reset();
    formTitle.textContent = 'Thêm Sản Phẩm Mới';
    submitBtn.innerHTML = '➕ Thêm Sản Phẩm';
    cancelBtn.style.display = 'none';
    editingProductId = null;
}
function renderProducts(filteredProducts) {
    let list = filteredProducts || products;
    if (list.length === 0) {
        emptyState.classList.add('show');
        productTableBody.innerHTML = '';
        return;
    }
    emptyState.classList.remove('show');
    let html = '';
    for (let i = 0; i < list.length; i++) {
        let p = list[i];
        let qClass = p.quantity < 10 ? 'low-stock' : '';
        html += `<tr><td>${p.id}</td><td><strong>${p.name}</strong></td><td>${p.category}</td><td class="price">${formatPrice(p.price)}</td><td class="quantity ${qClass}">${p.quantity}</td><td class="description">${p.description}</td><td><div class="action-buttons"><button type="button" class="btn-edit" data-id="${p.id}">✏️ Sửa</button> <button type="button" class="btn-delete" data-id="${p.id}">🗑️ Xóa</button></div></td></tr>`;
    }
    productTableBody.innerHTML = html;
}
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' ₫';
}
function handleSearch() {
    let searchTerm = searchInput.value.toLowerCase();
    let categoryFilter = filterCategory.value;
    let filtered = [];
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        let matchName = p.name.toLowerCase().includes(searchTerm);
        let matchDesc = p.description.toLowerCase().includes(searchTerm);
        let matchCat = categoryFilter === '' ? true : p.category === categoryFilter;
        if ((matchName || matchDesc) && matchCat) {
            filtered.push(p);
        }
    }
    renderProducts(filtered);
}
function handleFilter() {
    handleSearch();
}
function updateStats() {
    totalProducts.textContent = products.length;
    let tValue = 0;
    let tQuantity = 0;
    for (let i = 0; i < products.length; i++) {
        tValue += products[i].price * products[i].quantity;
        tQuantity += products[i].quantity;
    }
    totalValue.textContent = formatPrice(tValue);
    totalQuantity.textContent = tQuantity;
}
loadFromLocalStorage();
renderProducts();
updateStats();
productForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', cancelEdit);
clearAllBtn.addEventListener('click', clearAllData);
searchInput.addEventListener('input', handleSearch);
filterCategory.addEventListener('change', handleFilter);
productTableBody.addEventListener('click', handleTableClick);