<template>
  <q-page class="flex flex-center">
    <div v-if="loading" class="full_width" style="height: 100vh">
      <q-spinner-pie color="orange" size="7.5em" />
    </div>
    <div v-else>
      <div class="row q-col-gutter-md q-mb-md">
        <poisk_tzeh v-model="filter"></poisk_tzeh>
      </div>
      <div class="row q-col-gutter-md">
        <q-card v-for="item in zayavki" :key="item._id || item.id" class="my-card q-mb-md col-12 col-md-6 col-lg-4">
          <q-card-section>
            <zayavka 
              :tzeh="item.tzeh" 
              :professia="item.professia" 
              :description="item.description" 
              :date="item.date"
              :id="item._id || item.id"
              :requirements="item.requirements"
              :salary_min="item.salary_min"
              :salary_max="item.salary_max"
              :schedule="item.schedule"
              :experience_required="item.experience_required"
              :contact_name="item.contact_name"
              :contact_phone="item.contact_phone"
              :contact_email="item.contact_email"
              :status="item.status"
            >
            </zayavka>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import keys from '@/keys/keys.dev';
// import axios from "src/boot/axios";
import { api } from 'boot/axios'
import zayavka from "src/components/ui/Zayavka.vue";
import poisk_tzeh from "src/components/ui/poisk_tzeh";
import { onBeforeMount, onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "PageIndex",
  components: { zayavka, poisk_tzeh },
  setup() {
    var loading = ref(false);
    const store = useStore();
    const filter = ref({});



    onBeforeMount(async () => {
      loading.value = true;
      await store.dispatch("requests/getallZayavka");
      loading.value = false;

    });

    onMounted(() => {

    });

    // localStorage.setItem("zayavki", JSON.stringify(store.getters["requests/getAllzayavki"]));
    // var s1 = localStorage.getItem('zayavki')

    // const zayavki = computed(() =>
    //   api.get(`${keys.BASE_URL}/getallZayavka`)
    //     .then((response) => {
    //       console.log(response.data)
    //       response.data
    //         .filter((zayavk) => {
    //           if (filter.value.tzeh) {
    //             return zayavk.tzeh.includes(filter.value.tzeh);
    //           }
    //           return zayavk;
    //         })
    //         .filter((zayavk) => {
    //           if (filter.value.professia) {
    //             return zayavk.professia.includes(filter.value.professia);
    //           }
    //           return zayavk;
    //         })
    //     })
    //   // store.getters["requests/getAllzayavki"]

    // );


    const zayavki = computed(() => {
      if (!store.getters["requests/getAllzayavki"]) return [];
      return store.getters["requests/getAllzayavki"];
    });

    return {
      loading,
      zayavki,
      filter,
    };
  },
};
</script>
<style scoped>
.full_width {
  display: flex;
  justify-content: center;
  align-items: center;
}
.my-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  background: #fff;
  transition: box-shadow 0.2s;
}
.my-card:hover {
  box-shadow: 0 4px 24px rgba(25, 118, 210, 0.18);
}
@media (max-width: 600px) {
  .my-card {
    margin-bottom: 12px;
  }
}
</style>
