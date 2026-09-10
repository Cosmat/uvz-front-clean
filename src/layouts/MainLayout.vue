<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-grey-1">
      <q-toolbar class="row">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawer = !drawer" color="primary" unelevated rounded class="q-mr-md">
          <q-tooltip class="bg-purple" v-model="showing_01">ДЕШИФРАТОР</q-tooltip>
        </q-btn>
        
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
              <q-item clickable v-ripple to="/deshife">
                <q-item-section avatar>
                  <q-icon class="text-red" name="font_download" />
                </q-item-section>
                <q-item-section>ДЕШИФРАТОР</q-item-section>
              </q-item>
              <q-separator spaced />
              <q-item clickable v-ripple to="/phones">
                <q-item-section avatar>
                  <q-icon class="text-red" name="phone" />
                </q-item-section>
                <q-item-section>ТЕЛЕФОНЫ ТАБЕЛЬНЫХ</q-item-section>
              </q-item>
              <q-separator spaced />
              <q-item clickable v-ripple to="/ai-assistant">
                <q-item-section avatar>
                  <q-icon class="text-red" name="smart_toy" />
                </q-item-section>
                <q-item-section>AI-ПОМОЩНИК</q-item-section>
              </q-item>
              <q-separator spaced />
            </q-list>
          </q-scroll-area>
        </q-drawer>

        <q-space />
        <q-btn v-if="isAuthenticated" to="/profile" color="primary" unelevated rounded>
          {{ userName }}
          <q-tooltip class="bg-purple" v-model="showing">Создать вакансию</q-tooltip>
        </q-btn>
        <q-btn v-if="!isAuthenticated" icon="login" dense color="primary" label="Вход" class="q-mr-lg" to="/login" unelevated rounded> </q-btn>
        <q-btn v-if="isAuthenticated" icon="logout" dense color="primary" label="Выход" class="q-mr-lg" @click="logout" unelevated rounded />
        <q-btn v-if="!isAuthenticated" icon="app_registration" dense color="primary" label="Регистрация" to="/registr" unelevated rounded>
          <q-tooltip class="bg-purple" v-model="showing">Чтобы создать вакансию пожалуйста зарегистрируйтесь</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container class="vertical-middle bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from "vue";
import { useAuthStore } from "stores/auth";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const url = ref("logo_005.jpg.png");
    const showing = ref(false);
    const showing_01 = ref(false);
    const drawer = ref(false);
    
    const authStore = useAuthStore();
    const router = useRouter();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const userName = computed(() => authStore.user?.username || '');

    onMounted(() => {
      setTimeout(() => (showing.value = true), 1500);
      setTimeout(() => (showing.value = false), 8000);
      setTimeout(() => (showing_01.value = true), 8000);
      setTimeout(() => (showing_01.value = false), 15000);
    });

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    return {
      url,
      drawer,
      showing,
      showing_01,
      isAuthenticated,
      userName,
      logout
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