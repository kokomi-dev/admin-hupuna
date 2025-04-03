const listAuth = [
  { name: "admin", password: "1234", roles: "admin" },
  { name: "ketoan", password: "1234", roles: "ketoan" },
  { name: "sales", password: "1234", roles: "sales" },
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formLogin").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const pass = document.getElementById("password").value;

    const user = listAuth.find(
      (user) => user.name === name && user.password === pass
    );

    if (user) {
      showToast("Đăng nhập thành công", "success");
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("roles", user.roles);
      window.location.href = "index.html";
    } else if (name && pass) {
      showToast("Sai tài khoản hoặc mật khẩu", "error");
    } else {
      showToast("Nhập đầy đủ thông tin", "warning");
    }
  });
});
