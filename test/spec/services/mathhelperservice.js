'use strict';

describe('Service: mathHelperService', function () {

  // load the service's module
  beforeEach(module('emuwebApp'));

  // instantiate service
  var mathHelperService;
  beforeEach(inject(function (_mathHelperService_) {
    mathHelperService = _mathHelperService_;
  }));

  it('should do something', function () {
    expect(!!mathHelperService).toBe(true);
    var res = mathHelperService.calcClosestPowerOf2Gt(5);
    expect(res).toBe(8);
    var res = mathHelperService.calcClosestPowerOf2Gt(9);
    expect(res).toBe(16);
    var res = mathHelperService.calcClosestPowerOf2Gt(255);
    expect(res).toBe(256);

  });

});
