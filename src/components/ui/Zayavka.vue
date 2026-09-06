<template>
  <div class="row q-pt-xl cent">
    <q-card class="col-xs-12 col-sm-10 col-md-10 col-lg-10 my-card">
      <q-card-section horizontal class="full-width">
        <!-- Tzeh badge -->
        <q-card-section class="bg-primary text-white text-center" style="min-width: 80px;">
          <div class="text-caption text-weight-bold q-mb-xs">ЦЕХ</div>
          <div class="text-h4 text-weight-bolder">{{ tzeh }}</div>
        </q-card-section>
        <q-separator vertical />
        
        <!-- Main content -->
        <q-card-section class="full-width">
          <!-- Profession -->
          <div class="row q-mb-sm items-center">
            <div class="col-auto">
              <q-icon name="work" class="text-primary q-mr-sm" />
            </div>
            <div class="col">
              <div class="text-h6 q-mb-none">{{ professia }}</div>
            </div>
          </div>
          
          <q-separator class="q-my-sm" />
          
          <!-- Salary -->
          <div v-if="salary_min > 0 || salary_max > 0" class="row q-mb-sm items-center">
            <div class="col-auto">
              <q-icon name="attach_money" class="text-green q-mr-sm" />
            </div>
            <div class="col">
              <div class="text-body1">
                <span v-if="salary_min > 0 && salary_max > 0">{{ salary_min.toLocaleString() }} - {{ salary_max.toLocaleString() }} ₽</span>
                <span v-else-if="salary_min > 0">от {{ salary_min.toLocaleString() }} ₽</span>
                <span v-else-if="salary_max > 0">до {{ salary_max.toLocaleString() }} ₽</span>
              </div>
            </div>
          </div>

          <!-- Schedule & Experience -->
          <div class="row q-mb-sm">
            <div class="col-12 col-md-6 q-mb-sm" v-if="schedule !== 'Не указано'">
              <q-icon name="schedule" class="text-grey-7 q-mr-sm" size="16px" />
              <span class="text-caption">{{ schedule }}</span>
            </div>
            <div class="col-12 col-md-6 q-mb-sm" v-if="experience_required !== 'Не указано'">
              <q-icon name="school" class="text-grey-7 q-mr-sm" size="16px" />
              <span class="text-caption">{{ experience_required }}</span>
            </div>
          </div>

          <q-separator class="q-my-sm" />
          
          <!-- Description -->
          <div class="text-body2 text-grey-8" v-if="description">
            <div class="text-caption text-weight-bold q-mb-xs">Описание:</div>
            <div>{{ description }}</div>
          </div>

          <!-- Requirements -->
          <div class="text-body2 text-grey-8 q-mt-sm" v-if="requirements">
            <div class="text-caption text-weight-bold q-mb-xs">Требования:</div>
            <div>{{ requirements }}</div>
          </div>

          <!-- Contacts -->
          <div class="row q-mt-md q-gutter-xs" v-if="contact_name || contact_phone || contact_email">
            <q-separator class="q-mx-sm" />
            <div class="col-auto" v-if="contact_name">
              <q-icon name="person" class="text-grey-7 q-mr-sm" size="16px" />
              <span class="text-caption">{{ contact_name }}</span>
            </div>
            <div class="col-auto" v-if="contact_phone">
              <q-icon name="phone" class="text-green q-mr-sm" size="16px" />
              <a :href="'tel:' + contact_phone" class="text-caption">{{ formatPhone(contact_phone) }}</a>
            </div>
            <div class="col-auto" v-if="contact_email">
              <q-icon name="email" class="text-blue q-mr-sm" size="16px" />
              <a :href="'mailto:' + contact_email" class="text-caption">{{ contact_email }}</a>
            </div>
          </div>
        </q-card-section>
      </q-card-section>

      <!-- Footer with date and status -->
      <q-card-section horizontal class="bg-grey-1">
        <span class="q-ml-lg q-mt-sm q-mb-xs text-caption text-grey-7">
          Создана: {{ formatDate(date) }}
        </span>
        <q-space />
        <q-chip
          :color="getStatusColor(status)"
          :label="status"
          size="sm"
          class="q-mr-lg q-mb-sm"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    tzeh: { type: String, required: true },
    professia: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
    id: { type: [String, Number], default: null },
    requirements: { type: String, default: '' },
    salary_min: { type: Number, default: 0 },
    salary_max: { type: Number, default: 0 },
    schedule: { type: String, default: 'Не указано' },
    experience_required: { type: String, default: 'Не указано' },
    contact_name: { type: String, default: '' },
    contact_phone: { type: String, default: '' },
    contact_email: { type: String, default: '' },
    status: { type: String, default: 'Активная' }
  },
  setup() {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Активная': return 'green'
        case 'Архивная': return 'grey'
        case 'Черновик': return 'orange'
        default: return 'grey'
      }
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      // Try to parse various formats
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('ru-RU')
      }
      return dateStr
    }

    const formatPhone = (phone) => {
      if (!phone) return ''
      // Format phone for display
      return phone.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3')
    }

    return {
      getStatusColor,
      formatDate,
      formatPhone
    }
  }
}
</script>

<style scoped>
.cent {
  justify-content: center;
}
.full-width {
  width: 100%;
}
</style>