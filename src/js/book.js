
function Book(){
  
  var dom = document.createElement( "div" );
  dom.className = "book";
  
  this.id = "";
  this.pages = [];
  
  this.addPage = function( page ){
    
    this.pages.push( page );
    page.parent = this;
    dom.appendChild( page.domElement );
    
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
  
}