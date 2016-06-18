
var pointer = {};

pointer.addIntelligentListeners = function( target, options ){
  
  pointer.addListeners( target, {
    
    start: start,
    move:  move,
    end:   end,
    preventDefault: options.preventDefault
    
  } );
  
  var dragged = false;
  
  var evtTime = {
    start: 0,
    end  : 0
  };
  
  var evtPoint = {
    start: null,
    end  : null,
    prevs: []
  };
  
  var duration = {
    longClick: 300,
    doubleClick: 300
  };
  
  function start( e ){
    
    dragged = false;
    
    var nowTime = new Date().getTime();
    evtTime.start = nowTime;
    
    var j = -1, k = 0;
    for( var i = 0; i < e.points.length; i++ ){
      if( e.points[i].id > j ){
        k = i;
      }
    }
    
    evtPoint.start = e.points[k];
    evtPoint.prevs = e.points;
    
    setTimeout(
      ( function( et ){
        
        return function(){
          
          if( evtTime.end == et && !dragged ){
            ( options.longClick || function(){} )( evtPoint.start );
          }
          
        };
        
      } )( evtTime.end ),
      duration.longClick
    );
    
  }
  
  function move( e ){
    
    if( e.dragging ){
      
      if( !dragged ){
        dragged = true;
      }
      
      fireDragEvent( options.dragMove, e );
      fireZoomEvent( options.zoom, e );
      
      evtPoint.prevs = e.points;
      
    }
    
  }
  
  function end( e ){
    
    var nowTime = new Date().getTime();
    
    if( !dragged && nowTime - evtTime.start < duration.longClick ){
      
      if( nowTime - evtTime.end < duration.doubleClick ){
        
        ( options.doubleClick || function(){} )( evtPoint.start );
        
      }else{
        
        setTimeout( ( function( et ){
          return function(){
            if( et == evtTime.start ){
              ( options.click || function(){} )( evtPoint.start );
            }
          };
        } )( evtTime.start ), duration.doubleClick );
        
      }
      
    }else{
      
    }
    
    evtTime.end = nowTime;
    evtPoint.prevs = e.points;
    
  }
  
  function fireDragEvent( handler, e ){
    
    var old = null;
    var current = null;
    
    var prevs = evtPoint.prevs;
    
    if( e.points.length == 1 ){
      
      current = e.points[0];
      
      for( var i = 0; i < prevs.length; i++ ){
        if( current.id == prevs[i].id ){
          old = prevs[i];
          break;
        }
      }
      
    }else if( e.points.length >= 2 ){
      
      current = getCenterPointer( e.points[0], e.points[1] );
      
      if( prevs.length >= 2 ){
        old = getCenterPointer( prevs[0], prevs[1] );
      }else{
        return false;
      }
      
    }
    
    ( handler || function(){} )(
      new pointer.DragEvent( current, old )
    );
    
  }
  
  function fireZoomEvent( handler, e ){
    
    var old = null;
    var current = null;
    
    var prevs = evtPoint.prevs;
    var center = null;
    
    if( e.points.length < 2 || prevs.length < 2 ){
      return false;
    }
    
    old = getDistance( prevs[0], prevs[1] );
    current = getDistance( e.points[0], e.points[1] );
    
    center = getCenterPointer( e.points[0], e.points[1] );
    
    ( handler || function(){} )(
      new pointer.ZoomEvent( current / old, center )
    );
    
  }
  
  function getCenterPointer( p0, p1 ){
    return new pointer.Pointer(
      ( p0.x + p1.x ) / 2,
      ( p0.y + p1.y ) / 2
    );
  }
  
  function getDistance( p0, p1 ){
    return Math.sqrt(
      ( p0.x - p1.x ) * ( p0.x - p1.x )
      + ( p0.y - p1.y ) * ( p0.y - p1.y )
    );
  }
  
};

pointer.addListeners = function( target, options ){
  
  var dragging = true;
  var eventLog = {
    
    start: {
      time: 0,
      points: []
    },
    
    move: {
      time: 0,
      points: []
    },
    
    end: {
      time: 0,
      points: []
    },
    
    id: []
    
  };
  
  target.addEventListener( "touchstart", function( e ){
    
    handleTouchEvent( "start", e );
    
  } );
  
  target.addEventListener( "mousedown", function( e ){
    
    dragging = true;
    handleMouseEvent( "start", e );
    
  } );
  
  target.addEventListener( "touchmove", function( e ){
    
    handleTouchEvent( "move", e );
    
  } );
  
  target.addEventListener( "mousemove", function( e ){
    
    handleMouseEvent( "move", e );
    
  } );
  
  target.addEventListener( "touchend", function( e ){
    
    handleTouchEvent( "end", e );
    
  } );
  
  target.addEventListener( "mouseup", function( e ){
    
    dragging = false;
    handleMouseEvent( "end", e );
    
  } );
  
  //タッチイベントのハンドルと転送
  function handleTouchEvent( type, e ){
    
    if( options.preventDefault ){
      e.preventDefault();
    }
    
    var evt = new pointer.PointEvent( e );
    eventLog[ type ] = evt;
    
    ( options[ type ] || function(){} )( evt );
    
  }
  
  //マウスイベントのハンドルと転送
  function handleMouseEvent( type, e ){
    
    if( options.preventDefault ){
      e.preventDefault();
    }
    
    var x = e.clientX + window.scrollX;
    var y = e.clientY + window.scrollY;
    
    var log = eventLog[ type ];
    
    for( var i = 0; i < log.points.length; i++ ){
      if(
        Math.abs( log.points[i].x - x ) < 2
        && Math.abs( log.points[i].y - y ) < 2
      ){
        return false;
      }
    }
    
    var evt = new pointer.PointEvent( e );
    ( options[ type ] || function(){} )( evt );
    
  }
  
};

pointer.Pointer = function( x, y, id ){
  
  this.x = x || 0;
  this.y = y || 0;
  this.id = id || null;
  
};

pointer.Vector2 = function( x, y ){
  
  this.x = x || 0;
  this.y = y || 0;
  
};

pointer.PointEvent = function( e ){
  
  var type = "";
  
  if( e.type == "mousedown" || e.type == "touchstart" ){
    type = "start";
  }else if( e.type == "mousemove" || e.type == "touchmove" ){
    type = "move";
  }else if( e.type == "mouseup" || e.type == "touchend" ){
    type = "end";
  }
  
  var points = [];
  
  this.dragging = false;
  
  if( e.clientX ){
    
    points.push(
      new pointer.Pointer(
        e.clientX + window.scrollX,
        e.clientY + window.scrollY,
        null
      )
    );
    
    this.dragging = e.buttons % 2 ? true : false;
    
  }else if( e.touches ){
    
    for( var i = 0; i < e.touches.length; i++ ){
      
      var t = e.touches[i];
      points.push(
        new pointer.Pointer(
          t.pageX,
          t.pageY,
          t.identifier
        )
      );
      
    }
    
    this.dragging = true;
    
  }
  
  this.type = type;
  this.points = points;
  this.generated_at = new Date().getTime();
  
};

pointer.DragEvent = function( p, o ){
  
  this.type = "dragmove";
  this.point = p;
  this.vector2 = null;
  
  if( o ){
    this.vector2 = new pointer.Vector2( p.x - o.x, p.y - o.y );
  }
  
};

pointer.ZoomEvent = function( zoom, center ){
  
  this.type = "zoom";
  this.zoom = zoom;
  this.center = center;
  
}

