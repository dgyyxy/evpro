<template>
    <div>
        <ul class="breadcrumb">
            <li>系统管理</li>
            <li>资源管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form onsubmit="return false;" class="form-inline no-margin">
                        <div class="form-group">
                            <label class="sr-only">资源名</label>
                            <input type="text" class="form-control" placeholder="关键字" v-model="search.keyword"/>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="searchPage">搜索</button>
                        <button type="button" class="btn btn-sm btn-success right" v-on:click="addModalShow()">新增资源</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-striped" >
                <thead>
                <tr>
                    <th>名称</th>
                    <th>关键字</th>
                    <th>URI</th>
                    <th>描述</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="re in resource">
                    <td v-text="re.name"></td>
                    <td v-text="re.keyword"></td>
                    <td v-text="re.uri"></td>
                    <td v-text="re.description"></td>
                    <td>
                        <i-button type="ghost" size="small" icon="edit" @click="editModalShow(re)">编辑</i-button>
                        <i-button type="ghost" size="small" icon="android-delete" @click="deleteResourceModalShow(re)">删除</i-button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="search.pageIndex" :page-size="search.pageSize" :total="search.totalCount" :max-link="search.maxLink" :page-handler="searchPage"></zpagenav>
            </div>
        </div>
        <modal v-model="addModalShowIsShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="addModalShowIsShow=false"><span>×</span></button>
                <h4 class="modal-title">添加资源</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate data-vv-scope="addResourceVali">
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">是否为父级资源：</label>
                        <div class="col-md-6 col-sm-6">
                            <input type="checkbox" id="isParent" value="true" name="isParent" v-model="addResource.isParent">
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">上级资源：</label>
                        <div class="col-md-6 col-sm-6">
                            <select class="form-control input-sm" v-model="addResource.parent">
                                <option v-bind:value="null">无</option>
                                <option v-for="resource in resources" v-bind:value="resource._id" v-show="resource.isParent">{{resource.name}}</option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">名称：</label>
                        <div class="col-md-6 col-sm-6">
                            <input class="form-control input-sm" v-model="addResource.name"
                                   v-validate:name="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('addResourceVali.name')}"
                                   name="name" data-vv-as="名称"/>
                            <i v-show="errors.has('addResourceVali.name')" class="fa fa-warning"></i>
                            <span v-show="errors.has('addResourceVali.name')"
                                  class="help is-danger">{{ errors.first('addResourceVali.name') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">uri：</label>
                        <div class="col-md-6 col-sm-6">
                            <input class="form-control input-sm" v-model="addResource.uri"  name="uri"
                                   v-validate:uri="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('addResourceVali.uri')}"
                                    data-vv-as="URI"/>
                            <i v-show="errors.has('addResourceVali.uri')" class="fa fa-warning"></i>
                            <span v-show="errors.has('addResourceVali.uri')"
                                  class="help is-danger">{{ errors.first('addResourceVali.uri') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">描述：</label>
                        <div class="col-md-6 col-sm-6">
                            <textarea rows="5" cols="30" class="form-control input-sm" v-model="addResource.description" ></textarea>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="errors.clear('addResourceVali');addModalShowIsShow=false">取消</button>
                <button type="button" class="btn btn-success" :disabled="errors.any('addResourceVali')" @click="generateResource()">确定</button>
            </div>
        </modal>
        <modal v-model="editModalShowIsShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="editModalShowIsShow=false"><span>×</span></button>
                <h4 class="modal-title">编辑资源</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate data-vv-scope="editResourceVali">
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">是否为父级资源：</label>
                        <div class="col-md-6 col-sm-6">
                            <input type="checkbox" value="true" name="isParent" v-model="editResource.isParent">
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">上级资源：</label>
                        <div class="col-md-6 col-sm-6">
                            <select class="form-control input-sm" v-model="editResource.parent">
                                <option v-bind:value="null">无</option>
                                <option v-for="resource in resources" v-if="resource._id!==editResource.resourceId" v-bind:value="resource._id">{{resource.name}}</option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">名称：</label>
                        <div class="col-md-6 col-sm-6">
                            <input class="form-control input-sm" v-model="editResource.name"
                                   v-validate:name="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('editResourceVali.name')}"
                                   name="name" data-vv-as="名称"/>
                            <i v-show="errors.has('editResourceVali.name')" class="fa fa-warning"></i>
                            <span v-show="errors.has('editResourceVali.name')"
                                  class="help is-danger">{{ errors.first('editResourceVali.name') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">uri：</label>
                        <div class="col-md-6 col-sm-6">
                            <input class="form-control input-sm" v-model="editResource.uri"  name="uri"
                                   v-validate:uri="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('editResourceVali.uri')}"
                                   data-vv-as="URI"/>
                            <i v-show="errors.has('editResourceVali.uri')" class="fa fa-warning"></i>
                            <span v-show="errors.has('editResourceVali.uri')"
                                  class="help is-danger">{{ errors.first('editResourceVali.uri') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label">描述：</label>
                        <div class="col-md-6 col-sm-6">
                            <textarea rows="5" cols="30" class="form-control input-sm" v-model="editResource.description" ></textarea>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="errors.clear('editResourceVali');editModalShowIsShow=false">取消</button>
                <button type="button" class="btn btn-success" :disabled="errors.any('editResourceVali')" @click="editGenerateResource()">确定</button>
            </div>
        </modal>
        <modal v-model="del.delModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="del.delModalShow=false"><span>×</span></button>
                <h4 class="modal-title" v-text="del.title"></h4>
            </div>
            <div slot="modal-body" class="modal-body">确认要删除 {{del.delName}} 吗？</div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="del.delModalShow=false">取消</button>
                <button type="button" class="btn btn-success" @click="deleteResourceConfirm()">确定</button>
            </div>
        </modal>
        <alert v-model="alert.isShow" placement="top" duration="2000" :type="alert.alertType" width="400px" dismissable class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <strong>{{alert.title}}</strong>
            <p>{{alert.message}}</p>
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
    import { modal,alert } from 'vue-strap';
    export default{
        data(){
            return{
                search: {
                    keyword: "",
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                resource: [],
                resources: [],
                addModalShowIsShow:false,
                addResource: {
                    name: "",
                    uri: "",
                    description: "",
                    parent: "",
                    isParent: false,
                    keyword: ""
                },
                editModalShowIsShow:false,
                editResource:{
                    name: "",
                    uri: "",
                    description:"",
                    resourceId: "",
                    isParent: false,
                    keyword: "",
                    parent:""
                },
                del:{
                    delModalShow:false,
                    delId:'',
                    delName:'',
                    title:'提示',
                    obj:null
                },
                resourceFormVali: {
                    name: {
                        required: {
                            rule: true,
                            message: "请输入名称"
                        }
                    },
                    uri: {
                        required: {
                            rule: true,
                            message: "请输入uri"
                        }
                    },
                    parent:{
                        required: {
                            rule: true,
                            message: "请选择上级资源"
                        }
                    }
                },
                alert:{
                    isShow:false,
                    title:'',
                    message:'',
                    alertType:''
                }
            }
        },
        components: {
            modal,alert
        },
        watch: {
            '$route': 'searchPage'
        },
        mounted (){
            this.searchPage();
        },
        methods:{
            searchPage(page){
                let _this = this;
                if(_this.search.keyword === "") delete _this.search.keyword;
                _this.search.pageIndex = (typeof page ==="number") ? page :_this.search.pageIndex;
                _this.$http.get('api/findResourceByConditionAndPage', {params: _this.search}).then(function(res){
                    if(res.body.status){
                        _this.resource = res.body.resource;
                        _this.search.pageIndex = res.body.pageIndex;
                        _this.search.totalCount = res.body.totalCount;
                    }
                });
                _this.$http.get('api/findResources',{}).then(function(res){
                    if(res.body.status){
                        _this.resources = res.body.resources;
                    }
                });
            },
            addModalShow(){
                this.addResource.name="";
                this.addResource.uri="";
                this.addResource.description="";
                this.addResource.parent= "";
                this.addResource.isParent = false;
                this.addResource.keyword = "";
                this.addModalShowIsShow=true;
            },
            generateResource(){
                let _this = this;
                var uri = _this.addResource.uri;
                var arr = uri.split("/");
                if(arr.length==2) _this.addResource.keyword = arr[1];
                _this.$http.post("api/addResource", _this.addResource).then(function (response) {
                    if (response.body) {
                        let searchPage=(_this.search.totalCount === _this.search.pageIndex*_this.search.pageSize) ? _this.search.pageIndex+1 : _this.search.pageIndex;
                        _this.searchPage(searchPage);
                        _this.addModalShowIsShow = false;
                        _this.alert.message = "新增成功！";
                        _this.alert.isShow = true;
                        _this.alert.alertType = "success";
                    }
                });
            },
            editModalShow(obj){
                this.editResource.name=obj.name;
                this.editResource.uri=obj.uri;
                this.editResource.description=obj.description;
                this.editResource.resourceId=obj._id;
                this.editResource.parent=obj.parent;
                this.addResource.isParent = obj.isParent;
                this.addResource.keyword = obj.keyword;
                this.editModalShowIsShow=true;
            },
            editGenerateResource(){
                let _this = this;
                let id = _this.editResource.resourceId;
                var uri = _this.editResource.uri;
                var arr = uri.split("/");
                if(arr.length==2) _this.editResource.keyword = arr[1];
                _this.$http.put("api/updateResource", _this.editResource,{params:{id:id}}).then(function (response) {
                    let result = response.body;
                    if (result.status) {
                        _this.searchPage();
                        _this.editModalShowIsShow = false;
                        _this.alert.message = "修改成功！";
                        _this.alert.isShow = true;
                        _this.alert.alertType = "success";
                    }
                });
            },
            deleteResourceModalShow(obj){
                this.del.name=obj.name;
                this.del.delModalShow=true;
                this.del.obj=obj;
            },
            deleteResourceConfirm(){
                let obj = this.del.obj;
                let _this = this;
                _this.$http.delete("api/deleteResource", {params:{id:obj._id,parent:obj.parent}}).then(function (response) {
                    let result = response.body;
                    if (result.status) {
                        let searchPage=(_this.search.totalCount-1===(_this.search.pageIndex-1)*_this.search.pageSize) ? _this.search.pageIndex-1 : _this.search.pageIndex;
                        _this.searchPage(searchPage);
                        _this.del.delModalShow=false;
                        _this.alert.message = "删除成功！";
                        _this.alert.isShow = true;
                        _this.alert.alertType = "success";
                    }
                });
            }
        }
    }
</script>