
var viewer = {};

viewer.book = null;
viewer.page = null;

viewer.header = elm( ".header" );

viewer.init = function(){
  try{
  var content = document.querySelector( ".content" );
  
  var pages = [
  
    new Page({
      tileLength: 9,
      imgUrl: function( n, z ){
        return "./content/onu0-" + n + ".jpg";
      }
    }),
    
    new Page({
      tileLength: 1,
      imgUrl: function( n, z ){
        return "./content/onu1.jpg";
      }
    })
    
  ];
  
  var book = new Book();
  for( var i = 0; i < pages.length; i++ ){
    book.addPage( pages[i] );
  }
  
  content.appendChild( book.domElement );
  book.render();
  
  viewer.book = book;
  
  elm( "#tool_correction" ).addEventListener( "click", book.switchCorrection );
  
  }catch(e){alert(e.message);}
};

window.addEventListener( "load", viewer.init );

viewer.switchHeaderVisibility = function( visibility ){
  
  var header = viewer.header;
  
  if( visibility === true ){
    header.classList.add( "visible" );
  }else if( visibility === false ){
    header.classList.remove( "visible" );
  }else{
    if( header.className.indexOf( "visible" ) != -1 ){
      arguments.callee( false );
    }else{
      arguments.callee( true );
    }
  }
  
};