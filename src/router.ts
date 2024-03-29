import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/pages/dashboard-layout/HomePage.vue';
import AdminIdeasPage from '@/views/pages/dashboard-layout/AdminIdeasPage.vue';
import ProfilePage from '@/views/pages/dashboard-layout/ProfilePage.vue';
import IdeasPage from '@/views/pages/dashboard-layout/IdeasPage.vue';
import AboutUsPage from '@/views/pages/dashboard-layout/AboutUsPage.vue';
import ContactUsPage from '@/views/pages/dashboard-layout/ContactUsPage.vue';
import NoLayout from '@/views/layouts/NoLayout.vue';
import LoginPage from '@/views/pages/no-layout/LoginPage.vue';
import ResetPasswordPage from '@/views/pages/no-layout/ResetPasswordPage.vue';
import VerifiedAccountPage from '@/views/pages/no-layout/VerifiedAccountPage.vue';
import { Permission } from '@/permissions';
import NotFoundPage from '@/views/pages/no-layout/NotFoundPage.vue';
import DashboardLayout from '@/views/layouts/DashboardLayout.vue';
import AclManager from '@/AclManager';
import PlayLayout from '@/views/layouts/PlayLayout.vue';
import store from '@/store';
import { ApplicationResponse, UserRoles } from '@/Types/GlobalType';
import Utils from '@/utils/Utils';
import moment from 'moment';

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
        path: 'contact-us',
        name: 'contact-us',
        component: ContactUsPage,
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
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfilePage,
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
        path: '/reset-password/:token?',
        name: 'reset-password',
        component: ResetPasswordPage,
        meta: {
          permission: Permission.specialState.userLoggedOff
        }
      },
      {
        path: '/verified-account/:token',
        name: 'verified-account',
        component: VerifiedAccountPage,
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

router.beforeEach(async function (to, from, next) {
  const {
    isAllowed,
    redirectionRoute
  } = AclManager.hasUserAccessToPermission(
    to.meta.permission as string
  );

  document.title = 'E-Jass';

  let isFinish = false;
  if (!(to.meta.permission === Permission.specialState.userLoggedOff ||
    to.meta.permision === Permission.specialState.allowAll)) {
    const logoutTime = sessionStorage.getItem('logout-time');
    if (moment().diff(logoutTime) > 0) {
      await store.dispatch('logout');
      isFinish = true;
    }
  }

  if (!isFinish) {
    // next();
    if (isAllowed) {
      next();
    } else {
      next(redirectionRoute as string);
    }
  } else {
    next('/login');
  }
});
export default router;
