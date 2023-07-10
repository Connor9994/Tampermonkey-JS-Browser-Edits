// ==UserScript==
// @name         EmailSender
// @namespace    http://tampermonkey.net/
// @version      3.14
// @description  EOS Stuff
// @author       Connor Kaiser
// @grant        GM_openInTab
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @include      https://mail.google.com/mail/*@@@
// ==/UserScript==

(function()
 {
    if (window.top === window.self)
    {
        var SendButtonCount = 0
        var observer = new MutationObserver(function(mutations)
                                            {
            var Sendbutton = document.getElementsByClassName("T-I J-J5-Ji aoO v7 T-I-atl L3")

            if (Sendbutton != null && Sendbutton.length != SendButtonCount)
            {
                SendButtonCount = Sendbutton.length;
            }
            else
            {
                return;
            }

        document.getElementsByClassName("T-I J-J5-Ji aoO v7 T-I-atl L3")[0].click()
        setTimeout(function() {window.close();}, 5000);

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

    return;

})();