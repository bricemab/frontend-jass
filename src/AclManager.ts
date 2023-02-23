import { Permission } from '@/permissions';
import store from '@/store';
import { RolesAllowedPermissions } from '@/rolesPermissions';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Role } from '@/roles';

export default class AclManager {
  public static hasUserAccessToPermission (routeRequiredPermission: string): {
    isAllowed: boolean;
    redirectionRoute: string | undefined;
  } {
    let hasPermission = false;
    let redirectionRoute: string | undefined = '';
    const userRole: string = store.getters.getRole;

    // Les routes spéciales sont gérées à part
    if (
      routeRequiredPermission &&
      routeRequiredPermission.includes('specialState.')
    ) {
      switch (routeRequiredPermission) {
        case Permission.specialState.redirectToHome:
          hasPermission = false;
          switch (userRole) {
            case Role.USER_LOGGED:
            case Role.USER_ADMIN:
              redirectionRoute = '/dashboard';
              break;
            default:
              redirectionRoute = '/dashboard';
          }

          break;
        case Permission.specialState.allowAll:
          hasPermission = true;
          break;
        case Permission.specialState.userLoggedIn:
          if (store.getters.isLoggedIn) {
            hasPermission = true;
          } else {
            redirectionRoute = '/login';
          }
          break;
        case Permission.specialState.userLoggedOff:
          if (!store.getters.isLoggedIn) {
            hasPermission = true;
          } else {
            redirectionRoute = '/redirect';
          }
          break;
        default:
          Error('Unkwown special permission, please specify it');
      }
    } else {
      // Toutes les permissions
      if (
        Object.prototype.hasOwnProperty.call(RolesAllowedPermissions, userRole)
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const userPermissions: (string | Object)[] =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          RolesAllowedPermissions[userRole];

        userPermissions.forEach(function (userPermission) {
          if (typeof userPermission === 'object') {
            if (
              Object.values(userPermission).includes(routeRequiredPermission)
            ) {
              hasPermission = true;
            }
          } else {
            if (userPermission === routeRequiredPermission) {
              hasPermission = true;
            }
          }
        });
      } else {
        Error('This role must be declared in permissions');
      }
    }

    return {
      isAllowed: hasPermission,
      redirectionRoute
    };
  }
}
