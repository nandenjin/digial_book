
function Book(){
  
  var book = this;
  
  var dom = document.createElement( "div" );
  dom.className = "book";
  
  this.id = "";
  this.pages = [];
  this.currentPage = null;
  
  this.addPage = function( page ){
    
    this.pages.push( page );
    page.parent = this;
    dom.appendChild( page.domElement );
    
    this.currentPage = page;
    
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
  function handleDragEvent( e ){
    
    var page = book.currentPage;
    var center = page.getCenterPosition();
    center.x += e.vector2.x / page.zoom;
    center.y += e.vector2.y / page.zoom;
    page.setCenterPosition( center );
    
  }
  
  function handleDoubleClickEvent( e ){
    
    var page = book.currentPage;
    
    //ズームと移動を解除する
    if( page.getZoom() != 1 ){
      page.panCenterPosition( new Vector2( 0, 0 ) );
      page.animateZoom( 1 );
    //ダブルタップ位置にズームする
    }else{
      page.panCenterPosition(
        new Vector2(
          window.innerWidth / 2 - e.x,
          window.innerHeight / 2 - e.y
        )
      );
      page.animateZoom( 2 );
    }
    
  }
  
  function handleZoomEvent( e ){
    
    var page = book.currentPage;
    page.setZoom( page.getZoom() * e.zoom );
    
  }
  
  pointer.addIntelligentListeners( dom, {
    click: viewer.switchHeaderVisibility,
    doubleClick: handleDoubleClickEvent,
    dragMove: handleDragEvent,
    zoom: handleZoomEvent,
    preventDefault: true
  } );
  
}
