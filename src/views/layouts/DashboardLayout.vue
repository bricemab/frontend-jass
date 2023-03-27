<template>
  <div class="dashboard-navbar" v-if="user !== null">
    <router-link class="logo" to="/">
      <img src="../../assets/logo_white.svg" alt="logo"/>
      <span>e-jass</span>
    </router-link>
    <div :class="menuClass">
      <router-link @click="closeMenu" to="/dashboard">{{ $t('dashboard.navbar.play') }}</router-link>
      <router-link @click="closeMenu" to="/dashboard/ideas">{{ $t('dashboard.navbar.ideas') }}</router-link>
<!--      <router-link @click="closeMenu" v-on:click="tournamentDisabled" to="/dashboard/tournaments">{{ $t('dashboard.navbar.tournaments') }}</router-link>-->
<!--      <router-link @click="closeMenu" to="/dashboard/about-us">{{ $t('dashboard.navbar.aboutUs') }}</router-link>-->
      <router-link @click="closeMenu" to="/dashboard/contact-us">{{ $t('dashboard.navbar.contactUs') }}</router-link>
      <div :class="isProfilOpen ? 'dropdown open' : 'dropdown'" @click="isProfilOpen = !isProfilOpen">
        <div class="parent">
          <span class="picture">
            <span v-if="user && user.profilePath === null" class="default-profile icon fa item-icon"><font-awesome-icon icon="user"/></span>
            <img class="current-picture" v-else :src="profilePath" alt="profile picture"/>
            Profile
          </span>
          <span class="icon fa item-icon"><font-awesome-icon icon="play"/></span>
        </div>
        <div class="items" @click="closeMenu">
          <router-link @click="closeMenu" to="/dashboard/profile">{{ $t('dashboard.navbar.profile') }}</router-link>
          <a @click="logout" href="#">{{ $t('dashboard.navbar.logOff') }}</a>
        </div>
      </div>

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
import { ApplicationResponse, UserType } from '@/Types/GlobalType';
import Utils from '@/utils/Utils';
import moment from 'moment';
import config from '@/config/config';

export default class DashboardLayout extends Vue {
  public isMenuOpen = false
  public isProfilOpen = false
  public user: UserType | null = null;

  mounted () {
    this.user = store.getters.user;
  }

  get profilePath () {
    if (config.isProduction) {
      return 'https://live.e-jass.ch/profile-pictures/' + this.user?.profilePath;
    } else {
      return require('@/../../' + config.isProduction ? 'rest-jass' : 'jass-backend' + '/data/profile-pictures/' + this.user?.profilePath);
    }
  }

  public openCloseMenuAction () {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenu () {
    this.isMenuOpen = false;
    this.isProfilOpen = false;
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

<style scoped lang="scss">
@import "@/styles/variables.scss";
.dashboard-navbar {
  .picture {
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
      position: relative;
      height: 20px;
      width: 20px;
      background: white;
      padding: 5px;
      border-radius: 50%;
      color: $grey;
      rotate: initial;
      font-size: 13px;
    }
    .default-profile > *{
      rotate: 0deg !important;
    }
  }
  .picture:has(.current-picture) {
    height: initial;
    width: initial;
    background: initial;
    padding: 0;
    color: white;
    img {
      margin-right: 5px;
      height: 30px;
      width: 30px;
      object-fit:cover;
      object-position:50% 50%;
      border-radius: 50%;
    }
  }
}
@media screen and (min-width: 480px) and (max-width: 599px) {
  .dropdown {
    display: flex;
    align-items: baseline !important;
    flex-direction: column !important;
    justify-content: center;
    background-color: $redSecond;
    &:hover {
      color: inherit !important;
      font-weight: inherit !important;
      background-color: inherit !important;
      background-position: inherit !important;
    }
    &.open {
      padding: 15px !important;
      height: 30% !important;
      justify-content: initial !important;
    }
    .items {
      margin-top: 5px;
      height: calc(100% - 10px);
      width: 100%;
      position: initial !important;
      background-color: initial !important;
      display: flex;
      align-items: baseline;
      flex-direction: column;
      a {
        padding: 8px 20px !important;
        height: 100% !important;
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .dropdown {
    .items {
      width: 100% !important;
      background: #9b1515 !important;
      height: calc(100% + 40px) !important;
    }
  }
}
</style>
