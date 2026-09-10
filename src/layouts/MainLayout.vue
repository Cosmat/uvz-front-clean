<template>
  <q-layout view="lHh Lpr lFf" :class="{ 'layout-dark': isDark }">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white shadow-md" style="height: var(--header-height);">
      <q-toolbar class="row items-center" style="height: 100%; padding: 0 var(--space-6);">
        <!-- Mobile menu button -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Меню"
          @click="drawer = !drawer"
          class="q-mr-md hidden-lg hidden-xl"
          color="white"
        />

        <!-- Logo / Brand -->
        <q-toolbar-title class="text-h6 font-semibold tracking-tight flex items-center gap-2" style="min-width: 0;">
          <q-icon name="precision_manufacturing" class="text-xl" style="color: var(--color-primary-200);" />
          <span class="hidden-sm hidden-md">УВЗ — Биржа труда</span>
          <span class="hidden-lg hidden-xl">УВЗ</span>
        </q-toolbar-title>

        <q-space />

        <!-- Search (desktop) -->
        <div class="hidden-sm hidden-md relative w-80 max-w-xs">
          <q-input
            v-model="globalSearch"
            placeholder="Поиск вакансий, кодов, телефонов..."
            dense
            debounce="300"
            class="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-primary-300"
            prefix="<q-icon name='search' color='white-60' />"
            @update:model-value="onGlobalSearch"
          >
            <template v-slot:append v-if="globalSearch">
              <q-icon name="close" color="white-60" class="cursor-pointer" @click="globalSearch = ''" />
            </template>
          </q-input>
        </div>

        <q-space />

        <!-- Theme toggle -->
        <q-btn
          flat
          dense
          round
          :icon="isDark ? 'light_mode' : 'dark_mode'"
          aria-label="Переключить тему"
          @click="toggleTheme"
          color="white"
          class="q-ml-sm"
        />

        <!-- User menu / Auth buttons -->
        <div class="flex items-center gap-2">
          <q-btn
            v-if="!isAuthenticated"
            label="Вход"
            unelevated
            rounded
            color="white"
            text-color="primary-700"
            to="/login"
            class="hidden-sm hidden-md"
          />
          <q-btn
            v-if="!isAuthenticated"
            label="Регистрация"
            unelevated
            rounded
            color="primary-100"
            text-color="primary-800"
            to="/registr"
            class="hidden-sm hidden-md"
          />

          <q-btn
            v-if="isAuthenticated"
            flat
            dense
            round
            icon="person"
            :label="userName"
            color="white"
            class="hidden-sm hidden-md"
            @click="goProfile"
          />
          <q-btn
            v-if="isAuthenticated"
            flat
            dense
            round
            icon="logout"
            label="Выход"
            color="white"
            class="hidden-sm hidden-md"
            @click="logout"
          />

          <!-- Mobile user menu -->
          <q-btn
            v-if="isAuthenticated"
            flat
            dense
            round
            icon="person"
            color="white"
            class="hidden-lg hidden-xl"
            @click="userMenu = !userMenu"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer (Sidebar) -->
    <q-drawer
      v-model="drawer"
      :width="sidebarWidth"
      :breakpoint="500"
      bordered
      class="bg-secondary border-r border-light"
      :class="{ 'drawer-collapsed': drawerCollapsed }"
    >
      <q-scroll-area class="fit" style="height: 100%;">
        <q-list class="q-pa-md rounded-lg" dense>
          <!-- Navigation items -->
          <q-item
            clickable
            v-ripple
            to="/"
            :class="[{ 'active-route': $route.path === '/' }, 'rounded-lg']"
            @click="drawer = false"
          >
            <q-item-section avatar>
              <q-icon name="home" :color="isActiveRoute('/') ? 'primary' : 'text-secondary'" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium" :class="{ 'text-primary': isActiveRoute('/'), 'text-secondary': !isActiveRoute('/') }">
                На главную
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced class="my-2" />

          <q-item
            clickable
            v-ripple
            to="/deshife"
            :class="[{ 'active-route': $route.path === '/deshife' }, 'rounded-lg']"
            @click="drawer = false"
          >
            <q-item-section avatar>
              <q-icon name="font_download" :color="isActiveRoute('/deshife') ? 'primary' : 'text-secondary'" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium" :class="{ 'text-primary': isActiveRoute('/deshife'), 'text-secondary': !isActiveRoute('/deshife') }">
                Дешифратор
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/phones"
            :class="[{ 'active-route': $route.path === '/phones' }, 'rounded-lg']"
            @click="drawer = false"
          >
            <q-item-section avatar>
              <q-icon name="phone" :color="isActiveRoute('/phones') ? 'primary' : 'text-secondary'" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium" :class="{ 'text-primary': isActiveRoute('/phones'), 'text-secondary': !isActiveRoute('/phones') }">
                Телефоны цехов
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/ai-assistant"
            :class="[{ 'active-route': $route.path === '/ai-assistant' }, 'rounded-lg']"
            @click="drawer = false"
          >
            <q-item-section avatar>
              <q-icon name="smart_toy" :color="isActiveRoute('/ai-assistant') ? 'primary' : 'text-secondary'" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium" :class="{ 'text-primary': isActiveRoute('/ai-assistant'), 'text-secondary': !isActiveRoute('/ai-assistant') }">
                AI-Помощник
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced class="my-4" v-if="isAuthenticated" />

          <!-- Authenticated user section -->
          <q-item
            v-if="isAuthenticated"
            clickable
            v-ripple
            to="/profile"
            class="rounded-lg"
            @click="drawer = false"
          >
            <q-item-section avatar>
              <q-icon name="person" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium text-primary">Профиль</q-item-label>
              <q-item-label caption class="text-tertiary">{{ userRole }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="isAuthenticated"
            clickable
            v-ripple
            class="rounded-lg"
            @click="logout"
          >
            <q-item-section avatar>
              <q-icon name="logout" color="danger" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium text-danger">Выйти</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Guest actions -->
          <div v-if="!isAuthenticated" class="q-mt-md space-y-2">
            <q-btn
              block
              unelevated
              rounded
              color="primary"
              label="Вход"
              icon="login"
              to="/login"
              class="w-full"
            />
            <q-btn
              block
              outline
              rounded
              color="primary"
              label="Регистрация"
              icon="app_registration"
              to="/registr"
              class="w-full"
            />
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container class="bg-primary min-h-screen">
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-secondary border-t border-light py-4 px-6" style="height: auto;">
      <div class="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary">
        <span>© 2026 Уралвагонзавод — Биржа труда</span>
        <div class="flex items-center gap-4">
          <q-btn flat dense size="sm" icon="info" label="О проекте" class="text-secondary" />
          <q-btn flat dense size="sm" icon="contact_support" label="Поддержка" class="text-secondary" />
          <q-btn flat dense size="sm" icon="privacy_tip" label="Политика" class="text-secondary" />
        </div>
      </div>
    </q-footer>

    <!-- Mobile user dropdown -->
    <q-menu v-model="userMenu" anchor="bottom right" self="bottom right" offset="[10, 10]">
      <q-list style="min-width: 200px;" dense>
        <q-item-label header class="text-primary font-semibold">{{ userName }}</q-item-label>
        <q-item-label caption class="text-tertiary">{{ userRole }}</q-item-label>
        <q-separator />
        <q-item clickable v-ripple to="/profile" @click="userMenu = false">
          <q-item-section avatar><q-icon name="person" color="primary" /></q-item-section>
          <q-item-section>Профиль</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="logout; userMenu = false">
          <q-item-section avatar><q-icon name="logout" color="danger" /></q-item-section>
          <q-item-section>Выйти</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-layout>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    const drawer = ref(false)
    const drawerCollapsed = ref(false)
    const userMenu = ref(false)
    const globalSearch = ref('')
    const isDark = ref(false)

    const sidebarWidth = computed(() => drawerCollapsed.value ? 72 : 280)

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const userName = computed(() => authStore.user?.username || '')
    const userRole = computed(() => authStore.user?.role || 'user')

    const isActiveRoute = (path) => route.path === path

    const toggleTheme = () => {
      isDark.value = !isDark.value
      document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }

    const goProfile = () => {
      router.push('/profile')
    }

    const logout = () => {
      authStore.logout()
      router.push('/')
    }

    const onGlobalSearch = debounce(async (value) => {
      // TODO: implement global search across all pages
      console.log('Global search:', value)
    }, 300)

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme') || 'light'
      isDark.value = savedTheme === 'dark'
      document.documentElement.setAttribute('data-theme', savedTheme)
    })

    return {
      drawer,
      drawerCollapsed,
      userMenu,
      globalSearch,
      isDark,
      sidebarWidth,
      isAuthenticated,
      userName,
      userRole,
      isActiveRoute,
      toggleTheme,
      goProfile,
      logout,
      onGlobalSearch
    }
  }
})
</script>

<style scoped>
/* Layout specific styles */
.layout-dark {
  background: var(--bg-primary);
}

.active-route {
  background: var(--color-primary-50) !important;
  border-left: 3px solid var(--color-primary-600);
}

[data-theme="dark"] .active-route {
  background: var(--color-primary-900) !important;
}

.drawer-collapsed .q-item-label,
.drawer-collapsed .q-item-label.header,
.drawer-collapsed .q-item-label.caption {
  display: none;
}

.drawer-collapsed .q-item {
  justify-content: center;
  padding-left: 12px;
  padding-right: 12px;
}

.drawer-collapsed .q-toolbar-title span {
  display: none;
}

/* Search input styling */
.q-input__inner {
  background: transparent !important;
}

/* Mobile responsive */
@media (max-width: 600px) {
  .hidden-sm { display: none !important; }
}

@media (max-width: 1024px) {
  .hidden-md { display: none !important; }
}

@media (min-width: 1025px) {
  .hidden-lg { display: none !important; }
  .hidden-xl { display: none !important; }
}

/* Custom scrollbar for drawer */
.q-drawer .q-scrollarea__content::-webkit-scrollbar {
  width: 6px;
}

.q-drawer .q-scrollarea__content::-webkit-scrollbar-track {
  background: transparent;
}

.q-drawer .q-scrollarea__content::-webkit-scrollbar-thumb {
  background: var(--color-neutral-400);
  border-radius: 3px;
}
</style>