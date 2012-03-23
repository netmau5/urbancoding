$(document).ready(function(){
  
  //section transition animations
  var winHeight = $(window).height();
 
  var maximize = function() {
    var $$ = $(this),
    	siblings = $$.siblings(),
	siblingHeight = 0;
	
    siblings.map(function(){ return $(this).outerHeight() }).each(function(){ 
        siblingHeight += this;
    });

    if (winHeight > ($$.outerHeight() + siblingHeight)) {
      $$.height(winHeight - ($$.outerHeight() - $$.height()) - siblingHeight);
    }
  }

  $("section#home, section#team, section#contact, section#blog").each(maximize);
  $("section#home").each(function(){
    var $$ = $(this);
    if ($$.outerHeight() < 600) { $$.height(600); }
  });
  
  var highlight = $(".nav-highlight"),
      currentTarget = window.location.toString().substr(window.location.toString().indexOf("#") + 1),
      currentTargetTab = $(".selected a"),
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
  
  var s1 = { menu: ".home a", offset: $("#home").offset(), color: '#53777A' },
      s2 = { menu: ".team a", offset: $("#team").offset(), color: '#ECD078' },
      s3 = { menu: ".blog a", offset: $("#blog").offset(), color: '#C02942' },
      s4 = { menu: ".contact a", offset: $("#contact").offset(), color: '#542437' };
  var current = s1;
//  $(window).bind('scroll', function(e){
//    var windowTop = $(window).scrollTop(),
//        to = null;
//    if (windowTop >= s1.offset - 1) {
//      to = s1;
//    }
//    if (windowTop >= s2.offset - 1) {
//      to = s2;
//    }
//    if (windowTop >= s3.offset - 1) {
//      to = s3;
//    }
//    if (windowTop >= s4.offset - 1) {
//      to = s4;
//    }
//    
//    if (to && to !== current) {
//      current = to;
//      var completeColorAnim = function(){
//        highlightTab.call($(to.menu)[0], e, true);
//      }
//      $('.colored-background').stop().animate({ backgroundColor: to.color }, null, null, completeColorAnim);
//      $('.colored-border').stop().animate({ borderTopColor: to.color }, null, null, completeColorAnim);
//      $('.colored-text').stop().animate({ color: to.color }, null, null, completeColorAnim);
//    }
//  });
  
  //blog - posts
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      formatDate = function(dateStr) {
        var tokens = dateStr.split("/");
        return ["<span class='day'>", tokens[2], "</span><span class='month'>", months[parseInt(tokens[1] - 1)], "</span>"].join("");
      }
  var postTemplate = function(post){
    var toReturn = [
      "<article class='post'>",
        "<h2><a href='", post.full_url, "'>", post.title, "</a></h2>",
        "<h3>", post.user.display_name, "</h3>",
        "<div class='date'>", formatDate(post.display_date.split(" ")[0]), "</div>",
        "{{img}}",
        "<p>", post.body_excerpt, "</p>",
      "</article>"
    ].join('');
    
    toReturn = toReturn.replace("{{img}}", "");
    
    return toReturn;
  }
  $('.page-blog').each(function(){
      $.ajax("http://posterous.com/api/2/sites/urbancoding/posts/public", { 
        dataType: "jsonp", 
        success: function(r){
          $("#post-latest").html(postTemplate(r[0]));
          $("#posts-other").html(postTemplate(r[1]));    
        }
      });
  });
    
    //contact form
    $(".contact-us input, .contact-us textarea")
        .focus(function() { $(this).addClass("selected"); })
        .blur(function() { $(this).removeClass("selected"); })
        
    $(".submit-contact-form").click(function(){
      $.post($(document.ContactForm).attr('action'), $(document.ContactForm).serialize());
      
      var msg = $(document.createElement("div")).html("Thanks for contacting us, we'll be in touch soon!")
                    .css("text-align", "right")
                    .hide();
      
      $(this).parent().append(msg.fadeIn());
      $(this).remove();
      
      return false;
    })
  
});

