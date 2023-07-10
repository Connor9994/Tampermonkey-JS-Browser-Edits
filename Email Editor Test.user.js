// ==UserScript==
// @name         Email Editor Test
// @namespace    http://tampermonkey.net/
// @version      0
// @description  EOS Stuff
// @author       Connor Kaiser
// @include      https://osisoft.my.salesforce.com/email/*
// @grant        GM_download
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function()
 {
    console.log("Email Editor Test Start")
    if (window.top === window.self)
    {
        alert("1")
    }
    else
    {
        alert("2")
        //Currently an iFrame inside of the initial iFrame
        if (document.body.hasAttribute("contenteditable"))
        {
        document.body.insertAdjacentHTML("beforebegin",'<div class="btnBrRound5 hpIconDiv btnDivEnable" id="NOCButton"><div class="hpIcon" style="padding-top: 5px;padding-left: 5px">EOS</div></div>');
        document.getElementById("NOCButton").addEventListener ("click", NOCButton, false);
        }
    }
})();

function NOCButton()
{
    //Fire on SF email being detected
    try{var Signature = document.getElementsByClassName("cke_editable cke_editable_themed cke_contents_ltr cke_show_borders")[0].innerText.split("--------------- Original Message ---------------")[1].split("San Leandro Tech Campus | 1600 Alvarado St. San Leandro, CA 94577")[1].trim()} catch(err) {}

    try{var Location = document.getElementsByClassName("cke_editable cke_editable_themed cke_contents_ltr cke_show_borders")[0].innerText.split("Location:")[1].split("\n")[0].trim()} catch(err) {}

    try{var CaseNumberAndLink = document.getElementsByClassName("cke_editable cke_editable_themed cke_contents_ltr cke_show_borders")[0].innerText.split("--------------- Original Message ---------------")[0].trim()} catch(err) {}
    alert("works")
}