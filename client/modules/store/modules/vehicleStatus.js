/**
 * Created by yong.liu on 2017/5/1.
 */
import {SET_ALERT_LEVEL} from '../mutation-types'

const state = {
    alertLevels:[]
};

const mutations = {
    [SET_ALERT_LEVEL](state, alertLevels){
        state.alertLevels = alertLevels;
    }
};

export default {
    state,
    mutations
}