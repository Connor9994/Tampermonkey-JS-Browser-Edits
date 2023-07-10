// ==UserScript==
// @name         EOS/Lunch
// @namespace    http://tampermonkey.net/
// @version      3.14
// @description  EOS Stuff
// @author       Connor Kaiser
// @grant        GM_openInTab
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @include      https://osisoft--icagentconsole.na*
// ==/UserScript==

(function()
 {
    if (window.top === window.self)
    {
        return;
    }
    else
    {
        var Name = "Connor Kaiser"
        var Skills = ["fl_english_ib", "noc_ib"];
        var Positions = [2, 1] //(English <=2 || NOC <= 1) triggers lunch or STOP EOS
        GM_setValue("Name", Name)
        GM_setValue("Skills", Skills)
        GM_setValue("Positions", Positions)

        //Remove InContact Banner
        try{document.getElementsByClassName("slds-border_top branding-image-container")[0].remove();} catch(err) {}

        //Add Button Slot
        try{document.getElementsByClassName("footer slds-is-relative slds-border_top")[0].insertAdjacentHTML("beforeend",'<div _ngcontent-gtr-c15="" class="footer-container slds-is-relative slds-p-horizontal_small"><div _ngcontent-gtr-c15="" class="button-section"><button _ngcontent-gtr-c15="" class="slds-button slds-button_neutral" title="EOS" id="EOSButton">EOS</button><!----><button _ngcontent-gtr-c15="" class="slds-button slds-button_neutral" title="Lunch" id="LunchButton">Lunch</button><button _ngcontent-gtr-c15="" class="slds-button slds-button_neutral" title="Test" id="TestButton">Test</button><button _ngcontent-gtr-c15="" class="slds-button slds-button_neutral" title="EOS" id="ResetButton">Reset</button></div></div>');} catch(err) {}
        //;try{} catch(err) {}

        try{document.getElementById("EOSButton").addEventListener ("click", EOSButton, false);} catch(err) {}
        try{document.getElementById("LunchButton").addEventListener ("click", LunchButton, false);} catch(err) {}
        try{document.getElementById("ResetButton").addEventListener ("click", ResetButton, false);} catch(err) {}
        try{document.getElementById("TestButton").addEventListener ("click", TestButton, false);} catch(err) {}

        return;
    }
})();

function TestButton()
{
GM_xmlhttpRequest({
        method: "GET",
        url: "https://osisoft.lightning.force.com/lightning/r/Case/5001I00000XvTQeQAN/view/?c__foo=%2Fsetup",
        onload: function(response)
        {
            console.log(response)
            //console.log(response.responseText)
            console.log(response.responseXML)
            var Details = response.responseXML.getElementsByClassName("slds-tabs_default__link")
            for (let i = 0; i < Details.length; i++)
            {
                if (Details[i].innerText == "Details")
                {
                    Details[i].click();
                }
            }
            console.log(Details)
            console.log(response.responseXML)
        }
    });
}

function ResetButton()
{
    var Name = GM_getValue("Name")
    var Skills = GM_getValue("Skills")
    GetQueue(Name,Skills)
    for (let i = 0; i < Skills.length; i++)
    {
        var Result = GM_getValue("Result: " + Skills[i])
        console.log("You are: " + suffix(Result) + " in the "+ Skills[i] +" queue")
    }
    return;
}

function EOSButton(AfterLunch)
{
    if (AfterLunch == null) {AfterLunch = 0;}
    var Name = GM_getValue("Name")
    var Skills = GM_getValue("Skills")
    var Positions = GM_getValue("Positions")
    GetQueue(Name,Skills) //Creates as many variables as there are Skills pulled in the GM_getValue("Result: " + Skills[i]) below
    document.getElementById("EOSButton").style.color = "blue"

    for (let i = 0; i < Skills.length; i++)
    {
        var Result = GM_getValue("Result: " + Skills[i])
        console.log("You are: " + suffix(Result) + " in the "+ Skills[i] +" queue")

        var d = new Date();
        console.log(d.getHours() + ":" + (("0" + d.getMinutes()).slice(-2)))
        if (AfterLunch == 1)
        {
            if (d.getHours() >= 16 && d.getMinutes() >= 30) //After 4:30 EOS no matter what
            {
                document.getElementsByClassName("slds-dropdown__item")[4].children[0].click()
                GM_openInTab("https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&cc=ct1kaiser@gmail.com&su=Queue+Checker&body=Went+EOS+at+4:30+@@@")
                break;
            }
            if (i == Skills.length-1) //E.G. If Skills is 4. Avoid calling this function 4x4x4x4x4x4... times
            {
                setTimeout(function() {EOSButton(AfterLunch);}, 5000); //Polling speed
            }
        }
        else
        {
            if (d.getHours() >= 16 && d.getMinutes() >= 30) //After 4:30 EOS no matter what
            {
                document.getElementsByClassName("slds-dropdown__item")[4].children[0].click()
                GM_openInTab("https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&cc=ct1kaiser@gmail.com&su=Queue+Checker&body=Went+EOS+at+4:30+@@@")
                break; //No use in continuing to check the other Queues
            }
            else if (d.getHours() >= 16 && d.getMinutes() >= 0 && (Result <= Positions[i])) //After 4:00
            {
                var time = d.getHours() + ":" + d.getMinutes()
                GM_openInTab("https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&cc=ct1kaiser@gmail.com&su=" + Skills[i] + ": " + Result + "&body=Stopped+checking+after+" + time + "+@@@")
                return //checks the next queue
            }
            if (i == Skills.length-1) //E.G. If Skills is 4. Avoid calling this function 4x4x4x4x4x4... times
            {
                setTimeout(function() {EOSButton(AfterLunch);}, 5000); //Polling speed
            }
        }
    }
    return
}

function LunchButton()
{
    var Name = GM_getValue("Name")
    var Skills = GM_getValue("Skills")
    var Positions = GM_getValue("Positions")
    GetQueue(Name,Skills)
    document.getElementById("LunchButton").style.color = "blue"

    for (let i = 0; i < Skills.length; i++)
    {
        var Result = GM_getValue("Result: " + Skills[i])
        console.log("You are: " + Result + " in the "+ Skills[i] +" queue")

        var d = new Date();
        console.log(d.getHours() + ":" + (("0" + d.getMinutes()).slice(-2)))
        if (Result <= Positions[i] ||(d.getHours() >= 15 && d.getMinutes() >= 30))
        {
            document.getElementsByClassName("slds-dropdown__item")[6].children[0].click()
            var FutureHours = (("0" + d.getHours()+1).slice(-2))
            var PreText ="You went to lunch at " + (("0" + d.getHours()).slice(-2)) + ":" + (("0" + d.getMinutes()).slice(-2))
            var PostText="You should be back by " + FutureHours + ":" + (("0" + d.getMinutes()).slice(-2))
            console.log(PreText)
            console.log(PostText)
            setTimeout(function() {GM_openInTab("https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&cc=ct1kaiser@gmail.com&su=Lunch: " + FutureHours + ":" + d.getMinutes() + "&body=" + PreText + ". " + PostText + ".+@@@")}, 1000);
            setTimeout(function() {GM_openInTab("https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&cc=ct1kaiser@gmail.com&su=Return to Work&body=Return to Work.@@@")}, 3599000);
            if ((d.getHours() >= 15 && d.getMinutes() >= 30) || (d.getHours() >= 16)) //If past 3:30 -> 4:30 then EOS
            {
                setTimeout(function() {EOSButton(1);}, 5000);
            }
            break; //After you go to lunch, stop checking the other queues
        }
        if (i == Skills.length-1)
        {
            setTimeout(function() {LunchButton();}, 5000); //Polling speed (and avoid calling this function 4x4x4x4x4x4 time
            break;
        }
    }
    return;
}

function GetQueue(Name,Skills)
{
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://tsops-api-phl.dev.osisoft.int/api/agents/simple",
        onload: function(response)
        {
            //console.log(response)
            var Skills = GM_getValue("Skills")
            var StartText = response.responseText.substring(1,response.responseText.length)
            StartText = StartText.split('"name": ')

            for (let i =0; i < Skills.length; i++)
            {
                GM_setValue("Result: " + Skills[i], null)
                var People = [];
                for (let j = 0; j < StartText.length; j++)
                {
                    try
                    {
                        if (StartText[j].match(Skills[i]).index >= 0)
                        {
                            if (StartText[j].match('Available').index >= 0)
                            {
                                People.push(StartText[j])
                            }
                        }

                    }
                    catch(er){}
                }

                var MyTimes = []
                var Stalenesses = []
                for (let j = 0; j < People.length; j++)
                {
                    try{
                        if (People[j].match(Name).index >= 0)
                        {
                            //Gather user staleness here
                            var Regex = /(?<=Time": ").*(?=",)/gm
                            var Matched = People[j].match(Regex)
                            for (let k = 0; k < Matched.length; k++)
                            {
                                MyTimes.push(Date.parse(Matched[k]))
                            }
                        }
                    }
                    catch(er)
                    {
                        //Gather other user staleness here
                        Regex = /(?<=Time": ").*(?=",)/gm
                        Matched = People[j].match(Regex)
                        Stalenesses.push((Date.now() - Date.parse(Matched[0])))
                    }
                }
                var Staleness = Date.now() - MyTimes[0]
                Stalenesses = Stalenesses.sort().reverse()
                var Result = Stalenesses.filter(isBigger(Staleness)).length + 1;
                GM_setValue("Result: " + Skills[i], Result)
            }
        }
    });
}

// Filters in JS are stupid
// InnerFunction(unnamed) applies against the array you feed it
// e.g.
// Staleness = 8
// Stalenesses = [1,5,12,19]
// Stalenesses.filter(isBigger(Staleness))
// ^Returns [12,19] bc > 8
function isBigger(value) {
    return function(element, index, array) {
        return (element >= value);
    }
}

//Creates the correct suffix of a number and outputs as a string
// 3-> 3rd
function suffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}