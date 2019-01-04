<template>
    <div>
        <ul class="breadcrumb">
            <li>系统管理</li>
            <li>组织机构管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form @submit.prevent="search()" class="form-inline no-margin">
                        <div class="form-group">
                            <label class="sr-only">组织机构名</label>
                            <input type="text" class="form-control" placeholder="关键字" v-model="searchOrg.keyword"/>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="search()">搜索</button>
                        &nbsp;&nbsp;
                        <button type="button" class="btn btn-sm btn-success right" v-on:click="addOrg()">新增组织机构</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="tree-container" id="dashboard-org-tree">
            <ul id="treeDemo" class="ztree"></ul>
        </div>
        <div>
            <div class="data-table table-responsive">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>组织机构名称</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="org in orgList">
                        <td>{{org.name}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="editOrg(org._id,org.name)">编辑</a>
                            <a href="javascript:void(0)" @click="delOrg(org._id,org.name)">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination-row clearfix" style="margin-left: 240px;">
                <div class="pull-right pull-left-sm">
                    <zpagenav :page="searchOrg.pageIndex" :page-size="searchOrg.pageSize" :total="totalCount"
                              :max-link="5" :page-handler="search"></zpagenav>
                </div>
            </div>
        </div>
        <modal v-model="edit.editModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="errors.clear('editOrgForm');edit.editModalShow=false">
                    <span>×</span></button>
                <h4 class="modal-title">编辑组织机构</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                      data-vv-scope="editOrgForm">
                    <div class="form-group row">
                        <label for="editOrgName" class="col-md-3 col-sm-3 control-label org-title">组织机构名称:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="组织机构名称" id="editOrgName"
                                   v-model="edit.editName" name="editOrgName" data-vv-as="组织机构名称"
                                   v-validate:editOrgName="'required|min:3|max:15'"
                                   :class="{'input': true, 'is-danger': errors.has('editOrgForm.editOrgName') }"/>
                            <i v-show="errors.has('editOrgForm.editOrgName')" class="fa fa-warning"></i>
                            <span v-show="errors.has('editOrgForm.editOrgName')"
                                  class="help is-danger">{{ errors.first('editOrgForm.editOrgName') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                </form>

            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="errors.clear('editOrgForm');orgModalCancel()">取消
                </button>
                <button type="button" class="btn btn-success" @click="orgModalEditConfirm('editOrgForm')">确定</button>
            </div>
        </modal>
        <modal v-model="add.addModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="errors.clear('addOrgForm');add.addModalShow=false">
                    <span>×</span></button>
                <h4 class="modal-title">添加组织机构</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                      data-vv-scope="addOrgForm">
                    <div class="form-group">
                        <label for="addOrgName" class="col-md-3 col-sm-3 control-label">组织机构名称:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="组织机构名称" id="addOrgName"
                                   v-model="add.addName" name="orgName" data-vv-as="组织机构名称"
                                   v-validate:orgName="'required|min:3|max:15'"
                                   :class="{'input': true, 'is-danger': errors.has('addOrgForm.orgName') }"/>
                            <i v-show="errors.has('addOrgForm.orgName')" class="fa fa-warning"></i>
                            <span v-show="errors.has('addOrgForm.orgName')"
                                  class="help is-danger">{{ errors.first('addOrgForm.orgName') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">属于机构:</label>
                        <div class="col-md-6 col-sm-6">
                            <v-select class="org-orglist" v-model="add.addBelongToOrg" :options="orgParentTrueList" options-value="_id"
                                      placeholder="请选择"
                                      options-label="name" search-text="请输入" search
                            >
                            </v-select>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="errors.clear('addOrgForm');orgModalCancel()">取消
                </button>
                <button type="button" class="btn btn-success" @click="orgModalAddConfirm('addOrgForm')">确定</button>
            </div>
        </modal>
        <modal v-model="del.delModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="del.delModalShow=false"><span>×</span></button>
                <h4 class="modal-title" v-text="del.title"></h4>
            </div>
            <div slot="modal-body" class="modal-body">确认要删除 {{del.delName}} 吗？</div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="orgModalCancel()">取消</button>
                <button type="button" class="btn btn-success" @click="orgModalDelConfirm()">确定</button>
            </div>
        </modal>
        <alert v-model="alert.isShow" placement="top" duration="2000" :type="alert.alertType" width="400px" dismissable>
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p>{{alert.message}}</p>
        </alert>
    </div>
</template>
<style scoped>
    #dashboard-org-tree {
        float: left;
        width: 240px;
        max-height: 461px;
        overflow-y: auto;
    }

    .org-orglist .dropdown-menu {
        height: 300px;
        overflow-y: auto;
    }
</style>
<script>
    import {modal, alert, select} from 'vue-strap';
    import $ from 'jquery';

    export default{
        data(){
            return {
                searchOrg: {
                    keyword: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                totalCount:0,
                orgList: [],
                orgParentTrueList: [],
                //编辑
                edit: {
                    editModalShow: false,
                    editId: '',
                    editName: '',
                },
                //添加
                add: {
                    addModalShow: false,
                    addName: '',
                    addBelongToOrg: ''
                },
                //删除
                del: {
                    delModalShow: false,
                    delId: '',
                    delName: '',
                    title: '提示'
                },
                alert: {
                    isShow: false,
                    message: '',
                    alertType: ''
                },
                treeSetting: null
            }
        },
        components: {
            modal,
            alert: alert,
            vSelect: select
        },
        methods: {
            search(page){
                let _this = this;
                if (typeof page === "number") {
                    _this.searchOrg.pageIndex = page;
                }
                _this.$http.get('api/findOrgByConditionAndPage', {params: _this.searchOrg}).then(function (response) {
                    let result = response.body;
                    if (result.status) {
                        _this.orgList = result.orgs;
                        _this.totalCount = result.totalCount;
                    } else {
                        _this.alert.message = '获取信息失败，请重试！';
                        _this.alert.alertType = 'danger';
                        _this.alert.isShow = true;
                    }
                });
            },
            //编辑逻辑
            editOrg(id, name){
                this.edit.editId = id;
                this.edit.editName = name;
                this.edit.editModalShow = true;
            },
            orgModalEditConfirm(scope){
                let id = this.edit.editId;
                let name = this.edit.editName;
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    _this.$http.put('api/updateOrgById', {name: name}, {params: {id: id}}).then(function (response) {
                        let result = response.body;
                        if (result.status) {
                            _this.edit.editModalShow = false;
                            _this.search();
                            _this.treeRefresh();
                            _this.alert.message = '编辑成功！';
                            _this.alert.alertType = 'success';
                        } else {
                            _this.alert.message = '编辑失败，请重试！';
                            _this.alert.alertType = 'danger';
                        }
                        _this.alert.isShow = true;
                    });
                });
            },
            //删除逻辑
            delOrg(id, name){
                this.del.delId = id;
                this.del.delName = name;
                this.del.delModalShow = true;
            },
            orgModalDelConfirm(){
                let _this = this;
                let id = _this.del.delId;
                _this.$http.delete('api/deleteOrgById', {params: {id: id}}).then(function (response) {
                    let result = response.body;
                    if (result.status) {
                        _this.del.delModalShow = false;
                        _this.search();
                        _this.treeRefresh();
                        _this.alert.message = '删除成功！';
                        _this.alert.alertType = 'success';
                    } else {
                        _this.alert.message = result.errorMessage || "删除失败，请重试";
                        _this.alert.alertType = 'danger';
                    }
                    _this.alert.isShow = true;
                });
            },
            //添加逻辑
            addOrg(){
                let _this = this;
                _this.add.addName = '';
                _this.add.addBelongToOrg = '';
                _this.$http.get('api/findOrganizations').then(function (response) {
                    let result = response.body;
                    if (result.status) {
                        _this.orgParentTrueList = result.organizations;
                        _this.add.addModalShow = true;
                    } else {
                        _this.alert.message = '获取机构信息失败，请重试！';
                        _this.alert.alertType = 'danger';
                        _this.alert.isShow = true;
                    }
                });
            },
            orgModalAddConfirm(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    let param = {
                        orgId: _this.add.addBelongToOrg,
                        name: _this.add.addName
                    };
                    _this.$http.post('api/addOrgByOrg', param).then(function (response) {
                        let result = response.body;
                        if (result.status) {
                            _this.add.addModalShow = false;
                            _this.search();
                            _this.treeRefresh();
                            _this.alert.message = '新增成功！';
                            _this.alert.alertType = 'success';
                        } else {
                            _this.alert.message = '新增失败，请重试！';
                            _this.alert.alertType = 'danger';
                        }
                        _this.alert.isShow = true;
                    });

                });

            },
            //所有取消
            orgModalCancel(){
                this.edit.editModalShow = false;
                this.add.addModalShow = false;
                this.del.delModalShow = false;
            },
            //文件树刷新
            treeRefresh(){
                let _this = this;
                _this.$http.get('api/findOrgAncestor').then(function (res) {
                    let result = res.body;
                    if (result.status) {
                        if (result.orgs.length) {
                            $.fn.zTree.init($("#treeDemo"), _this.treeSetting, result.orgs);
                        } else {
                            $.fn.zTree.init($("#treeDemo"));
                        }
                    } else {
                        alert("异步获取数据出现异常。");
                    }
                });
            }
        },
        created(){
            this.search();
        },
        mounted(){
            this.treeSetting = {
                async: {
                    enable: true,
                    url: getUrl,
                    dataFilter: function (treeId, parentNode, responseData) {
                        return responseData.orgs;
                    }
                },
                check: {
                    enable: false
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
                    onAsyncError: onAsyncError
                }
            };
            function getUrl(treeId, treeNode) {
                return "api/findOrgByParentId?id=" + treeNode._id;
            }
            function beforeExpand(treeId, treeNode) {
                if (!treeNode.isAjaxing) {
                    ajaxGetNodes(treeNode, "refresh");
                    return true;
                } else {
                    alert("正在下载数据中，请稍后展开节点。。。");
                    return false;
                }
            }
            function onAsyncSuccess(event, treeId, treeNode, msg) {
                if (!msg || msg.length == 0) {
                    return;
                }
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                treeNode.icon = "";
                zTree.updateNode(treeNode);
                zTree.selectNode(treeNode.children[0]);
            }
            function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                alert("异步获取数据出现异常。");
                treeNode.icon = "";
                zTree.updateNode(treeNode);
            }
            function ajaxGetNodes(treeNode, reloadType) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                if (reloadType == "refresh") {
                    treeNode.icon = require("ztree/css/zTreeStyle/img/loading.gif");
                    zTree.updateNode(treeNode);
                }
                zTree.reAsyncChildNodes(treeNode, reloadType, true);
            }
            this.$nextTick(() => {
                this.treeRefresh();
            })
        }
    }

</script>
