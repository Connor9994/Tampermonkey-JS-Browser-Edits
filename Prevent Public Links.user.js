// ==UserScript==
// @name         Prevent Public Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove NOC "Closed" Button
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
        var SendButtonCount = 0;

        var observer = new MutationObserver(function(mutations)
                                            {
            var Sendbuttons = document.getElementsByClassName("slds-button slds-button--brand cuf-publisherShareButton MEDIUM uiButton")

            if (Sendbuttons != null && Sendbuttons.length != SendButtonCount)
            {
                SendButtonCount = Sendbuttons.length;
            }
            else
            {
                return;
            }

            //Code
            for(let i=0;i<Sendbuttons.length;i++)
            {
                Sendbuttons[i].addEventListener("click",LinkRedirect, true);
                Sendbuttons[i].style.paddingLeft = "0rem"
                Sendbuttons[i].style.paddingRight = "0rem"
                Sendbuttons[i].style.borderWidth = "0px"
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

function LinkRedirect(event)
{
    var TextBox = document.getElementById("editor_rta_body")
    if (TextBox.innerHTML.match("osisoft.lightning.force.com").index > -1)
    {
        event.preventDefault();
        event.stopPropagation();
        return false
    }
    else
    {
        return false
    }
}

