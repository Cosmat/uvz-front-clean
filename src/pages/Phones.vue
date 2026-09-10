<template>
  <q-page class="q-pa-md" style="max-width: var(--container-max); margin: 0 auto;">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-slide-up">
      <div>
        <h1 class="text-3xl font-bold text-primary" style="line-height: var(--leading-tight);">
          Телефоны табельных цехов
        </h1>
        <p class="text-secondary mt-1">
          Всего записей: <span class="font-semibold text-primary">{{ pagination?.total || 0 }}</span>
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <q-input
          v-model="searchQuery"
          @update:model-value="debouncedSearch"
          placeholder="Поиск по номеру цеха..."
          dense
          clearable
          style="width: 100%; max-width: 300px;"
          prefix="<q-icon name='search' color='text-tertiary' />"
          class="input-modern"
        />
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && (!phones || phones.length === 0)" class="animate-fade-in">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Цех</th>
              <th>Телефон</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 8" :key="i">
              <td><div class="skeleton skeleton-text short" style="width: 80px; height: 16px;" /></td>
              <td><div class="skeleton skeleton-text" style="width: 150px; height: 16px;" /></td>
              <td><div class="skeleton skeleton-text" style="height: 16px;" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else-if="phones && phones.length > 0" class="animate-slide-up">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 100px;">Цех</th>
              <th style="width: 200px;">Телефон</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in phones" :key="item.number_tzeh" class="hover-row">
              <td>
                <span class="font-mono text-primary font-semibold px-2 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-md">
                  {{ item.number_tzeh }}
                </span>
              </td>
              <td>
                <div v-if="item.phone_number" class="flex items-center gap-2">
                  <a 
                    :href="'tel:' + formatPhoneForTel(item.phone_number)" 
                    class="text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    <q-icon name="phone" size="16px" />
                    {{ formatPhone(item.phone_number) }}
                  </a>
                  <q-btn
                    size="sm"
                    dense
                    flat
                    round
                    icon="content_copy"
                    @click.stop="copyPhone(item.phone_number)"
                    aria-label="Скопировать телефон"
                    class="text-secondary hover:text-primary"
                  />
                </div>
                <div v-else class="text-tertiary italic">Не указан</div>
              </td>
              <td class="text-secondary max-w-xl truncate">
                {{ item.description || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination?.pages > 1" class="flex justify-center mt-6 animate-fade-in">
        <q-pagination
          v-model="pagination.page"
          :max="pagination.pages"
          :boundary-links="true"
          :boundary-numbers="true"
          @input="onPageChange"
          color="primary"
          class="w-auto"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state animate-fade-in">
      <q-icon name="phone" size="80px" class="empty-state-icon" />
      <h3 class="empty-state-title">Телефоны не найдены</h3>
      <p class="empty-state-text">Попробуйте изменить поиск</p>
    </div>

    <!-- Toast -->
    <q-toast
      v-if="copiedPhone"
      :message="'Телефон ' + copiedPhone + ' скопирован'"
      color="positive"
      position="top"
      class="toast-modern"
    />

    <q-toast
      v-if="error"
      :message="error"
      color="negative"
      position="top"
      class="toast-modern"
    />
  </q-page>
</template>

<script>
import { ref, computed, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { usePhoneStore } from 'stores/phone'
import { useQuasar } from 'quasar'
import { debounce } from 'quasar'

export default {
  name: 'PagePhones',
  setup() {
    const $q = useQuasar()
    const phoneStore = usePhoneStore()

    const {
      phones,
      loading,
      error,
      pagination
    } = storeToRefs(phoneStore)

    const searchQuery = ref('')
    const copiedPhone = ref(null)

    const debouncedSearch = debounce(async (value) => {
      await phoneStore.fetchPhones({
        search: value || undefined,
        page: 1
      })
    }, 300)

    async function onPageChange(page) {
      await phoneStore.fetchPhones({ ...phoneStore.filters, page })
    }

    async function copyPhone(phone) {
      if (!phone) return
      try {
        await navigator.clipboard.writeText(phone)
        copiedPhone.value = phone
        setTimeout(() => { copiedPhone.value = null }, 2000)
      } catch (e) {
        $q.notify({ message: 'Не удалось скопировать', color: 'negative', position: 'top' })
      }
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

    onBeforeMount(async () => {
      await phoneStore.fetchPhones({ limit: 100 })
    })

    watch(() => phoneStore.error, (err) => {
      if (err) {
        $q.notify({ message: err, color: 'negative', position: 'top' })
      }
    })

    return {
      searchQuery,
      phones,
      loading,
      error,
      pagination,
      copiedPhone,
      formatPhone,
      formatPhoneForTel,
      copyPhone,
      onPageChange
    }
  }
}
</script>

<style scoped>
.input-modern :deep(.q-input__inner) {
  background: var(--bg-elevated) !important;
  border: 1px solid var(--border-light) !important;
  border-radius: var(--radius-md) !important;
  color: var(--text-primary) !important;
}

.input-modern :deep(.q-input__inner:focus) {
  border-color: var(--border-focus) !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
}

.table-container {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.table th,
.table td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}

.table th {
  font-weight: var(--font-semibold);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  background: var(--bg-secondary);
  white-space: nowrap;
}

.table tbody tr {
  transition: background var(--transition-fast);
}

.hover-row:hover {
  background: var(--bg-tertiary) !important;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.animate-fade-in { animation: fadeIn var(--transition-normal) ease-out; }
.animate-slide-up { animation: slideUp var(--transition-normal) ease-out; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
  color: var(--text-secondary);
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  margin-bottom: var(--space-4);
  color: var(--color-neutral-300);
}

[data-theme="dark"] .empty-state-icon {
  color: var(--color-neutral-600);
}

.empty-state-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-text {
  font-size: var(--text-base);
  max-width: 300px;
}
</style>