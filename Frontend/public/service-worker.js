const toRouteUrl = (url) => {
  if (!url) return '/adminpanel';
  if (url.startsWith('/#/')) return url.slice(1);
  if (url.startsWith('#/')) return url.slice(1);
  if (url.startsWith('/')) return url;
  return `/${url}`;
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, url } = event.data;
    self.registration.showNotification(title || 'Notification', {
      body: body || '',
      icon: '/Kavi_logo.png',
      badge: '/Kavi_logo.png',
      tag: `kavi-${Date.now()}`,
      data: { url: toRouteUrl(url) },
      requireInteraction: true,
    });
  }
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.some((client) => client.visibilityState === 'visible')) return undefined;
      return self.registration.showNotification(data.title || '🔔 New Order Received', {
        body: data.body || 'A new order was received.',
        icon: '/Kavi_logo.png',
        badge: '/Kavi_logo.png',
        tag: `new-order-${data.orderId || Date.now()}`,
        data: { url: '/adminpanel/all-orders' },
        requireInteraction: true,
      });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/adminpanel/all-orders', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => 'focus' in client);
      if (existing) {
        existing.navigate(targetUrl);
        return existing.focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
