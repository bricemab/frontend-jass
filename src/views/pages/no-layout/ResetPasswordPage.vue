<template>
  <div class="reset-password" v-if="this.token.trim() === ''">
    <div class="logo">
      <img src="../../../assets/logo_white.svg" alt="logo"/>
      <span>e-jass</span>
    </div>
    <h2>{{$t('loginPage.forgetPassword')}}</h2>
    <div class="input-field">
      <span class="icon fa"><font-awesome-icon icon="envelope"/></span>
      <input type="text" class="input" v-model="emailOrPseudo" :placeholder="$t('loginPage.emailOrPseudo')">
    </div>
    <div class="margin-top" >
      <button class="primary" @click="sendMail">{{ $t('resetPasswordPage.sendMail') }}</button>
    </div>
    <router-link to="/login" class="margin-top back">{{ $t('resetPasswordPage.back') }}</router-link>
    <div class="margin-top message">{{message}}</div>
  </div>
  <div class="reset-password" v-else>
    <div class="logo">
      <img src="../../../assets/logo_white.svg" alt="logo"/>
      <span>e-jass</span>
    </div>
    <h2>{{$t('resetPasswordPage.changePassword')}}</h2>
    <div class="input-field">
      <span class="icon fa"><font-awesome-icon icon="lock"/></span>
      <span class="icon fa is-password-revele" @click="onPasswordRevele"><font-awesome-icon
        :icon="isPasswordRevele ? 'eye-slash' : 'eye'"/></span>
      <input @keyup.enter="register" :type="passwordRevele" v-model="password" autocomplete="off" class="input"
             :placeholder="$t('resetPasswordPage.password')">
    </div>
    <div class="input-field">
      <span class="icon fa"><font-awesome-icon icon="lock"/></span>
      <input type="password" class="input" v-model="repeatPassword" :placeholder="$t('resetPasswordPage.confirmPassword')">
    </div>
    <div class="margin-top" >
      <button class="primary" @click="changePassword">{{ $t('resetPasswordPage.editPassword') }}</button>
    </div>
    <router-link to="/login" class="margin-top back">{{ $t('resetPasswordPage.back') }}</router-link>
    <div class="margin-top message">{{message}}</div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import Utils from '@/utils/Utils';

export default class ResetPasswordPage extends Vue {
  public emailOrPseudo = '';
  public message = '';
  public token = '';
  public repeatPassword = '';
  public password = '';
  public isPasswordRevele = false;

  async mounted () {
    this.token = this.$route.params.token as string;
    if (this.token.trim() !== '') {
      await this.verifyResetPasswordToken();
    }
  }

  async verifyResetPasswordToken () {
    const verifyResponse = await Utils.postEncodedToBackend('/users/verify-reset-password-token', {
      token: this.token
    });
    if (!verifyResponse.success && !verifyResponse.data) {
      sessionStorage.clear();
      this.$router.push('/login');
    }
  }

  get passwordRevele () {
    return this.isPasswordRevele ? 'text' : 'password';
  }

  onPasswordRevele () {
    this.isPasswordRevele = !this.isPasswordRevele;
    return this.isPasswordRevele;
  }

  async changePassword () {
    let isValid = true;
    if (!Utils.isPasswordValid(this.password)) {
      isValid = false;
      Utils.toastError('', this.$t('loginPage.errors.correctPassword'));
    }
    if (this.password !== this.repeatPassword) {
      isValid = false;
      Utils.toastError('', Utils.translate('resetPasswordPage.errorMessages.notSame'));
      return false;
    }
    if (!isValid) return false;

    const resetPasswordResponse = await Utils.postEncodedToBackend('/users/reset-password', {
      token: this.token,
      password: this.password
    });
    if (resetPasswordResponse.success) {
      Utils.toastSuccess('', Utils.translate('resetPasswordPage.successResetPassword'));
      this.$router.push('/login');
    } else {
      Utils.toastSuccess('', Utils.translate('resetPasswordPage.errorMessages.expired'));
    }
  }

  async sendMail () {
    if (this.emailOrPseudo.trim() === '') {
      Utils.toastError('', Utils.translate('resetPasswordPage.errorMessages.empty'));
      return false;
    }
    this.message = Utils.translate('resetPasswordPage.verify') + '...';
    const resetPasswordResponse = await Utils.postEncodedToBackend('/users/ask-reset-password',
      {
        emailOrPseudo: this.emailOrPseudo
      }
    );
    if (!resetPasswordResponse.success && !resetPasswordResponse.data) {
      Utils.toastError('', Utils.translate('resetPasswordPage.errorMessages.notFound'));
      this.message = '';
      return false;
    }
    this.message = Utils.translate('resetPasswordPage.mailSent');
  }
}
</script>

<style lang="scss">
  @import "@/styles/variables.scss";

  .container:has(> .reset-password) {
    z-index: 999;
    position: absolute;
    .reset-password {
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
    .reset-password {
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
