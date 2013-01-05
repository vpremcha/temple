function fetchEventNames(){
    $.getJSON('eventdates.json', function(data) {

        var eventNameOptions = $('#eventName');

        if(eventNameOptions.prop) {
          var options = eventNameOptions.prop('options');
        } else {
          var options = eventNameOptions.attr('options');
        }
        $('option', eventNameOptions).remove();

        $.each(data, function(key, val) {
            options[options.length] = new Option(val[0].name, key);
        });

    });
}

function fetchEventDates(){
    var value = $('#eventName').val();
    var eventDateOptions = $('#eventDate');

    if (value == 'Private'){
        $('#privateEventDateDiv').show();
        $('#privateEventNameDiv').show();
        $('#eventNameDiv').hide();
        $('#eventDateDiv').hide();
        $('#privateEventName').addClass('required');
        $('#privateEventDate').addClass('required');
        $('#eventName').removeClass('required');
        return;
    } else {
        $('#eventName').addClass('required');
        $('#privateEventName').removeClass('required');
        $('#privateEventDate').removeClass('required');
    }

    //Close if tooltips already open
    var tooltips = $( "[title]" ).tooltip();
    tooltips.tooltip( "close" );

    $.getJSON('eventdates.json', function(data) {

        if(eventDateOptions.prop) {
          var options = eventDateOptions.prop('options');
        } else {
          var options = eventDateOptions.attr('options');
        }
        $('option', eventDateOptions).remove();

        $.each(data, function(key, val) {
            if (key == value) {
                $('#eventName').attr('title',val[2].desc);
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
        });

    });
}

function resetForm() {
    location.reload();
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
        setWatermark('#privateEventDate','mm/dd/yyyy');
        setWatermark('#sponsorPhone','xxx-xxx-xxxx');
        setWatermark('#sponsorEmail','abc@xyz.com');
        setWatermark('#sponsorFirstName','First Name');
        setWatermark('#sponsorLastName','Last Name');

        $( document ).tooltip({
            position: {
                my: "center bottom-20",
                at: "center top",
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