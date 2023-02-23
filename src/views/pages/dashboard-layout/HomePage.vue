<template>
  <div class="play-wrapper">
    <img src="@/assets/play-now.jpg" alt="play now"/>
    <button class="primary is-small" @click="redirectUrl('/game')">{{ $t('dashboard.play.playNow') }}</button>
  </div>
  <div class="statistics">
    <div class="title">{{ $t('dashboard.play.history') }}</div>
    <div class="stats-list">
      <div class="game-stat win" v-if="!noGame">
        <div class="user">
          <img :src="getCountryPath('CH')" />
          <span>bricemab</span>
        </div>
        <div class="rank-rating">+20</div>
        <div class="date">10:12 13.02.2023</div>
        <div class="score">1234 - 1509</div>
      </div>
      <div class="game-stat win" v-if="!noGame">
        <div class="user">
          <img :src="getCountryPath('CH')" />
          <span>bricemab</span>
        </div>
        <div class="rank-rating">+20</div>
        <div class="date">10:12 13.02.2023</div>
        <div class="score">1234 - 1509</div>
      </div>
      <div class="game-stat win" v-if="!noGame">
        <div class="user">
          <img :src="getCountryPath('CH')" />
          <span>bricemab</span>
        </div>
        <div class="rank-rating">+20</div>
        <div class="date">10:12 13.02.2023</div>
        <div class="score">1234 - 1509</div>
      </div>
      <div class="game-stat loose" v-if="!noGame">
        <div class="user">
          <img :src="getCountryPath('CH')" />
          <span>bricemab</span>
        </div>
        <div class="rank-rating">+20</div>
        <div class="date">10:12 13.02.2023</div>
        <div class="score">1234 - 1509</div>
      </div>
      <div class="game-stat win" v-if="!noGame">
        <div class="user">
          <img :src="getCountryPath('CH')" />
          <span>bricemab</span>
        </div>
        <div class="rank-rating">+20</div>
        <div class="date">10:12 13.02.2023</div>
        <div class="score">1234 - 1509</div>
      </div>
      <div class="game-stat loose" v-if="!noGame">
        <div class="user">
          <img :src="getCountryPath('CH')" />
          <span>bricemab</span>
        </div>
        <div class="rank-rating">+20</div>
        <div class="date">10:12 13.02.2023</div>
        <div class="score">1234 - 1509</div>
      </div>
      <div class="game-stat win" v-if="!noGame">
        <div class="user">
          <img :src="getCountryPath('CH')" />
          <span>bricemab</span>
        </div>
        <div class="rank-rating">+20</div>
        <div class="date">10:12 13.02.2023</div>
        <div class="score">1234 - 1509</div>
      </div>
      <div class="game-stat loose" v-if="!noGame">
        <div class="user">
          <img :src="getCountryPath('CH')" />
          <span>bricemab</span>
        </div>
        <div class="rank-rating">+20</div>
        <div class="date">10:12 13.02.2023</div>
        <div class="score">1234 - 1509</div>
      </div>
      <div class="game-stat loose" v-if="!noGame">
        <div class="user">
          <img :src="getCountryPath('CH')" />
          <span>bricemab</span>
        </div>
        <div class="rank-rating">+20</div>
        <div class="date">10:12 13.02.2023</div>
        <div class="score">1234 - 1509</div>
      </div>
      <div class="no-game" v-if="noGame">{{ $t('dashboard.play.noGamePlayed') }}...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class HomePage extends Vue {
  public noGame = false;

  redirectUrl (route: string) {
    this.$router.push('/game');
  }

  getCountryPath (code: string) {
    return require('@/assets/flags/' + code + '.png');
  }
}
</script>
