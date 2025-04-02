const channel = new BroadcastChannel("notify-admin");

function handleLoadEventNotify() {
  console.log("load");
  channel.addEventListener("message", (event) => {
    const messagesDiv = document.getElementById("message-div");
    const newMessage = document.createElement("p");
    newMessage.textContent = `Tin nhắn: ${event.data}`;
    messagesDiv.appendChild(newMessage);
  });
}
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
        // Chỉ cho loại file ảnh
        if (meta.filetype === "image") {
          // Tạo một phần tử input
          var input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

          input.onchange = function () {
            var file = this.files[0];
            var reader = new FileReader();

            reader.onload = function () {
              // Khi đọc file xong, sẽ gọi callback với data URL của ảnh
              callback(reader.result, {
                alt: file.name,
              });
            };

            // Đọc file dưới dạng data URL (base64)
            reader.readAsDataURL(file);
          };

          // Mở hộp thoại chọn file
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
// load page show content
async function loadPage(pageName) {
  try {
    const contentDiv = document.getElementById("content");
    const loader = document.getElementById("loading__content__page");

    // loader.style.display = "flex";

    const response = await fetch(`pages/${pageName}.html`);
    if (!response.ok) {
      throw new Error("Trang không tồn tại");
    }

    const content = await response.text();

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    contentDiv.innerHTML = content;
    sessionStorage.setItem("currenPage", pageName);
    // loader.style.display = "none";

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
    if (pageName === "baiviet") {
      const btnCreateBlog = document.getElementById("btn__create__product");
      btnCreateBlog.addEventListener("click", () => {
        loadPage("taobaiviet");
      });
      selectRowScreen();
      pagination();
      handleLoadEditor();
    }
    if (pageName === "taosanpham" || pageName === "taobaiviet") {
      handleLoadEditor();
    }
    if (pageName === "taosanpham") {
      handleBackToListProduct();
    }
    if(pageName === "quanlixuatkho"){
      const btnCreateExport = document.getElementById("btn__create__product");
      btnCreateExport.addEventListener("click", () => {
        // loadPage("taophieuxuatkho");
        loadPage("thuvienmedia")
      });
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

  itemContainerAccordtion.forEach((item) => {
    item.addEventListener("click", (event) => {
      if (!containerAccordtion.contains(event.target)) {
        if (containerAccordtion.classList.contains("show"))
          containerAccordtion.classList.remove("show");
        else return;
      }
    });
  });
}
// handle event change page pc
function handleEventNav() {
  const listItemNav = document.querySelectorAll(".sidebar__menu ul li a");
  const containerAccordtion = document.querySelector(
    ".accordion-collapse.collapse"
  );
  const items = document.querySelectorAll(".accordion-collapse.collapse li a");
  items.forEach((item) => {
    if (
      item.classList.contains("active") &&
      !containerAccordtion.classList.contains("show")
    )
      containerAccordtion.classList.add("show");
  });
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
  if (!currentPage) {
    return loadPage("trangchu");
  } else {
    return loadPage(currentPage);
  }
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

document.addEventListener("DOMContentLoaded", () => {
  handleCheckLoadPage();
  handleEventSidebar();
  handleEventNav();
});

// ******media******
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
  const file = event.target.files[0];  // Lấy tệp tin đã chọn
  if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
          // Đảm bảo rằng phần tử chứa ảnh có thể hiển thị
          const imgElement = document.querySelector("#img_load_screen img");
          imgElement.src = e.target.result;  // Đặt nguồn ảnh cho phần tử img
          document.getElementById("img_load_screen").classList.remove("d-none");  // Hiển thị phần tử chứa ảnh
      }

      reader.readAsDataURL(file);  // Đọc tệp tin như một DataURL
  } else {
      alert("Không có tệp tin nào được chọn.");
  }
}


