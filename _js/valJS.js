/*
    TODO:
        none
    FIXME:

*/ 
(function ($) {
    var settings;
    var form;

    $.fn.set = function (options) {

        // Default options
        settings = $.extend({
            requiredClass: 'required',
            error:{
                errorClass: 'error',
                errorMsgEnabled: true,
                errorMsg: {
                    wrongInputType: "Bitte geben Sie einen gültigen Wert ein",
                    notMail: "Bitte geben Sie eine gültige Mail Adresse ein",
                    tooLong: "Der Wert ist zu lang",
                    tooShort: "Der Wert ist zu kurz"
                }
            },
            submitOnSuccess: true
        }, options);
        form = this;
    };

    $.fn.validate = function () {
        var validForm = true;
        $(form).find("." + settings.requiredClass).each(function () {
            var res = validateInput($(this));
            if(validForm == true){
                validForm = res;
            }
        });

        //Submit form falls enabled
        if(validForm && settings.submitOnSuccess){
            $(form).submit()
        }

        return validForm;
    }

    function validateInput(obj){
        var valid = true;

        //Validierung nach Datentyp und default
        switch ($(obj).attr("data-type")) {
            case "number":
                valid = /^\d+$/.test($(obj).val());
                if(!(/^\d+$/.test($(obj).val()))){
                    if(settings.error.errorMsgEnabled){$(obj).attr('error-msg', settings.error.errorMsg.wrongInputType.toString())};
                }
                break;

            case "mail":
                const regexMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                valid = regexMail.test($(obj).val())
                if(!(regexMail.test($(obj).val()))){
                    if(settings.error.errorMsgEnabled){$(obj).attr('error-msg', settings.error.errorMsg.notMail.toString())};
                }

                break;

            default:
                if ($(obj).val() == "") {
                    valid = false;
                }
                break;
        }

        //Validierung nach Länge(min)
        var attrMin = $(obj).attr('min');
        if (typeof attrMin !== typeof undefined && attrMin !== false) {
            if(attrMin > $(obj).val().length){
                if(settings.error.errorMsgEnabled){$(obj).attr('error-msg', settings.error.errorMsg.tooShort.toString());};
                valid = false;
            }
        }

        //Validierung nach Länge(max)
        var attrMax = $(obj).attr('max');
        if (typeof attrMax !== typeof undefined && attrMax !== false) {
            if(attrMax < $(obj).val().length){
                if(settings.error.errorMsgEnabled){$(obj).attr('error-msg',settings.error.errorMsg.tooLong.toString());};
                valid = false;
            }
        }

        if (!valid) {
            $(obj).addClass(settings.error.errorClass);
            $(obj).change(function () {
                validateInput(obj);
            });
            return false;
        } else {
            $(obj).removeClass(settings.error.errorClass);
            return true;
        }
    }
}(jQuery));

