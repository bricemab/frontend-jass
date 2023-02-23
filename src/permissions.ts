export const Permission = {
  specialState: {
    redirectToHome: 'specialState.redirectToHome',
    allowAll: 'specialState.allowAll',
    userLoggedIn: 'specialState.userLoggedIn',
    userLoggedOff: 'specialState.userLoggedOff'
  },
  workspacesManager: {
    viewList: 'workspacesManager.viewList',
    create: 'workspacesManager.create',
    edit: 'workspacesManager.edit',
    delete: 'workspacesManager.delete',
    switchService: 'workspacesManager.switchService',
    editPassword: 'workspacesManager.editPassword',
    import: 'workspacesManager.import',
    exportCreationWorkspaces: 'workspacesManager.exportCreationWorkspaces'
  },
  mgmtUsersManager: {
    viewList: 'mgmtUsersManager.viewList',
    disabledTwoFa: 'mgmtUsersManager.disabledTwoFa',
    create: 'mgmtUsersManager.create'
  },
  statisticsManager: {
    viewList: 'statisticsManager.viewList'
  },
  devicesManager: {
    viewList: 'devicesManager.viewList'
  }
};
