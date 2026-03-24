let employees = [
  { id: 1, fullName: "Nguyễn Văn A", email: "a.nguyen@example.com", dateOfBirth: "1995-01-01", position: "Nhân viên" },
  { id: 2, fullName: "Trần Thị B",   email: "b.tran@example.com",   dateOfBirth: "1993-03-12", position: "Trưởng nhóm" },
  { id: 3, fullName: "Lê Văn C",     email: "c.le@example.com",     dateOfBirth: "1990-07-20", position: "Trưởng phòng" },
];
let nextId = 4;
let editingId = -1;

let form       = document.getElementById("employeeForm");
let inputName  = document.getElementById("fullName");
let inputEmail = document.getElementById("email");
let inputDob   = document.getElementById("dateOfBirth");
let inputPos   = document.getElementById("position");
let btnSubmit  = document.getElementById("submitBtn");
let btnCancel  = document.getElementById("cancelBtn");
let tbody      = document.getElementById("employeeBody");
let badge      = document.getElementById("badgeCount");
let footerSpan = document.getElementById("footerCount");
let errName    = document.getElementById("errorFullName");
let errEmail   = document.getElementById("errorEmail");
let errDob     = document.getElementById("errorDateOfBirth");
let errPos     = document.getElementById("errorPosition");

function formatDate(dateStr) {
  let parts = dateStr.split("-");
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

function isValidEmail(email) {
  let atIndex = email.indexOf("@");
  if (atIndex < 1) return false;
  let domain = email.substring(atIndex + 1);
  if (domain.indexOf(".") < 1) return false;
  return true;
}

function clearAllErrors() {
  errName.textContent  = "";
  errEmail.textContent = "";
  errDob.textContent   = "";
  errPos.textContent   = "";
}

function validateForm() {
  let isValid = true;
  clearAllErrors();

  if (inputName.value.trim() === "") {
    errName.textContent = "Họ và tên không được để trống.";
    isValid = false;
  }

  if (inputEmail.value.trim() === "") {
    errEmail.textContent = "Email không được để trống.";
    isValid = false;
  } else if (!isValidEmail(inputEmail.value.trim())) {
    errEmail.textContent = "Email không đúng định dạng.";
    isValid = false;
  }

  if (inputDob.value === "") {
    errDob.textContent = "Ngày sinh không được để trống.";
    isValid = false;
  }

  if (inputPos.value === "") {
    errPos.textContent = "Vui lòng chọn chức vụ.";
    isValid = false;
  }

  return isValid;
}

function reorderIds() {
  for (let i = 0; i < employees.length; i++) {
    employees[i].id = i + 1;
  }
  nextId = employees.length + 1;
}

function render() {
  tbody.innerHTML = "";

  for (let i = 0; i < employees.length; i++) {
    let emp = employees[i];
    let tr = document.createElement("tr");

    tr.innerHTML =
      "<td>" + emp.id + "</td>" +
      "<td>" + emp.fullName + "</td>" +
      "<td>" + emp.email + "</td>" +
      "<td>" + formatDate(emp.dateOfBirth) + "</td>" +
      "<td>" + emp.position + "</td>" +
      "<td class='actions'>" +
        "<button class='btn btn-sm btn-edit' onclick='startEdit(" + emp.id + ")'>Sửa</button>" +
        "<button class='btn btn-sm btn-delete' onclick='deleteEmployee(" + emp.id + ")'>Xóa</button>" +
      "</td>";

    tbody.appendChild(tr);
  }

  updateStats();
}

function updateStats() {
  let count = employees.length;
  badge.textContent = count + " nhân viên";
  footerSpan.textContent = "Tổng số nhân viên: " + count;
}

function resetForm() {
  inputName.value  = "";
  inputEmail.value = "";
  inputDob.value   = "";
  inputPos.value   = "";
  clearAllErrors();

  editingId = -1;

  btnSubmit.textContent = "Thêm Nhân Viên";
  btnCancel.classList.add("hidden");
}

form.onsubmit = function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  let fullName    = inputName.value.trim();
  let email       = inputEmail.value.trim();
  let dateOfBirth = inputDob.value;
  let position    = inputPos.value;

  if (editingId === -1) {
    employees.push({ id: nextId, fullName: fullName, email: email, dateOfBirth: dateOfBirth, position: position });
    nextId++;
    resetForm();
    render();

    let rows = tbody.querySelectorAll("tr");
    let lastRow = rows[rows.length - 1];
    if (lastRow) {
      lastRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } else {
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].id === editingId) {
        employees[i].fullName    = fullName;
        employees[i].email       = email;
        employees[i].dateOfBirth = dateOfBirth;
        employees[i].position    = position;
      }
    }
    resetForm();
    render();
  }
};

btnCancel.onclick = function () {
  resetForm();
};

function startEdit(id) {
  let emp = null;
  for (let i = 0; i < employees.length; i++) {
    if (employees[i].id === id) {
      emp = employees[i];
    }
  }
  if (!emp) return;

  editingId = id;

  inputName.value  = emp.fullName;
  inputEmail.value = emp.email;
  inputDob.value   = emp.dateOfBirth;
  inputPos.value   = emp.position;
  clearAllErrors();

  btnSubmit.textContent = "Cập Nhật";
  btnCancel.classList.remove("hidden");

  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
}

function deleteEmployee(id) {
  let emp = null;
  for (let i = 0; i < employees.length; i++) {
    if (employees[i].id === id) {
      emp = employees[i];
    }
  }
  if (!emp) return;

  let confirmed = confirm("Bạn có chắc muốn xóa nhân viên \"" + emp.fullName + "\" không?");
  if (!confirmed) return;

  let newList = [];
  for (let i = 0; i < employees.length; i++) {
    if (employees[i].id !== id) {
      newList.push(employees[i]);
    }
  }
  employees = newList;

  reorderIds();

  if (editingId === id) {
    resetForm();
  }

  render();
}

render();