var touches;
var tree;
var objects;

function refreshTracking(){
	tree = new RTree();

	$('.touchable, .movable, object-aware').each(function() {
		var $this = $(this);
		tree.insert({x: $this.offset().left, y: $this.offset().top, w: $this.width(), h: $this.height()}, $this);

	})
}

function initTracking(dontDraw) {
	
refreshTracking();
	
	touches = {};
	objects = {};
	table_object_tree = new RTree(); //holding object positions to disable false touch force inside objects during tracking

	
	tuio.cursor_add(function(data) {

		touches[data.sid] = {
			x: data.x * w,
			y: data.y * h,
			divs: [],
			movables: []
		}

		tree.search({x: data.x * w, y: data.y * h, w: 15, h: 15}).filter(function($div){
			return $div.hasClass("touchable")}).map(function($el) {
				$el.trigger('touch.press', [{x: data.x * w, y: data.y * h, id: data.fid}]);
				touches[data.sid].divs.push($el);
		});

		
		tree.search({x: data.x * w, y: data.y * h, w: 15, h: 15}).filter(function($div){return $div.hasClass("movable")}).map(function($el) {
			
			touches[data.sid].movables.push({
				div: $el,
				initX: data.x * w - $($el).position().left,
				initY: data.y * h - $($el).position().top
			});
		}); 
		
	});

	tuio.cursor_update(function(data) {

		touches[data.sid].x = data.x * w;
		touches[data.sid].y = data.y * h;

		var divs = []; //divs this touch is inside of

		tree.search({x: data.x * w, y: data.y * h, w: 15, h: 15}).filter(function($div){return $div.hasClass("touchable")}).map(function($el) {
			if(touches[data.sid].divs.indexOf($el) >= 0){
				$el.trigger('touch.update', [{x: data.x * w, y: data.y * h, id: data.fid}]);
			} else {
				$el.trigger('touch.press', [{x: data.x * w, y: data.y * h, id: data.fid}]);
				touches[data.sid].divs.push($el);
			}
			divs.push($el);
		});

		touches[data.sid].divs.map(function($el){
			if(divs.indexOf($el) == -1) {
        		$el.trigger('touch.remove', [{id: data.fid, x: data.x * w, y: data.y * h}]);  
        		var index = touches[data.sid].divs.indexOf($el);
        		touches[data.sid].divs.splice(index, 1);
			}
		});

		touches[data.sid].movables.map(function($el){
			var x = data.x * w - $el.initX;
			var y = data.y * h - $el.initY;

			var div = $el.div;
			$(div).css('left', x);
			$(div).css('top', y);


			tree.remove({x: div.offset().left, y: div.offset().top, w: div.width(), h: div.height()}, div);
			tree.insert({x: x, y: y, w: div.width(), h: div.height()}, div);
		});	

	});

	tuio.cursor_remove(function(data){
		
		touches[data.sid].divs.map(function($el) {
			$el.trigger('touch.release', [{x: data.x * w, y: data.y * h, id: data.fid }]);
		});

		delete touches[data.sid];
	
		
	});

	tuio.object_add(function(data) {
		objects[data.fid] = {
			x : data.x * w,
			y: data.y * h,
			angle: data.angle,
            inside: []
		};
		
		var $this = objects[data.fid];
		table_object_tree.insert({x: $this.x - 100, y: $this.y - 100, w:200, h:200}, $this);
				
		tree.search({x: data.x * w, y: data.y * h, w: 15, h: 15}).filter(function($div){return $div.hasClass("object-aware")}).map(function($el) {
    		$el.trigger('object.add', [{id: data.fid, x: data.x * w, y: data.y * h, angle: data.angle}]);
            objects[data.fid].inside.push($el);

		});

	});

	tuio.object_update(function(data){

		objects[data.fid].x = data.x * w;
		objects[data.fid].y = data.y * h;
	    
		var divs = [];

		tree.search({x: data.x * w, y: data.y * h, w: 15, h: 15}).filter(function($div){return $div.hasClass("object-aware")}).map(function($el){
        	if(objects[data.fid].inside.indexOf($el) >= 0) {
        		$el.trigger('object.update', [{id: data.fid, x: data.x * w, y: data.y * h, angle: data.angle}]); 
        	} else {
        		$el.trigger('object.add', [{id: data.fid, x: data.x * w, y: data.y * h, angle: data.angle}]);
        		objects[data.fid].inside.push($el);
        	}  
        	divs.push($el);
		});

		objects[data.fid].inside.map(function($el) {
			if(divs.indexOf($el) == -1) {
			    $el.trigger('object.remove', [{id: data.fid, x: data.x * w, y: data.y * h, angle: data.angle}]);  
				var index = objects[data.fid].inside.indexOf($el);
				objects[data.fid].inside.splice(index, 1);
			}
		});

	});

	tuio.object_remove(function(data) {
		objects[data.fid].inside.map(function($el) {
			$el.trigger('object.release', [{id: data.fid, x: data.x * w, y: data.y * h, angle: data.angle}]);  

		});

		delete objects[data.fid];
	});



	tuio.start();
	var w = $(window).width(), h = $(window).height();
	$('#__tuiojs_connector_npTuioClient').css('visibility', 'hidden');
}

var TUIO = function() {
		// Listener class

		this.Listener = function(impl) {
			if (impl != undefined) {
				// override original method implementation
				for (var key in impl) {
					this[key] = impl[key];
				}
			}
		}
		this.Listener.prototype = {
			object_add:    function(data) { },
			object_update: function(data) { },
			object_remove: function(data) { },
			cursor_add:    function(data) { },
			cursor_update: function(data) { },
			cursor_remove: function(data) { }
		}

		// Instance variables

		this.objects = [];
		this.cursors = [];

		this._data = {};

		this._default_listener = new this.Listener();
		this._listeners = [this._default_listener];

		this._connector = undefined;

	};
	TUIO.prototype = {
		start: function(name) {
			var c = this._connector;
			if (c != undefined) {
				if (c.start != undefined) {
					c.start();
				}
			}
		},

		stop: function() {
			var c = this._connector;
			if (c != undefined) {
				if (c.stop != undefined) {
					c.stop();
				}
			}
		},

		setConnector: function(connector) {
			this._connector = connector;
		},
		
		addListener: function(listener) {
			this._listeners.push(listener);
		},
		removeListener: function(listener) {
			this._listeners.splice(this._listeners.indexOf(listener), 1);
		},

		_invoke: function(method, data) {
			var i, len = this._listeners.length;
			for (i=0; i<len; i++) {
				var listener = this._listeners[i];
				listener[method](data);
			}
		},

		callback: function(type, sid, fid, x, y, angle) {
			var data;
			
			if ((type != 0) && (type != 3)) {
				data = this._data[sid];
			}
			else {
				data = {
					sid: sid,
					fid: fid,
					path: []
				}
				this._data[sid] = data;
			}

			data.path.push([x, y]);
	
			data.x = x;
			data.y = y;
			
			if (type < 3) {
				data.angle = angle;
			}
	
			switch (type) {
				case 0: 
					this.objects.push(data);
					this._invoke('object_add', data);
					break;
	
				case 1: 
					this._invoke('object_update', data);
					break;
	
				case 2: 
					this.objects.splice(this.objects.indexOf(data), 1);
					this._invoke('object_remove', data);
					break;
	
				case 3: 
					this.cursors.push(data);
					this._invoke('cursor_add', data);
					break;
	
				case 4: 
					this._invoke('cursor_update', data);
					break;
	
				case 5: 
					this.cursors.splice(this.cursors.indexOf(data), 1);
					this._invoke('cursor_remove', data);
					break;
	
				default:
					break;
			}
	
			if ((type == 2) || (type == 5)) {
				delete this._data[sid];
			}
		},

		// Convenient callbacks set

		object_add:    function(f) { this._default_listener.object_add = f;    },
		object_update: function(f) { this._default_listener.object_update = f; },
		object_remove: function(f) { this._default_listener.object_remove = f; },
		cursor_add:    function(f) { this._default_listener.cursor_add = f;    },
		cursor_update: function(f) { this._default_listener.cursor_update = f; },
		cursor_remove: function(f) { this._default_listener.cursor_remove = f; }

	};
	
(function() {
	var TUIO = function() {
		// Listener class

		this.Listener = function(impl) {
			if (impl != undefined) {
				// override original method implementation
				for (var key in impl) {
					this[key] = impl[key];
				}
			}
		}
		this.Listener.prototype = {
			object_add:    function(data) { },
			object_update: function(data) { },
			object_remove: function(data) { },
			cursor_add:    function(data) { },
			cursor_update: function(data) { },
			cursor_remove: function(data) { }
		}

		// Instance variables

		this.objects = [];
		this.cursors = [];

		this._data = {};

		this._default_listener = new this.Listener();
		this._listeners = [this._default_listener];

		this._connector = undefined;

	};
	TUIO.prototype = {
		start: function(name) {
			var c = this._connector;
			if (c != undefined) {
				if (c.start != undefined) {
					c.start();
				}
			}
		},

		stop: function() {
			var c = this._connector;
			if (c != undefined) {
				if (c.stop != undefined) {
					c.stop();
				}
			}
		},

		setConnector: function(connector) {
			this._connector = connector;
		},
		
		addListener: function(listener) {
			this._listeners.push(listener);
		},
		removeListener: function(listener) {
			this._listeners.splice(this._listeners.indexOf(listener), 1);
		},

		_invoke: function(method, data) {
			var i, len = this._listeners.length;
			for (i=0; i<len; i++) {
				var listener = this._listeners[i];
				listener[method](data);
			}
		},

		callback: function(type, sid, fid, x, y, angle) {
			var data;
			
			if ((type != 0) && (type != 3)) {
				data = this._data[sid];
			}
			else {
				data = {
					sid: sid,
					fid: fid,
					path: []
				}
				this._data[sid] = data;
			}

			data.path.push([x, y]);
	
			data.x = x;
			data.y = y;
			
			if (type < 3) {
				data.angle = angle;
			}
	
			switch (type) {
				case 0: 
					this.objects.push(data);
					this._invoke('object_add', data);
					break;
	
				case 1: 
					this._invoke('object_update', data);
					break;
	
				case 2: 
					this.objects.splice(this.objects.indexOf(data), 1);
					this._invoke('object_remove', data);
					break;
	
				case 3: 
					this.cursors.push(data);
					this._invoke('cursor_add', data);
					break;
	
				case 4: 
					this._invoke('cursor_update', data);
					break;
	
				case 5: 
					this.cursors.splice(this.cursors.indexOf(data), 1);
					this._invoke('cursor_remove', data);
					break;
	
				default:
					break;
			}
	
			if ((type == 2) || (type == 5)) {
				delete this._data[sid];
			}
		},

		// Convenient callbacks set

		object_add:    function(f) { this._default_listener.object_add = f;    },
		object_update: function(f) { this._default_listener.object_update = f; },
		object_remove: function(f) { this._default_listener.object_remove = f; },
		cursor_add:    function(f) { this._default_listener.cursor_add = f;    },
		cursor_update: function(f) { this._default_listener.cursor_update = f; },
		cursor_remove: function(f) { this._default_listener.cursor_remove = f; }

	};
	this.tuio = new TUIO(); 
})();

tuio.setConnector({
	_failmsg: "Unable to initialize npTuioClient plugin.",
	_id: "__tuiojs_connector_npTuioClient",

	start: function() {
		var el = document.getElementById(this._id);
		if (el == undefined) {
			var el = document.createElement('object');
			el.setAttribute('id', this._id);
			el.setAttribute('type', 'application/x-tuio');
			el.appendChild(document.createTextNode(this._failmsg));
			document.body.appendChild(el);
		}

		// TODO: check if the plugin can be loaded. 
		//       if so, hide the plugin (display:none).
	},

	stop: function() {
		var el = document.getElementById(this._id);
		if (el != undefined) {
			document.body.removeChild(el);
		}
	}
});

function tuio_callback(type, sid, fid, x, y, angle)  {
	tuio.callback(type, sid, fid, x, y, angle);
}