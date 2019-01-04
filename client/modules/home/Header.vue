<template>
    <header>
            <div class="header-title">
                <a class="brand">
                    <img src="../common/images/logo.png" width="60" height="29"/><span class="brand-name">{{brand}}</span>
                </a>
            </div>
            <div class="header-container">
                <a href="javascript:void(0)" class="glyphicon glyphicon-align-justify header-sidebar-toggle" @click="sidebarToggle"></a>
                <a href="javascript:void(0)" class="glyphicon glyphicon-repeat header-iframe-refresh" @click="iframeRefresh"></a>
                <div class="pull-right m-right-sm">
                    <div class="header-user-block">
                        <div class="header-user-detail inline-block">
                            <router-link to="/personalCenter">
                                <Icon type="android-person" style="font-size:21px;"></Icon>&nbsp;&nbsp;{{userName}}
                            </router-link>
                            &nbsp;&nbsp;
                            <a href="javascript:void(0);" @click="logout"><Icon type="log-out" style="font-size:21px;"></Icon>&nbsp;&nbsp;登出</a>
                        </div>
                    </div>
                </div>
            </div>
    </header>
</template>
<style lang="less">
    @import '~ne-style/util/variables.less';
    header{
        position: fixed;
        height: 54px;
        background-color: #468FE3;
        left: 0;
        right: 0;
        top: 0;
        z-index:1;
        border-top: 2px solid #2baab1;
        &::after {
            content: "";
            display: block;
            height:0;
            clear: both;
        }
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
        transition: all .5s ease;
        .header-title {
            position: relative;
            float: left;
            width: 240px;
            text-align: center;
            .brand {
                display: block;
                font-size: 14px;
                font-weight: 600;
                padding: 0 10px 0 20px;
                color: #ffffff;
                line-height: @view-top - 2;
                .brand-name {
                    margin-left: 5px;
                }
            }
        }
        .header-container {
            margin-left: 240px;
            &:after {
                content: "";
                display: block;
                height:0;
                clear: both;
            }
             a{color:white;}
            .header-sidebar-toggle,.header-iframe-refresh{
                font-size:21px;
                line-height: @view-top - 2;
                margin-left:20px;
            }
            .header-user-block {
                position: relative;
                float: left;
                display: block;
                margin-right: 20px;
                padding: (@view-top - 32)/2 0;
                outline: none;
                .header-user-detail {
                    display: inline-block;
                    margin-left: 10px;
                    line-height: 32px;
                    color: #ffffff;
                    .user-role{
                        margin-right: 10px;
                    }
                }
                .header-user-panel {
                    min-width: 120px;
                    z-index: 20;
                    position: absolute;
                    border: 1px solid #eee;
                    top: @view-top - 2;
                    right:-8px;
                    padding: 0;
                    ul {
                        list-style: none;
                        margin-top: 0;
                        margin-bottom: 0;
                        li {
                            a {
                                display: block;
                                padding: 4px 20px;
                                color: #666666;
                                white-space: normal;
                                outline: none;
                                transition: all .2s ease ;
                                &:hover {
                                    background: #f4f8fb;
                                    text-decoration: none;
                                    outline: none;
                                    transition: all .2s ease;
                                }
                                &:focus {
                                    background: #f4f8fb;
                                    text-decoration: none;
                                    outline: none;
                                    transition: all .2s ease ;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<script>
    import { mapGetters, mapActions } from 'vuex';
    import $ from 'jquery';
    export default{
        data(){
            return{
                userName: "",
                systemLogCount:0,
                adminRoles:[],
                userPanelShow:false,
                userPanelCloseTimer:null
            }
        },
        computed: mapGetters({
            brand: 'getBrand',
            frameUrl:'getFrameUrl'
        }),
        methods: {
            logout(){
                let _this = this;
                _this.$http.post('api/logout').then(function(reponse){
                    if(reponse.body){
                        _this.$router.push("/login");
                    }
                });
            },
            sidebarToggle(){
                if($('aside').offset().left === 0){
                    $('aside,.main-container,footer').removeClass('animate-to-right').addClass('animate-to-left');
                }else{
                    $('aside,.main-container,footer').removeClass('animate-to-left').addClass('animate-to-right');
                }
            },
            iframeRefresh(){
                let freshUrl=this.$route.path;
                this.$router.push({path: '/welcome'});
                this.$router.go(-1);
            },
            userToggle(){
                this.userPanelShow = !this.userPanelShow;

                $(document).one("click",  ()=> {
                    this.userPanelShow = false;
                });
            }
        },
        created(){
            let _this = this;
            _this.$http.get('api/adminBySessionId').then(function(res){
                if(res.body.status === 1){
                    let result = res.body.data;
                    _this.adminRoles = result.adminRoles.length ? result.adminRoles : [];
                    _this.userName = result.username;
                }
            });
        },
        mounted(){
        }
    }
</script>
