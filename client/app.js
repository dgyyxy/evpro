/**
 * Created by yong.liu on 2017/4/29.
 */
 /*公共*/
import Vue from 'vue';
import VueRouter from 'vue-router';
import Resource from 'vue-resource';
import zpagenav from 'vue-pagenav';
import VeeValidate from 'vee-validate';
import './modules/common/validator';

import { 
    DateFormat,
    VehicleStatusFilter,
    StatusFilter,
    ContactTypeFilter,
    activeDateFilter,
    activeYearFilter,
    TservicePackageStatusFilter,
    genderFilter,
    openerFilter,
    DateFilter,
    handleStateFilter,
    trueFalseFilter,
    DefaultFilter,
    InstructionsFilter,
    VehicleCodeFilter,
    VehicleDataFilter
} from './modules/common/vueFilter';

import cn from './modules/common/zh_CN';
import {mobile, noSpace ,ICCID,idCard} from './modules/common/validator';
import NE_VALIDATE from './modules/base'

Vue.use(NE_VALIDATE)

Vue.use(VueRouter);

Vue.use(Resource);

Vue.filter('DateFormat', DateFormat);
Vue.filter('VehicleStatusFilter', VehicleStatusFilter);
Vue.filter('StatusFilter', StatusFilter);
Vue.filter('ContactTypeFilter', ContactTypeFilter);
Vue.filter('activeDateFilter', activeDateFilter);
Vue.filter('activeYearFilter', activeYearFilter);
Vue.filter('TservicePackageStatusFilter', TservicePackageStatusFilter);
Vue.filter('genderFilter', genderFilter);
Vue.filter('openerFilter', openerFilter);
Vue.filter('DateFilter', DateFilter);
Vue.filter('handleStateFilter', handleStateFilter);
Vue.filter('trueFalseFilter', trueFalseFilter);
Vue.filter('DefaultFilter', DefaultFilter);
Vue.filter('InstructionsFilter', InstructionsFilter);
Vue.filter('VehicleCodeFilter', VehicleCodeFilter);
Vue.filter('VehicleDataFilter', VehicleDataFilter);

//验证器
const config = {
    errorBagName: 'errors', // change if property conflicts.
    fieldsBagName: 'fields',
    delay: 0,
    locale: 'zh_CN',
    dictionary: null,
    strict: true,
    enableAutoClasses: false,
    classNames: {
        touched: 'touched', // the control has been blurred
        untouched: 'untouched', // the control hasn't been blurred
        valid: 'valid', // model is valid
        invalid: 'invalid', // model is invalid
        pristine: 'pristine', // control has not been interacted with
        dirty: 'dirty' // control has been interacted with
    }
};

Vue.use(VeeValidate, config);

zpagenav.default.template = `<nav class="zpagenav">` +
    `<span class="pagination page-link m-r-1">总数:{{total}}</span>` +
    `<ul class="pagination">` +
    `<li :key="index" v-for="(unit,index) in units" :class="'page-item ' + unit.class" :disabled="unit.disabled">` +
    `<a @click.prevent="setPage(unit.page)" class="page-link" :href="setUrl(unit)" :aria-label="unit.ariaLabel">` +
    `<span v-if="unit.isPager" aria-hidden="true" v-html="unit.html"></span>` +
    `<span v-else v-html="unit.html"></span>` +
    `<span v-if="unit.isPager" class="sr-only" v-html="unit.srHtml"></span>` +
    `</a>` +
    `</li>` +
    `</ul>` +
    `</nav>`;
Vue.use(zpagenav);

import iView from 'iview';
Vue.use(iView);

import 'iview/dist/styles/iview.css';
import "ztree";
import "ztree/css/zTreeStyle/zTreeStyle.css";
import './modules/common/menuFonts/fonts.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery-treetable/css/jquery.treetable.css';
import 'jquery-treetable/css/jquery.treetable.theme.default.css';
import './style/app.css';

import 'bootstrap/dist/js/bootstrap.min.js';
import 'ne-style/index/main.less';
import store from './modules/store';
import filters from "./modules/common/filter.js";
import App from './modules/App.vue';
import routes from './routes';

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

const router = new VueRouter({
    routes: routes
});

Vue.http.interceptors.push((request, next) => {
    if (request.method === 'GET') {
        request.headers.map["If-Modified-Since"] = ["0"];       //IEget缓存解决
    }
    if (!request.headers.map["No-Loading"]) {
        store.commit('SET_LOADING_SHOW');                   //默认有loading
    }
    next((response) => {
        store.commit('SET_LOADING_HIDE');
        if (response.status === 401) {
            router.push('/login');                  //没有权限弹出去
        }
        if (String(response.status)[0] === '5') {
            alert('服务器内部错误');   //服务器内部错误
        }
    });
});

window.vm = new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
});