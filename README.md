# NoQueue

An application to showcase how powerful ServiceWorker and the Physical Web can 
be when working togheter! 

## How does this work?

Here's the idea: a UriBeacon broadcast an URL pointing to a page that 
installs a ServiceWorker, asks the user for permission to send notification and,
once granted, register the user to a push notification service (in this case 
Google Cloud Messaging service). 

Then it sends the information obtained to a server and informs the user the 
subscription went well. Once done that the server is able at any point to 
send a POST request to the Messaging service which in turn sends it back to 
the desired device. 

This wakes up the ServiceWorker (if you're on an Android device even if your 
browser is not open) and fires a push event that can be used to trigger a 
Notification to inform the user about an update of the service he subscribed.

Read more on [sandropaganotti.com](http://sandropaganotti.com/2015/04/26/noqueue-an-experiment-with-service-worker-and-the-physical-web/)

## 1 min video? Sure!

NoQueue allow a user to subscribe to the queue broadcasted by the beacon and 
receive a notification as soon as he's ready to be served. 

Here's the video: https://drive.google.com/file/d/0B1BzDTsrFgSgMmRaSHB1VUV0a2s/view

## How can I test this ?

Easy! You need to install it here's how:

1. download the repository;
2. set up a LAMP stack;
3. create a database using the following script:

    CREATE TABLE `queues` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `name` varchar(255) NOT NULL,
      `registration_id` text NOT NULL,
      `endpoint` text NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8
    
4. change line 16 of index.php to reflect your database configuration;
5. run npm install (you'll need nodejs installed to do this);
6. run grunt copy dot uglify sass
7. navigate /?queue=yourqueuename or save the same URL in a UriBeacon

## Kudos and thanks

Thanks to http://materializecss.com/ for the easy to use material design framework.
