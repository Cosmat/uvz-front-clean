<template>
  <q-card class="vacancy-card" @click="$emit('click', item)">
    <!-- Badges row -->
    <div class="card-top">
      <span class="tzeh-badge">Цех {{ item?.tzeh || '—' }}</span>
      <span class="status-badge" :class="'status-' + statusKey">{{ item?.status || 'Активная' }}</span>
    </div>

    <!-- Title -->
    <h3 class="card-title">{{ item?.professia || 'Вакансия' }}</h3>

    <!-- Salary -->
    <div v-if="item?.salary_min || item?.salary_max" class="salary">
      {{ formatSalary(item?.salary_min, item?.salary_max) }}
    </div>
    <div v-else class="salary salary-muted">Зарплата по договорённости</div>

    <!-- Description -->
    <p v-if="item?.description" class="card-desc">{{ item.description }}</p>

    <!-- Meta -->
    <div class="card-meta">
      <span v-if="item?.schedule" class="meta-item">
        <i class="fas fa-clock"></i>{{ item.schedule }}
      </span>
      <span v-if="item?.experience_required && item.experience_required !== 'Не указано'" class="meta-item">
        <i class="fas fa-graduation-cap"></i>{{ item.experience_required }}
      </span>
      <span v-if="item?.contact_name" class="meta-item">
        <i class="fas fa-user"></i>{{ item.contact_name }}
      </span>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <a v-if="item?.contact_phone" :href="'tel:' + formatPhoneForTel(item.contact_phone)" class="phone-link">
        <i class="fas fa-phone"></i>{{ formatPhone(item.contact_phone) }}
      </a>
      <span v-if="item?.date" class="post-date">{{ item.date }}</span>
    </div>
  </q-card>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'VacancyCard',
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  emits: ['click'],
  setup(props) {
    const ruFmt = new Intl.NumberFormat('ru-RU')

    const statusKey = computed(() => {
      const s = (props.item?.status || '').toLowerCase()
      if (s.includes('архив')) return 'archived'
      if (s.includes('черновик')) return 'draft'
      return 'active'
    })

    const formatSalary = (min, max) => {
      if (min && max && min !== max) return `${ruFmt.format(min)} – ${ruFmt.format(max)} ₽`
      if (min) return `от ${ruFmt.format(min)} ₽`
      if (max) return `до ${ruFmt.format(max)} ₽`
      return ''
    }

    const formatPhone = (phone) => {
      if (!phone) return ''
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 10) {
        return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`
      }
      if (cleaned.length === 11 && cleaned[0] === '7') {
        return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
      }
      return phone
    }

    const formatPhoneForTel = (phone) => {
      if (!phone) return ''
      return phone.replace(/\D/g, '')
    }

    return {
      statusKey,
      formatSalary,
      formatPhone,
      formatPhoneForTel
    }
  }
}
</script>

<style scoped>
.vacancy-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 18px 14px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.vacancy-card:hover {
  border-color: #c7d7f0;
  box-shadow: 0 10px 24px rgba(23, 90, 190, 0.10);
  transform: translateY(-3px);
}

/* Badges */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tzeh-badge {
  font-size: 12px;
  font-weight: 600;
  color: #1d4ed8;
  background: #e8f0fe;
  border-radius: 999px;
  padding: 4px 10px;
  white-space: nowrap;
}

.status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.status-active {
  color: #15803d;
  background: #ecfdf5;
}

.status-archived {
  color: #64748b;
  background: #f1f5f9;
}

.status-draft {
  color: #b45309;
  background: #fffbeb;
}

/* Title */
.card-title {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
}

/* Salary */
.salary {
  font-size: 18px;
  font-weight: 800;
  color: #047857;
  margin-bottom: 4px;
}

.salary-muted {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
}

/* Description */
.card-desc {
  margin: 10px 0 12px;
  font-size: 13.5px;
  line-height: 1.55;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Meta */
.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.meta-item {
  font-size: 12.5px;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.meta-item i {
  font-size: 11px;
  color: #94a3b8;
}

/* Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
}

.phone-link {
  color: #1976d2;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  gap: 7px;
  align-items: center;
}

.phone-link:hover {
  text-decoration: underline;
}

.phone-link i {
  font-size: 12px;
}

.post-date {
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
}
</style>