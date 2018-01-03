<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary" glossy>
        <q-btn
          flat
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Quasar App
          <div slot="subtitle">Running on Quasar v{{$q.version}}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer v-model="leftDrawerOpen" class="bg-grey-2">
      <q-list-header>Tests</q-list-header>
      <q-item to="/action-sheet">
        <q-item-main label="Action-Sheet" />
      </q-item>
      <q-item to="/alert">
        <q-item-main label="Alert" />
      </q-item>
      <q-item to="/collapsible">
        <q-item-main label="Collapsible" />
      </q-item>
      <q-item to="/dialog">
        <q-item-main label="Dialog" />
      </q-item>
      <q-item to="/fab">
        <q-item-main label="FAB" />
      </q-item>
      <q-item to="/modal">
        <q-item-main label="Modal" />
      </q-item>
      <q-item to="/popover">
        <q-item-main label="Popover" />
      </q-item>
      <q-item to="/tooltip">
        <q-item-main label="Tooltip" />
      </q-item>
      <q-list no-border link inset-delimiter>
        <q-list-header>Essential Links</q-list-header>
        <q-item @click="openURL('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item>
        <q-item @click="openURL('https://nuxtjs.org/')">
          <q-item-side icon="school" />
          <q-item-main label="Nuxt.js Docs" sublabel="nuxtjs.org" />
        </q-item>
        <q-item @click="openURL('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org" />
        </q-item>
        <q-item @click="openURL('https://gitter.im/quasarframework/Lobby')">
          <q-item-side icon="chat" />
          <q-item-main label="Gitter Channel" sublabel="Quasar Lobby" />
        </q-item>
        <q-item @click="openURL('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'layout-default',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
