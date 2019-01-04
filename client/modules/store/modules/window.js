/**
 * Created by Caan on 2017/5/19.
 */
import {SET_LOADING_SHOW} from '../mutation-types';
import {SET_LOADING_HIDE} from '../mutation-types';
import {SET_FULL_SCREEN} from '../mutation-types';
import {CANCEL_FULL_SCREEN} from '../mutation-types';
import {SET_LOADING_TIMEOUT} from '../mutation-types';
import $ from 'jquery';

const mutations = {
    [SET_LOADING_SHOW](){
        let dom = document.querySelector('#loading-wrapper');
        if(dom){
            dom.style.display = "block";
        }
    },
    [SET_LOADING_HIDE](){
        let dom = document.querySelector('#loading-wrapper');
        if(dom){
            dom.style.display = "none";
        }
    },
    [SET_FULL_SCREEN](){
        let container = document.querySelector(".main-container");
        $(container).removeClass('animate-fullscreen-to-middlescreen animate-fullscreen-to-normalscreen');
        if($(container).hasClass('animate-to-left')){
            $(container).removeClass('animate-normalscreen-to-fullscreen').addClass('animate-middlescreen-to-fullscreen');
        }else{
            $(container).removeClass('animate-middlescreen-to-fullscreen').addClass('animate-normalscreen-to-fullscreen');
        }
    },
    [CANCEL_FULL_SCREEN](){
        let container = document.querySelector(".main-container");
        $(container).removeClass('animate-middlescreen-to-fullscreen animate-normalscreen-to-fullscreen');
        if($(container).hasClass('animate-to-left')){
            $(container).removeClass('animate-fullscreen-to-normalscreen').addClass('animate-fullscreen-to-middlescreen');
        }else{
            $(container).removeClass('animate-fullscreen-to-middlescreen').addClass('animate-fullscreen-to-normalscreen');
        }
    }
};
const actions = {
    setLoadingTimeout({ commit }, Vue) {
        commit(SET_LOADING_SHOW);
        setTimeout(()=>{
            commit(SET_LOADING_SHOW);
        },800)
    }
};

export default {
    mutations
}