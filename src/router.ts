import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/pages/dashboard-layout/HomePage.vue';
import AdminIdeasPage from '@/views/pages/dashboard-layout/AdminIdeasPage.vue';
import IdeasPage from '@/views/pages/dashboard-layout/IdeasPage.vue';
import AboutUsPage from '@/views/pages/dashboard-layout/AboutUsPage.vue';
import NoLayout from '@/views/layouts/NoLayout.vue';
import LoginPage from '@/views/pages/no-layout/LoginPage.vue';
import { Permission } from '@/permissions';
import NotFoundPage from '@/views/pages/no-layout/NotFoundPage.vue';
import DashboardLayout from '@/views/layouts/DashboardLayout.vue';
import AclManager from '@/AclManager';
import PlayLayout from '@/views/layouts/PlayLayout.vue';
import store from '@/store';
import { UserRoles } from '@/Types/GlobalType';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
        meta: {
          permission: Permission.specialState.userLoggedIn
        }
      },
      {
        path: 'about-us',
        name: 'about-us',
        component: AboutUsPage,
        meta: {
          permission: Permission.specialState.userLoggedIn
        }
      },
      {
        path: 'ideas',
        name: 'ideas',
        // eslint-disable-next-line no-constant-condition
        component: store.getters.userRole === UserRoles.USER_ADMIN && false ? AdminIdeasPage : IdeasPage,
        meta: {
          permission: Permission.specialState.userLoggedIn
        }
      }
    ]
  },
  {
    path: '/game',
    component: PlayLayout,
    meta: {
      permission: Permission.specialState.userLoggedIn
    }
  },
  {
    path: '/',
    component: NoLayout,
    children: [
      {
        path: '/',
        redirect: '/login'
      },
      {
        path: '/redirect',
        name: 'root',
        component: LoginPage,
        meta: {
          permission: Permission.specialState.redirectToHome
        }
      },
      {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: {
          permission: Permission.specialState.userLoggedOff
        }
      },
      {
        path: '/*',
        name: 'not-found',
        component: NotFoundPage,
        meta: {
          permission: Permission.specialState.allowAll
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active-link'
});

router.beforeEach(function (to, from, next) {
  const {
    isAllowed,
    redirectionRoute
  } = AclManager.hasUserAccessToPermission(
    to.meta.permission as string
  );

  // next();
  if (isAllowed) {
    next();
  } else {
    next(redirectionRoute as string);
  }
});
export default router;
