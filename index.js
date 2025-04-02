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
      min_height: 400,
      height: "400px",
      license_key: "gpl",
      plugins: [
        "autoresize",
        "image imagetools",
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
        "bold italic backcolor | image | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help",
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
      file_picker_types: "image",
      image_uploadtab: true,
      automatic_uploads: true,
      images_reuse_filename: true,
      file_picker_callback: function (callback, value, meta) {
        if (meta.filetype === "image") {
          var input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

          input.onchange = function () {
            var file = this.files[0];
            var reader = new FileReader();

            reader.onload = function () {
              callback(reader.result, {
                alt: file.name,
              });
            };

            reader.readAsDataURL(file);
          };

          input.click();
        }
      },
      setup: function (editor) {
        editor.ui.registry.addButton("insertImageWithLayout", {
          icon: "gallery",
          tooltip: "Chèn ảnh với bố cục",
          onAction: function () {
            editor.windowManager.open({
              title: "Chọn bố cục ảnh",
              body: {
                type: "panel",
                items: [
                  {
                    type: "selectbox",
                    name: "layout",
                    label: "Chọn kiểu sắp xếp",
                    items: [
                      { text: "Grid", value: "image-grid" },
                      { text: "Masonry", value: "image-masonry" },
                      { text: "Flexbox", value: "image-flex" },
                    ],
                  },
                ],
              },
              buttons: [
                {
                  text: "Chèn ảnh",
                  type: "submit",
                },
                {
                  text: "Hủy",
                  type: "cancel",
                },
              ],
              onSubmit: function (dialog) {
                let data = dialog.getData();
                editor.insertContent(
                  `<div class="${
                    data.layout
                  }">${editor.selection.getContent()}</div>`
                );
                dialog.close();
              },
            });
          },
        });
      },
    });
  }
}
// handle reset filter
function handleResetFilter() {
  const btnResetFilter = document.getElementById("btn__reset__filter");
  btnResetFilter.addEventListener("click", () => {
    document.getElementById("searchFilter").value = "";
    document.getElementById("dateFilter").value = "";
    document.getElementById("statusFilter").value = "";
    showToast("Xóa bộ lọc", "success");
  });
}
// check load page theo pagename
function loadPageFollowPageName(pagename) {
  switch (pagename) {
    case "quanlinhapkho_taomoi":
      document
        .getElementById("btn__back__warehouse")
        .addEventListener("click", () => loadPage("quanlinhapkho"));
      break;
    case "quanlitonkho":
      const roles = sessionStorage.getItem("roles");
      if (roles) {
        const tableQLTK = document.querySelector(".table__qltk");
        if (roles == "admin" && tableQLTK) {
          tableQLTK.classList.add("admin");
        }
      }
      handleResetFilter();
      renderTestTableTonKho();
      break;
    case "tatcasanpham":
      handleActionHeadPage();
      handleActionItemTr();

    default:
      break;
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
      handleResetFilter();
      handleLoadEditor();
      handleEventShowDetail();
    }
    if (pageName === "chitietsanpham") {
      handleBackToListProduct();
    }
    if (pageName === "baiviet") {
      const btnCreateBlog = document.getElementById("btn__create__product");
      btnCreateBlog.addEventListener("click", () => {
        loadPage("taobaiviet");
      });
      selectRowScreen();
      pagination();
    }
    if (pageName === "taosanpham" || pageName === "taobaiviet") {
      handleLoadEditor();
    }
    if (pageName === "taosanpham") {
      handleBackToListProduct();
    }
    if (pageName === "quanlinhapkho") {
      const btnCreateWareHouse = document.getElementById("create__warehouse");
      if (btnCreateWareHouse) {
        btnCreateWareHouse.addEventListener("click", () => {
          loadPage("quanlinhapkho_taomoi");
        });
      }
    }
    loadPageFollowPageName(pageName);
  } catch (error) {
    document.getElementById("content").innerHTML = `
           <div class="error">
               <h2>Not Foud</h2>
               <p>Hiện tại chưa có nội dung cho trang này ! </p>
           </div>
       `;
  }
}
// toogle active nav
function checkToolgeActiveDefault() {
  const listItemNav = document.querySelectorAll(".sidebar__menu ul li a");
  const listItemNavSub = document.querySelectorAll(
    ".sidebar__menu ul li ul li a"
  );
  const currentPage = sessionStorage.getItem("currenPage");
  listItemNav.forEach((item) => {
    if (
      (currentPage && item.getAttribute("data-page") === currentPage) ||
      (currentPage && currentPage?.includes(item.getAttribute("data-page")))
    ) {
      return item.classList.add("active");
    } else {
      if (!currentPage && item.getAttribute("data-page") === "trangchu") {
        return item.classList.add("active");
      } else return;
    }
  });
  listItemNavSub.forEach((item) => {
    if (
      (currentPage && item.getAttribute("data-page") === currentPage) ||
      (currentPage && currentPage?.includes(item.getAttribute("data-page")))
    ) {
      return item.classList.add("active");
    } else {
      if (!currentPage && item.getAttribute("data-page") === "trangchu") {
        return item.classList.add("active");
      } else return;
    }
  });
}
// handle clode accordtion
function handleCloseAccordtion() {
  const containerAccordtion = document.querySelector(
    ".accordion-collapse.collapse"
  );
  const itemContainerAccordtion = document.querySelectorAll(
    ".sidebar__menu ul li a"
  );

  const containerAccordtion2 = document.querySelector(
    ".accordion-collapse.collapse.ul__2"
  );
  itemContainerAccordtion.forEach((item) => {
    item.addEventListener("click", (event) => {
      if (
        !containerAccordtion.contains(event.target) &&
        containerAccordtion.classList.contains("show")
      ) {
        containerAccordtion.classList.remove("show");
      }
      if (
        !containerAccordtion2.contains(event.target) &&
        containerAccordtion2.classList.contains("show")
      ) {
        containerAccordtion2.classList.remove("show");
      }
    });
  });
}
//  check active menu sub
function checkActiveMenuSub() {
  const currentPage = sessionStorage.getItem("currenPage");
  const menuItems = document.querySelectorAll("[data-page]");
  let parentMenu = null;
  menuItems.forEach((item) => {
    if (item.getAttribute("data-page") === currentPage) {
      parentMenu = item.closest(".accordion-collapse");
    }
  });
  document
    .querySelectorAll(".accordion-collapse")
    .forEach((menu) => menu.classList.remove("show"));
  if (parentMenu) {
    parentMenu.classList.add("show");
  }
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
        handleCloseAccordtion();
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
  checkToolgeActiveDefault();
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
  currentPage ? loadPage(currentPage) : loadPage("trangchu");
}
// handle event upload image
function previewImage(event) {
  const input = event.target;
  const container = input.closest(".image-upload-container");

  const fileNameInput = container.querySelector("input[type='text']");
  const preview = container.querySelector("img");

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
// select opiton row screen
function selectRowScreen() {
  const rowSelect = document.getElementById("rowSelect");
  const tableBody = document.getElementById("tableBody");

  const tableRows = tableBody.querySelectorAll("tr");

  function updateTableRows(rows) {
    tableRows.forEach((row, index) => {
      if (rows === "all" || index < rows) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }
  if (tableBody)
    rowSelect.addEventListener("change", function () {
      updateTableRows(rowSelect.value);
    });

  updateTableRows(5);
}
// pagination
function pagination() {
  const tableBody = document.getElementById("tableBody");
  const tableRows = Array.from(tableBody.querySelectorAll("tr"));
  const rowsPerPage = 5;
  let currentPage = 1;
  const pageNumbersContainer = document.getElementById("pageNumbers");
  let totalPages = Math.ceil(tableRows.length / rowsPerPage);

  // view row tab
  function renderTable(page) {
    tableRows.forEach((row, index) => {
      if (index >= (page - 1) * rowsPerPage && index < page * rowsPerPage) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }
  // view page number
  function updatePagination() {
    pageNumbersContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      let pageItem = document.createElement("li");
      pageItem.className = "page-item";
      pageItem.innerHTML = `<a class="page-link input_outline rounded-0 ${
        i === currentPage ? "active" : ""
      }" href="#">${i}</a>`;

      pageItem.addEventListener("click", function (e) {
        e.preventDefault();
        currentPage = i;
        renderTable(currentPage);
        updatePagination();
      });

      pageNumbersContainer.appendChild(pageItem);
    }
  }
  //click prev page
  prevPage.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderTable(currentPage);
      updatePagination();
    }
  });
  //click next page
  nextPage.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderTable(currentPage);
      updatePagination();
    }
  });
  renderTable(currentPage);
  updatePagination();
}
// load action hanle head page
function handleActionHeadPage() {
  const btnCustomDisplay = document.querySelector(".btn__custom__display");
  const wrapperCustomDisplay = document.querySelector(
    ".display__custom__wrapper"
  );

  btnCustomDisplay.addEventListener("click", () => {
    wrapperCustomDisplay.classList.toggle("active");
  });
}

// action page table
function handleActionItemTr() {
  const btnToEdit = document.querySelectorAll(".redirect__edit.product");
  btnToEdit.forEach((item) =>
    item.addEventListener("click", () => {
      loadPage("chinhsua-sanpham");
    })
  );
}

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
function renderTestTableTonKho() {
  const roles = sessionStorage.getItem("roles");

  const wraperBody = document.querySelector(".render__tonkho");
  const data = [
    {
      ms: "sp102",
      ms2: "sp223",
      ms3: "sp223",
      name: "sp223",
      tonKiot: "sp223",
      tonhop: "sp223",
      tonphoi: "sp223",
      ms2: "sp223",
      tongton: "34232",
      tongban: "23323",
      tb1tuanban: "231231",
      tonnhieunhat: "213",
      tonitNhat: "123123",
      canhbao: "123123",
    },
    {
      ms: "sp102",
      ms2: "sp223",
      ms3: "sp223",
      name: "sp223",
      tonKiot: "sp223",
      tonhop: "sp223",
      tonphoi: "sp223",
      ms2: "sp223",
      tongton: "34232",
      tongban: "23323",
      tb1tuanban: "231231",
      tonnhieunhat: "213",
      tonitNhat: "123123",
      canhbao: "123123",
    },
  ];
  let html = data
    .map((item) => {
      return `
      <tr>
        <td colspan="2">${item.ms}</td>
        <td colspan="2">${item.ms2}</td>
        <td colspan="2">${item.ms3}</td>
        <td>${item.name}</td>
        <td>${item.tonKiot}</td>
        <td colspan="2">${item.tonhop}</td>
        <td colspan="2">${item.tonphoi}</td>
        ${
          roles == "admin"
            ? `
          <td>${item.tongton}</td>
          <td>${item.tongban}</td>
          <td>${item.tb1tuanban}</td>
          <td>${item.tonnhieunhat}</td>
          <td>${item.tonitNhat}</td>
          <td><span class="badge__item warning">Đặt SX</span></td>`
            : ""
        }
      </tr>`;
    })
    .join("");
  wraperBody.innerHTML = html;
}
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication();
  infoAccount();
  checkActiveMenuSub();
  handleCheckLoadPage();
  handleEventSidebar();
  handleEventNav();
  handleLogout();
});

// global
window.loadPage = loadPage;
