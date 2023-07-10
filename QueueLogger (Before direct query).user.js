// ==UserScript==
// @name         QueueLogger (Before direct query)
// @namespace    http://tampermonkey.net/
// @version      0
// @description  EOS Stuff
// @author       Connor Kaiser
// @include      https://tsops*605885
// @grant        GM_download
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.js
(function()
 {
    console.log("TEST2 Start")
    if (window.top === window.self)
    {
    }
    else
    {
        document.getElementsByClassName("row")[1].remove();
        document.getElementsByClassName("col-sm-4")[0].remove();
        document.getElementsByTagName("app-skill-table")[0].remove();
        document.getElementsByTagName("img")[0].remove();
        document.getElementsByClassName("d-flex flex-row")[0].style.width = "800px";
        document.getElementsByClassName("row")[0].style.marginLeft = "-33px";
        document.getElementsByClassName("row")[0].style.paddingTop = "13px";
        document.getElementsByTagName("table")[0].insertAdjacentHTML("beforeend",'<button type="button" style="margin-top: 5px;" id="QueueButton">Queue</button>')
        try{document.getElementById("QueueButton").addEventListener ("click", SendCount, false);} catch(err) {}
    }
})();

function SendCount()
{
    var d = new Date()
    if (d.getHours() >= 16 && d.getMinutes() >= 30) //After 4:30 EOS no matter what
    {
    }
    else
    {
        document.getElementById("QueueButton").style.color = "blue"
        // If we can figure out Post requests, this would likely be better than local storage/hosting
        /*
        GM_xmlhttpRequest ( {
        method:     'POST',
        url:        'http://127.0.0.1:8887/queue.txt',
        data:       '1 2',
        responseType:'plain/text',
        //headers:    {"Content-Type": "application/json"},
        onload:     function (responseDetails)
        {
            console.log(responseDetails.responseText);
            console.log(responseDetails.finalUrl)
        }
    } );
    */

        console.log("Downloading Queues")
        try{var data = new Blob(
            [document.getElementsByTagName("td")[1].innerText + " " + document.getElementsByTagName("td")[3].innerText], // Blob parts.
            {
                type : "plain/text"
            }
        );
           }
        catch(er){data =new Blob()}

        var downloadUrl = URL.createObjectURL(data);
        var link = document.createElement('a');
        link = document.createElement('a');
        link.href = downloadUrl
        link.download = "queue.txt";
        document.body.appendChild(link);
        console.log(link)
        link.click();
        document.body.removeChild(link);

        if (downloadUrl)
        {
            URL.revokeObjectURL( downloadUrl );
        }
        setTimeout(function() {SendCount();}, 5000);
    }
    return;
}