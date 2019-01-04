/**
 * Created by yong.liu on 2017/5/1.
 */
import { SET_TOKEN } from '../mutation-types'

const state = {
    token: ''
};

const mutations = {
    [SET_TOKEN](state, payload){
        state.token = payload;
    }
};

const actions = {
    setToken({commit, state}, payload) {
        commit(SET_TOKEN, payload);
    }
};

const getters = {
    token:(state)=>{
        return state.token;
    }
}

export default {
    actions,
    state,
    mutations,
    getters
}