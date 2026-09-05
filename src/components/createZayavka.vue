<template>
  <div class="row full_width">
    <q-card class="col-xs-12 col-sm-10 col-md-8 col-lg-6" style="background: #ab91e5; color: #333;">
      <q-card-section>
        <div class="text-h6 text-white text-center q-mb-md">
          <q-icon name="work" size="md" class="q-mr-sm" />
          Создание новой вакансии
        </div>
        
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- Основная информация -->
          <div class="text-subtitle1 text-white q-mb-sm" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
            <q-icon name="info" size="sm" class="q-mr-xs" />
            Основная информация
          </div>
          
          <q-input
            filled
            v-model="tzeh"
            label="Номер цеха/отдела *"
            hint="Например: 850, 563, 300"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Пожалуйста напишите что-либо',
            ]"
          />

          <q-input
            filled
            v-model="professia"
            label="Профессия/должность *"
            hint="Например: токарь, инженер, мастер"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Пожалуйста напишите что-либо',
            ]"
          />
          
          <q-select
            filled
            v-model="schedule"
            :options="scheduleOptions"
            label="График работы *"
            emit-value
            map-options
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Пожалуйста выберите график',
            ]"
          />
          
          <q-select
            filled
            v-model="experience_required"
            :options="experienceOptions"
            label="Требуемый опыт *"
            emit-value
            map-options
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Пожалуйста выберите опыт',
            ]"
          />

          <q-input
            type="textarea"
            filled
            v-model="description"
            label="Описание вакансии *"
            hint="Подробно опишите обязанности и условия работы"
            rows="4"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Пожалуйста напишите что-либо',
            ]"
          />
          
          <q-input
            type="textarea"
            filled
            v-model="requirements"
            label="Требования к кандидату"
            hint="Образование, навыки, личные качества"
            rows="3"
          />

          <!-- Зарплата -->
          <div class="text-subtitle1 text-white q-mb-sm q-mt-md" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
            <q-icon name="attach_money" size="sm" class="q-mr-xs" />
            Зарплата
          </div>
          
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                filled
                v-model.number="salary_min"
                type="number"
                label="От (руб.)"
                hint="Минимальная зарплата"
              />
            </div>
            <div class="col-6">
              <q-input
                filled
                v-model.number="salary_max"
                type="number"
                label="До (руб.)"
                hint="Максимальная зарплата"
              />
            </div>
          </div>

          <!-- Контактная информация -->
          <div class="text-subtitle1 text-white q-mb-sm q-mt-md" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
            <q-icon name="contact_phone" size="sm" class="q-mr-xs" />
            Контактная информация
          </div>
          
          <q-input
            filled
            v-model="contact_name"
            label="Контактное лицо"
            hint="ФИО ответственного за набор"
          />
          
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                filled
                v-model="contact_phone"
                label="Телефон"
                hint="Рабочий телефон"
                mask="##-##-##"
              />
            </div>
            <div class="col-6">
              <q-input
                filled
                v-model="contact_email"
                type="email"
                label="Email"
                hint="Рабочий email"
              />
            </div>
          </div>

          <div class="q-mt-lg">
            <q-btn
              label="Создать вакансию"
              type="submit"
              color="primary"
              size="lg"
              class="full-width"
              icon="add_circle"
            />

            <q-btn
              label="Отмена"
              class="q-mt-sm full-width"
              color="grey"
              outline
              size="lg"
              @click="$emit('chancel')"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import dayjs from "dayjs";
import keys from "../../keys/keys.dev";

export default {
  emits: ["createZayavka", "chancel", "del"],
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    const $store = useStore();
    
    // Основные поля
    const tzeh = ref(null);
    const professia = ref("");
    const description = ref(null);
    const requirements = ref("");
    
    // Новые поля
    const salary_min = ref(null);
    const salary_max = ref(null);
    const schedule = ref("Полный день");
    const experience_required = ref("Без опыта");
    const contact_name = ref("");
    const contact_phone = ref("");
    const contact_email = ref("");
    
    const id = computed({
      get: () => $store.getters["auth/id"],
    });

    // Опции для селектов
    const scheduleOptions = [
      { label: "Полный день", value: "Полный день" },
      { label: "Сменный график", value: "Сменный график" },
      { label: "Ж/д график", value: "Ж/д график" },
      { label: "4/3", value: "4/3" },
      { label: "Удаленная работа", value: "Удаленная работа" }
    ];

    const experienceOptions = [
      { label: "Без опыта", value: "Без опыта" },
      { label: "1-3 года", value: "1-3 года" },
      { label: "3-5 лет", value: "3-5 лет" },
      { label: "5+ лет", value: "5+ лет" }
    ];

    return {
      tzeh,
      professia,
      description,
      requirements,
      salary_min,
      salary_max,
      schedule,
      experience_required,
      contact_name,
      contact_phone,
      contact_email,
      scheduleOptions,
      experienceOptions,
      id,

      async onSubmit() {
        // Деструктурируем notify для избежания конфликтов при минификации
        const { notify } = $q;
        const router = $router;
        const store = $store;
        
        // Валидация зарплаты
        if (salary_min.value && salary_max.value && salary_min.value > salary_max.value) {
          notify({
            type: 'negative',
            message: 'Минимальная зарплата не может быть больше максимальной',
            position: 'top'
          });
          return;
        }

        var d = dayjs().format("DD.MM.YYYY");
        try {
          const formData = {
            // Основные поля
            tzeh: tzeh.value,
            professia: professia.value.toLowerCase().trim(),
            description: description.value,
            id: id.value,
            date: d,
            
            // Новые поля
            requirements: requirements.value,
            salary_min: salary_min.value || null,
            salary_max: salary_max.value || null,
            schedule: schedule.value,
            experience_required: experience_required.value,
            contact_name: contact_name.value,
            contact_phone: contact_phone.value,
            contact_email: contact_email.value,
            status: "Активная"
          };
          
          await axios.post(`${keys.BASE_URL}/createZayavka`, formData);
          
          // Очистка формы
          tzeh.value = null;
          professia.value = "";
          description.value = null;
          requirements.value = "";
          salary_min.value = null;
          salary_max.value = null;
          schedule.value = "Полный день";
          experience_required.value = "Без опыта";
          contact_name.value = "";
          contact_phone.value = "";
          contact_email.value = "";
          
          await store.dispatch("requests/getallZayavka");
          
          notify({
            type: 'positive',
            message: 'Вакансия успешно создана!',
            position: 'top'
          });
          
          router.push("/");
        } catch (err) {
          console.log("error: ", err);
          notify({
            type: 'negative',
            message: 'Ошибка при создании вакансии',
            position: 'top'
          });
        }
      },
    };
  },
};
</script>

<style scoped>
/* Улучшение видимости текста на фиолетовом фоне */
.q-card {
  color: #333 !important;
}

.q-input .q-field__label {
  color: #333 !important;
  font-weight: 500;
}

.q-input .q-field__native {
  color: #333 !important;
}

.q-select .q-field__label {
  color: #333 !important;
  font-weight: 500;
}

.q-select .q-field__native {
  color: #333 !important;
}

/* Тени для заголовков разделов */
.text-subtitle1.text-white {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  font-weight: 600;
}

.text-h6.text-white {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  font-weight: 600;
}

/* Улучшение контрастности полей ввода */
.q-field--filled .q-field__control {
  background: rgba(255, 255, 255, 0.95) !important;
}

.q-field--filled .q-field__control:hover {
  background: rgba(255, 255, 255, 1) !important;
}
</style>
