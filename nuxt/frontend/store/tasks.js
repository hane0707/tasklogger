// import moment from 'moment'

export const state = () => ({
  list: [],
  viewList: [],
  count: 0
})

export const mutations = {
  setList: (state, list) => (state.list = list),
  setViewList: (state, viewList) => (state.viewList = viewList),
  setCount: (state, count) => (state.count = count),
  removeTask: (state, id) => (state.viewList = state.viewList.filter(task => task.id !== id)),
  setRegistTask: (state, task) => state.list.unshift(task)
}

export const actions = {
  async getList ({ commit }, date) {
    const list = await this.$axios.$get('/api/tasks/')

    const viewList = list.filter(
      task => task.start_date === date
    )

    commit('setList', list)
    commit('setViewList', viewList)
    commit('setCount', viewList.length)
  },
  async deleteTask ({ dispatch }, { id, date }) {
    try {
      await this.$axios.$delete(`/api/tasks/${id}/`)
      dispatch('getList', date)
      // commit('removeTask', id)
      // commit('setCount', state.count - 1)
    } catch (e) {
      console.log(e)
    }
  },
  async registTask ({ commit }, newTask) {
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }
    const formData = new FormData()
    for (const data in newTask) {
      formData.append(data, newTask[data])
    }
    try {
      const response = await this.$axios.$post('/api/tasks/', formData, config) // eslint-disable-line
      commit('setRegistTask', response.data)
    } catch (e) {
      console.log(e)
    }
  }
}
