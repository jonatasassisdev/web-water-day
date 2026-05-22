importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBQlkqEdoNmDb8ZEYJiwb9v9GXhBsJfud4',
  authDomain: 'water-day-17581.firebaseapp.com',
  projectId: 'water-day-17581',
  storageBucket: 'water-day-17581.firebasestorage.app',
  messagingSenderId: '786808092515',
  appId: '1:786808092515:web:38c77e6fd2f0d66e1a4556',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'WaterDay', {
    body: body ?? 'Hora de se hidratar!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  });
});
