<template>
  <q-page class="text-center">
    <div>Index 2</div>
    <img :src="src">
    <q-carousel
        height="500px"
        :infinite="true"
        color="white"
        arrows
        class="bg-grey-2 shadow-4"
        style="border-radius: 5px"
        quick-nav
      >
        <q-carousel-slide v-for="n in 7" :key="n" class="flex flex-center">
          Slide h{{n}}
          <router-link to="/" replace>Go to index</router-link>
        </q-carousel-slide>

        <q-carousel-control slot="control-left" slot-scope="carousel" position="top-left" :offset="[18, 18]">
          <q-btn small round color="tertiary" :icon="carousel.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="carousel.toggleFullscreen()" />
        </q-carousel-control>
      </q-carousel>
    <br>
    <img src="/statics/quasar-logo-full.svg">
    <br>
    <img src="statics/quasar-logo-full.svg">
    <br>
    <q-input v-model="src2" />
    <br>
    <img :src="src2">
    <br>
    <router-link to="/">To index 1</router-link>
  </q-page>
</template>

<style lang="stylus">
.my-class
  display flex
  align-items center
</style>

<script>
export default {
  name: 'page-index2',
  data () {
    return {
      src: 'statics/quasar-logo-full.svg',
      src2: 'statics/quasar-logo2.png_'
    }
  }
}
</script>
