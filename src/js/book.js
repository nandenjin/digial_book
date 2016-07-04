
function Book( options ){
  
  var book = this;
  options = options || {};
  
  var dom = document.createElement( "div" );
  dom.className = "book";
  
  this.id = "";
  this.currentPageIndex = -1;
  this.currentPage = null;
  
  var pages =  options.pages || [];
  for( var i = pages.length - 1; 0 <= i; i-- ){
    dom.appendChild( pages[i].domElement )
    pages[i].parent = book;
  }
  
  if( pages[0] ){
    this.currentPageIndex = 0;
    this.currentPage = pages[0];
  }
  
  this.pages = pages;
  
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
  
  this.render = function(){
    this.currentPage.render();
  };
  
  //UI操作イベント
  function handleDragEvent( e ){
    
    var page = book.currentPage;
    var center = page.getCenterPosition();
    
    //ページズームされているときは移動
    if( page.getZoom() != 1 ){
      center.x += e.vector2.x / page.getZoom();
      center.y += e.vector2.y / page.getZoom();
      page.setCenterPosition( center );
      
    //そうでないときはページめくり
    }else{
      
    }
    
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