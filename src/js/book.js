
function Book( options ){
  
  var book = this;
  options = options || {};
  
  var dom = document.createElement( "div" );
  dom.className = "book";
  
  this.id = "";
  this.currentPageIndex = -1;
  this.currentPage = null;
  this.nextPage = null;
  
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
    
    if( i < 0 || i > pages.length - 1 || pages.length < 1 ){
      return false;
    }
    
    this.currentPageIndex = i;
    this.currentPage = pages[i];
    setTurn( 0 );
    
    if( i + 1 <= pages.length - 1 ){
      this.nextPage = pages[ i + 1 ];
    }else{
      this.nextPage = null;
    }
    
    for( var j = 0; j < pages.length; j++ ){
      
      var page = pages[j];
      
      if( j < i ){
        page.setTurn( 1 );
      }else if( j > i ){
        page.setTurn( -1 );
      }
      
      if( i - 1 <= j && j <= i + 1 ){
        page.setVisibility( true );
      }else{
        page.setVisibility( false );
      }
      
      if( j > i - 2 && j < i + 2 ){
        page.render();
      }
      
    }
    
    return true;
    
  };
  
  /*-------
  //UI操作
  --------*/
  
  var speedVector = new Vector2();
  
  var isInTurnMotion = false;
  
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
    
      isInTurnMotion = true;
      turnX += -e.vector2.x / window.innerWidth;
      
      if( turnX < 0 ){
        if( book.setPageIndex( book.currentPageIndex - 1 ) ){
          setTurn( 1 );
        }
      }else if( turnX > 0 ){
        
      }
      
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
    
    //存在しないページへの移動は逆回しでキャンセル
    if( turnXTarget == 1 && book.currentPageIndex + 1 > pages.length - 1 ){
      turnXTarget = 0;
    }else if( turnXTarget == 0 && book.currentPageIndex - 1 < 0 ){
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
    
    //ページめくりの動作をキャンセル
    isInTurnMotion = false;
    setTurn( 0 );
    
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
  
  function animatePageTurn(){
    
    if( !isInTurnMotion ){
      
      var d = turnXTarget - turnX;
      
      //移動目標位置に向かってアニメーション
      if( turnX > turnXTarget ){
        turnX -= 0.1;
      }else if( turnX < turnXTarget ){
        turnX += 0.1;
      }
      
      if( turnX >= 1 && turnXTarget == 1 ){
        if( book.setPageIndex( book.currentPageIndex + 1 ) ){
          setTurn( 0 );
        }
      }
      
      //移動の結果、目標点を超えたら目標点に補正する
      if( d * ( turnXTarget - turnX ) < 0 ){
        turnX = turnXTarget;
      }
      
    }
    
    var page = book.currentPage;
    page.setTurn( turnX );
    
    if( book.nextPage ){
      book.nextPage.setTurn( turnX - 1 );
    }
    
  }
  
  
  //アニメーション
  function animate(){
    
    animatePageTurn();
    //document.querySelector( ".header .title" ).innerHTML = book.currentPageIndex + " " + turnX;
  }
  
  setInterval( animate, 1000 / 60 );
  
  //画面のリフレッシュレートに合わせてページのDOMを更新
  function refreshPageView(){
    
    requestAnimationFrame( refreshPageView );
    
    var currentIndex = book.currentPageIndex;
    
    for( var i = 0; i < pages.length; i++ ){
      
      if( currentIndex <= i && i <= currentIndex + 1 ){
        pages[i].flushView();
      }
      
    }
    
  }
  
  requestAnimationFrame( refreshPageView );
  
  //最初のページをセット
  if( pages[0] ){
    this.setPageIndex( 0 );
  }
  
}