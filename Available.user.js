// ==UserScript==
// @name         Available
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Available/Busy -> Available Manual
// @author       Connor Kaiser
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      https://osisoft.lightning.force.*
// @grant        none
// ==/UserScript==

(function()
 {
    if (window.top === window.self)
    {
    var StatusCount = 0;
    var CaseCount = 0;
        var observer = new MutationObserver(function(mutations)
                                            {
            var Status = document.getElementsByClassName("onlineStatus truncatedText uiOutputText")
            var CasesOpen = document.getElementsByClassName("flexipageRecordHomePinnedLeftRightSidebarsTemplateDesktop");

            if (Status != null && (Status.length != StatusCount || CasesOpen.length != CaseCount))
            {
                StatusCount = Status.length
                CaseCount = CasesOpen.length
            }
            else
            {
                return;
            }

            try
            {
                //Available
                if (document.getElementsByClassName("onlineStatus truncatedText uiOutputText")[0].innerText == "Available Manual")
                {
                    document.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[document.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small").length-1].click()
                    //document.getElementsByClassName("slds-dropdown__item onlineStatus")[1].children[0].click() //Available Manual
                    document.getElementsByClassName("slds-dropdown__item onlineStatus")[0].children[0].click() //Available
                }
            }
            catch(er){}

            try
            {
                //Busy
                if (document.getElementsByClassName("awayStatus truncatedText uiOutputText")[0].innerText == "Busy")
                {
                    document.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[document.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small").length-1].click()
                    //document.getElementsByClassName("slds-dropdown__item onlineStatus")[1].children[0].click() //Available Manual
                    document.getElementsByClassName("slds-dropdown__item onlineStatus")[0].children[0].click() //Available
                }
            }
            catch (err){}



            try
            {
                //Offline
                if (document.getElementsByClassName("onlineStatus truncatedText uiOutputText")[0].innerText == "Offline")
                {
                    document.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[document.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small").length-1].click()
                    //document.getElementsByClassName("slds-dropdown__item onlineStatus")[1].children[0].click() //Available Manual
                    document.getElementsByClassName("slds-dropdown__item onlineStatus")[0].children[0].click() //Available
                }
            }
            catch(er){}



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