// Truy cập
let contactForm = document.getElementById('contact-form');
let contactName = document.getElementById('contact-name');
let contactPhone = document.getElementById('contact-phone');
let contactEmail = document.getElementById('contact-email');
let addButton = document.getElementsByClassName('btn-add');

let infoCustomer = [];

addEventListener('click', addNewContact() {});
function addNewContact () {
    let newInfo = [
        {
            id: contactName.value,
            phone: contactPhone.value,
            email: contactEmail.value,
        }
    ];
    
    infoCustomer.push(newInfo);
    if (infoCustomer !== 0) {
        alert("Thêm liên hệ thành công!!");
    };
};