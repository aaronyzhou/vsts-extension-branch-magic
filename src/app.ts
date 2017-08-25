 /// <reference types="vss-web-extension-sdk" />

const actionProvider = {
    getMenuItems: (context) => {
        return [<IContributedMenuItem>{
            icon: "fabric://BranchMerge",
            title: "Merge Master",
            action: (actionContext) => {
                console.log("hi");
            }
        }];
    }
};

// Register context menu action provider
VSS.register(VSS.getContribution().id, actionProvider);