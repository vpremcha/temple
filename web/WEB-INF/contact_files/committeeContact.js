function submitForm(event) {
    var valid = $("#form").valid();
    if (!valid){
        return false;
    }

    var contactType = $( "#contactType" ).val();
    if (contactType == 'phone'){
        if (!$("#phone").valid()){
            event.preventDefault();
            return false;
        }
    } else {
        if (!$("#email").valid()){
            event.preventDefault();
            return false;
        }
    }

    return valid;
};

function resetForm() {
    location.reload();
}

function loadCommitteeNames(){
    $.getJSON('committee.json', function(data) {

        var committeeOptions = $('#committeeToContact');

        if(committeeOptions.prop) {
          var options = committeeOptions.prop('options');
        } else {
          var options = committeeOptions.attr('options');
        }
        $('option', committeeOptions).remove();

        $.each(data, function(key, val) {
            options[options.length] = new Option(val, key);
        });

    });
}

function loadScript(){
    $(document).ready(function(){

        loadCommitteeNames();

        $("#submit").click(function(event) {
            return submitForm(event);
        });

        $('#contactType').change(function() {
            var selectedType = $('#contactType').val();
            if (selectedType == 'phone'){
               $("#phoneDiv").show();
               $("#emailDiv").hide();
            } else {
                $("#phoneDiv").hide();
                $("#emailDiv").show();
            }
        });

        $("#phoneDiv").show();
        $("#emailDiv").hide();

        jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
            phone_number = phone_number.replace(/\s+/g, "");
            return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
        }, "Please specify a valid phone number");
    });

}