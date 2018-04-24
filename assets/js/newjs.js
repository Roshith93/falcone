$(document).ready(function () {

    // ---------------------Vehicle API -----------------------------

    var getVehicles = $.ajax({
        type: 'GET',
        url: 'https://findfalcone.herokuapp.com/vehicles'
    });

    // ---------------------Planet API -----------------------------

    var getPlanets = $.ajax({
        type: 'GET',
        url: 'https://findfalcone.herokuapp.com/planets'
    });

    $("#hide").hide();
    $("#box1,#box2,#box3,#box4").on("change", function () {
        $("#hide").show();
    });


    //------Getting the planets and showing in the select-option-------

    getPlanets.done(function (planets) {
        let output = ``;
        $.each(planets, function (index, planet) {
            $('#box1').append(`
                        <option value="${planet.distance}">${planet.name}</option>
                        `);
            $('#box2').append(`
                        <option value="${planet.distance}">${planet.name}</option>
                        `);
            $('#box3').append(`
                        <option value="${planet.distance}">${planet.name}</option>
                        `);
            $('#box4').append(`
                        <option value="${planet.distance}">${planet.name}</option>
                        `);
        });
    });

    //option for not selecting the selected items from the options
    
    $('select').change(function() {
    if ($(this).attr('id') == 'box' && $(this).val() == 'Default') {
        $('select').not(this).prop('disabled', true).val('Disabled');
    } else {
        $('select').not(this).removeProp('disabled');
        $('select option').removeProp('disabled');
        $('select').each(function() {
            var val = $(this).val();
            if (val != 'Default' || val != 'Disabled') {
                $('select option[value="' + val + '"]').not(this).prop('disabled', true);
            }
        });
    }
});




    //-------------------generatingToken and findingVehicle---------------------------------------------

    $('#findFalcone').on('click', function () {
        $.ajax({
            type: 'POST',
            url: 'https://findfalcone.herokuapp.com/token',
            headers: {
                'Accept': 'application/json'
            }
        }).done(function (token) {
            //console.log(token.token);
            // var token = `${token.token}`;
            reqData = '{"token": "' + token.token + '","planet_names": ["' + $("#box1 option:selected").text() + '","' + $("#box2 option:selected").text() + '","' + $("#box3 option:selected").text() + '","' + $("#box4 option:selected").text() + '"],"vehicle_names": ["' + $('#name1').val().replace('-', ' ') + '","' + $('#name2').val().replace('-', ' ') + '","' + $('#name3').val().replace('-', ' ') + '","' + $('#name4').val().replace('-', ' ') + '"]}';
            //console.log(reqData);
            $.ajax({
                type: 'POST',
                url: 'https://findfalcone.herokuapp.com/find',
                dataType: 'json',
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                data: reqData,
            }).done(function (response) {
                //console.log(response);
                var success = {
                    "planetName": response.planet_name,
                    "totalTime": `${totalTime}`
                }
                if ((response.status == "success") && (typeof (Storage) !== "undefined")) {
                    // Store into loacl storage
                    localStorage.setItem('success', JSON.stringify(success));
                    window.location.href = 'success.html';
                } else {
                    window.location.href = 'failed.html';
                }
            });
        });
    });

    

});


function printDistance(id, distance, onchange, txt, labelClass, total_no, textBox1, textBox2) {
    totalSelected = $('.' + labelClass + ':checked').length;
    //console.log(id + distance + txt + total_no + totalSelected + labelClass + textBox1 + textBox2);
    if (onchange) {
        $('#' + id).html(distance);
    }
    total_no = total_no - totalSelected;
    if (total_no == 0) {
        $('.' + labelClass).prop('disabled', true);
    }
    $(".label" + labelClass).html(txt + ' - ' + total_no);
    if ($("#" + textBox1).val() != "") {
        $(".label" + $("#" + textBox1).val()).html($("#" + textBox1).val() + ' - ' + (parseInt($("#" + textBox2).val()) + 1));
        $('.' + $("#" + textBox1).val()).prop('disabled', false);
    }
    $("#" + textBox1).val(labelClass);
    $("#" + textBox2).val(total_no);
    // console.log(parseFloat($("#timeTaken1").html()));
    timeTaken1 = parseFloat($("#timeTaken1").html()) || 0;
    timeTaken2 = parseFloat($("#timeTaken2").html()) || 0;
    timeTaken3 = parseFloat($("#timeTaken3").html()) || 0;
    timeTaken4 = parseFloat($("#timeTaken4").html()) || 0;
    totalTime = timeTaken1 + timeTaken2 + timeTaken3 + timeTaken4
    $("#totalTimeTaken").html(totalTime);
    check_radio();
}

//for enabling the button
function check_radio() {
    if ($("input[name='list1']:checked").val() && $("input[name='list2']:checked").val() && $("input[name='list3']:checked").val() && $("input[name='list4']:checked").val()) {
        $("#findFalcone").prop("disabled", false);
    } else {
        $("#findFalcone").prop("disabled", true);
    }
}


function on_dropdown_change(box_id,planetName,vehicleSelect,timeTaken,name,value,list){

	   var selectedplanets = $("#"+box_id+" option:selected").val();  
    var  fouthPlanet =    $('h3#'+planetName).html($("#"+box_id+" option:selected").text());
        if (fouthPlanet){
        	var getVehicles =   $.ajax({
        type:'GET',
        url: 'https://findfalcone.herokuapp.com/vehicles',
     //    success: function(planets){
     //        $.each(planets,function(index,planets){
     //            $('#test1').append(planets.name)
     //        })
     //    }
    });
            getVehicles.done(function(vehicles){
                let output = ``;
                $('#'+vehicleSelect).html("");
                 $('#'+timeTaken).html("");
                 $.each(vehicles,function(index,vehicle){
                 	   $("#"+name).val("");
    				$("#"+value).val("");
                    distance=vehicle.max_distance/vehicle.speed;
                    if(vehicle.max_distance >= selectedplanets){
                         $('#'+vehicleSelect).append(`
                    <input type="radio"  class='${vehicle.name.replace(/\s/g,'-')}' onchange="printDistance('${timeTaken}','${distance}',1,'${vehicle.name}','${vehicle.name.replace(/\s/g,'-')}','${vehicle.total_no}','${name}','${value}')" name="${list}" value="${vehicle.total_no}"> <label  class='label${vehicle.name.replace(/\s/g,'-')}' >${vehicle.name} - ${vehicle.total_no} </label ><br>
                    `);
                     }
                     else{
                         $('#'+vehicleSelect).append(`
                    <input type="radio"  class='${vehicle.name.replace(/\s/g,'-')}' onchange="printDistance('${timeTaken}','${distance}',1,'${vehicle.name}','${vehicle.name.replace(/\s/g,'-')}','${vehicle.total_no}','${name}','${value}')" name="${list}" value="${vehicle.total_no}" disabled> <label  class='label${vehicle.name.replace(/\s/g,'-')}' >${vehicle.name} - ${vehicle.total_no} </label ><br>
                    `);
                     }
                      printDistance(timeTaken,distance,0,vehicle.name,vehicle.name.replace(/\s/g,'-'),vehicle.total_no);
            });
            });
        }
}



