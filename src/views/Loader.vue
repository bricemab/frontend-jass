<template>
  <div class="loader">
    <img src="@/assets/loader.svg"/>
    <div>{{msg}}</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String
  }
})
export default class Loader extends Vue {
  msg!: string
}
</script>

<style scoped lang="scss">
.loader {
  position: absolute;
  z-index: 999;
  height: 100%;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #00000085;
}
</style>
