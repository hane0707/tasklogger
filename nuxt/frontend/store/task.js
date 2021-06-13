export const state = () => ({
  list: [],
  viewList: [],
  count: 0,
  errorFlg: false,
  errorMessage: ''
})

export const mutations = {
  setList: (state, list) => (state.list = list),
  setViewList: (state, viewList) => (state.viewList = viewList),
  setCount: (state, count) => (state.count = count),
  setErrorFlg: (state, flg) => (state.errorFlg = flg),
  setErrorMessage: (state, message) => (state.errorMessage = message),
  removeTask: (state, id) => (state.viewList = state.viewList.filter(task => task.id !== id))
}

export const actions = {
  async getList ({ commit }, date) {
    const list = await this.$axios.$get('/api/task/')

    const viewList = list.filter(
      task => task.start_date === date
    )

    commit('setList', list)
    commit('setViewList', viewList)
    commit('setCount', viewList.length)
  },
  async deleteTask ({ dispatch }, { id, date }) {
    try {
      await this.$axios.$delete(`/api/task/${id}/`)
      dispatch('getList', date)
      // commit('removeTask', id)
      // commit('setCount', state.count - 1)
    } catch (e) {
      console.log(e)
    }
  },
  async registTask ({ dispatch, commit }, { newTask, date }) {
    // タイトルがない場合は"no title"を設定
    newTask.title = newTask.title === '' ? 'no title' : newTask.title

    let response = ''
    try {
      response = await this.$axios.$post('/api/task/', newTask) // eslint-disable-line
    } catch (error) {
      console.log('エラー発生：')
      console.log(error.response)
      commit('setErrorFlg', true)
      commit('setErrorMessage', 'データ登録時にエラーが発生しました。')
    }

    if (response.start_date === date) {
      dispatch('getList', date)
    }
  }
}
