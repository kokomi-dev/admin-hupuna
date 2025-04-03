function handleActionItemTr() {
  const btnToEdit = document.querySelectorAll(".redirect__edit.product");
  btnToEdit.forEach((item) =>
    item.addEventListener("click", () => {
      loadPage("chinhsua-sanpham");
    })
  );
}

document.addEventListener("DOMContentLoaded", () => {
  handleActionItemTr();
});
