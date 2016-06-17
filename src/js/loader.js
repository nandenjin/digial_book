
var loader = {};

loader.blobs = [];

loader.loadBlob = function( url, callback ){
  
  callback = callback || function(){};
  
  var blobs = loader.blobs;
  
  for( var i = 0; i < blobs.length; i++ ){
    
    if( blobs[i].url == url ){
      callback( blobs[i].blob );
      return true;
    }
    
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open( "GET", url );
  xhr.responseType = "blob";
  xhr.addEventListener( "load", function(){
    
    blobs.push({
      url: url,
      blob: xhr.response
    });
    
    callback( xhr.response );
    
  } );
  xhr.send();
  
};

