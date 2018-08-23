/*
    TODO:
        - Error Msg after Input field        
    FIXME:

*/
(function ($) {
    var settings;
    var form;

    $.fn.set = function (options) {

        // Default options
        settings = $.extend({
            requiredClass: 'required',
            error: {
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
            if (validForm == true) {
                validForm = res;
            }
        });

        //Submit form falls enabled
        if (validForm && settings.submitOnSuccess) {
            $(form).submit()
        }

        return validForm;
    }

    function validateInput(obj) {
        var valid = true;

        //Validierung nach Datentyp und default
        switch ($(obj).attr("data-type")) {
            case "number":
                valid = /^\d+$/.test($(obj).val());
                $(obj).next("small").remove();

                if (!(/^\d+$/.test($(obj).val()))) {
                    if (settings.error.errorMsgEnabled) {
                         $(obj).attr('error-msg', settings.error.errorMsg.wrongInputType.toString());
                         $(obj).after("<small class='form-text text-muted'>"+ settings.error.errorMsg.wrongInputType + "</small>") };
                }
                break;

            case "mail":
                const regexMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                valid = regexMail.test($(obj).val())
                $(obj).next("small").remove();
                
                if (!(regexMail.test($(obj).val()))) {
                    if (settings.error.errorMsgEnabled) {
                        $(obj).attr('error-msg', settings.error.errorMsg.notMail.toString());
                        $(obj).after("<small class='form-text text-muted'>"+ settings.error.errorMsg.notMail + "</small>")
                    };
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
        if (typeof attrMin !== typeof undefined && attrMin !== false && valid) {
            if (attrMin > $(obj).val().length) {
                if (settings.error.errorMsgEnabled) {
                    $(obj).attr('error-msg', settings.error.errorMsg.tooShort.toString());
                    $(obj).next("small").remove();
                    $(obj).after("<small class='form-text text-muted'>" + settings.error.errorMsg.tooShort + "</small>")
                };
                valid = false;
            }
        }

        //Validierung nach Länge(max)
        var attrMax = $(obj).attr('max');
        if (typeof attrMax !== typeof undefined && attrMax !== false) {
            if (attrMax < $(obj).val().length) {
                if (settings.error.errorMsgEnabled) {
                    $(obj).attr('error-msg', settings.error.errorMsg.tooLong.toString());
                    $(obj).next("small").remove();
                    $(obj).after("<small class='form-text text-muted'>" + settings.error.errorMsg.tooLong + "</small>")
                };
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

