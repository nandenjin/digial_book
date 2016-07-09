
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
  
  //ページを指定
  this.setPageIndex = function( i ){
    
    if( i < 0 || i > pages.length || pages.length < 1 ){
      return false;
    }
    
    this.currentPageIndex = i;
    this.currentPage = pages[i];
    setTurn( 0 );
    
    for( var j = 0; j < pages.length; j++ ){
      
      var page = pages[j];
      
      if( j < i ){
        page.setTurn( 1 );
      }else{
        page.setTurn( 0 );
      }
      
      if( j > i - 2 && j < i + 2 ){
        page.render();
      }
      
    }
    
  };
  
  /*-------
  //UI操作
  --------*/
  
  var speedVector = new Vector2();
  
  var isInTurnMotion = false;
  
  //UI操作イベント
  function handleDragEvent( e ){
    
    isInTurnMotion = true;
    
    var page = book.currentPage;
    var center = page.getCenterPosition();
    
    //ページズームされているときは移動
    if( page.getZoom() != 1 ){
      center.x += e.vector2.x / page.getZoom();
      center.y += e.vector2.y / page.getZoom();
      page.setCenterPosition( center );
      
    //そうでないときはページめくり
    }else{
      
      setTurnBy( -e.vector2.x / window.innerWidth );
      
    }
    
    speedVector = e.vector2;
    
  }
  
  function handleDragEventEnd(){
    
    isInTurnMotion = false;
    
    if( speedVector.x < -3 ){
      turnXTarget = 1;
    }else if( speedVector.x > 3 ){
      turnXTarget = 0;
    }else if( turnX > 0.5 ){
      turnXTarget = 1;
    }else{
      turnXTarget = 0;
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
    dragEnd: handleDragEventEnd,
    zoom: handleZoomEvent,
    preventDefault: true
  } );
  
  //ページめくり
  
  var turnX = 0;
  var turnXTatget = 0;
  
  function setTurn( x ){
    
    turnX = x;
    turnXTarget = x;
    
  }
  
  function setTurnBy( x ){
    
    turnX += x;
    
    turnX = Math.min( 1, Math.max( 0, turnX ) );
    
  }
  
  function animatePageTurn(){
    
    var page = book.currentPage;
    
    if( !isInTurnMotion ){
      
      if( turnX > turnXTarget ){
        setTurnBy( -0.1 );
      }else if( turnX < turnXTarget ){
        setTurnBy( 0.1 );
      }
      
    }
    
    page.setTurn( turnX );
    
  }
  
  
  //アニメーション
  function animate(){
    
    animatePageTurn();
    
  }
  
  setInterval( animate, 1000 / 60 );
  
  //最初のページをセット
  if( pages[0] ){
    this.setPageIndex( 0 );
  }
  
}