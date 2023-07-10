// ==UserScript==
// @name         Screenshots
// @namespace    http://tampermonkey.net/
// @version      0
// @description  Paste Screenshots in Salesforce's Case Feed
// @author       Connor Kaiser
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      https://osisoft.lightning.force.*
// @grant        none
// ==/UserScript==

(function()
{
    //Enable Hotkeys?
    var Screenshots = true        //Handles screenshots pasted into the Case Feed [CTRL-V]
    var OpenEntries = false        //Hotkey to expand all entries                  [SHIFT-C]
    var CloseEntries = false       //Hotkey to close all entries                   [ALT-C]
    var OmniCaseOpener = true     //Hotkey to open current Omni-Channel Case      [CTRL-SHIFT-SPACE]

document.body.addEventListener('keydown', function(e){}, true);
	document.addEventListener('keydown', function(e)
	{
        if (Screenshots == true)
        {
            if (e.keyCode == 86 && !e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) //Pressed CTRL-V
            {
                if (document.getElementsByClassName("modal-container slds-modal__container").length == 0)
                {
                    //Hide CTRL-V Salesforce error
                    document.getElementsByClassName("forceVisualMessageQueue")[0].setAttribute("style","opacity: 0;")

                    if (window.getSelection().type == "Range") //If the user was dragging/highlighting text: Increase Delay
                    {
                        setTimeout(function() {PasteHandlerEntry();}, 2000); //Return to function and check for new changes
                        return;
                    }

                    //Start Script
                    setTimeout(function() {PasteHandlerEntry();}, 0);
                }
                return
            }
        }

        var CasesOpen
        var WhichCase
        var PreviousScroll

        if (OpenEntries == true)
        {
            if (e.keyCode == 67 && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) //Pressed Shift-C
            {
                CasesOpen = document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")
                for (let i = 0; i < CasesOpen.length; i++)
                {
                    if (document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")[i].offsetParent != null)
                    {
                        WhichCase = i
                    }
                }
                PreviousScroll = document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")[WhichCase].scrollTop
                OpenAllEntries(WhichCase,PreviousScroll)
                return
            }
        }

        if (CloseEntries == true)
        {
            if (e.keyCode == 67 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) //Pressed Alt-C
            {
                CasesOpen = document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")
                WhichCase
                for (let i = 0; i < CasesOpen.length; i++)
                {
                    if (document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")[i].offsetParent != null)
                    {
                        WhichCase = i
                    }
                }
                PreviousScroll = document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")[WhichCase].scrollTop
                RefreshCase(WhichCase)
                return
            }
        }
        if (OmniCaseOpener == true)
        {
            if (e.keyCode == 32 && e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) //Pressed Ctrl-Shift-Space
            {
                OpenCases()
            }
        }

	}, false);
})();


function OpenCases()
{
    try
    {
        var CaseID = document.getElementsByClassName("visible")[0].children[0].getAttribute("data-worktargetid")
        var URL = "https://osisoft.lightning.force.com/lightning/r/Case/" + CaseID + "/view"
        window.open(URL)
    }
    catch(er){}
}

function RefreshCase(WhichCase)
{
    document.getElementsByClassName("slds-dropdown-trigger slds-dropdown-trigger_click tabActionsList")[WhichCase].children[0].click() //Drop-down menu for the case
    document.getElementsByClassName("slds-dropdown-trigger slds-dropdown-trigger_click tabActionsList")[WhichCase].children[1].children[0].children[0].children[0].children[0].click() //Drill down to avoid loading all refresh buttons for consistency

    //Return to top of case
    document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")[WhichCase].scrollTop = 0
    return
}

function OpenAllEntries(WhichCase,PreviousScroll)
{
    var Entry
    //Expand Entries if possible ("View More" button that appears on longer cases)
    try{Entry = document.getElementsByClassName("slds-button slds-button_brand cuf-showMore slds-button slds-m-top_medium")}catch(err){Entry = null}
    if(Entry != null)
    {
        try{document.getElementsByClassName("slds-button slds-button_brand cuf-showMore slds-button slds-m-top_medium")[0].click()}catch(err){}
    }

    //Scroll down until at the bottom of the page
    document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")[WhichCase].scrollBy(0,10000)
    var CurrentScroll = document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")[WhichCase].scrollTop
    if(CurrentScroll != PreviousScroll) //We are somewhere in the page (not at the bottom)
    {
        PreviousScroll = document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")[WhichCase].scrollTop
        setTimeout(function() {OpenAllEntries(WhichCase,PreviousScroll)}, 500);
    }
    else //Bottom of the page
    {
        var Found //Index of first entry to open
        var ClosedEntries = document.getElementsByClassName("chevron-icon slds-icon_container slds-icon-utility-chevronright")

        //Find first entry to open
        for (let i = 0; i < ClosedEntries.length; i++)
        {
            try{Entry = ClosedEntries[i].offsetParent}catch(err){Entry = null}
            if (Entry != null)
            {
                Found = i
                break
            }
        }

        //Open entries until no more are on-screen
        try{Entry = ClosedEntries[Found].offsetParent}catch(err){Entry = null}
        while (Entry != null)
        {
            try{ClosedEntries[Found].click()}catch(err){}
            try{Entry = ClosedEntries[Found].offsetParent}catch(err){Entry = null}
        }

        //Find and expand entries if neccesary
        var ExpandableEntries = document.getElementsByClassName("cuf-more fadeOut")
        for (let i = ExpandableEntries.length; i >= 0; i--)
        {
            try{Entry = ExpandableEntries[i].offsetParent}catch(err){Entry = null}
            if (Entry != null)
            {
                try{ExpandableEntries[i].focus()}catch(err){}
                try{ExpandableEntries[i].click()}catch(err){}
            }
        }

        //Return to top of case
        document.getElementsByClassName("col pinnedLeftRightSidebars pinnedLeftRightSidebarsMainRegion forceTemplateWorkspaceWrapper")[WhichCase].scrollTop = 0
    }
return
}

function PasteHandlerEntry() //Capture text box before pasted content has loaded
{
    var CasesOpen = document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")
    var WhichCase
    for (let i = 0; i < CasesOpen.length; i++)
    {
        if (document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")[i].offsetParent != null)
        {
            WhichCase = i
        }
    }

    //Add Loading Bar
    AddLoadingBar(true,WhichCase)

    var objectBeforeArray = [] //Initialize Array of text box BEFORE text is pasted
    var objectBefore = document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")[WhichCase].children //HTML Parent

	for (let i = 0; i < objectBefore.length; i++) //Build Array from HTML Parent
    {
           objectBeforeArray.push(objectBefore[i].innerHTML)
    }

    var textBefore = document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")[WhichCase].innerHTML //Inner Text BEFORE paste
    waitForPaste(textBefore,objectBeforeArray,0,0,WhichCase) //Continue
	return
}

function waitForPaste(textBefore,objectBeforeArray,count,order,WhichCase) //Detect when the paste has completed (images will take a bit to load)
{
    var objectNowArray = [] //Initialize Array of text box AFTER text is pasted
    var objectNow = document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")[WhichCase].children //HTML Parent

	for (let i = 0; i < objectNow.length; i++) //Build Array from HTML Parent
    {
           objectNowArray.push(objectNow[i].innerHTML)
    }

    var textNow = document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")[WhichCase].innerHTML //Inner Text AFTER paste
    var SRCs = 0 //How many pictures
    var FileIDs = 0 //How many pictures have an ID (configured correctly)

    if(textNow != textBefore) //If text box changes
    {
        if (order == 0)
        {
            setTimeout(function() {waitForPaste(textNow,objectBeforeArray,count,1,WhichCase);}, 10); //Detect first change in HTML
            return;
        }

        for (let i = 0; i < objectNowArray.length; i++)
        {
            if(objectNowArray[i].includes("src") == true)
            {
                try{SRCs = textNow.match(/src/g).length} catch(err){}
                try{FileIDs = textNow.match(/data-fileid/g).length} catch(err){}
                if(SRCs != FileIDs)
                {
                    setTimeout(function() {PasteHandlerExit(objectBeforeArray,objectNowArray,WhichCase);}, 2000); //Continue after delay to handle slower images
                    return;
                }
            }
        }
        AddLoadingBar(false,WhichCase) //Remove Loading Bar
    }

    else //If text box remains the same (loading or paste was empty)
    {
        if (count >= 300) //Error handling for pasting from an empty clipboard (Effectively a 5 second timeout)
        {
            AddLoadingBar(false,WhichCase) //Remove Loading Bar
        }
        else
        {
			count++ //Count used to pause script while waiting for changes
            setTimeout(function() {waitForPaste(textNow,objectBeforeArray,count,true,WhichCase);}, 10); //Return to function and check for new changes
        }
    }
    return
}

function PasteHandlerExit(objectBeforeArray,objectNowArray,WhichCase) //Find where image was pasted and remove it temporarily
{
var differentObject
    for (let i = 0; i < objectNowArray.length; i++) //Find Which Line(s) Changed
    {
		if(!objectBeforeArray.includes(objectNowArray[i]))
        {
			differentObject = i //Index of which line changed
        }
    }

var innerText = document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")[WhichCase].children[differentObject].innerHTML //Inner Text AFTER paste
var FindImages = innerText.match(/<img.*?>/g) //Make an array of images found on the different line
var FoundIndexes = [] //Array for index(es) of the images on the changed line (these are not children they are the actual inner text indexes) so if the line with the image (in HTML) is
				      //"Hey(Picture1)(Picture2)" the index the picture starts on, or FoundIndexes[0], is 3 and FoundIndexes[1] is 14 (images are typically 200+ characters long however)

var ImageOrNah = false

    if (FindImages != null)
    {
        for (let i = 0; i < FindImages.length; i++) //Check every image found for which is the un-fixed image
        {
            if(FindImages[i].includes("data-fileid") == false && objectNowArray[differentObject].includes("src") == true) //Check if there is an un-fixed picture in the line [i]
            {
                FoundIndexes.push(innerText.indexOf(FindImages[i])) //Save Index of un-fixed image
                var pictureLength = FindImages[i].length //Save inner HTML length of the un-fixed image
                ImageOrNah = true //Bad variable title to specify that an image needs to be fixed
            }
        }
    }

var tempText //Place holder to handle text modifications

	if (ImageOrNah == true) //If an image in the different line needs to be fixed
	{
    var innerTextTemp=innerText.replace(/<span class="ql-cursor".*?n>/, ""); //Error handling for cursor insertion (happens occasionally)
    innerText = innerTextTemp 												 //Removes HTML cursor indicator

        for (let i = 0; i < FoundIndexes.length; i++)
        {
            if(FoundIndexes[i] == 0) //If image is at the very beginning of the line
            {
                tempText = innerText.slice((FindImages[i].length), innerText.length) //Temp line is everything but the picture
            }
            else //Image is somewhere else on the line besides [0]
            {
                tempText = innerText.slice(0, FoundIndexes[i]) + innerText.slice((FoundIndexes[i] + pictureLength), innerText.length) //Temp line is everything but the picture
            }
        }

    document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")[WhichCase].children[differentObject].innerHTML = tempText //Remove Picture
	OpenMenu(differentObject,FoundIndexes,WhichCase) //Continue
	}
    else if (ImageOrNah == false) //If no images need to be fixed, stop running any code and remove the loading bar (handles pasted text)
    {
		AddLoadingBar(false,WhichCase) //Remove Loading Bar
    }
    return
}

function OpenMenu (differentObject, FoundIndexes,WhichCase) //Start adding the image the "correct" way
{
      document.getElementsByClassName("slds-button slds-button--neutral slds-col slds-no-space dummyButtonCallToAction uiButton")[WhichCase].click() //Clicks inside of textbox (error handle)
      document.getElementsByClassName("slds-button image slds-button_icon-border-filled")[WhichCase].click() //Click Image Button (separated from next function because of looping functionality)
      waitForImagesToDisplay(differentObject, FoundIndexes,WhichCase) //Continue
	  return
}

function waitForImagesToDisplay(differentObject, FoundIndexes,WhichCase) //Wait for image menu to load fully before adding the image
{
	if(document.getElementsByClassName("slds-size_12-of-12 slds-grid slds-nowrap").length > 0)
    {
        document.getElementsByClassName("slds-show_inline-block slds-float_left slds-align-middle thumbnailImg medium")[0].click() //Click first image of pop-up
        document.getElementsByClassName("slds-button slds-button--neutral attach uiButton--default uiButton--brand uiButton")[0].click() //Click the "Insert" button
        waitForElementToPaste(differentObject,FoundIndexes,WhichCase) //Continue
    }
    else
	{
		setTimeout(function() {waitForImagesToDisplay(differentObject, FoundIndexes,WhichCase);}, 100);
    }
	return
}

function waitForElementToPaste(differentObject, FoundIndexes,WhichCase) //After image fully loads, remove the loading indicator
{
	if(document.getElementsByClassName("slds-size_12-of-12 slds-grid slds-nowrap").length == 0)
    {
		var innerText = document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")[WhichCase].children[differentObject].innerHTML //Inner Text AFTER paste
        var newImageText = innerText.match(/<img.*?>/) //Save Image for later
		var innerTextTemp=innerText.replace(/<img.*?>/, ""); //Delete Image from start of line

		//Paste image in the correct location
        var temp = innerTextTemp.slice(0, FoundIndexes[0]) + newImageText + innerTextTemp.slice((FoundIndexes[0]), innerTextTemp.length);
		document.getElementsByClassName("ql-editor slds-rich-text-area__content slds-text-color_weak slds-grow")[WhichCase].children[differentObject].innerHTML = temp

        //Remove Loading Bar
        AddLoadingBar(false,WhichCase)
    }
    else
    {
        setTimeout(function() {waitForElementToPaste(differentObject, FoundIndexes,WhichCase);}, 100);
    }
	return
}

function AddLoadingBar(bool,WhichCase)
{
if (bool)
    {
    //Add Loading Bar
    document.getElementsByClassName("slds-button-group-list")[WhichCase*3+2].insertAdjacentHTML('beforeend','<button class="slds-button slds-button_neutral" type="button" title="Screenshot is loading" data-aura-rendered-by="" tabindex="-1"><span class="slds-assistive-text" data-aura-rendered-by="">Screenshot is loading</span><font color="black"><b>Loading...</b><font color=""></font></font></button>')
    }
    else
    {
    //Remove Loading Bar
    var object = document.getElementsByClassName("slds-button-group-list")[WhichCase*3+2]
    object.removeChild(object.childNodes[5]);
    setTimeout(function() {RemoveErrors();}, 2000);
    }
}

function RemoveErrors()
{
document.getElementsByClassName("forceVisualMessageQueue")[0].setAttribute("style","opacity: 1;")
}