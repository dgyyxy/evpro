<template>
    <div class="auto-scroll">
        <ul class="breadcrumb">
            <li>用户中心</li>
            <li>个人信息管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body clearfix">
                    <button type="button" class="btn btn-sm btn-success right" v-on:click="showModifyModal()">
                        修改密码
                    </button>
                    <button type="button" class="btn btn-sm btn-success right m-right-sm" v-on:click="showEditModal()">信息编辑
                    </button>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th colspan="2">账号信息列表</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="text-align-right">账户名</td>
                    <td v-text="userData.username"></td>
                </tr>
                <tr>
                    <td class="text-align-right">邮箱</td>
                    <td v-text="userData.email"></td>
                </tr>
                <tr>
                    <td class="text-align-right">姓名</td>
                    <td v-text="userData.name"></td>
                </tr>
                <tr>
                    <td class="text-align-right">手机号</td>
                    <td v-text="userData.mobile"></td>
                </tr>
                <tr>
                    <td class="text-align-right">角色</td>
                    <td v-if="userData.adminRoles.length">
                        <span v-for="adminRole in userData.adminRoles">{{adminRole.name}} </span>
                    </td>
                    <td v-if="userData.adminRoles.length === 0">
                    </td>
                </tr>
                <tr>
                    <td class="text-align-right">组织机构</td>
                    <td>
                        {{userData.org ? userData.org.name : ''}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <modal v-model="editModalShow" :backdrop="false" class="absolute-box">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="errors.clear('personalEditForm');editModalShow=false">
                    <span>×</span></button>
                <h4 class="modal-title">编辑账户</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                      data-vv-scope="personalEditForm">
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">用户名:</label>
                        <div class="col-md-6 col-sm-6">
                            <input type="text" class="form-control"
                                   v-model="userData.username" readonly/>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">角色:</label>
                        <div class="col-md-6 col-sm-6">
                            <input type="text" class="form-control"
                                   v-model="userData.adminRoles[0].name" readonly/>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">组织机构:</label>
                        <div class="col-md-6 col-sm-6">
                            <input type="text" class="form-control"
                                   v-model="userData.org.name" readonly/>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editEmail" class="col-md-3 col-sm-3 control-label form-required">邮箱:</label>
                        <div class="col-md-6 col-sm-6 has-icon-right">
                            <input type="text" class="input form-control" placeholder="邮箱" id="editEmail" name="email"
                                   v-model="update.email" v-validate:email="'required|neEmail'" data-vv-as="邮箱" @keydown="errors.clear('personalEditForm')"
                                   :class="{'is-danger': errors.has('personalEditForm.email') }"/>
                            <i v-show="errors.has('personalEditForm.email')" class="fa fa-warning"></i>
                            <span v-show="errors.has('personalEditForm.email')"
                                  class="help">{{ errors.first('personalEditForm.email') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editName" class="col-md-3 col-sm-3 control-label">姓名:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="姓名" id="editName" name="name"
                                   v-model="update.name" v-validate:name="'min:2|max:12'" data-vv-as="姓名"
                                   :class="{'input': true, 'is-danger': errors.has('personalEditForm.name') }"/>
                            <i v-show="errors.has('personalEditForm.name')" class="fa fa-warning"></i>
                            <span v-show="errors.has('personalEditForm.name')"
                                  class="help is-danger">{{ errors.first('personalEditForm.name') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editMobile" class="col-md-3 col-sm-3 control-label">手机号:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="11位手机号" id="editMobile" name="mobile"
                                   v-model="update.mobile" v-validate:mobile="'mobile'" data-vv-as="手机号"
                                   :class="{'input': true, 'is-danger': errors.has('personalEditForm.mobile') }"/>
                            <i v-show="errors.has('personalEditForm.mobile')" class="fa fa-warning"></i>
                            <span v-show="errors.has('personalEditForm.mobile')"
                                  class="help is-danger">{{ errors.first('personalEditForm.mobile') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default"
                        @click="errors.clear('personalEditForm');editModalShow = false">取消
                </button>
                <button type="button" class="btn btn-success" @click="updateAdmin('personalEditForm')">确认</button>
            </div>
        </modal>
        <modal v-model="modifyModalShow" :backdrop="false" class="absolute-box">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="errors.clear('modifyAdminForm');modifyModalShow=false">
                    <span>×</span></button>
                <h4 class="modal-title">修改密码</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                      data-vv-scope="modifyAdminForm">
                    <div class="form-group">
                        <label for="modifyPassword" class="col-md-3 col-sm-3 control-label form-required">密码:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="password" name="password" class="form-control" placeholder="密码"
                                   id="modifyPassword" v-model="modify.newPassword" data-vv-as="密码"
                                   v-validate:password="'required|min:6|max:18'"
                                   :class="{'input': true, 'is-danger': errors.has('modifyAdminForm.password') }"/>
                            <i v-show="errors.has('modifyAdminForm.password')" class="fa fa-warning"></i>
                            <span v-show="errors.has('modifyAdminForm.password')"
                                  class="help is-danger">{{ errors.first('modifyAdminForm.password') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="modifyConfirmPassword" class="col-md-3 col-sm-3 control-label form-required">确认密码:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="password" name="confirmPassword" class="form-control" placeholder="确认密码"
                                   id="modifyConfirmPassword" v-model="modify.confirmPassword" data-vv-as="确认密码"
                                   v-validate:confirmPassword="'required|confirmed:password'"
                                   :class="{'input': true, 'is-danger': errors.has('modifyAdminForm.confirmPassword') }"/>
                            <i v-show="errors.has('modifyAdminForm.confirmPassword')" class="fa fa-warning"></i>
                            <span v-show="errors.has('modifyAdminForm.confirmPassword')"
                                  class="help is-danger">{{ errors.first('modifyAdminForm.confirmPassword') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default"
                        @click="errors.clear('modifyAdminForm');modifyModalShow = false">取消
                </button>
                <button type="button" class="btn btn-success" @click="modifyAdmin('modifyAdminForm')">确认</button>
            </div>
        </modal>
        <alert v-model="alert.isShow" class="absolute-box" placement="top" duration="3000" :type="alert.type" width="400px" dismissable>
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<style scoped>
    .modal.absolute-box{
        position: absolute;
    }
    .alert.top.absolute-box{
        position: absolute;
    }
</style>
<script>
    import {modal, alert} from 'vue-strap'
    export default {
        data(){
            return {
                editModalShow: false,
                modifyModalShow: false,
                userData: {
                    adminRoles: [{name: ""}],
                    org: {
                        name: ""
                    }
                },
                update: {
                    email: "",
                    name: "",
                    mobile: "",
                },
                modify: {
                    newPassword: null,
                    confirmPassword: null
                },
                alert: {
                    isShow: false,
                    type: null,
                    content: null
                }
            };
        },
        components: {
            modal, alert
        },
        methods: {
            showEditModal(){
                this.editModalShow = true;
                this.update.email = this.userData.email;
                this.update.mobile = this.userData.mobile;
                this.update.name = this.userData.name;
            },
            showModifyModal(){
                this.modify = {
                    password: "",
                    confirmPassword: ""
                };
                this.modifyModalShow = true;
            },
            getAdmin(){
                let _this = this;
                _this.$http.get("api/adminBySessionId").then(function (res) {
                    if (res.body.status === 1) {
                        let result = res.body.data;
                        _this.userData._id = result._id;
                        _this.userData.username = result.username;
                        _this.userData.name = result.name;
                        _this.userData.email = result.email;
                        _this.userData.mobile = result.mobile;
                        _this.userData.org.name = result.org ? result.org.name : "";
                        _this.userData.adminRoles = result.adminRoles.length ? result.adminRoles : [{name: ""}];
                    } else {
                        _this.showAlert({
                            type: "danger",
                            content: "获取个人信息失败"
                        });
                    }
                });
            },
            updateAdmin(scope){
                let _this = this,
                    body = {
                        email: _this.update.email,
                        name: _this.update.name,
                        mobile: _this.update.mobile
                    };
                _this.$validator.validateAll(scope).then(function () {
                    return _this.$http.put("api/admin", body, {params: {id: _this.userData._id}})
                }).then(function (res) {
                    _this.showAlert({
                        type: "success",
                        content: "修改个人信息成功"
                    });
                    _this.editModalShow = false;
                    _this.getAdmin();
                })
            },
            modifyAdmin(scope){
                let _this = this,
                    body = {
                        password: _this.modify.newPassword
                    };
                _this.$validator.validateAll(scope).then(function () {
                    return _this.$http.put("api/admin", body, {params: {id: _this.userData._id}})
                }).then(function (res) {
                    if(res.body.status){
                        _this.showAlert({
                            type: "success",
                            content: "修改密码成功，3秒后返回登录界面"
                        });
                        _this.modifyModalShow = false;
                        _this.$http.post('api/logout').then(function(reponse){
                            if(reponse.body){
                                setTimeout(()=>{
                                    _this.$router.push("/login");
                                },3000);
                            }
                        });
                    }
                })
            },
            showAlert(option){
                let _this = this;
                _this.alert.isShow = true;
                _this.alert.type = option.type;
                _this.alert.content = option.content;
            },
        },
        created (){
            this.getAdmin();
        }
    }
</script>