let infoContact = [
    {
        id,
        phoneNumber,
        emailContact,
    }];

let contactName = document.getElementById("contact-name");
let contactPhone = document.getElementById("contact-phone");
let contactEmail = document.getElementById("contact-email");

const updateButton = document.querySelector("")

function updateInfo(id) {
    let infoNeedUpdate = infoContact.find((info) => {
        return info.id === id
    })
    if (itemNeedUpdate) {
        infoNeedUpdate = id
        phoneNumber.value = infoNeedUpdate.productCategory;
        emailContact.value = infoNeedUpdate.productPrice;
        submitBtn.textContent = "Cập nhật thông tin";
        formTitle.textContent = "Chỉnh Sửa Thông Tin"
    }
    productName.focus();
}