import { api } from 'boot/axios'
import { error } from '../../utils/error.js'

export const login = async ({ commit, dispatch }, formData) => {
  try {
    const { data } = await api.post('/admin/login', {
      ...formData,
    })
    const token = data.token
    const Name = data.Name
    const id = data.id
    commit('setToken', { token, Name, id })
    commit('clearMessage', null, { root: true })
  } catch (e) {
    dispatch(
      'setMessage',
      {
        value: error(e.response.data.message),
        type: 'danger',
      },
      { root: true }
    )
    throw new Error()
  }
}

export const createUser = async ({ dispatch }, formData) => {
  try {
    const { data } = await api.post('/admin/create', {
      ...formData,
    })
    console.log(data)
  } catch (e) {
    dispatch(
      'setMessage',
      {
        value: error(e.response.message),
        type: 'danger',
      },
      { root: true }
    )
    throw e
  }
}