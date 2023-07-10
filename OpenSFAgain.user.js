// ==UserScript==
// @name         OpenSFAgain
// @namespace    http://tampermonkey.net/
// @version      0
// @description  EOS Stuff
// @grant        GM_openInTab
// @author       Connor Kaiser
// @include      https://*signoutcleanup*
// ==/UserScript==

(function()
 {
    GM_openInTab("https://osisoft.lightning.force.com/lightning/page/home");
    window.close();
})();