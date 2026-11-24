// Lưu sẵn trang, A-Frame, 10 poster và chữ để mở lại khi mất Wi-Fi
var KHO = 'vr-genact-v2-3-60s';
var TEP = ['./', './index.html', './lib/aframe.min.js', './manifest.webmanifest', './icon-512.png'];
['tieu-de','dong','troi','tro-choi','luat','di-chuyen','nut-bat-dau','nut-choi-lai','nhan-cau','nhan-giay','nhan-diem',
 'dung','sai','ket-qua','het-gio','cau-dung','khen-1','khen-2','khen-3','moi-tham-quan'].forEach(function (t) { TEP.push('./chu/' + t + '.png'); });
for (var i = 1; i <= 10; i++) {
  var n = (i < 10 ? '0' : '') + i;
  TEP.push('./poster/poster-' + n + '.jpg', './chu/so-' + n + '.png', './chu/hoi-' + n + '.png', './chu/dap-' + n + '.png');
}
self.addEventListener('install', function (e) { e.waitUntil(caches.open(KHO).then(function (c) { return c.addAll(TEP); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ds) { return Promise.all(ds.filter(function (k) { return k !== KHO; }).map(function (k) { return caches.delete(k); })); })
    .then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  // Trang chính: lấy mạng trước (để nhận bản sửa mới), mất mạng thì dùng bản lưu
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(function (r) {
      var b = r.clone(); caches.open(KHO).then(function (c) { c.put('./index.html', b); }); return r;
    }).catch(function () { return caches.match('./index.html'); }));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); }));
});
