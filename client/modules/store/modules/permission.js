import { SET_PERMISSION } from '../mutation-types'

const state = {
    permission: ''
};

const mutations = {
    [SET_PERMISSION](state, payload){
        state.permission = payload;
    }
};

const actions = {
    setPermission({commit, state}, payload) {
        commit(SET_PERMISSION, payload);
    }
};

const getters = {
    permission:(state)=>{
        return state.permission;
    }
}

export default {
    actions,
    state,
    mutations,
    getters
}