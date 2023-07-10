// ==UserScript==
// @name Nothing Bad
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Nothing Bad, duh
// @author You
// @match https://mywallet.deals/*
// @grant none
// @run-at document-end
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(RUNTHECODE,1000);
})();

function RUNTHECODE()
{
    document.getElementsByClassName("redeemable-points")[0].children[0].innerText = "1536"
    try{document.getElementsByClassName("notification-section is-error")[0].style.opacity = 0} catch(er){}

    var Items = document.getElementsByClassName("circle-wrapper")
    for (let i = 0; i < Items.length; i++) {
        Items[i].onclick = function(event)
        {
            try{document.getElementsByClassName("notification-section is-error")[0].style.opacity = 0} catch(er){}
            var ItemName = Items[i].innerText
            var TotalText = '<div data-v-5190d332="" class="modal-backdrop"> <div class="modal"><div class="modal-close">×</div><h3 data-v-5190d332="">Reward Redemption</h3><div data-v-5190d332=""><p data-v-5190d332=""> STOP! Please make sure you are with staff before redeeming your reward. Staff needs to watch you redeem your offer in order for you to receive your reward. </p><p data-v-5190d332="" class="modal-ready-redeem"> Are you ready to redeem your reward: ' + ItemName + '? </p></div><div class="modal-click-action"></div><div class="warning-wrapper"><div class="action-button close"> return to wallet </div><div class="action-button proceed"> proceed to offer </div></div><!----></div>'
            document.getElementsByClassName("rewards")[0].insertAdjacentHTML("afterbegin", TotalText);
            document.getElementsByClassName("modal-backdrop")[0].onclick = function(event)
            {
                try{document.getElementsByClassName("notification-section is-error")[0].style.opacity = 0} catch(er){}
                var d = new Date();
                var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                var CurrentDay = days[d.getDay()]
                var DayOfMonth = d.getDate()

                var FutureDate = addMinutes(d,30)
                var CurrentTimeText = formatAMPM(d)
                var FutureTimeText = formatAMPM(FutureDate)
                var FullCurrentTimeText = formatAMPM_w_seconds(d)
                var FullFutureTimeText = formatAMPM_w_seconds(FutureDate)
                var RewardPageTotalText = '<div data-v-5190d332="" class="redeem-section"><div class="redeem-content"><h3 class="redeem-phone">(817) 881-4132</h3><h5 class="redeem-time"> ' + FullCurrentTimeText + ' <small>expires: ' + FullFutureTimeText + '</small></h5><h1 class="redeem-name">' + ItemName + '</h1><div class="redeem-image image-wrapper"><div class="star-icon"><svg viewBox="0 0 32.218 32.218"><use xlink:href="#star-icon"></use></svg></div><!----></div><div class="redeem-expired"><h3>redeemed</h3><small>valid until ' + FutureTimeText + ', ' + CurrentDay + ' February ' + DayOfMonth + '</small></div><p class="redeem-confirmation"> confirmation 3479714 </p></div><div class="return-to-wallet"><span class="return-arrow">⤦</span><span>return to wallet</span></div></div>'

                document.getElementsByClassName("rewards")[0].insertAdjacentHTML("beforeend",RewardPageTotalText)
                document.getElementsByClassName("redeem-section")[0].onclick = function(event)
                {
                    try{document.getElementsByClassName("notification-section is-error")[0].style.opacity = 0} catch(er){}
                    document.getElementsByClassName("modal-backdrop")[0].remove()
                    document.getElementsByClassName("redeem-section")[0].remove()
                    document.getElementsByClassName("redeemable-points")[0].children[0].innerText = "36"
                }

                event.stopPropagation();
            };

        }
    }
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function formatAMPM_w_seconds(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds= seconds_with_leading_zeros(date)
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
}

function seconds_with_leading_zeros(dt)
{
    return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
}

function addMinutes(date, minutes) {
    date.setSeconds(0);
    return new Date(date.getTime() + minutes*60000);
}