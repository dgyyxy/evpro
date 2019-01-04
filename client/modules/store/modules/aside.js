/**
 * Created by yong.liu on 2017/5/1.
 */
import {SET_ASIDE_READY} from '../mutation-types'
import {SET_FRAME_URL} from '../mutation-types'

const state = {
    asideReady: 0,
    frameUrl:""
};

const getters = {
    getFrameUrl: state => state.frameUrl
};

const mutations = {
    [SET_ASIDE_READY](state){
        state.asideReady = 1;
    },
    [SET_FRAME_URL](state,url){
        state.frameUrl = url;
    }
};

export default {
    state,
    getters,
    mutations
}