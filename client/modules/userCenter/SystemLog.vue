<template>
    <div>
        <ul class="breadcrumb">
            <li>系统管理</li>
            <li>系统通知</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form @submit.prevent="findSystemLogsList(1)" class="form-inline no-margin clearfix">
                        <div class="form-group">
                            <label class="sr-only">查询</label>
                            <select class="form-control" v-model="searchParam.type">
                                <option v-for="type in searchTypes" v-bind:value="type.value">{{type.name}}</option>
                            </select>
                            <input type="text" class="form-control" placeholder="关键字" v-model="searchParam.keyword"/>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="findSystemLogsList(1)">搜索</button>
                        <button type="button" class="btn btn-sm btn-success right" v-on:click="delModalShow()" :disabled="checkLogIds.length < 2">批量删除</button>
                        <button type="button" class="btn btn-sm btn-success right m-right-sm" v-on:click="readHandleBatchModalShow()" :disabled="checkLogIds.length < 2">批量已读</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="dashboard-system-log-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>标题</th>
                        <th>接收时间</th>
                        <th>发件人</th>
                        <th>内容</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(log,index) in logsList" @click="tabTrHandle(log._id,index)" class="dashboard-system-log-tr" :class="{'dashboard-system-log-noread':log.readState==='0'}">
                        <td>
                            <input type="checkbox" v-model="checkLogIds" :value="log._id"/>
                        </td>
                        <td v-text="log.title"></td>
                        <td>{{log.receiptTime | DateFilter}}</td>
                        <td v-text="log.addresser"></td>
                        <td v-text="log.content" class="dashboard-systemlog-table-content"></td>
                        <td >{{log.readState | readStateFilter}}</td>
                        <td class="dashboard-system-log-tdhandle">
                            <a href="javascript:void(0)" v-on:click.stop="detailModalShow(log)">详情</a>
                            <a href="javascript:void(0)" v-on:click.stop="delModalShow(log)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="searchParam.pageIndex" :page-size="searchParam.pageSize" :total="searchTotalCount" :max-link="5" :page-handler="findSystemLogsList"></zpagenav>
            </div>
        </div>
        <modal v-model="detailModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="detailModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">系统通知详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div id="dashboard-system-log-detail">
                        <div class="row">
                            <label class="col-md-2 col-sm-2 control-label">标题：</label>
                            <div class="col-md-4 col-sm-4">
                                {{detailModal.title}}
                            </div>
                            <label class="col-md-2 col-sm-2 control-label">发件人：</label>
                            <div class="col-md-4 col-sm-4">
                                {{detailModal.addresser}}
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-2 col-sm-2 control-label">接收时间：</label>
                            <div class="col-md-4 col-sm-4">
                                {{detailModal.receiptTime | DateFilter}}
                            </div>
                            <label class="col-md-2 col-sm-2 control-label">状态：</label>
                            <div class="col-md-4 col-sm-4">
                                {{detailModal.readState | readStateFilter}}
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-2 col-sm-2 control-label">内容：</label>
                            <div class="col-md-10 col-sm-10">
                                {{detailModal.content}}
                            </div>
                        </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="detailModal.isShow = false">关闭</button>
            </div>
        </modal>
        <modal v-model="delModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="delModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">确认删除</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <span v-if="delModal.num === 1">确认要删除 {{delModal.title}} 吗</span>
                <span v-else="delModal.num === 1">确认要删除这 {{delModal.num}} 条通知吗？</span>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="delModal.isShow=false">取消</button>
                <button type="button" class="btn btn-success" @click="delLogConfirm()">确定</button>
            </div>
        </modal>
        <modal v-model="readHandleBatchModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="readHandleBatchModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">确认批量已读</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <span>确认要批量已读这 {{readHandleBatchModal.num}} 条吗？</span>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="readHandleBatchModal.isShow=false">取消</button>
                <button type="button" class="btn btn-success" @click="readHandleBatchConfirm()">确定</button>
            </div>
        </modal>
        <alert v-model="windowAlert.isShow" placement="top" duration="2000" :type="windowAlert.alertType" width="400px" dismissable class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <strong>{{windowAlert.title}}</strong>
            <p>{{windowAlert.message}}</p>
        </alert>
    </div>
</template>
<style scoped>
    .dashboard-system-log-activetr{
        color: #666;
        background-color: #e5edf4;
    }
    .dashboard-system-log-noread{
        font-weight: bold;
    }
    .dashboard-system-log-tdhandle{
         font-weight:normal;
     }
    #dashboard-system-log-detail .row{
        margin-bottom: 12px;
    }
    #dashboard-system-log-detail label{
        text-align: right;
    }
    .dashboard-system-log-tr{
        cursor: pointer;
    }
</style>
<script>
    import { modal,alert } from 'vue-strap';
    import $ from 'jquery';
    export default{
        data(){
            return{
                searchTypes: [
                    {
                        value:"title",
                        name:"标题"
                    },
                    {
                        value:"addresser",
                        name:"发件人"
                    },
                    {
                        value:"content",
                        name:"内容"
                    }
                ],
                searchParam: {
                    type:"title",
                    keyword: "",
                    pageIndex: 1,
                    pageSize: 10,
                },
                searchTotalCount:0,
                logsList: [],
                detailModal: {
                    isShow: false,
                    title: "",
                    addresser: "",
                    content: "",
                    receiptTime: null,
                    readState: null
                },
                checkLogIds:[],
                delModal: {
                    isShow: false,
                    title: "",
                    id: "",
                    num: 0
                },
                readHandleBatchModal:{
                    isShow: false,
                    id: "",
                    num: ""
                },
                windowAlert:{
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
        methods:{
            findSystemLogsList(page){
                let _this = this;
                _this.initSelected();
                if(typeof page ==="number"){
                    _this.searchParam.pageIndex = page;
                }
                _this.$http.get('api/findSystemLogsList', {params: _this.searchParam}).then(function(res){
                    if(res.body.status){
                        _this.logsList = res.body.datas;
                        _this.searchParam.pageIndex = res.body.pageIndex;
                        _this.searchTotalCount = res.body.totalCount;
                    }
                });
            },
            detailModalShow(obj){
                this.detailModal.title = obj.title;
                this.detailModal.addresser = obj.addresser;
                this.detailModal.content = obj.content;
                this.detailModal.receiptTime = obj.receiptTime;
                this.detailModal.readState = obj.readState;
                this.detailModal.isShow = true;
                let _this = this;
                _this.$http.put("api/updateSystemLogReadState",{},{params:{id:obj._id}}).then(function (response) {
                    let result = response.body;
                    if (result.status) {
                        _this.findSystemLogsList();
                    }
                });

            },
            delModalShow(obj){
                if(obj){
                    this.delModal.num = 1;
                    this.delModal.title = obj.title;
                    this.delModal.id = obj._id;
                    this.delModal.isShow = true;

                }else{
                    this.delModal.title = "";
                    this.delModal.num = this.checkLogIds.length;
                    this.delModal.id = this.checkLogIds.join(",");
                    this.delModal.isShow = true;
                }

            },
            delLogConfirm(){
                let id = this.delModal.id;
                let _this = this;
                _this.$http.delete("api/deleteSystemLog", {params:{id:id}}).then(function (response) {
                    let result = response.body;
                    if (result.status) {
                        let page=(_this.searchTotalCount-1===(_this.searchParam.pageIndex-1)*_this.searchParam.pageSize) ? _this.searchParam.pageIndex-1 : _this.searchParam.pageIndex;
                        _this.findSystemLogsList(page);
                        _this.checkLogIds = [];
                        _this.delModal.isShow=false;
                    }
                });
            },
            readHandleBatchModalShow(){
                this.readHandleBatchModal.id = this.checkLogIds.join(",");
                this.readHandleBatchModal.num = this.checkLogIds.length;
                this.readHandleBatchModal.isShow = true;
            },
            readHandleBatchConfirm(){
                let _this = this;
                let id = this.readHandleBatchModal.id;
                _this.$http.put("api/updateSystemLogReadState", {},{params:{id:id}}).then(function (response) {
                    let result = response.body;
                    if (result.status) {
                        _this.findSystemLogsList();
                        _this.readHandleBatchModal.isShow=false;
                    }
                });
            },
            tabTrHandle(id,index){
                let $tr = $(".dashboard-system-log-tr").eq(index);
                let ids = this.checkLogIds;
                for(let i = 0;i < ids.length;i++){
                    if(ids[i] === id){
                        this.checkLogIds.splice(i,1);
                        $tr.removeClass('dashboard-system-log-activetr');
                        return
                    }
                }
                $tr.addClass('dashboard-system-log-activetr');
                this.checkLogIds.push(id);

            },
            initSelected(){
                let _this = this;
                _this.checkLogIds = [];
                $(".dashboard-system-log-tr").removeClass('dashboard-system-log-activetr');

            }
        },
        watch: {
            '$route': 'findSystemLogsList'
        },
        created (){
            this.findSystemLogsList(1);
        },
        props:["permission","base"]
    }
</script>