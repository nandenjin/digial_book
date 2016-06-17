
var viewer = {};

viewer.book = null;
viewer.page = null;

viewer.header = elm( ".header" );

viewer.init = function(){
  try{
  var content = document.querySelector( ".content" );
  
  var page = new Page({
    tileLength: 9,
    imgUrl: function( n, z ){
      return "./content/onu0-" + n + ".jpg";
    }
  });
  page.render();
  
  var book = new Book();
  book.addPage( page );
  
  content.appendChild( book.domElement );
  
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