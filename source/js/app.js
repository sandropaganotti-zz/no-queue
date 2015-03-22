/* global NoQueue tmpl */

var entryPoint = 'https://shaped-apogee-87811.appspot.com/queue/';

window.addEventListener('DOMContentLoaded', function(){
    if (!('serviceWorker' in navigator)) {
        alert('Sorry, you need a browser supporting ServiceWorker and Push Notification, try Chrome 42+');
        return;
    }
    
    $(".button-collapse").sideNav();
    navigator.serviceWorker.register('push-sw.js', {scope: './'});
    new NoQueue(entryPoint, getParam('queue'), tmpl);
});

function getParam(name){
    var matches = window.location.search.match(new RegExp(name + '=([^\&]+)'));
    return matches ? matches.pop() : matches;
}