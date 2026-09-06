<template>
  <div class="row centered">
    <q-spinner-pie color="orange" size="7.5em" v-if="loading" />
    <q-card
      v-else
      class="col-xs-12 col-sm-10 col-md-5"
      style="background: #ab91e5"
    >
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="name"
            label="Ваше имя"
            hint="Пожалуйста укажите Ваш никнейм"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Пожалуйста напишите что-либо',
            ]"
          />

          <q-input
            filled
            type="password"
            v-model="pass"
            hint="Пожалуйста укажите Ваш пароль"
            label="Ваш пароль"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Пожалуйста напишите что-либо',
            ]"
          />
          <div>
            <q-btn label="Войти" @click="onSubmit" color="primary" :loading="loading" />
            <q-btn label="На главную" class="q-ml-sm" color="primary" to="/" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
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

<style scoped></style>