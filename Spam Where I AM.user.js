// ==UserScript==
// @name         Spam Where I AM
// @namespace    http://tampermonkey.net/
// @version      1
// @author       You
// @include      https://osisoft.my.salesforce.com/email/htmlbody/htmlbody.jsp?id=*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    setTimeout(function() {
        //console.log("hey")
        //console.log(window.location)
        document.getElementById("cke_1_toolbox").insertAdjacentHTML("beforeend",'<button class="NOC_button" type="button" data-aura-rendered-by="2844:0" data-aura-class="cOSIS_CC_NOC_Contact" style="color: blue;align-content: center;" id="NOC_button">Fix NOC Email 👌</button>')
        try{document.getElementById("NOC_button").addEventListener("click", FixNOCEmail,1500)}catch(err) {}
        }, 500);
})();

function FixNOCEmail(event)
{
    var Email = document.getElementsByClassName("cke_wysiwyg_frame cke_reset")[0].contentDocument.body.innerText;
    var EmailByLine = Email.split('\n')
    //console.log(Email)
    var CaseNumber = EmailByLine[0]
    var CaseLink = EmailByLine[1]
    var Sig1 = EmailByLine[EmailByLine.length - 3]
    var Sig2 = EmailByLine[EmailByLine.length - 2]
    var Sig3 = EmailByLine[EmailByLine.length - 1]
    try {var serverName = Email.match(/( - )(.*?)( - )(.*?)( - )/)[2]} catch(er){serverName = "AAAN"}
    var serverIssue = "AAAI"
    var FinalText = []

    FinalText = FinalText.concat(['All,\n','\n','A NOC monitored machine, ',serverName,', is having issues with the NOC in the following state:\n\n',serverIssue,'\n\n'])
    FinalText = FinalText.concat(['a simple restart of the mPI services may resolve the issue but further troubleshooting might be required.\n\n'])
    FinalText = FinalText.concat([CaseNumber,"\n",CaseLink])
    FinalText = FinalText.concat(['\n\n','Best,\n\n',Sig1,'\n',Sig2,'\n',Sig3,'\n'])
    FinalText = FinalText.join('');

    //GM_setClipboard (FinalText);
    //document.getElementsByClassName("cke_wysiwyg_frame cke_reset")[0].contentDocument.body.innerText = "" //Clear Email after Copying
    document.getElementsByClassName("cke_wysiwyg_frame cke_reset")[0].contentDocument.body.innerText = FinalText

    var HTMLLines = document.getElementsByClassName("cke_wysiwyg_frame cke_reset")[0].contentDocument.getElementsByClassName("cke_editable cke_editable_themed cke_contents_ltr cke_show_borders")[0].innerHTML
    HTMLLines= HTMLLines.replace(serverIssue,"<b>"+serverIssue+"</b>")
    HTMLLines= HTMLLines.replace(CaseNumber,"<b>"+CaseNumber+"</b>")
    HTMLLines= HTMLLines.replace(/(Case Link:)(.*?)(?=<br>)/gm,"<b>"+CaseLink+"</b>")
    //Case Link: https://customers.osisoft.com/s/casedetail?listViewType=Home&id=5001I00000aFgTK
    console.log("Caselink (" + CaseLink + ")")
    document.getElementsByClassName("cke_wysiwyg_frame cke_reset")[0].contentDocument.getElementsByClassName("cke_editable cke_editable_themed cke_contents_ltr cke_show_borders")[0].innerHTML = HTMLLines

    console.log("Case Number: " + CaseNumber)
    console.log("Case Link: " + CaseLink)
    console.log("Sig1: " + Sig1)
    console.log("Sig2: " + Sig2)
    console.log("Sig3: " + Sig3)
    console.log(HTMLLines)

    event.preventDefault();
    event.stopPropagation();
    return;
}