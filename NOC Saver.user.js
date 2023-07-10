// ==UserScript==
// @name         NOC Saver
// @namespace    http://tampermonkey.net/
// @version      0
// @description  Remove NOC "Closed" Button
// @author       Connor Kaiser
// @include      https://osisoft--fullcopy.*
// @include      https://osisoft--prodcopy.*
// @include      https://osisoft.lightning.force.*
// @grant        none
// ==/UserScript==

(function()
{
	var CaseCount = 0;
    var GridCount = 0;
    var ActiveButtonCount = 0;
    var CurrentButtonCount = 0;

    var observer = new MutationObserver(function(mutations)
    {
        var CaseDetails;
        var CaseButtons;
        var ButtonGrid;
        var ButtonName;
        var NOCContactButton;
        var NOCCloseButton;
        var ButtonContainer;
        var EntryVariable;

        var CasesOpen = document.getElementsByClassName("flexipageRecordHomePinnedLeftRightSidebarsTemplateDesktop");
        var ButtonGrids = document.getElementsByClassName("slds-grid slds-path__action runtime_sales_pathassistantPathAssistantHeader");
        var ActiveButton = document.getElementsByClassName("slds-button slds-button--brand slds-path__mark-complete stepAction active uiButton")
        var CurrentButton = document.getElementsByClassName("slds-button slds-button--brand slds-path__mark-complete stepAction current uiButton")

		if (CasesOpen != null && (CasesOpen.length != CaseCount || ButtonGrids.length != GridCount || ActiveButton.length != ActiveButtonCount || CurrentButton.length != CurrentButtonCount))
		{
			CaseCount = CasesOpen.length;
            GridCount = ButtonGrids.length;
            ActiveButtonCount = ActiveButton.length;
            CurrentButtonCount = CurrentButton.length;
        }
		else
		{
			return;
        }

		for (let i = 0; i < CasesOpen.length; i++)
		{
            CaseDetails = CasesOpen[i].getElementsByClassName("slds-card__header-link slds-truncate slds-show--inline-block uiOutputURL");
            CaseButtons = CasesOpen[i].getElementsByClassName("pa-tabs__nav slds-path__nav")[0].children;

            if (CaseDetails[0].innerText == "NOC Details")
            {
                EntryVariable = CasesOpen[i].getElementsByClassName("EmptyPlaceHolder");
                if (EntryVariable.length == 0)
                {
                    ButtonGrid = CasesOpen[i].getElementsByClassName("slds-grid slds-path__action runtime_sales_pathassistantPathAssistantHeader")[0];
                    NOCContactButton = CasesOpen[i].getElementsByClassName("slds-button slds-button_neutral slds-button_brand cOSIS_CC_NOC_Contact")[0];
                    NOCCloseButton = CasesOpen[i].getElementsByClassName("slds-button slds-button_neutral slds-button_brand cOSIS_Close_NOC_Case")[0];
                    ActiveButton = CasesOpen[i].getElementsByClassName("slds-button slds-button--brand slds-path__mark-complete stepAction active uiButton")[0];
                    CurrentButton = CasesOpen[i].getElementsByClassName("slds-button slds-button--brand slds-path__mark-complete stepAction current uiButton")[0];

                    ButtonGrid.insertAdjacentHTML('beforeend','<p class="EmptyPlaceHolder" data-aura-rendered-by="3053:0"></p>');
                    ButtonContainer = CasesOpen[i].getElementsByClassName("EmptyPlaceHolder")[0];
                    try{ButtonContainer.appendChild(NOCCloseButton)}catch(err) {}
                    try{ButtonContainer.appendChild(ActiveButton)}catch(err) {}
                    try{ButtonContainer.appendChild(CurrentButton)}catch(err) {}

                    for (let j = CaseButtons.length-1; j >= 0; j--)
                    {
                        ButtonName = CaseButtons[j].getAttribute("data-name")
                        if (ButtonName == "Answered" || ButtonName == "Closed" || ButtonName == "Pending Fix" || ButtonName == "Abandoned")
                        {
                            CaseButtons[j].remove();
                        }
                    }
                }
                if (EntryVariable.length == 1)
                {
                    ButtonContainer = CasesOpen[i].getElementsByClassName("EmptyPlaceHolder")[0];
                    ActiveButton = CasesOpen[i].getElementsByClassName("slds-button slds-button--brand slds-path__mark-complete stepAction active uiButton")[0];
                    CurrentButton = CasesOpen[i].getElementsByClassName("slds-button slds-button--brand slds-path__mark-complete stepAction current uiButton")[0];
                    try{ButtonContainer.appendChild(ActiveButton)}catch(err) {}
                    try{ButtonContainer.appendChild(CurrentButton)}catch(err) {}
                }
                try{CasesOpen[i].getElementsByClassName("slds-button slds-button--brand slds-path__mark-complete stepAction current uiButton")[0].addEventListener("click", function() { FixButtons(0,CasesOpen[i]); }, true);} catch(err) {}
            }
        }
    });

    observer.observe(document, {
    childList: true,
    subtree: true
    });

})();

function FixButtons(Counter,CaseInQuestion)
{
    var CaseOpen = CaseInQuestion
    var CaseButtons = CaseOpen.getElementsByClassName("pa-tabs__nav slds-path__nav")[0].children;
    var CaseNumber = 0

    if(CaseButtons.length == 5)
    {
        for (let j = CaseButtons.length-1; j >= 0; j--)
        {
            var ButtonName = CaseButtons[j].getAttribute("data-name")
            if (ButtonName == "Answered" || ButtonName == "Closed" || ButtonName == "Pending Fix" || ButtonName == "Abandoned")
            {
                CaseButtons[j].remove();
            }
        }

        var Container = CaseOpen.getElementsByClassName("pa-tabs__nav slds-path__nav")[0]
        var FirstButton = CaseButtons[0]
        var LastButton = CaseButtons[2]
        Container.insertBefore (LastButton, FirstButton);
    }
    else
    {
        if (Counter < 400)
        {
            setTimeout(function() {FixButtons(++Counter,CaseOpen);}, 10);
        }
    }
    return;
}

