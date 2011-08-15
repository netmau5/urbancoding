$(document).ready(function(){
  
  //section transition animations
  var winHeight = $(window).height();
 
  var maximize = function() {
    var $$ = $(this),
    	siblings = $$.siblings(),
	siblingHeight = 0;
	
    siblings.map(function(){ return $(this).outerHeight() }).each(function(){ siblingHeight += this; });

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
  $.ajax("http://posterous.com/api/2/sites/urbancoding/posts/public", { 
    dataType: "jsonp", 
    success: function(r){
      $("#post-latest").html(postTemplate(r[0]));
      $("#posts-other").html(postTemplate(r[1]));    
    }
  });
  
  //blog - urban coding three.js
	var container, interval,
    camera, scene, renderer,
    projector, plane, cube, linesMaterial,
    color = 0, colors = [0xde1f3f],
    ray, brush, objectHovered,
    mouse3D, isMouseDown = false, onMouseDownPosition,
    radious = 1500, theta = 55, onMouseDownTheta = 45, phi = 38, onMouseDownPhi = 60,
    isShiftDown = false,
    cubeSize = 50,
    gridSize = 20,
    planeSize = cubeSize * gridSize,
    rendererWidth = parseInt($("#blog .posts").width()),
    rendererHeight = 600;

    init();
    render();

    function init() {

    	container = document.createElement( 'div' );
    	container.style.marginLeft = (window.innerWidth - rendererWidth) / 2;
    	container.style.position = "absolute";
    	container.style.bottom = "10%";
    	$(container).addClass("voxel-wrapper");
    	$("#blog").append( container );

    	camera = new THREE.Camera( 40, rendererWidth / rendererHeight, 1, 10000 );
    	camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    	camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
    	camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    	camera.target.position.y = 200;

    	scene = new THREE.Scene();

    	// Grid

    	var geometry = new THREE.Geometry();
  		    
    	geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - planeSize/2, 0, 0 ) ) );
    	geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( planeSize/2, 0, 0 ) ) );

    	linesMaterial = new THREE.LineColorMaterial( 0x000000, 0.2 );

    	for ( var i = 0; i <= gridSize; i ++ ) {

    		var line = new THREE.Line( geometry, linesMaterial );
    		line.position.z = ( i * cubeSize ) - (planeSize/2);
    		scene.addObject( line );

    		var line = new THREE.Line( geometry, linesMaterial );
    		line.position.x = ( i * cubeSize ) - (planeSize/2);
    		line.rotation.y = 90 * Math.PI / 180;
    		scene.addObject( line );

    	}

    	projector = new THREE.Projector();

    	plane = new THREE.Mesh( new Plane( planeSize, planeSize ) );
    	plane.rotation.x = - 90 * Math.PI / 180;
    	scene.addObject( plane );

    	cube = new Cube( cubeSize, cubeSize, cubeSize );

    	ray = new THREE.Ray( camera.position, null );

    	brush = new THREE.Mesh( cube, new THREE.MeshColorFillMaterial( colors[ color ], 0.4 ) );
    	brush.position.y = 2000;
    	brush.overdraw = true;
    	scene.addObject( brush );

    	onMouseDownPosition = new THREE.Vector2();

    	// Lights

    	var ambientLight = new THREE.AmbientLight( 0x404040 );
    	scene.addLight( ambientLight );

    	var directionalLight = new THREE.DirectionalLight( 0xffffff );
    	directionalLight.position.x = 1;
    	directionalLight.position.y = 1;
    	directionalLight.position.z = 0.75;
    	directionalLight.position.normalize();
    	scene.addLight( directionalLight );

    	var directionalLight = new THREE.DirectionalLight( 0x808080 );
    	directionalLight.position.x = - 1;
    	directionalLight.position.y = 1;
    	directionalLight.position.z = - 0.75;
    	directionalLight.position.normalize();
    	scene.addLight( directionalLight );

    	renderer = new THREE.CanvasRenderer();
    	renderer.setSize( rendererWidth, rendererHeight );

    	container.appendChild(renderer.domElement);

    	$("#blog").keyup(onDocumentKeyUp)
    	    .keydown(onDocumentKeyDown)
    	    .mousemove(onDocumentMouseMove)
    	    .mousedown(onDocumentMouseDown)
    	    .mouseup(onDocumentMouseUp);
    	    
    	$(document.body).mouseup(onDocumentMouseUp)
    	    .mousemove(onDocumentMouseMove);
    	
    	var x, y, p, points = [
    	    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1],
    	    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    	    [1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    	    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    	    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1], 
    	    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    	    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    	    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
    	    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    	    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1]
    	];
    	
    	for (z in points) {
    	  for (x in points[z]) {
    	    p = points[z][x];
    	    if (p) { addVoxel(x - 10, 0, z - 5); }
    	  }
    	}
    }

    function onDocumentKeyDown( event ) {
    	switch( event.keyCode ) {
    		case 16: isShiftDown = true; interact(); render(); break;
    	}
    }

    function onDocumentKeyUp( event ) {
    	switch( event.keyCode ) {
    		case 16: isShiftDown = false; interact(); render(); break;
    	}
    }

    function onDocumentMouseDown( event ) {
    	event.preventDefault();

    	isMouseDown = true;

    	onMouseDownTheta = theta;
    	onMouseDownPhi = phi;
    	onMouseDownPosition.x = event.clientX;
    	onMouseDownPosition.y = event.clientY;
    }

    function onDocumentMouseMove( event ) {

    	event.preventDefault();

    	if ( isMouseDown ) {

    		theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
    		phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;

    		phi = Math.min( 180, Math.max( 0, phi ) );

    		camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    		camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
    		camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    		camera.updateMatrix();

    	}

    	mouse3D = projector.unprojectVector( new THREE.Vector3( ( event.clientX / renderer.domElement.width ) * 2 - 1, - ( event.clientY / renderer.domElement.height ) * 2 + 1, 0.5 ), camera );
    	ray.direction = mouse3D.subSelf( camera.position ).normalize();

    	interact();
    	render();

    }

    function onDocumentMouseUp( event ) {

    	event.preventDefault();

    	isMouseDown = false;

    	onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
    	onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;

    	if ( onMouseDownPosition.length() > 5 ) {

    		return;

    	}

    	var intersect, intersects = ray.intersectScene( scene );

    	if ( intersects.length > 0 ) {

    		intersect = intersects[ 0 ].object == brush ? intersects[ 1 ] : intersects[ 0 ];

    		if ( intersect ) {

    			if ( isShiftDown ) {

    				if ( intersect.object != plane ) {

    					scene.removeObject( intersect.object );

    				}

    			} else {

    				var position = new THREE.Vector3().add( intersect.point, intersect.object.matrixRotation.transform( intersect.face.normal.clone() ) );

    				var voxel = new THREE.Mesh( cube, new THREE.MeshColorFillMaterial( colors[ color ] ) );
    				voxel.position.x = Math.floor( position.x / cubeSize ) * cubeSize + 25;
    				voxel.position.y = Math.floor( position.y / cubeSize ) * cubeSize + 25;
    				voxel.position.z = Math.floor( position.z / cubeSize ) * cubeSize + 25;
    				voxel.overdraw = true;
    				scene.addObject( voxel );

    			}

    		}

    	}

    	interact();
    	render();
    }

    function setBrushColor( value ) {

    	color = value;
    	brush.material[ 0 ].color.setHex( colors[ color ] ^ 0x4C000000 );

    	render();

    }
    
    function addVoxel(x,y,z) {
    
      var voxel = new THREE.Mesh( cube, new THREE.MeshColorFillMaterial( colors[ color ] ) );
			voxel.position.x = x * cubeSize + 25;
			voxel.position.y = y * cubeSize + 25;
			voxel.position.z = z * cubeSize + 25;
			voxel.overdraw = true;
			scene.addObject( voxel );
    }

    function offsetScene( x, z ) {

    	var offset = new THREE.Vector3( x, 0, z ).multiplyScalar( 50 );

    	for ( var i in scene.objects ) {

    		object = scene.objects[ i ];

    		if ( object instanceof THREE.Mesh && object !== plane && object !== brush ) {

    			object.position.addSelf( offset );

    		}

    	}

    	interact();
    	render();

    }

    function interact() {

    	if ( objectHovered ) {

    		objectHovered.material[ 0 ].color.a = 1;
    		objectHovered.material[ 0 ].color.updateStyleString();
    		objectHovered = null;

    	}

    	var position, intersect, intersects = ray.intersectScene( scene );

    	if ( intersects.length > 0 ) {

    		intersect = intersects[ 0 ].object != brush ? intersects[ 0 ] : intersects[ 1 ];

    		if ( intersect ) {

    			if ( isShiftDown ) {

    				if ( intersect.object != plane ) {

    					objectHovered = intersect.object;
    					objectHovered.material[ 0 ].color.a = 0.5;
    					objectHovered.material[ 0 ].color.updateStyleString();

    					return;

    				}

    			} else {

    				position = new THREE.Vector3().add( intersect.point, intersect.object.matrixRotation.transform( intersect.face.normal.clone() ) );

    				brush.position.x = Math.floor( position.x / cubeSize ) * cubeSize + 25;
    				brush.position.y = Math.floor( position.y / cubeSize ) * cubeSize + 25;
    				brush.position.z = Math.floor( position.z / cubeSize ) * cubeSize + 25;

    				return;

    			}

    		}

    	}

    	brush.position.y = 2000;
    }

    function render() {
    	renderer.render( scene, camera );
    }
    
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

