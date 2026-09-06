<template>
  <q-page class="q-pa-md full-width" style="max-width: 1000px; margin: 0 auto;">
    <div class="row q-mb-md items-center">
      <div class="col-auto">
        <h4 class="text-h6 q-mb-none">Телефоны табельных цехов</h4>
        <div class="text-caption text-grey-7">
          Всего: {{ pagination.total }}
        </div>
      </div>
      <q-space />
      <div class="col-auto">
        <q-input
          v-model="searchQuery"
          @update:model-value="debouncedSearch"
          placeholder="Поиск по номеру цеха..."
          dense
          clearable
          style="width: 250px"
          prefix="<q-icon name='search' />"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="q-overflow-auto">
      <q-table
        :rows="phones"
        :columns="columns"
        row-key="number_tzeh"
        :loading="loading"
        :pagination="pagination"
        flat
        bordered
        separator="cell"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-nuber_phone="props">
          <div class="row items-center q-gutter-xs">
            <div class="col-auto">
              <a :href="'tel:' + formatPhoneForTel(props.value)" class="text-primary">
                {{ formatPhone(props.value) }}
              </a>
            </div>
            <div class="col-auto">
              <q-btn
                size="sm"
                dense
                flat
                round
                icon="content_copy"
                @click="copyPhone(props.value)"
                aria-label="Скопировать телефон"
              />
            </div>
          </div>
        </template>

        <template v-slot:body-cell-description="props">
          <div v-if="props.value" class="text-caption text-grey-7">{{ props.value }}</div>
          <div v-else class="text-caption text-grey-4">—</div>
        </template>
      </q-table>
    </div>

    <!-- Error toast -->
    <q-toast v-if="error" :message="error" color="negative" position="top" />
  </q-page>
</template>

<script>
import { ref, watch, onBeforeMount } from 'vue'
import { usePhoneStore } from 'stores/phone'
import { useQuasar } from 'quasar'
import { debounce } from 'quasar'

export default {
  name: 'PagePhones',
  setup() {
    const $q = useQuasar()
    const phoneStore = usePhoneStore()

    const searchQuery = ref('')

    const { phones, loading, error, pagination } = phoneStore

    const columns = [
      { name: 'number_tzeh', label: 'Цех', field: 'number_tzeh', align: 'center', sortable: true },
      { name: 'nuber_phone', label: 'Телефон', field: 'nuber_phone', sortable: false },
      { name: 'description', label: 'Описание', field: 'description', sortable: false }
    ]

    const formatPhone = (phone) => {
      if (!phone) return ''
      return phone.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3')
    }

    const formatPhoneForTel = (phone) => {
      if (!phone) return ''
      // Remove non-digits
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

    const debouncedSearch = debounce(async (value) => {
      await phoneStore.fetchPhones({ 
        search: value || undefined,
        page: 1
      })
    }, 300)

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
      columns,
      formatPhone,
      formatPhoneForTel,
      copyPhone
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>