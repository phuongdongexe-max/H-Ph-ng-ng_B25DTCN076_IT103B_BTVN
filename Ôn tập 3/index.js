// Dữ liệu mẫu
// const initialProducts = [
//     { id: "SPJ806NEC", name: "Laptop Dell XPS 13", price: 28500000, stock: 12 },
//     { id: "SPJ806VAO", name: "Chuột Logitech MX Master", price: 1850000, stock: 34 },
//     { id: "SPJ8067PK", name: "Bàn phím Keychron K2", price: 2200000, stock: 7 },
//     { id: "SPJ806IHC", name: "Áo thun Basic Uniqlo", price: 390000, stock: 0 },
//     { id: "SPJ8061MB", name: "Cà phê rang xay 500g", price: 185000, stock: 58 }
// ];

let products = [];
let filteredProducts = [];
let editingId = null;

function loadFromLocalStorage() {
    const stored = localStorage.getItem("products");
    products = stored ? JSON.parse(stored) : initialProducts;
    localStorage.setItem("products", JSON.stringify(products));
    filteredProducts = [...products];
}

function validateProduct(name, price, stock) {
    const errors = [];

    // Kiểm tra tên
    if (!name || name === "") {
        errors.push("Tên sản phẩm không được để trống");
    } else if (name.length > 100) {
        errors.push("Tên sản phẩm không được vượt quá 100 ký tự");
    }

    // Kiểm tra giá
    if (isNaN(price) || price === "") {
        errors.push("Giá bán không được để trống (nhập số dương)");
    } else if (price <= 0) {
        errors.push("Giá bán phải là số dương (> 0)");
    }

    // Kiểm tra số lượng
    if (isNaN(stock) || stock === "") {
        errors.push("Số lượng tồn kho không được để trống (nhập số)");
    } else if (stock < 0) {
        errors.push("Số lượng tồn kho không thể âm");
    } else if (!Number.isInteger(stock)) {
        errors.push("Số lượng phải là số nguyên (không có dấu chấm)");
    }

    return errors;
}

function submitForm() {
    const iName = document.getElementById("iName").value;
    const iPrice = document.getElementById("iPrice").value;
    const iStock = document.getElementById("iStock").value;
    const editId = document.getElementById("editId").value;

    const name = iName.trim();
    const price = iPrice === "" ? NaN : parseFloat(iPrice);
    const stock = iStock === "" ? NaN : parseInt(iStock);

    console.log("Debug:", { name, price, stock, iPrice, iStock });

    const errors = validateProduct(name, price, stock);

    if (errors.length > 0) {
        alert("Lỗi:\n" + errors.join("\n"));
        return;
    }

    if (editId) {
        updateProduct(editId, name, price, stock);
    } else {
        addNewProduct(name, price, stock);
    }
}

function addNewProduct(name, price, stock) {
    const newId = generateProductId();
    const newProduct = { id: newId, name, price, stock };

    products.push(newProduct);
    filteredProducts.push(newProduct);
    saveToLocalStorage();
    render();
    resetForm();
    updateBadge();
}

function generateProductId() {
    let id;
    do {
        id = "SP" + Math.random().toString(36).substring(2, 10).toUpperCase();
    } while (products.some(function (p) { return p.id === id; }));
    return id;
}


function handleSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();

    filteredProducts = products.filter(function (product) {
        return product.name.toLowerCase().includes(searchTerm) ||
            product.id.toLowerCase().includes(searchTerm);
    });

    render();
}

function handleSort() {
    const sortValue = document.getElementById("sortSelect").value;

    switch (sortValue) {
        case "name_asc":
            filteredProducts.sort(function (a, b) {
                return a.name.localeCompare(b.name, "vi");
            });
            break;
        case "name_desc":
            filteredProducts.sort(function (a, b) {
                return b.name.localeCompare(a.name, "vi");
            });
            break;
        case "price_asc":
            filteredProducts.sort(function (a, b) {
                return a.price - b.price;
            });
            break;
        case "price_desc":
            filteredProducts.sort(function (a, b) {
                return b.price - a.price;
            });
            break;
        default:
            filteredProducts = products.slice();
    }

    render();
}

function render() {
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById("tbody");
    const emptyState = document.getElementById("emptyState");

    if (filteredProducts.length === 0) {
        tbody.innerHTML = "";
        emptyState.style.display = "flex";
        return;
    }

    emptyState.style.display = "none";

    tbody.innerHTML = filteredProducts.map(function (product, index) {
        return `
            <tr id="row-${product.id}">
                <td>${index + 1}</td>
                <td class="td-name">${product.name}</td>
                <td class="td-price">${product.price}</td>
                <td class="center" style="font-weight: 700">${product.stock}</td>
                <td>
                    <div class="td-actions">
                        <button class="btn btn-sm btn-edit" data-id="${product.id}">✏ Sửa</button>
                        <button class="btn btn-sm btn-del" data-id="${product.id}">✕ Xóa</button>
                    </div>
                </td>
            </tr>
        `;
    })
        .join("");
}




function loadProductToForm(productId) {
    const product = products.find(function (p) { return p.id === productId; });
    if (!product) return;

    document.getElementById("iName").value = product.name;
    document.getElementById("iPrice").value = product.price;
    document.getElementById("iStock").value = product.stock;
    document.getElementById("editId").value = productId;

    document.getElementById("formTitle").textContent = "Chỉnh sửa sản phẩm";
    document.getElementById("btnSubmit").textContent = "Cập nhật sản phẩm";
    document.getElementById("iName").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProduct(productId, name, price, stock) {
    const product = products.find(function (p) { return p.id === productId; });
    if (!product) return;

    product.name = name;
    product.price = price;
    product.stock = stock;

    const filteredProduct = filteredProducts.find(function (p) { return p.id === productId; });
    if (filteredProduct) {
        filteredProduct.name = name;
        filteredProduct.price = price;
        filteredProduct.stock = stock;
    }

    saveToLocalStorage();
    render();
    resetForm();
    updateBadge();
}


function showDeleteConfirm(productId, productName) {
    document.getElementById("modalMsg").textContent =
        `Bạn có chắc muốn xóa sản phẩm "${productName}" này?`;

    document.getElementById("btnConfirm").onclick = function () {
        deleteProduct(productId);
        close();
    };

    document.getElementById("overlay").style.display = "flex";
}

function deleteProduct(productId) {
    products = products.filter(function (p) { return p.id !== productId; });
    filteredProducts = filteredProducts.filter(function (p) { return p.id !== productId; });

    saveToLocalStorage();
    render();
    updateBadge();
}

function close() {
    document.getElementById("overlay").style.display = "none";
}


function resetForm() {
    document.getElementById("iName").value = "";
    document.getElementById("iPrice").value = "";
    document.getElementById("iStock").value = "";
    document.getElementById("editId").value = "";

    document.getElementById("formTitle").textContent = "Thêm sản phẩm mới";
    document.getElementById("btnSubmit").textContent = "Thêm sản phẩm";
}


function saveToLocalStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

function updateBadge() {
    document.getElementById("totalBadge").textContent = products.length + " sản phẩm";
}

loadFromLocalStorage();
document.getElementById("btnSubmit").addEventListener("click", submitForm);
document.getElementById("searchInput").addEventListener("input", handleSearch);
document.getElementById("sortSelect").addEventListener("change", handleSort);
document.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("btn-edit")) {
        const productId = target.dataset.id;
        loadProductToForm(productId);
    }

    if (target.classList.contains("btn-del")) {
        const productId = target.dataset.id;
        const product = products.find(function (p) { return p.id === productId; });
        if (product) {
            showDeleteConfirm(productId, product.name);
        }
    }
});
render();
updateBadge();