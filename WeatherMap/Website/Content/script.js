function initMap() {
  const myLatlng = { lat: -29.90112595573, lng: 23.202203125000022 };
  const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 6,
  center: myLatlng,
  mapTypeId: google.maps.MapTypeId.HYBRID,
  streetViewControl: false,
  mapTypeControl: false

  
  });
  map.addListener("click", function (mapsMouseEvent) {
      var coordinates = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/",
        data: coordinates,
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
          //------------------------------------------------------------------------------
          var result = (response);
          for (let i = 0; i < 12; i++) {
            document.getElementById('i' + String(i + 1)).innerHTML = '<br>' + 'Date: ' + ((result["data"]["timelines"][0]["intervals"][i]["startTime"]).replace(/T/g, '<br> Time: ').replace(/Z/g, '<br>')) + 'Temperature: ' + Math.round(result["data"]["timelines"][0]["intervals"][i]["values"]["temperature"]) + '°C' + '<br>' + 'Cloud Cover: ' + '<img id=' + (String(i) + 'z') + ' src="" style="vertical-align:middle" width="50" height="50">' + '<br>' + 'Wind Speed: ' + Math.round(result["data"]["timelines"][0]["intervals"][i]["values"]["windSpeed"]) + ' m/s' + '<br>' + '<p id=' + (String(i) + 'a') + '></p>' + '<canvas id=' + String(i) + ' width="75" height="75">' + '</canvas>' + '<br>' + '<br>';
          }

          document.getElementById("weather").style.opacity = 1;

          //-------------------------------- WIND DIRECTION & CSS ---------------
          for (let k = 0; k < 12; k++) {
            //------------------------------------------------
            var canvas = document.getElementById(String(k));
            var ctx = canvas.getContext("2d");
            var rotate = (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"]));
            var angle = ((rotate + 450) * Math.PI / 180);
            //------------------------------------------------------------------------------------------------
            var time = (result["data"]["timelines"][0]["intervals"][k]["startTime"]);
            var hour = parseInt(time.split('T')[1].split(':')[0]);
            //---------------------- COMPASS ---------------------------------------
            if (((Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"])) > 340) || (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"]) <= 20)) {
              document.getElementById(String(k) + 'a').innerHTML = 'Wind Direction: S';
            } else if (((Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"])) > 20) && (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"]) <= 70)) {
              document.getElementById(String(k) + 'a').innerHTML = 'Wind Direction: SW';
            } else if (((Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"])) > 70) && (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"]) <= 110)) {
              document.getElementById(String(k) + 'a').innerHTML = 'Wind Direction: W';
            } else if (((Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"])) > 110) && (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"]) <= 160)) {
              document.getElementById(String(k) + 'a').innerHTML = 'Wind Direction: NW';
            } else if (((Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"])) > 160) && (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"]) <= 200)) {
              document.getElementById(String(k) + 'a').innerHTML = 'Wind Direction: N';
            } else if (((Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"])) > 200) && (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"]) <= 250)) {
              document.getElementById(String(k) + 'a').innerHTML = 'Wind Direction: NE';
            } else if (((Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"])) > 250) && (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["windDirection"]) <= 290)) {
              document.getElementById(String(k) + 'a').innerHTML = 'Wind Direction: E';
            } else {
              document.getElementById(String(k) + 'a').innerHTML = 'Wind Direction: SE';
            }
            //-------------------------- CSS COLORS --------------------------------------
            if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["temperature"]) < 0) { // Below 0 degrees celius
              document.body.style.background = 'radial-gradient(circle, rgba(15,0,91,1) 0%, rgba(0,228,255,1) 67%, rgba(0,0,0,1) 100%)';
              //----------------------------------------------------------------
              if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["cloudCover"]) < 30) { // Below 30 % cloudCover

                if (hour < 6 || hour > 18) {
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/night.png')";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/moon.png";
                  draw_arrow("white");
                } else {
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/day.png')";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/sun.png";
                }
                //----------------------------------------------------------------
              } else if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["cloudCover"]) < 75) { // Below 75 % cloudCover

                if (hour < 6 || hour > 18) {
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/mooncloud.png";
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/night.png')";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  draw_arrow("white");
                } else {
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/partlycloud.png";
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/partlycloud.png')";
                }
                //----------------------------------------------------------------
              } else { // >= 75 % cloudCover

                document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/clouds.png";
                document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/cloudy.png')";
                document.getElementById('i' + String(k + 1)).style.color = 'white';
                draw_arrow("white");
                document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";

              }
              //----------------------------------------------------------------
            } else if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["temperature"]) < 17) { // Below 17 degrees celius
              //------------------------------------------------------------------------------------------------
              document.body.style.background = 'radial-gradient(circle, rgba(0,56,255,1) 27%, rgba(160,0,177,1) 59%, rgba(255,171,0,1) 100%)';
              if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["cloudCover"]) < 30) { // Below 30 % cloudCover

                if (hour < 6 || hour > 18) {
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/night.png')";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/moon.png";
                } else {
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/sun.png";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black,  0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/day.png')";
                }
                //------------------------------------------------------------------------------------------------
              } else if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["cloudCover"]) < 75) { // Below 75 % cloudCover

                document.body.style.background = 'linear-gradient(225deg, rgba(124,124,124,1) 24%, rgba(0,156,255,1) 100%)';
                if (hour < 6 || hour > 18) {
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/night.png')";
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/mooncloud.png";
                } else {
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/partlycloud.png";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black,  0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/partlycloud.png')";
                }
                //------------------------------------------------------------------------------------------------
              } else { // >= 75 % cloudCover

                document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/clouds.png";
                document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/cloudy.png')";
                draw_arrow("white");
                document.getElementById('i' + String(k + 1)).style.color = 'white';
                document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";

              }
              //------------------------------------------------------------------------------------------------
            } else if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["temperature"]) < 25) { // Below 25 degrees celius
              //------------------------------------------------------------------------------------------------
              document.body.style.background = 'radial-gradient(circle, rgba(0,168,255,1) 0%, rgba(255,188,0,1) 66%, rgba(255,145,0,1) 100%)';
              if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["cloudCover"]) < 30) { // Below 30 % cloudCover

                if (hour < 6 || hour > 18) {
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/night.png')";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/moon.png";
                } else {
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/sun.png";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black,  0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/day.png')";
                }
                //------------------------------------------------------------------------------------------------
              } else if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["cloudCover"]) < 75) { // Below 75 % cloudCover

                if (hour < 6 || hour > 18) {
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/night.png')";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/mooncloud.png";
                } else {
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/partlycloud.png";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black,  0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/partlycloud.png')";
                }
                //------------------------------------------------------------------------------------------------
              } else { // >= 75 % cloudCover

                document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/clouds.png";
                document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/cloudy.png')";
                draw_arrow("white");
                document.getElementById('i' + String(k + 1)).style.color = 'white';
                document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";

              }
              //------------------------------------------------------------------------------------------------
            } else { // More than 25 degrees celius
              document.body.style.background = 'radial-gradient(circle, rgba(0,224,255,1) 0%, rgba(255,192,0,1) 26%, rgba(255,72,0,1) 100%);';
              if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["cloudCover"]) < 30) { // Below 30 % cloudCover

                if (hour < 6 || hour > 18) {
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/night.png')";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/moon.png";
                } else {
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/sun.png";
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black,  0px 0px 2px black";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/day.png')";
                }
                //------------------------------------------------------------------------------------------------
              } else if (Math.round(result["data"]["timelines"][0]["intervals"][k]["values"]["cloudCover"]) < 75) { // Below 75 % cloudCover

                if (hour < 6 || hour > 18) {
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/mooncloud.png";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/night.png')";
                } else {
                  document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/partlycloud.png";
                  document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black,  0px 0px 2px black";
                  draw_arrow("white");
                  document.getElementById('i' + String(k + 1)).style.color = 'white';
                  document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/partlycloud.png')";
                }
                //------------------------------------------------------------------------------------------------
              } else { // >= 75 % cloudCover

                document.getElementById(String(k) + 'z').src = "Content/Assets/ICONS/clouds.png";
                draw_arrow("white");
                document.getElementById('i' + String(k + 1)).style.color = 'white';
                document.getElementById('i' + String(k + 1)).style.backgroundImage = "url('Content/Assets/BACKGROUND/cloudy.png')";
                document.getElementById('i' + String(k + 1)).style.textShadow = "0px 0px 2px black, 0px 0px 2px black, 0px 0px 2px black";

              }
              //------------------------------------------------------------------------------------------------
            }

          }
          //----------------------------------- FUNCTIONS -------------------------------------------------------------
          function draw_arrow(color) {
            var startX = 37.5;
            var startY = 37.5;
            var size = 27.5;
            ctx.lineWidth = 5;

            ctx.translate(startX, startY);
            ctx.rotate(angle);
            ctx.translate(-startX, -startY);
            
            ctx.strokeStyle = color;
            var arrowX = startX + 0.75 * size;
            var arrowTopY = startY - 0.707 * (0.25 * size);
            var arrowBottomY = startY + 0.707 * (0.25 * size);
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + size, startX);
            ctx.lineTo(arrowX, arrowTopY);
            ctx.moveTo(startX + size, startX);
            ctx.lineTo(arrowX, arrowBottomY);
            ctx.stroke();
          }
          //---------------------------------------------------------------------------------------------
        }
      });
    });
}
//------------------------------ POP UP - EFFECT FUNCTIONS --------------------------------
var changed = 0;
var nochange = 0;
function backBlur(id) {
  if (changed > nochange) {
    uncheckElements();
  }
  var checked = document.getElementById('btnControl'+String(id)).checked;
  if (checked) {
    for (let t = 1; t < 13; ++t) {
      if (id == t) {
        document.getElementById('i'+String(t)).style.filter = 'blur(0px)';
        document.getElementById('i'+String(t)).style.boxShadow = '0px 0px 10px black';
      } else {
        document.getElementById('i'+String(t)).style.filter = 'blur(5px)';
      }
    }
    document.getElementById('map').style.filter = 'blur(5px)';
    document.getElementById('first_line').style.filter = 'blur(5px)';
    document.getElementById('second_line').style.filter = 'blur(5px)';
    document.getElementById('third_line').style.filter = 'blur(5px)';
    window.changed = changed + 1;
  } else {
    for (let t = 1; t < 13; ++t) {
      document.getElementById('i'+String(t)).style.filter = 'blur(0px)';
    }
    document.getElementById('map').style.filter = 'blur(0px)';
    document.getElementById('first_line').style.filter = 'blur(0px)';
    document.getElementById('second_line').style.filter = 'blur(0px)';
    document.getElementById('third_line').style.filter = 'blur(0px)';
    window.changed = changed - 1;
  }
  
  function uncheckElements() {
    var uncheck=document.getElementsByTagName('input');
    for (var i=0;i<12;i++) { 
      if(uncheck[i].type=='checkbox') {
        uncheck[i].checked=false;
      }
    }
  }
}
//------------------------ LOADER ----------------------------------------
$(window).on("load", function(){
  $(".loader-wrapper").fadeOut("slow");
});
//----------------------------------------------------------------