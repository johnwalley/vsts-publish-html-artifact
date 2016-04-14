/// <reference path='../typings/main.d.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "VSS/Controls", "TFS/DistributedTask/TaskRestClient"], function (require, exports, Controls, DT_Client) {
    "use strict";
    var InfoTab = (function (_super) {
        __extends(InfoTab, _super);
        function InfoTab() {
            _super.call(this);
        }
        InfoTab.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            var sharedConfig = VSS.getConfiguration();
            var vsoContext = VSS.getWebContext();
            if (sharedConfig) {
                sharedConfig.onBuildChanged(function (build) {
                    _this._initBuildInfo(build);
                    var taskClient = DT_Client.getClient();
                    taskClient.getPlanAttachments(vsoContext.project.id, "build", build.orchestrationPlan.planId, "JohnWalley.html_artifact").then(function (taskAttachments) {
                        if (taskAttachments.length == 0) {
                            var element = $("<div />");
                            var errorText = "No HTML artifact is available";
                            element.html("<p>" + errorText + "</p>");
                            _this._element.replaceWith(element);
                        }
                        else {
                            $.each(taskAttachments, function (index, taskAttachment) {
                                if (taskAttachment._links && taskAttachment._links.self && taskAttachment._links.self.href) {
                                    var link = taskAttachment._links.self.href;
                                    var attachmentName = taskAttachment.name;
                                    taskClient.getAttachmentContent(vsoContext.project.id, "build", build.orchestrationPlan.planId, taskAttachment.timelineId, taskAttachment.recordId, "JohnWalley.html_artifact", taskAttachment.name).then(function (attachmentContent) {
                                        var text = new TextDecoder('utf-8').decode(new Uint8Array(attachmentContent));
                                        var el = $('<iframe>', {
                                            srcdoc: text,
                                            id: 'html-artifact',
                                            frameborder: '0',
                                            width: '100%',
                                            height: '100%',
                                            scrolling: 'yes',
                                            marginheight: '0',
                                            marginwidth: '0'
                                        });
                                        _this._element.replaceWith(el);
                                        VSS.resize();
                                    });
                                }
                            });
                        }
                    }, function () {
                        var element = $("<div />");
                        var errorText = "No HTML artifact is available";
                        element.html("<p>" + errorText + "</p>");
                        this._element.replaceWith(element);
                    });
                });
            }
        };
        InfoTab.prototype._initBuildInfo = function (build) {
        };
        return InfoTab;
    }(Controls.BaseControl));
    exports.InfoTab = InfoTab;
    InfoTab.enhance(InfoTab, $(".html-artifact"), {});
    // Notify the parent frame that the host has been loaded
    VSS.notifyLoadSucceeded();
});
