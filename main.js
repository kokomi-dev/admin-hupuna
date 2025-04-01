async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    console.log("thành công =>" + registration.scope);
    return registration;
  } catch (error) {
    showToast("Lỗi khi đăng ký Service Worker:", error);
    return null;
  }
}
async function sendPushNotification() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      showToast("Không có quyền hiển thị thông báo");
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification("Thông báo", {
      body: "test",
      icon: "assets/icons/blog-pencil.svg",
      data: {
        url: window.location.href,
      },
    });
  } catch (error) {
    console.error("Lỗi chi tiết khi gửi thông báo đẩy:", error);
  }
}

async function initializePushNotifications() {
  if ("serviceWorker" in navigator) {
    registerServiceWorker();
    document.getElementById("test").addEventListener("click", async () => {
      await sendPushNotification();
    });
  } else {
    document.getElementById("status").textContent =
      "Trình duyệt không hỗ trợ Service Worker hoặc Push Notification";
    return;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializePushNotifications();
});
