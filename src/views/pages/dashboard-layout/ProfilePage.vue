<template>
  <div class="profile" v-if="user !== null">
    <div class="profile-picture">
      <div class="picture">
        <span v-if="user.profilePath === null" class="icon fa item-icon"><font-awesome-icon icon="user"/></span>
        <img class="current-picture" v-else :src="profilePath" alt="profile picture"/>
        <label class="edit-picture icon fa item-icon" for="picture">
          <font-awesome-icon icon="pen"/>
          <input id="picture" capture="user" style="display: none" @change="uploadPicture" ref="file" type="file" accept="image/*" />
        </label>
      </div>
      <div class="pseudo">{{ user.pseudo }}</div>
    </div>
    <div class="form-profile">
      <div class="input-field is-label max-width validation">
        <span v-if="pseudoValidation === stateValidation.ERROR" class="check-error icon fa"><font-awesome-icon icon="xmark"/></span>
        <span v-if="pseudoValidation === stateValidation.VALID" class="check-valid icon fa"><font-awesome-icon icon="check"/></span>
        <label>{{$t('dashboard.profile.pseudo')}} * &nbsp;<span style="font-size: 10px;">({{pseudo.length + '/ 20'}})</span></label>
        <input type="text" class="input is-light max-width" v-model="pseudo" v-on:input="validPseudoLenght" v-on:change="validPseudo" :placeholder="$t('dashboard.profile.pseudo')">
      </div>
      <div class="input-field is-label max-width validation">
        <span v-if="emailValidation === stateValidation.ERROR" class="check-error icon fa"><font-awesome-icon icon="xmark"/></span>
        <span v-if="emailValidation === stateValidation.VALID" class="check-valid icon fa"><font-awesome-icon icon="check"/></span>
        <label>{{$t('dashboard.profile.email')}}</label>
        <input type="text" class="input is-light max-width" v-model="email" v-on:change="validEmail" :placeholder="$t('dashboard.profile.email')">
      </div>
      <div class="input-field is-label max-width">
        <label>{{$t('dashboard.profile.password')}}</label>
        <input type="text" class="input is-light max-width" v-model="password" @change="validatePassword" :placeholder="$t('dashboard.profile.password')">
      </div>
      <div class="input-field is-label max-width">
        <label>{{$t('dashboard.profile.confirmPassword')}}</label>
        <input type="text" class="input is-light max-width" v-model="confirmPassword" @change="validatePassword" :placeholder="$t('dashboard.profile.confirmPassword')">
      </div>
      <div class="send">
        <button class="primary is-small" @click="sendForm">{{$t('dashboard.profile.saveBtn')}}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import DashboardLayout from '@/views/layouts/DashboardLayout.vue';
import { STATE_VALIDATION, UserType } from '@/Types/GlobalType';
import store from '@/store';
import Utils from '@/utils/Utils';
import config from '@/config/config';

@Options({
  components: { DashboardLayout }
})
export default class ProfilePage extends Vue {
  public user: UserType | null = null;
  public pseudo = '';
  public email = '';
  public password = '';
  public confirmPassword = '';
  public profilePicture: null | File = null;
  public emailValidation = STATE_VALIDATION.HIDE;
  public pseudoValidation = STATE_VALIDATION.HIDE;

  public validPseudoLenght () {
    this.pseudo = this.pseudo.slice(0, 20);
  }

  public async uploadPicture () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.profilePicture = this.$refs.file.files[0];
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formData.append('profile', this.profilePicture);
    const response = await Utils.postEncodedToBackend(
      '/users/new-profile-picture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-user-token': sessionStorage.getItem('token')
        }
      },
      true
    );
    this.profilePicture = null;
    if (!response.success) {
      return Utils.toastError('', Utils.translate('dashboard.profile.errorMessages.error'));
    }
    await store.dispatch('updateProfilePicture', response.data.location);
  }

  public validatePassword () {
    if (!Utils.isPasswordValid(this.password)) {
      return Utils.toastError('', this.$t('loginPage.errors.correctPassword'));
    }

    if (this.password !== this.confirmPassword) {
      return Utils.toastError('', Utils.translate('resetPasswordPage.errorMessages.notSame'));
    }
  }

  public async validEmail () {
    this.emailValidation = STATE_VALIDATION.HIDE;
    if (this.email.trim() === '') {
      return Utils.toastError('', Utils.translate('dashboard.profile.errorMessages.emailEmpty'));
    }
    const response = await Utils.postEncodedToBackend('/users/valid-email', {
      email: this.email
    });
    await Utils.createTimeOut(100);
    if (store.getters.user.email === this.email) {
      this.emailValidation = STATE_VALIDATION.VALID;
    } else {
      if (!response.success && !response.data) {
        this.emailValidation = STATE_VALIDATION.ERROR;
      } else {
        this.emailValidation = STATE_VALIDATION.VALID;
      }
    }
  }

  public async validPseudo () {
    this.pseudoValidation = STATE_VALIDATION.HIDE;
    if (this.pseudo.trim() === '') {
      return Utils.toastError('', Utils.translate('dashboard.profile.errorMessages.pseudoEmpty'));
    }
    const response = await Utils.postEncodedToBackend('/users/valid-pseudo', {
      pseudo: this.pseudo
    });
    await Utils.createTimeOut(100);
    if (store.getters.user.pseudo === this.pseudo) {
      this.pseudoValidation = STATE_VALIDATION.VALID;
    } else {
      if (!response.success && !response.data) {
        this.pseudoValidation = STATE_VALIDATION.ERROR;
      } else {
        this.pseudoValidation = STATE_VALIDATION.VALID;
      }
    }
  }

  public async sendForm () {
    if (!Utils.isPasswordValid(this.password)) {
      return Utils.toastError('', this.$t('loginPage.errors.correctPassword'));
    }
    if (this.password !== this.confirmPassword) {
      return Utils.toastError('', Utils.translate('resetPasswordPage.errorMessages.notSame'));
    }

    const response = await Utils.postEncodedToBackend('/users/edit-profile', {
      password: this.password,
      pseudo: this.pseudo,
      email: this.email
    });

    if (!response.success && !response.data) {
      return Utils.toastError('', Utils.translate('dashboard.profile.errorMessages.error'));
    }
    if (store.getters.user.email !== this.email) {
      Utils.toastInfo('', Utils.translate('dashboard.profile.infoEmailChange'));
    }
    Utils.toastSuccess('', Utils.translate('dashboard.profile.success'));
    const user:UserType = {
      ...store.getters.user
    };
    user.pseudo = this.pseudo;
    user.email = this.email;
    await store.dispatch('updateUser', user);
  }

  mounted () {
    this.user = store.getters.user;
    if (this.user !== null) {
      this.email = this.user.email;
      this.pseudo = this.user.pseudo;
    }
  }

  get stateValidation () {
    return STATE_VALIDATION;
  }

  get profilePath () {
    if (config.isProduction) {
      return 'https://live.e-jass.ch/profile-pictures/' + this.user?.profilePath;
    } else {
      // return require('@/../../' + config.isProduction ? 'rest-jass' : 'jass-backend' + '/data/profile-pictures/' + this.user?.profilePath);
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.dashboard-wrapper:has(.profile) {
  .validation {
    position: relative;
    .check-valid {
      position: absolute;
      right: 0 !important;
      left: inherit;
      bottom: 0;
      top: initial;
      color: green;
      font-weight: bold;
    }
    .check-error {
      position: absolute;
      right: 0 !important;
      left: inherit;
      bottom: 0;
      top: initial;
      color: $red;
    }
  }
  .send {
    text-align: right;
    margin-top: 10px;
  }
  .profile {
    padding: 20px;
    width: 700px;
    .profile-picture {
      margin: 20px;
      display: flex;
      gap: 30px;
      align-items: center;
      .picture {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        width: 50px;
        background: white;
        padding: 15px;
        border-radius: 50%;
        color: $grey;
        .icon {
          font-size: 50px;
        }
        .edit-picture {
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: 11px;
          background: $redSecond;
          padding: 7px;
          border-radius: 50%;
          color: white;
          cursor: pointer;
        }
      }
      .picture:has(.current-picture) {
        height: 80px;
        width: 80px;
        background: initial;
        padding: 0;
        img {
          width: 100%;
          height: 100%;
          object-fit:cover;
          object-position:50% 50%;
          border-radius: 50%;
        }
      }
      .pseudo {
        font-size: 27px;
        font-weight: bold;
      }
    }
    .form-profile {
      margin: 0 30px;
      .input {
        width: calc(100% - 20px);
      }
    }
  }
}

@media screen and (max-width: 700px) {
  .dashboard-wrapper:has(.profile) {
    .profile {
      padding: 0;
      width: initial;
      .profile-picture {
        margin: 20px 0;
      }
      .form-profile {
        margin: 0;
      }
    }
  }
}

</style>
