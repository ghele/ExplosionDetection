var sensors = {};
var notifications = {};
var arrivalOrder = [];

function inside(point, vs) {
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};
function sensorCircle(x, y, cx, cy, r) {
    var dx = x-cx;
    var dy = y-cy;
    return dx*dx+dy*dy <= r*r;
}
function fadeIn() {
    setTimeout( function() {
        $('.fa.fa-circle-thin, .fa.fa-exclamation').animate({
                opacity: 1
            }, 3000, 'linear', function() {
        });
    }, 9000 );
}
function fadeOut() {
    $('.fa.fa-circle-thin, .fa.fa-exclamation').animate({
            opacity: 0.2
        }, 1000, 'linear', function() {
    });
}
function notification(message) {
    setTimeout( function() {
        // create the notification
        var notification = new NotificationFx({
            message : message,
            layout : 'growl',
            effect : 'slide',
            type : 'notice', // notice, warning or error
        });
        // show the notification
        notification.show();
    }, 1500 );
}
$(document).ready(function () {
	var ctrlDown = false;
	$(window).on("keydown", function(evt) {
		if (evt.ctrlKey) {
			ctrlDown = true;
		}
	}).on("keyup", function(evt) {
		if (!evt.ctrlKey) {
			ctrlDown = false;
		}
	});
    var screw = [ { position: "-top-left", top: 20, left: 20, degrees: "140deg)" },
                  { position: "-top-right", top: 20, left: 320, degrees: "70deg)" },
                  { position: "-bottom-left", top: 240, left: 20, degrees: "120deg)"},
                  { position: "-bottom-right", top: 240, left: 320, degrees: "110deg)"} ];
    for(var k = 0; k < screw.length; k++) {
        $(".left-container").append($("<div class='screw"+screw[k]['position']+"'><div class='indent"+screw[k]['position']+"'></div></div>"));
        $(".screw"+screw[k]['position']+"").css({   "position": "absolute",
                                     "top": screw[k]["top"]+"px",
                                     "left": screw[k]["left"]+"px",
                                     "width": "30px",
                                     "height": "30px",
                                     "border-radius": "50px",
                                     "background": "#adadad", /* Old browsers */
                                     "background": "linear-gradient(135deg, #adadad 0%,#e1e1e1 51%,#dddddd 68%,#f6f6f6 100%)", /* W3C */
                                     "box-shadow": "0px 2px 4px #000, -1px -1px 5px rgba(0,0,0,0.2)",
                                     "border": "1px solid rgba(255,255,255,0.1)"
        });
        $(".indent"+screw[k]['position']+"").css({ "transform": "rotate("+screw[k]["degrees"],
                            "height": "10px",
                            "width": "33px",
                            "margin-top": "10px",
                            "box-shadow": "inset 0px 1px 8px #222",
                            "border-radius": "2px",
                            "margin-left": "-2px",
                            "border-bottom": "1px solid rgba(255,255,255,0.3)" });
    }
    function drawCircle(sensorName, x, y, color, strokeColor, textColor) {
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI, true);
        context.fillStyle = color;
        context.fill();
        context.fillStyle = textColor;
        context.fillText(sensorName.replace("s", "Sensor "), x + 10, y - 5, 40);
        context.lineWidth = 2;
        context.strokeStyle = strokeColor;
        context.stroke();
    }
    function drawSensorCircle(x, y, color){
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2, true);
        context.globalAlpha = 0.5
        context.closePath();
        context.fill();
    }
    function clearCircle(x, y, radius) {
        context.save();
        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fill();
        context.restore();
    };
    function drawMap() {
        var poly = [672.578125, 31, 678.578125, 33, 682.578125,42, 691.578125, 43, 703.578125, 45, 714.578125, 45, 724.578125, 49, 724.578125, 60,724.578125, 72, 717.578125, 79, 707.578125, 78, 699.578125, 74, 692.578125, 83, 690.578125, 92, 690.578125, 97, 686.578125, 104, 683.578125, 111, 688.578125, 120, 693.578125, 125, 693.578125, 137, 698.578125, 150, 701.578125, 157, 715.578125, 160, 723.578125, 161, 731.578125, 168, 730.578125, 176, 726.578125, 179.0, 731.578125, 181.0, 737.578125, 184.0, 742.578125, 187.0, 746.578125, 190.0, 750.578125, 198.0, 750.578125, 202.0, 755.578125, 202.0, 759.578125, 201.0, 763.578125, 199.0, 765.578125, 198.0, 765.578125, 201.0, 765.578125, 207.0, 762.578125, 209.0, 758.578125, 212.0, 762.578125, 216.0, 767.578125, 219.0, 769.578125, 224.0, 769.578125, 230.0, 761.578125, 230.0, 762.578125, 235.0, 763.578125, 241.0, 763.578125, 246.0, 763.578125, 251.0, 758.578125, 255.0, 755.578125, 261.0, 753.578125, 270.0, 753.578125, 279.0, 759.578125, 281.0, 762.578125, 284.0, 768.578125, 286.0, 776.578125, 286.0, 784.578125, 286.0, 787.578125, 286.0, 789.578125, 290.0, 793.578125, 291.0, 793.578125, 300.0, 793.578125, 303.0, 794.578125, 307.0, 800.578125, 312.0, 803.578125, 316.0, 805.578125, 324.0, 805.578125, 331.0, 799.578125, 332.0, 799.578125, 340.0, 801.578125, 348.0, 801.578125, 353.0, 794.578125, 358.0, 791.578125, 365.0, 790.578125, 365.0, 790.578125, 371.0, 786.578125, 376.0, 786.578125, 383.0, 786.578125, 387.0, 783.578125, 391.0, 775.578125, 391.0, 769.578125, 391.0, 764.578125, 394.0, 760.578125, 397.0, 760.578125, 405.0, 760.578125, 410.0, 752.578125, 410.0, 748.578125, 415.0, 743.578125, 412.0, 742.578125, 412.0, 742.578125, 415.0, 750.578125, 419.0, 748.578125, 424.0, 748.578125, 430.0, 753.578125, 433.0, 758.578125, 436.0, 758.578125, 446.0, 756.578125, 452.0, 751.578125, 454.0, 745.578125, 457.0, 741.578125, 461.0, 736.578125, 465.0, 731.578125, 468.0, 727.578125, 472.0, 723.578125, 475.0, 720.578125, 478.0, 717.578125, 481.0, 717.578125, 483.0, 722.578125, 485.0, 726.578125, 493.0, 733.578125, 497.0, 735.578125, 502.0, 736.578125, 507.0, 736.578125, 513.0, 733.578125, 513.0, 730.578125, 518.0, 730.578125, 518.0, 730.578125, 526.0, 730.578125, 532.0, 720.578125, 535.0, 713.578125, 535.0, 710.578125, 535.0, 708.578125, 535.0, 703.578125, 536.0, 702.578125, 540.0, 700.578125, 544.0, 698.578125, 548.0, 703.578125, 552.0, 706.578125, 556.0, 706.578125, 563.0, 706.578125, 569.0, 706.578125, 576.0, 706.578125, 586.0, 703.578125, 590.0, 697.578125, 594.0, 692.578125, 594.0, 688.578125, 588.0, 685.578125, 586.0, 681.578125, 586.0, 678.578125, 583.0, 668.578125, 583.0, 664.578125, 585.0, 661.578125, 590.0, 658.578125, 589.0, 652.578125, 586.0, 647.578125, 583.0, 647.578125, 579.0, 640.578125, 579.0, 636.578125, 575.0, 631.578125, 573.0, 624.578125, 569.0, 618.578125, 569.0, 613.578125, 569.0, 608.578125, 572.0, 603.578125, 577.0, 596.578125, 575.0, 589.578125, 573.0, 583.578125, 573.0, 581.578125, 581.0, 578.578125, 587.0, 571.578125, 584.0, 571.578125, 589.0, 568.578125, 601.0, 559.578125, 600.0, 554.578125, 600.0, 547.578125, 599.0, 541.578125, 596.0, 535.578125, 593.0, 527.578125, 588.0, 529.578125, 579.0, 531.578125, 576.0, 533.578125, 573.0, 535.578125, 567.0, 535.578125, 561.0, 531.578125, 559.0, 524.578125, 559.0, 516.578125, 558.0, 511.578125, 558.0, 506.578125, 562.0, 502.578125, 562.0, 494.578125, 561.0,490.578125, 556.0, 487.578125, 553.0, 479.578125, 552.0, 476.578125, 541.0, 471.578125, 541.0, 466.578125, 540.0, 463.578125, 536.0, 462.578125, 531.0, 453.578125, 531.0, 445.578125, 532.0, 439.578125, 531.0, 434.578125, 530.0, 429.578125, 528.0, 425.578125, 530.0, 418.578125, 533.0, 411.578125, 535.0, 404.578125, 537.0, 401.578125, 539.0, 397.578125, 541.0, 396.578125, 548.0, 393.578125, 555.0, 379.578125, 557.0, 373.578125, 555.0, 362.578125, 549.0, 361.578125, 544.0, 357.578125, 544.0, 348.578125, 541.0, 342.578125, 548.0, 334.578125, 550.0, 330.578125, 551.0, 327.578125, 563.0, 319.578125, 561.0, 310.578125, 558.0, 303.578125, 558.0, 299.578125, 548.0, 298.578125, 544.0, 293.578125, 546.0, 290.578125, 546.0, 286.578125, 542.0, 285.578125, 536.0, 284.578125, 531.0, 278.578125, 525.0, 278.578125, 517.0, 273.578125, 517.0, 267.578125, 516.0, 260.578125, 516.0, 253.578125, 525.0, 247.578125, 525.0, 241.578125, 525.0, 233.578125, 523.0, 230.578125, 518.0, 226.578125, 517.0, 220.578125, 514.0, 216.578125, 510.0, 211.578125, 510.0, 208.578125, 506.0, 207.578125, 496.0, 206.578125, 489.0, 211.578125, 483.0, 217.578125, 479.0, 212.578125, 478.0, 208.578125, 476.0, 202.578125, 470.0, 202.578125, 464.0, 207.578125, 461.0, 201.578125, 459.0, 194.578125, 459.0, 190.578125, 457.0, 190.578125, 452.0, 185.578125, 445.0, 183.578125, 440.0, 179.578125, 434.0, 178.578125, 427.0, 176.578125, 424.0, 174.578125, 420.0, 170.578125, 414.0, 168.578125, 407.0, 165.578125, 403.0, 162.578125, 398.0, 157.578125, 392.0, 151.578125, 391.0, 148.578125, 386.0, 146.578125, 379.0, 144.578125, 378.0, 145.578125, 372.0, 145.578125, 371.0, 144.578125, 365.0, 143.578125, 359.0, 143.578125, 358.0, 149.578125, 355.0, 156.578125, 355.0, 160.578125, 355.0, 168.578125, 351.0, 173.578125, 344.0, 178.578125, 340.0, 178.578125, 329.0, 180.578125, 323.0, 184.578125, 319.0, 191.578125, 319.0, 191.578125, 315.0, 192.578125, 311.0, 193.578125, 307.0, 185.578125, 305.0, 181.578125, 302.0, 176.578125, 290.0, 168.578125, 288.0, 158.578125, 284.0, 155.578125, 275.0, 155.578125, 264.0, 158.578125, 254.0, 163.578125, 252.0, 167.578125, 242.0, 172.578125, 239.0, 178.578125, 238.0, 187.578125, 237.0, 194.578125, 237.0, 195.578125, 246.0, 204.578125, 254.0, 211.578125, 254.0, 220.578125, 254.0, 230.578125, 250.0, 242.578125, 250.0, 249.578125, 251.0, 252.578125, 262.0, 256.578125, 274.0, 251.578125, 284.0, 251.578125, 292.0, 257.578125, 293.0, 264.578125, 297.0, 275.578125, 302.0, 287.578125, 302.0, 294.578125, 303.0, 300.578125, 306.0, 306.578125, 305.0, 313.578125, 300.0, 322.578125, 308.0, 323.578125, 321.0, 331.578125, 324.0, 338.578125, 328.0, 347.578125, 317.0, 357.578125, 314.0, 367.578125, 310.0, 372.578125, 310.0, 379.578125, 297.0, 388.578125, 292.0, 390.578125, 288.0, 390.578125, 270.0, 397.578125, 269.0, 404.578125, 274.0, 411.578125, 270.0, 412.578125, 275.0, 416.578125, 280.0, 416.578125, 287.0, 417.578125, 293.0, 422.578125, 293.0, 425.578125, 293.0, 430.578125, 291.0, 433.578125, 289.0, 437.578125, 286.0, 441.578125, 282.0, 445.578125, 277.0, 445.578125, 260.0, 451.578125, 259.0, 456.578125, 256.0, 456.578125, 249.0, 459.578125, 247.0, 463.578125, 247.0, 468.578125, 246.0, 475.578125, 246.0, 481.578125, 245.0, 483.578125, 239.0, 485.578125, 236.0, 490.578125, 233.0, 496.578125, 232.0, 500.578125, 226.0, 501.578125, 213.0, 501.578125, 211.0, 494.578125, 210.0, 492.578125, 205.0, 487.578125, 202.0, 487.578125, 197.0, 487.578125, 192.0, 494.578125, 189.0, 494.578125, 183.0, 494.578125, 180.0, 492.578125, 177.0, 492.578125, 173.0, 493.578125, 171.0, 496.578125, 164.0, 496.578125, 159.0, 500.578125, 158.0, 505.578125, 158.0, 510.578125, 154.0, 518.578125, 152.0, 526.578125, 152.0, 552.578125, 155.0, 562.578125, 146.0, 569.578125, 142.0, 573.578125, 132.0, 573.578125, 120.0, 575.578125, 116.0, 580.578125, 115.0, 587.578125, 112.0, 592.578125, 108.0, 599.578125, 106.0, 606.578125, 106.0, 607.578125, 112.0, 608.578125, 117.0, 611.578125, 118.0, 614.578125, 118.0, 614.578125, 109.0, 612.578125, 104.0, 610.578125, 99.0, 618.578125, 94.0, 622.578125, 98.0, 629.578125, 106.0, 634.578125, 111.0, 642.578125, 109.0, 640.578125, 94.0, 629.578125, 88.0, 625.578125, 82.0, 625.578125, 75.0, 633.578125, 73.0, 640.578125, 65.0, 643.578125, 58.0, 647.578125, 54.0, 645.578125, 46.0, 647.578125, 42.0, 654.578125, 37.0, 659.578125, 34.0, 663.578125, 34.0, 665.578125, 31.0, 667.578125, 30.0];
        context.beginPath();
        context.moveTo(poly[0], poly[1]);
        for(item = 2; item < poly.length - 1; item+=2 ){
            context.lineTo(poly[item], poly[item+1])
        }
        context.strokeStyle = "#7cb4fc";
        context.lineWidth = 4;
        context.closePath();
        context.stroke();
    }
    function getElementByPoint(parent, x, y) {
        if ( x < parent.width() && y < parent.height() ) {
            return document.elementFromPoint( x + parent.offset().left, y + parent.offset().top );
        } else {
            return null;
        }
    }
    function drawCity(cityName, x, y, width, height, xCorrection, yCorrection, color, font) {
        context.beginPath();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.font = font;
        context.fillText(cityName, x + xCorrection, y - yCorrection, 200);
        context.font = "bold 10pt Calibri";
        context.stroke();
        context.closePath();
        $(".child-container").append($('<div class="city-style"></div>').css({
                                                                                "position": "absolute",
                                                                                "left": x+"px",
                                                                                "top": y+"px",
                                                                                "height": width+"px",
                                                                                "width": height+"px",
                                                                                "box-shadow": "0 0 50px #7cb4fc"
                                                                             }));
    }
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");
	$.get("/getSensors", function (sensors) {
		window["sensors"] = sensors;
        drawMap();
        drawCity("CLUJ-NAPOCA", 520, 380, 25, 25, 20, 10, "#7cb4fc", "bold 20pt Calibri");
        drawCity("TURDA", 605, 505, 20, 20, 20, 10, "#7cb4fc", "15pt Calibri");
        drawCity("Campia Turzii", 650, 525, 15, 15, 20, 10, "#7cb4fc", "15pt Calibri");
        drawCity("Gherla", 662, 240, 15, 15, 20, 10, "#7cb4fc", "15pt Calibri");
        drawCity("Dej", 655, 170, 15, 15, -20, 10, "#7cb4fc", "15pt Calibri");
        drawCity("Huedin", 290, 330, 10, 10, 15, -25, "#7cb4fc", "10pt Calibri");
        var keys = Object.keys(sensors)
        for(var i = 0; i < keys.length; i++) {
            drawCircle(keys[i], sensors[keys[i]]["x-axis"], sensors[keys[i]]["y-axis"], "#66cc01", "#1e4d2b", "#66cc01");
            $(".child-container").append($('<div class="sensor_ring"></div>').css({
                                                                            "position": "absolute",
                                                                            "left": sensors[keys[i]]['x-axis']-12,
                                                                            "top": sensors[keys[i]]['y-axis']-12,
                                                                            "border": "3px solid #adff2f",
                                                                            "-webkit-border-radius": "30px",
                                                                            "height": "18px",
                                                                            "width": "18px",
                                                                            "-webkit-animation": "pulsate 1.5s ease-out",
                                                                            "-webkit-animation-iteration-count": "infinite",
                                                                            "opacity": "0.0"
                                                                         }));
        }
        var array = [];
        document.querySelector(".right-container").addEventListener("click", function(event) {
		var parentOffset = $(this).parent().offset();
        var xExplosion = event.clientX - parentOffset.left;
        var yExplosion = event.clientY - parentOffset.top;
        array.push(xExplosion, yExplosion);
        	if (ctrlDown) {
				$("#explosion").remove();
				$("#dot").remove();
                // find out the coordinates of under mouse cursor
                var $canvas = $(event.target);
                var offset = $canvas.offset();
                var xExplosion = event.clientX - offset.left;
                var yExplosion = event.clientY - offset.top;
                var polygon = [ [ 86, 11 ], [ 844, 11 ], [ 844, 619 ], [ 86, 619 ] ];
                var isInside = inside([ xExplosion, yExplosion ], polygon);
				var intensity = ($("input", "#intensity").val() || 0);
				var reg = /^-?\d+\.?\d*$/;
				var isNumber = reg.test(intensity);
                function isSensor() {
                    for(var i = 0; i < keys.length; i++) {
                        if(sensorCircle(xExplosion, yExplosion, sensors[keys[i]]["x-axis"], sensors[keys[i]]["y-axis"], 5) === true) {
                            return sensors[keys[i]];
                        }
                    }
                    return false;
                }
				if (isInside === false) {
					//pulse on click and notification
				    var message = "<p>The explosion was placed outside the supervised area.</p>";
                    var mainDiv = $(".right-container");
                    var div = $('<div id="dot">').css({
                        "left": (xExplosion-12)+"px",
                        "top": (yExplosion-12)+"px"
                    });
                    mainDiv.append(div);
                    fadeOut();
                    notification(message);
                    setTimeout( function() {
                        if ($("body").children().length == 5) {
                            $(".ns-box").css({"background": "#1b1b1b",
                                              "opacity": "0.5"
                            });
                        }
                    }, 1500 );
                    fadeIn();
					return
				}
				if ((!intensity || isNumber === false || intensity < 120) && isInside === true ) {
                    $("input", "#intensity").css("background", "#dd110d").focus();
                    return
                }
                if (isNumber === true && intensity >= 120 && isInside === true && isSensor() !== false ) {
                    $("input", "#intensity").css("background", "#7fff00");
                    clearCircle(isSensor()["x-axis"], isSensor()["y-axis"], 5);
                    drawSensorCircle(isSensor()["x-axis"], isSensor()["y-axis"], "rgba(52, 152, 219,0.5)");
                    var message = "<p>" + isSensor()["label"] + " was damaged. The explosion took place in the area of " + isSensor()["label"] + ".</p>";
                    fadeOut();
                    notification(message);
                    setTimeout( function() {
                        if ($("body").children().length == 5) {
                            $(".ns-box").css({"background": "#ff3333",
                                              "opacity": "0.5"
                            });
                        }
                    }, 1500 );
                    fadeIn();
                    return
                } else {
					$("input", "#intensity").css("background", "#7fff00");
				}
				$(".pulse").css("background", "#716f42");
                var message = "<p>The explosion was placed successfully in the supervised area.</p>";
                fadeOut();
                notification(message);
                setTimeout( function() {
                    if ($("body").children().length == 5) {
                        $(".ns-box").css({"background": "#308014",
                                          "opacity": "0.5"
                        });
                    }
                }, 1500 );
                fadeIn();
				notifications = {};
				arrivalOrder = [];
                var mainDiv = $(".right-container");
                var div = $('<div id="explosion">').css({
                    "left": (xExplosion - 5)+"px",
                    "top": (yExplosion - 5)+"px"
                });
                div.append($('<div class="explosion_ring">'));
                mainDiv.append(div);
				var found = false;
				for (var i = 0; i < keys.length; i++) {
					var sensor = sensors[keys[i]];
                    drawCircle(keys[i], sensor["x-axis"], sensor["y-axis"], "#66cc01", "#1e4d2b", "#66cc01");
				}
				socket.emit('trigger', {
					xAxis: xExplosion.toString(),
					yAxis: yExplosion.toString(),
					intensity: +($("input", "#intensity").val() || 0)
				});
				log("Setting new explosion at -> x position: " + xExplosion.toString() + " y position: " + yExplosion.toString())
			}
		});
	}, false);
	var socket = io.connect('http://localhost:5000/socket');
	socket.on('notification', function(msg) {
		if (msg.explosion) {
			var parts = msg.explosion.split(" ");
			var sensorNr = parts[0];
			var intensity = +(parts[1]);
			if (notifications[sensorNr] || intensity > +($("input", "#intensity").val() || 0) || intensity < 0) {
				return
			}
			var time = moment();
			if(time.minutes().toString().length == 1 && time.seconds().toString().length == 1) {
                var formattedTime = time.format().split("T")[0] + " " + time.hours() + ":0" + time.minutes() + ":0" + time.seconds() + "." + time.milliseconds();
            }
            else if(time.minutes().toString().length == 1) {
                var formattedTime = time.format().split("T")[0] + " " + time.hours() + ":0" + time.minutes() + ":" + time.seconds() + "." + time.milliseconds();
            }
			else if(time.seconds().toString().length == 1) {
			    var formattedTime = time.format().split("T")[0] + " " + time.hours() + ":" + time.minutes() + ":0" + time.seconds() + "." + time.milliseconds();
			} else {
			    var formattedTime = time.format().split("T")[0] + " " + time.hours() + ":" + time.minutes() + ":" + time.seconds() + "." + time.milliseconds();
            }
			notifications[sensorNr] = {intensity:intensity, time:formattedTime, sensor:sensors[sensorNr]};
            if(intensity >= 80) {
                drawCircle(sensorNr, sensors[sensorNr]["x-axis"], sensors[sensorNr]["y-axis"], "white", "#65000b", "#66cc01");
                drawCircle(sensorNr, sensors[sensorNr]["x-axis"], sensors[sensorNr]["y-axis"], "#ff0000", "#65000b", "#66cc01");
                log("Sensor " + sensors[sensorNr].label + " -> explosion intensity " + intensity + " time " + formattedTime);
                arrivalOrder.push(notifications[sensorNr]);
			}
			if(arrivalOrder.length === 4) {
                $("a").html('Press')
                      .addClass("default")
		              .append('<style>.glowBtn:active:after{background-size: 100%; background-image: linear-gradient(#262627, #2d2d2e);box-shadow: inset 0 5px 6px rgba(0, 0, 0, 0.3), inset 0 0 4px rgba(0, 0, 0, 0.9), 0 0 0 black;}</style>');
		        $("#button").click(function() {
                    determineLocation(arrivalOrder[0], arrivalOrder[1], arrivalOrder[2], arrivalOrder[3]);
                });
		    }
		}
	});
	socket.on('connect', function() {
		socket.emit('my event', {data: 'I\'m connected!'});
		log("Connected")
	});
	socket.on('disconnect', function() {
		log("Disconnected");
	});
});
function log(arguments) {
	$("#log").append("<div>" + (new Date()).toISOString() + ": " + arguments + "</div>")
}

function determineLocation(firstSensor, secondSensor, thirdSensor, fourthSensor) {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var cw = canvas.width;
    var ch = canvas.height;

    function clearCircle(x, y, radius)
    {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.restore();
    };
    function reOffset(){
        var BB = canvas.getBoundingClientRect();
        offsetX = BB.left;
        offsetY = BB.top;
    }
    var offsetX,offsetY;
    reOffset();
    window.onscroll=function(e){ reOffset(); }

    var calcRadius = calculateRadius(firstSensor["time"], secondSensor["time"], thirdSensor["time"], fourthSensor["time"]);
    var A={x:firstSensor["sensor"]["x-axis"],y:firstSensor["sensor"]["y-axis"],r: calcRadius["radFirst"], color:"rgba(52, 152, 219,0.5)"};
    var B={x:secondSensor["sensor"]["x-axis"],y:secondSensor["sensor"]["y-axis"],r: calcRadius["radSecond"], color:"rgba(46, 204, 113,0.5)"};
    var C={x:thirdSensor["sensor"]["x-axis"],y:thirdSensor["sensor"]["y-axis"],r: calcRadius["radThird"], color:"rgba(241, 196, 15,0.5)"};

    var intersections=[];
    var AB=circleIntersections(A,B);
    var BC=circleIntersections(B,C);
    var CA=circleIntersections(C,A);

    if(AB){intersections=intersections.concat(AB);}
    if(BC){intersections=intersections.concat(BC);}
    if(CA){intersections=intersections.concat(CA);}

    var triangle=[];
    for(var i = 0; i < intersections.length; i++) {
        var pt=intersections[i];
        if(ptIsInCircle(pt,A) && ptIsInCircle(pt,B) && ptIsInCircle(pt,C)) {
            triangle.push(pt);
        }
    }
    drawMap();
    if(triangle.length == 3){
        ctx.beginPath();
        ctx.moveTo(triangle[0].x, triangle[0].y);
        ctx.lineTo(triangle[1].x, triangle[1].y);
        ctx.lineTo(triangle[2].x, triangle[2].y);
        ctx.closePath();
        ctx.stroke();
    }
    function drawMap(){
        drawCircle(A);
        drawCircle(B);
        drawCircle(C);
    }
    function drawCircle(c){
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(c.x,c.y,c.r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    // intersection points of 2 circles
    function circleIntersections(c0,c1) {
        var x0=c0.x;
        var y0=c0.y;
        var r0=c0.r;
        var x1=c1.x;
        var y1=c1.y;
        var r1=c1.r;
        // calculate circles' proximity
        var dx = x1 - x0;
        var dy = y1 - y0;
        var d = Math.sqrt((dy*dy) + (dx*dx));
        // return if circles do not intersect.
        if (d > (r0 + r1)) { return; }
        // return if one circle is contained in the other
        if (d < Math.abs(r0 - r1)) { return; }
        // calculate the 2 intersection points
        var a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;
        var x2 = x0 + (dx * a/d);
        var y2 = y0 + (dy * a/d);
        var h = Math.sqrt((r0*r0) - (a*a));
        var rx = -dy * (h/d);
        var ry = dx * (h/d);
        var xi = x2 + rx;
        var xi_prime = x2 - rx;
        var yi = y2 + ry;
        var yi_prime = y2 - ry;
      return([ {x:xi,y:yi}, {x:xi_prime,y:yi_prime} ]);
    }
    function ptIsInCircle(pt,circle){
        var dx=pt.x-circle.x;
        var dy=pt.y-circle.y;
        var r=circle.r+1; // allow circle 1px expansion for rounding
        return(dx*dx+dy*dy<=r*r);
    }
}

function calculateRadius(firstSensorTime, secondSensorTime, thirdSensorTime, fourthSensorTime) {
    var radFirst = 0;
    var radSecond = 0;
    var radThird = 0;
    var side = 140;
    var diagonal = 140 * Math.sqrt(2);

    var first = moment(firstSensorTime);
    var second = moment(secondSensorTime);
    var third = moment(thirdSensorTime);
    var fourth = moment(fourthSensorTime);

    if( moment.duration(third.diff(second)).asMilliseconds() <= 1500 &&
        moment.duration(third.diff(fourth)).asMilliseconds() <= 1500 &&
        moment.duration(fourth.diff(first)).asMilliseconds() <= 3000 &&
        moment.duration(third.diff(first)).asMilliseconds() <= 1500 && moment.duration(second.diff(first)).asMilliseconds() <= 1500) {
        radFirst = (diagonal / 2) + 15;
        radSecond = (diagonal / 2) + 15;
        radThird = (diagonal / 2) + 15;
    }
    else if (moment.duration(second.diff(first)).asMilliseconds() > 1500 && moment.duration(third.diff(first)).asMilliseconds() > 1500 &&
    moment.duration(third.diff(second)).asMilliseconds() <= 1500 ) {

        if( moment.duration(second.diff(first)).asMilliseconds() > 1500 && moment.duration(third.diff(first)).asMilliseconds() > 1500 &&
            moment.duration(second.diff(first)).asMilliseconds() <= 3000 && moment.duration(third.diff(first)).asMilliseconds() <= 3000 ) {
                 radFirst = (diagonal / 2) - 10;
                 radSecond = (diagonal / 2) + 20;
                 radThird = (diagonal / 2) + 20;
        }
        else if( moment.duration(second.diff(first)).asMilliseconds() > 3000 && moment.duration(third.diff(first)).asMilliseconds() > 3000 &&
                 moment.duration(second.diff(first)).asMilliseconds() <= 6000 && moment.duration(third.diff(first)).asMilliseconds() <= 6000) {
                 radFirst = diagonal / 4;
                 radSecond = (diagonal / 2) + 40;
                 radThird = (diagonal / 2) + 40;
        }
        else {
                 radFirst = diagonal / 6;
                 radSecond = (diagonal / 2) + 50;
                 radThird = (diagonal / 2) + 50;
        }
    }
    else if (moment.duration(second.diff(first)).asMilliseconds() <= 2000 && moment.duration(fourth.diff(third)).asMilliseconds() <= 2000 ) {

        if( (moment.duration(third.diff(first)).asMilliseconds() >= 4000 || moment.duration(third.diff(second)).asMilliseconds() >= 4000) &&
            (moment.duration(fourth.diff(first)).asMilliseconds() >= 4000 || moment.duration(fourth.diff(second)).asMilliseconds() >= 4000)) {
            radFirst = (side / 2) + 25;
            radSecond = (side / 2) + 25;
            radThird = diagonal - 20;
        }
        else if( (moment.duration(third.diff(first)).asMilliseconds() < 4000 || moment.duration(third.diff(second)).asMilliseconds() < 4000) &&
                 (moment.duration(third.diff(first)).asMilliseconds() >= 3000 || moment.duration(third.diff(second)).asMilliseconds() >= 3000) &&
                 (moment.duration(fourth.diff(first)).asMilliseconds() < 4000 || moment.duration(fourth.diff(second)).asMilliseconds() < 4000) &&
                 (moment.duration(third.diff(first)).asMilliseconds() >= 3000 || moment.duration(third.diff(second)).asMilliseconds() >= 3000) ) {
                 radFirst = (side / 2) + 30;
                 radSecond = (side / 2) + 30;
                 radThird = diagonal - 50;
        }
        else {
            radFirst = (side / 2) + 35;
            radSecond = (side / 2) + 35;
            radThird = diagonal - 60;
        }
    }
    else {
           radFirst = (side / 2) - 10;
           radSecond = (side / 2) + 50;
           radThird = side + 10;
    }
    return { "radFirst": radFirst, "radSecond": radSecond, "radThird": radThird};
}
