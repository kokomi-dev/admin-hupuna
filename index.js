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
    case "chinhsua-sanpham":
      handleLoadEditor();
    default:
      break;
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
  const currenPage = sessionStorage.getItem("currenPage");
  const containerAccordtion = document.querySelector(
    ".accordion-collapse.collapse"
  );
  const containerAccordtion2 = document.querySelector(
    ".accordion-collapse.collapse ul__2"
  );
  const itemContainerAccordtion = document.querySelectorAll(
    ".accordion-collapse.collapse li a"
  );
  const activeItems = document.querySelectorAll(
    ".accordion-collapse li a.active"
  );
  itemContainerAccordtion.forEach((item) => {
    if (item.getAttribute("data-page") === currenPage) {
      let parentAccordion = item.closest(".accordion-collapse");
      return parentAccordion.classList.add("show");
    } else return;
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
// render test table
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
//button onclick screen input
function input_file_media() {
  let uploadBox = document.getElementById("scren_input_file");

  if (uploadBox.classList.contains("d-none")) {
    uploadBox.classList.remove("d-none"); // Hiển thị
  } else {
    uploadBox.classList.add("d-none"); // Ẩn đi
  }
}
//upload img input
function upload_img_screen(event) {
  const file = event.target.files[0]; // Lấy tệp tin đã chọn
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Đảm bảo rằng phần tử chứa ảnh có thể hiển thị
      const imgElement = document.querySelector("#img_load_screen img");
      imgElement.src = e.target.result; // Đặt nguồn ảnh cho phần tử img
      document.getElementById("img_load_screen").classList.remove("d-none"); // Hiển thị phần tử chứa ảnh
    };

    reader.readAsDataURL(file); // Đọc tệp tin như một DataURL
  } else {
    alert("Không có tệp tin nào được chọn.");
  }
}
// handle toogle open down menu
function handleOpenDown() {
  const toggleButtons = document.querySelectorAll(".open__down-toggle");
  if (!toggleButtons.length) return;

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const menuItem = this.parentElement;
      const dropdownContent = menuItem.querySelector(".open__down__content");
      const isActive = menuItem.classList.contains("active");

      document
        .querySelectorAll(".open__down__item.active")
        .forEach((activeItem) => {
          if (activeItem !== menuItem) {
            const activeContent = activeItem.querySelector(
              ".open__down__content"
            );

            activeContent.style.maxHeight = "0";
            activeContent.style.opacity = "0";
            setTimeout(() => {
              activeItem.classList.remove("active");
              activeContent.style.display = "none";
            }, 300);
          }
        });

      if (!isActive) {
        menuItem.classList.add("active");

        dropdownContent.style.display = "block";
        dropdownContent.style.maxHeight = "0";
        dropdownContent.style.opacity = "0";

        dropdownContent.offsetHeight;

        dropdownContent.style.height = dropdownContent.scrollHeight + "px";
        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";

        dropdownContent.style.opacity = "1";
      } else {
        dropdownContent.style.maxHeight = "0";
        dropdownContent.style.opacity = "0";
        setTimeout(() => {
          menuItem.classList.remove("active");
          dropdownContent.style.display = "none";
        }, 300);
      }
    });
  });
}
// handle tab list container
function handleActiveOpenTab() {
  const tabContainers = document.querySelectorAll(".tabs-container");

  tabContainers.forEach((container) => {
    const tabButtons = container.querySelectorAll(".tab-button");
    const tabPanes = container.querySelectorAll(".tab-pane");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab");

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabPanes.forEach((pane) => pane.classList.remove("active"));

        button.classList.add("active");

        const targetPane = container.querySelector(`#${tabId}`);
        if (targetPane) {
          targetPane.classList.add("active");
        }
      });
    });
  });
}
// handle modal
function initModals() {
  // Thêm sự kiện cho các nút mở modal
  document.querySelectorAll("[data-modal-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-modal-target");
      openModal(modalId);
    });
  });

  // Thêm sự kiện cho các nút đóng modal
  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-modal-close");
      closeModal(modalId);
    });
  });

  // Đóng modal khi click vào overlay
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", function (e) {
      // Chỉ đóng modal khi click vào overlay, không phải vào modal container
      if (e.target === overlay) {
        const modalId = overlay.getAttribute("id");
        closeModal(modalId);
      }
    });
  });

  // Đóng modal khi nhấn phím ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.active").forEach((modal) => {
        const modalId = modal.getAttribute("id");
        closeModal(modalId);
      });
    }
  });
}
// Hàm mở modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");

    // Ngăn scroll trang khi modal hiển thị
    document.body.style.overflow = "hidden";
  }
}
// Hàm đóng modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");

    // Cho phép scroll trang trở lại khi modal đóng
    document.body.style.overflow = "";
  }
}
// handle event click rederict url page
function handleClickRedirectUrlPage() {
  const redirectButtons = document.querySelectorAll(".redirect__btn");

  redirectButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const redirectUrl = this.getAttribute("data-redirect-url");
      if (redirectUrl) {
        loadPage(redirectUrl);
      }
    });
  });
}
// hnndle sủa nhanh các bảng
function handleEventQuickFix() {
  const quickEditLinks = document.querySelectorAll(
    ".hover__wrapper .quick__fix"
  );
  if (quickEditLinks) {
    quickEditLinks.forEach((link) => {
      link.classList.add("quick-edit-link");
      link.style.cursor = "pointer";
    });

    const quickEditPanel = document.getElementById("quick__edit");
    let activeRow = null;
    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("quick-edit-link")) {
        event.preventDefault();
        const clickedRow = event.target.closest(".item__tr");
        if (activeRow === clickedRow) {
          if (quickEditPanel.style.display === "block") {
            quickEditPanel.style.display = "none";
            clickedRow.classList.remove("active-row");
            activeRow = null;
          } else {
            positionPanel(clickedRow);
          }
        } else {
          if (activeRow) {
            activeRow.classList.remove("active-row");
          }
          activeRow = clickedRow;
          activeRow.classList.add("active-row");
          positionPanel(clickedRow);
        }
      }
    });
    function positionPanel(row) {
      const rowRect = row.getBoundingClientRect();
      const tableRect = row.closest("table").getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      quickEditPanel.style.display = "block";
      quickEditPanel.style.position = "absolute";
      quickEditPanel.style.top = rowRect.bottom + scrollTop + "px";
      quickEditPanel.style.left = tableRect.left + "px";
      quickEditPanel.style.width = tableRect.width + "px";
      quickEditPanel.style.zIndex = "1000";
    }

    const closeButton = document.getElementById("close-quick-edit");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        quickEditPanel.style.display = "none";

        if (activeRow) {
          activeRow.classList.remove("active-row");
          activeRow = null;
        }
      });
    }

    document.addEventListener("click", function (event) {
      if (
        !event.target.closest("#quick__edit") &&
        !event.target.classList.contains("quick-edit-link")
      ) {
        quickEditPanel.style.display = "none";

        if (activeRow) {
          activeRow.classList.remove("active-row");
          activeRow = null;
        }
      }
    });
  } else return;
}
function loadFuntion() {
  const currentPage = sessionStorage.getItem("currenPage");
  handleActionItemTr();
  handleOpenDown();
  handleActiveOpenTab();
  initModals();
  handleLoadEditor();
  handleClickRedirectUrlPage();
  handleEventQuickFix();
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

    loadFuntion();
    if (pageName === "trangchu") {
      handleLoadChartDashboard();
    }
    if (pageName === "sanpham") {
      handleResetFilter();
      // handleLoadEditor();
    }

    if (pageName === "baiviet") {
      const btnCreateBlog = document.getElementById("btn__edit__blog");
      btnCreateBlog.addEventListener("click", () => {
        loadPage("chinhsua-baiviet");
      });
      selectRowScreen();
      pagination();
      // handleLoadEditor();
    }
    if (pageName === "taosanpham" || pageName === "taobaiviet") {
      // handleLoadEditor();
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
// check handle load
function handleCheckLoadPage() {
  const currentPage = sessionStorage.getItem("currenPage");
  currentPage ? loadPage(currentPage) : loadPage("trangchu");
}
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication();
  infoAccount();
  handleCloseAccordtion();
  checkActiveMenuSub();
  handleCheckLoadPage();
  handleEventSidebar();
  handleEventNav();
  handleLogout();
});

// comment box
let openTags = [];
  
function insertTag(tag, attrs = "") {
  const textarea = document.getElementById("comment-text");
  const startTag = `<${tag}${attrs}>`;
  const endTag = `</${tag}>`;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  // Chèn thẻ vào vị trí con trỏ
  textarea.value = text.substring(0, start) + startTag + endTag + text.substring(end);
  textarea.selectionStart = textarea.selectionEnd = start + startTag.length;

  openTags.push(endTag);
  
  // Cập nhật vùng preview (vùng hiển thị bình luận có HTML)
  updatePreview();
}

function closeTag() {
  const textarea = document.getElementById("comment-text");

  if (openTags.length > 0) {
    const lastTag = openTags.pop();
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);

    textarea.value = textBefore + lastTag + textAfter;
    textarea.selectionStart = textarea.selectionEnd = cursorPos + lastTag.length;
    
    // Cập nhật lại vùng preview
    updatePreview();
  }
}

function updatePreview() {
  const textarea = document.getElementById("comment-text");
  const preview = document.getElementById("comment-preview");

  // Hiển thị nội dung của textarea dưới dạng HTML
  preview.innerHTML = textarea.value;
}