<template>
  <q-page class="auth-page">
    <div class="auth-card">
      <!-- Header -->
      <div class="auth-head">
        <div class="auth-logo">
          <i class="fas fa-industry"></i>
        </div>
        <h1 class="auth-title">Вход</h1>
        <p class="auth-sub">Войдите, чтобы откликаться на вакансии</p>
      </div>

      <!-- Form -->
      <q-form @submit="onSubmit" class="auth-form">
        <q-input
          outlined
          v-model="name"
          label="Имя пользователя"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Введите имя пользователя']"
        >
          <template v-slot:prepend>
            <q-icon name="person" class="field-icon" />
          </template>
        </q-input>

        <q-input
          outlined
          type="password"
          v-model="pass"
          label="Пароль"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Введите пароль']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" class="field-icon" />
          </template>
        </q-input>

        <q-btn
          type="submit"
          unelevated
          no-caps
          rounded
          size="lg"
          label="Войти"
          class="submit-btn"
          :loading="loading"
        />
      </q-form>

      <!-- Footer -->
      <div class="auth-footer">
        <span>Нет аккаунта?</span>
        <router-link to="/registr" class="footer-link">Зарегистрироваться</router-link>
      </div>
      <div class="auth-footer">
        <router-link to="/" class="footer-link muted">← На главную</router-link>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/auth";
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const authStore = useAuthStore();
    const name = ref(null);
    const pass = ref(null);
    const loading = ref(false);

    return {
      name,
      pass,
      loading,

      async onSubmit() {
        if (!name.value || !pass.value) {
          $q.notify({
            type: 'warning',
            message: 'Пожалуйста введите имя и пароль',
            position: 'top'
          });
          return;
        }

        loading.value = true;
        try {
          await authStore.login(name.value, pass.value);
          router.push("/");
        } catch (e) {
          console.log(e);
          $q.notify({
            type: 'negative',
            message: e.response?.data?.message || 'Неверный логин или пароль',
            position: 'top'
          });
        } finally {
          loading.value = false;
        }
      },
    };
  },
};
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 56px 16px 40px;
  background: #f4f6fa;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 36px 32px 28px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

/* Header */
.auth-head {
  text-align: center;
  margin-bottom: 26px;
}

.auth-logo {
  width: 52px;
  height: 52px;
  margin: 0 auto 14px;
  border-radius: 14px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-logo i {
  color: #ffffff;
  font-size: 22px;
}

.auth-title {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.auth-sub {
  margin: 0;
  font-size: 13.5px;
  color: #64748b;
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field-icon {
  color: #94a3b8;
}

.submit-btn {
  margin-top: 8px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 700;
}

.submit-btn:hover {
  background: #1d4ed8;
}

/* Footer */
.auth-footer {
  text-align: center;
  margin-top: 16px;
  font-size: 13.5px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.footer-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-link.muted {
  color: #94a3b8;
  font-weight: 500;
}
</style>