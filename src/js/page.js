
function Page( options ){
  
  var page = this;
  
  var dom = document.createElement( "div" );
  dom.className = "page";
  dom.innerHTML = "<div class='tile-container'></div>";
  
  var tileContainer = dom.querySelector( ".tile-container" );
  this.tileContainer =tileContainer;
  
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
  
  //ページタイルの位置調整
  this.flushView = function(){
    
    var defaultView = this.defaultView;
    var center = this.center;
    
    //ページの基準位置・サイズを設定
    //位置調整は今のところ静的CSSで対処してる
    //tileContainer.style.top = defaultView.top +  "px";
    //tileContainer.style.left = defaultView.left +  "px";
    tileContainer.style.width = defaultView.width + "px";
    tileContainer.style.height = defaultView.height + "px";
    
    //パン動作の座標処理
    this.center.x += ( this.centerTarget.x - this.center.x ) * 0.4;
    this.center.y += ( this.centerTarget.y - this.center.y ) * 0.4;
    
    //アニメーションズームの処理
    this.zoom += ( this.zoomTarget - this.zoom ) * 0.6;
    
    //ズームなどユーザー操作による位置調整（transform）
    tileContainer.style.transform = "scale( " + this.zoom + " ) translate3d( " + center.x + "px, " + center.y + "px, 0 )";
    
    //ページめくりアニメーション
    dom.style.transform = "translate3d( " + ( -window.innerWidth * turnX ) + "px, 0, 0 )";
    dom.style.opacity = ( 1 - turnX ) * 0.5 + 0.5;
    
    dom.style.display = visibility ? "block" : "none";
    
  };
  
  this.centerTarget = new Vector2();
  this.center = new Vector2();
  
  this.getCenterPosition = function(){
    return this.centerTarget.clone();
  };
  
  this.setCenterPosition = function( v ){
    this.centerTarget = v.clone();
    this.center = v.clone();
    //this.render();
  };
  
  this.panCenterPosition = function( v ){
    this.centerTarget = v.clone();
  };
  
  this.zoom = 1;
  this.zoomTarget = 1;
  
  this.getZoom = function(){
    return this.zoomTarget;
  };
  
  this.setZoom = function( z ){
    this.zoom = z;
    this.zoomTarget = z;
  };
  
  this.animateZoom = function( z ){
    this.zoomTarget = z; 
  };
  
  var turnX = 0;
  
  this.setTurn = function( x ){
    turnX = x;
  };
  
  var visibility = false;
  this.setVisibility = function( v ){
    visibility = v;
    this.refreshSpaceSize();
  };
  
  setTimeout( ( function( page ){
    return function(){
      page.refreshSpaceSize();
    };
  } )( this ), 1 );
  this.setOptions( options );
  this.zoom = 1;
  
}