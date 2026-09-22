<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="site-header">
      <q-toolbar class="header-inner">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Меню"
          @click="drawer = !drawer"
          class="menu-btn"
        />

        <div class="brand" @click="goHome">
          <i class="fas fa-industry brand-icon"></i>
          <span class="brand-name">Работа<span class="brand-accent">УВЗ</span></span>
        </div>

        <q-space />

        <nav class="top-nav">
          <q-btn flat no-caps label="Вакансии" to="/" class="nav-link" />
          <q-btn flat no-caps label="Дешифратор" to="/deshife" class="nav-link" />
          <q-btn flat no-caps label="Телефоны" to="/phones" class="nav-link" />
        </nav>

        <q-space />

        <q-btn
          v-if="isAuthenticated"
          to="/profile"
          unelevated
          no-caps
          rounded
          class="user-btn"
        >
          <i class="fas fa-user q-mr-xs"></i>
          {{ userName }}
        </q-btn>
        <q-btn
          v-if="!isAuthenticated"
          unelevated
          no-caps
          rounded
          label="Вход"
          to="/login"
          class="auth-btn auth-btn-outline"
        />
        <q-btn
          v-if="isAuthenticated"
          flat
          no-caps
          rounded
          label="Выход"
          @click="logout"
          class="auth-btn auth-btn-ghost"
        />
        <q-btn
          v-if="!isAuthenticated"
          unelevated
          no-caps
          rounded
          label="Регистрация"
          to="/registr"
          class="auth-btn auth-btn-solid"
        />
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="drawer" :width="240" :breakpoint="1024" bordered class="drawer">
      <div class="drawer-head">Навигация</div>
      <q-list class="drawer-list">
        <q-item clickable v-ripple to="/" @click="drawer = false">
          <q-item-section avatar><i class="fas fa-briefcase"></i></q-item-section>
          <q-item-section>Вакансии</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/deshife" @click="drawer = false">
          <q-item-section avatar><i class="fas fa-font"></i></q-item-section>
          <q-item-section>Дешифратор кодов</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/phones" @click="drawer = false">
          <q-item-section avatar><i class="fas fa-phone"></i></q-item-section>
          <q-item-section>Телефоны цехов</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/ai-assistant" @click="drawer = false">
          <q-item-section avatar><i class="fas fa-robot"></i></q-item-section>
          <q-item-section>AI-помощник</q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item v-if="isAuthenticated" clickable v-ripple to="/profile" @click="drawer = false">
          <q-item-section avatar><i class="fas fa-user"></i></q-item-section>
          <q-item-section>Профиль</q-item-section>
        </q-item>
        <q-item v-if="isAuthenticated" clickable v-ripple @click="logout">
          <q-item-section avatar><i class="fas fa-sign-out-alt"></i></q-item-section>
          <q-item-section>Выйти</q-item-section>
        </q-item>
        <q-item v-if="!isAuthenticated" clickable v-ripple to="/login" @click="drawer = false">
          <q-item-section avatar><i class="fas fa-sign-in-alt"></i></q-item-section>
          <q-item-section>Вход</q-item-section>
        </q-item>
        <q-item v-if="!isAuthenticated" clickable v-ripple to="/registr" @click="drawer = false">
          <q-item-section avatar><i class="fas fa-user-plus"></i></q-item-section>
          <q-item-section>Регистрация</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { useAuthStore } from "stores/auth";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const drawer = ref(false);

    const authStore = useAuthStore();
    const router = useRouter();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const userName = computed(() => authStore.user?.username || "");

    const goHome = () => router.push("/");

    const logout = () => {
      authStore.logout();
      router.push("/");
    };

    return {
      drawer,
      isAuthenticated,
      userName,
      goHome,
      logout
    };
  },
});
</script>

<style scoped>
.site-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  height: 60px;
}

.header-inner {
  max-width: 1240px;
  margin: 0 auto;
  height: 60px;
  padding: 0 16px;
}

.menu-btn {
  color: #0f172a;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.brand-icon {
  font-size: 18px;
  color: #2563eb;
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.brand-accent {
  color: #2563eb;
}

/* Top nav (desktop) */
.top-nav {
  display: flex;
  gap: 2px;
}

@media (max-width: 1024px) {
  .top-nav {
    display: none;
  }
}

.nav-link {
  color: #475569;
  font-size: 14px;
  font-weight: 600;
}

.nav-link:hover {
  color: #2563eb;
}

/* Auth buttons */
.auth-btn {
  font-size: 13.5px;
  font-weight: 600;
  padding: 6px 16px;
  position: relative;
  z-index: 2;
}

.auth-btn-solid {
  background: #2563eb;
  color: #ffffff;
}

.auth-btn-solid:hover {
  background: #1d4ed8;
}

.auth-btn-outline {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.auth-btn-outline:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.auth-btn-ghost {
  color: #64748b;
}

/* Drawer */
.drawer-head {
  padding: 18px 20px 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.drawer-list i {
  color: #2563eb;
  font-size: 15px;
  width: 100%;
  text-align: center;
}

.page-container {
  background: #f4f6fa;
  min-height: 100vh;
}
</style>