var services = angular.module('smlBootstrap.services', ['ngResource']);

var dontBlockOnAjaxHeader = { "dontBlockPageOnAjax": "true" };
var nonArrayGetWithoutBlockOnAjax = { method: "GET", isArray: false, headers: dontBlockOnAjaxHeader };

services.constant('ajaxNonBlockingPageQuery', {
    method: 'GET',
    isArray: false,
    headers: {'dontBlockPageOnAjax': 'true'}
});

services.factory('EntriesService', function ($resource) {

    var self = this;

    self.entriesCrudResource = $resource('rest/entries/:id', { }, {
        insert: { method: "PUT"},
        query: nonArrayGetWithoutBlockOnAjax
    });

    self.counterResource = $resource("/rest/entries/count", { }, {
        get: nonArrayGetWithoutBlockOnAjax
    });

    self.newEntriesCounterResource = $resource("/rest/entries/count-newer/:time", { }, {
        get: nonArrayGetWithoutBlockOnAjax
    });

    var entriesService = {};

    entriesService.loadAll = function (successFunction) {
        self.entriesCrudResource.query(null, successFunction);
    };

    entriesService.addNew = function (entryText, successFunction) {
        var json = {};
        json.text = entryText;
        self.entriesCrudResource.save(angular.toJson(json), successFunction);
    };

    entriesService.load = function (logObjectId, successFunction) {
        self.entriesCrudResource.get({id: logObjectId}, successFunction);
    };

    entriesService.update = function (logObject) {
        var json = {};
        json.text = logObject.text;
        json.id = logObject.id;
        self.entriesCrudResource.insert(angular.toJson(json));
    };

    entriesService.deleteEntry = function (logObjectId, successFunction) {
        self.entriesCrudResource.remove({id: logObjectId}, successFunction);
    };

    entriesService.count = function (successFunction) {
        self.counterResource.get(successFunction);
    };

    entriesService.countNewEntries = function(timestamp, successFunction) {
        self.newEntriesCounterResource.get({time: timestamp}, successFunction)
    }

    return entriesService;
});


services.factory('UserSessionService', function ($resource) {

    var self = this;

    self.userResource = $resource('rest/users/', { }, {
        login: {method: 'POST'},
        valid: {method: 'GET'}
    });

    self.logoutResource = $resource('rest/users/logout', { }, { });


    var userSessionService = {
        loggedUser: null
    };

    userSessionService.isLogged = function () {
        return userSessionService.loggedUser != null;
    };

    userSessionService.isNotLogged = function () {
        return userSessionService.loggedUser == null;
    };

    userSessionService.login = function (user, successFunction, errorFunction) {
        self.userResource.login(angular.toJson(user), function (data) {
            userSessionService.loggedUser = data;
            if (successFunction != null) {
                successFunction(data);
            }
        },
        errorFunction)
    };

    userSessionService.logout = function (user, successFunction) {
        self.logoutResource.query(null, function (data) {
            userSessionService.loggedUser = null;
            if (successFunction != null) {
                successFunction(data);
            }
        });
    };

    userSessionService.validate = function (successFunction) {
        self.userResource.valid(
                function (data) {
                    userSessionService.loggedUser = data;
                    if (successFunction != null) {
                        successFunction(data);
                    }
                }
        );
    };

    userSessionService.getLoggedUserName = function () {
        if (userSessionService.loggedUser) {
            return userSessionService.loggedUser.login;
        }
        else {
            return "";
        }
    };

    return userSessionService;
});


services.factory('UtilService', function ($resource, ajaxNonBlockingPageQuery) {

    var self = this;

    self.utilResource = $resource('/rest/uptime', { }, {
        get: ajaxNonBlockingPageQuery
    });

    var utilService = {};

    utilService.loadUptime = function (successFunction) {
        return self.utilResource.get(successFunction);
    };

    return utilService;
});

services.factory('RegisterService', function ($resource, FlashService) {

    var self = this;
    self.registerResource = $resource('rest/users/register');

    var registerService = {};

    registerService.register = function (user, successFunction, errorFunction) {
        self.registerResource.save(angular.toJson(user), function (data) {
            if (angular.equals(data.value, 'success')) {
                FlashService.set("User registered successfully! Please check your e-mail for confirmation.");
                successFunction();
            } else {
                errorFunction(data.value)
            }
        })
    };

    return registerService;
});

services.factory("FlashService", function () {

    var queue = [];

    return {
        set: function (message) {
            queue.push(message);
        },
        get: function () {
            return queue.shift();
        }
    };
});
