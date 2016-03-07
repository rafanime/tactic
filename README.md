# TACTIC
TACTIC (Tangible and Tabletop Continuous Interaction) sends touch, tangible and gesture information to your HTML client 
applications

##Getting started
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
.touchable -> allows element to receive touch events when touches are registered inside it
.movable -> allows element to move when a touch is registered inside it followed by dragging motion
.object-aware -> allows element to receive tangible events when a tangible is registered inside it
```

