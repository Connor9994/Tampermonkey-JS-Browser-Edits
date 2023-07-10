// ==UserScript==
// @name         OMNI Case Opener
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Connor Kaiser
// @author       You
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      https://osisoft.lightning.force.*
// @grant        none
// ==/UserScript==

(function() {
    document.body.addEventListener('keydown', function(e){}, true);
    document.addEventListener('keydown', function(e)
    {
        if (e.keyCode == 32 && e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) //Pressed Ctrl-Shift-Space
        {
            try
            {
                var CaseID = document.getElementsByClassName("visible")[0].children[0].getAttribute("data-worktargetid")
                var URL = "https://osisoft.lightning.force.com/lightning/r/Case/" + CaseID + "/view"
                window.open(URL)
            }
            catch(er){}
        }
    }, false);
})();