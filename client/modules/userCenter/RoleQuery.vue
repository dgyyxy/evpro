<template>
    <div>
        <ul class="breadcrumb">
            <li>系统管理</li>
            <li>角色管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form @submit.prevent="search()" class="form-inline no-margin">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="角色名" v-model="roleListSearch.name"
                                   autocomplete="off"/>
                        </div>
                        <div class="form-group">
                            <select class="form-control" v-model="roleListSearch.status">
                                <option value="">全部状态</option>
                                <option v-for="status in roleStatuses" v-bind:value="status.value"
                                        v-text="status.title"></option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" @click="search('search')">搜索</button>
                        <button type="button" class="btn btn-sm btn-success right test" @click="toggleAddModal()">
                            新增角色
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" >
                <thead>
                <tr>
                    <th>角色名</th>
                    <th>状态</th>
                    <th>描述</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="role in rolesList">
                    <td v-text="role.name"></td>
                    <td>{{role.status | adminStatusFilter}}</td>
                    <td v-text="role.description"></td>
                    <td>
                        <template v-if="role.isDefault !== 1">
                        <i-button type="ghost" size="small" icon="locked" @click="confirmToggleStatus(role._id , role.status)">{{0 == role.status ? '启用' : '禁用'}}</i-button>
                        <i-button type="ghost" size="small" icon="android-delete"  @click="confirmDelete(role._id)">删除</i-button>
                        <i-button type="ghost" size="small" icon="edit" @click="toggleEditModal(role)">编辑</i-button>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="roleListSearchParam.pageIndex" :page-size="roleListSearchParam.pageSize" :total="roleListTotalCount"
                          :max-link="5" :page-handler="search"></zpagenav>
            </div>
        </div>
        <modal v-model="add.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" @click="toggleAddModal('addForm')"><span>×</span></button>
                <h4 class="modal-title">新增角色</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate data-vv-scope="addForm">
                    <div class="form-group">
                        <label for="name" class="col-md-3 col-sm-3 control-label">角色名:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="角色名" id="name" v-model="add.data.name"
                                   name="name" data-vv-as="角色名"
                                   v-validate:name="'required|min:3|max:15'"
                                   :class="{'input': true, 'is-danger': errors.has('addForm.name') }"/>
                            <i v-show="errors.has('addForm.name')" class="fa fa-warning"></i>
                            <span v-show="errors.has('addForm.name')"
                                  class="help is-danger">{{ errors.first('addForm.name') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-md-3 col-sm-3 control-label">描述:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="描述" id="description"
                                   v-model="add.data.description" name="description" data-vv-as="描述"
                                   v-validate:description="'max:50'"
                                   :class="{'input': true, 'is-danger': errors.has('addForm.description') }"/>
                            <i v-show="errors.has('addForm.description')" class="fa fa-warning"></i>
                            <span v-show="errors.has('addForm.description')"
                                  class="help is-danger">{{ errors.first('addForm.description') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group clearfix">
                        <label class="col-md-3 col-sm-3 control-label">权限:</label>
                        <div class="col-md-6 col-sm-6 tree-Container">
                            <ul id="addResourceTree" class="ztree"></ul>
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="toggleAddModal('addForm')">取消</button>
                <button type="button" class="btn btn-success" @click="addRole('addForm')">确定</button>
            </div>
        </modal>

        <modal v-model="edit.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" @click="errors.clear('editForm');edit.isShow=false">
                    <span>×</span></button>
                <h4 class="modal-title">编辑角色</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate data-vv-scope="editForm">
                    <div class="form-group">
                        <label for="editName" class="col-md-3 col-sm-3 control-label form-required">角色名:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="角色名" id="editName"
                                   v-model="edit.data.name" name="name" data-vv-as="角色名"
                                   v-validate:name="'required|min:3|max:15'"
                                   :class="{'input': true, 'is-danger': errors.has('editForm.name') }"/>
                            <i v-show="errors.has('editForm.name')" class="fa fa-warning"></i>
                            <span v-show="errors.has('editForm.name')"
                                  class="help is-danger">{{ errors.first('editForm.name') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label for="editDescription" class="col-md-3 col-sm-3 control-label">描述:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="描述" id="editDescription"
                                   v-model="edit.data.description" name="description" data-vv-as="描述"
                                   v-validate:description="'max:50'"
                                   :class="{'input': true, 'is-danger': errors.has('editForm.description') }"/>
                            <i v-show="errors.has('editForm.description')" class="fa fa-warning"></i>
                            <span v-show="errors.has('editForm.description')"
                                  class="help is-danger">{{ errors.first('editForm.description') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group clearfix">
                        <label class="col-md-3 col-sm-3 control-label">权限:</label>
                        <div class="col-md-6 col-sm-6 tree-Container">
                            <ul id="editResourceTree" class="ztree"></ul>
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="errors.clear('editForm');edit.isShow=false;">取消
                </button>
                <button type="button" class="btn btn-success" @click="editRole('editForm')">确定</button>
            </div>
        </modal>

        <modal v-model="confirm.confirmModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" @click="confirm.confirmModalShow = false"><span>×</span>
                </button>
                <h4 class="modal-title" v-text="confirm.title"></h4>
            </div>
            <div slot="modal-body" class="modal-body" v-text="confirm.content"></div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="confirm.confirmModalShow = false">取消</button>
                <button type="button" class="btn btn-success" @click="toggleRoleStatus"
                        v-if="confirm.thisIsToggleModal">确定
                </button>
                <button type="button" class="btn btn-success" @click="deleteRole" v-if="confirm.thisIsDelModal">确定
                </button>
            </div>
        </modal>
        <alert v-model="alert.isShow" placement="top" duration="3000"
               :type="alert.type" width="400px" dismissable>
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
</style>
<script>
    import {alert, modal} from 'vue-strap';

    export default{
        data(){
            return {
                roleListSearch: {
                    name: "",
                    status: "",
                    pageIndex:1,
                    pageSize:10
                },
                roleListSearchParam:{},
                roleListTotalCount:0,
                roleStatuses: [{
                    value: 0,
                    title: "禁用"
                },{
                    value: 1,
                    title: "可用"
                }],
                rolesList: [],
                add: {
                    data: {
                        name: "",
                        description: ""
                    },
                    isShow: false
                },
                edit: {
                    data: {
                        id: "",
                        description: "",
                        name: "",
                        resources: "",
                        status: ""
                    },
                    isShow: false
                },
                alert: {
                    isShow: false,
                    content: "",
                    type: "success"
                },
                confirm: {
                    confirmModalShow: false,
                    title: "提示",
                    content: "",
                    thisIsToggleModal: false,
                    thisIsDelModal: false
                },
                updateStatusId: "",
                updateStatusValue: "",
                deleteId: "",
                currentRecources:[]
            }
        },
        created (){
            this.search('search');
        },
        components: {
            modal,
            alert
        },
        methods: {
            search(method){
                if (method === 'search') {
                    for (let key in this.roleListSearch) {
                        this.roleListSearchParam[key] = this.roleListSearch[key];
                    }
                }
                if (typeof method === "number") {
                    this.roleListSearchParam.pageIndex = method;
                }
                this.$http.get('api/adminRole', {params: this.roleListSearchParam}).then((res) => {
                    if (res.body.status) {
                        this.rolesList = res.body.roles;
                        this.roleListTotalCount = res.body.totalCount;
                    }
                });
            },
            toggleAddModal(scope){
                if (scope) {
                    this.$validator.getErrors().clear(scope);
                }
                this.add.isShow = !this.add.isShow;
                if (this.add.isShow) {
                    this.add.data = {
                        name: "",
                        description: ""
                    };
                    this.initResourceTree("addResourceTree");
                }
            },
            addRole(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(() => {
                    let getAdd = _this.getAddParams();
                    if (!getAdd.resources.length) {
                        _this.showAlert({
                            type: "danger",
                            content: "请选择权限"
                        });
                    } else {
                        _this.$http.get("api/findRoleIsRepeatByName", {params: {name: _this.add.data.name}}).then(function (res) {
                            if (res.body.status) {
                                _this.$http.post("api/saveRole", getAdd).then(function (res) {
                                    if (res.body.status) {
                                        _this.toggleAddModal();
                                        _this.showAlert({
                                            type: "success",
                                            content: "新增角色成功"
                                        });
                                        _this.search();
                                    } else {
                                        _this.showAlert({
                                            type: "danger",
                                            content: "新增角色失败"
                                        });
                                    }
                                });
                            } else {
                                _this.showAlert({
                                    type: "danger",
                                    content: "该角色名已存在，请重新输入"
                                });
                            }
                        });
                    }
                })
            },
            getAddParams(){
                let params = {},
                    selectResources = $.fn.zTree.getZTreeObj("addResourceTree").getCheckedNodes(true),
                    _this = this;
                _this.add.data.resources = [];
                _this.add.data.resources = _this.add.data.resources.concat(_this.currentRecources);
                $.each(selectResources, function (index, resource) {
                    _this.add.data.resources.push(resource._id);
                });
                return _this.add.data;
            },
            toggleEditModal(role){
                this.edit.isShow = !this.edit.isShow;
                if (this.edit.isShow) {
                    this.edit.data.id = role._id;
                    this.edit.data.description = role.description;
                    this.edit.data.name = role.name;
                    this.edit.data.resources = role.resources;
                    this.edit.data.status = role.status;
                    this.initResourceTree("editResourceTree").then(function (data) {
                        let selectedNode = $.fn.zTree.getZTreeObj("editResourceTree").getNodesByFilter(function (node) {
                            return $.isArray(role.resources) && (-1 < role.resources.indexOf(node._id));
                        });
                        $.each(selectedNode, function (index, node) {
                            $.fn.zTree.getZTreeObj("editResourceTree").checkNode(node, true, false);
                        });
                    });
                }
            },
            editRole(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(() => {
                    let getEdit = _this.getEditParams();
                    if (!getEdit.resources.length) {
                        _this.showAlert({
                            type: "danger",
                            content: "请选择权限"
                        });
                    } else {
                        _this.$http.get("api/findRoleIsRepeatByNameAndId", {
                            params: {
                                name: _this.edit.data.name,
                                _id: _this.edit.data.id
                            }
                        }).then(function (res) {
                            if (res.body.status) {
                                _this.$http.put("api/updateRole", getEdit, {params: {id: _this.edit.data.id}}).then(function (res) {
                                    if (res.body.status) {
                                        _this.toggleEditModal();
                                        _this.showAlert({
                                            type: "success",
                                            content: "编辑角色成功"
                                        });
                                        _this.search();
                                    } else {
                                        _this.showAlert({
                                            type: "danger",
                                            content: "编辑角色失败"
                                        });
                                    }
                                });
                            } else {
                                _this.showAlert({
                                    type: "danger",
                                    content: "该角色名已存在，请重新输入"
                                });
                            }
                        });
                    }
                });
            },
            getEditParams(){
                let params = {},
                    selectResources = $.fn.zTree.getZTreeObj("editResourceTree").getCheckedNodes(true),
                    _this = this;
                _this.edit.data.resources = [];
                _this.edit.data.resources = _this.edit.data.resources.concat(_this.currentRecources);
                $.each(selectResources, function (index, resource) {
                    _this.edit.data.resources.push(resource._id);
                });
                return _this.edit.data;
            },
            confirmToggleStatus(id, value){
                let _this = this;
                _this.updateStatusId = id;
                _this.updateStatusValue = value;
                _this.showConfirm({
                    content: "确定要切换该用户状态吗?",
                    thisIsToggleModal: true,
                    thisIsDelModal: false
                });
            },
            toggleRoleStatus(){
                let _this = this,
                    body = {
                        status: 1 ^ _this.updateStatusValue //求反操作
                    };
                _this.updateRole(body)
            },
            updateRole(body){
                let _this = this;
                let id = _this.updateStatusId;
                _this.$http.put("api/updateRole", body, {params: {id: id}}).then(function (res) {
                    if(res.body.status){
                        _this.confirm.confirmModalShow = false;
                        _this.search('search');
                        _this.showAlert({
                            type: "success",
                            content: "切换状态成功"
                        });
                    }

                })
            },
            confirmDelete(id){
                let _this = this;
                _this.deleteId = id;
                _this.showConfirm({
                    content: "确定要删除该条用户吗?",
                    thisIsToggleModal: false,
                    thisIsDelModal: true
                });
            },
            //通过id删除账号
            deleteRole(){
                let _this = this,
                    id = _this.deleteId;
                return _this.$http.delete("api/deleteRole", {params: {id: id}}).then(function (res) {
                    if (0 === res.body.status) {
                        _this.showAlert({
                            type: "danger",
                            content: res.body.errorMessage
                        });
                    } else {
                        _this.showAlert({
                            type: "success",
                            content: "删除成功"
                        });
                        _this.search("search");
                        _this.confirm.confirmModalShow = false;
                    }

                });
            },
            showConfirm(options){
                this.confirm.confirmModalShow = true;
                this.confirm.content = options.content;
                this.confirm.thisIsToggleModal = options.thisIsToggleModal;
                this.confirm.thisIsDelModal = options.thisIsDelModal;
                options.title ? this.confirm.title = options.title : undefined;
            },
            showAlert(options){
                $.extend(this.alert, options);
                this.alert.isShow = true;
            },
            confirmCancel(){
                this.confirm.confirmModalShow = false;
            },
            initResourceTree(id){
                let setting = {
                    check: {
                        enable: true,
                        chkboxType: {"Y": "ps", "N": "s"}
                    },
                    data: {
                        keep: {
                            parent: true
                        }
                    }
                };
                return this.getResourcesData().then(function (tree) {
                    return $.fn.zTree.init($("#" + id), setting, tree);
                });
            },
            getResourcesData(){
                let _this = this;
                return _this.$http.get("api/findResources").then(function (res) {
                    return _this.constructionResourceTree(res.body.resources);
                });
            },
            constructionResourceTree(resources){
                let _this = this;
                let result = [];
                _this.currentRecources = [];
                if ($.isArray(resources)) {
                    $.each(resources, function (index, item) {
                        if(!item.code){
                            if (!item.parent) {
                                result.push(item);
                            } else {
                                $.each(resources, function (id, it) {
                                    if (item.parent === it._id) {
                                        if (it.children) {
                                            it.children.push(item);
                                        } else {
                                            it.children = [item];
                                        }
                                    }
                                })
                            }
                        }else{
                            _this.currentRecources.push(item._id);
                        }
                    });
                }
                return result;
            }
        }
    }
</script>
