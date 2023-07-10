// ==UserScript==
// @name         Product Content Downloads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      https://osisoft.lightning.force.*
// ==/UserScript==

(function()
 {
    if (window.top === window.self)
    {
        var TextFieldCount = 0;
        var observer = new MutationObserver(function(mutations)
                                            {
            var TextFieldsStart = document.getElementsByClassName("slds-form-element slds-form-element_readonly slds-grow slds-hint-parent override--slds-form-element");
            if (TextFieldsStart != null && (TextFieldsStart.length != TextFieldCount))
            {
                TextFieldCount = TextFieldsStart.length;
            }
            else
            {
                return;
            }

            var CasesOpen = document.getElementsByClassName("slds-brand-band slds-brand-band_cover slds-brand-band_medium slds-template_default forceBrandBand")
            for (let i = 0; i < CasesOpen.length; i++)
            {
                var TextFields = CasesOpen[i].getElementsByClassName("slds-form-element slds-hint-parent test-id__output-root slds-form-element_readonly slds-form-element_stacked")

                for (let j = 0; j < TextFields.length; j++)
                {
                    if (TextFields[j].innerText.match("Visibility\nInternal"))
                    {
                    }
                }
            }



        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
        return;
    }
    else
    {
        return;
    }
})();
