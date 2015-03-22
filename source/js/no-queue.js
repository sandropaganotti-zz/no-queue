/* globals fetch $ PushNotification */

(function(win){

    var NoQueue = function(endpoint, queue, tpls) {
        var queue = queue || localStorage.getItem('last_queue') || 'demo-' + Math.random();
        this.$body = $('#body');
        this.$doc = $(document);
        this.tpls = tpls;
        this.user_id = localStorage.getItem('user_id_' + queue);
        this.action = {
            url: endpoint + queue,
            name: 'user'
        };
        this.init();
    };
    
    NoQueue.prototype = {
        init: function() {
            var self = this;
            self.$doc.on('click','a[data-action=subscribe]',self.subscribe.bind(self));
            self.$doc.on('click','a[data-action=manage]',self.manage.bind(self));
            self.$doc.on('click','a[data-action=next]',self.next.bind(self));
            self.refresh();
        },
        refresh: function() {
            var self = this;
            self._json(self.action.url + (self.user_id ? '?user_id=' + self.user_id : '')).then(
                function(data){
                    self.state = data;
                    self.state.user_id = self.user_id;
                    self.$body.html(self.tpls[self.action.name](self.state));    
                }
            );
        },
        subscribe: function() {
            var self = this;
            var push = new PushNotification();
            push.promise.then(function(subscription){
                var body = JSON.stringify({ 
                    endpoint: subscription.endpoint,
                    registration_id: subscription.subscriptionId     
                });
                self._json(self.state.actions.subscribe, {method: 'POST', body: body}).then(
                    function(data){
                        if(data.created){
                            self.user_id = data.user_id;
                            localStorage.setItem('user_id_' + self.state.name, data.user_id);
                            localStorage.setItem('last_queue', self.state.name);
                        }
                        self.refresh();
                    }
                );
            }).catch(function(error){
                alert(error);
            });
        },
        manage: function() {
            var self = this;
            self.action = {
                name: 'admin',
                url: self.state.actions.manage
            };
            self.refresh();
        },
        next: function() {
            var self = this;
            self._json(self.state.actions.next, {method: 'POST'}).then(
                function(){
                    self.refresh();    
                }
            );
        },
        _json: function() {
            return fetch.apply(window, arguments).then(function(res){ return res.json(); });
        }
    };

    win.NoQueue = NoQueue;

})(window);