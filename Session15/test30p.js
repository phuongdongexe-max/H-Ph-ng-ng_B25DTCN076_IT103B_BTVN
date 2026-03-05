//Tạo hai mảng lưu trữ
let pass = [];
let input_email = [];

const input_data = document.getElementsByTagName("input");

const check_click = document.addEventListener("button");
if (check_click){
    pass.push(input_data);
    input_email.push(input_data);
}

console.log(input_email);
console.log(pass);
