// ==UserScript==
// @name		Bostad Stockholm
// @namespace	        http://danieleliasson.com/
// @description         Show queue time for flats in search results
// @include		https://bokabostad.stockholm.se/LagenhetSok.aspx*
// @exclude
// ==/UserScript==

var jq;

// Add jQuery
(function(){
     if (typeof unsafeWindow.jQuery == 'undefined') {
	 var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
	 GM_JQ = document.createElement('script');

	 GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
	 GM_JQ.type = 'text/javascript';
	 GM_JQ.async = true;

	 GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
     }
     GM_wait();
})();

// Check if jQuery's loaded
function GM_wait() {
    if (typeof unsafeWindow.jQuery == 'undefined') {
	window.setTimeout(GM_wait, 100);
    } else {
	jq = unsafeWindow.jQuery;
	letsJQuery();
    }
}

// All your GM code must be inside this function
function letsJQuery() {
    var links = jq("table#uiGridViewIntresseanmalan.boslist1 tr td:nth-child(3) a");
    jq(links).each(function(i, a) { handleLink(a); });
}

function handleLink(a) {
    var url = jq(a).attr('href');
    var c = parseAndInsertPlace(a);
    getPlaceInLine(url, c);
}

function parseAndInsertPlace(a) {
    return function(raw) {
	var exp = /\d+/g;
	var match = raw.match(exp);
	var dateCell = jq(a).parent().parent().children()[7];
	jq(dateCell).html(match[0] + '/' + match[1]);
    };
}

function getPlaceInLine(url, c) {
    jq.ajax({
        url: url,
	data: {},
	success: function(result) {
	    var context = jq(result);
	    var place = jq("div.status + div > p:nth-child(2)", context).html();
	    c(place);
	}
    });
}

