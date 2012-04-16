//@codekit-prepend "jquery-1.7.2.js", "bootstrap.js", "underscore.js", "jquery-scrollto.js", "jquery-scrollspy.js", "jquery-typewriter.js";

$(function(){
  
  function expandToWindowHeight(selector, max, modifier) {
    var node = $(selector),
        windowHeight = $(window).height(),
        outerHeight = node.outerHeight(true),
        newTotal = node.height() + windowHeight - outerHeight + (modifier || 0);
        
    if (!node.data('min-height')) {
      node.data('min-height', node.height());
    }
    
    //alert(node.height() + " + " + windowHeight + " - " + outerHeight + " + " + (modifier||0) + " = " + newTotal)
    if (outerHeight < windowHeight && newTotal >= node.data('min-height')) {
      node.height(newTotal > max ? max : newTotal);
    } else {
      var min = node.data('min-height');
      node.height(newTotal > min ? newTotal : min);
    }
  }
  
  //home area
  function expandHome() {
    var header = $('header.primary'),
        accountForHeader = header.css('position') !== 'fixed';
    expandToWindowHeight('section.home', 860, accountForHeader ? -header.outerHeight(true) + 1: 0);
  }
  
  var interval = 0, 
      speed = 50
      pitch = $('.elevator-pitch span');
  pitch.each(function(){
    var $this = $(this);
    setTimeout(function(){
      $this.show().typewriter(speed);
    }, interval);
    interval += ($this.text().length + 5) * speed;
  });
  
  pitch.show();
  expandHome();
  $(window).on('resize', _(expandHome).debounce(300));
  pitch.hide();
  
  var cloudCount = 1,
      homeSection = $('section.home'),
      rate = 120000,
      rateModifier = -10;
      
  function moveCloud(currentPosition) {
    var $this = $(this),
        windowWidth = $(window).width(),
        cloudWidth = $this.width(),
        currentPosition = currentPosition || -cloudWidth,
        travelDistance = windowWidth + cloudWidth,
        startPoint = -cloudWidth,
        endPoint = windowWidth,
        distanceToEnd = endPoint - currentPosition,
        adjustment = 1 - 0.15 * $this.data('depth'),
        duration = adjustment * rate * (endPoint - currentPosition) / travelDistance;
    
    $this.css({ left: currentPosition + 'px' })
        .animate({ left: '+=' + distanceToEnd }, duration, 'linear', moveCloud)
        .dequeue();
  }
      
  setTimeout(function(){
    _([1,2,3,4]).each(function(i){
      var cloud = $('<div/>').addClass('cloud cloud-' + i).data('depth', i).appendTo(homeSection),
          currentPosition = Math.random() * $(window).width();
    
      moveCloud.call(cloud.hide().fadeIn(5000), currentPosition);
    })
  }, interval);
  
  //services
  var header = $('header.primary'),
      accountForHeader = header.css('position') !== 'fixed';
  $('section.services .major').each(function(){
    var $this = $(this);
    $this.css({ opacity: 0.25 }).scrollspy({
      min: $('section.home').outerHeight() + $('section.home').offset().top - $(window).height() + 300 + (accountForHeader ? -header.outerHeight(true) + 1: 0),
      max: 25000,
      onEnter: _.debounce(function(element, position) {
        $this.animate({ opacity: 1 }, 1200);
      }, 50)
    });
  });

  // portfolio
  var portfolio = [
    { title: "Selected Logos", smallImage: "images/portfolio-logos-small.jpg", overview: "sparkmuse.html" },
    { title: "Urban Coding v2", smallImage: "images/portfolio-ucv2-small.jpg", overview: "sparkmuse.html" },
    { title: "Jenx", smallImage: "images/portfolio-jenx-small.jpg", overview: "sparkmuse.html" },
    { title: "Sparkmuse", smallImage: "images/portfolio-sparkmuse-small.jpg", overview: "sparkmuse.html" },
    { title: "Princeton Public Library", smallImage: "images/portfolio-princeton-small.jpg", overview: "sparkmuse.html" },
    { title: "DBlog Posterous Theme", smallImage: "images/portfolio-dblog-small.jpg", overview: "sparkmuse.html" },
    { title: "The Spark Foundry", smallImage: "images/portfolio-thesparkfoundry-small.jpg", overview: "sparkmuse.html" },
    { title: "Miami Beach", smallImage: "images/portfolio-miamibeach-small.jpg", overview: "sparkmuse.html" },
    { title: "Christmas Planner", smallImage: "images/portfolio-christmasplanner-small.jpg", overview: "sparkmuse.html" },
    { title: "News Falcon", smallImage: "images/portfolio-newsfalcon-small.jpg", overview: "sparkmuse.html" }
  ]; 
  
  var controlBar = $('section.portfolio .projects .control-bar'),
      visualsContainer = $('section.portfolio .projects .visuals');
      linkContainer = $('ul', controlBar),
      titleContainer = $('h3', controlBar),
      currentIndex = 0;
  
  function selectVisual(index){
    var piece = portfolio[index];
    
    $($('li', linkContainer).removeClass('selected')[index]).addClass('selected');
    
    titleContainer.html(piece.title);
    
    $('.visual', visualsContainer).fadeOut(200, function(){
      $(this).remove();
    });
    
    $("<div class='visual'></div>").hide()
        .append($('<img/>').attr('src', piece.smallImage))
        .appendTo(visualsContainer).fadeIn(300);
  }
  
  function openVisual(index) {
     
  }
  
  _.each(portfolio, function(item, i){
    $('<li/>').attr('data-index', i).appendTo(linkContainer);
  });
  $('li', linkContainer).click(function(){
    currentIndex = parseInt($(this).attr('data-index'));
    selectVisual(currentIndex);
    return false;
  });
  linkContainer.css({ marginLeft: -linkContainer.width()/2 });
  
  $('section.portfolio .projects .control-bar a').click(function(){
    currentIndex++;
    if (currentIndex == portfolio.length) { currentIndex = 0 };
    selectVisual(currentIndex);
    return false;
  });
  
  selectVisual(0);
  
  
  //about us
  var sections = $('.carousel').carousel({interval: 99999999999999999}).carousel('pause');
  var headerNavLi = $('.about-us header li');
  
  $('a', headerNavLi).click(function() {
    var $this = $(this);
    sections.carousel(parseInt($this.attr('data-index')));
    headerNavLi.removeClass('selected');
    $this.parents('li').addClass('selected');
    return false;
  });
  
  //contact us
  $(".contact input, .contact textarea")
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
  });
  
  function expandContact() {
    expandToWindowHeight('section.contact', 9999, -$('header.primary').outerHeight(true));
  }
  expandContact();
  $(window).on('resize', _(expandContact).debounce(300));
  
  //navigation
  $('header.primary h1').click(function(){
    $.smoothScroll({speed: 500, scrollTarget: document.body });
  })
  
  var header = $('header.primary');
  function bindNavScrolling() {
    $('header.primary nav li a').smoothScroll( { speed: 500, offset: header.css('position') === 'fixed' ? -header.outerHeight() : 0 } );
  }
  bindNavScrolling();
  $(window).on('resize', _.debounce(bindNavScrolling, 500));
  
});