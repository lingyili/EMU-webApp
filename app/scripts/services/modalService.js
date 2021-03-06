'use strict';

/**
 * @ngdoc service
 * @name emuwebApp.modalService
 * @description
 * # modalService
 * Service in the emuwebApp.
 */
angular.module('emuwebApp')
	.service('modalService', function modalService($q, ArrayHelperService, viewState) {

		// shared service object
		var sServObj = {};

		sServObj.initialize = function() {
            sServObj.isOpen = false;
            sServObj.templateUrl = '';
            sServObj.defer = undefined;
            sServObj.deferChange = undefined;
            sServObj.force = false;
            sServObj.dataOut = undefined;
            sServObj.dataIn = undefined;
            sServObj.dataExport = undefined;
        };

		/**
		 * open modal normally
		 */
		sServObj.open = function (template, param1, param2, force) {
		    sServObj.initialize();

			if (param1 !== undefined) {
				sServObj.dataIn = param1;
				if (param1.y !== undefined) {
					sServObj.dataIn.chartData = ArrayHelperService.convertArrayToXYjsoArray(param1.y);
				}
			}
			if (param2 !== undefined) {
				sServObj.dataExport = param2;
			}
			if (force !== undefined) { // force user to do sth
				sServObj.force = force;
			}
			sServObj.defer = $q.defer();
			sServObj.templateUrl = template;
			viewState.setState('modalShowing');
			sServObj.isOpen = true;
			return sServObj.defer.promise;
		};

		/**
		 *
		 */
		sServObj.error = function (msg) {
            sServObj.initialize();

			sServObj.dataIn = msg;
			sServObj.templateUrl = 'views/error.html';
			viewState.setState('modalShowing');
		};

		/**
		 *
		 */
		sServObj.close = function () {
			viewState.setEditing(false);
			viewState.setState(viewState.prevState);
			sServObj.isOpen = false;
			if (viewState.hierarchyState.isShown()) {
				viewState.hierarchyState.toggleHierarchy();
			}
			sServObj.defer.resolve(false);
		};


		/**
		 *
		 */
		sServObj.closeAndResolve = function (status) {
			viewState.setEditing(false);
			viewState.setState(viewState.prevState);
			sServObj.isOpen = false;
			sServObj.defer.resolve(status);
		};


		/**
		 *
		 */
		sServObj.confirm = function () {
			viewState.setEditing(false);
			viewState.setState(viewState.prevState);
			sServObj.isOpen = false;
			sServObj.defer.resolve(true);
		};


		/**
		 *
		 */
		sServObj.select = function (idx) {
			sServObj.closeAndResolve(idx);
		};

		/**
		 *
		 */
		sServObj.confirmContent = function () {
			viewState.setEditing(false);
			viewState.setState(viewState.prevState);
			sServObj.isOpen = false;
			sServObj.defer.resolve(sServObj.dataOut);
		};

		/**
		 *
		 */
		sServObj.getTemplateUrl = function () {
			return sServObj.templateUrl;
		};


		return sServObj;
	});
