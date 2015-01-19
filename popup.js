var req = new XMLHttpRequest(), current;
req.open("GET", "links.xml");
req.onload = showLinks;
req.send(null);

window.addEventListener('load', function(evt) {
	// Add event listeners for typing etc.
	document.getElementById("textBox").addEventListener("keyup", onKeyUp);
	document.getElementById("textBox").addEventListener("keypress", onKeyPress);
	document.getElementById("searchBtn").addEventListener("click", search);
});

function onKeyUp(evt) {
	if (evt.keyCode == 13) {
		go();
	} else {
		search();
	}
}

function onKeyPress(evt) {
	return (evt.which != 13);
}

function showLinks() {
	var links = req.responseXML.getElementsByTagName("link");
	var p, a, h, t;

	current = links[0].getAttribute("http");

	for (var i = 0, link; link = links[i]; i++) {
		p = document.createElement("p");
		a = document.createElement("a");
		h = link.getAttribute("http");
		t = link.getAttribute("title");
		l = link.getAttribute("length");
		p.appendChild(document.createTextNode((i+1) + ') '));
		a.href = h;
		a.onclick = (function(value) {
			return function() { chrome.tabs.create( { url: value } ); }
		})(h);
		a.appendChild(document.createTextNode(t));
		p.appendChild(a);
		if (l != "NA") p.appendChild(document.createTextNode(" (" + l + ")"));
		document.body.appendChild(p);
	}
	document.getElementById("textBox").focus();
}

function search() {
	var str = document.sForm.textBox.value.toLowerCase()
	var links = document.getElementsByTagName('p');
	for (var i = (links.length-1); i >= 0; i--)
		links[i].parentNode.removeChild(links[i]);

	links = req.responseXML.getElementsByTagName("link");
	var p, a, h, t, k = 0, link, cFlag;

	current = null;
	cFlag = 1;

	for (var i = 0; link = links[i]; i++) {
		t = link.getAttribute("title");
		if (t.toLowerCase().indexOf(str) != -1) {
			k++;
			if (cFlag == 1) { current = links[i].getAttribute("http"); cFlag = 0; }
			p = document.createElement("p");
			a = document.createElement("a");
			h = link.getAttribute("http");
			l = link.getAttribute("length");
			p.appendChild(document.createTextNode((k) + ') '));
			a.href = h;
			a.onclick = (function(value) {
				return function() { chrome.tabs.create( { url: value } ); }
			})(h);
			a.appendChild(document.createTextNode(t));
			p.appendChild(a);
			if (l != "NA") p.appendChild(document.createTextNode(" (" + l + ")"));
			document.body.appendChild(p);
		}
	}
}

function go() {
	if (current != null) chrome.tabs.create( { url: current } );
}
