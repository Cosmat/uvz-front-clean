import axios from "axios";
import keys from '@/keys/keys.dev';

export const getallZayavka = async ({ state, commit }) => {
  try {
    if (Array.isArray(state.zayavki) && state.zayavki.length) return;
    const data = await axios.get(`${keys.BASE_URL}/getallZayavka`);
    commit("setZayavki", data);
  } catch (e) {
    console.log(e);
    throw new Error();
  }
};

export const getallDeshife = async ({ state, commit }) => {
  try {
    if (Array.isArray(state.deshife) && state.deshife.length) return;
    const data = await axios.get(`${keys.BASE_URL}/get_Deshife`);
    commit("setDeshife", data);
  } catch (e) {
    console.log(e);
    throw new Error();
  }
};

export const getallPhoneTabel = async ({ state, commit }) => {
  try {
    if (Array.isArray(state.phone_tabel) && state.phone_tabel.length) return;
    const data = await axios.get(`${keys.BASE_URL}/get_phone_tabel`);
    commit("setPhoneTabel", data);
  } catch (e) {
    console.log(e);
    throw new Error();
  }
};
