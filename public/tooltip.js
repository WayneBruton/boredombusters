

var tooltip=function(){
    var id = 'tt';
    var top = 3;
    var left = 3;
    var maxw = 300;
    var speed = 10;
    var timer = 20;
    var endalpha = 95;
    var alpha = 0;
    var tt,t,c,b,h;
    var ie = document.all ? true : false;
    return{
     show:function(v,w){
      if(tt == null){
       tt = document.createElement('div');
       tt.setAttribute('id',id);
       t = document.createElement('div');
       t.setAttribute('id',id + 'top');
       c = document.createElement('div');
       c.setAttribute('id',id + 'cont');
       b = document.createElement('div');
       b.setAttribute('id',id + 'bot');
       tt.appendChild(t);
       tt.appendChild(c);
       tt.appendChild(b);
       document.body.appendChild(tt);
       tt.style.opacity = 0;
       tt.style.filter = 'alpha(opacity=0)';
       document.onmousemove = this.pos;
      }
      tt.style.display = 'block';
      c.innerHTML = v;
      tt.style.width = w ? w + 'px' : 'auto';
      if(!w && ie){
       t.style.display = 'none';
       b.style.display = 'none';
       tt.style.width = tt.offsetWidth;
       t.style.display = 'block';
       b.style.display = 'block';
      }
     if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
     h = parseInt(tt.offsetHeight) + top;
     clearInterval(tt.timer);
     tt.timer = setInterval(function(){tooltip.fade(1)},timer);
     },
     pos:function(e){
      var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
      var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
      tt.style.top = (u - h) + 'px';
      tt.style.left = (l + left) + 'px';
     },
     fade:function(d){
      var a = alpha;
      if((a != endalpha && d == 1) || (a != 0 && d == -1)){
       var i = speed;
      if(endalpha - a < speed && d == 1){
       i = endalpha - a;
      }else if(alpha < speed && d == -1){
        i = a;
      }
      alpha = a + (i * d);
      tt.style.opacity = alpha * .01;
      tt.style.filter = 'alpha(opacity=' + alpha + ')';
     }else{
       clearInterval(tt.timer);
        if(d == -1){tt.style.display = 'none'}
     }
    },
    hide:function(){
     clearInterval(tt.timer);
      tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
     }
    };
   }();

   $(function () {

   });// ======================================
   // tooltips


   $('#WestCoast').on({
       mouseenter: function () {
           tooltip.show('West Coast', 200)
       },
       mouseleave: function () {
           tooltip.hide();
       }
   });

   $('#WestCoast').on('touchstart', function () {
       $(this).off('mouseenter,mouseleave');
   });

   $('#NorthernSuburbs').on({
       mouseenter: function () {
           tooltip.show('Northern Suburbs', 200)
       },
       mouseleave: function () {
           tooltip.hide();
       }
   });

   $('#NorthernSuburbs').on('touchstart', function () {
       $(this).off('mouseenter,mouseleave');
   });

   $('#HelderBerg').on({
       mouseenter: function () {
           tooltip.show('HelderBerg', 200)
       },
       mouseleave: function () {
           tooltip.hide();
       }
   });

   $('#HelderBerg').on('touchstart', function () {
       $(this).off('mouseenter,mouseleave');
   });

   $('#CapeFlats').on({
       mouseenter: function () {
           tooltip.show('Cape Flats', 200)
       },
       mouseleave: function () {
           tooltip.hide();
       }
   });

   $('#CapeFlats').on('touchstart', function () {
       $(this).off('mouseenter,mouseleave');
   });

   $('#SouthernSuburbs').on({
       mouseenter: function () {
           tooltip.show('Southern Suburbs', 200)
       },
       mouseleave: function () {
           tooltip.hide();
       }
   });

   $('#SouthernSuburbs').on('touchstart', function () {
       $(this).off('mouseenter,mouseleave');
   });

   $('#CityBowl').on({
       mouseenter: function () {
           tooltip.show('City Bowl', 200)
       },
       mouseleave: function () {
           tooltip.hide();
       }
   });

   $('#CityBowl').on('touchstart', function () {
       $(this).off('mouseenter,mouseleave');
   });

   $('#AtlanticSeaboard').on({
       mouseenter: function () {
           tooltip.show('Atlantic Seaboard', 200)
       },
       mouseleave: function () {
           tooltip.hide();
       }
   });

   $('#AtlanticSeaboard').on('touchstart', function () {
       $(this).off('mouseenter,mouseleave');
   });

   $('#SouthPeninsula').on({
       mouseenter: function () {
           tooltip.show('South Peninsula', 200)
       },
       mouseleave: function () {
           tooltip.hide();
       }
   });

   $('#SouthPeninsula').on('touchstart', function () {
       $(this).off('mouseenter,mouseleave');
   });




   // tooltips
   // ======================================