
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
  
}