<template>
  <div class="verified-account">
    <div class="logo">
      <img src="../../../assets/logo_white.svg" alt="logo"/>
      <span>e-jass</span>
    </div>
    <h2 v-if="isLoading">{{$t('verifiedAccount.title')}}</h2>
    <h2 v-else>{{$t('verifiedAccount.complete')}}</h2>
    <div class="loader-verify">
      <Loader v-if="isLoading" :msg="loaderMsg"/>
    </div>
    <router-link v-if="!isLoading" to="/login" class="back">{{ $t('verifiedAccount.redirect') }}...</router-link>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Utils from '@/utils/Utils';
import Loader from '@/views/LoaderStatic.vue';

@Options({
  components: {
    Loader
  }
})
export default class VerifiedAccountPage extends Vue {
  public isLoading = true;
  public loaderMsg = Utils.translate('verifiedAccount.verifyInProgress') + '...';

  async mounted () {
    await this.verifyAccountToken();
  }

  async verifyAccountToken () {
    const verifyResponse = await Utils.postEncodedToBackend('/users/verify-account-token', {
      token: this.$route.params.token as string
    });
    await Utils.createTimeOut(2000);
    this.isLoading = false;
    await Utils.createTimeOut(2000);
    this.$router.push('/login');
  }
}
</script>

<style lang="scss">
  @import "@/styles/variables.scss";

  .container:has(> .verified-account) {
    z-index: 999;
    position: relative;
    .loader-verify {
      text-align: center;
    }
    .verified-account {
      background-color: $secondBg;
      padding: 30px 50px;
      border-radius: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 60px;
        }
        span {
          font-size: 30px;
          font-weight: bold;
        }
      }
      .back {
        color: $primaryText;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  @media screen and (max-width: 700px) {
    .verified-account {
      padding: 20px 0!important;
      width: calc(100% - 50px);
      .primary {
        width: 100%;
      }
      .margin-top {
        margin-top: 10px;
        margin-bottom: 5px;
      }
    }
  }
</style>
