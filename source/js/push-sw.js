/* global registration */

self.addEventListener('push', function(e) {

  if (!(self.Notification && self.Notification.permission === 'granted')) {
    console.error('Failed to display notification - not supported');
    return;
  }

  return registration.showNotification('It\'s your turn!', {
    body: 'The waiting is over, we\'re ready to serve you',
    icon: 'img/noqueue.png'
  });

});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  clients.openWindow('/');
});