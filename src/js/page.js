
function Page( options ){
  
  var page = this;
  
  var dom = document.createElement( "div" );
  dom.className = "page";
  dom.innerHTML = "<div class='tile-container'></div>";
  
  var tileContainer = dom.querySelector( ".tile-container" );
  
  this.setOptions = function( opts ){
    
    this.tileLength = opts.tileLength || this.tileLength;
    this.imgUrl = opts.imgUrl || this.imgUrl;
    
  };
  
  this.id = "";
  
  this.tileLength = 1;
  
  this.imgUrl = null;
  
  this.tiles = [];
  
  this.domElement = dom;
  
  this.aspect = 1;
  this.setAspect = function( aspect ){
    
    this.aspect = aspect;
    this.updateDefaultView();
    
  };
  
  this.spaceSize = new Size();
  this.refreshSpaceSize = function(){
    
    var bounding = dom.getBoundingClientRect();
    var w = bounding.width;
    var h = bounding.height;
    
    this.spaceSize.width = w;
    this.spaceSize.height = h;
    
    this.updateDefaultView();
    
  };
  
  this.defaultView = {
    top: 0,
    left: 0,
    width: 0,
    height: 0
  };
  this.updateDefaultView = function(){
    
    var aspect = this.aspect;
    var spaceSize = this.spaceSize;
    
    var w = spaceSize.width;
    var h = spaceSize.height;
    var boundingAspect = w / h;
    
    var defaultView = this.defaultView;
    
    if( aspect > boundingAspect ){
      defaultView.width  = w;
      defaultView.height = ( w / aspect );
    }else{
      defaultView.width  = ( h * aspect );
      defaultView.height = h;
    }
    
    defaultView.top  = ( h - defaultView.height ) / 2;
    defaultView.left = ( w - defaultView.width ) / 2;
    
    this.flushView();
    
  };
  
  this.zoom = 1;
  
  this.render = function(){
    
    var tiles = this.tiles;
    var tileLength = this.tileLength;
    
    if( tiles.length != tileLength ){
      
      this.initializeTiles();
      tiles = this.tiles;
      
    }
    
    for( var i = 0; i < tiles.length; i++ ){
      
      tiles[i].render();
      
    }
    
    
    //サイズ
    this.flushView();
    
  };
  
  this.initializeTiles = function(){
    
    var imgUrl = this.imgUrl;
    var tileLength = this.tileLength;
    
    var tiles = [];
    
    var w = Math.ceil( Math.sqrt( tileLength ) );
    tileLength = w * w;
      
    this.tileLength = tileLength;
    
    tileContainer.innerHTML = "";
    
    
    for( var i = 0; i < tileLength; i++ ){
      
      var tile = new Tile({
        index: i,
        imgUrl: imgUrl
      });
      tile.parent = this;
      tileContainer.appendChild( tile.domElement );
      
      tiles.push( tile );
      
    }
    
    var sizeUnit = 1 / w;
    
    for( var i = 0; i < tiles.length; i++ ){
      
      tiles[i].setOptions( {
        size: new Size( sizeUnit, sizeUnit ),
        position: new Vector2(
          sizeUnit * ( i % w ),
          sizeUnit * Math.floor( i / w )
        )
      } );
      
    }
    
    this.tiles = tiles;
    
  };
  
  this.flushView = function(){
    
    var defaultView = this.defaultView;
    var center = this.center;
    
    tileContainer.style.top = defaultView.top +  "px";
    tileContainer.style.left = defaultView.left +  "px";
    tileContainer.style.width = defaultView.width + "px";
    tileContainer.style.height = defaultView.height + "px";
    
    tileContainer.style.transform = "scale( " + this.zoom + " ) translate( " + center.x + "px, " + center.y + "px )";
    
  };
  
  this.center = new Vector2();
  this.setCenterPosition = function( v ){
    this.center = v;
    this.render();
  };
  
  setTimeout( ( function( page ){
    return function(){
      page.refreshSpaceSize();
    };
  } )( this ), 1 );
  this.setOptions( options );
  this.zoom = 1;
  
  //UI操作イベント
  function handleDragEvent( e ){
    
    var center = page.center;
    center.x += e.vector2.x / page.zoom;
    center.y += e.vector2.y / page.zoom;
    
  }
  
  function handleZoomEvent( e ){
    
    page.zoom *= e.zoom;
    
  }
  
  pointer.addIntelligentListeners( tileContainer, {
    click: viewer.switchHeaderVisibility,
    dragMove: handleDragEvent,
    zoom: handleZoomEvent,
    preventDefault: true
  } );
  
  ( function(){
    requestAnimationFrame( arguments.callee );
    page.flushView();
  } )();
  
  
}