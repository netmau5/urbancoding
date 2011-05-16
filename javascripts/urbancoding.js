/* jQuery color https://github.com/jquery/jquery-color */
(function(d){d.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"],function(f,e){d.fx.step[e]=function(g){if(!g.colorInit){g.start=c(g.elem,e);g.end=b(g.end);g.colorInit=true}g.elem.style[e]="rgb("+[Math.max(Math.min(parseInt((g.pos*(g.end[0]-g.start[0]))+g.start[0]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[1]-g.start[1]))+g.start[1]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[2]-g.start[2]))+g.start[2]),255),0)].join(",")+")"}});function b(f){var e;if(f&&f.constructor==Array&&f.length==3){return f}if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}if(e=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)){return[parseFloat(e[1])*2.55,parseFloat(e[2])*2.55,parseFloat(e[3])*2.55]}if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}if(e=/rgba\(0, 0, 0, 0\)/.exec(f)){return a.transparent}return a[d.trim(f).toLowerCase()]}function c(g,e){var f;do{f=d.curCSS(g,e);if(f!=""&&f!="transparent"||d.nodeName(g,"body")){break}e="backgroundColor"}while(g=g.parentNode);return b(f)}var a={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]}})(jQuery);

$(document).ready(function(){
  
  var winHeight = $(window).height();
  
  $("section:not(#home)").each(function(){
    var $$ = $(this),
        outerHeight = $$.outerHeight();
    if (outerHeight < winHeight) {
      $$.height(winHeight - (outerHeight - $$.height()));
    }
  });
  
  $("section#home").each(function(){
    var $$ = $(this),
        outerHeight = $$.outerHeight(),
        servicesHeight = $('.services').outerHeight();
    if (outerHeight < (winHeight - servicesHeight)) {
      $$.height(winHeight - servicesHeight - (outerHeight - $$.height()));
    }
  });
  
  var highlight = $(".nav-highlight"),
      currentTarget = window.location.toString().substr(window.location.toString().indexOf("#") + 1),
      currentTargetTab = $("." + currentTarget + " a"),
      currentTab = currentTargetTab.size() > 0 ? currentTargetTab : $('li.home a');
      
  highlight.css({ 
    left: currentTab.offset().left,
    width: currentTab.outerWidth()
  });
  
  var highlightTab = function(e, click) {
    var $$ = $(this);
    highlight.stop()
      .animate({
        left: $$.offset().left,
        width: $$.outerWidth()
      }, 'fast');
  };
  $(".nav li a").mouseenter(highlightTab);
  
  var scrollToTab = function(){
    var section = $($(this).attr('href'));
    $(document.body).animate({
      scrollTop: section.offset().top
    });
  };
  $(".nav li a").click(scrollToTab);
  
  var s1 = { menu: ".home a", offset: $("#home").offset().top, color: '#53777A' },
      s2 = { menu: ".team a", offset: $("#team").offset().top, color: '#ECD078' },
      s3 = { menu: ".blog a", offset: $("#blog").offset().top, color: '#C02942' },
      s4 = { menu: ".contact a", offset: $("#contact").offset().top, color: '#542437' };
  var current = s1;
  $(window).bind('scroll', function(e){
    var windowTop = $(window).scrollTop(),
        to = null;
    if (windowTop >= s1.offset - 1) {
      to = s1;
    }
    if (windowTop >= s2.offset - 1) {
      to = s2;
    }
    if (windowTop >= s3.offset - 1) {
      to = s3;
    }
    if (windowTop >= s4.offset - 1) {
      to = s4;
    }
    
    if (to && to !== current) {
      current = to;
      var completeColorAnim = function(){
        highlightTab.call($(to.menu)[0], e, true);
      }
      $('.colored-background').stop().animate({ backgroundColor: to.color }, null, null, completeColorAnim);
      $('.colored-border').stop().animate({ borderTopColor: to.color }, null, null, completeColorAnim);
      $('.colored-text').stop().animate({ color: to.color }, null, null, completeColorAnim);
    }
  });
  
  $(".sun").parallax({
    coeff: -0.32
  });
  
});

(function($){
    $.fn.parallax = function(options){
        var $$ = $(this),
            offset = $$.offset(),
            origY = parseInt($$.css('backgroundPositionY')) || 0;
        
        var defaults = {
            "start": 0,
            "stop": offset.top + $$.height(),
            "coeff": 0.95
        };
        var opts = $.extend(defaults, options);
        return this.each(function(){
            $(window).bind('scroll', function() {
                windowTop = $(window).scrollTop();
                if((windowTop >= opts.start) && (windowTop <= opts.stop)) {
                    newCoord = windowTop * opts.coeff;
                    $$.css({
                        "background-position": parseInt($$.css('backgroundPositionX')) + "px "+ (newCoord + origY) + "px"
                    });
                }
            });
        });
    };
})(jQuery);