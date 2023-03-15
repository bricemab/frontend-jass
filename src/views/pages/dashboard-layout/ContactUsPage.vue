<template>
  <img v-if="!isLoaded" src="https://www.pngmart.com/files/21/Instagram-Logo-PNG-HD.png" style="display: none" @load="isLoadedImg"/>
  <div v-if="isLoaded">
    <h1>{{$t('dashboard.navbar.contactUs')}}</h1>
    <div class="info">{{$t('dashboard.contactUs.availability')}}</div>
    <div class="contact-form">
      <div class="input-field is-label max-width">
        <label>{{$t('dashboard.ideas.form.object')}} * <span style="font-size: 10px;">({{object.length}} / 255)</span></label>
        <input type="text" class="input is-light max-width" v-model="object" v-on:input="validObjectLenght" :placeholder="$t('dashboard.ideas.form.object')">
      </div>
      <div class="input-field max-width is-label">
        <label>{{$t('dashboard.ideas.form.content')}} *</label>
        <textarea  :placeholder="$t('dashboard.ideas.form.content')" v-model="content" class="input is-light max-width"></textarea>
      </div>
      <div class="send">
        <button class="primary is-small" @click="submitForm">{{$t('dashboard.ideas.form.send')}}</button>
      </div>
    </div>
    <div class="contact-wrapper">
      <a class="contact" href="mailto:contact@e-jass.ch">
        <div class="contact-icon">
          <span class="icon fa"><font-awesome-icon icon="envelope"/></span>
        </div>
        <div class="text">
          <b>{{$t('dashboard.contactUs.mail')}}</b>
          <span>{{$t("dashboard.contactUs.mailInfo")}}</span>
        </div>
      </a>
      <div class="contact" @click="openInNewTab('https://www.instagram.com/ejass.ch')">
        <div class="contact-icon">
          <img src="https://www.pngmart.com/files/21/Instagram-Logo-PNG-HD.png" style="height: 60px"/>
        </div>
        <div class="text">
          <b>{{$t('dashboard.contactUs.chat')}}</b>
          <span>{{$t("dashboard.contactUs.chatInfo")}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import Utils from '@/utils/Utils';

export default class ContactUsPage extends Vue {
  public isLoaded = false;
  public content = '';
  public object = '';

  validObjectLenght () {
    this.object = this.object.slice(0, 255);
  }

  async submitForm () {
    let isValid = true;
    if (this.object.trim() === '') {
      isValid = false;
      Utils.toastError('', Utils.translate('dashboard.ideas.errors.objectEmpty'));
    }
    if (this.content.trim() === '') {
      isValid = false;
      Utils.toastError('', Utils.translate('dashboard.ideas.errors.contentEmpty'));
    }

    if (!isValid) {
      return false;
    }
    const contactResponse = await Utils.postEncodedToBackend('/global/contact', {
      object: this.object,
      content: this.content
    });
    if (!contactResponse.success && !contactResponse.data) {
      Utils.toastError('', Utils.translate('dashboard.contactUs.error'));
    } else {
      this.content = '';
      this.object = '';
      const text = Utils.translate('dashboard.contactUs.success');
      Utils.toastSuccess('', text);
    }
  }

  openInNewTab (url: string) {
    Utils.openInNewTab(url);
  }

  isLoadedImg () {
    this.isLoaded = true;
  }
}
</script>
<style lang="scss">
  @import "@/styles/variables.scss";
  .dashboard-wrapper:has(.contact-wrapper) {
    input {
      width: calc(100% - 20px);
    }
    overflow-x: auto;
    padding: 20px 20px 0 20px;
    width: calc(100% - 40px);
    height: calc(100% - 120px);
    //flex-direction: column;
    justify-content: center;
    gap: initial;
    text-align: center;
    .info {
      margin-bottom: 10px;
    }
    h1 {
      margin-bottom: 10px;
    }
    .contact-wrapper {
      display: flex;
      justify-content: center;
      gap: 50px;
      margin-top: 50px;
      .contact {
        text-decoration: none;
        color: $white;
        border-radius: 20px;
        background: $grey;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        transition: 0.4s;
        &:hover {
          cursor: pointer;
          box-shadow: 0px 0px 25px -2px #FFFFFF;
          .text {
            box-shadow: 0px -16px 19px -7px rgba(255,255,255,0.43);
          }
        }
        .contact-icon {
          padding: 40px 20px;
          transition: 0.4s;
          .icon {
            font-size: 60px;
          }
        }
        .text {
          display: flex;
          max-width: 210px;
          text-align: center;
          font-size: 14px;
          height: 180px;
          padding: 0 20px;
          background-color: #AF0404;
          border-top-right-radius: 125% 60px;
          border-top-left-radius: 125% 60px;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          transition: 0.4s;
          b {
            font-size: 20px;
            display: block;
            margin-bottom: 10px;
          }
        }
      }
    }
    .contact-form {
      textarea {
        width: calc(100% - 20px);
      }
      label {
        text-align: left;
      }
      .send {
        margin-top: 10px;
        text-align: right;
      }
    }
  }

  @media screen and (max-width: 600px) {
    .contact-wrapper {
      //flex-direction: column;
      align-items: center;
      .contact {
        max-width: 250px;
      }
    }
    .dashboard-wrapper {
      padding: 0 20px;
      width: calc(100% - 40px);
    }
  }
</style>
