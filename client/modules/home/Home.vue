<template>
    <div class="wrapper">
        <header-component></header-component>
        <aside-component></aside-component>

        <div class="main-container">
            <loading-component></loading-component>
            <transition>
                <router-view :token="token"></router-view>
            </transition>
        </div>
        <footer-component></footer-component>
    </div>
</template>
<style lang="less">
    @import '~ne-style/util/variables.less';
    .wrapper {
        position: relative;
        overflow: hidden;
        height: 100%;
        background-color: @bg-color;
    }
    .main-container {
        position: fixed;
        overflow-x:hidden;
        overflow-y:auto;
        top: @view-top + 15;
        background-color: @white-color;
        right: 15px;
        left: @view-left + @view-padding;
        bottom: @view-bottom + @view-padding;
        transition: left .5s ease;
        z-index:10;
    }
    .state-banner{
        background: -webkit-linear-gradient(45deg, #137ec3, #36a1df);
        background: -o-linear-gradient(45deg, #137ec3, #36a1df);
        background: -moz-linear-gradient(45deg, #137ec3, #36a1df);
        background: linear-gradient(45deg, #137ec3, #36a1df);
    }
    .breadcrumb {
        background: -webkit-linear-gradient(45deg, #137ec3, #36a1df);
        background: -o-linear-gradient(45deg, #137ec3, #36a1df);
        background: -moz-linear-gradient(45deg, #137ec3, #36a1df);
        background: linear-gradient(45deg, #137ec3, #36a1df);
        color: #ffffff;
    }
    .data-table table thead tr th{
        background: #137ec3;
        color: #ffffff;
    }

    /*------------------折叠动画-------------------*/
    .main-container.animate-to-left {
        left: @view-padding;
        animation: animate-to-left, .5s, forward;
        &.animate-fullscreen-to-normalscreen{
            left: @view-padding;
            animation: animate-to-left, .5s, forward;
        }
        &.animate-fullscreen-to-middlescreen{
            left: @view-padding;
            animation: animate-to-left, .5s, forward;
        }
    }

    @keyframes animate-to-left {
        from {
            left: @view-left + @view-padding
        }
        to {
            left: @view-padding
        }
    }

    .main-container.animate-to-right {
        left: @view-left + @view-padding;
        animation: animate-to-right, .5s, forward;
        &.animate-fullscreen-to-normalscreen{
            left: @view-left + @view-padding;
            animation: animate-to-right, .5s, forward;
        }
        &.animate-fullscreen-to-middlescreen{
            left: @view-left + @view-padding;
            animation: animate-to-right, .5s, forward;
        }
    }

    @keyframes animate-to-right {
        from {
            left: @view-padding
        }
        to {
            left: @view-left + @view-padding
        }
    }

    //全屏动画
    //普通屏 → 全屏 → 普通屏
    .main-container.animate-normalscreen-to-fullscreen {
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 1;
        animation: animate-normalscreen-to-fullscreen, .5s, forward;
    }

    @keyframes animate-normalscreen-to-fullscreen {
        from {
            left: @view-padding + @view-left;
            right: @view-padding;
            bottom: @view-bottom + @view-padding;
            top: @view-top + @view-padding;
        }
        to {
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
        }
    }

    .main-container.animate-fullscreen-to-normalscreen {
        left: @view-padding + @view-left;
        right: @view-padding;
        bottom: @view-bottom + @view-padding;
        top: @view-top + @view-padding;
        z-index: 0;
        animation: animate-fullscreen-to-normalscreen, .5s, forward;
    }

    @keyframes animate-fullscreen-to-normalscreen {
        from {
            left: 0;
            top: 0;
            right: 0;
            bottom: 0
        }
        to {
            left: @view-padding + @view-left;
            right: @view-padding;
            bottom: @view-bottom + @view-padding;
            top: @view-top + @view-padding;
        }
    }
    //折叠屏 → 全屏 → 折叠屏
    .main-container.animate-middlescreen-to-fullscreen {
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 1;
        animation: animate-middlescreen-to-fullscreen, .5s, forward;
    }

    @keyframes animate-middlescreen-to-fullscreen {
        from {
            left: @view-padding;
            right: @view-padding;
            bottom: @view-bottom + @view-padding;
            top: @view-top + @view-padding;
        }
        to {
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
        }
    }

    .main-container.animate-fullscreen-to-middlescreen {
        left: @view-padding;
        right: @view-padding;
        bottom: @view-bottom + @view-padding;
        top: @view-top + @view-padding;
        z-index: 0;
        animation: animate-fullscreen-to-middlescreen, .5s, forward;
    }

    @keyframes animate-fullscreen-to-middlescreen {
        from {
            left: 0;
            top: 0;
            right: 0;
            bottom: 0
        }
        to {
            left: @view-padding;
            right: @view-padding;
            bottom: @view-bottom + @view-padding;
            top: @view-top + @view-padding;
        }
    }

</style>
<script>

    import {mapGetters} from 'vuex';
    import LoadingComponent from './Loading.vue';
    import HeaderComponent from './Header.vue';
    import FooterComponent from './Footer.vue';
    import AsideComponent  from './Aside.vue';
    import $ from 'jquery';
    import niceScroll from 'jquery.nicescroll';
    

    export default {
        data () {
            return {
            }
        },
        components: {
            HeaderComponent,
            FooterComponent,
            AsideComponent,
            LoadingComponent
        },
        methods:{
        },
        computed:{
            
            ...mapGetters(['token'])
        },
        mounted(){
            $("#app").niceScroll(".main-container",{
            cursorcolor: "#ccc",
            autohidemode:"cursor",
            boxzoom:true,zindex:9999,
            autohidemode: true});
        }
    }
</script>