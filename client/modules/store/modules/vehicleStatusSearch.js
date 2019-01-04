/**
 * Created by yong.liu on 2017/5/1.
 */
import {
    SET_WINDOW_ALERT,
    SET_WINDOW_ALERT_HIDE,
    SET_DEVICE_ID,
    SET_GROUPKEYS,
    SET_MONITOR_CODE
} from '../mutation-types'

const state = {
    alert: {
        isShow: false,
        type: "",
        text: ""
    },
    deviceId: "",
    groupKeys: [],
    groupNames:[],
    monitorCode: []
};

const mutations = {
    [SET_WINDOW_ALERT](state, alert){
        alert.isShow = true;
        state.alert = alert;
    },
    [SET_WINDOW_ALERT_HIDE](state){
        state.alert.isShow = false;
    },
    [SET_DEVICE_ID](state, deviceId){
        state.deviceId = deviceId;
    },
    [SET_GROUPKEYS](state, group){
        state.groupKeys = group.groupKeys;
        state.groupNames = group.groupNames;
    },
    [SET_MONITOR_CODE](state, monitorCode){
        state.monitorCode = monitorCode;
    }
};

const actions = {
    setWindowAlert({commit}, alert) {
        commit(SET_WINDOW_ALERT, alert);
        setTimeout(()=>{
            commit(SET_WINDOW_ALERT_HIDE);
        },2000)
    }
};

export default {
    actions,
    state,
    mutations
}