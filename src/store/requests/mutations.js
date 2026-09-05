export const setZayavki = (state, payload) => {
  state.zayavki = Array.from(payload.data.reverse());
};

export const setDeshife = (state, payload) => {
  state.deshife = Array.from(payload.data);
};

export const setPhoneTabel = (state, payload) => {
  state.phone_tabel = Array.from(payload.data);
};
