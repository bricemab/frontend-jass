<template>
  <div class="dashboard-navbar">
    <router-link class="logo" to="/">
      <img src="../../assets/logo_white.svg" alt="logo"/>
      <span>e-jass</span>
    </router-link>
    <div :class="menuClass">
      <router-link @click="closeMenu" to="/dashboard">{{ $t('dashboard.navbar.play') }}</router-link>
      <router-link @click="closeMenu" to="/dashboard/ideas">{{ $t('dashboard.navbar.ideas') }}</router-link>
      <router-link @click="closeMenu" v-on:click="tournamentDisabled" to="/dashboard/tournaments">{{ $t('dashboard.navbar.tournaments') }}</router-link>
      <router-link @click="closeMenu" to="/dashboard/about-us">{{ $t('dashboard.navbar.aboutUs') }}</router-link>
      <router-link @click="closeMenu" to="/dashboard/contact-us">{{ $t('dashboard.navbar.contactUs') }}</router-link>
      <router-link @click="closeMenu" to="/profile">{{ $t('dashboard.navbar.profile') }}</router-link>
      <a @click="logout" href="#">{{ $t('dashboard.navbar.logOff') }}</a>
    </div>
    <div :class="openCloseMenu" @click="openCloseMenuAction()">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div :class="dashboardClass" @click="closeMenu">
    <div class="black-opacity" :style="isMenuOpen ? 'display: block' : 'display: none'"></div>
    <router-view/>
  </div>
  <div class="footer">
    © Copyright {{ date }} e-jass.
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import store from '@/store';
import { ApplicationResponse } from '@/Types/GlobalType';
import Utils from '@/utils/Utils';
import moment from 'moment';
import config from '@/config/config';

export default class DashboardLayout extends Vue {
  public isMenuOpen = false

  public openCloseMenuAction () {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenu () {
    this.isMenuOpen = false;
  }

  public logout () {
    store.dispatch('logout').then((data: ApplicationResponse<any>) => {
      this.$router.push('/login');
    });
  }

  public tournamentDisabled () {
    if (!config.settings.isTournamentsEnabled) {
      Utils.toastInfo('', Utils.translate('dashboard.disabledModules.tournaments'));
    }
  }

  get dashboardClass () {
    return this.isMenuOpen ? 'dashboard-wrapper menu-open' : 'dashboard-wrapper';
  }

  get menuClass () {
    return this.isMenuOpen ? 'menu open' : 'menu';
  }

  get openCloseMenu () {
    return this.isMenuOpen ? 'close-open-menu open' : 'close-open-menu';
  }

  get date () {
    return moment().format('YYYY');
  }
}
</script>

<style scoped>

</style>
