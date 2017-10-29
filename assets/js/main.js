// For changing background color

function changeColor(selector, colors, time) {
    var curCol =0,
        timer = setInterval(function () {
            if (curCol === colors.length) curCol = 0;
            $(selector).animate({
            backgroundColor: colors[curCol]
            }, 1000);
            curCol++;
            console.log('hello'+curCol);
        }, time);
}
$(window).on('load',function () {
    console.log('ba');
    changeColor("body", ["#ee6e73", "rgba(0,128,0,0.6)", "rgba(128,0,128, 0.6)", "rgba(0,0,128,0.6)"], 3000);
});


$(document).ready(function(){
    var titleData = {};
    //Filter select box
    $('select').material_select();
    
    //Ajax request to load game data
    $.ajax({
        method      : "GET",
        url         : "http://starlord.hackerearth.com/gamesarena",
        dataType    : "json",
        before      : function(){

        },
        success     : function(result){
            var stars = '';
            var dots = '...';
            var trimTitle1 = '';
            var trimTitle2 = '';
            $.each(result, function(index, value){
                stars = '';
                
                if(index != 0){
                    titleData[value.title] = null;
                    if(value.title.length >20){
                        trimTitle1 = value.title.substr(0,19);
                        trimTitle1 += dots;
                    }else{
                        trimTitle1 = value.title;
                    }
                    if(value.title.length >27){
                        trimTitle2 = value.title.substr(0,24);
                        trimTitle2 += dots;
                    }else{
                        trimTitle2 = value.title;
                    }
                    for(i=0;i<(parseInt(value.score));++i){
                        stars += '<i class="material-icons" style="font-size:20px;color:orange;">star</i>';
                    }
                    if(value.score%1 != 0){
                        stars += '<i class="material-icons" style="font-size:20px;color:orange;">star_half</i>';
                    }
                    $('.card-container').append("<div class='col s12 m6 l6'>"+
                        "<div class='card small sticky-action'>"+
                            "<div class='card-image waves-effect waves-block waves-light'>"+
                                "<img class='activator' src='http://via.placeholder.com/350x180'>"+
                            "</div>"+
                            "<div class='card-content'>"+
                                "<span class='card-title activator grey-text text-darken-4'>"+trimTitle1+"<i class='material-icons right'>more_vert</i></span>"+
                            "</div>"+
                            "<div class='card-reveal'>"+
                                "<span class='card-title grey-text text-darken-4'>"+trimTitle2+"<i class='material-icons right'>close</i></span>"+
                                "<b><p>Platform: </b>"+value.platform+"</p>"+
                                "<b><p>Scroe: </b>"+value.score+"</p>"+
                                "<b><p>Genre: </b>"+value.genre+"</p>"+
                                "<b><p>Editor's choice: </b>"+value.editors_choice+"</p>"+
                            "</div>"+
                            "<div class='card-action'>"+stars+
                            "</div>"+
                        "</div>"+
                    "</div>");
                }
            });
        },
        complete    : function(){

        }

    });
    titleData = {"":null};
     //Converting nav to sidenabv in mobile view
     $(".button-collapse").sideNav();
         //Search auto complete input
        $('input.autocomplete').autocomplete({
            data: titleData,
            limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
            // Callback function when value is autcompleted.
            },
            minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    });

    

});