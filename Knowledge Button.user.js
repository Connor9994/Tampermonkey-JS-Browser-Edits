// ==UserScript==
// @name         Knowledge Button
// @namespace    http://tampermonkey.net/
// @version      0
// @description  Available/Busy -> Available Manual
// @author       Connor Kaiser
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      chrome-extension://mlaaggnackjlebchmgklbjjjbajgdemb/RandomName.js
// @include      chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/content.js
// @grant        unsafeWindow
// @run-at       document-end
// @noframes
// ==/UserScript==

(function()
 {
        alert("hey")
        var StatusCount = 0;
        var CaseCount = 0;

        var observer = new MutationObserver(function(mutations)
                                            {
            try{window.document.getElementsByTagName("lightning-base-combobox-item")[10].click()} catch(er) {}
            try{var OptionsList = document.getElementsByTagName("lightning-base-combobox-item")[10].click()} catch(er) {console.log("nah")}
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

            try {var ChildrenCount = document.getElementsByClassName("slds-combobox-group forceSearchDesktopHeader")[0].children.length} catch(err) {ChildrenCount = 5}
            if (ChildrenCount <= 2)
            {
                document.getElementsByClassName("slds-form-element")[0].getElementsByClassName("slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click")[0].click()
                document.getElementsByClassName("slds-combobox-group forceSearchDesktopHeader")[0].insertAdjacentHTML("afterbegin",'<button type="button" style="/* margin-top: 5px; */margin-right: 10px;" id="KnowledgeButton" <="" button="">Knowledge</button>')
                try{document.getElementById("KnowledgeButton").addEventListener ("click", KnowledgeButton, false);} catch(err) {}
            }


        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
})();

function KnowledgeButton()
{
    //document.getElementsByClassName("slds-form-element")[0].getElementsByClassName("slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click")[0].click()
    try{
        setTimeout(function() {
            var OptionsList = document.getElementsByTagName("lightning-base-combobox-item")[10].click()

            for (let i = 0; i < OptionsList.length; i++)
            {
                if (OptionsList[i].innerText == "Knowledge")
                {
                    OptionsList[i].children[0].click()
                }
            }
        }, 1000);
    }
    catch(er){console.log("Failed")}
    return
}