/* global Promise Notification */

(function(win){

    var PushNotification = function(){
        var self = this;
        this.promise = new Promise(function(resolve, reject) {
            self.resolve = resolve;
            self.reject = reject;
            self.init();
        });
    };

    PushNotification.prototype = {

        init: function(){
            var self = this;
            navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
                if (!serviceWorkerRegistration.pushManager) {
                    self.reject(Error('Push is not supported, Try Chrome M41.'));
                    return;
                } else {
                    Notification.requestPermission(function(result){
                        if(result === 'granted'){
                            self.manageSubscription(serviceWorkerRegistration);
                        } else {
                            self.reject(Error('Please allow Notification'));
                        }
                    });
                }
            });
        },

        manageSubscription: function(serviceWorkerRegistration){    
            var self = this;
            serviceWorkerRegistration.pushManager.getSubscription()
                .then(function(subscription){
                    if(!subscription){
                        self.subscribe(serviceWorkerRegistration);
                    } else {
                        self.updateSubscription(subscription);
                    }
                });    
        },

        subscribe: function(serviceWorkerRegistration){
            var self = this;
            serviceWorkerRegistration.pushManager.subscribe()
                .then(function(subscription) {
                    self.updateSubscription(subscription);
                })
                .catch(function(e) {
                    self.reject(Error('Unable to register for push'));
                });
        },

        updateSubscription: function(subscription){
            this.resolve(subscription);
        }

    };

    win.PushNotification = PushNotification;

})(window);