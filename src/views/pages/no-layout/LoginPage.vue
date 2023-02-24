<template>
  <div class="layout light-mode">
    <div class="logo">
      <img src="../../../assets/logo_white.svg" alt="logo"/>
      <span>e-jass</span>
    </div>
    <div class="switch-wrapper" v-if="isLoginMode">
      <div class="welcome">
        <h1>{{ $t('loginPage.createAccount') }}</h1>
        <div class="description">
          {{ $t('loginPage.createAccountInfo') }}
        </div>
        <div class="margin-top">
          <button @click="switchMode">{{ $t('loginPage.createAccountButton') }}</button>
        </div>
      </div>
    </div>
    <div class="switch-wrapper" v-else>
      <div class="welcome">
        <h1>{{ $t('loginPage.welcome') }}</h1>
        <div class="description">
          {{ $t('loginPage.loginInfo') }}
        </div>
        <div class="margin-top">
          <button @click="switchMode">{{ $t('loginPage.loginButton') }}</button>
        </div>
      </div>
    </div>
    <div class="wrapper" v-if="isLoginMode">
      <h1>{{ $t('loginPage.loginButton') }}</h1>
      <div class="input-field">
        <span class="icon fa"><font-awesome-icon icon="envelope"/></span>
        <input @keyup.enter="login" type="text" class="input" v-model="emailOrPseudo" :placeholder="$t('loginPage.emailOrPseudo')">
      </div>
      <div class="input-field">
        <span class="icon fa"><font-awesome-icon icon="lock"/></span>
        <span class="icon fa is-password-revele" @click="onPasswordRevele"><font-awesome-icon icon="eye"/></span>
        <input @keyup.enter="login" :type="passwordRevele" v-model="password" autocomplete="off" class="input"
               :placeholder="$t('loginPage.password')">
      </div>
      <div class="margin-top">
        <button class="primary" @click="login">{{ $t('loginPage.loginButton') }}</button>
      </div>
    </div>
    <div class="wrapper" v-else>
      <h1>{{ $t('loginPage.createAccount') }}</h1>
      <div class="input-field">
        <span class="icon fa"><font-awesome-icon icon="user"/></span>
        <input @keyup.enter="register" type="text" class="input" v-model="pseudo" :placeholder="$t('loginPage.pseudo')">
        <span class="icon fa tooltip-info" :data-text="$t('loginPage.infoDisplayName')"><font-awesome-icon
          icon="question"/></span>
      </div>
      <div class="input-field">
        <span class="icon fa"><font-awesome-icon icon="envelope"/></span>
        <input @keyup.enter="register" type="text" autocomplete="off" class="input" v-model="email" :placeholder="$t('loginPage.email')">
      </div>
      <div class="input-field">
        <span class="icon fa"><font-awesome-icon icon="lock"/></span>
        <span class="icon fa is-password-revele" @click="onPasswordRevele"><font-awesome-icon
          :icon="isPasswordRevele ? 'eye-slash' : 'eye'"/></span>
        <input @keyup.enter="register" :type="passwordRevele" v-model="password" autocomplete="off" class="input"
               :placeholder="$t('loginPage.password')">
      </div>
      <div class="margin-top">
        <button class="primary" @click="register()">{{ $t('loginPage.createAccountButton') }}</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import Utils from '@/utils/Utils';
import store from '@/store';
import { ApplicationResponse } from '@/Types/GlobalType';
import config from '@/config/config';

export default class LoginPage extends Vue {
  isLoginMode = true;
  isPasswordRevele = false

  emailOrPseudo = ''
  pseudo = ''
  email = ''
  password = ''

  mounted () {
    if (!config.isProduction) {
      this.emailOrPseudo = '';
      this.password = '';
    }
  }

  async register () {
    let isValid = true;
    if (this.pseudo === '') {
      isValid = false;
      Utils.toastError('', this.$t('loginPage.errors.emptyPseudo') as string);
    }
    // if (this.email === '' || !Utils.isEmailValid(this.email)) {
    //   isValid = false;
    //   Utils.toastError('', this.$t('loginPage.errors.correctEmail'));
    // }
    if (!Utils.isPasswordValid(this.password)) {
      isValid = false;
      Utils.toastError('', this.$t('loginPage.errors.correctPassword'));
    }
    if (!isValid) return;

    store.dispatch('register', {
      pseudo: this.pseudo,
      email: this.email,
      password: this.password
    }).then((data: ApplicationResponse<any>) => {
      if (data.success && data.data) {
        this.$router.push('/dashboard');
      } else {
        Utils.manageError(data.error!);
      }
    });
  }

  login () {
    store.dispatch('login', {
      username: this.emailOrPseudo,
      password: this.password
    }).then((data: ApplicationResponse<any>) => {
      if (data.success) {
        this.$router.push('/dashboard');
      } else {
        Utils.manageError(data.error!);
      }
    });
  }

  get passwordRevele () {
    return this.isPasswordRevele ? 'text' : 'password';
  }

  onPasswordRevele () {
    this.isPasswordRevele = !this.isPasswordRevele;
    return this.isPasswordRevele;
  }

  switchMode () {
    this.isPasswordRevele = false;
    this.password = '';
    this.isLoginMode = !this.isLoginMode;
  }
}
</script>
<style scoped lang="scss">
@import "@/styles/variables.scss";

.layout {
  width: 70%;
  z-index: 10;
  box-shadow: 0 0 50px 0 rgb(255 255 255 / 10%);
  border-radius: 30px;
  height: 70%;
  position: relative;
  display: flex;

  .logo {
    position: absolute;
    top: 5px;
    z-index: 100;
    left: 10px;
    width: 200px;
    display: flex;
    align-items: center;

    img {
      height: 60px;
      width: 60px;
    }

    span {
      font-weight: bold;
      font-size: 24px;
      color: #fff;
    }
  }

  .switch-wrapper {
    padding: 30px;
    width: 30%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    border-radius: 30px 0 0 30px;
    color: $white;
    background-color: $redSecond;

    .welcome {
      line-height: 30px;

      h1 {
        font-weight: bold;
      }
    }
  }

  .wrapper {
    text-align: center;
    padding: 10px;
    display: flex;
    color: #af2020;
    width: 70%;
    background-color: #414141;
    border-radius: 0 30px 30px 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

@media screen and (max-width: 479px) {
  .layout {
    .logo {
      img {
        height: 35px;
        width: 35px;
      }

      span {
        font-size: 18px;
      }
    }

    .description {
      font-size: 14px;
    }
  }
}
//
@media screen and (min-width: 480px) and (max-width: 599px) {
  .layout {
    height: 90%;
    .logo {
      img {
        height: 40px;
        width: 40px;
      }

      span {
        font-size: 19px;
      }
    }
    .description {
      font-size: 14px;
    }
    .input-field {
      span.icon:not(.tooltip-info) {
        font-size: 15px;
      }
      input.input {
        font-size: 12px;
      }
    }
  }
  .margin-top {
    margin-top: 10px;
  }
  h1 {
    margin-bottom: 0;
    margin-top: 10px;
  }
}

@media screen and (min-width: 600px) and (max-width: 768px) {
  .layout {
    .logo {
      img {
        height: 50px;
        width: 50px;
      }

      span {
        font-size: 20px;
      }
    }

    .description {
      font-size: 14px;
    }
  }
}

@media screen and (min-width: 768px) and (max-width: 899px) {
  .description {
    font-size: 14px;
  }
}

@media screen and (min-width: 900px) and (max-width: 1100px) {
  .description {
    font-size: 14px;
  }
}
</style>
