self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.some((client) => client.visibilityState === 'visible')) return undefined;
      return self.registration.showNotification(data.title || '🔔 New Order Received', {
        body: data.body || 'A new order was received.',
        icon: '/images/Kavi_logo.png',
        badge: '/images/Kavi_logo.png',
        tag: `new-order-${data.orderId || Date.now()}`,
        data: { url: '/#/adminpanel/new-orders' },
      });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/#/adminpanel/new-orders', self.location.origin).href;
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
