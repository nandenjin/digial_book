
function Tile( options ){
  
  var dom = document.createElement( "div" );
  dom.className = "tile";
  
  var images = [];
  
  this.setOptions = function( opts ){
    
    this.index = opts.index || this.index;
    this.size = opts.size || this.size;
    this.position = opts.position || this.position;
    this.imgUrl = opts.imgUrl || this.imgUrl;
    
  };
  
  this.index = 0;
  
  this.size = new Size();
  this.position = new Vector2( 0, 0 );
  this.imgUrl = null;
  this.currentUrl = "";
  
  this.parent = null;
  this.domElement = dom;
  
  this.layers = [];
  
  this.render = function( bounding, zoom ){
    
    var page = this.parent;
    
    var imgUrl = this.imgUrl;
    var index = this.index;
    var size = this.size;
    var position = this.position;
    
    var zoom = 1;
    var currentUrl = this.currentUrl;
    
    var layers = this.layers;
    
    if( !imgUrl ){
      return false;
    }
    
    dom.style.width = size.width * 100 + "%";
    dom.style.height = size.height * 100 + "%";
    
    dom.style.top = position.y * 100 + "%";
    dom.style.left = position.x * 100 + "%";
    
    var url = imgUrl( index, 0 );
    
    if( currentUrl != url ){
      
      this.currentUrl = url;
      
      loader.loadBlob( url, function( b ){
        
        if( !layers[0] ){
          var nl = new Image();
          nl.className = "layer";
          dom.appendChild( nl );
          layers[0] = nl;
        }
        
        var img = layers[0];
        img.addEventListener( "load", function(){
          
          
          page.setAspect( img.width / img.height );
          
          //タイルレイヤーを可視化
          img.classList.add( "visible" );
          
        } );
        img.src = window.URL.createObjectURL( b );
        
      } );
    
    }
    
  };
  
  this.setOptions( options );
  
}