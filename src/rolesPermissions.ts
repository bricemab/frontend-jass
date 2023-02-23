import { Permission } from '@/permissions';

export const RolesAllowedPermissions = {
  USER_LOGGED: [
    Permission.workspacesManager.viewList,
    Permission.workspacesManager.delete,
    Permission.workspacesManager.switchService,
    Permission.workspacesManager.create,
    Permission.workspacesManager.edit,
    Permission.workspacesManager.editPassword,
    Permission.workspacesManager.import,
    Permission.mgmtUsersManager.viewList,
    Permission.mgmtUsersManager.create,
    Permission.statisticsManager.viewList,
    Permission.workspacesManager.exportCreationWorkspaces
  ],
  USER_ADMIN: [
    Permission.workspacesManager,
    Permission.devicesManager,
    Permission.mgmtUsersManager,
    Permission.statisticsManager
  ],
  USER_ANONYMOUS: []
};
