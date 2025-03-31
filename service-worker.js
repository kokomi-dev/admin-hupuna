self.addEventListener("install", (event) => {
  console.log("server đã được cài đặt");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("server đã được kích hoạt");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
