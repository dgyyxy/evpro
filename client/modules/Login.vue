<template>
    <div class="login-wrapper">
        <modal v-model="forgetPasswordModalShow" :backdrop="false"
               v-if="options['MAIL_FUNCTION']">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="resetModal()">
                    <span>×</span></button>
                <h4 class="modal-title">邮箱验证</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                      data-vv-scope="forgetPasswordForm">
                    <div class="form-group">
                        <label for="dsbd-forget-user"
                               class="col-md-3 col-sm-3 control-label form-required">用户名:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" maxlength="15" placeholder="请输入需要找回密码的用户名"
                                   id="dsbd-forget-user" data-vv-as="用户名" name="username"
                                   v-model="forgetPasswordUsername"
                                   v-validate:username="'required|noSpace|min:3|max:15'"
                                   :class="{'input': true, 'is-danger': errors.has('forgetPasswordForm.username') }"/>
                            <i v-show="errors.has('forgetPasswordForm.username')" class="fa fa-warning"></i>
                            <span v-show="errors.has('forgetPasswordForm.username')"
                                  class="help is-danger">{{ errors.first('forgetPasswordForm.username') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="resetModal()">取消
                </button>
                <button type="button" class="btn btn-success" @click="confirmForgetPassword('forgetPasswordForm')">
                    确定
                </button>
            </div>
        </modal>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable>
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
        <div class="login-business">
            <div class="top"></div>
            <div class="bottom"></div>
            <div class="content">
                <div class="brand">
                    {{brand}}
                </div>
                <div class="bg-img">
                    <img :src="loginImg"/>
                </div>
                <div class="login-box-banner">
                    <div class="login-box">
                        <div class="login-inner">
                            <div v-if="error" class="alert alert-danger signin">{{errorMessage}}</div>
                            <form @submit.prevent="login('loginForm')" data-vv-scope="loginForm">
                                <div class="form-group m-bottom-md">
                                    <input type="text" class="form-control" placeholder="用户名" v-model="admin.userName"
                                           @keyup.enter="login" @keydown="error=false;errors.clear('loginForm')" v-validate:username="'required'"
                                           data-vv-as="用户名" name="username"
                                           :class="{'input': true, 'is-danger': errors.has('loginForm.username')}"/>
                                    <span v-show="errors.has('loginForm.username')"
                                          class="help is-danger">{{ errors.first('loginForm.username') }}</span>
                                </div>
                                <div class="form-group">
                                    <input type="password" class="form-control" placeholder="密码" v-model="admin.password"
                                           @keyup.enter="login" @keydown="error=false;errors.clear('loginForm')" v-validate:password="'required'"
                                           data-vv-as="密码" name="password"
                                           :class="{'input': true, 'is-danger': errors.has('loginForm.password')}"/>
                                    <span v-show="errors.has('loginForm.password')"
                                          class="help is-danger">{{ errors.first('loginForm.password') }}</span>
                                </div>
                                <div class="form-group">
                                    <div class="custom-checkbox">
                                        <input type="checkbox" id="chkRemember" v-model="remember" value="true">
                                        <label for="chkRemember"></label>
                                    </div>
                                    记住我
                                    <a href="javascript:void(0)" class="right" @click="showForgetPasswordModal()"
                                       v-if="options['MAIL_FUNCTION']">忘记密码</a>
                                </div>
                                <div class="m-top-md p-top-sm">
                                    <button class="btn btn-success block sign-btn" type="submit">登录</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="login-ps">
                    <div>建议浏览器：Chrome、360、Firefox、Edge、IE11</div>
                    <div>建议分辨率：1366x768及以上</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
    @import '~ne-style/util/variables.less';

    .login-wrapper {
        height: 100%;
        position: relative;
        overflow: hidden;
        .choose-box{
            position: absolute;
            top:30px;
            right:50px;
            z-index: 1;
        }
    }


    @btn-lighten-color:lighten(@btn-color,5%);
    @btn-darken-color:darken(@btn-color,5%);
    .login-business {
        height: 100%;
        background: linear-gradient(90deg,@btn-darken-color, @btn-lighten-color,@btn-darken-color);
        position: relative;
        .top,.bottom{
            left:-25%;
            position: absolute;
            width:150%;
            background-color: @white-color;
        }
        .top{
            top:0;
            height:28%;
            border-bottom-right-radius: 70%;
            border-bottom-left-radius: 70%;
            box-shadow: 0 -18px 66px 20px #333;
        }
        .bottom{
            bottom:0;
            height:42%;
            border-top-right-radius: 70%;
            border-top-left-radius: 70%;
            box-shadow: 0 28px 70px 20px #333;
        }
        .content{
            width:1000px;
            height:100%;
            margin:0 auto;
            position: relative;
            z-index:1;
            .brand{
                width:100%;
                position: absolute;
                top:16%;
                text-align: center;
                font-size:34px;
                color:@btn-color;
                font-family: '微软雅黑';
                letter-spacing:4px;
            }
            .bg-img{
                left:1%;
                width:100%;
                height:354px;
                position: absolute;
                top:23%;
                img{
                    display: block;
                    margin:0 auto;
                }
            }
            .login-box-banner{
                width:100%;
                position: absolute;
                top:34%;
                .login-box{
                    background-color: rgba(255,255,255,.2);
                    width:368px;
                    height:300px;
                    border-radius: 20px;
                    border:solid 1px #fff;
                    margin:0 auto;
                    position: relative;
                    .login-inner{
                        width:340px;
                        height:270px;
                        background-color: @bg-color;
                        position: absolute;
                        left: 0; top: 0; right: 0; bottom: 0;
                        margin:auto;
                        border-radius: 20px;
                        .signin {
                            font-size: 12px;
                            text-align: center;
                            padding: 6px 12px;
                            position: absolute;
                            top:0;
                            width:100%;
                            border-top-left-radius: 20px;
                            border-top-right-radius: 20px;
                        }
                        form {
                            width:80%;
                            margin:44px auto 0;
                            & .m-bottom-md {
                                margin-bottom: 20px;
                            }
                            & .custom-checkbox {
                                display: inline-block;
                                width: 19px;
                                height: 19px;
                                position: relative;
                                margin-right: 5px;
                                top: 1px;
                                input[type=checkbox] {
                                    visibility: hidden;
                                    margin: 0;
                                }
                                label {
                                    cursor: pointer;
                                    position: absolute;
                                    width: 19px;
                                    height: 19px;
                                    padding-left: 0;
                                    margin-top: -2px;
                                    top: 0;
                                    left: 0;
                                    -webkit-border-radius: 2px;
                                    border-radius: 2px;
                                    border: 1px solid #ccc;
                                    background-color: #f9f9f9;
                                    margin-bottom: 0;
                                }
                                label::after {
                                    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
                                    filter: alpha(opacity=0);
                                    opacity: 0;
                                    content: '';
                                    position: absolute;
                                    width: 14px;
                                    height: 8px;
                                    background: transparent;
                                    top: 2px;
                                    left: 2px;
                                    border: 3px solid #fff;
                                    border-top: none;
                                    border-right: none;
                                    transform: rotate(-45deg);
                                    -webkit-transform: rotate(-45deg);
                                    -moz-transform: rotate(-45deg);
                                    -ms-transform: rotate(-45deg);
                                    -o-transform: rotate(-45deg);
                                }
                                input[type=checkbox] {
                                    visibility: hidden;
                                    margin: 0;
                                }
                                input[type=checkbox]:checked + label {
                                    border-color: #2baab1;
                                    background-color: #2baab1;
                                }
                                input[type=checkbox]:checked + label:after {
                                    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
                                    filter: alpha(opacity=100);
                                    opacity: 1;
                                }
                            }
                            & .m-top-md {
                                margin-top: 20px;
                                &.p-top-sm {
                                    margin-bottom: 5px;
                                }
                            }
                            & .p-top-sm {
                                padding-top: 10px;
                            }
                            & .m-bottom-xs {
                                margin-bottom: 5px;
                            }
                            & .font-12 {
                                font-size: 12px;
                            }
                            .sign-btn {
                                width: 100%;
                            }
                        }
                    }
                }
            }
            .login-ps {
                text-align: center;
                font-size: 12px;
                position: absolute;
                bottom: 30px;
                left:0;
                right:0;
                margin:0 auto;
                div {
                    margin-top: 10px;
                }
            }

        }
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import {modal, alert,buttonGroup,radio} from 'vue-strap'
    import loginImg from './common/img/login.png';
    export default {
        data () {
            return {
                admin: {
                    userName: localStorage['dashboard-username'] ? localStorage['dashboard-username']: '',
                    password: localStorage['dashboard-password'] ? localStorage['dashboard-password']: ''
                },
                error: false,
                errorMessage: "",
                remember: false,
                forgetPasswordModalShow: false,
                forgetPasswordUsername: "",
                alert: {
                    isShow: false,
                    type: "",
                    content: ""
                },
                loginImg:loginImg
            }
        },
        computed: mapGetters({
            brand: 'getBrand',
            options: 'getOptions'
        }),
        components: {
            modal, alert ,buttonGroup,radio
        },
        methods: {
            login (scope) {
                this.$validator.validateAll(scope).then(() => {
                    this.$http.post("api/signin", this.admin).then((res) => {
                        if (res.body.status) {
                            //记住帐号密码
                            if (this.remember) {
                                localStorage.setItem('dashboard-username', this.admin.userName);
                                localStorage.setItem('dashboard-password', this.admin.password);
                            }
                            localStorage.setItem('dashboard-loginUI', this.UIMethod);
                            this.error = false;
                            this.$router.push('/');
                        } else {
                            this.error = true;
                            this.errorMessage = res.body.errorMessage;
                        }
                    });

                });
            },
            showForgetPasswordModal(){
                this.forgetPasswordModalShow = true;
            },
            resetModal(){
                this.forgetPasswordUsername = "";
                this.forgetPasswordModalShow = false;
                this.$validator.getErrors().clear('forgetPasswordForm');
            },
            confirmForgetPassword(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    return _this.$http.post('api/forgetPassword', {username: _this.forgetPasswordUsername})
                }).then(function (res) {
                    if (res.body.status) {
                        _this.showAlert({
                            content: "发送成功，请尽快到该用户邮箱修改密码",
                            type: "success"
                        });
                        _this.resetModal();
                    } else {
                        _this.showAlert({
                            content: res.body.errorMessage,
                            type: "danger"
                        });
                    }
                });
            },
            showAlert(options){
                this.alert.isShow = true;
                this.alert.content = options.content;
                this.alert.type = options.type;
            }
        },
        created(){
        }
    }
</script>
