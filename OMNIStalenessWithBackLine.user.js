// ==UserScript==
// @name         OMNIStalenessWithBackLine
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Register Stalenesses and open cases w/ CTRL-SHIFT-SPACE
// @author       Connor Kaiser
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      https://osisoft.lightning.force.*
// ==/UserScript==

(function()
 {
    if (window.top === window.self)
    {
        var Skill = "fl_english_ib" //Skill to check against
        var BacklineName = "" //Name to check if the case is a CR

        GM_deleteValue("Staleness") //Reset Global Variable
        if (BacklineName != ""){ GM_deleteValue("BackLineStaleness") } //Reset Global Variable
        var TimersCount = 0;

        var observer = new MutationObserver(function(mutations)
                                            {
            var Timer = document.getElementsByClassName("OmniTimer")

            if (Timer != null && (Timer.length != TimersCount))
            {
                TimersCount = Timer.length
            }
            else
            {
                return;
            }

            //Case Title in case a CR comes in
            try
            {
                if (document.getElementsByClassName("primaryField")[0].innerText)
                {
                    var CaseTitle = document.getElementsByClassName("primaryField")[0].innerText

                    //PSE Name pulled from OMNI Case Info (e.g. 00787878|Web|Connor Kaiser)
                    var Name = document.getElementsByClassName("secondaryFields")[0].children[2].innerText

                    //Placeholder for Staleness Text
                    try{document.getElementsByClassName("OmniTimer")[0].insertAdjacentHTML("afterend", '<div id="Staleness"> </div>');} catch(er) {console.log("Failed To Add Staleness DIV")}

                    //Sets Normal Case Staleness
                    GetStaleness(Name,Skill,0)
                    GetStaleness(CaseTitle,Skill,1)

                    if (BacklineName != "")
                    {
                        //Sets BackLineStaleness
                        if (CaseTitle == BacklineName) //Get a CR for a Backline engineer
                        {
                            var StartText = document.getElementById("Staleness")
                            var Staleness = GM_getValue("BackLineStaleness") //Get the staleness of the title user not the user in the case info
                            var NewStaleness = 0; //CRs are 100%
                            StartText.innerText = "100% Reduction\nCurrent Staleness: " + msToTime(Staleness) + "\nAfter CR : " + msToTime(NewStaleness)
                        }
                        else //Get a normal case for a Backline engineer
                        {
                            setTimeout(async function(Skill)
                                       {
                                //15 h 15 min 15 s
                                var StartText = document.getElementById("Staleness")
                                var TimeText = document.getElementsByClassName("OmniTimer")[0].innerText
                                if (TimeText.match("h") == null)
                                {
                                    //15 min 15 s
                                    var timeHours = parseInt(TimeText.substr(0,2).trim())/60 //Time in Minutes (in Hours)
                                    var ResetAmount = 25 + (75*(timeHours)/3.5)
                                    var Staleness = GM_getValue("Staleness")
                                    var NewStaleness = (1-(ResetAmount*.01)) * Staleness
                                    StartText.innerText = ResetAmount.toFixed(0).toString() + "% Reduction\nCurrent Staleness: " + msToTime(Staleness) + "\nAfter OMNI Case : " + msToTime(NewStaleness)
                                }
                                else
                                {
                                    //15 h 15 min 15 s
                                    timeHours = parseInt(TimeText.substr(0,2).trim()) //Time in Hours
                                    //15h

                                    //15 min 15 s
                                    var timeMinutes = parseInt(TimeText.substr(3).trim().substr(0,2).trim())/60 //Time in Minutes(in Hours)

                                    //15 h + .25h (we threw out 15s because it barely changes the %)
                                    var timeTotal = timeHours + timeMinutes

                                    ResetAmount = 25 + (75*(timeTotal)/3.5)
                                    if (ResetAmount >= 100) {ResetAmount = 100} //Some cases go over SLA and would throw off math
                                    Staleness = GM_getValue("Staleness")
                                    NewStaleness = (1-(ResetAmount*.01)) * Staleness
                                    StartText.innerText = ResetAmount.toFixed(0).toString() + "% Reduction\nCurrent Staleness: " + msToTime(Staleness) + "\nAfter OMNI Case : " + msToTime(NewStaleness)
                                }
                            }, 2000);
                        }
                    }
                    else //Get a normal case for a normal engineer
                    {
                        setTimeout(async function(Skill)
                                   {
                            //15 h 15 min 15 s
                            var StartText = document.getElementById("Staleness")
                            try{var TimeText = document.getElementsByClassName("OmniTimer")[0].innerText} catch(er){}
                            if (TimeText)
                            {
                                if (TimeText.match("h") == null)
                                {
                                    //15 min 15 s
                                    var timeHours = parseInt(TimeText.substr(0,2).trim())/60 //Time in Minutes (in Hours)
                                    var ResetAmount = 25 + (75*(timeHours)/3.5)
                                    var Staleness = GM_getValue("Staleness")
                                    var NewStaleness = (1-(ResetAmount*.01)) * Staleness
                                    StartText.innerText = ResetAmount.toFixed(0).toString() + "% Reduction\nCurrent Staleness: " + msToTime(Staleness) + "\nAfter OMNI Case : " + msToTime(NewStaleness)
                                }
                                else
                                {
                                    //15 h 15 min 15 s
                                    timeHours = parseInt(TimeText.substr(0,2).trim()) //Time in Hours
                                    //15h

                                    //15 min 15 s
                                    var timeMinutes = parseInt(TimeText.substr(3).trim().substr(0,2).trim())/60 //Time in Minutes(in Hours)

                                    //15 h + .25h (we threw out 15s because it barely changes the %)
                                    var timeTotal = timeHours + timeMinutes

                                    ResetAmount = 25 + (75*(timeTotal)/3.5)
                                    if (ResetAmount >= 100) {ResetAmount = 100} //Some cases go over SLA and would throw off math
                                    Staleness = GM_getValue("Staleness")
                                    NewStaleness = (1-(ResetAmount*.01)) * Staleness
                                    StartText.innerText = ResetAmount.toFixed(0).toString() + "% Reduction\nCurrent Staleness: " + msToTime(Staleness) + "\nAfter OMNI Case : " + msToTime(NewStaleness)
                                }
                            }
                        }, 2000);
                    }
                }
                else
                {
                }
            }catch(er){}

            //Event Handler for opening OMNI Cases
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
    else
    {
        return;
    }

    document.body.addEventListener('keydown', function(e){}, true); //Hook the event e
    document.addEventListener('keydown', function(e) //If event was a keypress
                              {
        if (e.keyCode == 32 && e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) //Pressed Ctrl-Shift-Space simultaneously
        {
            try
            {
                var CaseID = document.getElementsByClassName("visible")[0].children[0].getAttribute("data-worktargetid")
                var URL = "https://osisoft.lightning.force.com/lightning/r/Case/" + CaseID + "/view"
                window.open(URL) //Open case shown in OMNI
            }
            catch(er){}
        }
    }, false);
    return;
})();

async function GetStaleness(Name,Skill,BackLine) //This is roughly how TSOPS gets its staleness values
{
    //Function saves space above but requires globals because xmlhttprequests are async and can't output values
    await GM_xmlhttpRequest({
        method: "GET",
        url: "https://tsops-api-phl.dev.osisoft.int/api/agents/simple",
        onload: await function(response)
        {
            //console.log(response)
            var StartText = response.responseText.substring(1,response.responseText.length)
            StartText = StartText.split('"name": ')
            var People = [];
            for (let i = 0; i < StartText.length; i++)
            {
                try
                {
                    if (StartText[i].match(Skill).index >= 0)
                    {
                        try {var Available = StartText[i].match('Available').index} catch(er) {Available = -1}
                        try {var Unavailable = StartText[i].match('Unavailable').index} catch(er) {Unavailable = -1}
                        try {var Lunch = StartText[i].match('Lunch_1hr').index} catch(er) {Lunch = -1}
                        try {var CustBuff = StartText[i].match('Cust_Mtg_30min_Buffer').index} catch(er) {CustBuff = -1}
                        try {var IntBuff = StartText[i].match('Int_Mtg_1hr+30min_Buffer').index} catch(er) {IntBuff = -1}
                        try {var NOC = StartText[i].match('NOC_30min').index} catch(er) { NOC = -1}
                        try {var OffLine = StartText[i].match('Logged Out').index} catch(er) { OffLine = -1}
                        if (Available >= 0 || Unavailable >= 0 || Lunch >= 0 || CustBuff >= 0 || IntBuff >= 0 || NOC >= 0 || OffLine >= 0)
                        {
                            People.push(StartText[i])
                        }
                    }

                }
                catch(er){}
            }

            var MyTimes = []
            var Stalenesses = []
            for (let i = 0; i < People.length; i++)
            {
                try{
                    if (People[i].match(Name).index >= 0) //If this person is the "Name"
                    {
                        var Regex = /(?<=Time": ").*(?=",)/gm
                        var Match = People[i].match(Regex)
                        for (let j = 0; j < Match.length; j++)
                        {
                            MyTimes.push(Date.parse(Match[j]))
                        }
                    }
                }
                catch(er) // .index above will fail if Name isn't there so these are the other users
                {
                    Regex = /(?<=Time": ").*(?=",)/gm
                    Match = People[i].match(Regex)
                    Stalenesses.push((Date.now() - Date.parse(Match[0]))) //Time between last call/case and now = staleness (stored in Array of users)
                }
            }

            if (BackLine == 1)
            {
                var Staleness = Date.now() - MyTimes[0]
                Stalenesses = Stalenesses.sort().reverse()
                GM_setValue("BackLineStaleness", Staleness) //Set Global
                return 0;
            }
            else
            {
                Staleness = Date.now() - MyTimes[0]
                Stalenesses = Stalenesses.sort().reverse()
                GM_setValue("Staleness", Staleness) //Set Global
                return 1;
            }
        }
    });
    return 1;
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}