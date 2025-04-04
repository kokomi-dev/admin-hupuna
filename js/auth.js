const listAuth = [
  { name: "admin", password: "1234", roles: "admin" },
  { name: "ketoan", password: "1234", roles: "ketoan" },
  { name: "sales", password: "1234", roles: "sales" },
];
// handle logout
function handleLogout() {
  document.getElementById("btn__logout").addEventListener("click", () => {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("roles");
    window.location.href = "login.html";
  });
}
// load info acconut
function infoAccount() {
  if (sessionStorage.getItem("name")) {
    document.getElementById("info__user__name").innerHTML =
      sessionStorage.getItem("name");
    document.getElementById("info__user__roles").innerHTML =
      sessionStorage.getItem("roles");
  }
}
// check roles
function checkAuthentication() {
  const roles = sessionStorage.getItem("roles");
  if (roles) {
    return;
  } else window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", () => {
  // login
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
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
  }
  handleLogout();
  infoAccount();
  checkAuthentication();
});
