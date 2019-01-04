<template>
    <div>
        <ul class="breadcrumb">
            <li>系统管理</li>
            <li>菜单管理</li>
        </ul>
        <div class="menu-panel-row row">
            <div class="col-md-6 col-sm-6 panel menu-panel">
                <div class="panel-heading menu-panel-header clearfix">
                    <button class="btn btn-sm right new-menu-btn" v-show="zNodesLevel===0" @click="addLevel1MenuModal">
                        新建二级菜单
                    </button>
                    <button class="btn btn-sm right new-menu-btn" v-show="zNodesLevel===1" @click="editLevel1MenuModal">
                        修改二级菜单
                    </button>
                    <button class="btn btn-sm right new-menu-btn" v-show="zNodesLevel===1 && level1Menu.type!==0"
                            @click="delLevelMenuModal(1)">删除二级菜单
                    </button>
                </div>
                <div class="panel-body">
                    <div class="tree-container">
                        <ul id="treeDemo" class="ztree"></ul>
                    </div>
                </div>
                <div class="panel-footer menu-panel-header clearfix">
                    <button class="btn btn-sm right new-menu-btn" @click="addLevel0MenuModal">新建一级菜单</button>
                    <button class="btn btn-sm right new-menu-btn" v-show="zNodesLevel===0" @click="editLevel0MenuModal">
                        修改一级菜单
                    </button>
                    <button class="btn btn-sm right new-menu-btn" v-show="zNodesLevel===0 && level0Menu.type!==0"
                            @click="delLevelMenuModal(0)">删除一级菜单
                    </button>
                </div>
            </div>
            <div class="col-md-6 col-sm-6 panel menu-panel">
                <div class="panel-heading menu-panel-header">菜单详情</div>
                <table class="table" v-show="zNodesLevel===0">
                    <tr>
                        <td>菜单级别：</td>
                        <td>一级菜单</td>
                    </tr>
                    <tr>
                        <td>名称：</td>
                        <td>{{level0Menu.name}}</td>
                    </tr>
                    <tr>
                        <td>图标：</td>
                        <td>{{level0Menu.icon}}</td>
                    </tr>
                    <tr>
                        <td>描述：</td>
                        <td>{{level0Menu.remark}}</td>
                    </tr>
                    <tr>
                        <td>类型（0 - inner or 1 - iframe）：</td>
                        <td>{{level0Menu.type}}</td>
                    </tr>
                    <tr>
                        <td>URI：</td>
                        <td>{{level0Menu.uri}}</td>
                    </tr>
                </table>
                <table class="table" v-show="zNodesLevel===1">
                    <tr>
                        <td>菜单级别：</td>
                        <td>二级菜单</td>
                    </tr>
                    <tr>
                        <td>名称：</td>
                        <td>{{level1Menu.name}}</td>
                    </tr>
                    <tr>
                        <td>链接：</td>
                        <td>{{level1Menu.link}}</td>
                    </tr>
                    <tr>
                        <td>描述：</td>
                        <td>{{level1Menu.remark}}</td>
                    </tr>
                    <tr>
                        <td>类型（0 - inner or 1 - iframe）：</td>
                        <td>{{level1Menu.type}}</td>
                    </tr>
                    <tr>
                        <td>URI：</td>
                        <td>{{level1Menu.uri}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <modal v-model="Level0MenuModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="Level0MenuModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title"></h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate data-vv-scope="menuFormVali">
                    <div class="form-group row">
                        <label for="level0MenuName" class="col-md-3 col-sm-3 control-label">一级菜单名称:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="一级菜单名称" id="level0MenuName" v-model="level0Menu.name"
                                   name="name" data-vv-as="一级菜单名称"
                                   v-validate:name="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('menuFormVali.name') }"/>
                            <i v-show="errors.has('menuFormVali.name')" class="fa fa-warning"></i>
                            <span v-show="errors.has('menuFormVali.name')" class="help is-danger">
                                {{ errors.first('menuFormVali.name') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label for="level0MenuIcon" class="col-md-3 col-sm-3 control-label">菜单图标样式:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="菜单图标样式" id="level0MenuIcon" v-model="level0Menu.icon"
                                   name="icon" data-vv-as="菜单图标样式"
                                   v-validate:icon="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('menuFormVali.icon') }"/>
                            <i v-show="errors.has('menuFormVali.icon')" class="fa fa-warning"></i>
                            <span v-show="errors.has('menuFormVali.icon')" class="help is-danger">
                                {{ errors.first('menuFormVali.icon') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label for="level0MenuLink" class="col-md-3 col-sm-3 control-label">路由:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="路由" id="level0MenuLink" v-model="level0Menu.link"
                                   name="link" data-vv-as="路由"
                                   v-validate:link="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('menuFormVali.link') }"/>
                            <i v-show="errors.has('menuFormVali.link')" class="fa fa-warning"></i>
                            <span v-show="errors.has('menuFormVali.link')" class="help is-danger">
                                {{ errors.first('menuFormVali.link') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label for="level0MenuUri" class="col-md-3 col-sm-3 control-label">URI:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="URI" id="level0MenuUri" v-model="level0Menu.uri"
                                   name="uri" data-vv-as="URI"
                                   v-validate:link="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('menuFormVali.uri') }"/>
                            <i v-show="errors.has('menuFormVali.uri')" class="fa fa-warning"></i>
                            <span v-show="errors.has('menuFormVali.uri')" class="help is-danger">
                                {{ errors.first('menuFormVali.uri') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label for="level0MenuType" class="col-md-3 col-sm-3 control-label">菜单类型:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="number" max="1" min="0" class="form-control"  placeholder="0-inner or 1-iframe"
                                   id="level0MenuType" v-model="level0Menu.type"
                                   name="type" data-vv-as="菜单类型"
                                   v-validate:type="'required|digits:1'"
                                   :class="{'input': true, 'is-danger': errors.has('menuFormVali.type') }"/>
                            <i v-show="errors.has('menuFormVali.type')" class="fa fa-warning"></i>
                            <span v-show="errors.has('menuFormVali.type')" class="help is-danger">
                                {{ errors.first('menuFormVali.type') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label for="level0MenuOrder" class="col-md-3 col-sm-3 control-label">排序编号:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="number" min="0" class="form-control"  placeholder="排序编号"
                                   id="level0MenuOrder" v-model="level0Menu.order"
                                   name="type" data-vv-as="排序编号"
                                   v-validate:type="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('menuFormVali.order') }"/>
                            <i v-show="errors.has('menuFormVali.order')" class="fa fa-warning"></i>
                            <span v-show="errors.has('menuFormVali.order')" class="help is-danger">
                                {{ errors.first('menuFormVali.order') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-3 col-sm-3 control-label">是否首页显示：</label>
                        <div class="col-md-6 col-sm-6">
                            <input type="checkbox" id="isIndex" value="true" name="isIndex" v-model="level0Menu.isIndex">
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                </form>
            </div>

            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="errors.clear('menuFormVali');Level0MenuModal.isShow=false">取消</button>
                <button type="button" class="btn btn-success" @click="addLevel0MenuModalConfirm('menuFormVali')"
                        v-if="Level0MenuModal.mode==='add'" :disabled="errors.any('menuFormVali')">确定
                </button>
                <button type="button" class="btn btn-success" @click="editLevel0MenuModalConfirm('menuFormVali')"
                        v-if="Level0MenuModal.mode==='edit'" :disabled="errors.any('menuFormVali')">确定
                </button>

            </div>
        </modal>
        <modal v-model="Level1MenuModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="Level1MenuModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title"></h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate data-vv-scope="twoMenuFormVali">
                    <div class="form-group row">
                        <label for="level1MenuName" class="col-md-3 col-sm-3 control-label">二级菜单名称:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="二级菜单名称" id="level1MenuName" v-model="level1Menu.name"
                                   name="name" data-vv-as="二级菜单名称"
                                   v-validate:name="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('twoMenuFormVali.name') }"/>
                            <i v-show="errors.has('twoMenuFormVali.name')" class="fa fa-warning"></i>
                            <span v-show="errors.has('twoMenuFormVali.name')"
                                  class="help is-danger">{{ errors.first('twoMenuFormVali.name') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label for="level1MenuLink" class="col-md-3 col-sm-3 control-label">路由:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="路由" id="level1MenuLink" v-model="level1Menu.link"
                                   name="link" data-vv-as="路由"
                                   v-validate:link="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('twoMenuFormVali.link') }"/>
                            <i v-show="errors.has('twoMenuFormVali.link')" class="fa fa-warning"></i>
                            <span v-show="errors.has('twoMenuFormVali.link')" class="help is-danger">
                                {{ errors.first('twoMenuFormVali.link') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label for="level1MenuType" class="col-md-3 col-sm-3 control-label">菜单类型:</label>
                        <div class="col-md-6 col-sm-6">
                            <input type="number" max="1" min="0" class="form-control" placeholder="0-inner or 1-iframe"
                                   id="level1MenuType" v-model="level1Menu.type" name="type"
                                   v-validate:type="'required|digits:1'"
                                   :class="{'input': true, 'is-danger': errors.has('twoMenuFormVali.type') }"/>
                            <i v-show="errors.has('twoMenuFormVali.type')" class="fa fa-warning"></i>
                            <span v-show="errors.has('twoMenuFormVali.type')" class="help is-danger">
                                {{ errors.first('twoMenuFormVali.type') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label for="level1MenuUri" class="col-md-3 col-sm-3 control-label">URI:</label>
                        <div class="col-md-6 col-sm-6">
                            <input type="text" class="form-control" placeholder="URI" id="level1MenuUri"
                                   v-model="level1Menu.uri" name="uri" data-vv-as="URI"
                                   v-validate:uri="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('twoMenuFormVali.uri') }"/>
                            <i v-show="errors.has('twoMenuFormVali.uri')" class="fa fa-warning"></i>
                            <span v-show="errors.has('twoMenuFormVali.uri')" class="help is-danger">
                                {{ errors.first('twoMenuFormVali.uri') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group row">
                        <label for="level1MenuRemark" class="col-md-3 col-sm-3 control-label">Remark:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" placeholder="菜单备注" id="level1MenuRemark" v-model="level1Menu.remark"
                                   name="remark" data-vv-as="菜单备注"
                                   v-validate:remark="'max:50'"
                                   :class="{'input': true, 'is-danger': errors.has('twoMenuFormVali.remark') }"/>
                            <i v-show="errors.has('twoMenuFormVali.remark')" class="fa fa-warning"></i>
                            <span v-show="errors.has('twoMenuFormVali.remark')" class="help is-danger">
                                {{ errors.first('twoMenuFormVali.remark') }}
                            </span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                </form>
            </div>

            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="errors.clear('twoMenuFormVali');Level1MenuModal.isShow=false">取消</button>
                <button type="button" class="btn btn-success" @click="addLevel1MenuModalConfirm('twoMenuFormVali')"
                        v-if="Level1MenuModal.mode==='add'" :disabled="errors.any('twoMenuFormVali')">确定
                </button>
                <button type="button" class="btn btn-success" @click="editLevel1MenuModalConfirm('twoMenuFormVali')"
                        v-if="Level1MenuModal.mode==='edit'" :disabled="errors.any('twoMenuFormVali')">确定
                </button>

            </div>
        </modal>
        <modal v-model="delMenuModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="delMenuModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">删除菜单</h4>
            </div>
            <div slot="modal-body" class="modal-body">确认要删除 {{delMenuModal.text}} 吗？</div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="delMenuModal.isShow=false">取消</button>
                <button type="button" class="btn btn-success" @click="delLevel0MenuModalConfirm()"
                        v-if="delMenuModal.level===0">确定
                </button>
                <button type="button" class="btn btn-success" @click="delLevel1MenuModalConfirm()"
                        v-if="delMenuModal.level===1">确定
                </button>
            </div>
        </modal>
        <alert v-model="alert.isShow" placement="top" duration="2000" :type="alert.alertType" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <strong>{{alert.title}}</strong>
            <p>{{alert.message}}</p>
        </alert>
    </div>
</template>
<style scoped>
    .menu-panel {
        padding: 0;
    }

    .row {
        margin: 10px 0 0;
    }

    .tree-container {
        margin: 0 auto;
    }

    .menu-panel-header {
        color: #ffffff;
        background-color: #137ec3;
        height: 50px;
        line-height: 26px;
    }

    .new-menu-btn {
        margin-left: 5px;
        color: #333;
        background: #ffffff;
    }
</style>
<script>
    import {modal, alert} from 'vue-strap';
    export default{
        data(){
            return {
                //成功失败提示
                alert: {
                    isShow: false,
                    message: '',
                    alertType: ''
                },
                treeSetting: null,
                zNodes: [],
                zNodesLevel: null,
                //一级菜单值
                Level0MenuModal: {
                    isShow: false,
                    mode: ""
                },
                level0Menu: {
                    id: "",
                    name: "",
                    icon: "",
                    order: "",
                    link: "",
                    type: "",
                    uri: ""
                },
                //二级菜单值
                Level1MenuModal: {
                    isShow: false,
                    mode: ""
                },
                level1Menu: {
                    parentId: "",
                    subIndex: "",
                    name: "",
                    remark: "",
                    link: "",
                    type: "",
                    uri: ""
                },
                //一二级菜单删除框
                delMenuModal: {
                    isShow: false,
                    text: "",
                    level: null
                }
            }
        },
        components: {
            modal,
            alert
        },
        watch: {
            '$route': 'treeRefresh'
        },
        methods: {
            //一级菜单增删改框弹出
            addLevel0MenuModal(){
                this.level0Menu.name = "";
                this.level0Menu.icon = "";
                this.level0Menu.uri = "";
                this.level0Menu.link = "";
                this.level0Menu.order = "";
                this.level0Menu.isIndex = false;
                this.Level0MenuModal.isShow = true;
                this.Level0MenuModal.mode = "add";
            },
            delLevel0MenuModal(){
                this.delMenuModal.isShow = true;
            },
            editLevel0MenuModal(){
                this.Level0MenuModal.isShow = true;
                this.Level0MenuModal.mode = "edit";
            },
            //二级菜单增删改框弹出
            addLevel1MenuModal(){
                this.level1Menu.name = "";
                this.level1Menu.remark = "";
                this.level1Menu.link = "";
                this.level1Menu.uri = "";
                this.Level1MenuModal.isShow = true;
                this.Level1MenuModal.mode = "add";
            },
            editLevel1MenuModal(){
                this.Level1MenuModal.isShow = true;
                this.Level1MenuModal.mode = "edit";
            },
            //一二级菜单删除框
            delLevelMenuModal(level){
                this.delMenuModal.level = level;
                this.delMenuModal.isShow = true;
            },
            //增加一级菜单
            addLevel0MenuModalConfirm(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    let param = {
                        name: _this.level0Menu.name,
                        icon: _this.level0Menu.icon,
                        type: _this.level0Menu.type,
                        order: _this.level0Menu.order,
                        uri: _this.level0Menu.uri,
                        link: _this.level0Menu.link,
                        isIndex: _this.level0Menu.isIndex
                    };
                    _this.$http.post('api/addLevel0Menu', param).then(function (reponse) {
                        let result = reponse.body;
                        if (result.status) {
                            _this.Level0MenuModal.isShow = false;
                            _this.alert.message = '添加成功';
                            _this.alert.alertType = 'success';
                            _this.alert.isShow = true;
                            _this.treeRefresh();
                        }
                    });
                });

            },
            //编辑一级菜单
            editLevel0MenuModalConfirm(scope){
                let _this = this;
                let id = _this.level0Menu.id;
                let param = {
                    name: _this.level0Menu.name,
                    icon: _this.level0Menu.icon,
                    type: _this.level0Menu.type,
                    order: _this.level0Menu.order,
                    uri: _this.level0Menu.uri,
                    isIndex: _this.level0Menu.isIndex,
                    link: _this.level0Menu.link
                };
                _this.$validator.validateAll(scope).then(function () {
                    _this.$http.put('api/updateLevel0Menu', param, {params: {id: id}}).then(function (reponse) {
                        let result = reponse.body;
                        if (result.status) {
                            _this.Level0MenuModal.isShow = false;
                            _this.alert.message = '编辑成功';
                            _this.alert.alertType = 'success';
                            _this.alert.isShow = true;
                            _this.treeRefresh();
                        }
                    });
                });

            },
            //增加二级菜单
            addLevel1MenuModalConfirm(scope){
                let _this = this;
                let id = _this.level1Menu.parentId;
                let param = {
                    name: _this.level1Menu.name,
                    link: _this.level1Menu.link,
                    type: _this.level1Menu.type,
                    uri: _this.level1Menu.uri
                };
                _this.$validator.validateAll(scope).then(function () {
                    _this.$http.put('api/addLevel1Menu', param, {params: {id: id}}).then(function (reponse) {
                        let result = reponse.body;
                        if (result.status) {
                            _this.Level1MenuModal.isShow = false;
                            _this.alert.message = '添加成功';
                            _this.alert.alertType = 'success';
                            _this.alert.isShow = true;
                            _this.treeRefresh();
                        }
                    });
                });

            },
            //编辑二级菜单
            editLevel1MenuModalConfirm(scope){
                let _this = this;
                let parentId = _this.level1Menu.parentId;
                let subIndex = _this.level1Menu.subIndex;
                let param = {
                    name: _this.level1Menu.name,
                    link: _this.level1Menu.link,
                    type: _this.level1Menu.type,
                    uri: _this.level1Menu.uri
                };
                _this.$validator.validateAll(scope).then(function () {
                    _this.$http.put('api/editLevel1Menu', param, {
                        params: {
                            parentId: parentId,
                            subIndex: subIndex
                        }
                    }).then(function (reponse) {
                        let result = reponse.body;
                        if (result.status) {
                            _this.Level1MenuModal.isShow = false;
                            _this.alert.message = '修改成功';
                            _this.alert.alertType = 'success';
                            _this.alert.isShow = true;
                            _this.treeRefresh();
                        }
                    });
                });

            },
            //删除一级菜单
            delLevel0MenuModalConfirm(){
                let _this = this;
                let id = _this.level0Menu.id;
                _this.$http.delete('api/delLevel0Menu', {params: {id: id}}).then(function (reponse) {
                    let result = reponse.body;
                    if (result.status) {
                        _this.delMenuModal.isShow = false;
                        _this.alert.message = '删除成功';
                        _this.alert.alertType = 'success';
                        _this.alert.isShow = true;
                        _this.treeRefresh();
                    }
                });
            },
            //删除二级菜单
            delLevel1MenuModalConfirm(){
                let _this = this;
                let parentId = _this.level1Menu.parentId;
                let subIndex = _this.level1Menu.subIndex;
                _this.$http.put('api/delLevel1Menu', {}, {
                    params: {
                        parentId: parentId,
                        subIndex: subIndex
                    }
                }).then(function (reponse) {
                    let result = reponse.body;
                    if (result.status) {
                        _this.delMenuModal.isShow = false;
                        _this.alert.message = '删除成功';
                        _this.alert.alertType = 'success';
                        _this.alert.isShow = true;
                        _this.treeRefresh();
                    }
                });
            },
            //文件树刷新代码
            treeRefresh(){
                let _this = this;
                _this.$http.get("api/findMenus", {}).then(function (response) {
                    let result = response.body;
                    let zNodes = [];
                    if (result.status) {
                        let menus = result.menus;
                        for (let i in menus) {
                            let obj = {};
                            obj.tidKey = menus[i]._id;
                            obj.name = menus[i].name;
                            obj.iconKey = menus[i].icon;
                            obj.uri = menus[i].uri;
                            obj.order = menus[i].order;
                            obj.typeKey = menus[i].type;
                            obj.open = true;
                            obj.children = [];
                            for (let j in menus[i].subMenus) {
                                menus[i].subMenus[j].pidKey = menus[i]._id;
                                menus[i].subMenus[j].subIndex = j;
                                obj.children.push(menus[i].subMenus[j]);
                            }
                            zNodes.push(obj);
                        }
                        _this.zNodes = zNodes;
                        $.fn.zTree.init($("#treeDemo"), _this.treeSetting, _this.zNodes);
                    }
                });
            }
        },
        mounted(){
            this.treeRefresh();
            let _this = this;
            this.treeSetting = {
                data: {
                    simpleData: {
                        enable: true,
                    }
                },
                callback: {
                    onClick: onClick
                }
            };
            function onClick(event, treeId, treeNode, clickFlag) {
                _this.zNodesLevel = treeNode.level;
                _this.delMenuModal.text = treeNode.name;
                if (_this.zNodesLevel === 0) {
                    _this.level0Menu.id = treeNode.tidKey;
                    _this.level0Menu.name = treeNode.name;
                    _this.level0Menu.icon = treeNode.iconKey;
                    _this.level0Menu.uri = treeNode.uri;
                    _this.level0Menu.link = treeNode.link;
                    _this.level0Menu.type = treeNode.typeKey;
                    _this.level1Menu.parentId = treeNode.tidKey;
                    _this.level1Menu.type = treeNode.typeKey;
                    _this.level1Menu.order = treeNode.order;
                } else {
                    _this.level1Menu.parentId = treeNode.pidKey;
                    _this.level1Menu.name = treeNode.name;
                    _this.level1Menu.remark = treeNode.remark;
                    _this.level1Menu.link = treeNode.link;
                    _this.level1Menu.type = treeNode.type;
                    _this.level1Menu.subIndex = treeNode.subIndex;
                    _this.level1Menu.uri = treeNode.uri;
                }

            }
        }
    }
</script>