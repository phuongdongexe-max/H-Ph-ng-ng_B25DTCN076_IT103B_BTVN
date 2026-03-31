document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.register-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const lastname = document.getElementById('lastname').value.trim();
    const firstname = document.getElementById('firstname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const terms = document.getElementById('terms').checked;

    if (!lastname || !firstname || !email || !password) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (!terms) {
      alert('Bạn phải đồng ý với chính sách và điều khoản!');
      return;
    }

    // Fake register
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', `${lastname} ${firstname}`);

    alert('🎉 Đăng ký tài khoản thành công!');
    window.location.href = './dashboard.html';
  });
});
