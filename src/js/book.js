
function Book(){
  
  var dom = document.createElement( "div" );
  dom.className = "book";
  
  this.id = "";
  this.pages = [];
  
  this.addPage = function( page ){
    
    this.pages.push( page );
    page.parent = this;
    dom.appendChild( page.domElement );
    
    setEventListeners( page );
    
  };
  
  this.domElement = dom;
  
  this.switchCorrection = function( sw ){
    
    if( sw === true ){
      dom.classList.add( "corrected" );
    }else if( sw === false ){
      dom.classList.remove( "corrected" );
    }else{
      dom.classList.toggle( "corrected" );
    }
    
  };
  
  //UI操作イベント
  function handleDragEvent( e, page ){
    
    var center = page.center;
    center.x += e.vector2.x / page.zoom;
    center.y += e.vector2.y / page.zoom;
    
  }
  
  function handleZoomEvent( e, page ){
    
    page.zoom *= e.zoom;
    
  }
  
  function setEventListeners( page ){
    
    pointer.addIntelligentListeners( page.tileContainer, {
      click: viewer.switchHeaderVisibility,
      dragMove: function( e ){
        handleDragEvent( e, page );
      },
      zoom: function( e ){
        handleZoomEvent( e, page );
      },
      preventDefault: true
    } );
    
  }
  
}