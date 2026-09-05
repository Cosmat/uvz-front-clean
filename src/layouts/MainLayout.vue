<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-grey-1">
      <q-toolbar class="row">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawer = !drawer" color="primary" unelevated rounded class="q-mr-md">
          <q-tooltip class="bg-purple" v-model="showing_01">ДЕШИФРАТОР</q-tooltip>
        </q-btn>
        <a v-if="$q.screen.width > 600" href="https://vk.com/id35962245" target="_blank" class="q-ml-lg q-mt-xs">
          <img :src="url" width="100" height="50" alt="Пример" />
        </a>
        <q-toolbar-title v-if="$q.screen.width > 600" class="text-primary">
          <marquee onmouseout="this.start()" onmouseover="this.stop()" style="font-family: 'Roboto', sans-serif;">
            Здравствуйте, уважаемый посетитель! Чтобы создать вакансию, пожалуйста зарегистрируйтесь.
          </marquee>
        </q-toolbar-title>

        <q-drawer v-model="drawer" :width="200" :breakpoint="500" bordered class="bg-grey-2">
          <q-scroll-area class="fit">
            <q-list class="rounded-borders text-primary text-weight-bolder">
              <q-item clickable v-ripple to="/">
                <q-item-section avatar>
                  <q-icon class="text-red" name="home" />
                </q-item-section>
                <q-item-section>НА ГЛАВНУЮ</q-item-section>
              </q-item>
              <q-separator spaced />
              <q-item clickable v-ripple to="/deshif">
                <q-item-section avatar>
                  <q-icon class="text-red" name="font_download" />
                </q-item-section>
                <q-item-section>ДЕШИФРАТОР</q-item-section>
              </q-item>
              <q-separator spaced />
              <q-item clickable v-ripple to="/tabelnaya">
                <q-item-section avatar>
                  <q-icon class="text-red" name="phone" />
                </q-item-section>
                <q-item-section>телефоны табельной</q-item-section>
              </q-item>
              <q-separator spaced />
              <q-item clickable v-ripple to="/ai-assistant">
                <q-item-section avatar>
                  <q-icon class="text-red" name="smart_toy" />
                </q-item-section>
                <q-item-section>AI-помощник</q-item-section>
              </q-item>
              <q-separator spaced />
            </q-list>
          </q-scroll-area>
        </q-drawer>

        <q-space />
        <q-btn class="q-mr-lg" v-if="token" to="/profile" color="primary" unelevated rounded>{{ Name }}
          <q-tooltip class="bg-purple" v-model="showing">Кликните сюда чтобы создать вакансию</q-tooltip>
        </q-btn>
        <q-btn v-if="!token" icon="login" dense color="primary" label="Вход" class="q-mr-lg" to="/login" unelevated rounded> </q-btn>
        <q-btn v-if="token" icon="logout" dense color="primary" label="Выход" class="q-mr-lg" @click="logout" unelevated rounded />
        <q-btn v-if="!token" icon="app_registration" dense color="primary" label="Регистрация" to="/registr" unelevated rounded>
          <q-tooltip class="bg-purple" v-model="showing">Чтобы создать вакансию пожалуйста
            зарегистрируйтесь</q-tooltip></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container class="vertical-middle bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const url = ref("logo_005.jpg.png");
    const showing = ref(false);
    const showing_01 = ref(false);
    const $store = useStore();
    const token = computed({
      get: () => $store.getters["auth/token"],
    });

    const Name = computed({
      get: () => $store.getters["auth/Name"],
    });

    onMounted(() => {
      setTimeout(() => (showing.value = true), 1500);
      setTimeout(() => (showing.value = false), 8000);
      setTimeout(() => (showing_01.value = true), 8000);
      setTimeout(() => (showing_01.value = false), 15000);
    });

    return {
      url,

      drawer: ref(false),
      showing,
      showing_01,
      token,
      Name,
      logout: () => {
        $store.commit("auth/logout");
      },
    };
  },
});
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.bg-grey-1 {
  background: #f5f5f5;
}
.bg-grey-2 {
  background: #e0e0e0;
}
.text-primary {
  color: #1976d2;
}
</style>
