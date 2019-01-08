result = {
    "Time": "",
    "UserAgent": "",
    "system": "",
    "plugins": "",
    "publicIP": "",
    "localIP": "",
    "IPv6": ""
}
if (typeof JSON !== "object") {
    JSON = {};
}
(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
                return (n < 10)
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? (
                    this.getUTCFullYear()
                    + "-"
                    + f(this.getUTCMonth() + 1)
                    + "-"
                    + f(this.getUTCDate())
                    + "T"
                    + f(this.getUTCHours())
                    + ":"
                    + f(this.getUTCMinutes())
                    + ":"
                    + f(this.getUTCSeconds())
                    + "Z"
                )
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {


        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {


        var i;                  var k;                  var v;                  var length;
        var mind = gap;
        var partial;
        var value = holder[key];


        if (
            value
            && typeof value === "object"
            && typeof value.toJSON === "function"
        ) {
            value = value.toJSON(key);
        }


        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }


        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":


            return (isFinite(value))
                ? String(value)
                : "null";

        case "boolean":
        case "null":


            return String(value);


        case "object":


            if (!value) {
                return "null";
            }


            gap += indent;
            partial = [];


            if (Object.prototype.toString.apply(value) === "[object Array]") {


                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }


                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? (
                            "[\n"
                            + gap
                            + partial.join(",\n" + gap)
                            + "\n"
                            + mind
                            + "]"
                        )
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }


            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                (gap)
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {


                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                (gap)
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }


            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }


    if (typeof JSON.stringify !== "function") {
        meta = {                "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {


            var i;
            gap = "";
            indent = "";


            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }


            } else if (typeof space === "string") {
                indent = space;
            }


            rep = replacer;
            if (replacer && typeof replacer !== "function" && (
                typeof replacer !== "object"
                || typeof replacer.length !== "number"
            )) {
                throw new Error("JSON.stringify");
            }


            return str("", {"": value});
        };
    }



    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {


            var j;

            function walk(holder, key) {


                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }



            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return (
                        "\\u"
                        + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    );
                });
            }



            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {


                j = eval("(" + text + ")");


                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }


            throw new SyntaxError("JSON.parse");
        };
    }
}());
var date = new Date();
result["Time"] = date;
var UA = navigator.userAgent;
result["UserAgent"] = UA;
var system = navigator.platform;
result["system"] = system;
var plugins = JSON.stringify(navigator.plugins)
result["plugins"] = plugins;
function getIPs(callback){
    var ip_dups = {};
        var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;
        if(!RTCPeerConnection){
                                                var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }
        var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };
    var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
        var pc = new RTCPeerConnection(servers, mediaConstraints);
    function handleCandidate(candidate){
                var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1];
                if(ip_dups[ip_addr] === undefined)
            callback(ip_addr);
        ip_dups[ip_addr] = true;
    }
        pc.onicecandidate = function(ice){
                if(ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };
        pc.createDataChannel("");
        pc.createOffer(function(result){
                pc.setLocalDescription(result, function(){}, function(){});
    }, function(){});
        setTimeout(function(){
                var lines = pc.localDescription.sdp.split('\n');
        lines.forEach(function(line){
            if(line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
        var request = new XMLHttpRequest();
        request.open("POST", "/probe/error.png")
        request.send(btoa(JSON.stringify(result)))
    }, 1000);
}
getIPs(function(ip){
    var li = document.createElement("li");
    li.textContent = ip;
        if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)){
        document.getElementsByTagName("ul")[0].appendChild(li);
        result["localIP"] = ip;
    }
        else if (ip.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/)){
        document.getElementsByTagName("ul")[2].appendChild(li);
        result["IPv6"] = ip; 
    }
        else{
        document.getElementsByTagName("ul")[1].appendChild(li);
        result["publicIP"] = ip;
    }
});

var li_time = document.createElement("li");
li_time.textContent = result["Time"];
document.getElementsByTagName("ul")[3].appendChild(li_time);
var li_UA = document.createElement("li");
li_UA.textContent = result["UserAgent"];
document.getElementsByTagName("ul")[4].appendChild(li_UA);
var li_system = document.createElement("li");
li_system.textContent = result["system"];
document.getElementsByTagName("ul")[5].appendChild(li_system);
var li_plugins = document.createElement("li");
li_plugins.textContent = result["plugins"];
document.getElementsByTagName("ul")[6].appendChild(li_plugins);