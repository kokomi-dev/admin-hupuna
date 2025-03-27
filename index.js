// load page show content
async function loadPage(pageName) {
  try {
    const contentDiv = document.getElementById("content");
    const response = await fetch(`pages/${pageName}.html`);
    if (!response.ok) {
      throw new Error("Trang không tồn tại");
    }
    const content = await response.text();
    contentDiv.innerHTML = content;
  } catch (error) {
    document.getElementById("content").innerHTML = `
           <div class="error">
               <h2>Lỗi</h2>
               <p>Đéo load nổi trang r</p>
           </div>
       `;
  }
}
// handle event change page pc
function handleEnventNav() {
  document
    .querySelector(".sidebar__menu")
    .addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        const pageName = event.target.getAttribute("data-page");
        loadPage(pageName);
      }
    });
}
// handleEvent change page mobile
function handleEventSidebar() {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileSidebar = document.getElementById("mobileSidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  function toggleSidebar() {
    mobileSidebar.classList.toggle("show");
    sidebarOverlay.classList.toggle("show");
  }
  mobileMenuToggle.addEventListener("click", toggleSidebar);
  sidebarOverlay.addEventListener("click", toggleSidebar);
  mobileSidebar.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      const pageName = event.target.getAttribute("data-page");
      loadPage(pageName);
      toggleSidebar();
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  loadPage("baiviet");
  handleEventSidebar();
  handleEnventNav();
});
