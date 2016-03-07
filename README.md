# TACTIC
TACTIC (Tangible and Tabletop Continuous Interaction) sends touch, tangible and gesture information to your HTML client 
applications

##Getting started

1. Make sure you have RabbitMQ running on your PC
2. Start the tuio_rabbitmq_dumper.jar which will gather TUIO information from your system and provide it to RabbitMQ
3. Run the python server with ```python server.py````
4. ```(Optional)``` If you require nodeJS, initialise it with ```node script/server_node.js````
5. Develop your code and access it through the browser on ```localhost:8000```

A new app starts by including the following scripts:
```javascript
<script type="text/javascript" src="../script/jquery.min.js"></script>
<script type="text/javascript" src="../script/tactic.min.js" ></script>
```

And start the API with 

```javascript
$(function() {
	initTracking(true);


});
```
##Events and classes

###Touch events
```Javascript
touch.press - Triggered when a touch point is tracked inside an element that is expecting this event
touch.update - Triggered when a touch point already being tracked moves inside an element that is expecting this event
touch.remove - Triggered when a touch point already being tracked exits the element that is exepecting this event
touch.release - Triggered when a touch point is no longer tracked inside an element that is expecting this event
```
###Tangible events
```Javascript
object.add - Event triggered when an object enters inside an element that is expecting this event
object.update - Event triggered when an object moves inside an element that is expecting this event
object.remove - Event triggered when an object already exits the element that is expecting this event
object.release - Event triggered when an object is no longer tracked when inside an element that is expecting this event
```

###Hand Tracking events
```Javascript
object_hovering - Event triggered when an object is lifted from the surface and moves above it
hand_pinched - Event triggered when a hand makes a Pinch gesture
hand_unpinched - Event triggered when a hand unmakes a Pinch gesture
hand_moved - Event triggered while a hand is detected
fingers_moved - Event triggered while fingers are detected
```

###Element classes 
```Javascript
.touchable - allows element to receive touch events when touches are registered inside it
.object-aware - allows element to receive tangible events when a tangible is registered inside it
.movable - allows element to move when a touch is registered inside it followed by dragging motion
```

###Subscribing to events
Thanks to jQuery it's easy to subscribe to events by using selectors, which can point to classes or IDs directly.

Let's say you have an element of class button with represents a big button on your screen, and you want it to do something when you touch it. First you will need to add the class touchable to it.

```Javascript
<div class="button touchable"></div>
````
Next, you just need to bind it to the corresponding event and you're good to go.

```Javascript 
$('.button').bind('touch.press', function() {
    alert("I was pressed");
});
```

Events can also provide additional data. Here is an example on how to reach this data.

```Javascript
$(*).bind('object_hovering', function(event, data) {
    console.log("object " + data.id + " is hovering the table on " + data.hand + " hand!");
});

//output could be -> "object 0 is hovering the table on right hand!"
```

##Exchange information between applications

TACTIC contains an integrated node.js component that allows users to send and receive messages between web applications easily without having to initiate any variables or messaging protocols. This allows applications to communicate with each other even in a cross-device setting.

###Publish messages (example)
```Javascript
socket.emit('message', "hello");
```

###Subscribe to messages (example)
```Javascript
socket.on('message', function8~(msg) {
    console.log(msg);
});
```

##Publish & Subscribe messages

We use rabbitMQ, a messaging framework, for easy communication between different languages. Currently this is used for data management between the Java Hand Tracking component and the Javascript API, but if you would like to add a new module, you can add new bridges of communication for your languages. You can check out RabbitMQ to learn how to integrate it with existing languages you may already be using. Meanwhile we've got you covered on the Javascript front.

###Subscribing to data (example)
```Javascript
MQ.queue("auto", {autoDelete : true}).bind("handInfo", "*.handPosition").callback(function(m) {
    console.log(m.data);
});
```

###Publishing data (example)
```Javascript
MQ.topic('handInfo').publish({
        //...
        //place object here
        //...
}, 'app.finish');
```


