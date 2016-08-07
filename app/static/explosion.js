AmCharts.themes.none = {};
var sensors = {};
var notifications = {};
var arrivalOrder = [];

// load map and sensor locations
function LoadMap(placeholder, sensors) {
	var sensorsArray = [];
	// adjust sensors latitude
	var keys = Object.keys(sensors);
	for (var i = 0; i < keys.length; i++) {
		var sensor = sensors[keys[i]];
		sensor.latitude -= 4;
		sensor.labelShiftY = 10;
		sensor.title = sensor.label;
		sensor.id = keys[i];
		sensorsArray.push(sensor);
	}
	var map = AmCharts.makeChart(placeholder, {
		type: "map",
		"theme": "none",
		"projection": "miller",
		dataProvider: {
			map: "romaniaHigh",
			areas: [{"id": "RO-CJ"}],
			images: sensorsArray
		},
		imagesSettings: {
			selectedColor: "#089282",
			color: "#000",
			labelRollOverColor: "#000",
			labelPosition: "bottom"
		},
		areasSettings: {
			unlistedAreasColor: "#15A892",
			autoZoom: false
		}
	});
	return map
}

// this function will take current images on the map and create HTML elements for them
function updateCustomMarkers(event) {
	// get map object
	var map = event.chart;
	// go through all of the images
	for (var x in map.dataProvider.images) {
		// get MapImage object
		var image = map.dataProvider.images[x];
		// check if it has corresponding HTML element
		if ('undefined' == typeof image.externalElement) {
			image.externalElement = createCustomMarker(image);
		}

		// reposition the element accoridng to coordinates
		var xy = map.coordinatesToStageXY(image.longitude, image.latitude);
		image.externalElement.style.top = xy.y + 'px';
		image.externalElement.style.left = xy.x + 'px';
	}
}

// this function creates and returns a new marker element
function createCustomMarker(image) {
	// create holder
	var holder = document.createElement('div');
	holder.className = 'map-marker' + ' ' + (image.class || "");
	holder.title = image.title;
	holder.style.position = 'absolute';

	// maybe add a link to it?
	if (undefined != image.url) {
		holder.onclick = function () {
			window.location.href = image.url;
		};
		holder.className += ' map-clickable';
	}

	// create dot
	var dot = document.createElement('div');
	dot.className = 'dot';
	holder.appendChild(dot);

	if (!image.class) {
		// create pulse
		var pulse = document.createElement('div');
		pulse.className = 'pulse';
		pulse.id = image.id;
		holder.appendChild(pulse);
	}

	// append the marker to the map container
	image.chart.chartDiv.appendChild(holder);

	return holder;
}

$(document).ready(function () {
	var ctrlDown = false;
	$(window).on("keydown", function(evt) {
		if (evt.ctrlKey) {
			ctrlDown = true
		}
	}).on("keyup", function(evt) {
		if (!evt.ctrlKey) {
			ctrlDown = false
		}
	});
	var div = document.getElementById("chartdiv");
	$.get("/getSensors", function (sensors) {
		window['sensors'] = sensors;
		var map = LoadMap("chartdiv", sensors);
		updateCustomMarkers({chart:map});

		//map.chartDiv = div;
		// add events to recalculate map position when the map is moved or zoomed
		map.addListener("positionChanged", updateCustomMarkers);
		map.addListener("click", function(event) {
			if (ctrlDown) {
				var intensity = ($("input", "#intensity").val() || 0);
				if (!intensity) {
					$("input", "#intensity").css("background", "#FFdddd").focus();
					return
				} else {
					$("input", "#intensity").css("background", "white");
				}
				$(".pulse").css("background", "#716f42");
				notifications = {};
				arrivalOrder = [];
				// find out the coordinates of under mouse cursor
				var info = event.chart.getDevInfo();

				// image-explosion
				var keys = Object.keys(map.dataProvider.images);
				var found = false;
				for (var i = 0; i < keys.length; i++) {
					var sensor = map.dataProvider.images[keys[i]];
					delete(sensor.externalElement);
					if (sensor.label == "explosion") {
						sensor.latitude = info.latitude;
						sensor.longitude = info.longitude;
						found = true;
					}
				}
				if (!found) {
					var image = new AmCharts.MapImage();
					image.latitude = info.latitude;
					image.longitude = info.longitude;
					image.type = "circle";
					image.alpha = 0.5;
					image.id = "image-explosion";
					image.class = "image-explosion";
					image.label = "explosion";
					image.title = "explosion";
					map.dataProvider.images.push(image);
				}

				var z = map.zoomLevel();
				map.validateData();
				map.zoomToLongLat(z, info.longitude, info.latitude, true);
				socket.emit('trigger', {
					lat: (info.latitude + 4).toString(),
					long: info.longitude.toString(),
					intensity: +($("input", "#intensity").val() || 0)
				});
				log("Setting new explosion at -> Lat: "+info.latitude.toString() + " Long: " + info.longitude.toString())
			}
		});
	});

	var socket = io.connect('http://localhost:5000/socket');
	socket.on('notification', function(msg) {
		if (msg.explosion) {
			var parts = msg.explosion.split(" ");
			var sensorNr = parts[0];
			var intensity = +(parts[1]);
			if (notifications[sensorNr] || intensity > +($("input", "#intensity").val() || 0) || intensity < 0) {
				return
			}
			var time = new Date();
			notifications[sensorNr] = {intensity:intensity, time:time.getTime() / 1000, sensor:sensors[sensorNr]};
			$("#" + sensorNr).css("background", 'red');
			log("Sensor " + sensors[sensorNr].label + ' -> explosion intensity ' + intensity);
			arrivalOrder.push(notifications[sensorNr]);
			determineLocation();
		}
	});
	socket.on('connect', function() {
		socket.emit('my event', {data: 'I\'m connected!'});
		log("Connected")
	});
	socket.on('disconnect', function() {
		log('Disconnected');
	});
});


function determineLocation() {
	console.log(arrivalOrder);
	var len = arrivalOrder.length;
	if (len <= 1) {
		return
	}
	var s2 = arrivalOrder[len - 1];
	var speed = 340.29;

	for (var i = 0; i < len - 1; i++) {
		var s1 = arrivalOrder[i];
		var distance = measure(s1.sensor.latitude, s1.sensor.longitude, s2.sensor.latitude, s2.sensor.longitude)
		console.log(s2.sensor.label, s1.sensor.label, (s2.time - s1.time) * speed, distance)
	}

}

function log(arguments) {
	$("#log").append('<div>' + (new Date()).toISOString() + ": " + arguments + "</div>")
}

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
	var R = 6378.137; // Radius of earth in KM
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;

	var l1 = lat1 * Math.PI / 180;
	var l2 = lat2 * Math.PI / 180;
	var a1 = Math.sin(dLat/2) * Math.sin(dLat/2);
	var a2 = Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(l1) * Math.cos(l2);
	var a = a1 + a2;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return R * c;
}