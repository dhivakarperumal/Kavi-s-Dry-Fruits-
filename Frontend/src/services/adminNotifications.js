import api from './api';

const urlBase64ToUint8Array = (value) => {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
};

export const registerAdminPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return 'unsupported';
  if (!('Notification' in window)) return 'unsupported';

  const permission = Notification.permission === 'default'
    ? await Notification.requestPermission()
    : Notification.permission;
  if (permission !== 'granted') return permission;

  const registration = await navigator.serviceWorker.ready;
  const { data } = await api.get('/push/public-key');
  if (!data?.publicKey) return 'unconfigured';

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });
  }

  await api.post('/push/subscribe', subscription.toJSON());
  return permission;
};

export const showAdminBrowserNotification = (order) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const notification = new Notification('🔔 New Order Received', {
    body: `Order ${order.orderId} • ${order.clientName || 'Customer'} • ₹${Number(order.totalAmount || 0).toFixed(2)}`,
    icon: '/images/Kavi_logo.png',
    tag: `new-order-${order.orderId}`,
  });
  notification.onclick = () => {
    window.focus();
    window.history.pushState(null, '', '/adminpanel/new-orders');
    window.dispatchEvent(new PopStateEvent('popstate'));
    notification.close();
  };
};
