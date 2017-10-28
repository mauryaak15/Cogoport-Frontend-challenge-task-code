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