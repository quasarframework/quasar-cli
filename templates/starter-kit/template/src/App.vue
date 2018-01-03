<template>
  <q-app>
    <router-view />
  </q-app>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus">
@import '~variables'
.gigi
  // background alpha($primary, .3)
  background $primary
</style>
