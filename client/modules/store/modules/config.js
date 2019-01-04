/**
 * Created by yong.liu on 2017/5/1.
 */
import {SET_CONFIG} from '../mutation-types'

const state = {
    config: {}
};

const getters = {
    getConfig:state => state.config,
    getBrand: state => state.config.brand,
    getCopyright: (state) => {
        if(state.config.copyright){
            return state.config.copyright
        }else{
            return {}
        }
    },
    getOptions: (state) => {
        if(state.config.options){
            return state.config.options
        }else{
            return {}
        }
    }
};

const actions = {
    setConfig({ commit, state }, Vue) {
        Vue.$http.get('api/config', {params: {}}).then( response => {
            let config = response.body;
            commit(SET_CONFIG, config);
        });
    }
};

const mutations = {
    [SET_CONFIG](state, config){
        state.config = config;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}