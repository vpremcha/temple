function fetchEventNames(){
    $.getJSON('eventdates.json', function(data) {

        var eventNameOptions = $('#eventName');

        if(eventNameOptions.prop) {
          var options = eventNameOptions.prop('options');
        } else {
          var options = eventNameOptions.attr('options');
        }
        $('option', eventNameOptions).remove();

        eventNameOptions.append(new Option("",""));
        eventNameOptions.append(new Option("Private Event","Private"));
        $.each(data, function(key, val) {
            eventNameOptions.append(new Option(val.Description, val.ProgType));
        });

    });
}

function fetchEventDates(){
    var value = $('#eventName').val();
    var eventDateOptions = $('#eventDate');

    if (value == ''){
        $('#puja_process').hide();
//        $('#eventInfoImage').hide();
    } else if (value == 'Private'){
        $('#privateEventDateDiv').show();
        $('#privateEventNameDiv').show();
        $('#eventNameDiv').hide();
        $('#eventDateDiv').hide();
        $('#privateEventName').addClass('required');
        $('#privateEventDate').addClass('required');
        $('#eventName').removeClass('required');
        $('#puja_process').hide();
//        $('#eventInfoImage').hide();
        return;
    } else {
        $('#eventName').addClass('required');
        $('#privateEventName').removeClass('required');
        $('#privateEventDate').removeClass('required');
    }

    //Close if tooltips already open
    /*var tooltips = $( "[title]" ).tooltip();
    tooltips.tooltip( "close" );*/

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    $.getJSON('eventdates.json', function(data) {

        if(eventDateOptions.prop) {
          var options = eventDateOptions.prop('options');
        } else {
          var options = eventDateOptions.attr('options');
        }
        $('option', eventDateOptions).remove();
//        $('#puja_process').hide();
//        $('#eventInfoImage').hide();

        $.each(data, function(key, val) {
            if (value == val.ProgType){
                for (var i = 0; i < val.EventDate.length; i++) {
                    var today = new Date();
//                    var fromFile = new Date(val.EventDate[i]);
                    var date1 = val.EventDate[i].trim().replace(/-/g,"/");
                    var fromFile = new Date(date1);
                    //Make sure the date is greater than today
                    if ((fromFile - today) > 0){
                        options[options.length] = new Option(val.EventDate[i], val.EventDate[i]);
                    }
                }
            }
        });

        /*$.each(data, function(key, val) {
            if (key == value) {
//                var tooltips = $( "#eventInfoImage" ).tooltip();
//                tooltips.tooltip( "close" );
                if (!isEmpty(val[3].desc)){
//                    $('#eventInfoImage').attr('title',val[3].desc);
                    $('#eventInfoImage').show();
                }
                if (!isEmpty(val[2].puja)){
//                    $('#puja_process').prop('href',val[2].puja);
//                    $('#puja_process').show();
                }
                $.each(val[1], function(key1, val1) {

                    for (var i = 0; i < val1.length; i++) {
                        var today = new Date();
                        var fromFile = new Date(val1[i]);
                        //Make sure the date is greater than today
                        if ((fromFile - today) > 0){
                            options[options.length] = new Option(val1[i], val1[i]);
                        }
                    }
                });
            }
        });*/

        var eventCode = $('#eventName').val();

        $.each(data, function(key, val) {
            $.each(val, function(key1, val1){
                if (eventCode == val1.ProgType){
                    for (var i = 0; i < val1.EventDate.length; i++) {
                        var today = new Date();
                        var datea = val1.EventDate[i].substring(0,10);
                        var fromFile = new Date(datea);
                        //Make sure the date is greater than today
                        if ((fromFile - today) > 0){
                            options[options.length] = new Option(val1.EventDate[i], val1.EventDate[i]);
                        }
                    }
                }
            });
        });

    });
}

function resetForm() {
    location.reload();
    loadScript();
}

function submitForm(event) {
    //Remove all the watermark text to validate
    $("#form").find('.watermark').each(function(){
        if(!this.reset)
             this.value = '';
    });

    var valid = $("#form").valid();

    if (!valid){
        return false;
    }
    valid = confirm('Please note that submitting a request does not guarantee the confirmation. Temple representatie will contact you for confirmation');
    if (!valid){
        event.preventDefault();
    }
    return valid;
};

function loadScript(){
    $(document).ready(function(){
        fetchEventNames();
        $(function() {
            $( "#privateEventDate" ).datepicker({ minDate: 1, maxDate: "+3M" });
        });

        $('#eventName').change(function() {
            fetchEventDates()
        });

        $('#privateEventNameDiv').hide();
        $('#privateEventDateDiv').hide();
        $('#eventInfoImage').hide();
//        $('#puja_process').hide();

        $('#contactType').change(function() {
            var selectedType = $('#contactType').val();
            if (selectedType == 'phone'){
               $("#sponsorPhoneDiv").show();
               $("#sponsorEmailDiv").hide();
            } else {
                $("#sponsorPhoneDiv").hide();
                $("#sponsorEmailDiv").show();
            }
        });

        $("#sponsorPhoneDiv").show();
        $("#sponsorEmailDiv").hide();

        $("#submit").click(function(event) {
            return submitForm(event);
        });

        setWatermark('#privateEventTime','hh:mm');
        setWatermark('#privateEventName','Enter an event or puja name');

        /*$( "input[type=submit], a, button" )
          .button()
          .click(function( event ) {
                submitForm();
        });*/

        $( "#eventInfoImage" ).tooltip({
            position: {
                at: "right",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                        .addClass( feedback.vertical )
                        .appendTo( this );
                }
            }
        });

        $( "#contactType" ).tooltip({
            position: {
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                        .addClass( "arrow" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                }
            }
        });

        $( "#privateEventName" ).tooltip({
            position: {
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                        .addClass( "arrow" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                }
            }
        });

        $( "#privateEventTime" ).tooltip({
            position: {
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                        .addClass( "arrow" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                }
            }
        });

        $("#eventName").tooltip({
            bodyHandler: function() {
                return $($(this).attr("title")).html();
            },
            showURL: false
        });

    });
    $(function() {
        $( document ).tooltip();
    });

    jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
    }, "Please specify a valid phone number");

    jQuery.validator.addMethod(
        "dateUS",
        function(value, element) {
            var check = false;
            var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if( re.test(value)){
                var adata = value.split('/');
                var mm = parseInt(adata[0],10);
                var dd = parseInt(adata[1],10);
                var yyyy = parseInt(adata[2],10);
                var xdata = new Date(yyyy,mm-1,dd);
                if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) )
                    check = true;
                else
                    check = false;
            } else
                check = false;
            return this.optional(element) || check;
        },
        "Please enter a date in the format mm/dd/yyyy");
}

/**
 * Copied from http://www.mkyong.com/jquery/jquery-watermark-effect-on-text-input/
 * (Have to look for some jquery plugin)
 *
 * This sets the watermark text on a field
 */
function setWatermark(field,waterMark){
    var watermark = waterMark;

	//init, set watermark text and class
	$(field).val(watermark).addClass('watermark');

	//if blur and no value inside, set watermark text and class again.
 	$(field).blur(function(){
  		if ($(this).val().length == 0){
    		$(this).val(watermark).addClass('watermark');
		}
 	});

	//if focus and text is watermrk, set it to empty and remove the watermark class
	$(field).focus(function(){
  		if ($(this).val() == watermark){
    		$(this).val('').removeClass('watermark');
		}
 	});
}