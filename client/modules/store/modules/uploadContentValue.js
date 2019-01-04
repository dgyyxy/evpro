/**
 * Created by yong.liu on 2017/5/1.
 */
import { SET_UPLOADCONTENTVALUE } from '../mutation-types'

const state = {
    uploadContentValue: ''
};

const mutations = {
    [SET_UPLOADCONTENTVALUE](state, payload){
        state.uploadContentValue = payload;
    }
};

const actions = {
    setUpLoadContent({commit, state}, payload) {
        commit(SET_UPLOADCONTENTVALUE, payload);
    }
};

const getters = {
    uploadContentValue:(state)=>{
        return state.uploadContentValue;
    }
}

export default {
    actions,
    state,
    mutations,
    getters
}