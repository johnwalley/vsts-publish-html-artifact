/// <reference path='../typings/main.d.ts' />

import Controls = require("VSS/Controls");
import VSS_Service = require("VSS/Service");
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Extension_Contracts = require("TFS/Build/ExtensionContracts");
import DT_Client = require("TFS/DistributedTask/TaskRestClient");

export class InfoTab extends Controls.BaseControl {
  constructor() {
    super();
  }

  public initialize(): void {
    super.initialize();
    // Get configuration that's shared between extension and the extension host
    var sharedConfig: TFS_Build_Extension_Contracts.IBuildResultsViewExtensionConfig = VSS.getConfiguration();
    var vsoContext = VSS.getWebContext();
    if (sharedConfig) {
      // register your extension with host through callback
      sharedConfig.onBuildChanged((build: TFS_Build_Contracts.Build) => {
        this._initBuildInfo(build);

				/*
				* If any task uploaded some data using ##vso[task.addattachment] (https://github.com/Microsoft/vso-agent-tasks/blob/master/docs/authoring/commands.md)
				* Then you could consume the data using taskclient
				* sample code -
				*/
        var taskClient = DT_Client.getClient();
        taskClient.getPlanAttachments(vsoContext.project.id, "build", build.orchestrationPlan.planId, "Distributedtask.Core.Summary").then((taskAttachments) => {
          if (taskAttachments.length == 0) {
            var element = $("<div />");

            var errorText = "No HTML artifact is available";

            element.html("<p>" + errorText + "</p>");
            this._element.append(element);
          } else {
            $.each(taskAttachments, (index, taskAttachment) => {
              if (taskAttachment._links && taskAttachment._links.self && taskAttachment._links.self.href) {
                var link = taskAttachment._links.self.href;
                var attachmentName = taskAttachment.name;
                // do some thing here

                taskClient.getAttachmentContent(vsoContext.project.id, "build", build.orchestrationPlan.planId, taskAttachment.timelineId, taskAttachment.recordId, "Distributedtask.Core.Summary", taskAttachment.name).then((attachmentContent) => {
                  var element = $("<div />");

                  var text = String.fromCharCode.apply(null, new Uint8Array(attachmentContent));
                  element.html(text);
                  this._element.append(element);
                })
              }
            });
          }
        }, function() {
            var element = $("<div />");

            var errorText = "No HTML artifact is available";

            element.html("<p>" + errorText + "</p>");
            this._element.append(element);
          });
      });
    }
  }

  private _initBuildInfo(build: TFS_Build_Contracts.Build) {

  }
}

InfoTab.enhance(InfoTab, $(".html-artifact"), {});

// Notify the parent frame that the host has been loaded
VSS.notifyLoadSucceeded();
