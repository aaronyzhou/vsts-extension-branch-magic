define(["TFS/VersionControl/Contracts","TFS/VersionControl/GitRestClient","VSS/Utils/Core"], function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(0), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, GitRestClient_1, Contracts_1, Core_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var actionProvider = {
        getMenuItems: function (context) {
            return [{
                    icon: "fabric://Merge",
                    title: "Merge Master",
                    action: function (actionContext) {
                        console.log(actionContext);
                        // If we are calling from the files page
                        if (actionContext.getSourceItemContext) {
                            actionContext.getSourceItemContext().then(function (a) {
                                var repoId = a.gitRepository.id;
                                var branch = "refs/heads/" + a.version;
                                makePullRequest(repoId, branch);
                            });
                        }
                        else {
                            var repoId = actionContext.pullRequest.repositoryId;
                            var branch = actionContext.pullRequest.sourceRefName;
                            makePullRequest(repoId, branch);
                        }
                    }
                }];
        }
    };
    var makePullRequest = function (repoId, sourceRefName) {
        var webContext = VSS.getWebContext();
        var identityRef = {
            id: webContext.user.id
        };
        var completionOptions = {
            bypassPolicy: true,
            bypassReason: "merge master",
            deleteSourceBranch: false,
            mergeCommitMessage: "merge master",
            squashMerge: true
        };
        var pullReq = {
            autoCompleteSetBy: identityRef,
            description: "merge master",
            sourceRefName: "refs/heads/master",
            targetRefName: sourceRefName,
            completionOptions: completionOptions,
            title: "merge master"
        };
        GitRestClient_1.getClient().createPullRequest(pullReq, repoId, null, false, false).then(function (value) {
            pollMergeStatus(value);
        });
    };
    var pollMergeStatus = function (pullReq) {
        GitRestClient_1.getClient().getPullRequest(pullReq.repository.id, pullReq.pullRequestId).then(function (pr) {
            if (pr.mergeStatus === Contracts_1.PullRequestAsyncStatus.Succeeded) {
                var completeStatus = {
                    lastMergeSourceCommit: pr.lastMergeSourceCommit,
                    status: Contracts_1.PullRequestStatus.Completed
                };
                GitRestClient_1.getClient().updatePullRequest(completeStatus, pr.repository.id, pr.pullRequestId);
            }
            else if (pr.mergeStatus === Contracts_1.PullRequestAsyncStatus.NotSet || pr.mergeStatus === Contracts_1.PullRequestAsyncStatus.Queued) {
                Core_1.delay(_this, 100, pollMergeStatus, [pr]);
            }
            else {
                console.log("error");
                return;
            }
        });
    };
    // Register context menu action provider
    VSS.register(VSS.getContribution().id, actionProvider);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ])});;