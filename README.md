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
	.
        .
    	.
});
```
##Events and classes

###Touch events
```Javascript
touch.press - Triggered when a touch point is tracked inside an element that is expecting this event
touch.update - Triggered when a touch point already being tracked moves inside an element that is expecting this event
touch.release - Triggered when a touch point is no longer tracked inside an element that is expecting this event
```



