<template>
  <q-card class="card card-interactive h-full flex flex-col" @click="$emit('click', item)">
    <q-card-section class="p-5 flex flex-col h-full">
      <!-- Header with status and tzeh -->
      <div class="flex items-start justify-between gap-2 mb-3">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <q-badge
            :label="item.tzeh"
            color="primary"
            class="text-xs font-medium flex-shrink-0"
            style="min-width: 50px;"
          />
          <span class="text-xs text-tertiary font-medium truncate block">
            Цех {{ item.tzeh }}
          </span>
        </div>
        <q-badge
          :label="item.status || 'Активная'"
          :color="getStatusColor(item.status)"
          size="sm"
          class="flex-shrink-0"
        />
      </div>

      <!-- Profession title -->
      <h3 class="text-lg font-semibold text-primary mb-2 line-clamp-2" style="line-height: 1.3;">
        {{ item.professia }}
      </h3>

      <!-- Description -->
      <p v-if="item.description" class="text-secondary text-sm mb-3 line-clamp-3" style="line-height: 1.5;">
        {{ item.description }}
      </p>

      <!-- Details grid -->
      <div class="flex flex-col gap-2 mb-4 flex-1">
        <div v-if="item.salary_min || item.salary_max" class="flex items-center gap-2 text-sm">
          <q-icon name="attach_money" size="16px" color="secondary" />
          <span class="font-medium text-primary">
            {{ formatSalary(item.salary_min, item.salary_max) }}
          </span>
        </div>

        <div v-if="item.schedule" class="flex items-center gap-2 text-sm text-secondary">
          <q-icon name="schedule" size="16px" />
          <span>{{ item.schedule }}</span>
        </div>

        <div v-if="item.experience_required && item.experience_required !== 'Не указано'" class="flex items-center gap-2 text-sm text-secondary">
          <q-icon name="school" size="16px" />
          <span>{{ item.experience_required }}</span>
        </div>

        <div v-if="item.contact_name" class="flex items-center gap-2 text-sm text-secondary">
          <q-icon name="person" size="16px" />
          <span class="truncate">{{ item.contact_name }}</span>
        </div>
      </div>

      <!-- Footer with contact and action -->
      <div class="border-t border-light pt-3 mt-auto">
        <div v-if="item.contact_phone" class="flex items-center gap-2 text-sm mb-2">
          <q-icon name="phone" size="16px" color="primary" />
          <a :href="'tel:' + formatPhoneForTel(item.contact_phone)" class="text-primary hover:underline font-medium">
            {{ formatPhone(item.contact_phone) }}
          </a>
        </div>

        <div v-if="item.contact_email" class="flex items-center gap-2 text-sm">
          <q-icon name="email" size="16px" color="primary" />
          <a :href="'mailto:' + item.contact_email" class="text-primary hover:underline truncate block">
            {{ item.contact_email }}
          </a>
        </div>

        <!-- View details button -->
        <q-btn
          v-if="!item._id && !item.id"
          block
          flat
          color="primary"
          label="Подробнее"
          icon="arrow_forward"
          class="mt-3"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'VacancyCard',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const formatSalary = (min, max) => {
      if (min && max && min !== max) {
        return `${min.toLocaleString()} — ${max.toLocaleString()} ₽`
      }
      if (min) {
        return `${min.toLocaleString()} ₽`
      }
      if (max) {
        return `до ${max.toLocaleString()} ₽`
      }
      return 'По договорённости'
    }

    const formatPhone = (phone) => {
      if (!phone) return ''
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 10) {
        return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`
      }
      return phone
    }

    const formatPhoneForTel = (phone) => {
      if (!phone) return ''
      return phone.replace(/\D/g, '')
    }

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'активная':
        case 'active':
          return 'secondary'
        case 'архивная':
        case 'archived':
          return 'grey'
        case 'черновик':
        case 'draft':
          return 'accent'
        default:
          return 'primary'
      }
    }

    return {
      formatSalary,
      formatPhone,
      formatPhoneForTel,
      getStatusColor
    }
  }
}
</script>

<style scoped>
/* Ensure card fills grid cell properly */
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl) !important;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ensure q-card-section fills available space */
:deep(.q-card-section) {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>