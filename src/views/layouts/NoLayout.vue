<template>
  <div class="container">
    <router-view @onPasswordRevele="onPasswordRevele"/>
  </div>
  <div class="bg-icons">
    <img src="../../assets/trumps/hearts_default.svg">
    <img src="../../assets/trumps/spades_default.svg">
    <img src="../../assets/trumps/clubs_default.svg">
    <img src="../../assets/trumps/diamonds_default.svg">
  </div>
  <div class="footer">
    © Copyright {{date}} Brice Mabillard.
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import WsManager from '@/services/ws/WsManager';
import store from '@/store';
import GlobalStore from '@/utils/GlobalStore';
import moment from 'moment/moment';

export default class NoLayout extends Vue {
  ws: WsManager | undefined;
  isPasswordRevele = false;

  onPasswordRevele (input: any) {
    this.isPasswordRevele = !this.isPasswordRevele;
    return this.isPasswordRevele;
  }

  get date () {
    return moment().format('YYYY');
  }
}
</script>
<style scoped lang="scss">
@import "@/styles/style.scss";
.container {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.bg-icons {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 100%;
  overflow: hidden;
  width: 100%;

  img {
    position: absolute;
    opacity: 0.6;
    height: 300px;
    width: 300px;
  }

  @keyframes rotate {
    to{ transform: rotate(360deg); }
  }

  @for $i from 1 to 5 {
    img:nth-child(#{$i}) {
      @if ($i == 1) {
        bottom: -50px;
        left: -50px;
        rotate: random(360) + deg;
      }
      @if ($i == 2) {
        bottom: -50px;
        right: -50px;
        rotate: random(360) + deg;
      }
      @if ($i == 3) {
        top: -50px;
        left: -50px;
        rotate: random(360) + deg;
      }
      @if ($i == 4) {
        top: -50px;
        right: -50px;
        rotate: random(360) + deg;
      }
      //animation: map-get($animations, random(length($animations))) map-get($item, 'delay')*1.5 cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite forwards;
      animation: rotate 60s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite forwards;
    }
  }
}

@media screen and (max-width: 479px) {
  .bg-icons img {
    height: 200px;
    width: 200px;
  }
}
@media screen and (min-width: 480px) and (max-width: 599px) {
  .bg-icons img {
    height: 200px;
    width: 200px;
  }
}
@media screen and (min-width: 600px) and (max-width: 768px) {
  .bg-icons {
    img {
      height: 200px;
      width: 200px;
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 899px) {
  .bg-icons img {
    height: 250px;
    width: 250px;
  }
}
@media screen and (min-width: 900px) and (max-width: 1023px) {
  .bg-icons img {
    height: 250px;
    width: 250px;
  }
}
@media screen and (max-width: 1024px) {
}
</style>
