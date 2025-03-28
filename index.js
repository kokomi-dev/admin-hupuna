// handle load chart dashboard
function handleLoadChartDashboard() {
  const chartElement = document.getElementById("visitChart");
  if (chartElement) {
    var ctx = chartElement.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        datasets: [
          {
            label: "Lượng Truy Cập",
            data: [1200, 1900, 1500, 2200],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Thống Kê Truy Cập",
          },
        },
      },
    });
  } else {
    console.error("lỗi");
  }
}
// handle event view detail
function handleEventShowDetail() {
  document.querySelectorAll(".product__view__detail").forEach((item) => {
    item.addEventListener("click", () => {
      loadPage("chitietsanpham");
    });
  });
}
// handle action back to list prodcut
function handleBackToListProduct() {
  document
    .getElementById("btn__back__listproduct")
    .addEventListener("click", () => {
      loadPage("sanpham");
    });
}
// handle load editor
function handleLoadEditor() {
  const editorId = "myEditor";
  if (tinymce.get(editorId)) {
    tinymce.get(editorId).destroy();
  }
  if (document.getElementById(editorId)) {
    tinymce.init({
      selector: `#${editorId}`,
      height: 500,
      license_key: "gpl",
      plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "help",
        "wordcount",
      ],
      toolbar:
        "undo redo | blocks | " +
        "bold italic backcolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help",
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
    });
  }
}
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
    sessionStorage.setItem("currenPage", pageName);
    if (pageName === "trangchu") {
      handleLoadChartDashboard();
    }
    if (pageName === "sanpham") {
      const btnCreateProduct = document.getElementById("btn__create__product");
      if (btnCreateProduct) {
        btnCreateProduct.addEventListener("click", () => {
          loadPage("taosanpham");
        });
      }
      handleLoadEditor();
      handleEventShowDetail();
    }
    if (pageName === "chitietsanpham") {
      handleBackToListProduct();
    }
    if (pageName === "taosanpham") {
      handleBackToListProduct();
      handleLoadEditor();
    }
  } catch (error) {
    document.getElementById("content").innerHTML = `
           <div class="error">
               <h2>Not Foud</h2>
               <p>Hiện tại chưa có nội dung cho trang này ! </p>
           </div>
       `;
  }
}
// remove active nav
function checkToolgeActiveDefault() {
  const listItemNav = document.querySelectorAll(".sidebar__menu ul li a");
  const currentPage = sessionStorage.getItem("currenPage");
  listItemNav.forEach((item) => {
    if (
      (currentPage && item.getAttribute("data-page") === currentPage) ||
      currentPage.includes(item.getAttribute("data-page"))
    ) {
      return item.classList.add("active");
    } else {
      if (!currentPage && item.getAttribute("data-page") === "trangchu") {
        return item.classList.add("active");
      } else return;
    }
  });
}
// handle event change page pc
function handleEventNav() {
  const listItemNav = document.querySelectorAll(".sidebar__menu ul li a");
  checkToolgeActiveDefault();
  document
    .querySelector(".sidebar__menu")
    .addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        const pageName = event.target.getAttribute("data-page");
        loadPage(pageName);
        listItemNav.forEach((item) => {
          if (item.classList.contains("active")) {
            item.classList.remove("active");
          }
          event.target.classList.add("active");
        });
      }
    });
}
// handleEvent change page mobile
function handleEventSidebar() {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileSidebar = document.getElementById("mobileSidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const listItemNav = document.querySelectorAll(".sidebar__menu ul li a");
  function toggleSidebar() {
    mobileSidebar.classList.toggle("show");
    sidebarOverlay.classList.toggle("show");
  }
  mobileMenuToggle.addEventListener("click", toggleSidebar);
  sidebarOverlay.addEventListener("click", toggleSidebar);
  mobileSidebar.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      listItemNav.forEach((item) => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        }
        event.target.classList.add("active");
      });
      const pageName = event.target.getAttribute("data-page");
      loadPage(pageName);
      sessionStorage.setItem("currenPage", pageName);
      toggleSidebar();
    }
  });
}
// check handle load
function handleCheckLoadPage() {
  const currentPage = sessionStorage.getItem("currenPage");
  if (!currentPage) {
    return loadPage("trangchu");
  } else {
    return loadPage(currentPage);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  handleCheckLoadPage();
  handleEventSidebar();
  handleEventNav();
});

// handle event upload image
function previewImage(event) {
  const input = event.target;
  const preview = document.getElementById("preview");
  const fileNameInput = document.getElementById("file-name");

  if (input.files && input.files[0]) {
      const file = input.files[0];

      // Hiển thị tên file
      fileNameInput.value = file.name;

      // Đọc ảnh và hiển thị
      const reader = new FileReader();
      reader.onload = function (e) {
          preview.src = e.target.result;
          preview.classList.remove("d-none"); 
      };
      reader.readAsDataURL(file);
  } else {
      preview.src = "";
      preview.classList.add("d-none"); 
      fileNameInput.value = "Chưa có file nào";
  }
}