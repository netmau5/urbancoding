//@codekit-prepend "jquery-1.7.2.js", "bootstrap.js", "underscore.js";

//initialize portfolio
(function(){
  
  var portfolio = [
    { title: "Sparkmuse", smallImage: "images/portfolio-sparkmuse-small.jpg", overview: "sparkmuse.html" }
  ]; 
  
  var controlBar = $('section.portfolio .projects .control-bar'),
      visualsContainer = $('section.portfolio .projects .visuals');
      linkContainer = $('ul', controlBar),
      titleContainer = $('h3', controlBar);
  
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
    selectVisual(parseInt($(this).attr('data-index')));
  });
  linkContainer.css({ marginLeft: -linkContainer.width()/2 });
  
  var currentIndex = 0;
  $('section.portfolio .projects .control-bar a').click(function(){
    currentIndex++;
    if (currentIndex == portfolio.length) { currentIndex = 0 };
    selectVisual(currentIndex);
  });
  
  selectVisual(0);
  
})();

//about us
(function(){
  
  var sections = $('.carousel').carousel({interval: 99999999999999999}).carousel('pause');
  var headerNavLi = $('.about-us header li');
  
  $('a', headerNavLi).click(function() {
    var $this = $(this);
    sections.carousel(parseInt($this.attr('data-index')));
    headerNavLi.removeClass('selected');
    $this.parents('li').addClass('selected');
    return false;
  });
  
})();