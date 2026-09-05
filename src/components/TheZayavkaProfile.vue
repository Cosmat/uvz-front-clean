<template>
  <div class="row full_width q-pt-xl">
    <q-card class="col-xs-12 col-sm-10 col-md-8 vacancy-card">
      <!-- Заголовок вакансии -->
      <q-card-section class="bg-primary text-white">
        <div class="row items-center">
          <div class="col">
            <div class="text-h5 text-weight-bold">{{ professia }}</div>
            <div class="text-subtitle1">
              <q-icon name="business" class="q-mr-xs" />
              Цех {{ tzeh }}
            </div>
          </div>
          <div class="col-auto">
            <q-badge 
              :color="statusColor" 
              :label="status" 
              class="text-weight-bold"
            />
          </div>
        </div>
      </q-card-section>

      <!-- Основная информация -->
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- Описание -->
          <div class="col-12">
            <div class="text-h6 text-weight-bold q-mb-sm">
              <q-icon name="description" class="q-mr-xs" />
              Описание вакансии
            </div>
            <div class="text-body1 description-text">{{ description }}</div>
          </div>

          <!-- Требования -->
          <div v-if="requirements" class="col-12">
            <div class="text-h6 text-weight-bold q-mb-sm">
              <q-icon name="school" class="q-mr-xs" />
              Требования к кандидату
            </div>
            <div class="text-body1 description-text">{{ requirements }}</div>
          </div>

          <!-- Детали вакансии -->
          <div class="col-12 col-md-6">
            <div class="text-h6 text-weight-bold q-mb-sm">
              <q-icon name="info" class="q-mr-xs" />
              Детали
            </div>
            <q-list dense>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="schedule" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>График работы</q-item-label>
                  <q-item-label caption>{{ schedule }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item>
                <q-item-section avatar>
                  <q-icon name="work_history" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Требуемый опыт</q-item-label>
                  <q-item-label caption>{{ experience_required }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Зарплата -->
          <div v-if="salary_min || salary_max" class="col-12 col-md-6">
            <div class="text-h6 text-weight-bold q-mb-sm">
              <q-icon name="attach_money" class="q-mr-xs" />
              Зарплата
            </div>
            <div class="salary-display">
              <q-chip 
                v-if="salary_min && salary_max"
                color="green" 
                text-color="white" 
                :label="`${formatSalary(salary_min)} - ${formatSalary(salary_max)} руб.`"
                icon="payments"
              />
              <q-chip 
                v-else-if="salary_min"
                color="green" 
                text-color="white" 
                :label="`от ${formatSalary(salary_min)} руб.`"
                icon="payments"
              />
              <q-chip 
                v-else-if="salary_max"
                color="green" 
                text-color="white" 
                :label="`до ${formatSalary(salary_max)} руб.`"
                icon="payments"
              />
            </div>
          </div>

          <!-- Контактная информация -->
          <div v-if="contact_name || contact_phone || contact_email" class="col-12">
            <div class="text-h6 text-weight-bold q-mb-sm">
              <q-icon name="contact_phone" class="q-mr-xs" />
              Контактная информация
            </div>
            <q-list dense>
              <q-item v-if="contact_name">
                <q-item-section avatar>
                  <q-icon name="person" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ contact_name }}</q-item-label>
                  <q-item-label caption>Контактное лицо</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item v-if="contact_phone">
                <q-item-section avatar>
                  <q-icon name="phone" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <a :href="`tel:${contact_phone}`" class="text-primary">
                      {{ contact_phone }}
                    </a>
                  </q-item-label>
                  <q-item-label caption>Телефон</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item v-if="contact_email">
                <q-item-section avatar>
                  <q-icon name="email" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <a :href="`mailto:${contact_email}`" class="text-primary">
                      {{ contact_email }}
                    </a>
                  </q-item-label>
                  <q-item-label caption>Email</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>

      <!-- Футер с датой и действиями -->
      <q-separator />
      <q-card-actions class="justify-between items-center footer-section">
        <div class="text-caption date-info">
          <q-icon name="schedule" class="q-mr-xs" />
          Опубликовано: {{ date }}
        </div>
        
        <q-btn
          size="sm"
          @click="$emit('del', id)"
          color="red"
          outline
          icon="delete"
          label="Удалить"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  emits: ["del"],
  props: {
    tzeh: String,
    professia: String,
    description: String,
    date: String,
    id: String,
    // Новые поля
    requirements: {
      type: String,
      default: ""
    },
    salary_min: {
      type: Number,
      default: null
    },
    salary_max: {
      type: Number,
      default: null
    },
    schedule: {
      type: String,
      default: "Полный день"
    },
    experience_required: {
      type: String,
      default: "Без опыта"
    },
    contact_name: {
      type: String,
      default: ""
    },
    contact_phone: {
      type: String,
      default: ""
    },
    contact_email: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "Активная"
    }
  },
  setup(props) {
    // Вычисляемое свойство для цвета статуса
    const statusColor = computed(() => {
      switch (props.status) {
        case 'Активная':
          return 'green';
        case 'Приостановлена':
          return 'orange';
        case 'Закрыта':
          return 'red';
        default:
          return 'grey';
      }
    });

    // Функция для форматирования зарплаты
    const formatSalary = (amount) => {
      if (!amount) return '';
      return new Intl.NumberFormat('ru-RU').format(amount);
    };

    return {
      statusColor,
      formatSalary
    };
  },
};
</script>

<style scoped>
.vacancy-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.vacancy-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.salary-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.text-primary {
  color: #1976d2 !important;
}

a.text-primary {
  text-decoration: none;
}

a.text-primary:hover {
  text-decoration: underline;
}

/* Импорт интересного шрифта */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Slab:wght@300;400;500;600;700&display=swap');

/* Исправление видимости текста описания */
.description-text {
  color: #333 !important;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

/* Стили для футера */
.footer-section {
  background: #f8f9fa !important;
  padding: 16px 24px !important;
}

.date-info {
  color: #6c757d !important;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.9em;
}

/* Общие стили шрифтов для карточки */
.vacancy-card {
  font-family: 'Inter', sans-serif;
}

.vacancy-card .text-h5 {
  font-family: 'Roboto Slab', serif;
  font-weight: 600;
}

.vacancy-card .text-h6 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

.vacancy-card .q-item-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.vacancy-card .q-item-label.caption {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  opacity: 0.8;
}

@media (max-width: 600px) {
  .vacancy-card {
    margin-bottom: 16px;
  }
}
</style>
