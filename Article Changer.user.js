// ==UserScript==
// @name         Article Changer
// @namespace    http://tampermonkey.net/
// @version      0
// @description  Changes all cases under Article A (BadID) to Article B (ArticleID)
// @author       Connor Kaiser
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      https://osisoft.lightning.force.*
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// ==/UserScript==

//Resolution set as the following
//Issue Resolved Itself. If this device/machine runs into an error in the future, a new email will be generated automatically with the case number/link.

(function()
 {
    document.body.addEventListener('keydown', function(e){}, true);
    document.addEventListener('keydown', function(e)
                              {
        if (e.keyCode == 65 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) //Pressed CTRL-ALT-A
        {
            StartOfCode(1,-1)
            return
        }
    }, false);
})();

function StartOfCode(FirstRun,ArticleID)
{
    console.log("StartOfCode(FirstRun: " + FirstRun + " ArticleID: " + ArticleID);
    var CaseLists = document.getElementsByClassName("slds-table forceRecordLayout slds-table--header-fixed slds-table--edit slds-table--bordered resizable-cols slds-table--resizable-cols uiVirtualDataTable")
    for (let i = 0; i < CaseLists.length; i++)
    {
        if (CaseLists[i].offsetParent != null)
        {
            var FinalList = CaseLists[i] //This list of cases is on screen and should be processed
            if (FirstRun)
            {
                ArticleID = window.prompt("Enter the ID of the CORRECT article (eg. 000001421): ","")
            }
            if (ArticleID.length < 9)
            {
                alert("Please include all 9 numbers (including leading 0's)")
                return
            }
            break;
        }
    }
    var BadID = document.getElementsByClassName("uiOutputText")
    var BadIDIndex
    for (let i = 0; i < BadID.length; i++)
    {
        if (BadID[i].innerText.match(/000(.*)/) != null)
        {
            BadID=BadID[i].innerText
            BadIDIndex = i
            break;
        }
    }

    //If there are no cases in this list, stop the code
    if (FinalList.children[FinalList.children.length-1].children.length == 0)
    {
        return
    }

    setTimeout(function() {OpenArticleList(FinalList,ArticleID,BadID,BadIDIndex,FirstRun);}, 0); //Pass list of cases to function
    return
}

function OpenArticleList(FinalList,ArticleID,BadID,BadIDIndex,FirstRun)
{
    console.log("OpenArticleList()");
    var BuildString = "You are about to switch over " + FinalList.children[FinalList.children.length-1].children.length + " cases to the article \"" + ArticleID + "\""
    var r = null

    if (FirstRun)
    {
        r = confirm(BuildString);
    }
    else
    {
        r=true
    }

    if (r == true)
    {
        var CaseToOpen = FinalList.children[FinalList.children.length-1].children[0] //Open list of cases, grab first case
        var CaseNumber = CaseToOpen.children[1].children[0].children[0].getAttribute("data-recordid")
        var ParentID = document.location.href.match(/(?<=r\/)(.*)(?=\/related)/)[0]
        var ArticlesLink = "https://osisoft.lightning.force.com/lightning/r/" + CaseNumber + "/related/CaseArticles/view?ws=%2Flightning%2Fr%2FKnowledgeArticleVersion%2F" + ParentID + "%2Fview"
        var CaseLink = "https://osisoft.lightning.force.com/lightning/r/Case/" + CaseNumber + "/view?ws=%2Flightning%2Fr%2FKnowledge__kav%2F" + ParentID + "%2Fview"
        GM_openInTab(ArticlesLink)
        setTimeout(function() {UnAttachArticle(ArticleID,BadID,ArticlesLink,CaseLink,ParentID,BadIDIndex);}, 1500);
    }
    else
    {
    }
    return
}

function UnAttachArticle(ArticleID,BadID,ArticlesLink,CaseLink,ParentID,BadIDIndex)
{
    console.log("UnAttachArticle()");
    var ArticleList
    var ListOfArticleLists = document.getElementsByClassName("slds-table forceRecordLayout slds-table--header-fixed slds-table--edit slds-table--bordered resizable-cols slds-table--resizable-cols uiVirtualDataTable")

    for (let i = 0; i < ListOfArticleLists.length; i++) //Make sure articles on screen are selected
    {
        if (ListOfArticleLists[i].offsetParent != null)
        {
            ArticleList = document.getElementsByClassName("slds-table forceRecordLayout slds-table--header-fixed slds-table--edit slds-table--bordered resizable-cols slds-table--resizable-cols uiVirtualDataTable")[i].children[2].children
            break;
        }
        if (i==ListOfArticleLists.length-1)
        {
            setTimeout(function() {UnAttachArticle(ArticleID,BadID,ArticlesLink,CaseLink,ParentID,BadIDIndex);}, 250);
        }
    }
    var UITEXTLength = document.getElementsByClassName("uiOutputText").length
    setTimeout(function() {FindPopups(ArticleID,BadID,ArticlesLink,CaseLink,ArticleList,0,UITEXTLength,0,BadIDIndex,ParentID,1,-1,-1);}, 250);
    return
}

function FindPopups(ArticleID,BadID,ArticlesLink,CaseLink,ArticleList,StartIndex,UITEXTLength,Skip,BadIDIndex,ParentID,Fresh,AddArticleIndex,RemoveArticleIndex)
{
    console.log("FindPopups()");
    var MatchWrong = null
    var MatchRight = null
    var UIButtons = null
    var ArticleNumber = null
    var StartOver = 0
    var TempArticleID

    if (Fresh)
    {
        TempArticleID = ArticleList[StartIndex].children[1].children[0].children[0].children[0].getAttribute("data-recordid")
        var Link = "https://osisoft.lightning.force.com/lightning/r/Knowledge__kav/" + TempArticleID + "/view?ws=%2Flightning%2Fr%2FKnowledge__kav%2F" + ParentID + "%2Fview"
        GM_openInTab(Link)
    }

    for (let i = StartIndex; i < ArticleList.length; i++)
    {
        if (UITEXTLength == document.getElementsByClassName("uiOutputText").length && Skip == 0)
        {
            setTimeout(function() {FindPopups(ArticleID,BadID,ArticlesLink,CaseLink,ArticleList,i,UITEXTLength,0,BadIDIndex,ParentID,0,AddArticleIndex,RemoveArticleIndex);}, 250);
            break;
        }

        ArticleNumber = WaitAndGrabID(BadIDIndex,ParentID) //Get ID from article
        UITEXTLength = document.getElementsByClassName("uiOutputText").length

        if (ArticleNumber == null)
        {
            //console.log("FindPopups(ArticleNumber == null)");
            setTimeout(function() {FindPopups(ArticleID,BadID,ArticlesLink,CaseLink,ArticleList,i,UITEXTLength,1,BadIDIndex,ParentID,0,AddArticleIndex,RemoveArticleIndex);}, 250);
            break;
        }
        else if (ArticleNumber == BadID) //Bad match
        {
            console.log("FindPopups(Article Matches BAD Article) We should remove this");
            document.getElementsByClassName("tabHeader slds-tabs--default__link slds-p-right--small slds-grow ")[document.getElementsByClassName("tabHeader slds-tabs--default__link slds-p-right--small slds-grow ").length-1].click()
            UITEXTLength = document.getElementsByClassName("uiOutputText").length
            ArticleList[i].getElementsByClassName("slds-button slds-button--icon-x-small slds-button--icon-border-filled")[0].click() //Drop down to remove the article

            if (i == ArticleList.length-1)
            {
                setTimeout(function() {RemoveArticle(ArticleID,CaseLink,AddArticleIndex,i);}, 250);
            }
            else
            {
                setTimeout(function() {FindPopups(ArticleID,BadID,ArticlesLink,CaseLink,ArticleList,i+1,UITEXTLength,0,BadIDIndex,ParentID,AddArticleIndex,i);}, 250);
            }
            break;
        }
        else if (ArticleNumber == ArticleID) //Correct match
        {
            console.log("FindPopups(Article Matches Correct Article)");
            document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container")[document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container").length-1].click()
            UITEXTLength = document.getElementsByClassName("uiOutputText").length
            if (i == ArticleList.length-1)
            {
                setTimeout(function() {RemoveArticle(ArticleID,CaseLink,i,RemoveArticleIndex);}, 250);
            }
            else
            {
                setTimeout(function() {FindPopups(ArticleID,BadID,ArticlesLink,CaseLink,ArticleList,i+1,UITEXTLength,0,BadIDIndex,ParentID,1,i,RemoveArticleIndex);}, 250);
            }
            break;
        }
        else // No match
        {
            console.log("FindPopups(Close Article)");
            document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container")[document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container").length-1].click()
            UITEXTLength = document.getElementsByClassName("uiOutputText").length
            if (i == ArticleList.length-1)
            {
                setTimeout(function() {RemoveArticle(ArticleID,CaseLink,AddArticleIndex,RemoveArticleIndex);}, 250);
            }
            else
            {
                setTimeout(function() {FindPopups(ArticleID,BadID,ArticlesLink,CaseLink,ArticleList,i+1,UITEXTLength,0,BadIDIndex,ParentID,1,AddArticleIndex,RemoveArticleIndex);}, 250);
            }
            break;
        }
        console.log("ArticleNumber= " + ArticleNumber + " BadID= " + BadID);
    }
    return
}

function WaitAndGrabID(BadIDIndex,ParentID)
{
    console.log("WaitAndGrabID()");
    var ArticleNumber = null
    var DifferentID = null
    var UITEXT = document.getElementsByClassName("uiOutputText") //Grab Article Number
    for (let i = UITEXT.length-1; i >= 0; i--)
    {
        if (UITEXT[i].innerText.match(/000(.*)/) != null)
        {
            if (i == BadIDIndex)
            {
                try
                {
                    DifferentID = document.location.href.match(/(?<=Version\/)(.*)(?=\/view)/)[0]
                }
                catch(er)
                {
                    try
                    {
                        DifferentID = document.location.href.match(/(?<=kav\/)(.*)(?=\/view)/)[0]
                    }
                    catch(er)
                    {
                        DifferentID = null
                    }
                }

                if (ParentID == DifferentID)
                {
                    ArticleNumber = UITEXT[i].innerText
                }
                //console.log("WaitAndGrabID() FOUND bad MATCH AT i = " + i);
            }
            else
            {
                console.log("WaitAndGrabID() FOUND GOOD MATCH AT i = " + i);
                ArticleNumber = UITEXT[i].innerText
                break;
            }
        }
    }
    return ArticleNumber
}

function RemoveArticle(ArticleID,CaseLink,AddArticleIndex,RemoveArticleIndex)
{
    console.log("Preparing to process the following")
    console.log("AddArticleIndex: " + AddArticleIndex + " RemoveArticleIndex: " + RemoveArticleIndex);

    //Click button to remove the article
    var UIButtons = document.getElementsByClassName("forceActionLink")
    for (let j = 0; j < UIButtons.length; j++)
    {
        if (UIButtons[j].innerText == "Detach Article" && UIButtons[j].offsetParent != null)
        {
            UIButtons[j].click() //After visible, scan for the Detach Article Button and press it
        }
    }

    if (AddArticleIndex == -1)
    {
        //Add Good Article
        OpenCase(ArticleID,CaseLink)
        console.log("Remove Bad Article & Add Correct Article");
    }
    else
    {
        document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container")[document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container").length-1].click() //Close Articles Page
        setTimeout(function() {StartOfCode(0,ArticleID);}, 1000);
    }
    return
}

function OpenCase(ArticleID,CaseLink)
{
    console.log("OpenCase()");
    document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container")[document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container").length-1].click() //Close Articles Page
    GM_openInTab(CaseLink)
    GM_setClipboard (ArticleID);
    setTimeout(function() {WaitForPaste(ArticleID);}, 1500);
    return
}

function WaitForPaste(ArticleID) //Wait for user to paste info
{
    console.log("WaitForPaste()");
    try
    {
        document.getElementsByClassName("magic-box-input")[0].children[1].focus()
        var TextBox = document.getElementsByClassName("magic-box-underlay")[0].children[0].children[0].children[0].getAttribute("data-value")
        if (TextBox == "" || TextBox == null)
        {
            setTimeout(function() {WaitForPaste(ArticleID);}, 250);
        }
        else
        {
            //Click search button
            document.getElementsByClassName("CoveoSearchButton coveo-accessible-button")[0].click()

            //Attach most relevant document
            document.getElementsByClassName("CoveoAttachToCase coveo-result-actions-menu-menu-item")[0].click()

            //Close Case
            document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container")[document.getElementsByClassName("slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-container").length-1].click()

            //Open Next Case
            setTimeout(function() {StartOfCode(0,ArticleID);}, 1000);
        }
    }
    catch(er)
    {
        setTimeout(function() {WaitForPaste(ArticleID);}, 250);
    }
    return
}