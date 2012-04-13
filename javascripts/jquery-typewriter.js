$.fn.typewriter = function(speed) {
    this.each(function() {
        var $ele = $(this), str = $ele.text(), progress = 0;
        $ele.text('');
        var timer = setInterval(function() {
            $ele.text(str.substring(0, ++progress) + (progress < str.length? '_' : ''));
            if (progress >= str.length) clearInterval(timer);
        }, (speed || 50));
    });
    return this;
};