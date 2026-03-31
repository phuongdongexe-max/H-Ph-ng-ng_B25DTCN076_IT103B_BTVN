document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.querySelector('.btn-login');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberCheck = document.getElementById('remember');

  btnLogin.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    // Fake login thành công
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    if (rememberCheck.checked) {
      localStorage.setItem('rememberMe', 'true');
    }

    showToast('Đăng nhập thành công!', 'Chào mừng bạn đến với Study Tracker');
    
    // Chuyển hướng sau 800ms
    setTimeout(() => {
      window.location.href = './dashboard.html';
    }, 800);
  });

  // Enter key support
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnLogin.click();
  });
});

// Toast helper (dùng chung với product-manager)
function showToast(title, msg) {
  const toastHTML = `
    <div style="position:fixed; top:20px; right:20px; background:#263148; color:#fff; border-radius:12px; padding:16px 20px; box-shadow:0 10px 30px rgba(0,0,0,0.2); display:flex; align-items:center; gap:12px; z-index:9999; min-width:280px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <div>
        <strong>${title}</strong><br>
        <span style="font-size:0.9rem; opacity:0.85;">${msg}</span>
      </div>
    </div>`;
  const toast = document.createElement('div');
  toast.innerHTML = toastHTML;
  document.body.appendChild(toast.firstElementChild);
  setTimeout(() => toast.firstElementChild.remove(), 2500);
}
