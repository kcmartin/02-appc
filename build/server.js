/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(1);
	
	var _express = __webpack_require__(2);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _http = __webpack_require__(3);
	
	var _http2 = _interopRequireDefault(_http);
	
	var _socket = __webpack_require__(4);
	
	var _socket2 = _interopRequireDefault(_socket);
	
	var _chalk = __webpack_require__(5);
	
	var _chalk2 = _interopRequireDefault(_chalk);
	
	var _rxjs = __webpack_require__(6);
	
	__webpack_require__(7);
	
	var _observableSocket = __webpack_require__(8);
	
	var _users = __webpack_require__(9);
	
	var _playlist = __webpack_require__(14);
	
	var _chat = __webpack_require__(15);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var isDevelopment = process.env.NODE_ENV !== "production";
	
	// this is a test
	//---------------------------
	// Setup
	var app = (0, _express2.default)();
	var server = new _http2.default.Server(app);
	var io = (0, _socket2.default)(server);
	
	//---------------------------
	// Client Webpack
	// middleware for DEV ONLY!!
	if (process.env.USE_WEBPACK === "true") {
	    var webpackMiddleware = __webpack_require__(16),
	        webpackHotMiddleware = __webpack_require__(17),
	        webpack = __webpack_require__(18),
	        clientConfig = __webpack_require__(19);
	
	    var compiler = webpack(clientConfig);
	    app.use(webpackMiddleware(compiler, {
	        publicPath: "/build/",
	        stats: {
	            colors: true,
	            chunks: false,
	            assets: false,
	            timings: false,
	            modules: false,
	            hash: false,
	            version: false
	        }
	    }));
	
	    app.use(webpackHotMiddleware(compiler));
	
	    console.log(_chalk2.default.bgRed("Using WebPack Dev Middleware! THIS IS FOR DEV ONLY!"));
	}
	
	//---------------------------
	// Configure Express
	app.set("view engine", "jade");
	app.use(_express2.default.static("public"));
	
	// define route
	var useExternalStyles = !isDevelopment;
	app.get("/", function (req, res) {
	    res.render("index", {
	        useExternalStyles: useExternalStyles
	    });
	});
	
	//---------------------------
	// Services
	var videoServices = [];
	var playlistRepository = {};
	
	//---------------------------
	// Modules
	var users = new _users.UsersModule(io);
	var chat = new _chat.ChatModule(io, users);
	var playlist = new _playlist.PlaylistModule(io, users, playlistRepository, videoServices);
	var modules = [users, chat, playlist];
	
	//---------------------------
	// Socket
	io.on("connection", function (socket) {
	    console.log("Got connection from " + socket.request.connection.remoteAddress);
	
	    var client = new _observableSocket.ObservableSocket(socket);
	
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	        for (var _iterator = modules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var mod = _step.value;
	
	            mod.registerClient(client);
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
	
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;
	
	    try {
	        for (var _iterator2 = modules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var _mod = _step2.value;
	
	            _mod.clientRegistered(client);
	        }
	    } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	            }
	        } finally {
	            if (_didIteratorError2) {
	                throw _iteratorError2;
	            }
	        }
	    }
	});
	
	//---------------------------
	// Startup
	var port = process.env.PORT || 3000;
	function startServer() {
	    server.listen(port, function () {
	        console.log("Started http server on " + port);
	    });
	}
	
	_rxjs.Observable.merge.apply(_rxjs.Observable, _toConsumableArray(modules.map(function (m) {
	    return m.init$();
	}))).subscribe({
	    complete: function complete() {
	        startServer();
	    },
	    error: function error(_error) {
	        console.error("Could not init module: " + (_error.stack || _error));
	    }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("source-map-support/register");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("socket.io");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("rxjs");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _rxjs = __webpack_require__(6);
	
	_rxjs.Observable.prototype.safeSubscribe = function (next, error, complete) {
	    var subscription = this.subscribe(function (item) {
	        try {
	            next(item);
	        } catch (e) {
	            console.error(e.stack || e);
	            subscription.unsubscribe();
	        }
	    }, error, complete);
	    return subscription;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ObservableSocket = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.clientMessage = clientMessage;
	exports.fail = fail;
	exports.success = success;
	
	var _rxjs = __webpack_require__(6);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function clientMessage(message) {
	    var error = new Error(message);
	    error.clientMessage = message;
	    return error;
	}
	
	//helper function fail method
	function fail(message) {
	    return _rxjs.Observable.throw({ clientMessage: message });
	}
	
	// cache success observable
	var successObservable = _rxjs.Observable.empty();
	function success() {
	    return successObservable;
	}
	
	var ObservableSocket = exports.ObservableSocket = function () {
	    _createClass(ObservableSocket, [{
	        key: "isConnected",
	        get: function get() {
	            return this._state.isConnected;
	        }
	    }, {
	        key: "isReconnecting",
	        get: function get() {
	            return this._state.isReconnecting;
	        }
	    }, {
	        key: "isTotallyDead",
	        get: function get() {
	            return !this.isConnected && !this.isReconnecting;
	        }
	    }]);
	
	    function ObservableSocket(socket) {
	        var _this = this;
	
	        _classCallCheck(this, ObservableSocket);
	
	        this._socket = socket;
	        this._state = {};
	        this._actionCallbacks = {};
	        this._requests = {};
	        this._nextRequestId = 0;
	
	        this.status$ = _rxjs.Observable.merge(this.on$("connect").map(function () {
	            return { isConnected: true };
	        }), this.on$("disconnect").map(function () {
	            return { isConnected: false };
	        }), this.on$("reconnecting").map(function (attempt) {
	            return { isConnected: false, isReconnecting: true, attempt: attempt };
	        }), this.on$("reconnect_failed").map(function () {
	            return { isConnected: false, isReconnecting: false };
	        })).publishReplay(1).refCount();
	
	        this.status$.subscribe(function (state) {
	            return _this._state = state;
	        });
	    }
	
	    //-------------------
	    // Basic Wrappers
	
	
	    _createClass(ObservableSocket, [{
	        key: "on$",
	        value: function on$(event) {
	            return _rxjs.Observable.fromEvent(this._socket, event);
	        }
	    }, {
	        key: "on",
	        value: function on(event, callback) {
	            this._socket.on(event, callback);
	        }
	    }, {
	        key: "off",
	        value: function off(event, callback) {
	            this._socket.off(event, callback);
	        }
	    }, {
	        key: "emit",
	        value: function emit(event, arg) {
	            this._socket.emit(event, arg);
	        }
	
	        //-------------------
	        // Emit (Client Side)
	
	    }, {
	        key: "emitAction$",
	        value: function emitAction$(action, arg) {
	            var id = this._nextRequestId++;
	            this._registerCallbacks(action);
	
	            var subject = this._requests[id] = new _rxjs.ReplaySubject(1);
	            this._socket.emit(action, arg, id);
	            return subject;
	        }
	    }, {
	        key: "_registerCallbacks",
	        value: function _registerCallbacks(action) {
	            var _this2 = this;
	
	            if (this._actionCallbacks.hasOwnProperty(action)) return;
	
	            this._socket.on(action, function (arg, id) {
	                var request = _this2._popRequest(id);
	                if (!request) return;
	
	                request.next(arg);
	                request.complete();
	            });
	
	            this._socket.on(action + ":fail", function (arg, id) {
	                var request = _this2._popRequest(id);
	                if (!request) return;
	
	                request.error(arg);
	            });
	
	            this._actionCallbacks[action] = true;
	        }
	    }, {
	        key: "_popRequest",
	        value: function _popRequest(id) {
	            if (!this._requests.hasOwnProperty(id)) {
	                console.error("Event with " + id + " was returned twice, or the server did not send back an ID!");
	                return;
	            }
	
	            var request = this._requests[id];
	            delete this._requests[id];
	            return request;
	        }
	
	        //-------------------
	        // On (Server Side)
	
	    }, {
	        key: "onAction",
	        value: function onAction(action, callback) {
	            var _this3 = this;
	
	            this._socket.on(action, function (arg, requestId) {
	                try {
	                    var _ret = function () {
	                        var value = callback(arg);
	                        if (!value) {
	                            _this3._socket.emit(action, null, requestId);
	                            return {
	                                v: void 0
	                            };
	                        }
	
	                        if (typeof value.subscribe !== "function") {
	                            _this3._socket.emit(action, value, requestId);
	                            return {
	                                v: void 0
	                            };
	                        }
	
	                        var hasValue = false;
	                        value.subscribe({
	                            next: function next(item) {
	                                if (hasValue) throw new Error("Action " + action + " produced more than one value.");
	
	                                _this3._socket.emit(action, item, requestId);
	                                hasValue = true;
	                            },
	
	                            error: function error(_error) {
	                                _this3._emitError(action, requestId, _error);
	                                console.error(_error.stack || _error);
	                            },
	
	                            complete: function complete() {
	                                if (!hasValue) _this3._socket.emit(action, null, requestId);
	                            }
	                        });
	                    }();
	
	                    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
	                } catch (error) {
	                    if (typeof requestId !== "undefined") _this3._emitError(action, requestId, error);
	
	                    console.error(error.stack || error);
	                }
	            });
	        }
	
	        // register multiple actions with the same object
	
	    }, {
	        key: "onActions",
	        value: function onActions(actions) {
	            for (var action in actions) {
	                if (!actions.hasOwnProperty(action)) continue;
	
	                this.onAction(action, actions[action]);
	            }
	        }
	    }, {
	        key: "_emitError",
	        value: function _emitError(action, id, error) {
	            var message = error && error.clientMessage || "Fatal Error";
	            this._socket.emit(action + ":fail", { message: message }, id);
	        }
	    }]);

	    return ObservableSocket;
	}();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UsersModule = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _lodash = __webpack_require__(10);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _rxjs = __webpack_require__(6);
	
	var _module = __webpack_require__(11);
	
	var _users = __webpack_require__(12);
	
	var _observableSocket = __webpack_require__(8);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AuthContext = Symbol("AuthContext");
	
	var UsersModule = exports.UsersModule = function (_ModuleBase) {
	    _inherits(UsersModule, _ModuleBase);
	
	    function UsersModule(io) {
	        _classCallCheck(this, UsersModule);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UsersModule).call(this));
	
	        _this._io = io;
	        _this._userList = [];
	        _this._users = {};
	        return _this;
	    }
	
	    _createClass(UsersModule, [{
	        key: "getColorForUsername",
	        value: function getColorForUsername(username) {
	            var hash = _lodash2.default.reduce(username, function (hash, ch) {
	                return ch.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
	            }, 0);
	
	            hash = Math.abs(hash);
	            var hue = hash % 360,
	                saturation = hash % 25 + 70,
	                lightness = 100 - (hash % 15 + 35);
	
	            return "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
	        }
	    }, {
	        key: "getUserForClient",
	        value: function getUserForClient(client) {
	            var auth = client[AuthContext];
	            if (!auth) return null;
	
	            return auth.isLoggedIn ? auth : null;
	        }
	    }, {
	        key: "loginClient$",
	        value: function loginClient$(client, username) {
	            username = username.trim();
	
	            var validator = (0, _users.validateLogin)(username);
	            if (!validator.isValid) return validator.throw$();
	
	            // if username is already taken
	            if (this._users.hasOwnProperty(username)) return (0, _observableSocket.fail)("Username " + username + " is already taken");
	
	            var auth = client[AuthContext] || (client[AuthContext] = {});
	            if (auth.isLoggedIn) return (0, _observableSocket.fail)("You are already logged in");
	
	            auth.name = username;
	            auth.color = this.getColorForUsername(username);
	            auth.isLoggedIn = true;
	
	            this._users[username] = client;
	            this._userList.push(auth);
	
	            this.io.emit("users:added", auth);
	            console.log("User " + username + " logged in");
	            return _rxjs.Observable.of(auth);
	        }
	    }, {
	        key: "registerClient",
	        value: function registerClient(client) {
	            var _this2 = this;
	
	            client.onActions({
	                "users:list": function usersList() {
	                    return _this2._userList;
	                },
	
	                "auth:login": function authLogin(_ref) {
	                    var name = _ref.name;
	
	                    return _this2.loginClient$(client, name);
	                },
	
	                "auth:logout": function authLogout() {}
	            });
	        }
	    }]);

	    return UsersModule;
	}(_module.ModuleBase);

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ModuleBase = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _rxjs = __webpack_require__(6);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/*eslint no-unused-vars: "off"*/
	
	var ModuleBase = exports.ModuleBase = function () {
	    function ModuleBase() {
	        _classCallCheck(this, ModuleBase);
	    }
	
	    _createClass(ModuleBase, [{
	        key: "init$",
	        value: function init$() {
	            return _rxjs.Observable.empty();
	        }
	    }, {
	        key: "registerClient",
	        value: function registerClient(client) {}
	    }, {
	        key: "clientRegistered",
	        value: function clientRegistered(client) {}
	    }]);

	    return ModuleBase;
	}();

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.USERNAME_REGEX = undefined;
	exports.validateLogin = validateLogin;
	
	var _validator = __webpack_require__(13);
	
	var USERNAME_REGEX = exports.USERNAME_REGEX = /^[\w\d_-]+$/; // general vaildation for users
	
	
	function validateLogin(username) {
	    var validator = new _validator.Validator();
	
	    if (username.length >= 20) validator.error("Username must be fewer than 20 characters");
	
	    if (USERNAME_REGEX.test(username)) validator.error("Username can only contain numbers, digits, underscores and dashes");
	
	    return validator;
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Validator = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _rxjs = __webpack_require__(6);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Validator = exports.Validator = function () {
	    _createClass(Validator, [{
	        key: "isValid",
	        get: function get() {
	            return !this._errors.length;
	        }
	    }, {
	        key: "errors",
	        get: function get() {
	            return this._errors;
	        }
	    }, {
	        key: "message",
	        get: function get() {
	            return this._errors.join(", ");
	        }
	    }]);
	
	    function Validator() {
	        _classCallCheck(this, Validator);
	
	        this._errors = [];
	    }
	
	    _createClass(Validator, [{
	        key: "error",
	        value: function error(message) {
	            this._errors.push(message);
	        }
	    }, {
	        key: "toObject",
	        value: function toObject() {
	            if (this.isValid) return {};
	
	            return {
	                errors: this._errors,
	                message: this._message
	            };
	        }
	    }, {
	        key: "throw$",
	        value: function throw$() {
	            return _rxjs.Observable.throw({ clientMessage: this.message });
	        }
	    }]);

	    return Validator;
	}();

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PlaylistModule = undefined;
	
	var _module = __webpack_require__(11);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var PlaylistModule = exports.PlaylistModule = function (_ModuleBase) {
	    _inherits(PlaylistModule, _ModuleBase);
	
	    function PlaylistModule(io, usersModule, playlistRepository, videoServices) {
	        _classCallCheck(this, PlaylistModule);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PlaylistModule).call(this));
	
	        _this._io = io;
	        _this._users = usersModule;
	        _this._repository = playlistRepository;
	        _this._services = videoServices;
	        return _this;
	    }
	
	    return PlaylistModule;
	}(_module.ModuleBase);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ChatModule = undefined;
	
	var _module = __webpack_require__(11);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ChatModule = exports.ChatModule = function (_ModuleBase) {
	    _inherits(ChatModule, _ModuleBase);
	
	    function ChatModule(io, usersModule) {
	        _classCallCheck(this, ChatModule);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChatModule).call(this));
	
	        _this._io = io;
	        _this._users = usersModule;
	        return _this;
	    }
	
	    return ChatModule;
	}(_module.ModuleBase);

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("webpack-dev-middleware");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("webpack-hot-middleware");

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("webpack");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var path = __webpack_require__(20),
	    webpack = __webpack_require__(18),
	    ExtractTextPlugin = __webpack_require__(21);
	
	var vendorModules = ["jquery", "lodash", "socket.io-client", "rxjs"];
	
	// this addreses an oddity in weppack
	var dirname = path.resolve("./");
	
	function createConfig(isDebug) {
	    var devTool = isDebug ? "eval-source-map" : "source-map";
	    var plugins = [new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")];
	
	    var cssLoader = { test: /\.css$/, loader: "style!css" };
	    var sassLoader = { test: /\.scss$/, loader: "style!css!sass" };
	    var appEntry = ["./src/client/application.js"];
	
	    if (!isDebug) {
	        plugins.push(new webpack.optimize.UglifyJsPlugin());
	        plugins.push(new ExtractTextPlugin("[name].css"));
	
	        cssLoader.loader = ExtractTextPlugin.extract("style", "css");
	        sassLoader.loader = ExtractTextPlugin.extract("style", "css!sass");
	    } else {
	        plugins.push(new webpack.HotModuleReplacementPlugin());
	        appEntry.splice(0, 0, "webpack-hot-middleware/client");
	    }
	
	    // -------------------------
	    // WEBPACK CONFIG
	    return {
	        devtool: devTool,
	        entry: {
	            application: appEntry,
	            vendor: vendorModules
	        },
	        output: {
	            path: path.join(dirname, "public", "build"),
	            filename: "[name].js",
	            publicPath: "/build/"
	        },
	        resolve: {
	            alias: {
	                shared: path.join(dirname, "src", "shared")
	            }
	        },
	        module: {
	            loaders: [{ test: /\.js$/, loader: "babel", exclude: /node_modules/ }, { test: /\.js$/, loader: "eslint", exclude: /node_modules/ }, { test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: "url-loader?limit=128" }, cssLoader, sassLoader]
	        },
	        plugins: plugins
	
	    };
	    // -------------------------
	}
	
	module.exports = createConfig(true);
	module.exports.create = createConfig;

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("extract-text-webpack-plugin");

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map