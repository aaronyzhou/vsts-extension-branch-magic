/// <reference types="vss-web-extension-sdk" />
import { getClient } from "TFS/VersionControl/GitRestClient";
import { GitVersionType, GitVersionOptions, GitBaseVersionDescriptor, GitTargetVersionDescriptor, GitCommitDiffs, GitPullRequest, GitPullRequestCompletionOptions, PullRequestStatus, PullRequestAsyncStatus } from "TFS/VersionControl/Contracts";
import { IdentityRef } from "VSS/WebApi/Contracts";
import { delay } from "VSS/Utils/Core";

const actionProvider = {
    getMenuItems: (context) => {
        return [<IContributedMenuItem>{
            icon: "fabric://Merge",
            title: "Merge Master",
            action: (actionContext) => {
                console.log(actionContext);

                // If we are calling from the files page
                if (actionContext.getSourceItemContext) {
                    actionContext.getSourceItemContext().then((a) => {
                        const repoId = a.gitRepository.id;
                        const branch = `refs/heads/${a.version}`;
                        makePullRequest(repoId, branch);
                    });
                } else {
                    const repoId = actionContext.pullRequest.repositoryId;
                    const branch = actionContext.pullRequest.sourceRefName;
                    makePullRequest(repoId, branch);
                }
            }
        }];
    }
};

const makePullRequest = (repoId: string, sourceRefName: string) => {
    const webContext = VSS.getWebContext();
    const identityRef: IdentityRef = {
        id: webContext.user.id
    } as IdentityRef;

    const completionOptions: GitPullRequestCompletionOptions = {
        bypassPolicy: true,
        bypassReason: "merge master",
        deleteSourceBranch: false,
        mergeCommitMessage: "merge master",
        squashMerge: true
    };

    const pullReq: GitPullRequest = {
        autoCompleteSetBy: identityRef,
        description: "merge master",
        sourceRefName: "refs/heads/master",
        targetRefName: sourceRefName,
        completionOptions: completionOptions,
        title: "merge master"
    } as GitPullRequest;
    getClient().createPullRequest(pullReq, repoId, null, false, false).then((value: GitPullRequest) => {
        pollMergeStatus(value);
    });
};

const pollMergeStatus = (pullReq: GitPullRequest) => {
    getClient().getPullRequest(pullReq.repository.id, pullReq.pullRequestId).then((pr: GitPullRequest) => {
        if (pr.mergeStatus === PullRequestAsyncStatus.Succeeded) {
            const completeStatus: GitPullRequest = {
                lastMergeSourceCommit: pr.lastMergeSourceCommit,
                status: PullRequestStatus.Completed
            } as GitPullRequest;
            getClient().updatePullRequest(completeStatus, pr.repository.id, pr.pullRequestId);
        } else if (pr.mergeStatus === PullRequestAsyncStatus.NotSet || pr.mergeStatus === PullRequestAsyncStatus.Queued) {
            delay(this, 100, pollMergeStatus, [pr]);
        } else {
            alert("error");
            return;
        }
    });
};

// Register context menu action provider
VSS.register(VSS.getContribution().id, actionProvider);