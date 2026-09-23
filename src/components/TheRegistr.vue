<template>
  <div class="auth-page">
    <div class="auth-card">
      <!-- Header -->
      <div class="auth-head">
        <div class="auth-logo">
          <i class="fas fa-user-plus"></i>
        </div>
        <h1 class="auth-title">Регистрация</h1>
        <p class="auth-sub">Создайте аккаунт — это займёт полминуты</p>
      </div>

      <!-- Form -->
      <q-form @submit.prevent="onSubmit" class="auth-form">
        <q-input
          outlined
          v-model="name"
          type="email"
          label="Email"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Введите email',
            (val) => /.+@.+\..+/.test(val) || 'Введите корректный email'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="mail" class="field-icon" />
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

        <q-input
          outlined
          type="password"
          v-model="pass2"
          label="Повторите пароль"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Повторите пароль',
            (val) => val === pass || 'Пароли не совпадают'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock_reset" class="field-icon" />
          </template>
        </q-input>

        <q-btn
          type="submit"
          unelevated
          no-caps
          rounded
          size="lg"
          label="Создать аккаунт"
          class="submit-btn"
          :loading="loading"
        />
      </q-form>

      <!-- Footer -->
      <div class="auth-footer">
        <span>Уже есть аккаунт?</span>
        <router-link to="/login" class="footer-link">Войти</router-link>
      </div>
      <div class="auth-footer">
        <router-link to="/" class="footer-link muted">← На главную</router-link>
      </div>
    </div>
  </div>
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
    const pass2 = ref(null);
    const loading = ref(false);

    return {
      name,
      pass,
      pass2,
      loading,

      async onSubmit() {
        if (!name.value || !pass.value) {
          $q.notify({
            type: 'warning',
            message: 'Пожалуйста введите email и пароль',
            position: 'top'
          });
          return;
        }

        if (pass.value !== pass2.value) {
          $q.notify({
            type: 'warning',
            message: 'Пароли не совпадают',
            position: 'top'
          });
          return;
        }

        loading.value = true;
        try {
          await authStore.register(name.value, pass.value, 'user');
          router.push("/");
        } catch (e) {
          console.log("error: ", e);
          $q.notify({
            type: 'negative',
            message: e.response?.data?.message || 'Ошибка регистрации',
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