/*
    Yokin's FlashAir class library
    (TypeScript version)
    (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
    MIT License
 */
var FlashAir;
(function (FlashAir) {
    (function (FileAttribute) {
        FileAttribute[FileAttribute["ReadOnly"] = 1] = "ReadOnly";
        FileAttribute[FileAttribute["Hidden"] = 2] = "Hidden";
        FileAttribute[FileAttribute["System"] = 4] = "System";
        FileAttribute[FileAttribute["Volume"] = 8] = "Volume";
        FileAttribute[FileAttribute["Directory"] = 16] = "Directory";
        FileAttribute[FileAttribute["Archive"] = 32] = "Archive";
    })(FlashAir.FileAttribute || (FlashAir.FileAttribute = {}));
    var FileAttribute = FlashAir.FileAttribute;
    /**
     * Class expression of FileInfoRaw. Extra useful methods are available.
     */
    var FileInfo = (function () {
        function FileInfo() {
        }
        FileInfo.prototype.Directory = function () {
            return this.r_uri;
        };
        FileInfo.prototype.Name = function () {
            return this.fname;
        };
        FileInfo.prototype.Size = function () {
            return this.fsize;
        };
        FileInfo.prototype.Time = function () {
            return FileInfo.FTIMEtoDateTime(this.fdate, this.ftime);
        };
        FileInfo.prototype.Attributes = function () {
            return this.attr;
        };
        FileInfo.prototype.IsDirectory = function () {
            return !!(this.attr & 16 /* Directory */);
        };
        /**
         * convert FDATE, FTIME internal datetime value to javascript Date object.
         * FlashAir 内部形式の FDATE FTIME を Date オブジェクトに変換します。
         */
        FileInfo.FTIMEtoDateTime = function (_date, _time) {
            return new Date(1980 + ((_date >> 9) & 0x7F), ((_date >> 5) & 0xF) - 1, _date & 0x1F, (_time >> 11) & 0x1F, (_time >> 5) & 0x3F, (_time << 1) & 0x3F);
        };
        /**
         * convert javascript Date object to internal FDATE format.
         * Javascript の Date を FDATE 数値形式に変換します。
         */
        FileInfo.DateTimeToFDATE = function (date) {
            return (((date.getUTCFullYear() - 1980) << 9) + ((date.getMonth() - 1) << 5) + date.getDay());
        };
        /**
         * convert javascript Date object to internal FTIME format.
         * Javascript の Date を FTIME 数値形式に変換します。
         */
        FileInfo.DateTimeToFTIME = function (date) {
            return (date.getHours() << 11) + (date.getMinutes() << 5) + (date.getSeconds() >> 1);
        };
        return FileInfo;
    })();
    FlashAir.FileInfo = FileInfo;
    (function (WebDAVStatus) {
        WebDAVStatus[WebDAVStatus["Disabled"] = 0] = "Disabled";
        WebDAVStatus[WebDAVStatus["ReadOnly"] = 1] = "ReadOnly";
        WebDAVStatus[WebDAVStatus["ReadWrite"] = 2] = "ReadWrite";
    })(FlashAir.WebDAVStatus || (FlashAir.WebDAVStatus = {}));
    var WebDAVStatus = FlashAir.WebDAVStatus;
    (function (ExifOientation) {
        ExifOientation[ExifOientation["Horizontal"] = 1] = "Horizontal";
        ExifOientation[ExifOientation["MirrorHorizontal"] = 2] = "MirrorHorizontal";
        ExifOientation[ExifOientation["Rotate180"] = 3] = "Rotate180";
        ExifOientation[ExifOientation["MirrorVertical"] = 4] = "MirrorVertical";
        ExifOientation[ExifOientation["MirrorHhorizontalAndRotate270CW"] = 5] = "MirrorHhorizontalAndRotate270CW";
        ExifOientation[ExifOientation["Rotate90CW"] = 6] = "Rotate90CW";
        ExifOientation[ExifOientation["MirrorHorizontalAndRotate90CW"] = 7] = "MirrorHorizontalAndRotate90CW";
        ExifOientation[ExifOientation["Rotate270CW"] = 8] = "Rotate270CW"; // => 'Rotate 270 CW',
    })(FlashAir.ExifOientation || (FlashAir.ExifOientation = {}));
    var ExifOientation = FlashAir.ExifOientation;
    (function (WiFiOperationMode) {
        /**
         *  「無線起動画面」のライトプロテクト解除操作で無線LAN機能を起動します。無線LANモードはAPモードです。
         */
        WiFiOperationMode[WiFiOperationMode["AccessPointDeferred"] = 0] = "AccessPointDeferred";
        /**
         *  「無線起動画面」のライトプロテクト解除操作で無線LAN機能を起動します。無線LANモードはSTAモードです。
         */
        WiFiOperationMode[WiFiOperationMode["StationDeferred"] = 2] = "StationDeferred";
        /**
         *  「無線起動画面」のライトプロテクト解除操作で無線LAN機能を起動します。無線LANモードはインターネット同時接続モードです。 (ファームウェア 2.00.02以上)
         */
        WiFiOperationMode[WiFiOperationMode["BridgeDeferred"] = 3] = "BridgeDeferred";
        /**
         * 	カード電源投入時に無線LAN機能を起動します。無線LANモードはAPモードです。
         */
        WiFiOperationMode[WiFiOperationMode["AccessPoint"] = 4] = "AccessPoint";
        /**
         *  カード電源投入時に無線LAN機能を起動します。無線LANモードはSTAモードです。
         */
        WiFiOperationMode[WiFiOperationMode["Station"] = 5] = "Station";
        /**
         *  カード電源投入時に無線LAN機能を起動します。無線LANモードはインターネット同時接続モードです。 (ファームウェア 2.00.02以上)
         */
        WiFiOperationMode[WiFiOperationMode["Bridge"] = 6] = "Bridge";
    })(FlashAir.WiFiOperationMode || (FlashAir.WiFiOperationMode = {}));
    var WiFiOperationMode = FlashAir.WiFiOperationMode;
    /**
     * internal use only.
     * to make class object event emittable.
     */
    var eventEmitter = (function () {
        function eventEmitter() {
        }
        eventEmitter.prototype.on = function (event, fn) {
            this._callbacks = this._callbacks || {};
            (this._callbacks[event] = this._callbacks[event] || []).push(fn);
            return this;
        };
        eventEmitter.prototype.addEventListener = function (event, fn) {
        };
        eventEmitter.prototype.once = function (event, fn) {
            function on() {
                this.off(event, on);
                fn.apply(this, arguments);
            }
            this.on(event, on);
            return this;
        };
        eventEmitter.prototype.off = function (event, fn) {
            this._callbacks = this._callbacks || {};
            // all
            if (0 == arguments.length) {
                this._callbacks = {};
                return this;
            }
            // specific event
            var callbacks = this._callbacks[event];
            if (!callbacks)
                return this;
            // remove all handlers
            if (1 == arguments.length) {
                delete this._callbacks[event];
                return this;
            }
            // remove specific handler
            var cb;
            for (var i = 0; i < callbacks.length; i++) {
                cb = callbacks[i];
                if (cb === fn || cb.fn === fn) {
                    callbacks.splice(i, 1);
                    break;
                }
            }
            return this;
        };
        eventEmitter.prototype.removeListener = function (event, fn) {
        };
        eventEmitter.prototype.removeAllListeners = function (event, fn) {
        };
        eventEmitter.prototype.removeEventListener = function (event, fn) {
        };
        eventEmitter.prototype.trigger = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._callbacks = this._callbacks || {};
            var callbacks = this._callbacks[event];
            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i].apply(this, args);
                }
            }
            return this;
        };
        return eventEmitter;
    })();
    FlashAir.eventEmitter = eventEmitter;
    eventEmitter.prototype.addEventListener = eventEmitter.prototype.on;
    eventEmitter.prototype.removeListener = eventEmitter.prototype.removeAllListeners = eventEmitter.prototype.removeEventListener = eventEmitter.prototype.off;
})(FlashAir || (FlashAir = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/*
    Yokin's FlashAir client class library
    (TypeScript version)
    (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
    MIT License
 */
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/chrome/chrome.d.ts" />
/// <reference path="../ts/flashAirTypes.ts" />
/**
 * FlashAir module contains all classes which are needed for FlashAir client access.
 * @preferred
 */
var FlashAir;
(function (FlashAir) {
    /**
     * HTTP client for FlashAir.
     * **Command**, **Config**, **Thumbnail** properties are corresponding to each CGI API on FlashAir.
     * On the creation of this object, some APIs are automatically called to obtain the host version and status.
     * It starts polling automatically soon after the initialization.
     * Polling interval can be specified in constructor's option parameter.
     * Host ( FlashAir network address ) can be provided in the constructor or you can change the host address any time later by calling setHostAddress.
     */
    var FlashAirClient = (function (_super) {
        __extends(FlashAirClient, _super);
        function FlashAirClient(urlBase, options) {
            _super.call(this);
            /// milisecond
            this.pollingInterval = 2000;
            this._pausePolling = false;
            var me = this;
            me.Command = new Command(this);
            me.Thumbnail = new Thumbnail(this);
            me.Command = new Command(this);
            me.mastercode = sessionStorage.getItem("administrator");
            // options
            me.pollingInterval = !options.polling ? me.pollingInterval : options.polling === true ? me.pollingInterval : options.polling === false ? 0 : options.polling;
            this.setHostAddress(urlBase || "", false);
        }
        /**
         * @param newUrl new host URL of FlashAir, which may be like "http://flashair/" or "http://192.168.0.100/"
         * @param verify If true, this method tries to verify the existence of the host address by calling command.cgi
         * @returns jQuery promise object.
         */
        FlashAirClient.prototype.setHostAddress = function (newUrl, verify) {
            if (verify === void 0) { verify = true; }
            var me = this;
            me.stopPolling();
            if (verify) {
                return $.ajax({
                    url: newUrl + "/command.cgi?op=108&TIME=" + Date.now(),
                    timeout: 3000
                }).done(set).fail(function () {
                    me.onHostFailure();
                }).always(function () {
                });
            }
            else {
                set();
                var d = $.Deferred();
                d.resolve();
                return d;
            }
            function set() {
                if (!/\/$/.test(this.baseUrl))
                    newUrl = newUrl + "/";
                me.baseUrl = newUrl;
                me.trigger("fa.hostchanged");
                me.initWithHost();
            }
        };
        FlashAirClient.prototype.initWithHost = function () {
            var me = this;
            var inits = [];
            inits.push(this.browserLanguage());
            inits.push(this.Command.IsPhotoShareEnabled().done(function (result) {
                me.photoShareMode = result;
                me.trigger("fa.photosharemode");
            }));
            if (me.mastercode) {
                inits.push($.ajax({ type: 'GET', cache: false, url: '/config.cgi?MASTERCODE=' + me.mastercode }).done(function (result) {
                    if (result == "SUCCESS") {
                        // I am administrator
                        $("#setBtn").show();
                        me.isAdministrator = true;
                    }
                }));
            }
            $.when.apply($, inits).then(function () {
                me.onHostReady();
            }, function () {
                me.onHostFailure();
            });
        };
        /**
         * Not implemented.
         * @param path
         * @returns
         */
        FlashAirClient.prototype.GetFile = function (path) {
            throw "not implemented";
        };
        FlashAirClient.prototype.GetFileUrl = function (path) {
            var p;
            if (typeof path == "string")
                p = path;
            else
                p = (path.r_uri || path.Directory) + "\\" + (path.fname || path.Name);
            return this.baseUrl + p.replace("\\", "/");
        };
        FlashAirClient.prototype.onHostReady = function () {
            this.trigger("fa.hostready");
            this.startPolling();
        };
        FlashAirClient.prototype.onHostFailure = function () {
            this.trigger("fa.hostfailure");
        };
        FlashAirClient.prototype.startPolling = function () {
            if (!this.photoShareMode && this.pollingInterval > 0 && !this.timer)
                this.poll();
        };
        FlashAirClient.prototype.pausePolling = function () {
            this._pausePolling = true;
        };
        FlashAirClient.prototype.resumePolling = function () {
            this._pausePolling = false;
        };
        FlashAirClient.prototype.stopPolling = function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        };
        FlashAirClient.prototype.poll = function () {
            var me = this;
            if (me._pausePolling) {
                me.timer = setTimeout($.proxy(me.poll, me), me.pollingInterval);
                return;
            }
            var eventName = "fa.polling";
            me.trigger(eventName, "connecting");
            this.Command.LastUpdatedTimestamp(this.pollingInterval / 3).done(function (timestamp) {
                me.trigger(eventName, "connected");
                if (me.timestamp && timestamp > me.timestamp) {
                    me.trigger("fa.updated");
                }
                me.timestamp = timestamp;
            }).fail(function () {
                me.trigger(eventName, "disconnected");
            }).always(function () {
                if (me.pollingInterval > 0) {
                    me.timer = setTimeout($.proxy(me.poll, me), me.pollingInterval);
                }
                else
                    me.timer = null;
            });
        };
        //
        FlashAirClient.prototype.browserLanguage = function () {
            var me = this;
            try {
                var lang;
                lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
                if (lang == 'en') {
                    return me.Command.AcceptLanguage().done(function (result) {
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
                        }
                        else {
                            lang = result.substr(17, 2);
                        }
                        me.lang = lang;
                    });
                }
                else if (lang == 'zh') {
                    me.lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage);
                }
                else
                    me.lang = lang;
            }
            catch (e) {
                me.lang = 'en';
            }
            var d = $.Deferred();
            d.resolve();
            return d;
        };
        return FlashAirClient;
    })(FlashAir.eventEmitter);
    FlashAir.FlashAirClient = FlashAirClient;
    /**
     * base class of CGI.
     * This class contains utility methods for CGI call, HTTP GET/POST etc.
     */
    var CgiHost = (function () {
        /**
         * internal use only
         */
        function CgiHost(fa) {
            this.Client = fa;
        }
        CgiHost.prototype.GetBaseUrl = function () {
            return this.Client.baseUrl;
        };
        CgiHost.prototype.getTimestamp = function () {
            return Date.now();
        };
        /**
         * helper function to call host CGI with GET method
         * @param qs query string with name:value
         * @param ajaxOption
         */
        CgiHost.prototype.GetMethod = function (qs, ajaxOption) {
            if (qs)
                qs["TIME"] = this.getTimestamp();
            var a = {
                type: "GET",
                url: this.GetBaseUrl() + this.CgiPath,
                data: qs
            };
            if (ajaxOption)
                $.extend(a, ajaxOption);
            return $.ajax(a);
        };
        CgiHost.prototype.ajax = function (o) {
            return $.ajax(o);
        };
        return CgiHost;
    })();
    /**
     * represents /command.cgi API.
     * Every API method is asynchronous with JQueryPromise object. You can get the result in number, string and predefined enum or object
     * by calling .done/fail/always... promise methods.
     * ####example of listing files
     * ```
     * client.Command.FileList( "/DCIM" )
     *   .done(function (list) {
     *       // list is an array of FlashAir.FileInfoRaw
     *
     *   });
     * ```
     */
    var Command = (function (_super) {
        __extends(Command, _super);
        /**
         * internal use only
         */
        function Command(fa) {
            _super.call(this, fa);
            this.CgiPath = "command.cgi";
        }
        /**
         * utility method of HTTP GET with explicit `op` number.
         * returned content is parsed as TResult type.
         * @param op `op` number for command.cgi call.
         * @param qs other query strings. op and qs are mixed when it calls command.cgi
         * @returns jQuery promise object.
         */
        Command.prototype.Get = function (op, qs, ajaxOptions) {
            var data = $.extend({}, qs || {}, { op: op });
            return this.GetMethod(data, ajaxOptions).pipe(function (result) {
                return result;
            });
        };
        /**
         * List files in a directory.
         * ```OP=100&DIR=/DCIM```
         * command.cgi?OP=100 operation.
         * @param dir directory path to list
         * @returns jQuery promise for `FileInfoRaw`
         */
        Command.prototype.FileList = function (dir) {
            return this.Get(100, { "DIR": dir }).pipe(function (result) {
                // parse HTML content for the "LIST"
                dir = dir == "/" ? "" : dir;
                var lines = result.split(/\r?\n/);
                if (lines[0] != "WLANSD_FILELIST")
                    throw "First line is not WLANSD_FILELIST.";
                var list = [];
                for (var i = 1; i < lines.length; i++) {
                    var m = Command.reColumns.exec(lines[i]);
                    if (m) {
                        list.push({ r_uri: dir, fname: m[1].substring(dir.length + 1), fsize: Number(m[2]), attr: Number(m[3]), fdate: Number(m[4]), ftime: Number(m[5]) });
                    }
                }
                return list;
            });
        };
        /**
         * ```op=101&DIR=/DCIM```
         */
        Command.prototype.FileCount = function (dir) {
            return this.Get(101, { "DIR": dir });
        };
        /**
         * ```op=102```
         */
        Command.prototype.IsUpdated = function () {
            return this.Get(102).pipe(function (v) {
                return v == 1;
            });
        };
        /**
         * ```op=104```
         */
        Command.prototype.NetworkSSID = function () {
            return this.Get(104);
        };
        /**
         * ```op=105```
         */
        Command.prototype.NetworkPassword = function () {
            return this.Get(105);
        };
        /**
         * ```op=106```
         * MACアドレスの取得
         */
        Command.prototype.MAC = function () {
            return this.Get(106);
        };
        /**
         * ```op=107```
         * ブラウザ言語の取得
         */
        Command.prototype.AcceptLanguage = function () {
            return this.Get(107);
        };
        /**
         * ```op=108```
         * ファームウェアバージョン情報の取得
         */
        Command.prototype.FirmwareVersion = function () {
            return this.Get(108);
        };
        /**
         * ```op=109```
         * 制御イメージの取得
         */
        Command.prototype.ControlImagePath = function () {
            return this.Get(109);
        };
        /**
         * ```op=110```
         * 無線LANモードの取得
         */
        Command.prototype.OperationMode = function () {
            return this.Get(110);
        };
        /**
         * ```op=111```
         * 無線LANタイムアウト時間の設定
         */
        Command.prototype.DeviceTimeout = function () {
            return this.Get(111);
        };
        /**
         * ```op=117```
         * アプリケーション独自情報の取得
         */
        Command.prototype.AppCustomInfo = function () {
            return this.Get(117);
        };
        /**
         * ```op=118```
         * アップロード機能の有効状態の取得
         */
        Command.prototype.UploadEnabled = function () {
            return this.Get(118).pipe(function (v) {
                v == "1";
            });
        };
        /**
         * ```op=120```
         * CIDの取得
         */
        Command.prototype.CID = function () {
            return this.Get(120);
        };
        /**
         * ```op=121```
         * アップデート情報の取得 (タイムスタンプ形式)
         * @param timeout timeout of CGI call in millisecond. In purpose of avoiding long lasting connection to CGI server to reduce unnecessary load.
         */
        Command.prototype.LastUpdatedTimestamp = function (timeout) {
            return this.Get(121, null, { timeout: timeout });
        };
        /*
        byte[] ReadExtensionRegisterSingleBlockCommand(int addr, int len)
        {
            throw new NotImplementedException();
        }
        bool WriteExtensionRegisterSingleBlockCommand(int addr, int len, byte[] data)
        {
            throw new NotImplementedException();
        }
        */
        Command.prototype.GetAvailableSectorInfo = function () {
            return this.Get(140).pipe(function (result) {
                var line = result.split(/[\/\,]/);
                return { Free: parseInt(line[0]), Total: parseInt(line[1]), SectorSize: parseInt(line[2]) };
            });
        };
        Command.prototype.TurnOnPhotoShare = function (dir, date) {
            var qs = {
                "DIR": dir,
                "DATE": FlashAir.FileInfo.DateTimeToFDATE(date)
            };
            return this.Get(200, qs).pipe(function (result) {
                return result == "OK";
            });
        };
        Command.prototype.TurnOffPhotoShare = function () {
            return this.Get(201).pipe(function (result) {
                return result == "OK";
            });
        };
        Command.prototype.IsPhotoShareEnabled = function () {
            return this.Get(202).pipe(function (result) {
                return result == "SHAREMODE";
            });
        };
        Command.prototype.PhotoShareSSID = function () {
            return this.Get(203);
        };
        Command.prototype.WebDAVStatus = function () {
            return this.Get(220).pipe(function (result) {
                return result;
            });
        };
        /// minutes
        Command.prototype.TimeZone = function () {
            return this.Get(221).pipe(function (result) {
                return result * 15;
            });
        };
        /**
         * regular expression pattern to parse WLANSD_FILELIST which is returned from OP=100 CGI call.
         */
        Command.reColumns = /^(.+),(\d+),(\d+),(\d+),(\d+)/;
        return Command;
    })(CgiHost);
    var Thumbnail = (function (_super) {
        __extends(Thumbnail, _super);
        function Thumbnail(fa) {
            _super.call(this, fa);
            this.CgiPath = "thumbnail.cgi";
        }
        /**
         * get a URL address for the thumbnail image.
         * @param file FlashAir.FileInfoRaw object which is returned from op=100 call.
         */
        Thumbnail.prototype.GetUrl = function (file) {
            if (typeof file == "string ")
                return this.GetBaseUrl() + this.CgiPath + "?" + file;
            return this.GetBaseUrl() + this.CgiPath + "?" + file.r_uri + "/" + file.fname;
        };
        return Thumbnail;
    })(CgiHost);
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config(fa) {
            _super.call(this, fa);
            this.CgiPath = "config.cgi";
            this.CONFIG = {};
        }
        Config.prototype.Get = function (qs) {
            return this.GetMethod(qs);
        };
        /// <summary>
        /// Configオブジェクトに対して設定した情報を FlashAir にまとめて送信します。
        /// </summary>
        /// <param name="masterCode"></param>
        /// <returns></returns>
        Config.prototype.Submit = function (masterCode) {
            this.CONFIG["MASTERCODE"] = masterCode;
            return this.Get(this.CONFIG).pipe(function (result) {
                return result == "SUCCESS";
            });
        };
        /// <summary>
        /// ローカルで設定したCONFIG情報をすべてクリアします。
        /// </summary>
        Config.prototype.Clear = function () {
            this.CONFIG = {};
        };
        /// <summary>
        /// 無線LAN機能の自動タイムアウト時間を設定します。単位はミリ秒です。 設定可能な値は、60000から4294967294で、デフォルト値は300000(5分)です。
        /// 0を指定すると自動停止しない設定になります。ただし、ホスト機器のスリープでカードへの電源供給が遮断された場合などに、停止することがあります。
        /// </summary>
        /*
        getDeviceTimeout() : TimeSpan {
            return new TimeSpan( GetCONFIG<number>("APPAUTOTIME") );
        }*/
        Config.prototype.setDeviceTimeout = function (value) {
            var ms = value;
            if (ms < 60000 || ms > 4294967294)
                throw "value must be between 60000 and 4294967294.";
            this.CONFIG.APPAUTOTIME = ms;
        };
        return Config;
    })(CgiHost);
    var Upload = (function (_super) {
        __extends(Upload, _super);
        function Upload(fa) {
            _super.call(this, fa);
        }
        return Upload;
    })(CgiHost);
})(FlashAir || (FlashAir = {}));
/*
    Yokin's FlashAir Sync
    FlashAir Synchronizing helper class library
    (TypeScript version)
    (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
    MIT License
 */
// <reference path="../../typings/chrome/chrome.d.ts" />
/// <reference path="../../typings/chrome/chrome-app.d.ts" />
/// <reference path="../../typings/ral.d.ts" />
/// <reference path="FlashAirTypes.ts" />
/// <reference path="FlashAirClient.ts" />
var FlashAir;
(function (FlashAir) {
    (function (SyncScheme) {
        SyncScheme[SyncScheme["SyncAll"] = 1] = "SyncAll";
        SyncScheme[SyncScheme["SyncNewOnes"] = 2] = "SyncNewOnes";
    })(FlashAir.SyncScheme || (FlashAir.SyncScheme = {}));
    var SyncScheme = FlashAir.SyncScheme;
    (function (SyncMode) {
        SyncMode[SyncMode["None"] = 0] = "None";
        SyncMode[SyncMode["Monitoring"] = 1] = "Monitoring";
    })(FlashAir.SyncMode || (FlashAir.SyncMode = {}));
    var SyncMode = FlashAir.SyncMode;
    (function (QueueStatus) {
        QueueStatus[QueueStatus["Empty"] = 1] = "Empty";
        QueueStatus[QueueStatus["Queued"] = 2] = "Queued";
    })(FlashAir.QueueStatus || (FlashAir.QueueStatus = {}));
    var QueueStatus = FlashAir.QueueStatus;
    (function (SyncStatus) {
        SyncStatus[SyncStatus["None"] = 0] = "None";
        SyncStatus[SyncStatus["Queued"] = 1] = "Queued";
        SyncStatus[SyncStatus["Syncing"] = 2] = "Syncing";
        SyncStatus[SyncStatus["Synced"] = 3] = "Synced";
        SyncStatus[SyncStatus["Error"] = 4] = "Error";
    })(FlashAir.SyncStatus || (FlashAir.SyncStatus = {}));
    var SyncStatus = FlashAir.SyncStatus;
    var DirectoryStatus;
    (function (DirectoryStatus) {
        DirectoryStatus[DirectoryStatus["Done"] = 0] = "Done";
        DirectoryStatus[DirectoryStatus["Pending"] = 1] = "Pending";
        DirectoryStatus[DirectoryStatus["Running"] = 2] = "Running";
    })(DirectoryStatus || (DirectoryStatus = {}));
    /*class Directory {
        Path: string;
        Name : string;
        
    }*/
    var FlashAirSynchronizer = (function (_super) {
        __extends(FlashAirSynchronizer, _super);
        function FlashAirSynchronizer(fa) {
            _super.call(this);
            this.localHomeDirectoryEntry = null;
            this.lastSyncChecked = new Date();
            this.syncScheme = 1 /* SyncAll */;
            this.syncMode = 0 /* None */;
            this.queueStatus = 1 /* Empty */;
            this.fa = fa;
            this._queue = new SyncQueue();
            //this.dirList = new Array<Directory>();
        }
        FlashAirSynchronizer.prototype.addMonitorDirectory = function (dir) {
        };
        FlashAirSynchronizer.prototype.removeMonitorDirectory = function (dir) {
        };
        /*
        getMonitorDirectories() : Array<Directory>
        {
            return this.dirList;
        }*/
        FlashAirSynchronizer.prototype.fileListUpaded = function (list, listAdded, listDeleted, scheme) {
            var me = this;
            console.log("listUpdated");
            //scheme = scheme || this.syncScheme;
            // check if remote files are already downloaded or not
            function readEntries(d, results) {
                for (var i = 0; i < results.length; i++) {
                    var entry = results[i];
                    if (entry.isDirectory)
                        continue; // ignore sub directories
                    $.each(listAdded || list, function (j, item) {
                        if (item.fname.toLowerCase() == entry.name.toLowerCase()) {
                            item._syncStatus = 3 /* Synced */;
                            if (item._dom) {
                                item._dom.addClass("downloaded");
                            }
                            return false; // to break;
                        }
                    });
                }
                if (results.length > 0) {
                    this.readEntries(readEntries.bind(this, d));
                    d = null;
                }
                if (d)
                    d.resolve();
            }
            function queueToSync(list, scheme) {
                $.each(list, function (i, item) {
                    if ((!item._syncStatus || item._syncStatus == 0 /* None */) && !(item.attr & (16 /* Directory */ + 2 /* Hidden */))) {
                        if (scheme == 1 /* SyncAll */ || (scheme == 2 /* SyncNewOnes */ && me.lastSyncChecked < FlashAir.FileInfo.FTIMEtoDateTime(item.fdate, item.ftime))) {
                            console.log("to be synced...");
                            console.log(item);
                            me.queue(item, true);
                        }
                    }
                });
                me.lastSyncChecked = new Date();
            }
            this.selectLocalHomeDirectory(true, false).done(function (entry) {
                var reader = entry.createReader();
                var d = $.Deferred().done(function () {
                    console.log("file listing has finished.");
                    if (!scheme && me.syncMode != 1 /* Monitoring */) {
                        console.log("sync is not monitoring so skip queueing.");
                    }
                    else {
                        queueToSync(listAdded || list, scheme || me.syncScheme);
                    }
                });
                reader.readEntries(readEntries.bind(reader, d));
            });
            //
            // stop syncing if it's in deleted list
            //
            if (listDeleted && listDeleted.length > 0) {
                $.each(listDeleted, function (i, item) {
                    if (item._syncStatus == 2 /* Syncing */) {
                        console.log("must stop syncing " + item.fname);
                        me.unqueue(item);
                    }
                    else if (item._syncStatus == 1 /* Queued */) {
                        me.unqueue(item);
                    }
                });
            }
        };
        FlashAirSynchronizer.prototype.selectLocalHomeDirectory = function (silent, forceToSelect) {
            if (silent === void 0) { silent = false; }
            if (forceToSelect === void 0) { forceToSelect = false; }
            var me = this;
            var storage = chrome.storage.local;
            var d = $.Deferred();
            if (forceToSelect == true) {
                openHomeDirectorySelect(d);
                return d;
            }
            if (me.localHomeDirectoryEntry) {
                d.resolve(me.localHomeDirectoryEntry);
                return d;
            }
            storage.get("syncLocalHomeDir", function (items) {
                var v = items["syncLocalHomeDir"];
                if (v) {
                    chrome.fileSystem.isRestorable(v, function (can) {
                        if (can) {
                            chrome.fileSystem.restoreEntry(v, function (_entry) {
                                me.localHomeDirectoryEntry = _entry;
                                d.resolve(me.localHomeDirectoryEntry);
                            });
                        }
                        else {
                            openHomeDirectorySelect(d);
                        }
                    });
                }
                else {
                    openHomeDirectorySelect(d);
                }
            });
            function openHomeDirectorySelect(d) {
                if (silent)
                    d.reject();
                else {
                    chrome.fileSystem.chooseEntry({ type: "openDirectory" }, function (entry) {
                        if (entry) {
                            me.localHomeDirectoryEntry = entry;
                            chrome.fileSystem.isWritableEntry(entry, function (r) {
                                console.log("isWritableEntry = " + r);
                            });
                            storage.set({ "syncLocalHomeDir": chrome.fileSystem.retainEntry(entry) });
                            d.resolve(me.localHomeDirectoryEntry);
                        }
                        else {
                            console.log(chrome.runtime.lastError);
                            d.reject();
                        }
                    });
                }
            }
            return d;
        };
        FlashAirSynchronizer.prototype.startMonitoring = function () {
            if (this.syncMode == 0 /* None */) {
                this.syncMode = 1 /* Monitoring */;
                this.startNext();
            }
        };
        FlashAirSynchronizer.prototype.stopMonitoring = function () {
            this.syncMode = 0 /* None */;
        };
        FlashAirSynchronizer.prototype.start = function (mode) {
            var started = this.startNext();
            if (started) {
                this.trigger("fa.sync.queue", "started");
            }
            return started;
        };
        FlashAirSynchronizer.prototype.stop = function () {
            this.syncMode = 0 /* None */;
            this.unqueue(null); // cancell all;
        };
        FlashAirSynchronizer.prototype.startNext = function () {
            var me = this;
            if (!me.runningItem) {
                var faItem = this._queue.next();
                if (faItem) {
                    me.runningItem = faItem;
                    me.trigger("fa.sync.start", faItem);
                    faItem._syncStatus = 2 /* Syncing */;
                    me.fa.pausePolling();
                    this.downloadFile(faItem).progress(function (loaded, total) {
                        me.trigger("fa.sync.progress", faItem, loaded, total);
                    }).done(function (fileEntry) {
                        faItem._syncStatus = 3 /* Synced */;
                        me.trigger("fa.sync.done", faItem);
                    }).fail(function (e) {
                        faItem._syncStatus = 4 /* Error */;
                        me.trigger("fa.sync.done", faItem);
                    }).always(function () {
                        me.runningItem = null;
                        me.fa.resumePolling();
                        me.start();
                    });
                    return true;
                }
                else {
                    me.trigger("fa.sync.queue", "empty");
                }
            }
            return false;
        };
        FlashAirSynchronizer.prototype.queue = function (item, autoStart) {
            if (autoStart === void 0) { autoStart = false; }
            var status = item._syncStatus;
            item._syncStatus = 1 /* Queued */;
            this._queue.add(item);
            if (autoStart) {
                if (!this.start()) {
                    this.trigger('fa.sync.queued', item);
                }
            }
        };
        FlashAirSynchronizer.prototype.unqueue = function (_item, forciblyAbort) {
            if (forciblyAbort === void 0) { forciblyAbort = true; }
            var item = _item;
            var removed = false, stopped = false;
            if (item) {
                var status = item._syncStatus;
                removed = this._queue.remove(item), stopped = false;
                if (forciblyAbort && item._xhr) {
                    item._xhr.abort();
                    delete item._xhr;
                    if (this.runningItem == item) {
                        this.runningItem = null;
                    }
                    stopped = true;
                }
                item._syncStatus = 0 /* None */;
                if (removed || stopped) {
                    this.trigger("fa.sync.unqueued", item);
                    if (this._queue.list.length == 0) {
                        this.trigger("fa.sync.queue", "empty");
                    }
                }
            }
            else {
                while (this._queue.list.length > 0) {
                    this.unqueue(this._queue.list[this._queue.list.length - 1]);
                }
                if (this.runningItem)
                    this.unqueue(this.runningItem);
            }
        };
        FlashAirSynchronizer.prototype.downloadFile = function (faItem) {
            var me = this;
            var item = faItem;
            var url = this.fa.baseUrl + item.r_uri + "/" + item.fname;
            var localPath = item.fname;
            var d = $.Deferred();
            this.selectLocalHomeDirectory().then(function (entry) {
                console.log("Starting download..." + url);
                Loader.load(url, "blob", function (fileData, fileInfo) {
                    entry.getFile(localPath, { create: true }, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.onwriteend = function (e) {
                                fileWriter.onwriteend = function (e) {
                                    d.resolve(fileEntry);
                                };
                                fileWriter.truncate(fileData.size);
                            };
                            fileWriter.onerror = function (e) {
                                console.warn("Write failed: " + e.toString());
                            };
                            fileWriter.write(fileData);
                        });
                    });
                    delete item._xhr;
                }, function (e) {
                    console.log(e);
                    d.reject();
                    delete item._xhr;
                }, function (loaded, total) {
                    d.notify(loaded, total);
                }, function (xhr) {
                    item._xhr = xhr;
                }, function (e) {
                    console.log("transfer aborted.");
                    delete item._xhr;
                    d.reject();
                });
            }, function (e) {
                d.reject();
            });
            return d.promise();
        };
        return FlashAirSynchronizer;
    })(FlashAir.eventEmitter);
    FlashAir.FlashAirSynchronizer = FlashAirSynchronizer;
    var SyncQueue = (function () {
        function SyncQueue() {
            this.list = [];
        }
        SyncQueue.prototype.next = function () {
            return this.list.shift();
        };
        SyncQueue.prototype.add = function (item) {
            this.list.push(item);
        };
        SyncQueue.prototype.remove = function (item) {
            var removed = false;
            for (var i = 0; i < this.list.length; i++) {
                var _item = this.list[i];
                if (_item.r_uri == item.r_uri && _item.fname == item.fname) {
                    this.list.splice(i, 1);
                    removed = true;
                    break;
                }
            }
            return removed;
        };
        return SyncQueue;
    })();
    var Loader = (function () {
        function Loader() {
        }
        /**
        * Aborts an in-flight XHR and reschedules it.
        * @param {XMLHttpRequest} xhr The XHR to abort.
        * @param {Function} callbackSuccess The callback for successful loading.
        * @param {Function} callbackError The callback for failed loading.
        * @param {ProgressEvent} xhrProgressEvent The XHR progress event.
        */
        Loader.abort = function (xhr, source, type, callbackSuccess, callbackFail, callbackProgress, callbackStarted, callbackAborted) {
            // kill the current request
            xhr.abort();
            // run it again, which will cause us to schedule up
            Loader.load(source, type, callbackSuccess, callbackFail, callbackProgress, callbackStarted, callbackAborted);
        };
        /**
        * Aborts an in-flight XHR and reschedules it.
        * @param {XMLHttpRequest} xhr The XHR to abort.
        * @param {string} type The response type for the XHR, e.g. 'blob'
        * @param {Function} callbackSuccess The callback for successful loading.
        * @param {Function} callbackError The callback for failed loading.
        */
        Loader.load = function (source, type, callbackSuccess, callbackFail, callbackProgress, callbackStarted, callbackAborted) {
            // check we're online, or schedule the load
            if (RAL.NetworkMonitor.isOnline()) {
                // attempt to load the file
                var xhr = new XMLHttpRequest();
                xhr.onerror = Loader.callbacks.onError.bind(this, callbackFail);
                xhr.onload = Loader.callbacks.onLoad.bind(this, source, callbackSuccess, callbackFail);
                xhr.onprogress = Loader.callbacks.onProgress.bind(this, callbackProgress);
                xhr.onabort = Loader.callbacks.onAbort.bind(this, callbackAborted);
                xhr.open('GET', source, true);
                xhr.responseType = type;
                xhr.send();
                // register our interest in the connection
                // being cut. If that happens we will reschedule.
                RAL.NetworkMonitor.registerForOffline(Loader.abort.bind(this, xhr, source, type, callbackSuccess, callbackFail, callbackProgress, callbackStarted, callbackAborted));
                callbackStarted(xhr);
            }
            else {
                // We are offline so register our interest in the
                // connection being restored.
                RAL.NetworkMonitor.registerForOnline(Loader.load.bind(this, source, type, callbackSuccess, callbackFail, callbackProgress, callbackStarted, callbackAborted));
            }
        };
        Loader.callbacks = {
            /**
             * Callback for loaded files.
             * @param {string} source The remote file's URL.
             * @param {Function} callbackSuccess The callback for successful loading.
             * @param {Function} callbackError The callback for failed loading.
             * @param {ProgressEvent} xhrProgressEvent The XHR progress event.
             */
            onLoad: function (source, callbackSuccess, callbackError, xhrProgressEvent) {
                // we have the file details
                // so now we need to wrap the file up, including
                // the caching information to return back
                var xhr = xhrProgressEvent.target;
                var fileData = xhr.response;
                var fileInfo = RAL.CacheParser.parse(xhr.getAllResponseHeaders());
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        callbackSuccess(fileData, fileInfo);
                    }
                    else {
                        callbackError(xhrProgressEvent);
                    }
                }
            },
            /**
             * Generic callback for erroring loads. Simply passes the progres event
             * through to the assigned callback.
             * @param {Function} callback The callback for failed loading.
             * @param {ProgressEvent} xhrProgressEvent The XHR progress event.
             */
            onError: function (callback, xhrProgressEvent) {
                callback(xhrProgressEvent);
            },
            onAbort: function (callback, e) {
                callback(e);
            },
            onProgress: function (callback, e) {
                if (e.lengthComputable) {
                    callback(e.loaded, e.total);
                }
            }
        };
        return Loader;
    })();
})(FlashAir || (FlashAir = {}));
/*
    List.htm example for FlashAir(TM) TOSHIBA
    (c) 2015 Yokinsoft http://www.yo-ki.com
    MIT License
 */
///<reference path="../../typings/jquery/jquery.d.ts" />
///<reference path="../ts/flashAirTypes.ts" />
///<reference path="../ts/flashAirClient.ts" />
///<reference path="../ts/yokins-fa-app.ts" />
var PhotoSwipe, PhotoSwipeUI_Default;
var filesize;
var moment;
var is_chrome_app = document.location.protocol == "chrome-extension:";
var is_ms_app = document.location.protocol == "ms-appx:";
var is_app = is_chrome_app || is_ms_app;
var wlansd; // provided in List.htm otherwise undefined
var faClient;
var FlashAirApp = (function () {
    function FlashAirApp(options) {
        this.lazyLoading = true;
        this.wlansd_map = {};
        this.template = $("#itemTeamplte").html();
        this.singlePageNavigation = false;
        this.hashDir = /DIR=([^&]*)/;
        var me = this;
        me.singlePageNavigation = typeof options.singlePage == 'undefined' ? is_app : !!options.singlePage;
        me.baseUrl = options.host || "";
        if (me.baseUrl.lastIndexOf("/") == me.baseUrl.length - 1) {
            me.baseUrl = me.baseUrl.substring(0, me.baseUrl.length - 1);
        }
        faClient = me.client = new FlashAir.FlashAirClient(me.baseUrl, {
            pollingInterval: 2000
        });
        me.client.on('fa.hostchanged', function () {
            //me.refreshList([], false );
            me.onHostChanged();
        }).on("fa.hostready", function () {
            me.onHostReady();
        }).on("fa.polling", function (status) {
            me.pollingStatusChanged(status);
        }).on("fa.updated", function () {
            me.actionRefresh(false);
        });
        $("#hostUrl").text(me.baseUrl || document.location.host);
        me.dir = options.dir;
        me.grid = $("#grid");
        me.grid.isotope('on', 'layoutComplete', $.proxy(me.onLayoutComplete, me));
        if (me.lazyLoading) {
            $(window).on("scroll.fa resize.fa lookup.fa", $.proxy(me.recalcImageLoading, me));
        }
        me.initHost();
        me.initUi();
        me.oninit();
    }
    FlashAirApp.prototype.initHost = function () {
    };
    FlashAirApp.prototype.initUi = function () {
        var me = this;
        // sort menu handling
        $("#menuSort").on("click", "button", function () {
            var btn = $(this);
            var menu = btn.parent();
            var sortAscending = btn.hasClass("active") ? !menu.data("sortascending") : true;
            me.grid.isotope({ sortBy: btn.data("sort"), sortAscending: sortAscending });
            menu.data("sortascending", sortAscending);
            $("button", menu).removeClass('active');
            btn.addClass("active");
        });
        //
        if (me.singlePageNavigation) {
            $(document).on('click', 'a.dir-nav[href]', function (e) {
                var a = $(this);
                var href = a.attr('href');
                me.navigate(href);
                e.preventDefault();
                return false;
            });
            $(window).on('hashchange', function () {
                var m = me.hashDir.exec(location.hash);
                if (m) {
                    console.log('navigated to ' + m[1]);
                    me.navigate(m[1], false);
                }
                else if (!location.hash) {
                    me.navigate("/", false);
                }
            });
        }
    };
    /**
     *
     */
    FlashAirApp.prototype.onHostChanged = function () {
        console.log('onhostchanged');
        this.clearList();
        wlansd = undefined;
        this.dir = "/";
    };
    FlashAirApp.prototype.onHostReady = function () {
        console.log('onhostready');
        moment.locale(this.client.lang);
        if (typeof wlansd != 'undefined') {
            this.addItem(wlansd, "insert");
            this.grid.isotope('layout');
        }
        else {
            wlansd = [];
            var m = this.hashDir.exec(location.hash) || (is_app ? ['', '/'] : /(.*[^\/])\/?$/.exec(location.pathname));
            this.dir = m ? m[1] : location.pathname;
            this.actionRefresh(false);
        }
    };
    FlashAirApp.prototype.oninit = function () {
    };
    FlashAirApp.prototype.pushHistory = function (dir) {
        history.pushState(null, null, "#DIR=" + dir);
    };
    FlashAirApp.prototype.navigate = function (dir, pushHistory) {
        if (pushHistory === void 0) { pushHistory = true; }
        var me = this;
        me.dir = dir;
        me.clearList();
        me.actionRefresh(true);
        if (pushHistory)
            me.pushHistory(dir);
        //me.setWindowTitle(dir);
    };
    FlashAirApp.prototype.recalcImageLoading = function () {
        var me = this;
        var w = $(window);
        var wt = w.scrollTop(), wb = wt + w.height();
        var margin = Math.abs(wb - wt) / 2;
        me.startImageLoading($(me.grid.data('isotope').filteredItems.map(function (el) {
            return el.element;
        })).filter(function (i) {
            var el = $(this);
            var et = el.offset().top, eb = et + el.height();
            return !el.is(":hidden") && el.find("img").data("src") && (eb >= wt - margin && et <= wb + margin);
        }));
    };
    FlashAirApp.prototype.setWindowTitle = function (text) {
        var me = this;
        $("#remotePathText").text(text);
        // setup moveup link
        if (me.dir && me.dir != "/") {
            var upLink = me.dir.substring(0, me.dir.lastIndexOf("/")) || "/";
            $("#moveUpLink").removeAttr("disabled").attr("href", upLink).show();
        }
        else {
            $("#moveUpLink").attr("disabled", "disabled");
        }
    };
    FlashAirApp.prototype.pollingStatusChanged = function (status) {
        var indicator = $("#connectionIndicator");
        switch (status) {
            case "connecting":
                indicator.removeClass("connected").addClass("connecting");
                break;
            case "connected":
                indicator.removeClass("connecting").addClass("connected");
                break;
        }
    };
    FlashAirApp.prototype.actionRefresh = function (isNavigation) {
        var me = this, dir = me.dir;
        me.client.Command.FileList(dir).done(function (list) {
            me.setWindowTitle(dir);
            me.refreshList(list, isNavigation);
        });
    };
    FlashAirApp.prototype.onListUpdated = function (listAll, listAdded, listDeleted) {
    };
    FlashAirApp.prototype.deleteItemFromList = function (item) {
        var me = this;
        me.grid.isotope('remove', item._dom);
        var dom = item._dom;
        delete item._dom;
        delete me.wlansd_map[item.r_uri + "/" + item.fname];
        if (dom) {
            $(dom).removeData("fa-item").remove();
        }
    };
    FlashAirApp.prototype.clearList = function () {
        var me = this;
        $.each(wlansd, function (index, i) {
            me.deleteItemFromList(i);
        });
        wlansd.length = 0;
    };
    FlashAirApp.prototype.refreshList = function (list, suppressNotification) {
        var deleted = 0, inserted = 0;
        var me = this, wlansd_map = me.wlansd_map;
        var wlanItemsToAdd = [], wlanItemsToDelete = [];
        $.each(wlansd, function (index, i) {
            i._checked = false;
        });
        $.each(list, function (index, i) {
            var key = i.r_uri + "/" + i.fname;
            if (key in wlansd_map) {
                // exixting
                wlansd_map[key]._checked = true;
            }
            else {
                // newly added
                wlansd.push(i);
                wlanItemsToAdd.push(i);
                inserted++;
            }
        });
        $.each(wlansd, function (index, i) {
            if (i._checked === false) {
                // deleted...
                wlanItemsToDelete.push(i);
                me.deleteItemFromList(i);
                deleted++;
            }
        });
        for (var i = wlansd.length - 1; i >= 0; i--) {
            if (wlansd[i]._checked === false) {
                wlansd.splice(i, 1);
            }
        }
        if (wlanItemsToAdd.length > 0) {
            me.addItem(wlanItemsToAdd, "insert");
            inserted = wlanItemsToAdd.length;
        }
        if (inserted || deleted) {
            me.grid.isotope("layout");
            if (suppressNotification !== true) {
                me.notifyUpdate();
            }
            this.onListUpdated(wlansd, wlanItemsToAdd, wlanItemsToDelete);
        }
    };
    FlashAirApp.prototype.notifyUpdate = function () {
        var nav = $("body nav.navbar");
        var count = 6;
        var timer = setInterval(function () {
            if (count % 2 == 0) {
                nav.removeClass("navbar-default").addClass("navbar-inverse");
            }
            else {
                nav.removeClass("navbar-inverse").addClass("navbar-default");
            }
            if (--count <= 0) {
                clearInterval(timer);
            }
        }, 200);
    };
    FlashAirApp.prototype.addItem = function (_items, method) {
        var me = this;
        var wlansd_map = me.wlansd_map;
        var grid = me.grid;
        var items = $.isArray(_items) ? _items : [_items];
        var iso_items_to_add = [];
        for (var _i = 0; _i < items.length; _i++) {
            var item = items[_i];
            wlansd_map[item.r_uri + "/" + item.fname] = item;
            var div = $(me.template);
            div.data("fa-item", item);
            grid.append(div);
            item._dom = div;
            var a = div.find("a").attr("data-title", item.fname).attr("href", item.r_uri + "/" + item.fname).attr("title", moment(FlashAir.FileInfo.FTIMEtoDateTime(item.fdate, item.ftime)).format("LLLL", me.client.lang));
            if (is_chrome_app)
                a.attr("target", "_blank");
            if (item.attr & 16)
                a.addClass("dir-nav");
            var container = div.find('.image-container');
            div.find("div.name-label").text(item.fname + (item.fsize ? " (" + filesize(item.fsize) + ")" : ""));
            container.addClass(fa.getIconClass(item));
            iso_items_to_add.push(div.get(0));
            if (container.hasClass("icon-photo")) {
                div.hide();
                var img = div.find("img");
                img.on('load', function () {
                    var img = $(this);
                    var div = img.closest(".grid-item");
                    var container = div.find('.image-container');
                    if (is_chrome_app) {
                        container.css("background-image", img.css("background-image")).css("background-size", "cover");
                    }
                    else
                        container.css("background-image", "url('" + img.attr('src') + "')").css("background-size", "cover");
                });
                var imgSrc = me.client.Thumbnail.GetUrl(item);
                img.data("src", imgSrc);
            }
        }
        if (is_chrome_app) {
            RAL.Queue.setMaxConnections(3);
            RAL.Queue.start();
        }
        //this.onListUpdated();
        if (iso_items_to_add.length > 0) {
            grid.isotope((method || "appended"), iso_items_to_add);
        }
    };
    FlashAirApp.prototype.onLayoutComplete = function (laidOutitems) {
        var me = this;
        if (me.lazyLoading)
            me.recalcImageLoading();
        else
            me.startImageLoading(laidOutitems.map(function (e) {
                return e.element;
            }));
    };
    FlashAirApp.prototype.startImageLoading = function (laidOutitems) {
        var step = is_chrome_app ? -1 : 1;
        for (var i = is_chrome_app ? laidOutitems.length - 1 : 0; (is_chrome_app ? i >= 0 : i < laidOutitems.length); i += step) {
            var img = $(laidOutitems[i]).find("img");
            if (!img.attr("src") && img.data("src")) {
                if (!is_chrome_app) {
                    img.attr("src", img.data("src"));
                }
                else {
                    var remoteImage = new RAL.RemoteImage({ element: img.get(0), src: img.data("src") });
                    RAL.Queue.add(remoteImage);
                }
                img.removeData("src");
            }
        }
        if (is_chrome_app && laidOutitems.length > 0) {
            RAL.Queue.start();
        }
    };
    FlashAirApp.prototype.getIconClass = function (item) {
        var fname = item.fname;
        if ((item.attr & 16) && fname == "DCIM")
            icon = "icon-dcim";
        else if (item.attr & 16)
            icon = "icon-folder";
        else {
            var ext_lc = fname.substring(fname.lastIndexOf(".") + 1).toLowerCase();
            var icon;
            if ((ext_lc == "mov") || (ext_lc == "avi") || (ext_lc == "mpg") || (ext_lc == "mpeg") || (ext_lc == "mp4") || (ext_lc == "wmv") || (ext_lc == "rm")) {
                icon = "icon-movie";
            }
            else if ((ext_lc == "mp3") || (ext_lc == "wma") || (ext_lc == "aac") || (ext_lc == "wav") || (ext_lc == "aiff")) {
                icon = "icon-song";
            }
            else if ((ext_lc == "gif") || (ext_lc == "bmp") || (ext_lc == "png") || (ext_lc == "jpg") || (ext_lc == "jpeg")) {
                icon = "icon-photo";
            }
            else if (ext_lc == "txt") {
                icon = "icon-text";
            }
            else if (is_app && ext_lc == "dng") {
                icon = "icon-dng";
            }
            else if (is_app && (ext_lc == "cr2" || ext_lc == "crw" || ext_lc == "raw" || ext_lc == "erf" || ext_lc == "raf" || ext_lc == "3fr" || ext_lc == "arw" || ext_lc == "kdc" || ext_lc == "dcr" || ext_lc == "mrw" || ext_lc == "iiq" || ext_lc == "mos" || ext_lc == "mef" || ext_lc == "mfw" || ext_lc == "nef" || ext_lc == "nrw" || ext_lc == "orf" || ext_lc == "raw2" || ext_lc == "pef" || ext_lc == "tif" || ext_lc == "srw" || ext_lc == "x3f" || ext_lc == "sr2")) {
                icon = "icon-raw";
            }
            else {
                icon = "icon-other";
            }
        }
        return icon;
    };
    return FlashAirApp;
})();
var fa;
$(document).ready(function () {
    var grid = $('#grid');
    grid.isotope({
        // options
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        mansory: {
            columnWidth: 50
        },
        getSortData: {
            name: function (itemElem) {
                var el = $(itemElem);
                var i = el.data('fa-item');
                return i.fname;
            },
            datetime: function (itemElem) {
                var el = $(itemElem);
                var i = el.data('fa-item');
                return (i.fdate << 15) | i.ftime;
            }
        },
        sortBy: 'datetime',
        sortAscending: false,
        isInitLayout: false
    });
    //
    // activate FlashAirApp
    //
    if (is_chrome_app) {
        chrome.storage.local.get("faHost", function (obj) {
            console.log("last connected host = " + obj["faHost"]);
            initFlashAirApp(obj["faHost"] || "http://flashair");
        });
    }
    else if (is_ms_app) {
        initFlashAirApp("http://flashair");
    }
    else {
        // on web browser 
        initFlashAirApp("");
    }
    function initFlashAirApp(host) {
        fa = is_chrome_app ? new FlashAirChromeApp({ host: host, dir: "/" }) : new FlashAirApp({ host: host, dir: document.location.pathname, singlePage: true });
    }
    //
    // PhotoSwipe
    //
    var gallery;
    if (!is_chrome_app) {
        grid.on("click", "div.grid-item a .icon-photo", function (e) {
            e.preventDefault();
            var clickedA = $(this).closest("a");
            // open photoswipe
            var items = grid.data('isotope').filteredItems;
            var psItems = [];
            var startIndex = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var div = $(item.element);
                if (div.find(".image-container.icon-photo").length > 0) {
                    var data = div.data("fa-item");
                    var img = div.find("img");
                    var a = div.find("a");
                    var psitem = {
                        src: a.attr('href'),
                        msrc: fa.client.Thumbnail.GetUrl(data),
                        w: img.get(0).naturalWidth * 10,
                        h: img.get(0).naturalHeight * 10
                    };
                    if (!psitem.w || !psitem.h) {
                        psitem.h = 900;
                        psitem.w = 900;
                    }
                    psItems.push(psitem);
                    if (psitem.src == clickedA.attr('href')) {
                        startIndex = psItems.length - 1;
                    }
                }
            }
            gallery = new PhotoSwipe(document.getElementById("pswp"), PhotoSwipeUI_Default, psItems, {
                history: false,
                shareEl: false,
                index: startIndex
            });
            gallery.init();
            return false;
        });
    }
});
/*
    Yokin's FlashAir Synchronizer
    Chrome App component
    (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
    MIT License
 */
// <reference path="../../typings/chrome/chrome.d.ts"/>
/// <reference path="../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../typings/bootstrap/bootstrap.d.ts"/>
/// <reference path="../../typings/hammer.d.ts"/>
/// <reference path="../ts/flashAirTypes.ts" /> 
/// <reference path="../ts/flashAirClient.ts" />
/// <reference path="../ts/flashAirSynchronizer.ts" />
/// <reference path="../ts/yokins-fa.ts" />
// <reference path="../js/RAL/Loader.js" />
var wlansd;
var faSync;
var fa;
//
// extends FlashAirApp
//
var FlashAirChromeApp = (function (_super) {
    __extends(FlashAirChromeApp, _super);
    function FlashAirChromeApp(options) {
        _super.call(this, options);
    }
    FlashAirChromeApp.prototype.initUi = function () {
        _super.prototype.initUi.call(this);
        var me = this;
        $.when($.get("app-component.html").done(function (result) {
            $("body").append(result);
        })).then(function () {
            //
            // load localized text
            //
            $("*[data-localize]").each(function (index, el) {
                var $el = $(el), val = $el.data('localize');
                if (val.text) {
                    $el.text(chrome.i18n.getMessage(val.text));
                }
                if (val.html) {
                    $el.text(chrome.i18n.getMessage(val.html));
                }
                if (val.attrs) {
                    for (var key in val.attrs) {
                        $el.attr(key, chrome.i18n.getMessage(val.attrs[key]));
                    }
                }
            });
        });
        //
        //
        $("#headerLogoContainer a").click(function (e) {
            e.preventDefault();
            hostSelectDialog(fa);
            return false;
        });
        //
        // Sync appMenu
        //
        $("#syncStatusLine button[data-command], #navbar a[data-command]").on("click", function (e) {
            var btn = $(this), cmd = btn.data("command");
            console.log('cmd : ' + cmd);
            if (cmd == "folder") {
                faSync.selectLocalHomeDirectory(false, true).done(me.homeDirectoryIsSet.bind(me));
            }
            else if (cmd == "sync") {
                me.turnMonitoring(!(faSync.syncMode == 1 /* Monitoring */));
            }
            else if (cmd == "sync-cancel-all") {
                $('#synStatusLine *[data-command="sync"]').removeClass("active btn-success");
                faSync.stop();
            }
            else if (cmd == "sync-mode-all") {
                btn.closest("li").addClass("active");
                btn.closest("ul").find('[data-command="sync-mode-news"]').closest("li").removeClass("active");
                faSync.fileListUpaded(wlansd, null, null, 1 /* SyncAll */);
                faSync.start();
                faSync.syncScheme = 1 /* SyncAll */;
            }
            else if (cmd == "sync-mode-news") {
                btn.closest("li").addClass("active");
                btn.closest("ul").find('[data-command="sync-mode-all"]').closest("li").removeClass("active");
                faSync.fileListUpaded(wlansd, null, null, 2 /* SyncNewOnes */);
                faSync.start();
                faSync.syncScheme = 2 /* SyncNewOnes */;
            }
            else if (cmd == "config") {
            }
            else if (cmd == "close") {
                window.close();
            }
        });
        //
        // grid item context menu
        //
        me.grid.on('mouseenter mouseleave', 'div.grid-item', function (e) {
            var div = $(this);
            if (e.type == 'mouseenter')
                me.showContextMenuAt(div.data('fa-item'));
            else if (e.type == 'mouseleave')
                me.hideContextMenu();
        });
        $(document).on('click', '#fileItemMenu button[data-command]', function (e) {
            var btn = $(this), cmd = btn.data("command");
            console.log("command:" + cmd);
            var div = me.contextMenuTarget;
            if (div) {
                var faItem = div.data("fa-item");
                if (faItem) {
                    me.onItemCommand(faItem, cmd);
                }
            }
        });
        //
        me.grid.on("click", "div.grid-item a.fileLink[href]", function (e) {
            var a = $(this), div = $(this).closest("div.grid-item"), imgContainerDiv = a.find("div.image-container");
            if (a.is(".dir-nav"))
                return;
            if (imgContainerDiv.is(".icon-photo")) {
                var url = faClient.GetFileUrl(a.attr("href"));
                console.log(url);
            }
            else {
                e.preventDefault();
                return false;
            }
            //window.open( url, "_blank");
            return false;
        });
        //
        // touch support
        //
        var hammer = new Hammer.Manager(me.grid.get(0)); //new Hammer(me.grid.get(0));
        hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0, pointers: 0 }));
        hammer.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL, threshold: 0, velocity: 0.01 })).recognizeWith(hammer.get('pan'));
        hammer.add(new Hammer.Press({ time: 300 })).recognizeWith([hammer.get('pan'), hammer.get('swipe')]);
        //hammer.add(new Hammer.Swipe()).recognizeWith(hammer.get('pan'));
        //hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
        //hammer.get('press').recognizeWith( hammer.get('pan'));
        hammer.on("tap", function (e) {
            console.log(e);
        });
        var touchTarget = null;
        hammer.on("press", function (e) {
            var div = $(e.target).closest("div.grid-item");
            if (div.length > 0) {
                var faItem = div.data("faItem");
                if (!(faItem.attr & 16 /* Directory */)) {
                    var ic = div.find(".image-container");
                    touchTarget = ic;
                    ic.css("transform", "scale(0.9)");
                }
            }
            console.log(e.type);
        }).on("pressup", function (e) {
            if (touchTarget) {
                var ic = touchTarget;
                ic.css("transform", "");
                touchTarget = null;
            }
            console.log(e.type);
        }).on("pan", function (e) {
            if (touchTarget) {
                touchTarget.css("transform", "translate3d(" + e.deltaX + "px," + e.deltaY + "px,0)");
                e.preventDefault();
            }
            console.log(e.type);
        }).on("panend", function (e) {
            if (touchTarget) {
                touchTarget.css("transform", "");
                setTimeout(function () {
                    touchTarget = null;
                }, 500);
            }
            console.log(e.type);
        }).on("swipedown", function (e) {
            if (touchTarget) {
                var div = touchTarget.closest("div.grid-item");
                me.onItemCommand(div.data("faItem"), "download");
                touchTarget = null;
            }
            console.log(e.type);
        });
        // go/back navigation
        $(document).on('keydown', function (e) {
            if (e.keyCode == 8) {
                console.log(e);
            }
        }).on('mousedown', function (e) {
            console.log(e);
        });
    };
    FlashAirChromeApp.prototype.onItemCommand = function (faItem, cmd) {
        var item = faItem;
        if (cmd == "download") {
            if (item._syncStatus == 2 /* Syncing */ || item._syncStatus == 1 /* Queued */) {
                faSync.unqueue(faItem);
            }
            else {
                faSync.queue(faItem, true);
            }
        }
        else if (cmd == "open") {
            var url = faClient.GetFileUrl(faItem.r_uri + "/" + faItem.fname);
            console.log(url);
            window.open(url, "_blank");
        }
    };
    FlashAirChromeApp.prototype.homeDirectoryIsSet = function (entry) {
        console.log(entry);
        chrome.fileSystem.getDisplayPath(entry, function (displayPath) {
            $("#localSyncPath").text(displayPath);
        });
        $("#syncStatusLine").removeClass("no-directory");
    };
    FlashAirChromeApp.prototype.showContextMenuAt = function (_item) {
        var item = _item;
        //if( ! faSync.localHomeDirectoryEntry ) return;
        var me = this;
        var menu = $("#fileItemMenu");
        var div = item._dom;
        if (!(item.attr & 16)) {
            me.contextMenuTarget = div;
            div.append(menu);
            var ic = div.find("div.image-container");
            menu.find('button[data-command="open"]').css("display", ic.is(".icon-photo") ? "" : "none");
            menu.show();
            var o = div.offset();
            menu.offset({ top: o.top, left: o.left });
        }
    };
    FlashAirChromeApp.prototype.hideContextMenu = function () {
        var me = this;
        var menu = $("#fileItemMenu");
        menu.hide();
        $("body").append(menu);
    };
    FlashAirChromeApp.prototype.turnMonitoring = function (turnOn) {
        var btn = $('#syncStatusLine *[data-command=sync]'), cls = "btn-success active";
        if (turnOn) {
            btn.addClass(cls);
            faSync.startMonitoring();
        }
        else {
            btn.removeClass(cls);
            faSync.stopMonitoring();
        }
    };
    FlashAirChromeApp.prototype.navigate = function (dir) {
        var me = this;
        me.turnMonitoring(false);
        me.hideContextMenu();
        faSync.unqueue(null);
        _super.prototype.navigate.call(this, dir);
    };
    FlashAirChromeApp.prototype.setHostAddress = function (host, verify) {
        return this.client.setHostAddress(host, verify).then(function () {
            chrome.storage.local.set({ faHost: host });
        });
    };
    FlashAirChromeApp.prototype.oninit = function () {
        _super.prototype.oninit.call(this);
        this.initSyncApp();
    };
    FlashAirChromeApp.prototype.initSyncApp = function () {
        var me = this;
        faSync = new FlashAir.FlashAirSynchronizer(me.client);
        faSync.selectLocalHomeDirectory(true, false).done(me.homeDirectoryIsSet.bind(me));
        faSync.on('fa.sync.progress', function (faItem, loaded, total) {
            var div = faItem._dom;
            if (div) {
                var css = Math.floor(loaded * 100 / total) + "%";
                div.find(".progress-bar").css('width', css);
            }
        }).on('fa.sync.queue', function (status) {
            if (status == "empty") {
                // $('#navbar *[data-command="sync"]').removeClass("active btn-success");
                $("#fileTransferIndicator").removeClass("active");
                console.log("sync queue is empty.");
            }
            else if (status == "started") {
                $("#fileTransferIndicator").addClass("active");
                //$('#navbar *[data-command="sync"]').addClass("active btn-success");
                console.log("sync queue started running.");
            }
        }).on('fa.sync.queued', function (faItem) {
            var div = faItem._dom;
            if (div) {
                var progressDiv = div.find(".progress-bar");
                div.removeClass("downloaded downloading").addClass("queued");
                progressDiv.show().css("width", "0");
            }
        }).on('fa.sync.unqueued', function (faItem) {
            var div = faItem._dom;
            if (div) {
                var progressDiv = div.find(".progress-bar");
                div.removeClass("downloaded downloading queued");
                progressDiv.hide().css("width", "0");
            }
        }).on('fa.sync.start', function (faItem) {
            var div = faItem._dom;
            if (div) {
                var progressDiv = div.find(".progress-bar");
                div.removeClass("downloaded queued").addClass("downloading");
                progressDiv.show().css("width", 0);
            }
        }).on('fa.sync.done', function (faItem) {
            var item = faItem;
            var div = item._dom;
            if (div) {
                var progressDiv = div.find(".progress-bar");
                if (item._syncStatus == 4 /* Error */) {
                    div.removeClass("downloaded");
                    console.log("Error...");
                }
                else {
                    div.addClass("downloaded");
                    console.log("Downloaded...");
                }
                progressDiv.hide();
            }
        }).on('fa.hostfailure', function () {
            console.log("Host failure");
            hostSelectDialog(fa);
        }).on('fa.hostchanged', function () {
            $("#hostUrl").text(fa.client.baseUrl);
            me.navigate("/");
        });
    };
    FlashAirChromeApp.prototype.onListUpdated = function (listAll, listAdded, listDeleted) {
        faSync.fileListUpaded(listAll, listAdded, listDeleted);
    };
    FlashAirChromeApp.prototype.pushHistory = function (dir) {
        // nothing...
    };
    return FlashAirChromeApp;
})(FlashAirApp);
function hostSelectDialog(fa) {
    var dlg = $("#hostSelectorModal");
    $("#hostAddressTextBox").val(fa.client.baseUrl);
    dlg.modal();
    dlg.on('hide.bs.modal', function (e) {
    });
    $("#saveHostAddressBtn").one('click', function () {
        var ValidIpAddressRegex = /^(https?\:\/\/|)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})/;
        var ValidHostnameRegex = /^(https?\:\/\/|)([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\.[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)*)/;
        var newUrl = $("#hostAddressTextBox").val();
        var m = ValidIpAddressRegex.exec(newUrl) || ValidHostnameRegex.exec(newUrl);
        if (m) {
            $("input,button", dlg).prop("disabled", true);
            fa.client.stopPolling();
            fa.setHostAddress((m[1] || "http://") + m[2], true).done(function () {
                dlg.modal('hide');
            }).always(function () {
                $("input,button", dlg).removeProp("disabled");
            });
        }
    });
}

//# sourceMappingURL=flashAir-sd-all.js.map