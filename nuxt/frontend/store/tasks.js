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
  setRegistTask: (state, task) => {
    state.list.unshift(task)
    // state.list.unshift(task)
  }
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
  async registTask ({ dispatch }, { newTask, date }) {
    newTask.title = newTask.title === '' ? 'no title' : newTask.title

    let response = ''
    try {
      response = await this.$axios.$post('/api/tasks/', newTask) // eslint-disable-line
    } catch (error) {
      console.log(error.response)
    }

    if (response.start_date === date) {
      dispatch('getList', date)
    }
  }
}
