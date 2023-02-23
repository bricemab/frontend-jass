<template>
  <router-view class="light-mode"/>
</template>

<style lang="scss">
@import "@/styles/style.scss";
@import "mosha-vue-toastify/dist/style.css";
.light-mode {
  $dark-grey: #252525;
  $grey: #414141;
  $white: #d7d7d7;

  $red: #AF0404;
  $redSecond: #af2020;
  $primaryBg: $white;
  $secondBg: $grey;
  $primaryText: $white;
}
html, body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  position: relative;
}
#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: 'Roboto';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  color: $primaryText;
  background: $dark-grey;
}

</style>
