function loadStates(){
    /*$.getJSON('states.json', function(data) {

        var committeeOptions = $('#state');

        if(committeeOptions.prop) {
          var options = committeeOptions.prop('options');
        } else {
          var options = committeeOptions.attr('options');
        }
        $('option', committeeOptions).remove();

        $.each(data, function(key, val) {
            options[options.length] = new Option(key, val);
        });

        committeeOptions.val("CA");
    });*/
}

function resetForm() {
    location.reload();
    var committeeOptions = $('#state');
    committeeOptions.val("CA");
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
        setWatermark('#eventDateStartTime','hh:mm');
        setWatermark('#eventDateEndTime','hh:mm');
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

        loadStates();

        $(function() {
            $( "#eventDate" ).datepicker({ minDate: 1, maxDate: "+12M" });
        });


        $("#submit").click(function(event) {
            return submitForm(event);
        });

        setWatermark('#eventDateStartTime','hh:mm');
        setWatermark('#eventDateEndTime','hh:mm');
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
