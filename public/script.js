
//TWO ISSUES

//2. seperate data from view
//3. make sure the right comments are showed for certain weather


var weatherArr = [];
var curr_weatherId = 0;
var curr_commentsArr = [];
var curr_weather; //temp weather obj to fetch data

var fetch = function () {
  
  var city_input = $('.city-input').val();
  console.log(city_input);
  var strUrl = "http://api.openweathermap.org/data/2.5/weather?q=" +
    city_input + "&appid=d703871f861842b79c60988ccf3b17ec";

  $.ajax({

    method: "GET",
    url: strUrl,
    success: function (data) {
      var myData = data.main;
      var myDataWeather = data.weather[0];
      console.log(data.name);
      
       //initialize to empty strings for errors handling
      var weatherObj = {
        name: data.name ? data.name : 'Not Found',
        temp: myData.temp ? (myData.temp - 273.15).toFixed(2) : 'Not found',
        tempFar: myData.temp ? (((myData.temp - 273) * 1.8) + 32).toFixed(2) : 'Not found',
        pressure: myData.pressure ? myData.pressure : 'Not found',
        humidity: myData.humidity ? myData.humidity : 'Not found',
        temp_min: myData.temp_min ? (myData.temp_min - 273.15).toFixed(2) : 'Not found',
        temp_max: myData.temp_max ? (myData.temp_max - 273.15).toFixed(2) : 'Not found',
        main: myDataWeather.main ? myDataWeather.main : 'Not found',
        description: myDataWeather.description ? myDataWeather.description : 'Not found',
        //temp_max: myDataWeather.icon ? myDataWeather.icon : 'Not found',
      };

      curr_weatherId++;
      weatherArr.push({weatherId: curr_weatherId, weatherObj: weatherObj, commentsArr: curr_commentsArr});
      presentWeather(weatherObj);      
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};


function presentWeather(weatherObj) {
  
  $('weather.res').empty();

  var source = $('#entry-template').html();
  var template = Handlebars.compile(source);
  var context = weatherObj;
  var newHTML = template(context);
  
  // append our new html to the page
  $('.weather-res').append(newHTML); 
     
    var commentsContainer = '<div class="comments-container">' + '<ul class=comments-list></ul>' +
   '<input type="text" class="form-control comment-input placeholder="Comment about the weather">' +
   '<button class="btn btn-sm btn-primary btn-comment">Post Comment</button> </div>';
 
    $('.weather-res').append(commentsContainer); 
    
 }

function saveComment(){

  //------get comment text
  var curr_comment_text = $('.comment-input').val();
  //used to save current weather data 
  curr_weather = insertComment(curr_weatherId, curr_comment_text);

  renderComments();
  
  //var curr_comment_text = $(this).closest($('.comment-input')).val();
  //var comment = $(this).closest('.comment-input').index();
  //console.log($(this).siblings($('.comment-input')));   
  
}

function renderComments(){
  
    var currCommentsArr = fetchComments(curr_weatherId);
    console.log(currCommentsArr);
    
    for(var i = 0; i < currCommentsArr.length; i++){

      $('.weather-res').find('.entry').append('<li>' + currCommentsArr[i] + '</li>');
      
    }   

}


function insertComment(id, curr_comment_text){
  for (var i = 0; i < weatherArr.length; i++) {
    if(weatherArr[i].weatherId === id){
      weatherArr[i].commentsArr.push(curr_comment_text);
      return (weatherArr[i].weatherObj);
    } 
    console.log(weatherArr);     
  } 
}


function fetchComments(id){
  for (var i = 0; i < weatherArr.length; i++) {
    if(weatherArr[i].weatherId === id){
      return (weatherArr[i].commentsArr);     
    }         
  } 
}


 $('.btn-search').on('click', fetch);
 $('.weather-res').on('click', '.btn-comment', saveComment); 
