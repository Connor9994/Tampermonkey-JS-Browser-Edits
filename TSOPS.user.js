// ==UserScript==
// @name         TSOPS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Connor Kaiser
// @match        https://tsops/*'
// @match        https://tsops-dash-phl/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function()
 {
    if (GM_getValue("LineSpacing") == null || GM_getValue("ColumnSpacing") == null || GM_getValue("ColorTalking") == null ||
        GM_getValue("ColorAvailable") == null || GM_getValue("ColorWrapUp") == null || GM_getValue("ColorUnavailable") == null ||
        GM_getValue("ColorOffline") == null || GM_getValue("ColorBackground") == null || GM_getValue("LeftFontSize") == null ||
        GM_getValue("LeftFontType") == null || GM_getValue("LeftFontWeight") == null || GM_getValue("LeftFontColor") == null ||
        GM_getValue("TopFontSize") == null || GM_getValue("TopFontType") == null || GM_getValue("TopFontWeight") == null ||
        GM_getValue("TopFontColor") == null || GM_getValue("HighlightName") == null || GM_getValue("HighlightNameColor") == null ||
        GM_getValue("Name") == null || GM_getValue("LoggedInCheck") == null || GM_getValue("AvailableCheck") == null ||
        GM_getValue("TalkingCheck") == null || GM_getValue("CallsOfferedCheck") == null || GM_getValue("CallsTakenCheck") == null ||
        GM_getValue("MeanWaitCheck") == null || GM_getValue("MaxWaitCheck") == null || GM_getValue("RightFontSize") == null ||
        GM_getValue("RightFontType") == null || GM_getValue("RightFontWeight") == null || GM_getValue("RightFontColor") == null ||
        GM_getValue("RightBoxWidth") == null || GM_getValue("RightBoxHeight") == null || GM_getValue("CallsWaitingCheck") == null ||
        GM_getValue("ReassignmentsCheck") == null || GM_getValue("OmniChannelCheck") == null || GM_getValue("CaseFontSize") == null ||
        GM_getValue("Fire") == null || GM_getValue("CaseBoxWidth") == null || GM_getValue("CaseBoxHeight") == null || GM_getValue("CaseStalenessColor") == null)
    {
        SetDefaults();
    }

    var LineSpacing = GM_getValue("LineSpacing");
    var ColumnSpacing = GM_getValue("ColumnSpacing");
    var ColorTalking = GM_getValue("ColorTalking");
    var ColorAvailable = GM_getValue("ColorAvailable");
    var ColorWrapUp = GM_getValue("ColorWrapUp");
    var ColorUnavailable = GM_getValue("ColorUnavailable");
    var ColorOffline = GM_getValue("ColorOffline");
    var ColorBackground = GM_getValue("ColorBackground");

    var LeftFontSize = GM_getValue("LeftFontSize");
    var LeftFontType = GM_getValue("LeftFontType");
    var LeftFontWeight = GM_getValue("LeftFontWeight");
    var LeftFontColor = GM_getValue("LeftFontColor");

    var RightFontSize = GM_getValue("RightFontSize");
    var RightFontType = GM_getValue("RightFontType");
    var RightFontWeight = GM_getValue("RightFontWeight");
    var RightFontColor = GM_getValue("RightFontColor");
    var RightFontBackgroundColor = GM_getValue("RightFontBackgroundColor");
    var RightBoxWidth = GM_getValue("RightBoxWidth");
    var RightBoxHeight= GM_getValue("RightBoxHeight");

    var CaseFontSize = GM_getValue("CaseFontSize");
    var CaseFontColor = GM_getValue("CaseFontColor");
    var CaseBackgroundColor = GM_getValue("CaseBackgroundColor");
    var CaseTimeColor = GM_getValue("CaseTimeColor");
    var CaseStalenessColor = GM_getValue("CaseStalenessColor");
    var CaseBoxWidth = GM_getValue("CaseBoxWidth");
    var CaseBoxHeight = GM_getValue("CaseBoxHeight");

    var CallsWaitingCheck = GM_getValue("CallsWaitingCheck");
    var ReassignmentsCheck= GM_getValue("ReassignmentsCheck");
    var OmniChannelCheck = GM_getValue("OmniChannelCheck");

    var TopFontSize = GM_getValue("TopFontSize");
    var TopFontType = GM_getValue("TopFontType");
    var TopFontWeight = GM_getValue("TopFontWeight");
    var TopFontColor = GM_getValue("TopFontColor");

    var LoggedInCheck = GM_getValue("LoggedInCheck");
    var AvailableCheck = GM_getValue("AvailableCheck");
    var TalkingCheck = GM_getValue("TalkingCheck");
    var CallsOfferedCheck = GM_getValue("CallsOfferedCheck");
    var CallsTakenCheck = GM_getValue("CallsTakenCheck");
    var MeanWaitCheck = GM_getValue("MeanWaitCheck");
    var MaxWaitCheck = GM_getValue("MaxWaitCheck");

    var HighlightName = GM_getValue("HighlightName");
    var HighlightNameColor = GM_getValue("HighlightNameColor");
    var Name = GM_getValue("Name");
    var Fire = GM_getValue("Fire");

    //Give columns ids so it's easier to change them
    document.getElementsByClassName("col-sm-8")[0].setAttribute("id","LeftColumn")
    document.getElementsByClassName("col-sm-4")[0].setAttribute("id","RightColumn")

    //Add Utility Arrow
    document.getElementsByTagName("img")[0].insertAdjacentHTML('afterend','<span style="color: white;padding-left: 5px;font-size: 25px;" id="TSOPSButton">↓</span>');
    try{document.getElementById("TSOPSButton").addEventListener ("click", TSOPSButton, false);} catch(err) {}

    //Add Modal
    var ModalText = '<div id="myModal" class="modal" style="overflow: auto;width: 400px;height: 581px;top: 209px;left: 56px;background-color: white;display: block;"><label for="LineSpacing" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">Line Spacing</label><input type="number" id="LineSpacing" name="LineSpacing" min="0" max="3" style="" step=".1"><label for="ColumnSpacing" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">Column Spacing</label><input type="number" id="ColumnSpacing" name="ColumnSpacing" min="0.1" max="1.2" style="" step=".1"><label for="Color Talking" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">Talking</label><input type="color" id="ColorTalking" name="ColorTalking"><label for="Color Available" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">Available</label><input type="color" id="ColorAvailable" name="ColorAvailable"><label for="ColorWrapUp" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">Wrap-up</label><input type="color" id="ColorWrapUp" name="ColorWrapUp"><span style="color: black;padding-left: 5px;font-size: 25px;" id="FireChoices"><label for="FireArrowChoice" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;" id="ArrowFireChoices">→</label><div id="FireChoicesModal" class="modal" style="overflow: auto; width: 95px; height: 71px; top: 209px; left: 455px; background-color: white; display: none;"><label for="Fire" style="padding-left: 30px;padding-top: 3px;padding-right: 5px;font-size: 15px;margin-bottom: 0px;position: absolute;top: 3px;">Fire: </label><input type="text" id="Fire" name="Fire" style="margin-right: 5px;font-size: 15px;width: 94%;position: absolute;top: 33px;" maxlength="8" value="🔥🔥🔥🔥"></div></span><label for="Color Unavailable" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">Unavailable</label><input type="color" id="ColorUnavailable" name="ColorUnavailable"><label for="Color Offline" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">Offline</label><input type="color" id="ColorOffline" name="ColorOffline"><label for="Color Background" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">Background</label><input type="color" id="ColorBackground" name="ColorBackground"><label for="HighlightName" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">Highlight Name?</label><input type="checkbox" id="HighlightName" name="HighlightName" style="margin-right: 5px;"><input type="text" id="Name" name="Name" style="margin-right: 5px;"><input type="color" id="HighlightNameColor" name="HighlightNameColor"><label for="LeftFont Size" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">(Left) Font Size</label><input type="number" id="LeftFontSize" name="LeftFontSize" min="0" max="15" style="margin-right: 5px;" step="1"><select name="LeftFontType" id="LeftFontType" value=""><option value="Default">Default</option><option value="Arial">Arial</option><option value="Arial Black">Arial Black</option><option value="Arial Narrow">Arial Narrow</option><option value="Avant Garde">Avant Garde</option><option value="Comic Sans MS">Comic Sans MS</option><option value="Courier">Courier</option><option value="Garamond">Garamond</option><option value="Georgia">Georgia</option><option value="Impact">Impact</option><option value="Palatino">Palatino</option><option value="Times New Roman">Times New Roman</option><option value="Tahoma">Tahoma</option><option value="Trebuchet MS">Trebuchet MS</option><option value="Verdana">Verdana</option></select>  <label for="LeftFontWeight" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">(Left) Font Weight</label><input type="number" id="LeftFontWeight" name="LeftFontWeight" min="100" max="1000" step="100" style="margin-right: 5px;"><input type="color" id="LeftFontColor" name="LeftFontColor"> <label for="TopFont Size" style="padding-left: 12px;padding-top: 10px;padding-right: 5px;">(Top) Font Size</label><input type="number" id="TopFontSize" name="TopFontSize" min="0" max="15" style="margin-right: 5px;" step="1" value="12"><select name="TopFontType" id="TopFontType" value=""><option value="Default">Default</option><option value="Arial">Arial</option><option value="Arial Black">Arial Black</option><option value="Arial Narrow">Arial Narrow</option><option value="Avant Garde">Avant Garde</option><option value="Comic Sans MS">Comic Sans MS</option><option value="Courier">Courier</option><option value="Garamond">Garamond</option><option value="Georgia">Georgia</option><option value="Impact">Impact</option><option value="Palatino">Palatino</option><option value="Times New Roman">Times New Roman</option><option value="Tahoma">Tahoma</option><option value="Trebuchet MS">Trebuchet MS</option><option value="Verdana">Verdana</option></select><label for="TopFontWeight" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">(Top) Font Weight</label><input type="number" id="TopFontWeight" name="TopFontWeight" min="100" max="1000" step="100" value="400" style="margin-right: 5px;"><input type="color" id="TopFontColor" name="TopFontColor"><span style="color: black;padding-left: 5px;font-size: 25px;" id="TopChoices"><label for="RightArrowChoice" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;" id="ArrowTopChoices">→</label><div id="TopChoicesModal" class="modal" style="width: 124px; height: 288px; top: 269px; left: 455px; background-color: white; display: none;"><label for="LoggedInCheck" style="padding-left: 10px;padding-right: 5px;font-size: 15px;">Logged In</label><input type="checkbox" id="LoggedInCheck" name="LoggedInCheck" value="false" style="margin-right: 5px;" checked=""><label for="AvailableCheck" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;font-size: 15px;">Available</label><input type="checkbox" id="AvailableCheck" name="AvailableCheck" value="false" style="margin-right: 9px;" checked=""><label for="TalkingCheck" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;font-size: 13px;">Talking</label><input type="checkbox" id="TalkingCheck" name="TalkingCheck" value="false" style="margin-right: 5px;" checked=""><label for="CallsOfferedCheck" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;font-size: 15px;">Calls Offered</label><input type="checkbox" id="CallsOfferedCheck" name="CallsOfferedCheck" value="false" style="margin-right: 5px;" checked=""><label for="CallsTakenCheck" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;font-size: 15px;">Calls Taken</label><input type="checkbox" id="CallsTakenCheck" name="CallsTakenCheck" value="false" style="margin-right: 5px;" checked=""><label for="MeanWaitTimeCheck" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;font-size: 15px;">Mean Wait</label><input type="checkbox" id="MeanWaitCheck" name="MeanWaitCheck" value="false" style="margin-right: 5px;" checked=""><label for="MaxWaitCheck" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;font-size: 15px;">Max Wait</label><input type="checkbox" id="MaxWaitCheck" name="MaxWaitCheck" value="false" style="margin-right: 5px;" checked=""></div></span><label for="RightFont Size" style="padding-left: 12px;padding-top: 10px;padding-right: 5px;">(Right) Font Size</label><input type="number" id="RightFontSize" name="RightFontSize" min="0" max="100" style="margin-right: 5px;" step="1" value="40"><select name="RightFontType" id="RightFontType" value=""><option value="Default">Default</option><option value="Arial">Arial</option><option value="Arial Black">Arial Black</option><option value="Arial Narrow">Arial Narrow</option><option value="Avant Garde">Avant Garde</option><option value="Comic Sans MS">Comic Sans MS</option><option value="Courier">Courier</option><option value="Garamond">Garamond</option><option value="Georgia">Georgia</option><option value="Impact">Impact</option><option value="Palatino">Palatino</option><option value="Times New Roman">Times New Roman</option><option value="Tahoma">Tahoma</option><option value="Trebuchet MS">Trebuchet MS</option><option value="Verdana">Verdana</option></select><label for="RightFontWeight" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">(Right) Font Weight</label><input type="number" id="RightFontWeight" name="RightFontWeight" min="100" max="1000" step="100" value="400" style="margin-right: 5px;"><input type="color" id="RightFontColor" name="RightFontColor" style="margin-right: 5px;"><input type="color" id="RightFontBackgroundColor" name="RightFontBackgroundColor"><label for="RightBoxWidth" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;">(Right) Box Width</label><input type="number" id="RightBoxWidth" name="RightBoxWidth" min="0" max="100" step="1" value="95"><label for="RightBoxHeight" style="padding-left: 7px;padding-right: 5px;">Height</label><input type="number" id="RightBoxHeight" name="RightBoxHeight" min="0" max="100" step="1" value="55"><span style="color: black;padding-left: 5px;font-size: 25px;" id="TopChoices"><label for="RightArrowChoice" style="padding-left: -6px;padding-top: 4px;/* padding-right: 5px; */" id="ArrowRightChoices">→</label><div id="RightChoicesModal" class="modal" style="overflow: auto; width: 124px; height: 133px; top: 553px; left: 455px; background-color: white; display: none;"><label for="CallsWaitingCheck" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;font-size: 13px;">Calls Waiting</label><input type="checkbox" id="CallsWaitingCheck" name="CallsWaitingCheck" value="false" style="margin-right: 5px;" checked=""><label for="ReassignmentsCheck" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;font-size: 13px;">Reassignments</label><input type="checkbox" id="ReassignmentsCheck" name="ReassignmentsCheck" value="false" style="margin-right: 9px;" checked=""><label for="OmniChannelCheck" style="padding-left: 10px;padding-top: 10px;padding-right: 5px;font-size: 13px;">Omni-channel</label><input type="checkbox" id="OmniChannelCheck" name="OmniChannelCheck" value="false" style="margin-right: 5px;" checked=""></div></span><label for="CaseFont Size" style="padding-left: 7px;padding-top: 10px;padding-right: 5px;">(Case) Font Size</label><input type="number" id="CaseFontSize" name="CaseFontSize" min="0" max="100" style="margin-right: 5px;" step="1" value="12"><input type="color" id="CaseFontColor" name="CaseFontColor"><input type="color" id="CaseBackgroundColor" name="CaseBackgroundColor"><input type="color" id="CaseTimeColor" name="CaseTimeColor"><input type="color" id="CaseStalenessColor" name="CaseStalenessColor"><label for="CaseBoxWidth" style="padding-left: 7px;padding-right: 5px;padding-top: 8px;">(Case) Box Width</label><input type="number" id="CaseBoxWidth" name="CaseBoxWidth" min="0" max="100" step="1" value="95" style="width: 50px;"><label for="CaseBoxHeight" style="padding-right: 5px;padding-left: 5px;">(Case) Box Height</label><input type="number" id="CaseBoxHeight" name="CaseBoxHeight" min="0" max="100" step="1" value="100" style="width: 50px;"><label for="ResetAll" style="padding-top: 4px;padding-left: 10px;" id="ResetAll">↺</label></div>'
    document.getElementsByClassName("container-fluid")[0].insertAdjacentHTML('afterend',ModalText)

    //Line Spacing
    document.getElementById("LineSpacing").value = LineSpacing //Set Text Box
    try{document.getElementById("LineSpacing").addEventListener ("change", LineSpacingBox, false);} catch(err) {}
    document.body.style.lineHeight = LineSpacing //Set Value on Page

    //Column Spacing
    document.getElementById("ColumnSpacing").value = ColumnSpacing //Set Text Box
    try{document.getElementById("ColumnSpacing").addEventListener ("change", ColumnSpacingBox, false);} catch(err) {}
    if (document.getElementsByClassName("col-sm-8")[0] != null)
    {
        document.getElementById("ColumnSpacing").value = ColumnSpacing
        document.getElementsByClassName("col-sm-8")[0].setAttribute("class","col-sm-8")
        document.getElementsByClassName("col-sm-4")[0].setAttribute("class","col-sm-4")
    }

    //Color Talking
    document.getElementById("ColorTalking").setAttribute("value",ColorTalking)
    try{document.getElementById("ColorTalking").addEventListener ("change", ColorTalkingBox, false);} catch(err) {}

    //Color Available
    document.getElementById("ColorAvailable").setAttribute("value",ColorAvailable)
    try{document.getElementById("ColorAvailable").addEventListener ("change", ColorAvailableBox, false);} catch(err) {}

    //Color WrapUp
    document.getElementById("ColorWrapUp").setAttribute("value",ColorWrapUp)
    try{document.getElementById("ColorWrapUp").addEventListener ("change", ColorWrapUpBox, false);} catch(err) {}

    //Fire Choices Box
    document.getElementById("Fire").setAttribute("value",Fire)
    try{document.getElementById("Fire").addEventListener ("change", FireBox, false);} catch(err) {}

    //Fire Choices Arrow
    try{document.getElementById("ArrowFireChoices").addEventListener ("click", ArrowFireChoices, false);} catch(err) {}

    //Color Unavailable
    document.getElementById("ColorUnavailable").setAttribute("value",ColorUnavailable)
    try{document.getElementById("ColorUnavailable").addEventListener ("change", ColorUnavailableBox, false);} catch(err) {}

    //Color Offline
    document.getElementById("ColorOffline").setAttribute("value",ColorOffline)
    try{document.getElementById("ColorOffline").addEventListener ("change", ColorOfflineBox, false);} catch(err) {}

    //Color Background
    document.getElementById("ColorBackground").setAttribute("value",ColorBackground)
    try{document.getElementById("ColorBackground").addEventListener ("change", ColorBackgroundBox, false);} catch(err) {}

    //Left Column
    //Font Size
    document.getElementById("LeftFontSize").setAttribute("value",LeftFontSize)
    try{document.getElementById("LeftFontSize").addEventListener ("change", LeftFontSizeBox, false);} catch(err) {}

    //Font Type
    document.getElementById("LeftFontType").setAttribute("value",LeftFontType)
    try{document.getElementById("LeftFontType").addEventListener ("change", LeftFontTypeBox, false);} catch(err) {}

    //Font Weight
    document.getElementById("LeftFontWeight").setAttribute("value",LeftFontWeight)
    try{document.getElementById("LeftFontWeight").addEventListener ("change", LeftFontWeightBox, false);} catch(err) {}

    //Font Color
    document.getElementById("LeftFontColor").setAttribute("value",LeftFontColor)
    try{document.getElementById("LeftFontColor").addEventListener ("change", LeftFontColorBox, false);} catch(err) {}

    //Top Row
    //Font Size
    document.getElementById("TopFontSize").setAttribute("value",TopFontSize)
    try{document.getElementById("TopFontSize").addEventListener ("change", TopFontSizeBox, false);} catch(err) {}

    //Font Type
    document.getElementById("TopFontType").setAttribute("value",TopFontType)
    try{document.getElementById("TopFontType").addEventListener ("change", TopFontTypeBox, false);} catch(err) {}

    //Font Weight
    document.getElementById("TopFontWeight").setAttribute("value",TopFontWeight)
    try{document.getElementById("TopFontWeight").addEventListener ("change", TopFontWeightBox, false);} catch(err) {}

    //Font Color
    document.getElementById("TopFontColor").setAttribute("value",TopFontColor)
    try{document.getElementById("TopFontColor").addEventListener ("change", TopFontColorBox, false);} catch(err) {}

    //Top Choices Arrow
    try{document.getElementById("ArrowTopChoices").addEventListener ("click", TopChoicesArrow, false);} catch(err) {}

    //Right Column
    //Font Size
    document.getElementById("RightFontSize").setAttribute("value",RightFontSize)
    try{document.getElementById("RightFontSize").addEventListener ("change", RightFontSizeBox, false);} catch(err) {}

    //Font Type
    document.getElementById("RightFontType").setAttribute("value",RightFontType)
    try{document.getElementById("RightFontType").addEventListener ("change", RightFontTypeBox, false);} catch(err) {}

    //Font Weight
    document.getElementById("RightFontWeight").setAttribute("value",RightFontWeight)
    try{document.getElementById("RightFontWeight").addEventListener ("change", RightFontWeightBox, false);} catch(err) {}

    //Font Color
    document.getElementById("RightFontColor").setAttribute("value",RightFontColor)
    try{document.getElementById("RightFontColor").addEventListener ("change", RightFontColorBox, false);} catch(err) {}

    //Font Background Color
    document.getElementById("RightFontBackgroundColor").setAttribute("value",RightFontBackgroundColor)
    try{document.getElementById("RightFontBackgroundColor").addEventListener ("change", RightFontBackgroundColorBox, false);} catch(err) {}

    //Box Width
    document.getElementById("RightBoxWidth").setAttribute("value",RightBoxWidth)
    try{document.getElementById("RightBoxWidth").addEventListener ("change", RightBoxWidthBox, false);} catch(err) {}

    //Box Height
    document.getElementById("RightBoxHeight").setAttribute("value",RightBoxHeight)
    try{document.getElementById("RightBoxHeight").addEventListener ("change", RightBoxHeightBox, false);} catch(err) {}

    //Right Choices Arrow
    try{document.getElementById("ArrowRightChoices").addEventListener ("click", RightChoicesArrow, false);} catch(err) {}

    //ResetAll
    try{document.getElementById("ResetAll").addEventListener ("click", ResetAllBox, false);} catch(err) {}

    //Name Change CheckBox
    if (HighlightName == true)
    {
        document.getElementById("HighlightName").setAttribute("checked","")
    }
    else
    {
        document.getElementById("HighlightName").removeAttribute("checked");
    }
    try{document.getElementById("HighlightName").addEventListener ("click", HighlightNameBox, false);} catch(err) {}

    //Cases
    //Font Size
    document.getElementById("CaseFontSize").setAttribute("value",CaseFontSize)
    try{document.getElementById("CaseFontSize").addEventListener ("change", CaseFontSizeBox, false);} catch(err) {}

    //Font Color
    document.getElementById("CaseFontColor").setAttribute("value",CaseFontColor)
    try{document.getElementById("CaseFontColor").addEventListener ("change", CaseFontColorBox, false);} catch(err) {}

    //Font Background Color
    document.getElementById("CaseBackgroundColor").setAttribute("value",CaseBackgroundColor)
    try{document.getElementById("CaseBackgroundColor").addEventListener ("change", CaseBackgroundColorBox, false);} catch(err) {}

    //Font Time Color
    document.getElementById("CaseTimeColor").setAttribute("value",CaseTimeColor)
    try{document.getElementById("CaseTimeColor").addEventListener ("change", CaseTimeColorBox, false);} catch(err) {}

    //Font Time Color
    document.getElementById("CaseStalenessColor").setAttribute("value",CaseStalenessColor)
    try{document.getElementById("CaseStalenessColor").addEventListener ("change", CaseStalenessColorBox, false);} catch(err) {}

    //Case Width
    document.getElementById("CaseBoxWidth").setAttribute("value",CaseBoxWidth)
    try{document.getElementById("CaseBoxWidth").addEventListener ("change", CaseBoxWidthBox, false);} catch(err) {}

    //Case Height
    document.getElementById("CaseBoxHeight").setAttribute("value",CaseBoxHeight)
    try{document.getElementById("CaseBoxHeight").addEventListener ("change", CaseBoxHeightBox, false);} catch(err) {}


    //Name
    //Change Color
    document.getElementById("HighlightNameColor").setAttribute("value",HighlightNameColor)
    try{document.getElementById("HighlightNameColor").addEventListener ("change", HighlightNameColorBox, false);} catch(err) {}

    //Name Box
    document.getElementById("Name").setAttribute("value",Name)
    try{document.getElementById("Name").addEventListener ("change", NameBox, false);} catch(err) {}

    //Logged In CheckBox
    if (LoggedInCheck == true)
    {
        document.getElementById("LoggedInCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("LoggedInCheck").removeAttribute("checked");
    }
    try{document.getElementById("LoggedInCheck").addEventListener ("click", LoggedInCheckBox, false);} catch(err) {}

    //Available CheckBox
    if (AvailableCheck == true)
    {
        document.getElementById("AvailableCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("AvailableCheck").removeAttribute("checked");
    }
    try{document.getElementById("AvailableCheck").addEventListener ("click", AvailableCheckBox, false);} catch(err) {}

    //Talking CheckBox
    if (TalkingCheck == true)
    {
        document.getElementById("TalkingCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("TalkingCheck").removeAttribute("checked");
    }
    try{document.getElementById("TalkingCheck").addEventListener ("click", TalkingCheckBox, false);} catch(err) {}

    //Calls Offered CheckBox
    if (CallsOfferedCheck == true)
    {
        document.getElementById("CallsOfferedCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("CallsOfferedCheck").removeAttribute("checked");
    }
    try{document.getElementById("CallsOfferedCheck").addEventListener ("click", CallsOfferedCheckBox, false);} catch(err) {}

    //Calls Taken Checkbox
    if (CallsOfferedCheck == true)
    {
        document.getElementById("CallsTakenCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("CallsTakenCheck").removeAttribute("checked");
    }
    try{document.getElementById("CallsTakenCheck").addEventListener ("click", CallsTakenCheckBox, false);} catch(err) {}

    //Mean Wait Checkbox
    if (MeanWaitCheck == true)
    {
        document.getElementById("MeanWaitCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("MeanWaitCheck").removeAttribute("checked");
    }
    try{document.getElementById("MeanWaitCheck").addEventListener ("click", MeanWaitCheckBox, false);} catch(err) {}

    //Max Wait Checkbox
    if (MaxWaitCheck == true)
    {
        document.getElementById("MaxWaitCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("MaxWaitCheck").removeAttribute("checked");
    }
    try{document.getElementById("MaxWaitCheck").addEventListener ("click", MaxWaitCheckBox, false);} catch(err) {}

    //CallsWaiting Checkbox
    if (CallsWaitingCheck == true)
    {
        document.getElementById("CallsWaitingCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("CallsWaitingCheck").removeAttribute("checked");
    }
    try{document.getElementById("CallsWaitingCheck").addEventListener ("click", CallsWaitingCheckBox, false);} catch(err) {}

    //Reassignments Checkbox
    if (CallsWaitingCheck == true)
    {
        document.getElementById("ReassignmentsCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("ReassignmentsCheck").removeAttribute("checked");
    }
    try{document.getElementById("ReassignmentsCheck").addEventListener ("click", ReassignmentsCheckBox, false);} catch(err) {}

    //OmniChannel Checkbox
    if (OmniChannelCheck == true)
    {
        document.getElementById("OmniChannelCheck").setAttribute("checked","")
    }
    else
    {
        document.getElementById("OmniChannelCheck").removeAttribute("checked");
    }
    try{document.getElementById("OmniChannelCheck").addEventListener ("click", OmniChannelCheckBox, false);} catch(err) {}

    setTimeout(InitializeXHRGrabber, 500); //Grab XHR Loads to update the UI each time TSops tries to change it
})();

function TSOPSButton()
{
    if (document.getElementById("myModal").style.display == "none")
    {
        document.getElementById("myModal").style.display = "block"
    }
    else
    {
        document.getElementById("myModal").style.display = "none"
    }
}

function LineSpacingBox()
{
    document.body.style.lineHeight = document.getElementById("LineSpacing").value
    GM_setValue("LineSpacing",document.getElementById("LineSpacing").value)
}

function ColumnSpacingBox()
{
    switch(document.getElementById("ColumnSpacing").value) {
        case "0.1":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-1")
            document.getElementById("RightColumn").setAttribute("class","col-sm-11")
            break;
        case "0.2":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-2")
            document.getElementById("RightColumn").setAttribute("class","col-sm-10")
            break;
        case "0.3":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-3")
            document.getElementById("RightColumn").setAttribute("class","col-sm-9")
            break;
        case "0.4":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-4")
            document.getElementById("RightColumn").setAttribute("class","col-sm-8")
            break;
        case "0.5":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-5")
            document.getElementById("RightColumn").setAttribute("class","col-sm-7")
            break;
        case "0.6":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-6")
            document.getElementById("RightColumn").setAttribute("class","col-sm-6")
            break;
        case "0.7":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-7")
            document.getElementById("RightColumn").setAttribute("class","col-sm-5")
            break;
        case "0.8":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-8")
            document.getElementById("RightColumn").setAttribute("class","col-sm-4")
            break;
        case "0.9":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-9")
            document.getElementById("RightColumn").setAttribute("class","col-sm-3")
            break;
        case "1":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-10")
            document.getElementById("RightColumn").setAttribute("class","col-sm-2")
            break;
        case "1.1":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-11")
            document.getElementById("RightColumn").setAttribute("class","col-sm-1")
            break;
        case "1.2":
            document.getElementById("LeftColumn").setAttribute("class","col-sm-12")
            document.getElementById("RightColumn").setAttribute("class","col-sm-0")
            break;
    }
    GM_setValue("ColumnSpacing",document.getElementById("ColumnSpacing").value)
}

function ColorTalkingBox()
{
    var ColorTalking = document.getElementById("ColorTalking").value
    var ParentVar = document.getElementsByClassName("talking")[0]
    var ChildrenVars = ParentVar.children
    for (let i=0; i < ChildrenVars.length ;i++)
    {
        var ChildrensChildren = ChildrenVars[i].children
        for (let j=0; j <ChildrensChildren.length;j++)
        {
            ChildrensChildren[j].style.backgroundColor = ColorTalking;
        }
    }
    GM_setValue("ColorTalking",ColorTalking)
}

function ColorAvailableBox()
{
    var ColorAvailable = document.getElementById("ColorAvailable").value
    var ParentVar = document.getElementsByClassName("available")[0]
    var ChildrenVars = ParentVar.children
    for (let i=0; i <ChildrenVars.length;i++)
    {
        var ChildrensChildren = ChildrenVars[i].children
        for (let j=0; j <ChildrensChildren.length;j++)
        {
            ChildrensChildren[j].style.backgroundColor = ColorAvailable;
        }
    }
    GM_setValue("ColorAvailable",ColorAvailable)
}

function ColorWrapUpBox()
{
    var ColorWrapUp = document.getElementById("ColorWrapUp").value
    var ParentVar = document.getElementsByClassName("wrapup")[0]
    var ChildrenVars = ParentVar.children
    for (let i=0; i <ChildrenVars.length;i++)
    {
        var ChildrensChildren = ChildrenVars[i].children
        for (let j=0; j <ChildrensChildren.length;j++)
        {
            ChildrensChildren[j].style.backgroundColor = ColorWrapUp;
        }
    }
    GM_setValue("ColorWrapUp",ColorWrapUp)
}

function ColorUnavailableBox()
{
    var ColorUnavailable = document.getElementById("ColorUnavailable").value
    var ParentVar = document.getElementsByClassName("unavailable")[0]
    var ChildrenVars = ParentVar.children
    for (let i=0; i <ChildrenVars.length;i++)
    {
        var ChildrensChildren = ChildrenVars[i].children
        for (let j=0; j <ChildrensChildren.length;j++)
        {
            ChildrensChildren[j].style.backgroundColor = ColorUnavailable;
        }
    }
    GM_setValue("ColorUnavailable",ColorUnavailable)
}

function ColorOfflineBox()
{
    var ColorOffline = document.getElementById("ColorOffline").value
    var ParentVar = document.getElementsByClassName("logged-out")[0]
    var ChildrenVars = ParentVar.children
    for (let i=0; i < ChildrenVars.length;i++)
    {
        var ChildrensChildren = ChildrenVars[i].children
        for (let j=0; j <ChildrensChildren.length;j++)
        {
            ChildrensChildren[j].style.backgroundColor = ColorOffline;
        }
    }
    GM_setValue("ColorOffline",ColorOffline)
}

function ColorBackgroundBox()
{
    var ColorBackground = document.getElementById("ColorBackground").value
    document.body.style.backgroundColor = ColorBackground
    GM_setValue("ColorBackground",ColorBackground)
}

function LeftFontSizeBox()
{
    var AllCategories = document.getElementsByClassName("row")[1].children[0].children[0].children

    for (let m=0; m < AllCategories.length;m++)
    {
        var ChildrenVars = AllCategories[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j <ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.fontSize = document.getElementById("LeftFontSize").value + "px"
            }
        }
    }
    GM_setValue("LeftFontSize",document.getElementById("LeftFontSize").value)
}

function LeftFontTypeBox()
{
    var AllCategories = document.getElementsByClassName("row")[1].children[0].children[0].children

    for (let m=0; m < AllCategories.length;m++)
    {
        var ChildrenVars = AllCategories[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j <ChildrensChildren.length;j++)
            {
                if (document.getElementById("LeftFontType").value != "Default")
                {
                    ChildrensChildren[j].style.fontFamily = document.getElementById("LeftFontType").value
                }
            }
        }
    }
    GM_setValue("LeftFontType",document.getElementById("LeftFontType").value)
}

function LeftFontWeightBox()
{
    var AllCategories = document.getElementsByClassName("row")[1].children[0].children[0].children

    for (let m=0; m < AllCategories.length;m++)
    {
        var ChildrenVars = AllCategories[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j <ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.fontWeight = document.getElementById("LeftFontWeight").value
            }
        }
    }
    GM_setValue("LeftFontWeight",document.getElementById("LeftFontWeight").value)
}

function LeftFontColorBox()
{
    var AllCategories = document.getElementsByClassName("row")[1].children[0].children[0].children

    for (let m=0; m < AllCategories.length;m++)
    {
        var ChildrenVars = AllCategories[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j <ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.color = document.getElementById("LeftFontColor").value
            }
        }
    }
    GM_setValue("LeftFontColor",document.getElementById("LeftFontColor").value)
}

function RightFontSizeBox()
{
    var AllCategories = document.getElementsByClassName("titlebox")

    for (let m=0; m < AllCategories.length;m++)
    {
        AllCategories[m].style.fontSize = document.getElementById("RightFontSize").value + "px"
    }
    GM_setValue("RightFontSize",document.getElementById("RightFontSize").value)
}

function RightFontTypeBox()
{
    var AllCategories = document.getElementsByClassName("titlebox")

    for (let m=0; m < AllCategories.length;m++)
    {
        AllCategories[m].style.fontFamily = document.getElementById("RightFontType").value
    }
    GM_setValue("RightFontType",document.getElementById("RightFontType").value)
}

function RightFontWeightBox()
{
    var AllCategories = document.getElementsByClassName("titlebox")

    for (let m=0; m < AllCategories.length;m++)
    {
        AllCategories[m].style.fontWeight = document.getElementById("RightFontWeight").value
    }
    GM_setValue("RightFontWeight",document.getElementById("RightFontWeight").value)
}

function RightFontColorBox()
{
    var AllCategories = document.getElementsByClassName("titlebox")

    for (let m=0; m < AllCategories.length;m++)
    {
        AllCategories[m].style.color = document.getElementById("RightFontColor").value
    }
    GM_setValue("RightFontColor",document.getElementById("RightFontColor").value)
}

function RightFontBackgroundColorBox()
{
    var AllCategories = document.getElementsByClassName("titlebox")

    for (let m=0; m < AllCategories.length;m++)
    {
        AllCategories[m].style.backgroundColor = document.getElementById("RightFontBackgroundColor").value
    }
    GM_setValue("RightFontBackgroundColor",document.getElementById("RightFontBackgroundColor").value)
}

function RightBoxWidthBox()
{
    var AllCategories = document.getElementsByClassName("titlebox")

    for (let m=0; m < AllCategories.length;m++)
    {
        AllCategories[m].style.width = document.getElementById("RightBoxWidth").value + "%"
        var Margins = (100-(document.getElementById("RightBoxWidth").value))/2
        AllCategories[m].style.marginLeft = Margins + "%"
        AllCategories[m].style.marginRight = Margins + "%"
    }
    GM_setValue("RightBoxWidth",document.getElementById("RightBoxWidth").value)
}

function RightBoxHeightBox()
{
    var AllCategories = document.getElementsByClassName("titlebox")

    for (let m=0; m < AllCategories.length;m++)
    {
        AllCategories[m].style.height = document.getElementById("RightBoxHeight").value + "px"
        var Margins = (60-(document.getElementById("RightBoxHeight").value))
        AllCategories[m].style.marginTop = Margins + "px"
        AllCategories[m].style.marginBottom = Margins + "px"
    }
    GM_setValue("RightBoxHeight",document.getElementById("RightBoxHeight").value)
}

function RightChoicesArrow()
{
    if(document.getElementById("RightChoicesModal").style.display == "block")
    {
        document.getElementById("RightChoicesModal").style.display = "none"
    }
    else
    {
        document.getElementById("RightChoicesModal").style.display = "block"
    }
}

function ArrowFireChoices()
{
    if(document.getElementById("FireChoicesModal").style.display == "block")
    {
        document.getElementById("FireChoicesModal").style.display = "none"
    }
    else
    {
        document.getElementById("FireChoicesModal").style.display = "block"
    }
}

function FireBox()
{
    var AllCategories = document.getElementsByClassName("row")[1].children[0].children[0].children

    for (let m=0; m < AllCategories.length;m++)
    {
        var ChildrenVars = AllCategories[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            if (ChildrensChildren.length > 2)
            {
                if (ChildrensChildren[3].innerText == "🔥🔥🔥🔥")
                {
                    ChildrensChildren[3].innerText = document.getElementById("Fire").value
                }
            }
        }
    }
    GM_setValue("Fire",document.getElementById("Fire").value)
}

function CaseFontSizeBox()
{
    var AllCategories = document.getElementsByClassName("summary")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.fontSize = document.getElementById("CaseFontSize").value + "px"
        }
    }

    AllCategories = document.getElementsByClassName("case-queue")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.fontSize = document.getElementById("CaseFontSize").value + "px"
        }
    }

    AllCategories = document.getElementsByClassName("case-number")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.fontSize = parseInt(document.getElementById("CaseFontSize").value) + 2 + "px"
        }
    }

    AllCategories = document.getElementsByClassName("badge badge-pill float-right align-top timebox")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.fontSize = parseInt(document.getElementById("CaseFontSize").value) + 3 + "px"
        }
    }

    AllCategories = document.getElementsByClassName("badge badge-pill staleness-reduction")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.fontSize = parseInt(document.getElementById("CaseFontSize").value) + 0 + "px"
        }
    }

    //Calls
    AllCategories = document.getElementsByTagName("a")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            if (AllCategories[m].hasAttribute("_ngcontent-c13"))
            {
                AllCategories[m].style.fontSize = parseInt(document.getElementById("CaseFontSize").value) + 0 + "px"
            }
        }
    }

    GM_setValue("CaseFontSize",document.getElementById("CaseFontSize").value)
}

function CaseFontColorBox()
{
    var AllCategories = document.getElementsByClassName("summary")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.color = document.getElementById("CaseFontColor").value
        }
    }

    AllCategories = document.getElementsByClassName("case-queue")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.color = document.getElementById("CaseFontColor").value
        }
    }

    AllCategories = document.getElementsByClassName("case-number")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.color = document.getElementById("CaseFontColor").value
        }
    }

    //Calls
    AllCategories = document.getElementsByTagName("a")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            if (AllCategories[m].hasAttribute("_ngcontent-c13"))
            {
                AllCategories[m].style.color = document.getElementById("CaseFontColor").value
            }
        }
    }

    GM_setValue("CaseFontColor",document.getElementById("CaseFontColor").value)
}

function CaseBackgroundColorBox()
{
    //Calls
    var AllCategories = document.getElementsByTagName("a")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.backgroundColor = document.getElementById("CaseBackgroundColor").value
        }
    }

    GM_setValue("CaseBackgroundColor",document.getElementById("CaseBackgroundColor").value)
}

function CaseTimeColorBox()
{
    //Calls
    var AllCategories = document.getElementsByClassName("badge badge-pill float-right align-top timebox")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.color = document.getElementById("CaseTimeColor").value
        }
    }

    GM_setValue("CaseTimeColor",document.getElementById("CaseTimeColor").value)
}

function CaseStalenessColorBox()
{
    var AllCategories = document.getElementsByClassName("badge badge-pill staleness-reduction")
    if (AllCategories.length > 0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.backgroundColor = document.getElementById("CaseStalenessColor").value
        }
        GM_setValue("CaseStalenessColor",document.getElementById("CaseStalenessColor").value)
    }
}

function CaseBoxWidthBox()
{
    var AllCategories = document.getElementsByClassName("list-group-item")

    if (AllCategories.length >0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.width = document.getElementById("CaseBoxWidth").value + "%"
            var Margins = (100-(document.getElementById("CaseBoxWidth").value))/2
            AllCategories[m].style.marginLeft = Margins + "%"
            AllCategories[m].style.marginRight = Margins + "%"
        }
        GM_setValue("CaseBoxWidth",document.getElementById("CaseBoxWidth").value)
    }
}

function CaseBoxHeightBox()
{
    var AllCategories = document.getElementsByClassName("list-group-item")

    if (AllCategories.length >0)
    {
        for (let m=0; m < AllCategories.length;m++)
        {
            AllCategories[m].style.height = document.getElementById("CaseBoxHeight").value + "px"
            var Margins = (60-(document.getElementById("CaseBoxHeight").value))
            //AllCategories[m].style.marginTop = Margins + "px"
            //AllCategories[m].style.marginBottom = Margins + "px"
            }
        GM_setValue("CaseBoxHeight",document.getElementById("CaseBoxHeight").value)
    }
}

function TopFontSizeBox()
{
    var FirstCategory = document.getElementsByTagName("app-queue-position")[0].children[0].children[0].children
    for (let m=0; m < FirstCategory.length;m++)
    {
        var ChildrenVars = FirstCategory[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j <ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.fontSize = document.getElementById("TopFontSize").value + "px"
            }
            if (ChildrensChildren.length == 0)
            {
                ChildrenVars[i].style.fontSize = document.getElementById("TopFontSize").value + "px"
            }
        }
    }

    var SecondCategory = document.getElementsByTagName("app-skill-table")[0].children[0].children
    for (let m=0; m < SecondCategory.length;m++)
    {
        ChildrenVars = SecondCategory[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j < ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.fontSize = document.getElementById("TopFontSize").value + "px"
            }
        }
    }
    GM_setValue("TopFontSize",document.getElementById("TopFontSize").value)
}

function TopFontTypeBox()
{
    var FirstCategory = document.getElementsByTagName("app-queue-position")[0].children[0].children[0].children
    for (let m=0; m < FirstCategory.length;m++)
    {
        var ChildrenVars = FirstCategory[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j <ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.fontFamily = document.getElementById("TopFontType").value
            }
            if (ChildrensChildren.length == 0)
            {
                ChildrenVars[i].style.fontFamily = document.getElementById("TopFontType").value
            }
        }
    }

    var SecondCategory = document.getElementsByTagName("app-skill-table")[0].children[0].children
    for (let m=0; m < SecondCategory.length;m++)
    {
        ChildrenVars = SecondCategory[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j < ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.fontFamily = document.getElementById("TopFontType").value
            }
        }
    }
    GM_setValue("TopFontType",document.getElementById("TopFontType").value)
}

function TopFontWeightBox()
{
    var FirstCategory = document.getElementsByTagName("app-queue-position")[0].children[0].children[0].children
    for (let m=0; m < FirstCategory.length;m++)
    {
        var ChildrenVars = FirstCategory[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j <ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.fontWeight = document.getElementById("TopFontWeight").value
            }
            if (ChildrensChildren.length == 0)
            {
                ChildrenVars[i].style.fontWeight = document.getElementById("TopFontWeight").value
            }
        }
    }

    var SecondCategory = document.getElementsByTagName("app-skill-table")[0].children[0].children
    for (let m=0; m < SecondCategory.length;m++)
    {
        ChildrenVars = SecondCategory[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j < ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.fontWeight = document.getElementById("TopFontWeight").value
            }
        }
    }
    GM_setValue("TopFontWeight",document.getElementById("TopFontWeight").value)
}

function TopFontColorBox()
{
    var FirstCategory = document.getElementsByTagName("app-queue-position")[0].children[0].children[0].children
    for (let m=0; m < FirstCategory.length;m++)
    {
        var ChildrenVars = FirstCategory[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j <ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.color = document.getElementById("TopFontColor").value
            }
            if (ChildrensChildren.length == 0)
            {
                ChildrenVars[i].style.color = document.getElementById("TopFontColor").value
            }
        }
    }

    var SecondCategory = document.getElementsByTagName("app-skill-table")[0].children[0].children
    for (let m=0; m < SecondCategory.length;m++)
    {
        ChildrenVars = SecondCategory[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j < ChildrensChildren.length;j++)
            {
                ChildrensChildren[j].style.color = document.getElementById("TopFontColor").value
            }
        }
    }
    GM_setValue("TopFontColor",document.getElementById("TopFontColor").value)
}

function TopChoicesArrow()
{
    if(document.getElementById("TopChoicesModal").style.display == "block")
    {
        document.getElementById("TopChoicesModal").style.display = "none"
    }
    else
    {
        document.getElementById("TopChoicesModal").style.display = "block"
    }
}

function LoggedInCheckBox()
{
    var Parent = document.getElementsByTagName("th")

    if (document.getElementById("LoggedInCheck").checked)
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Logged In")
            {
                Parent[m].style.display = ""
                var row = m-1;
            }
        }

        var Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = ""
        }

        document.getElementById("LoggedInCheck").setAttribute("checked","")
        GM_setValue("LoggedInCheck",true)
    }
    else
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Logged In")
            {
                Parent[m].style.display = "none"
                row = m-1;
            }
        }

        Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = "none" //children[1] is Logged In
        }

        document.getElementById("LoggedInCheck").removeAttribute("checked");
        GM_setValue("LoggedInCheck",false)
    }
}

function AvailableCheckBox()
{
    var Parent = document.getElementsByTagName("th")
    if (document.getElementById("AvailableCheck").checked)
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Available")
            {
                Parent[m].style.display = ""
                var row = m-1;
            }
        }

        var Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = ""
        }

        document.getElementById("AvailableCheck").setAttribute("checked","")
        GM_setValue("AvailableCheck",true)
    }
    else
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Available")
            {
                Parent[m].style.display = "none"
                row = m-1;
            }
        }

        Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = "none"
        }

        document.getElementById("AvailableCheck").removeAttribute("checked");
        GM_setValue("AvailableCheck",false)
    }
}

function TalkingCheckBox()
{
    var Parent = document.getElementsByTagName("th")
    if (document.getElementById("TalkingCheck").checked)
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Talking")
            {
                Parent[m].style.display = ""
                var row = m-1;
            }
        }

        var Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = ""
        }

        document.getElementById("TalkingCheck").setAttribute("checked","")
        GM_setValue("TalkingCheck",true)
    }
    else
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Talking")
            {
                Parent[m].style.display = "none"
                row = m-1;
            }
        }

        Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = "none"
        }

        document.getElementById("TalkingCheck").removeAttribute("checked");
        GM_setValue("TalkingCheck",false)
    }
}

function CallsOfferedCheckBox()
{
    var Parent = document.getElementsByTagName("th")
    if (document.getElementById("CallsOfferedCheck").checked)
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Calls Offered")
            {
                Parent[m].style.display = ""
                var row = m-1;
            }
        }

        var Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = ""
        }

        document.getElementById("CallsOfferedCheck").setAttribute("checked","")
        GM_setValue("CallsOfferedCheck",true)
    }
    else
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Calls Offered")
            {
                Parent[m].style.display = "none"
                row = m-1;
            }
        }

        Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = "none"
        }

        document.getElementById("CallsOfferedCheck").removeAttribute("checked");
        GM_setValue("CallsOfferedCheck",false)
    }
}

function CallsTakenCheckBox()
{
    var Parent = document.getElementsByTagName("th")
    if (document.getElementById("CallsTakenCheck").checked)
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Calls Taken")
            {
                Parent[m].style.display = ""
                var row = m-1;
            }
        }

        var Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = ""
        }

        document.getElementById("CallsTakenCheck").setAttribute("checked","")
        GM_setValue("CallsTakenCheck",true)
    }
    else
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Calls Taken")
            {
                Parent[m].style.display = "none"
                row = m-1;
            }
        }

        Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = "none"
        }

        document.getElementById("CallsTakenCheck").removeAttribute("checked");
        GM_setValue("CallsTakenCheck",false)
    }
}

function MeanWaitCheckBox()
{
    var Parent = document.getElementsByTagName("th")
    if (document.getElementById("MeanWaitCheck").checked)
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Mean Wait")
            {
                Parent[m].style.display = ""
                var row = m-1;
            }
        }

        var Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = ""
        }

        document.getElementById("MeanWaitCheck").setAttribute("checked","")
        GM_setValue("MeanWaitCheck",true)
    }
    else
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Mean Wait")
            {
                Parent[m].style.display = "none"
                row = m-1;
            }
        }

        Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = "none"
        }

        document.getElementById("MeanWaitCheck").removeAttribute("checked");
        GM_setValue("MeanWaitCheck",false)
    }
}

function MaxWaitCheckBox()
{
    var Parent = document.getElementsByTagName("th")
    if (document.getElementById("MaxWaitCheck").checked)
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Max Wait")
            {
                Parent[m].style.display = ""
                var row = m-1;
            }
        }

        var Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = ""
        }

        document.getElementById("MaxWaitCheck").setAttribute("checked","")
        GM_setValue("MaxWaitCheck",true)
    }
    else
    {
        for (let m=0; m < Parent.length ;m++)
        {
            if (Parent[m].innerText == "Max Wait")
            {
                Parent[m].style.display = "none"
                row = m-1;
            }
        }

        Skills = document.getElementsByTagName("tbody")[1].children
        for (let m=0; m < Skills.length ;m++)
        {
            Skills[m].children[row].style.display = "none"
        }

        document.getElementById("MaxWaitCheck").removeAttribute("checked");
        GM_setValue("MaxWaitCheck",false)
    }
}

function CallsWaitingCheckBox()
{
    var Parent = document.getElementsByClassName("titlebox")[0]

    if (document.getElementById("CallsWaitingCheck").checked)
    {
        Parent.style.display = ""
        document.getElementById("CallsWaitingCheck").setAttribute("checked","")
        GM_setValue("CallsWaitingCheck",true)
    }
    else
    {
        Parent.style.display = "none"
        document.getElementById("CallsWaitingCheck").removeAttribute("checked");
        GM_setValue("CallsWaitingCheck",false)
    }
}

function ReassignmentsCheckBox()
{
    var Parent = document.getElementsByClassName("titlebox")[1]

    if (document.getElementById("ReassignmentsCheck").checked)
    {
        Parent.style.display = ""
        document.getElementById("ReassignmentsCheck").setAttribute("checked","")
        GM_setValue("ReassignmentsCheck",true)
    }
    else
    {
        Parent.style.display = "none"
        document.getElementById("ReassignmentsCheck").removeAttribute("checked");
        GM_setValue("ReassignmentsCheck",false)
    }
}

function OmniChannelCheckBox()
{
    var Parent = document.getElementsByClassName("titlebox")[2]

    if (document.getElementById("OmniChannelCheck").checked)
    {
        Parent.style.display = ""
        document.getElementById("OmniChannelCheck").setAttribute("checked","")
        GM_setValue("OmniChannelCheck",true)
    }
    else
    {
        Parent.style.display = "none"
        document.getElementById("OmniChannelCheck").removeAttribute("checked");
        GM_setValue("OmniChannelCheck",false)
    }
}

function HighlightNameBox()
{
    if (document.getElementById("HighlightName").checked)
    {
        document.getElementById("HighlightName").setAttribute("checked","")
        GM_setValue("HighlightName",true)
    }
    else
    {
        document.getElementById("HighlightName").removeAttribute("checked");
        GM_setValue("HighlightName",false)
    }
}

function HighlightNameColorBox()
{
    if (!document.getElementById("HighlightName").checked)
    {
        GM_setValue("HighlightNameColor",document.getElementById("HighlightNameColor").value)
        return;
    }

    var AllCategories = document.getElementsByClassName("row")[1].children[0].children[0].children
    for (let m=0; m < AllCategories.length;m++)
    {
        var ChildrenVars = AllCategories[m].children
        for (let i=0; i < ChildrenVars.length;i++)
        {
            var ChildrensChildren = ChildrenVars[i].children
            for (let j=0; j <ChildrensChildren.length;j++)
            {
                if (ChildrensChildren.length > 1)
                {
                    if (ChildrensChildren[2].innerText == document.getElementById("Name").value)
                    {
                        ChildrensChildren[j].style.fontWeight = "bold"
                        ChildrensChildren[j].style.backgroundColor = document.getElementById("HighlightNameColor").value
                    }
                }
            }
        }
    }
    GM_setValue("HighlightNameColor",document.getElementById("HighlightNameColor").value)
}

function NameBox()
{
    HighlightNameColorBox()
    GM_setValue("Name",document.getElementById("Name").value)
}

function UpdateCurrentValues() //Updates all values on the page on every XHR request
{
    ColorTalkingBox(); //Color Talking users
    ColorAvailableBox(); //Color Available users
    ColorWrapUpBox(); //Color users in Wrap-Up

    FireBox(); //Changes fire emojis

    ColorUnavailableBox(); //Color Unavailable users
    ColorOfflineBox(); //Color Offline users
    ColorBackgroundBox(); //Color the background
    LeftFontSizeBox(); //Changes PSE list font size
    LeftFontTypeBox(); //Changes PSE list font type
    LeftFontWeightBox(); //Changes PSE list font weight
    LeftFontColorBox(); //Changes PSE list font color

    RightFontSizeBox(); //Changes large header font size
    RightFontTypeBox(); //Changes large header font type
    RightFontWeightBox(); //Changes large header font weight
    RightFontColorBox(); //Changes large header font color
    RightBoxWidthBox(); //Changes width of header boxes
    RightBoxHeightBox(); //Changes height of header boxes

    CaseFontSizeBox(); //Changes case font size
    CaseFontColorBox(); //Changes case font color
    CaseBackgroundColorBox(); //Changes case background color
    CaseTimeColorBox(); //Changes case background color
    CaseStalenessColorBox(); //Changes case background color
    CaseBoxWidthBox(); //Changes case box width
    CaseBoxHeightBox(); //Changes the case box height

    TopFontSizeBox(); //Changes Top bar font size
    TopFontTypeBox(); //Changes Top bar font type
    TopFontWeightBox(); //Changes Top bar font weight
    TopFontColorBox(); //Changes Top bar font color

    HighlightNameColorBox(); //Checkbox to highlight name
    LoggedInCheckBox(); //Checkbox to hide Logged In
    AvailableCheckBox(); //Checkbox to hide Available
    TalkingCheckBox(); //Checkbox to hide Talking
    CallsOfferedCheckBox(); //Checkbox to hide Calls Offered
    CallsTakenCheckBox(); //Checkbox to hide Calls Taken
    MeanWaitCheckBox(); //Checkbox to hide Mean Wait
    MaxWaitCheckBox(); //Checkbox to hide Max Wait

    CallsWaitingCheckBox(); //Checkbox to hide Calls Waiting
}

function SetDefaults()
{
    console.log("Setting Defaults")
    GM_setValue("LineSpacing",'1.5')
    GM_setValue("ColumnSpacing",'0.8')
    GM_setValue("ColorTalking",'#4682b4')
    GM_setValue("ColorAvailable",'#007849')
    GM_setValue("ColorWrapUp",'#af473c')
    GM_setValue("ColorUnavailable",'#808080')
    GM_setValue("ColorOffline",'#444444')
    GM_setValue("ColorBackground",'#333333')
    GM_setValue("HighlightName",false)
    GM_setValue("HighlightNameColor",'#00EEFF')
    GM_setValue("Name",'')
    GM_setValue("Fire",'🔥🔥🔥🔥')

    GM_setValue("LeftFontSize",'12')
    GM_setValue("LeftFontType",'')
    GM_setValue("LeftFontWeight",'400')
    GM_setValue("LeftFontColor",'#ffffff')

    GM_setValue("RightFontSize",'40');
    GM_setValue("RightFontType",'');
    GM_setValue("RightFontWeight",'400');
    GM_setValue("RightFontColor",'#ffffff');
    GM_setValue("RightFontBackgroundColor",'#000000');
    GM_setValue("RightBoxWidth",'95');
    GM_setValue("RightBoxHeight",'55');

    GM_setValue("CaseFontSize",'12');
    GM_setValue("CaseBackgroundColor",'#ffffff');
    GM_setValue("CaseFontColor",'#000000');
    GM_setValue("CaseTimeColor",'#ffffff');
    GM_setValue("CaseStalenessColor",'#008000');
    GM_setValue("CaseBoxWidth",'95');
    GM_setValue("CaseBoxHeight",'100');

    GM_setValue("CallsWaitingCheck",true)
    GM_setValue("ReassignmentsCheck",true)
    GM_setValue("OmniChannelCheck",true)

    GM_setValue("TopFontSize",'12')
    GM_setValue("TopFontType",'')
    GM_setValue("TopFontWeight",'400')
    GM_setValue("TopFontColor",'#ffffff')

    GM_setValue("LoggedInCheck",true)
    GM_setValue("AvailableCheck",true)
    GM_setValue("TalkingCheck",true)
    GM_setValue("CallsOfferedCheck",true)
    GM_setValue("CallsTakenCheck",true)
    GM_setValue("MeanWaitCheck",true)
    GM_setValue("MaxWaitCheck",true)
}

async function ResetAllBox()
{
    await SetDefaults()
    await setTimeout(function(){ location.reload(); }, 500);
    await SetDefaults()
}

function InitializeXHRGrabber()
{
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("loadend", function() {
                UpdateCurrentValues(); //Update all values when TSops loads
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
}