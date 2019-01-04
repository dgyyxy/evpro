<template>
    <div class="retrieve-wrapper no-navigation">
        <div class="retrieve-box">
            <div class="retrieve-title text-center">
                <strong class="text-skin" id="signinTitle">修改密码</strong>
            </div>
            <div class="retrieve" v-if="userId">
                <form @submit.prevent="updatePassword('updatePassord')" data-vv-scope="updatePassord">
                    <div class="form-group has-icon-right">
                        <input type="password" class="form-control" placeholder="请输入密码" v-model="newPassword.password"
                               @keydown="error=false;"
                               v-validate:password="'required|min:6|max:18'"
                               data-vv-as="密码" name="password"
                               :class="{'input': true, 'is-danger': errors.has('updatePassord.password')}"/>
                        <span v-show="errors.has('updatePassord.password')"
                              class="help is-danger">{{ errors.first('updatePassord.password') }}</span>
                    </div>
                    <div class="form-group has-icon-right">
                        <input type="password" class="form-control" placeholder="请输入确认密码"
                               v-model="newPassword.confirmPassword"
                               @keydown="error=false;"
                               v-validate:confirmPassword="'required|confirmed:password'"
                               data-vv-as="确认密码" name="confirmPassword"
                               :class="{'input': true, 'is-danger': errors.has('updatePassord.confirmPassword')}"/>
                        <span v-show="errors.has('updatePassord.confirmPassword')"
                              class="help is-danger">{{ errors.first('updatePassord.confirmPassword') }}</span>
                    </div>
                    <div class="m-top-md p-top-sm">
                        <button class="btn btn-success block retrieve-btn" type="submit">修改密码</button>
                    </div>
                </form>
            </div>
        </div>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable>
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<style lang="less" scoped>
    @import '~ne-style/util/variables.less';
    .retrieve-wrapper {
        position: relative;
        overflow: hidden;
        padding-top: 54px;
        min-height: 100%;
        padding-bottom: 45px;
        background-color:@bg-color;
        & .retrieve-box {
            padding-top: 80px;
            & .retrieve-title {
                font-size: 30px;
                color: #333;
                margin-bottom: 30px;
                & .text-skin {
                    color: @btn-color;
                }
            }
            & .retrieve {
                width: 370px;
                margin-left: auto;
                margin-right: auto;
                & .text-center {
                    text-align: center;
                }
                form {
                    & .retrieve-btn{
                        width: 100%;
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
                }
            }
        }
    }

</style>
<script>
    import {alert} from 'vue-strap'
    export default {
        data () {
            return {
                userId: "",
                newPassword: {
                    password: '',
                    confirmPassword: ''
                },
                alert: {
                    isShow: false,
                    type: "",
                    content: ""
                }
            }
        },
        components: {
            alert
        },
        methods: {
            updatePassword(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    let param = {
                        _id: _this.userId,
                        password: _this.newPassword.password
                    };
                    return _this.$http.post('api/retrievePassword', param)
                }).then(function (res) {
                    if (res.body.status) {
                        _this.showAlert({
                            content: "修改成功，3秒后前往登录页面",
                            type: "success"
                        });
                        setTimeout(()=>{
                            _this.$router.push('/login');
                        },3000);
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
            function getQueryString(name) {
                let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                let r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return "";
            }
            let token = getQueryString("token");
            this.$http.post('api/retrievePasswordCheckToken', {token: token}).then((res) => {
                if (res.body.status) {
                    this.userId = res.body.userId;
                } else {
                    this.showAlert({
                        type: "danger",
                        content: res.body.errorMessage
                    });
                    setTimeout(()=>{
                        this.$router.push('/login');
                    },3000);
                }
            })
        }
    }
</script>
