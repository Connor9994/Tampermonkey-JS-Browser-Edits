// ==UserScript==
// @name         NOC Closer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Close NOC Cases Automatically
// @author       Connor Kaiser
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      https://osisoft.lightning.force.*
// @grant        GM_openInTab
// @grant        unsafeWindow
// @grant        GM_setClipboard
// ==/UserScript==

//Resolution set as the following
//Issue Resolved Itself. If this device/machine runs into an error in the future, a new email will be generated automatically with the case number/link.

(function()
{
    document.body.addEventListener('keydown', function(e){}, true);
    document.addEventListener('keydown', function(e)
                              {
        if (e.keyCode == 78 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) //Pressed CTRL-ALT-N
        {
            //Start Script
            setTimeout(function() {FindCase();}, 0);
            return
        }
    }, false);
})();


function FindCase()
{
    console.log("FindCase()");
    var CasesOpen = document.getElementsByClassName("forcegenerated-flexipage-template viewport-constrained-template")
    var WhichCase
    for (let i = 0; i < CasesOpen.length; i++)
    {
        if (document.getElementsByClassName("forcegenerated-flexipage-template viewport-constrained-template")[i].offsetParent != null)
        {
            WhichCase = i
        }
    }

    CloseCase(CasesOpen,0,WhichCase)
    return
}

function CloseCase(CasesOpen,count,WhichCase)
{
    var DetailsButton = CasesOpen[WhichCase].getElementsByClassName("tabHeader")
    for (let i = 0; i < DetailsButton.length; i++)
    {
        if (DetailsButton[i].title == "Details")
        {
            DetailsButton[i].click()
            break;
        }
    }

    setTimeout(function() {CopyDescription(CasesOpen,WhichCase);}, 1000);
    return
}

function CopyDescription(CasesOpen,WhichCase)
{
    console.log("CopyDescription()");
    var TextHere = ""
    var CanBeResolved = 0
    CanBeResolved = CasesOpen[WhichCase].getElementsByClassName("slds-rich-text-editor__output uiOutputRichText forceOutputRichText")[0].innerText.match(/\b(\w*Open\w*)\b/)

    if (CanBeResolved == null)
    {
        try
        {
            var DetailsButton = CasesOpen[WhichCase].getElementsByClassName("tabHeader")
            for (let i = 0; i < DetailsButton.length; i++)
            {
                if (DetailsButton[i].title == "Details")
                {
                    DetailsButton[i].click()
                    break;
                }
            }

            TextHere = CasesOpen[WhichCase].getElementsByClassName("slds-form-element slds-hint-parent test-id__output-root slds-form-element_edit slds-form-element_readonly slds-form-element_stacked")[13].innerText.match(/^(.*)\(/m)[1]
            TextHere = TextHere.replace(/'(.*?)'/m,"<>")
            if (TextHere == null) {TextHere = CasesOpen[WhichCase].getElementsByClassName("slds-rich-text-editor__output uiOutputRichText forceOutputRichText")[0].innerText.match(/^(.*)$/m)}
        }
        catch (e){TextHere="Fail"}

        if (TextHere == "Fail")
        {
            setTimeout(function() {CopyDescription(CasesOpen,WhichCase);}, 100);
        }
        else
        {
            GM_setClipboard (TextHere);
            setTimeout(function() {WaitForPaste(TextHere,CasesOpen,WhichCase);}, 0);
        }
    }
    else
    {
        alert("NOC case isn't resolved")
    }
    return
}

function WaitForPaste(TextHere)
{
    console.log("WaitForPaste()");
    document.getElementsByClassName("magic-box-input")[0].children[1].focus()
    var TextBox = document.getElementsByClassName("magic-box-underlay")[0].children[0].children[0].children[0].getAttribute("data-value")
    if (TextBox == "")
    {
        setTimeout(function() {WaitForPaste(TextHere);}, 250);
    }
    else
    {
        document.getElementsByClassName("CoveoSearchButton coveo-accessible-button")[0].click()
        setTimeout(function() {document.getElementsByClassName("CoveoAttachToCase coveo-result-actions-menu-menu-item")[0].click()}, 3000);
        setTimeout(function() {EditDetails();}, 3500);
        document.getElementsByClassName("slds-button slds-button_icon test-id__inline-edit-trigger slds-button_icon slds-button_icon-small slds-shrink-none inline-edit-trigger slds-button_icon-container")[1].click()
    }
    return
}



function EditDetails()
{
    console.log("EditDetails()");
try
{
    document.getElementsByClassName("uiInput uiInputSelect forceInputPicklist uiInput--default uiInput--select")[1].children[1].children[0].children[0].children[0].children[0].click()
    var Types = document.getElementsByClassName("uiMenuItem uiRadioMenuItem")
    for (let i = 0; i < Types.length; i++)
    {
        if (Types[i].innerText == "Run-time / Function")
        {
            Types[i].children[0].click()
            break;
        }
    }
    try {document.getElementsByClassName("ql-editor ql-blank slds-rich-text-area__content slds-text-color_weak slds-grow expandedMonkey")[0].innerText = "Issue Resolved Itself. If this device/machine runs into an error in the future, a new email will be generated automatically with the case number/link."} catch(er) {}
    GM_setClipboard ("Connor Kaiser");
    setTimeout(function() {document.getElementsByClassName("slds-button slds-button--neutral uiButton--brand uiButton forceActionButton")[0].click()},1000); //Save after a delay

    try {if (document.getElementsByClassName("slds-button slds-button--neutral slds-truncate")[1].children[0].innerText == "Change Owner") {document.getElementsByClassName("slds-button slds-button--neutral slds-truncate")[1].children[0].click()}} catch(er) {}
    try {if (document.getElementsByClassName("slds-button slds-button--neutral slds-truncate")[2].children[0].innerText == "Change Owner") {document.getElementsByClassName("slds-button slds-button--neutral slds-truncate")[2].children[0].click()}} catch(er) {}
    try {if (document.getElementsByClassName("slds-button slds-button--neutral slds-truncate")[3].children[0].innerText == "Change Owner") {document.getElementsByClassName("slds-button slds-button--neutral slds-truncate")[3].children[0].click()}} catch(er) {}
    setTimeout(function() {ChangeOwner();}, 1500);
}
catch (e) {setTimeout(function() {EditDetails();}, 100);}
}


function ChangeOwner()
{
    console.log("ChangeOwner()");
    var NameBox = document.getElementsByClassName("default input uiInput uiInputTextForAutocomplete uiInput--default uiInput--input uiInput uiAutocomplete uiInput--default uiInput--lookup")
    NameBox[NameBox.length-1].focus()
    var UserList = document.getElementsByClassName("primaryLabel slds-truncate slds-lookup__result-text")
    if (UserList.length > 0)
    {
        setTimeout(function() {SelectNameAfterDelay(UserList);}, 1000);
    }
    else
    {
       setTimeout(function() {ChangeOwner();}, 100);
    }
    return
}

function SelectNameAfterDelay(UserList)
{
    console.log("SelectNameAfterDelay()");
    var Found = ""
    for (let i = UserList.length-1; i >= 0; i--)
    {
        if (UserList[i].innerText == "Connor Kaiser")
        {
            UserList[i].click()
            document.getElementsByClassName("slds-button slds-button--neutral uiButton--default uiButton--brand uiButton forceActionButton")[0].click() //Save Button
            break
        }
        if (i == 0)
        {
            setTimeout(function() {SelectNameAfterDelay(UserList);}, 250);
        }
    }
    setTimeout(function() {CloseNOC();}, 100);
    return
}

function CloseNOC()
{
    console.log("CloseNOC()");
    document.getElementsByClassName("slds-button slds-button_neutral slds-button_brand cOSIS_Close_NOC_Case")[0].click()
    setTimeout(function() {document.getElementsByClassName("slds-button slds-button_neutral slds-float_right")[0].click()}, 100);
    return
}