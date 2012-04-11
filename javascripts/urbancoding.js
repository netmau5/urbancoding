//@codekit-prepend "jquery-1.7.2.js", "bootstrap.js", "underscore.js";

//initialize portfolio
(function(){
  
  var portfolio = [
    { title: "Selected Logos", smallImage: "images/portfolio-logos-small.jpg", overview: "sparkmuse.html" },
    { title: "Jenx", smallImage: "images/portfolio-jenx-small.jpg", overview: "sparkmuse.html" },
    { title: "Sparkmuse", smallImage: "images/portfolio-sparkmuse-small.jpg", overview: "sparkmuse.html" },
    { title: "Princeton Public Library", smallImage: "images/portfolio-princeton-small.jpg", overview: "sparkmuse.html" },
    { title: "The Spark Foundry", smallImage: "images/portfolio-thesparkfoundry-small.jpg", overview: "sparkmuse.html" },
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