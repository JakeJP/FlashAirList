/*
    List.htm example for FlashAir(TM) TOSHIBA
    (c) 2015 Yokinsoft http://www.yo-ki.com
    MIT License
 */

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then

            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}

var FlashAir = 
(function () {
    function geTimestamp() {
        return Date.now();
    }
    var fa = function (options) {
        var me = this;
        me.baseUrl = options.host || "";
        if (me.baseUrl.lastIndexOf("/") == me.baseUrl.length - 1) {
            me.baseUrl = me.baseUrl.substring(0, me.baseUrl.length - 1 );
        }
        $("#hostUrl").text(me.baseUrl || document.location.host);
        me.dir = options.dir;
        me.interval = 2000;
        me.timestamp = null;
        me.wlansd_map = {};
        me.template = $("#itemTeamplte").html();

        me.grid = $("#grid");

        var inits = [];
        inits.push(me.browserLanguage());
        inits.push( 
            $.get( me.baseUrl + '/command.cgi?op=202') // sharemode
            .done(function (result) {
                me.photoShareMode = result;
                me.setWindowTitle(me.photoShareMode == "PHOTOSHARE" ? lang_list[me.lang]["Set_List_Lang_1"] : me.dir.substring(me.dir.lastIndexOf("/") + 1));
            }));
        me.mastercode = sessionStorage.getItem("administrator");
        if (me.mastercode) {
            inits.push( 
                $.ajax({ type: 'GET', cache: false, url: '/config.cgi?MASTERCODE=' + me.mastercode })
                .done(function (result) {
                    if (result == "SUCCESS") {
                        // I am administrator
                        $("#setBtn").show();
                        me.isAdministrator = true;
                    }
                }));
        }
        $.when.apply($,inits).then(function () { me.start(); });
    };
    fa.prototype.setWindowTitle = function (text) {
        var me = this;
        $("#pageTitle").text(text);
        // setup moveup link
        if ( me.dir && me.dir != "/" ) {
            var upLink = me.dir.substring(0, me.dir.lastIndexOf("/")) || "/";
            $("#moveUpLink").attr("href", upLink).show();
        } else {
            $("#moveUpLink").hide();
        }

    };
    fa.prototype.browserLanguage = function () {
        var me = this;
        try {
            var lang;
            lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);

            if (lang == 'en' || true) {
                return $.get(me.baseUrl + "/command.cgi?op=107") // language
                    .done(function (result) {
                        var lang;
                        if (result.substr(17, 2) == 'zh') {
                            lang = result.substr(17, 5);
                            lang = lang.toLowerCase();

                            if ((lang == 'zh-cn') || (lang == 'zh-tw')) {
                                return lang;
                            }
                            else {
                                lang = result.substr(17, 10);
                                lang = lang.toLowerCase();

                                if (lang == 'zh-hans-cn') {
                                    lang = 'zh-cn';
                                }
                                else if (lang == 'zh-hant-tw') {
                                    lang = 'zh-tw';
                                }
                                else {
                                    lang = 'zh';
                                }

                                return lang;
                            }
                        } else {
                            lang = result.substr(17, 2);
                        }
                        me.lang = lang;
                    });
            } else if (lang == 'zh') {
                me.lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage);
            } else me.lang = lang;
        }
        catch (e) {
            me.lang = 'en';
        }
        var d = new $.Deferred();
        d.resolve();
        return d;
    };
    fa.prototype.start = function () {
        var me = this;
        if (me.photoShareMode != "SHAREMODE")  me.poll();
    };
    fa.prototype.stop = function () {
        var me = this;
        if (me.timer) {
            clearTimeout(me.timer); me.timer = null;
        }
    };
    fa.prototype.poll = function (callback) {
        var me = this;
        var indicator = $("#connectionIndicator");
        indicator.removeClass("connected").addClass("connecting");
        $.ajax({
            url: me.baseUrl + "/command.cgi?op=121&TIME=" + geTimestamp(), // get timestamp
            type: "GET",
            timeout: Math.min( me.interval/3, 5000 )
        }).done(function (result) {
            indicator.removeClass("connecting").addClass("connected");
            var timestamp = parseInt(result);
            if (me.timestamp && timestamp > me.timestamp) {
                me.actionRefresh();
            }
            me.timestamp = timestamp;
            if (callback) { callback(); }
        }).fail(function () {
            indicator.removeClass("connected connecting");
        }).always(function () {
            me.timer = setTimeout(function () { me.poll(); }, me.interval);
        });
    };
    var reColumns = /^(.+),(\d+),(\d+),(\d+),(\d+)/;
    fa.prototype.actionRefresh = function (isNavigation) {
        var me = this;
        $.get(me.baseUrl + "/command.cgi?op=100&DIR=" + me.dir + "&TIME=" + geTimestamp())
        .done(function (result) {
            // parse HTML content for the "LIST"
            var dir = me.dir == "/" ? "" : me.dir;
            var lines = result.split(/\r?\n/);
            var list = [];
            for (var i = 1; i < lines.length; i++) {
                var m = reColumns.exec(lines[i]);
                if( m){
                    list.push({ r_uri: dir, fname: m[1].substring(dir.length+1), fsize: Number(m[2]), attr: Number(m[3]), fdate: Number(m[4]), ftime: Number(m[5]) });
                }
            }
            me.refreshList(list, isNavigation );
        });
    };
    fa.prototype.navigate = function (dir) {
        var me = this;
        me.dir = dir;
        me.clearList();
        me.actionRefresh(true);
        me.setWindowTitle(dir);
    };
    fa.prototype.clearList = function () {
        
    };
    fa.prototype.refreshList = function (list, suppressNotification) {
        var deleted = 0, inserted = 0;
        var me = this, wlansd_map = me.wlansd_map;
        var wlanItemsToAdd = [];
        for (var i = 0; i < wlansd.length; i++) { wlansd[i]._checked = false;}
        list.forEach(function (i) {
            var key = i.r_uri + "/" + i.fname;
            if (key in wlansd_map) {
                // exixting
                wlansd_map[key]._checked = true;
            } else {
                // newly added
                wlansd.push(i);
                wlanItemsToAdd.push(i);
                inserted++;
            }
        });
        wlansd.forEach(function (i) {
            if (i._checked === false) {
                // deleted...
                me.grid.isotope('remove', i.dom);
                var dom = i.dom;
                delete i.dom;
                delete wlansd_map[i.r_uri + "/" + i.fname];
                if (dom) {
                    $(dom).removeData("fa-item").remove();
                    
                }
                deleted++;
            }
        });
        for (i = wlansd.length - 1; i >= 0; i--) {
            if (wlansd[i]._checked === false) {
                wlansd.splice(i, 1); i--;
            }
        }
        if (wlanItemsToAdd.length > 0) {
            me.addItem(wlanItemsToAdd, "insert");
        }
        if (( inserted || deleted )) {
            me.grid.isotope("layout");
            if (suppressNotification !== true) me.notifyUpdate();
        }
    };
    fa.prototype.notifyUpdate = function () {
        var nav = $("body nav.navbar");
        var count = 6;
        var timer = setInterval(function () {
            if (count % 2 == 0) {
                nav.removeClass("navbar-default").addClass("navbar-inverse");
            } else {
                nav.removeClass("navbar-inverse").addClass("navbar-default");
            }
            if (--count <= 0) { clearInterval(timer);}
        }, 200);
    };
    fa.prototype.addItem = function (items, method) {
        var me = this;
        var wlansd_map = me.wlansd_map;
        var grid = me.grid;

        items = $.isArray(items) ? items : [items];

        var iso_items_to_add = [];
        for (var _i = 0 ; _i < items.length; _i++) {
            var item = items[_i];
            wlansd_map[item.r_uri + "/" + item.fname] = item;
            var div = $(me.template);
            div.data("fa-item", item);
            grid.append(div);

            item.dom = div;

            var a = div.find("a")
                .attr("data-title", item.fname)
                .attr("href", item.r_uri + "/" + item.fname)
                .attr("title", FlashAir.parseDateTime(item.fdate, item.ftime));
            if (item.attr & 16) a.addClass("dir-nav");
            var container = div.find('.image-container');
            div.find("div.name-label").text(item.fname + (item.fsize ? " (" + filesize(item.fsize) + ")" : ""));
            container.addClass(fa.getIconClass(item));
            iso_items_to_add.push(div.get(0));
            if ( container.hasClass("icon-photo") ) {
                div.hide();
                var img = div.find("img");
                img.on('load', function () {
                    var img = $(this);
                    var div = img.closest(".grid-item");
                    var container = div.find('.image-container');
                    if (is_chrome_app) {
                        container.css("background-image", img.css("background-image")).css("background-size", "cover");
                    } else container.css("background-image", "url('" + img.attr('src') + "')").css("background-size", "cover");
                    var a = div.find('a');
                }).on('error', function () {

                });
                var imgSrc = me.baseUrl + "/thumbnail.cgi?" + (item.r_uri) + "/" + (item.fname);
                img.data("src", imgSrc);
            }
        }
        if (is_chrome_app) {
            RAL.Queue.setMaxConnections(4);
            RAL.Queue.start();
        }
        var initialLayout = function (laidOutitems) {
            var step = is_chrome_app ? -1 : 1;
            for (var i = is_chrome_app ? laidOutitems.length - 1 : 0; ( is_chrome_app ? i >= 0 : i < laidOutitems.length); i += step) {
                var img = $(laidOutitems[i].element).find("img");
                if (!img.attr("src") && img.data("src")) {
                    if (!is_chrome_app) {
                        img.attr("src", img.data("src"));
                    } else {
                        var remoteImage = new RAL.RemoteImage({ element: img.get(0), src: img.data("src") });
                        RAL.Queue.add(remoteImage);
                    }
                    img.removeData("src");
                }
            }
            grid.isotope('off', 'layoutComplete', initialLayout);
            if ( is_chrome_app && laidOutitems.length > 0 ) {
                RAL.Queue.start();
            }
        };
        if (iso_items_to_add.length > 0) {
            grid.isotope('on', 'layoutComplete', initialLayout);
            grid.isotope( ( method || "appended"), iso_items_to_add);
        }

    };

    // static methods
    fa.parseDateTime = function (fdate, ftime) {
        return new Date(1980 + ((fdate >> 9) & 0x7F), ((fdate >> 5) & 0xF) - 1, fdate & 0x1F, (ftime >> 11) & 0x1F, (ftime >> 5) & 0x3F, (ftime << 1) & 0x3F);
    };
    fa.getIconClass = function (item) {
        var fname = item.fname;
        if ((item.attr & 16) && fname == "DCIM") icon = "icon-dcim";
        else if (item.attr & 16) icon = "icon-folder";
        else {
            var ext_lc = fname.substring(fname.lastIndexOf(".") + 1).toLowerCase();
            var icon;
            if ((ext_lc == "mov") || (ext_lc == "avi") || (ext_lc == "mpg") || (ext_lc == "mpeg") || (ext_lc == "mp4") || (ext_lc == "wmv") || (ext_lc == "rm")) {
                icon = "icon-movie";
            }
            else if ((ext_lc == "mp3") || (ext_lc == "wma") || (ext_lc == "aac") || (ext_lc == "wav") || (ext_lc == "aiff")) {
                icon = "icon-song";
            }
            else if ((ext_lc == "gif") || (ext_lc == "bmp") || (ext_lc == "png") || (ext_lc == "jpg") || (ext_lc == "jpeg") ) {
                icon = "icon-photo";
            }
            else if (ext_lc == "dng") {
                icon = "icon-dng";
            }
            else if (ext_lc == "txt") {
                icon = "icon-text";
            }
            else {
                icon = "icon-other";
            }
        }
        return icon;
    };
    

    return fa;
})();


var is_chrome_app = document.location.protocol == "chrome-extension:";

$(document).ready(function () {
    var fa = new FlashAir({
        host: is_chrome_app ? "http://flashair" : "",
        dir: is_chrome_app ? "/" : document.location.pathname
    });
    var grid = $('#grid');

    if( is_chrome_app){
        $(document).on('click', 'a.dir-nav[href]', function (e) {
            var a = $(this);
            var href = a.attr('href');
            fa.navigate(href);
            e.preventDefault();
            return false;
        });
    }

    var iso = grid.isotope({
        // options
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        mansory: {
            columnWidth: 50
        },
        getSortData: {
            name: function(itemElem){
                var el = $(itemElem);
                var i = el.data('fa-item');
                return i.fname;
            },
            datetime: function(itemElem){
                var el = $(itemElem);
                var i = el.data('fa-item');
                return ( i.fdate << 15 ) | i.ftime;
            }
        },
        sortBy: 'datetime',
        sortAscending: false
    });

    if ( typeof wlansd != 'undefined' ) {
        fa.addItem(wlansd, "insert");
        grid.isotope('layout');
    } else { // Chrome App version?
        wlansd = [];
        fa.actionRefresh();
    }

    // menu handling
    $("#menuSort").on("click","button", function(){
        var btn = $(this);
        var menu = btn.parent();
        var sortAscending = btn.hasClass("active") ? !menu.data("sortascending") : true;
        grid.isotope({ sortBy: btn.data("sort"), sortAscending: sortAscending });
        menu.data("sortascending", sortAscending);
        $("button",menu).removeClass('active');
        btn.addClass("active");
    });

    //
    // PhotoSwipe
    //
    var gallery;
    $.get( ( is_chrome_app ? "" : "/SD_WLAN/" ) + "js/pswp.htm", function (result) {
        $(result).appendTo($("body"));
    });
    grid.on("click", "div.grid-item a .icon-photo", function (e) {
        e.preventDefault();
        var clickedA = $(this).closest("a");
        // open photoswipe
        var items = grid.data('isotope').filteredItems;
        var psItems = []; var startIndex = 0;
        for (var i = 0; i < items.length; i++ )
        {
            var item = items[i];
            var div = $(item.element);
            if (div.find(".image-container.icon-photo").length > 0) {
                var data = div.data("fa-item");
                var img = div.find("img");
                var a = div.find("a");
                var psitem = {
                    src: a.attr('href'), msrc: fa.baseUrl + "/thumbnail.cgi?" + data.r_uri + "/" + data.fname, w: img.get(0).naturalWidth * 10, h: img.get(0).naturalHeight * 10
                };
                if (!psitem.w || !psitem.h) { psitem.h = 900; psitem.w = 900; }
                psItems.push(psitem);
                if (psitem.src == clickedA.attr('href')) {
                    startIndex = psItems.length - 1;
                }
            }
        }
        gallery = new PhotoSwipe(document.getElementById("pswp"), PhotoSwipeUI_Default, psItems, {
            history: false, shareEl: false,
            index: startIndex
            
        });
        gallery.init();
        return false;
    });
});


/*
 2015 Jason Mulligan
 @version 3.1.2

    Copyright (c) 2015, Jason Mulligan
    All rights reserved.
    http://filesizejs.com/
 */
"use strict"; !function (a) { var b = /b$/, c = { bits: ["B", "kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"], bytes: ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] }, d = function (a) { var d = void 0 === arguments[1] ? {} : arguments[1], e = [], f = !1, g = 0, h = void 0, i = void 0, j = void 0, k = void 0, l = void 0, m = void 0, n = void 0, o = void 0, p = void 0, q = void 0, r = void 0; if (isNaN(a)) throw new Error("Invalid arguments"); return j = d.bits === !0, p = d.unix === !0, i = void 0 !== d.base ? d.base : 2, o = void 0 !== d.round ? d.round : p ? 1 : 2, q = void 0 !== d.spacer ? d.spacer : p ? "" : " ", r = void 0 !== d.suffixes ? d.suffixes : {}, n = void 0 !== d.output ? d.output : "string", h = void 0 !== d.exponent ? d.exponent : -1, m = Number(a), l = 0 > m, k = i > 2 ? 1e3 : 1024, l && (m = -m), 0 === m ? (e[0] = 0, e[1] = p ? "" : "B") : ((-1 === h || isNaN(h)) && (h = Math.floor(Math.log(m) / Math.log(k))), h > 8 && (g = 1e3 * g * (h - 8), h = 8), g = 2 === i ? m / Math.pow(2, 10 * h) : m / Math.pow(1e3, h), j && (g = 8 * g, g > k && (g /= k, h++)), e[0] = Number(g.toFixed(h > 0 ? o : 0)), e[1] = c[j ? "bits" : "bytes"][h], !f && p && (j && b.test(e[1]) && (e[1] = e[1].toLowerCase()), e[1] = e[1].charAt(0), "B" === e[1] ? (e[0] = Math.floor(e[0]), e[1] = "") : j || "k" !== e[1] || (e[1] = "K"))), l && (e[0] = -e[0]), e[1] = r[e[1]] || e[1], "array" === n ? e : "exponent" === n ? h : "object" === n ? { value: e[0], suffix: e[1] } : e.join(q) }; "undefined" != typeof exports ? module.exports = d : "function" == typeof define ? define(function () { return d }) : a.filesize = d }("undefined" != typeof global ? global : window);
//# sourceMappingURL=filesize.min.js.map