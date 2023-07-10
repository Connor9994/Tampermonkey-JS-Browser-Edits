// ==UserScript==
// @name         OMNI Grabber
// @namespace    http://tampermonkey.net/
// @version      3.14
// @description  Remove NOC "Closed" Button
// @author       Connor Kaiser
// @grant        GM_openInTab
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      https://osisoft.lightning.force.*
// ==/UserScript==

(function() {
    var OMNICount = 0
    if (window.top === window.self)
    {
        var observer = new MutationObserver(function(mutations)
                                            {
            var omniParent = document.getElementsByClassName("row runtime_service_omnichannelAbstractPushedRequest runtime_service_omnichannelPushedEntityRequest")

            if (omniParent != null && omniParent.length != OMNICount)
            {
                OMNICount = omniParent.length
            }
            else
            {
                return;
            }

            //Get Secondary Text. E.g. 00564620 | PI Data Archive | Specialist Request
            var Container = omniParent[0].getElementsByClassName("slds-button slds-button_icon slds-button_icon-border")[1]
            var secondaryField = Container.innerText;

            var Text;
            if (document.getElementById("CaseGrab").value == "")
            {
                Text = null
            }
            else
            {
                Text = document.getElementById("CaseGrab").value
            }

            if (secondaryField.match("System ID: "))
            {
                var d = new Date();
                if (d.getHours() >= 8 && d.getHours() <= 16 ) //8am-5pm
                {

                    Container.click() //Accept case

                    setTimeout(function() {document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container")[document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container").length-1].click()
                                          }, 4000);

                    setTimeout(function() {GM_openInTab("https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&cc=ct1kaiser@gmail.com&su=Picked+up+a+NOC+Case&body=+@@@");}, 4000);
                }
            }
            else if (secondaryField.match(Text))
            {
                Container.click() //Accept case
            }
            else
            {
                if (document.getElementById("OMNIButton").innerText == "On") //Reject all cases when On
                {
                    omniParent[0].getElementsByClassName("slds-button slds-button_icon slds-button_icon-border")[0].click() //Reject case
                    var buttons = document.getElementsByClassName("slds-button slds-button_brand")
                    for(let i=0;i<buttons.length;i++)
                    {
                        if(buttons[i].innerText.match("Submit"))
                        {
                            buttons[i].click()
                        }
                    }
                }
                //Comment line to receive normal cases again
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
    else
    {
        return;
    }

})();