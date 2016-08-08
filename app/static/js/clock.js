$(function() {
  var clock = $('.clock');

  var digits = {
    hours: {},
    minutes: {},
    seconds: {}
  };

  for (var key in digits) {
    digits[key] = {
      tens: $('div.' + key + '-tens'),
      ones: $('div.' + key + '-ones')
    }
  }

  function animate(){
    window.requestAnimationFrame(animate);
    var now = new Date();
    var time = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds()
    }

    for (var key in time) {
      digits[key].tens.attr('data-digit', Math.floor(time[key] / 10));
      digits[key].ones.attr('data-digit', time[key] % 10);
    }
  };

  animate();
});
