$(function () {
    var images = [
        "/images/image16.png",
        "/images/image25.jpeg",
        "/images/image26.jpeg",
        "/images/image27.jpeg",
        "/images/image42.png"
      ];
      var galleryImage = $('#homeImg')
      var i = 0;
      setInterval(function(){
        i = (i + 1) % images.length; //0
        galleryImage.fadeOut(2000,function(){
          $(this).attr("src", images[i]);
          $(this).fadeIn(2000);
        });
      }, 2000); 
});