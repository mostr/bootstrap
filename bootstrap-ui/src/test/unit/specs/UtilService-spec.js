'use strict';

describe("Util Service", function () {

    beforeEach(module('smlBootstrap.services'));

    var $httpBackend, utilService;

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        utilService = $injector.get('UtilService');
    }));

    it('Should send request with custom header set', function () {

        $httpBackend.expectGET('/rest/uptime', function(headers) {
            return headers['dontBlockPageOnAjax'] === 'true';
        }).respond(200, '');

        utilService.loadUptime(function() {});

        $httpBackend.flush();
    });
});
