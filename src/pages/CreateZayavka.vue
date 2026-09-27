<template>
  <q-page class="page-wrap">
    <!-- Hero header -->
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1 class="hero-title">Разместить вакансию</h1>
          <p class="hero-sub">
            <template v-if="isAuthenticated">Вы вошли — вакансия появится в разделе «Мои вакансии»</template>
            <template v-else>Регистрация не нужна · просто заполните форму</template>
          </p>
        </div>
      </div>
    </div>

    <!-- Form card -->
    <div class="form-card">
      <q-form @submit="onSubmit" class="form-grid">
        <!-- Main info -->
        <div class="section-title">
          <i class="fas fa-info-circle"></i>
          Основная информация
        </div>

        <div class="row-2">
          <q-input
            v-model.trim="form.tzeh"
            outlined
            dense
            label="Номер цеха/отдела *"
            hint="Например: 330, 850, 563"
            :rules="[v => !!v || 'Укажите цех']"
          />
          <q-input
            v-model.trim="form.professia"
            outlined
            dense
            label="Профессия/должность *"
            hint="Например: токарь, энергетик, мастер"
            :rules="[v => !!v || 'Укажите профессию']"
          />
        </div>

        <div class="row-2">
          <q-select
            v-model="form.schedule"
            :options="scheduleOptions"
            label="График работы *"
            dense
            outlined
            emit-value
            map-options
          />
          <q-select
            v-model="form.experience_required"
            :options="experienceOptions"
            label="Требуемый опыт *"
            dense
            outlined
            emit-value
            map-options
          />
        </div>

        <q-input
          v-model.trim="form.description"
          type="textarea"
          outlined
          dense
          :rows="4"
          label="Описание вакансии *"
          hint="Обязанности и условия работы"
          :rules="[v => !!v || 'Опишите вакансию']"
        />

        <q-input
          v-model.trim="form.requirements"
          type="textarea"
          outlined
          dense
          :rows="3"
          label="Требования к кандидату"
          hint="Образование, навыки, личные качества (необязательно)"
        />

        <!-- Salary -->
        <div class="section-title">
          <i class="fas fa-money-bill-wave"></i>
          Зарплата
        </div>

        <div class="row-2">
          <q-input
            v-model.number="form.salary_min"
            type="number"
            outlined
            dense
            label="От (руб.)"
            hint="0 — если не указывать"
          />
          <q-input
            v-model.number="form.salary_max"
            type="number"
            outlined
            dense
            label="До (руб.)"
            hint="0 — если не указывать"
          />
        </div>

        <!-- Contacts -->
        <div class="section-title">
          <i class="fas fa-address-card"></i>
          Контакты
        </div>

        <div class="row-2">
          <q-input
            v-model.trim="form.contact_name"
            outlined
            dense
            label="Контактное лицо"
            hint="ФИО ответственного"
          />
          <q-input
            v-model.trim="form.contact_phone"
            outlined
            dense
            label="Телефон"
            hint="Рабочий или мобильный"
          />
        </div>

        <q-input
          v-model.trim="form.contact_email"
          outlined
          dense
          type="email"
          label="Email (необязательно)"
        />

        <!-- Anonymous hint -->
        <div v-if="!isAuthenticated" class="anon-note">
          <i class="fas fa-user-secret"></i>
          Вы размещаете как гость. Зарегистрируйтесь, чтобы видеть и редактировать свои вакансии в профиле.
          <router-link to="/registr">Регистрация →</router-link>
        </div>

        <!-- Buttons -->
        <div class="actions">
          <q-btn
            unelevated
            rounded
            size="md"
            color="primary"
            label="Опубликовать вакансию"
            icon="add_circle"
            :loading="loading"
            type="submit"
          />
          <q-btn
            flat
            rounded
            label="Отмена"
            to="/"
            class="cancel-btn"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useZayavkaStore } from 'stores/zayavka'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'PageCreateZayavka',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const zayavkaStore = useZayavkaStore()
    const authStore = useAuthStore()

    const loading = ref(false)

    const form = ref({
      tzeh: '',
      professia: '',
      schedule: 'Полный день',
      experience_required: 'Без опыта',
      description: '',
      requirements: '',
      salary_min: null,
      salary_max: null,
      contact_name: '',
      contact_phone: '',
      contact_email: ''
    })

    // Must match API validation enum exactly
    const scheduleOptions = [
      { label: 'Полный день', value: 'Полный день' },
      { label: 'Сменный график', value: 'Сменный график' },
      { label: 'Гибкий график', value: 'Гибкий график' },
      { label: 'Удаленная работа', value: 'Удаленная работа' },
      { label: 'Не указано', value: 'Не указано' }
    ]

    const experienceOptions = [
      { label: 'Без опыта', value: 'Без опыта' },
      { label: '1-3 года', value: '1-3 года' },
      { label: '3-5 лет', value: '3-5 лет' },
      { label: '5+ лет', value: '5+ лет' },
      { label: 'Не указано', value: 'Не указано' }
    ]

    const isAuthenticated = computed(() => !!authStore.token)

    async function onSubmit() {
      // Client-side salary sanity check
      if (form.value.salary_min && form.value.salary_max &&
          form.value.salary_min > form.value.salary_max) {
        $q.notify({ type: 'negative', message: '«От» не может быть больше «До»', position: 'top' })
        return
      }

      loading.value = true
      try {
        const payload = { ...form.value }
        // Normalize empty numbers/strings to null so Joi allow('', null) passes
        if (!payload.salary_min) payload.salary_min = null
        if (!payload.salary_max) payload.salary_max = null
        ;['contact_name', 'contact_phone', 'contact_email', 'requirements'].forEach(k => {
          if (!payload[k]) payload[k] = null
        })

        await zayavkaStore.createZayavka(payload)

        $q.notify({
          type: 'positive',
          message: 'Вакансия опубликована! Она уже видна в общем списке.',
          position: 'top'
        })
        router.push('/')
      } catch (err) {
        console.error('create error:', err)
        $q.notify({
          type: 'negative',
          message: err.response?.data?.message || err.message || 'Ошибка при создании вакансии',
          position: 'top'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      scheduleOptions,
      experienceOptions,
      isAuthenticated,
      loading,
      onSubmit
    }
  }
}
</script>

<style scoped>
.page-wrap {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

/* Hero (matches other pages) */
.hero {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  margin: 0 -16px;
  padding: 36px 16px 44px;
}

.hero-inner {
  max-width: 728px;
  margin: 0 auto;
}

.hero-title {
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.hero-sub {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

/* Form card */
.form-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-top: -26px;
  position: relative;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  margin-top: 6px;
}

.section-title i {
  color: #2563eb;
  font-size: 13px;
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 560px) {
  .row-2 {
    grid-template-columns: 1fr;
  }
}

.anon-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 12px 14px;
}

.anon-note i {
  color: #94a3b8;
}

.anon-note a {
  color: #2563eb;
  font-weight: 600;
  white-space: nowrap;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding-top: 6px;
}

.cancel-btn {
  color: #64748b;
}
</style>
