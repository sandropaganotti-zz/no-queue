/* global registration */

self.addEventListener('push', function(e) {

  if (!(self.Notification && self.Notification.permission === 'granted')) {
    console.error('Failed to display notification - not supported');
    return;
  }

  var data = e.data ? e.data.json() : {};
  var title = data.title || 'Why you no title?';
  var message = data.message || 'Hello World!....I guess.';

  return registration.showNotification(title, {
    body: message,
    icon: 'images/touch/chrome-touch-icon-192x192.png'
  });

});