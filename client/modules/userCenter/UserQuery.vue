<template>
    <div>
        <ul class="breadcrumb">
            <li>系统管理</li>
            <li>账户管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form @submit.prevent="search('search')" class="form-inline no-margin">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="账户名" v-model="userListSearch.username"
                                   autocomplete="off"/>
                        </div>
                        <div class="form-group">
                            <select class="form-control" v-model="userListSearch.adminRoles">
                                <option value="">全部角色</option>
                                <option v-for="adminRole in adminRoles" v-bind:value="adminRole._id">
                                    {{adminRole.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <select class="form-control" v-model="userListSearch.status">
                                <option value="">全部状态</option>
                                <option v-for="item in userStatusType" v-bind:value="item.value"
                                        v-text="item.name"></option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="search('search')">搜索</button>
                        <button type="button" class="btn btn-sm btn-success right" v-on:click="showAddModal()">新增账户
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>账户名</th>
                    <th>姓名</th>
                    <th>角色</th>
                    <th>手机号</th>
                    <th>邮箱</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in userList">
                    <td>{{user.username}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.adminRoles | adminRoleFilter}}</td>
                    <td>{{user.mobile}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.status | adminStatusFilter}}</td>
                    <td>
                        <template v-if="user.isDefault !== 1">
                            <i-button type="ghost" size="small" icon="toggle-filled" @click="confirmToggleStatus(user._id,user.status)">{{0 === user.status ? '启用' : '禁用'}}</i-button>
                            <i-button type="ghost" size="small" icon="android-delete" @click="confirmDelete(user._id)">删除</i-button>
                            <i-button type="ghost" size="small" icon="edit" @click="showEditModal(user)">编辑</i-button>
                            <i-button type="ghost" size="small" icon="refresh" @click="toggleResetPasswordModal(user._id)">重置密码</i-button>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="userListSearchParam.pageIndex" :page-size="userListSearchParam.pageSize"
                          :total="userListSearchTotalCount" :max-link="5"
                          :page-handler="search"></zpagenav>
            </div>
        </div>
        <modal v-model="addModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="resetAddModal()"><span>×</span>
                </button>
                <h4 class="modal-title">新增账户</h4>
            </div>
            <template v-if="addModalStep[0]">
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                          data-vv-scope="addFormVali">
                        <div class="form-group">
                            <label for="username" class="col-md-3 col-sm-3 control-label form-required">账户名:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" placeholder="账户名" id="username" data-vv-as="账户名"
                                       name="username"
                                       v-model="addUserData.username"
                                       v-validate:username="'required|noSpace|min:3|max:15'"
                                       :class="{'input': true, 'is-danger': errors.has('addFormVali.username') }"/>
                                <i v-show="errors.has('addFormVali.username')" class="fa fa-warning"></i>
                                <span v-show="errors.has('addFormVali.username')"
                                      class="help is-danger">{{ errors.first('addFormVali.username') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password" class="col-md-3 col-sm-3 control-label form-required">密码:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="password" class="form-control" placeholder="密码" id="password"
                                       data-vv-as="密码"  autocomplete="off"
                                       name="password"
                                       v-model="addUserData.password" v-validate:password="'required|min:6|max:18'"
                                       :class="{'input': true, 'is-danger': errors.has('addFormVali.password') }"/>
                                <i v-show="errors.has('addFormVali.password')" class="fa fa-warning"></i>
                                <span v-show="errors.has('addFormVali.password')"
                                      class="help is-danger">{{ errors.first('addFormVali.password') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword"
                                   class="col-md-3 col-sm-3 control-label form-required">确认密码:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="password" class="form-control" placeholder="确认密码" id="confirmPassword"
                                       name="confirmPassword"
                                       v-model="addUserData.confirmPassword"
                                       v-validate:confirmPassword="'required|confirmed:password'" data-vv-as="确认密码"
                                       :class="{'input': true, 'is-danger': errors.has('addFormVali.confirmPassword') }"/>

                                <i v-show="errors.has('addFormVali.confirmPassword')" class="fa fa-warning"></i>
                                <span v-show="errors.has('addFormVali.confirmPassword')"
                                      class="help is-danger">{{ errors.first('addFormVali.confirmPassword') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email" class="col-md-3 col-sm-3 control-label form-required">邮箱:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" placeholder="邮箱" id="email"
                                       v-model="addUserData.email"
                                       name="email"
                                       v-validate:email="'required|neEmail'" data-vv-as="邮箱"
                                       :class="{'input': true, 'is-danger': errors.has('addFormVali.email') }"
                                />
                                <i v-show="errors.has('addFormVali.email')" class="fa fa-warning"></i>
                                <span v-show="errors.has('addFormVali.email')"
                                      class="help is-danger">{{ errors.first('addFormVali.email') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="name" class="col-md-3 col-sm-3 control-label">姓名:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" placeholder="姓名" id="name"
                                       v-model="addUserData.name"
                                       v-validate:name="'min:2|max:14'" data-vv-as="姓名" name="name"
                                       :class="{'input': true, 'is-danger': errors.has('addFormVali.name') }"
                                />
                                <i v-show="errors.has('addFormVali.name')" class="fa fa-warning"></i>
                                <span v-show="errors.has('addFormVali.name')"
                                      class="help is-danger">{{ errors.first('addFormVali.name') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="mobile" class="col-md-3 col-sm-3 control-label">手机号:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" placeholder="11位手机号" id="mobile"
                                       v-model="addUserData.mobile"
                                       v-validate:mobile="'mobile'" data-vv-as="手机号" name="mobile"
                                       :class="{'input': true, 'is-danger': errors.has('addFormVali.mobile') }"
                                />
                                <i v-show="errors.has('addFormVali.mobile')" class="fa fa-warning"></i>
                                <span v-show="errors.has('addFormVali.mobile')"
                                      class="help is-danger">{{ errors.first('addFormVali.mobile') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetAddModal()">取消
                    </button>
                    <button type="button" class="btn btn-success" @click="addFromStep1ToStep2('addFormVali')">下一步
                    </button>
                </div>
            </template>
            <template v-if="addModalStep[1]">
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" novalidate>
                        <div class="form-group clearfix">
                            <label for="mobile" class="col-md-3 col-sm-3 control-label">角色:</label>
                            <div class="col-md-6 col-sm-6 tree-Container">
                                <ul class="role-list" v-for="(role, index) in roles">
                                    <li v-text="role.name" v-bind:class="{select: role.isSelect}"
                                        @click="selectRole(index)"></li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetAddModal()">取消</button>
                    <button type="button" class="btn btn-default" @click="stepBackTo(0,'addModalStep')">上一步</button>
                    <button type="button" class="btn btn-success" @click="addFromStep2ToStep3()">下一步</button>
                </div>
            </template>
            <template v-if="addModalStep[2]">
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" novalidate>
                        <div class="form-group clearfix">
                            <label for="mobile" class="col-md-3 col-sm-3 control-label">组织机构:</label>
                            <div class="col-md-6 col-sm-6 tree-Container">
                                <ul id="organizationAddUl" class="ztree"></ul>
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetAddModal()">取消</button>
                    <button type="button" class="btn btn-default" @click="stepBackTo(1,'addModalStep')">上一步</button>
                    <button type="button" class="btn btn-success" @click="addUser('addFormVali')">提交</button>
                </div>
            </template>
        </modal>
        <modal v-model="editModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="resetEditModal()"><span>×</span>
                </button>
                <h4 class="modal-title">编辑账户</h4>
            </div>
            <template v-if="editModalStep[0]">
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                          data-vv-scope="editFormVali">
                        <div class="form-group">
                            <label for="editEmail" class="col-md-3 col-sm-3 control-label form-required">邮箱:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" placeholder="邮箱" id="editEmail"
                                       v-model="editUserData.email" name="email"
                                       v-validate:email="'required|neEmail'" data-vv-as="邮箱"
                                       :class="{'input': true, 'is-danger': errors.has('editFormVali.email') }"
                                />
                                <i v-show="errors.has('editFormVali.email')" class="fa fa-warning"></i>
                                <span v-show="errors.has('editFormVali.email')"
                                      class="help is-danger">{{ errors.first('editFormVali.email') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="editName" class="col-md-3 col-sm-3 control-label">姓名:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" placeholder="姓名" id="editName"
                                       v-model="editUserData.name"
                                       v-validate:name="'min:2|max:14'" data-vv-as="姓名" name="name"
                                       :class="{'input': true, 'is-danger': errors.has('editFormVali.name') }"
                                />
                                <i v-show="errors.has('editFormVali.name')" class="fa fa-warning"></i>
                                <span v-show="errors.has('editFormVali.name')"
                                      class="help is-danger">{{ errors.first('editFormVali.name') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="editMobile" class="col-md-3 col-sm-3 control-label">手机号:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" placeholder="11位手机号" id="editMobile"
                                       v-model="editUserData.mobile"
                                       v-validate:mobile="'mobile'" data-vv-as="手机号" name="mobile"
                                       :class="{'input': true, 'is-danger': errors.has('editFormVali.mobile') }"
                                />
                                <i v-show="errors.has('editFormVali.mobile')" class="fa fa-warning"></i>
                                <span v-show="errors.has('editFormVali.mobile')"
                                      class="help is-danger">{{ errors.first('editFormVali.mobile') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetEditModal()">取消
                    </button>
                    <button type="button" class="btn btn-success"
                            @click="editFromStep1ToStep2('editFormVali')">下一步
                    </button>
                </div>
            </template>
            <template v-if="editModalStep[1]">
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" novalidate>
                        <div class="form-group clearfix">
                            <label for="mobile" class="col-md-3 col-sm-3 control-label">角色:</label>
                            <div class="col-md-6 col-sm-6 tree-Container">
                                <ul class="role-list" v-for="(role, index) in roles">
                                    <li v-text="role.name" v-bind:class="{select: role.isSelect}"
                                        @click="selectRole(index)"></li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetEditModal()">取消</button>
                    <button type="button" class="btn btn-default" @click="stepBackTo(0,'editModalStep')">上一步</button>
                    <button type="button" class="btn btn-success" @click="editFromStep2ToStep3()">下一步</button>
                </div>
            </template>
            <template v-if="editModalStep[2]">
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" novalidate>
                        <div class="form-group clearfix">
                            <label for="mobile" class="col-md-3 col-sm-3 control-label">组织机构:</label>
                            <div class="col-md-6 col-sm-6 tree-Container">
                                <ul id="organizationEditUl" class="ztree"></ul>
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetEditModal()">取消</button>
                    <button type="button" class="btn btn-default" @click="stepBackTo(1,'editModalStep')">上一步</button>
                    <button type="button" class="btn btn-success" @click="editUser()">提交
                    </button>
                </div>
            </template>
        </modal>
        <modal v-model="resetPwdModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="toggleResetPasswordModal()"><span>×</span>
                </button>
                <h4 class="modal-title">重置密码</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" data-vv-scope="resetPwdForm" novalidate>
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label form-required">用户密码将修改为：</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="password" class="form-control" placeholder="请输入密码"
                                   v-model="resetPwdData.password"
                                   v-validate:password="'required|min:6|max:18'" data-vv-as="密码" name="password"
                                   :class="{'input': true, 'is-danger': errors.has('resetPwdForm.password') }"
                            />
                            <i v-show="errors.has('resetPwdForm.password')" class="fa fa-warning"></i>
                            <span v-show="errors.has('resetPwdForm.password')"
                                  class="help is-danger">{{ errors.first('resetPwdForm.password') }}</span>
                        </div>
                        <div class="col-md-2 col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label">是否确认操作？</label>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="toggleResetPasswordModal();">
                    取消
                </button>
                <button type="button" class="btn btn-success" @click="resetPassword('resetPwdForm')"
                >确定
                </button>
            </div>
        </modal>
        <modal v-model="confirm.confirmModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="confirm.confirmModalShow = false"><span>×</span>
                </button>
                <h4 class="modal-title" v-text="confirm.title"></h4>
            </div>
            <div slot="modal-body" class="modal-body" v-text="confirm.content"></div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="confirm.confirmModalShow = false">取消</button>
                <button type="button" class="btn btn-success" @click="toggleStatus" v-if="confirm.thisIsToggleModal">
                    确定
                </button>
                <button type="button" class="btn btn-success" @click="deleteAdmin" v-if="confirm.thisIsDelModal">确定
                </button>
            </div>
        </modal>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<style scoped>
    .tree-Container {
        height: 300px;
        overflow-y: auto;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
    }

    .tree-Container > .role-list {
        padding: 0;
        margin: 6px 0 0 0;
        list-style: none;
    }

    .tree-Container > .role-list > li {
        margin: 0;
        list-style: none;
        border-bottom: 1px solid #e5e5e5;
        padding: 4px 6px;
        cursor: pointer;
    }

    .tree-Container > .role-list > li:hover, .tree-Container > .role-list > li.select {
        background: #32c5cd;
        color: #fff;
    }
</style>
<script>
    import {modal, alert} from 'vue-strap';
    import Vue from 'vue';
    export default{
        data(){
            return {
                adminRoles: [],
                userStatusType: [{
                    value: 0,
                    name: "禁用"
                }, {
                    value: 1,
                    name: "可用"
                }],
                userList: [],
                userListSearch: {
                    username: "",
                    adminRoles: "",
                    status: "",
                    pageSize: 10,
                    pageIndex: 1
                },
                userListSearchParam: {},
                userListSearchTotalCount: 0,
                addModalShow: false,
                addModalStep: [false, false, false],
                editModalShow: false,
                editModalStep: [false, false, false],
                resetPwdModalShow: false,
                resetPwdData:{
                    id:"",
                    password:""
                },
                updateStatusData:{
                    id:"",
                    status:""
                },
                deleteId: "",
                addUserData: {
                    username: "",
                    name: "",
                    password: "",
                    confirmPassword: "",
                    mobile: "",
                    email: ""
                },
                editUserData: {},
                roles: [],
                confirm: {
                    confirmModalShow: false,
                    title: "提示",
                    content: "",
                    thisIsToggleModal: false,
                    thisIsDelModal: false
                },
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
                },
                treeSetting: null
            }
        },
        components: {
            modal, alert
        },
        methods: {
            //初始化角色列表
            initData(){
                this.$http.get('api/findAdminRole').then((res) => {
                    if(res.body.status){
                        this.adminRoles = res.body.adminRoles;
                    }
                });
            },
            //搜索
            search(method){
                if (method === 'search') {
                    for (let key in this.userListSearch) {
                        this.userListSearchParam[key] = this.userListSearch[key];
                    }
                }
                if (typeof method === "number") {
                    this.userListSearchParam.pageIndex = method;
                }
                this.$http.get('api/findAdminByUserNameAndRoleId', {params: this.userListSearchParam}).then((res) => {
                    if (res.body.status) {
                        this.userList = res.body.admins;
                        this.userListSearchTotalCount = res.body.totalCount;
                    }
                });
            },
            //新增逻辑
            showAddModal(){
                this.addModalShow = true;
                this.addModalStep = [true, false, false];
            },
            addFromStep1ToStep2(scope){
                this.$validator.validateAll(scope).then(() => {
                    return this.$http.get('api/findAdminByUsername', {params: {username: this.addUserData.username}})
                }).then((res) => {
                    if (res.body.status) {
                        let admins = res.body.admins;
                        if (admins.length === 0) {
                            this.getActiveRoles();
                            this.addModalStep = [false, true, false];
                        } else {
                            this.showAlert({
                                content: "账户名已存在，请重新输入",
                                type: "danger"
                            });
                        }
                    }
                });
            },
            addFromStep2ToStep3(){
                this.treeRefresh();
                this.addModalStep = [false, false, true];
            },
            addUser(){
                this.setAddParams();
                this.$http.post("api/saveAdmin", this.addUserData).then(function (res) {
                    if (res.body.status) {
                        this.showAlert({
                            content: "新增账户成功",
                            type: "success"
                        });
                        this.resetAddModal();
                        this.search('search');
                    } else {
                        this.showAlert({
                            content: "新增账户失败，请重试",
                            type: "danger"
                        });
                    }
                });
            },
            //编辑逻辑
            showEditModal(editUserData){
                for(let key in editUserData){
                    this.editUserData[key] = editUserData[key];
                }
                this.editModalShow = true;
                this.editModalStep = [true, false, false];
            },
            editFromStep1ToStep2(scope){
                let hasRoles = [];
                this.$validator.validateAll(scope).then(() => {
                    $.each(this.editUserData.adminRoles, (index, role)=> {
                        hasRoles.push(role._id);
                    });
                    return this.getActiveRoles()
                }).then((roles)=>{
                    $.each(roles,  (index, role)=> {
                        if (-1 < hasRoles.indexOf(role._id)) {
                            this.selectRole(index);
                        }
                    });
                    this.editModalStep = [false, true,false];
                });
            },
            editFromStep2ToStep3(){
                this.initOrganizationTree("organizationEditUl", this.editUserData.org);
                this.editModalStep = [false, false, true];
            },
            editUser(){
                this.setEditParams();
                this.$http.put("api/admin", this.editUserData, {params: {id: this.editUserData._id}}).then( (res) => {
                    if (1 === res.body.status) {
                        this.showAlert({
                            content: "编辑账户成功",
                            type: "success"
                        });
                        this.resetEditModal();
                        this.search('search');
                    } else {
                        this.showAlert({
                            content: "编辑账户失败，请重试",
                            type: "danger"
                        });
                    }
                })
            },
            //回上一步
            stepBackTo(num, stepClass){
                let arr = [];
                for (let i = 0; i < this[stepClass].length; i++) {
                    if (i === num) {
                        arr[i] = true;
                    } else {
                        arr[i] = false;
                    }
                }
                this[stepClass] = arr;
            },
            //重置模态框数据
            resetAddModal(){
                this.addModalShow = false;
                this.addUserData = {
                    username: "",
                    name: "",
                    password: "",
                    confirmPassword: "",
                    mobile: "",
                    email: ""
                };
                this.$validator.getErrors().clear('addFormVali');
            },
            resetEditModal(){
                this.editModalShow = false;
                this.editUserData = {};
                this.$validator.getErrors().clear('editFormVali');
            },
            //切换帐号状态
            confirmToggleStatus(id, value){
                this.updateStatusData.id = id;
                this.updateStatusData.status = value;
                this.showConfirm({
                    content: "确定要切换该用户状态吗?",
                    thisIsToggleModal: true,
                    thisIsDelModal: false
                });
            },
            toggleStatus(){
                let id = this.updateStatusData.id;
                let status = this.updateStatusData.status;
                let body = {
                    status: 1 ^ status //求反操作
                };
                this.$http.put("api/admin", body, {params: {id: id}}).then( (res)=> {
                    if(res.body.status){
                        this.showAlert({
                            content: "切换状态成功！",
                            type: "success"
                        });
                        this.confirm.confirmModalShow = false;
                        this.search('search');
                    }
                })
            },
            //删除帐号
            confirmDelete(id){
                this.deleteId = id;
                this.showConfirm({
                    content: "确定要删除该条用户吗?",
                    thisIsDelModal: true,
                    thisIsToggleModal: false
                });
            },
            deleteAdmin(){
                let id = this.deleteId;
                this.$http.delete("api/admin", {params: {id: id}}).then( (res) =>{
                    if (0 === res.body.status) {
                        this.showAlert({
                            content: res.body.errorMessage,
                            type: "danger"
                        });
                    } else {
                        this.showAlert({
                            content: "删除成功",
                            type: "success"
                        });
                        this.confirm.confirmModalShow = false;
                        this.search('search');
                    }
                });
            },
            confirmCancel(){
                this.confirmModalShow = false;
            },
            //切换重置密码模态框
            toggleResetPasswordModal(id){
                if (id) {
                    //打开
                    this.resetPwdData.id = id;
                }else{
                    //关闭
                    this.resetPwdData.password = "";
                    this.$validator.getErrors().clear('resetPwdForm');
                }
                this.resetPwdModalShow = !this.resetPwdModalShow;
            },
            resetPassword(scope){
                this.$validator.validateAll(scope).then( ()=> {
                    return this.$http.put("api/adminReset", this.resetPwdData);
                }).then( (res)=> {
                    if (res.body.status) {
                        this.showAlert({
                            type: "success",
                            content: "重置成功"
                        });
                        this.toggleResetPasswordModal();
                    } else {
                        this.showAlert({
                            type: "danger",
                            content: "重置失败，请重试"
                        });
                    }
                })
            },
            //获取可用角色
            getActiveRoles(){
                let params = {
                    pageIndex: 1,
                    pageSize: 99999,
                    status: 1
                };
                return this.$http.get('api/adminRole', {params: params}).then( (res)=> {
                    let result = res.body;
                    if (result.status) {
                        this.roles = result.roles;
                    }
                    return this.roles;
                });
            },
            //选取角色
            selectRole(index){
                let role = $.extend({}, this.roles[index]);
                role.isSelect = !role.isSelect;
                Vue.set(this.roles, index, role);
            },
            //获取新增用户时选择的角色
            setAddParams(){
                let index = 0,
                        roles = [],
                        selectedNode = $.fn.zTree.getZTreeObj("organizationAddUl") ? $.fn.zTree.getZTreeObj("organizationAddUl").getCheckedNodes(true)[0] : "";
                for (; index < this.roles.length; index++) {
                    if (this.roles[index].isSelect) {
                        roles.push(this.roles[index]._id);
                    }
                }
                this.addUserData.adminRoles = roles;
                if (selectedNode) {
                    this.addUserData.org = selectedNode._id;
                }
            },
            //获取编辑用户时选择的角色
            setEditParams(){
                let roles = [],
                        selectedNode = $.fn.zTree.getZTreeObj("organizationEditUl") ? $.fn.zTree.getZTreeObj("organizationEditUl").getCheckedNodes(true)[0] : "";
                $.each(this.roles, function (index, role) {
                    if (role.isSelect) {
                        roles.push(role._id);
                    }
                });
                this.editUserData.adminRoles = roles;
                if (selectedNode) {
                    this.editUserData.org = selectedNode._id;
                }
            },
            //编辑用户时，初始化组织机构书
            initOrganizationTree(id, orgId){
                let setting = {
                    check: {
                        chkStyle:"radio",
                        enable: true,
                        radioType: "all"
                    }
                };
                this.$http.get("api/findOrganizations").then((res) => {
                    if(res.body.status){
                        return this.constructionOrganizationTree(res.body.organizations, orgId);
                    }
                }).then( (tree)=> {
                    $.fn.zTree.init($("#" + id), setting, tree);
                });
            },
            constructionOrganizationTree(organizations, orgId){
                let result = [];
                if ($.isArray(organizations)) {
                    $.each(organizations, function (index, item) {
                        if (orgId && orgId === item._id) {
                            item.checked = true;
                        }
                        if (!item.parent) {
                            result.push(item);
                        } else {
                            $.each(organizations, function (id, it) {
                                if (item.parent === it._id) {
                                    if (it.children) {
                                        it.children.push(item);
                                    } else {
                                        it.children = [item];
                                    }
                                }
                            })
                        }
                    });
                }
                return result;
            },
            //新增用户时组织机构初始化
            treeRefresh(){
                this.$http.get('api/findOrgAncestor').then((res) => {
                    let result = res.body;
                    if (result.status) {
                        if (result.orgs.length) {
                            $.fn.zTree.init($("#organizationAddUl"), this.treeSetting, result.orgs);
                        } else {
                            $.fn.zTree.init($("#organizationAddUl"));
                        }
                    }
                });
            },
            //showModal,showAlert
            showConfirm(options){
                this.confirm.confirmModalShow = true;
                this.confirm.content = options.content;
                this.confirm.thisIsToggleModal = options.thisIsToggleModal;
                this.confirm.thisIsDelModal = options.thisIsDelModal;
                options.title ? this.confirm.title = options.title : undefined;
            },
            showAlert(options){
                this.alert.isShow = true;
                this.alert.content = options.content;
                this.alert.type = options.type;
            }
        },
        created(){
            this.initData();
            this.search('search');
            this.treeSetting = {
                async: {
                    enable: true,
                    url: getUrl,
                    dataFilter: function (treeId, parentNode, responseData) {
                        return responseData.orgs;
                    }
                },
                check: {
                    chkStyle:"radio",
                    enable: true,
                    radioType: "all"
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                view: {
                    expandSpeed: ""
                },
                callback: {
                    beforeExpand: beforeExpand,
                    onAsyncSuccess: onAsyncSuccess,
                    onAsyncError: onAsyncError,
                    beforeCheck: beforeCheck
                }
            };
            function beforeCheck(treeId, treeNode) {
                let treeObj = $.fn.zTree.getZTreeObj("organizationAddUl");
                treeObj.checkAllNodes(false);
                treeNode.checked = true;
                treeObj.updateNode(treeNode);
                return false
            }
            function getUrl(treeId, treeNode) {
                return "api/findOrgByParentId?id=" + treeNode._id;
            }
            function beforeExpand(treeId, treeNode) {
                if (!treeNode.isAjaxing) {
                    ajaxGetNodes(treeNode, "refresh");
                    return true;
                } else {
                    alert("zTree 正在下载数据中，请稍后展开节点。。。");
                    return false;
                }
            }
            function onAsyncSuccess(event, treeId, treeNode, msg) {
                if (!msg || msg.length == 0) {
                    return;
                }
                let zTree = $.fn.zTree.getZTreeObj("organizationAddUl");
                treeNode.icon = "";
                zTree.updateNode(treeNode);
                zTree.selectNode(treeNode.children[0]);
            }
            function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
                let zTree = $.fn.zTree.getZTreeObj("organizationAddUl");
                alert("异步获取数据出现异常。");
                treeNode.icon = "";
                zTree.updateNode(treeNode);
            }
            function ajaxGetNodes(treeNode, reloadType) {
                let zTree = $.fn.zTree.getZTreeObj("organizationAddUl");
                if (reloadType == "refresh") {
                    treeNode.icon = require("ztree/css/zTreeStyle/img/loading.gif");
                    zTree.updateNode(treeNode);
                }
                zTree.reAsyncChildNodes(treeNode, reloadType, true);
            }
        }
    }

</script>
