<template>
    <aside>
        <div class="slimScrollDiv">
            <div class="sidebar-inner scrollable-sidebar">
                <div class="main-menu">
                    <ul class="accordion">
                       <!-- 首页 -->
                       <template v-for="menu in menus">
                       <li class="bg-palette active aside-index" v-if="menu.isShow && menu.isIndex === 1">
                           <router-link :to="{path: menu.link}" v-if="menu.type == 0">
                               <span class="menu-content block">
                                   <span class="menu-icon"><i v-bind:class="['block', 'icomoon-lg', menu.icon]"></i></span>
                                   <span class="text m-left-sm">{{menu.name}}</span>
                               </span>
                           </router-link>
                           <router-link :to="{path: menu.link}" v-if="menu.type == 1">
                               <span class="menu-content block">
                                   <span class="menu-icon"><i v-bind:class="['block', 'icomoon-lg', menu.icon]"></i></span>
                                   <span class="text m-left-sm">{{menu.name}}</span>
                               </span>
                           </router-link>
                       </li>
                      <!--  其他下拉菜单 -->
                       <li class="openable bg-palette" v-if="menu.isShow && menu.isIndex !== 1">
                           <a href="javascript:void(0)" v-on:click="menuA($event)">
                               <span class="menu-content block">
                                   <span class="menu-icon"><i v-bind:class="['block', 'icomoon-lg', menu.icon]"></i></span>
                                   <span class="text m-left-sm">{{menu.name}}</span>
                                   <span class="submenu-icon"></span>
                               </span>
                           </a>
                           <ul v-if="menu.type == 0" class="submenu">
                               <li v-for="subMenu in menu.subMenus" v-if="subMenu.isShow" v-on:click="menuBremove()">
                                   <router-link :to="{path: subMenu.link}" v-if="subMenu.isShow">
                                       <span class="submenu-label">{{subMenu.name}}</span>
                                   </router-link>
                               </li>
                           </ul>
                           <ul v-if="menu.type == 1" class="submenu">
                               <li v-for="subMenu in menu.subMenus" v-if="subMenu.isShow" v-on:click="menuBremove()">
                                   <router-link :to="{ path: subMenu.link}">
                                       <span class="submenu-label">{{subMenu.name}}</span>
                                   </router-link>
                               </li>
                           </ul>
                       </li>
                       </template>
                    </ul>
                </div>
            </div>
        </div>
    </aside>
</template>
<style lang="less">
    @import '~ne-style/util/variables.less';
        aside {
        position: fixed;
        top: @view-top;
        left:0;
        bottom: 0;
        width: 240px;
        background-color: #1c2b36;
        border-right: 1px solid #ffffff;
        background-color: #ffffff;
        transition:left .5s ease;
        .main-menu {
            ul {
                position: relative;
                list-style: none;
                li {
                    position: relative;
                    background-color: @transparent;
                    border-bottom: 1px solid #ccc;
                    &:before {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        right: 237px;
                        left: 0;
                        content: "";
                        transition:right .4s ease;
                    }
                    &:focus {
                        background-color: #ffffff;
                    }
                    &:hover {
                        background: -webkit-linear-gradient(45deg, #137ec3, #36a1df);
                        background: -o-linear-gradient(45deg, #137ec3, #36a1df);
                        background: -moz-linear-gradient(45deg, #137ec3, #36a1df);
                        background: linear-gradient(45deg, #137ec3, #36a1df);
                        &:before {
                            right: 190px;
                        }
                    }
                    a {
                        position: relative;
                        display: block;
                        padding: 12px 15px 12px 2px;
                        font-size: 11px;
                        font-weight: 600;
                        background: @transparent;
                        color: #333;
                        text-transform: uppercase;
                        outline: none;
                        .menu-icon {
                            display: inline-block;
                            width: 45px;
                            text-align: center;
                            transition:color .4s ease ;
                        }
                        .menu-content {
                            background-color: @transparent;
                        }
                        .menu-content-hover {
                            display: none;
                        }
                        .submenu-icon {
                            position: absolute;
                            top: 12px;
                            right: 10px;
                            &:before {
                                content: "\f105";
                                display: inline-block;
                                font-family: FontAwesome;
                                transition: all .5s ease;
                            }
                        }
                        &:hover {
                            color: #ffffff;
                            text-decoration: none;
                            transition: color .4s ease ;
                            .menu-icon {
                                color: @white-color;
                                transition: color .4s ease ;
                            }
                            &:before {
                                right: 0;
                            }
                        }
                    }
                    .submenu {
                        position: relative;
                        display: none;
                        background-color: #ffffff;
                        li.active {
                            a {
                                .submenu-label {
                                    color: #333;
                                }
                            }
                        }
                        li {
                            a {
                                position: relative;
                                background-color: #ffffff;
                                color: #333;
                                font-weight: normal;
                                padding-top: 9px;
                                padding-bottom: 9px;
                                padding-left: 45px;
                                transition: all .4s ease;
                                .submenu-label {
                                    display: block;
                                    transition: all .4s ease ;
                                }
                                &:hover {
                                    .submenu-label {
                                        color:#137ec3;
                                        transition: all .2s ease ;
                                    }
                                }
                                &.router-link-exact-active{
                                    color:#137ec3;
                                }
                            }
                        }
                    }
                }
                li.open {
                    background: -webkit-linear-gradient(45deg, #137ec3, #36a1df);
                    background: -o-linear-gradient(45deg, #137ec3, #36a1df);
                    background: -moz-linear-gradient(45deg, #137ec3, #36a1df);
                    background: linear-gradient(45deg, #137ec3, #36a1df);
                    &:before {
                        right: 190px;
                    }
                    .submenu {
                        animation: fadeInRIght 0.5s ease;
                    }
                    >a {
                        color: #fff;
                        .menu-icon {
                            color: @white-color;
                        }
                        .submenu-icon {
                            &:before {
                                font-family: FontAwesome;
                                transform: rotate(90deg);
                                transition: all .5s ease ;
                            }
                        }
                    }
                }
                li.menu-header {
                    padding: 14px 15px;
                    font-size: 12px;
                    font-weight: bold;
                    color: #999999;
                    text-transform: uppercase;
                    border-left: 2px solid #e36159;
                    display: none;
                }
                li.line-break {
                    border-top: 1px solid #262626;
                }
                li.bg-palette
                {
                    &:before {
                        background-color: #36a1df;
                    }
                }
                li.active {
                    background: -webkit-linear-gradient(45deg, #137ec3, #36a1df);
                    background: -o-linear-gradient(45deg, #137ec3, #36a1df);
                    background: -moz-linear-gradient(45deg, #137ec3, #36a1df);
                    background: linear-gradient(45deg, #137ec3, #36a1df);
                    &:before {
                        right: 190px;
                    }
                    a {
                        color: @white-color;
                        .menu-icon {
                            color: @white-color;
                        }
                    }
                }
            }
            >ul {
                >li {
                    >a {
                        &:after {
                            content: '';
                            position: absolute;
                            display: block;
                            width: 1px;
                            top: 0;
                            left: 48px;
                            height: 41px;
                            z-index: -1;
                            font-size: 10px;
                            background-color: #ffffff;
                        }
                    }
                }
            }
        }
    }
    /*-------------------动画----------------*/
    aside.animate-to-left{
        left:0 - @view-left;
        animation:animate-to-left ,.5s, forward;
    }

    @keyframes animate-to-left {
        from{left:0}
        to{left: 0 - @view-left}
    }

    aside.animate-to-right{
        left:0;
        animation:animate-to-right ,.5s ,forward;
    }

    @keyframes animate-to-right {
        from{left: - @view-left}
        to{left:0}
    }
</style>
<script>
    import {mapActions} from 'vuex';
    import $ from 'jquery';
    export default{
        data(){
            return{
                menus: [],
                token: ""
            }
        },
        methods: {
            menuA(event){
                let $a = $(event.currentTarget);
                if(!$('aside').hasClass('sidebar-mini') || Modernizr.mq('(max-width: 991px)'))	{
                    if( $a.parent().children('.submenu').is(':hidden') ) {
                        $a.parent().siblings().removeClass('open').children('.submenu').slideUp(200);
                        $a.parent().addClass('open').children('.submenu').slideDown(200);
                    }
                    else{
                        $a.parent().removeClass('open').children('.submenu').slideUp(200);
                    }
                }
                event.preventDefault();
            },

            //清除首页样式
            menuBremove(){
                $('.bg-palette').removeClass('active');
            },
            ...mapActions(['setToken'])
        },
        created(){
            let _this = this;
            _this.$http.get("api/findMenusByResource").then(function(res) {
                let data = res.body;
                if (data.status) {
                    _this.menus = data.menus;
                    _this.token = data.token;
                    _this.setToken(_this.token);
                    for(let i=0;i<_this.menus.length;i++){
                        let menu = _this.menus[i];
                        if(menu.isIndex === 1 && menu.isShow === 1){
                            _this.$router.push({path: menu.link});
                            _this.$store.commit('SET_ASIDE_READY');
                            return;
                        }
                    }
                    _this.$router.push({ path:'/welcome'});
                    _this.$store.commit('SET_ASIDE_READY');
                }
            });
        },
        mounted(){
            let _this = this;
            //首页点击样式
            _this.$nextTick(function(){
                $('.accordion').on('click','.aside-index',function(){
                    if(!$(this).hasClass('active')){
                        $(this).addClass('active');
                    }
                });
            });
        }
    }
</script>
