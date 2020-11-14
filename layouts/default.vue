<template>
  <v-app dark>
    <nav-drawer />
    <flyout-drawer />
    <main-bar />
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <c-footer />

    <notificationGroup group="foo">
      <div
        class="fixed inset-0 flex px-4 py-6 pointer-events-none p-6 items-start justify-end"
      >
        <div class="max-w-sm w-full">
          <notification v-slot="{notifications}">
            <div
              class="flex max-w-sm w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4"
              v-for="notification in notifications"
              :key="notification.id"
            >
              <div class="flex justify-center items-center w-12 bg-green-500">
qewr
asdf
              </div>

              <div class="-mx-3 py-2 px-4">
                <div class="mx-3">
                  <span class="text-green-500 font-semibold">{{notification.title}}</span>
                  <p class="text-gray-600 text-sm">{{notification.text}}</p>
                </div>
              </div>
            </div>
          </notification>
        </div>
      </div>
    </notificationGroup>

  </v-app>
</template>

<script>
// import notifications from '@/components/Notifications.vue'
import flyoutDrawer from '@/components/FlyoutDrawer.vue'
import navDrawer from '@/components/NavDrawer.vue'
import mainBar from '@/components/MainBar.vue'
import cFooter from '@/components/Footer.vue'

export default {
  components: {
    'flyout-drawer': flyoutDrawer,
    'nav-drawer': navDrawer,
    'c-footer': cFooter,
    'main-bar': mainBar,
    // notifications,
  }
}
</script>
