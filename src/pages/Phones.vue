<template>
  <q-page class="page-wrap">
    <!-- Hero header -->
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1 class="hero-title">Телефоны цехов</h1>
          <p class="hero-sub">
            Табельные телефоны Уралвагонзавода ·
            <span class="hero-count">{{ pagination?.total || 0 }}</span> номеров
          </p>
        </div>
      </div>
    </div>

    <!-- Search toolbar (always visible) -->
    <div class="toolbar">
      <q-input
        v-model="searchQuery"
        @update:model-value="debouncedSearch"
        placeholder="Поиск по номеру цеха…"
        dense
        clearable
        outlined
        class="toolbar-search"
      >
        <template v-slot:prepend>
          <q-icon name="search" class="toolbar-icon" />
        </template>
      </q-input>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading && (phones?.length === 0)" class="table-card">
      <div v-for="i in 10" :key="'sk' + i" class="sk-row">
        <div class="sk-line" style="width: 70px"></div>
        <div class="sk-line" style="width: 45%"></div>
        <div class="sk-line" style="flex: 1"></div>
      </div>
    </div>

    <!-- Table -->
    <div v-else-if="phones && phones.length > 0" class="table-card">
      <table class="phone-table">
        <thead>
          <tr>
            <th class="col-tzeh">Цех</th>
            <th class="col-phone">Телефон</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in phones"
            :key="item._id || item.number_tzeh"
            class="phone-row"
          >
            <td class="col-tzeh">
              <span class="tzeh-chip">Цех {{ item.number_tzeh }}</span>
            </td>
            <td class="col-phone">
              <div v-if="item.phone_number" class="phone-cell">
                <i class="fas fa-phone phone-icon"></i>
                <a :href="'tel:' + formatPhoneForTel(item.phone_number)" class="phone-link">
                  {{ formatPhone(item.phone_number) }}
                </a>
                <button
                  class="copy-btn"
                  @click="copyPhone(item.phone_number)"
                  aria-label="Скопировать телефон"
                  title="Скопировать"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <span v-else class="phone-empty">—</span>
            </td>
            <td class="col-desc">
              <span v-if="item.description">{{ item.description }}</span>
              <span v-else class="phone-empty">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <i class="fas fa-phone empty-icon"></i>
      <h3>Номера не найдены</h3>
      <p>Попробуйте изменить поисковый запрос</p>
      <q-btn unelevated rounded color="primary" label="Сбросить" @click="clearSearch" />
    </div>

    <!-- Pagination -->
    <div v-if="pagination?.pages > 1 && !loading" class="pagination-wrap">
      <q-pagination
        v-model="pagination.page"
        :max="pagination.pages"
        :boundary-links="true"
        :boundary-numbers="true"
        @input="onPageChange"
        color="primary"
        rounded
      />
    </div>

    <!-- Error toast -->
    <q-toast v-if="error" :message="error" color="negative" position="top" />
  </q-page>
</template>

<script>
import { ref, watch, onBeforeMount } from 'vue'
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

    const formatPhone = (phone) => {
      if (!phone) return ''
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 11 && cleaned[0] === '7') {
        return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
      }
      if (cleaned.length === 10) {
        return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`
      }
      return phone
    }

    const formatPhoneForTel = (phone) => {
      if (!phone) return ''
      return phone.replace(/\D/g, '')
    }

    async function copyPhone(phone) {
      if (!phone) return
      try {
        await navigator.clipboard.writeText(phone)
        $q.notify({ message: 'Телефон скопирован', color: 'positive', position: 'top' })
      } catch (e) {
        $q.notify({ message: 'Не удалось скопировать', color: 'negative', position: 'top' })
      }
    }

    async function clearSearch() {
      searchQuery.value = ''
      await phoneStore.fetchPhones({ page: 1 })
    }

    const debouncedSearch = debounce(async (value) => {
      await phoneStore.fetchPhones({
        search: value || undefined,
        page: 1
      })
    }, 300)

    async function onPageChange(page) {
      await phoneStore.fetchPhones({
        search: searchQuery.value || undefined,
        page
      })
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
      phones,
      loading,
      error,
      pagination,
      searchQuery,
      formatPhone,
      formatPhoneForTel,
      copyPhone,
      clearSearch,
      onPageChange
    }
  }
}
</script>

<style scoped>
.page-wrap {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  margin: 0 -16px;
  padding: 36px 16px 32px;
}

.hero-inner {
  max-width: 968px;
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

.hero-count {
  font-weight: 700;
  color: #ffffff;
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  margin-top: -22px;
  position: relative;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
}

.toolbar-search {
  flex: 1 1 260px;
}

.toolbar-icon {
  color: #94a3b8;
}

/* Table card */
.table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 16px;
}

.phone-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.phone-table th,
.phone-table td {
  padding: 11px 16px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.phone-table th {
  font-weight: 700;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  background: #f8fafc;
}

.phone-row:hover {
  background: #f4f7fd;
}

.phone-row:last-child td {
  border-bottom: none;
}

.col-tzeh {
  width: 100px;
}

.tzeh-chip {
  font-size: 12px;
  font-weight: 700;
  color: #1d4ed8;
  background: #eff6ff;
  border-radius: 999px;
  padding: 4px 12px;
  white-space: nowrap;
}

.col-phone {
  width: 230px;
}

.phone-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.phone-icon {
  color: #2563eb;
  font-size: 13px;
}

.phone-link {
  color: #0f172a;
  font-weight: 600;
  text-decoration: none;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 13px;
}

.phone-link:hover {
  color: #2563eb;
}

.copy-btn {
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  font-size: 13px;
  padding: 4px 6px;
  border-radius: 6px;
  transition: all 0.12s ease;
}

.copy-btn:hover {
  color: #2563eb;
  background: #eff6ff;
}

.phone-empty {
  color: #cbd5e1;
}

.col-desc {
  color: #64748b;
  line-height: 1.5;
}

/* Skeleton */
.sk-row {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.sk-line {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 64px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 14px;
  display: block;
}

.empty-state h3 {
  margin: 0 0 6px;
  font-size: 18px;
  color: #0f172a;
}

.empty-state p {
  margin: 0 0 18px;
  font-size: 14px;
}

/* Pagination */
.pagination-wrap {
  display: flex;
  justify-content: center;
  padding: 28px 0 8px;
}
</style>