/**
 * Created by yong.liu on 2017/5/1.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import config from './modules/config';
import aside from './modules/aside';
import window from './modules/window';
/*import createLogger from 'vuex/dist/logger';*/
import vehicleStatus from './modules/vehicleStatus';
import vehicleStatusSearch from './modules/vehicleStatusSearch';
import token from './modules/token';
import uploadContentValue from './modules/uploadContentValue';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        window,
        config,
        vehicleStatus,
        vehicleStatusSearch,
        aside,
        token,
        uploadContentValue
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
});