// For changing background color

function changeColor(selector, colors, time) {
    var curCol =0,
        timer = setInterval(function () {
            if (curCol === colors.length) curCol = 0;
            $(selector).animate({
            backgroundColor: colors[curCol]
            }, 1000);
            curCol++;
        }, time);
}
$(window).on('load',function () {
    changeColor("body", ["#ee6e73", "rgba(0,128,0,0.6)", "rgba(128,0,128, 0.6)", "rgba(0,0,128,0.6)"], 3000);
});


$(document).ready(function(){
    var gamesDataCopy = [];
    var orginalGamesData =  [];
    var currentCardsJsonData = [];
    var titleData = {};
    var platformData = {};
    var tags = {};
    var originalPlatformData = {};
    var originalTitleData = {};
    var flag = true;

    //Merge Two arrays and remove duplicate
    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
    
        return a;
    };
    //Update Search Data
    function updateSearchData(key){
        var currCards = JSON.parse(localStorage.getItem('cardsJson'));        
        var obj = {};
        $.each(currCards, function(index, value){
            obj[value[key]] = null;
        });
        return obj;
    }

    //Functions to find current display block cards and make json data
    function cardsToJson(){
        var obj = {};
        var arr = [];
        $('.card-column').each(function(){
            var ele = $(this).find('.card-content span.card-title');
            if($(this).css('display') == "block"){
                title = ele.attr('data-title');
                platform = ele.attr('data-platform');
                score = ele.attr('data-score');
                editor = ele.attr('data-editor');
                genre = ele.attr('data-genre');
                
                arr.push({
                    'title': title,
                    'platform': platform,
                    'score': score,
                    'genre': genre,
                    'editors_choice': editor
                });
            }
        });
        return arr;
    }

    //For printing games cards
    function printCards(result){
        var stars = '';
        var dots = '...';
        var trimTitle1 = '';
        var trimTitle2 = '';
        $.each(result, function(index, value){
            stars = '';
            
            titleData[value.title] = null;
            platformData[value.platform] = null;
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
            $('.card-container').append("<div class='col s12 m6 l4 card-column'>"+
                "<div class='card small sticky-action hoverable'>"+
                    "<div class='card-image waves-effect waves-block waves-light'>"+
                        "<img class='activator' src='http://via.placeholder.com/350x180'>"+
                    "</div>"+
                    "<div class='card-content'>"+
                        "<span class='card-title activator grey-text text-darken-4', data-title='"+value.title.replace("'", '')+"' data-platform='"+value.platform.replace("'", '')+"' data-score='"+value.score+"' data-editor='"+value.editors_choice+"' data-genre='"+value.genre.replace("'", '')+"'>"+trimTitle1+"<i class='material-icons right'>more_vert</i></span>"+
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
        });
        originalPlatformData = jQuery.extend({}, platformData);
        originalTitleData = jQuery.extend({}, titleData);
    }

    //Sort by score
    function sortByScore(){
        var storedObj = localStorage.getItem('cardsJson');
        var order = 'asc';
        $('.card-container').html('');
        if($('#ascDesc').is(":checked")){
            order = 'desc';
        }
        if($('#sortByScore').is(":checked")){
            printCards(JSON.parse(storedObj).sort(sortGames('score', order)));

        }else{
            printCards(JSON.parse(storedObj));

        }
    }

    //sort asc desc in score
    function ascDesc(){
        var storedObj = localStorage.getItem('cardsJson');
        var order = 'asc';
        $('.card-container').html('');                
        if($('#ascDesc').is(":checked")){
            order = 'desc';
        }
        if($('#sortByScore').is(":checked")){
            printCards(JSON.parse(storedObj).sort(sortGames('score', order)));

        }else{
            printCards(JSON.parse(storedObj));
        }
    }

    //Search partial strings in title
    function searchGames(val){
        var currCards = '';       
        console.log('reach 2');        
        currCards = JSON.parse(localStorage.getItem('cardsJson')); 
        var cpyCards = [];        
        $('.card-container').html('');
        
        $.each(currCards, function(index, value){
            if(value.title.toLowerCase().indexOf(val.toLowerCase()) != -1){
                cpyCards.push(value);                
            }            
        });
        printCards(cpyCards);
        // localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));                                
    }

    //Filter by platforms
    function platformFilter(tags){
        console.log('here platform');
        // var currCards = JSON.parse(localStorage.getItem('cardsJson')); 
        var cpyCards = [];
        $('.card-container').html('');
        $.each(tags, function(index, value){
            $.each(orginalGamesData, function(cindex, cvalue){
                if((cvalue.platform.toLowerCase().indexOf(value.tag.toLowerCase())) != -1 && (cvalue.title.toLowerCase().indexOf($('.search').val().toLowerCase()) != -1)){ 
                    cpyCards.push(cvalue);
                }
            });
        });
        printCards(cpyCards);
                                       
    }

    //Sort object key function
    function sortGames(key, order='asc') {
        return function(a, b) {
          if(!a.hasOwnProperty(key) || 
             !b.hasOwnProperty(key)) {
              return 0; 
          }
          
          const varA = (typeof a[key] === 'string') ? 
            a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string') ? 
            b[key].toUpperCase() : b[key];
            
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order == 'desc') ? 
            (comparison * -1) : comparison
          );
        };
      }
    
    //Ajax request to load game data
    $.ajax({
        method      : "GET",
        url         : "http://starlord.hackerearth.com/gamesarena",
        dataType    : "json",
        before      : function(){

        },
        success     : function(result){

            gamesDataCopy = result.slice(); //Making seperate copy explicity using slice
            orginalGamesData = result.slice();
            gamesDataCopy.shift(); //to remove first element
            orginalGamesData.shift();
            printCards(gamesDataCopy);
        },
        complete    : function(){
            //Sort functionality
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));
            localStorage.setItem('tags', JSON.stringify({}));            
            $('#sortByScore').on('change', function(){
                sortByScore();  
            });

            $('#ascDesc').on('change', function(){
                ascDesc();
            });
        }

    });
    titleData = {"":null};
    platformData = {"":null};
     //Converting nav to sidenabv in mobile view
     $(".button-collapse").sideNav();

    //Search auto complete input
    function searchAutoComplete(titleData){
        $('input.autocomplete').autocomplete({
            data: titleData,
            limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                $('.card-column').css("display","block");                        
                // Callback function when value is autcompleted.
                $('.card-content span.card-title').each(function(){
                    if(val.replace("'", '') != $(this).attr('data-title')){
                        $(this).parents('.card-column').css("display","none");
                    }

                });
                localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));                                        
                platformData = updateSearchData('platform');
                console.log('complete');
                platformChipsAutoComplete(platformData);
                addingPrevChips();
                sortByScore();
                ascDesc();
            },
            minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
        });    
    }
    searchAutoComplete(titleData);
    
    $('.search').on('blur', function(){
        console.log('thr?');
        tags = JSON.parse(localStorage.getItem('tags'));
        if($('.search').val() == "" && Object.keys(tags).length > 0){
            $('.card-container').html('')
            printCards(orginalGamesData);
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));                                                                
            platformFilter(tags);
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));
            platformChipsAutoComplete(originalPlatformData);
            addingPrevChips();
            titleData = updateSearchData('title');             
            searchAutoComplete(titleData);                                                                                    

        }else if($('.search').val() == "" && Object.keys(tags).length == 0){
            $('.card-container').html('')
            printCards(orginalGamesData); 
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));                                                                            
            platformChipsAutoComplete(originalPlatformData);
            searchAutoComplete(originalTitleData);

        }else if($('.search').val() != "" && Object.keys(tags).length == 0){
            console.log('sad');
            $('.card-container').html('')
            printCards(orginalGamesData); 
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));                                                                                                    
            searchGames($('.search').val());
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson())); 
            platformData = updateSearchData('platform'); 
            platformChipsAutoComplete(platformData);
        }else if($('.search').val() != "" && Object.keys(tags).length > 0){
            searchGames($('.search').val()); 
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));   
            platformData = updateSearchData('platform');
            platformChipsAutoComplete(platformData);
            addingPrevChips(); 
            titleData = updateSearchData('title');             
            searchAutoComplete(titleData);                                                                    
        }   
        sortByScore();
        ascDesc();     
    });

    function addingPrevChips(){
        console.log('accha');
        var tags = JSON.parse(localStorage.getItem('tags'));
        var chip = '';
        $.each(tags, function(index, value){
            // chip = '<div class="chip">'+value.tag+'<i class="material-icons close">close</i></div>';            
            // $('.platformFilter .chips.chips-autocomplete').prepend(chip);
            $(".chips").find('input').val(value.tag);   
            $('.chips').val(function(i, val) {
                return val + (!val ? '' : '|') + value.tag;
            });    
            $(".chips").find('input').trigger({ type : 'keydown', which : 13 });            
        });
    }

    function platformChipsAutoComplete(platformData){
        //Platform filter autocomplete
        $('.chips-autocomplete').material_chip({
            autocompleteOptions: {
            data: platformData,
            limit: Infinity,
            minLength: 1,
            },
            placeholder: 'Enter a platform',
            secondaryPlaceholder: 'Add more'
        });
    }

    platformChipsAutoComplete(platformData);

    $('.platformFilter .chips').on('chip.add', function(e, chip){
    // you have the added chip here
    tags = $('.platformFilter .chips-autocomplete').material_chip('data');       
    // tags2 = JSON.parse(localStorage.getItem('tags'));
    // tags = Object.assign(tags, tags2);
    searchValue = $('.search').val();
    localStorage.setItem('tags', JSON.stringify(tags));
    if(searchValue != ""){       
        platformFilter(tags); 
        localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));    
        titleData = updateSearchData('title');
        searchAutoComplete(titleData);
        $('.search').val(searchValue);         
    }else{
        $('.card-container').html('')
        printCards(orginalGamesData);
        localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));     
        platformFilter(tags);
        localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));                 
        titleData = updateSearchData('title');
        searchAutoComplete(titleData); 
    }
    sortByScore();
    ascDesc();    
                  
    });
    
        $('.platformFilter .chips').on('chip.delete', function(e, chip){
        tags = $('.platformFilter .chips-autocomplete').material_chip('data');       
        // tags2 = JSON.parse(localStorage.getItem('tags'));
        // tags = Object.assign(tags, tags2);
        localStorage.setItem('tags', JSON.stringify(tags));        
        searchValue = $('.search').val();
        if(searchValue == "" && Object.keys(tags).length == 0){
            $('.card-container').html('')
            printCards(orginalGamesData);
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));                                                                
            platformChipsAutoComplete(originalPlatformData);
            searchAutoComplete(originalTitleData);
        }else if(searchValue == "" && Object.keys(tags).length > 0){
            $('.card-container').html('')
            printCards(orginalGamesData);
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));     
            platformFilter(tags);
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));                 
            titleData = updateSearchData('title');
            searchAutoComplete(titleData);
        }else if(searchValue != "" && Object.keys(tags).length == 0){
            $('.card-container').html('')
            printCards(orginalGamesData);
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson())); 
            searchGames(searchValue);
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));             
            titleData = updateSearchData('title');
            searchAutoComplete(titleData);
            $('.search').val(searchValue);                    
        }else if(searchValue != "" && Object.keys(tags).length != 0){
            platformFilter(tags); 
            localStorage.setItem('cardsJson', JSON.stringify(cardsToJson()));    
            titleData = updateSearchData('title');
            searchAutoComplete(titleData);
            $('.search').val(searchValue);         
        }

        sortByScore();
        ascDesc();

    });

});