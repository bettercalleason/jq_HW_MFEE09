let locations = "";
const display = () => document.querySelector("#locations").innerHTML=`${locations[0].textContent}`

$(document).ready(function () {
    $(".item-01").addClass("selected");
    locations = $(".item-01");
    console.log(locations);
    display()
    $('.start').attr('disabled','true')
    // $('.start').prop('disabled')

});
$(".next").click(function () {
    if (locations[0] != $('.selected').parent().children().last()[0]){
        locations.removeClass("selected");
        locations = locations.next();
        locations.addClass("selected");
        display()
    }
    console.log(locations);
    }
    
);

    
$(".prev").click(function () {
    if (locations[0] != $('.selected').parent().children().first()[0]){
        locations.removeClass("selected");
        locations = locations.prev();
        locations.addClass("selected");
        display()
        // console.log(locations);
    }
});
$(".children").click(function () {
    locations.removeClass("selected");
    locations = locations.children().children().first();
    locations.addClass("selected");
    display()
    // console.log(locations);
});
$(".parents").click(function () {
    locations.removeClass("selected").
    locations = locations.parent().parent();
    locations.addClass("selected");
    display()
    console.log(locations);
});



// document.querySelector("#locations").innerHTML=`${locations[0].textContent}`
