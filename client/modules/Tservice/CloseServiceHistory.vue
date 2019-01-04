<template>
    <div>
        <ul class="breadcrumb">
            <li>T服务管理</li>
            <li>T服务关闭</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">车主姓名：</label>
                            <input type="text" class="form-control input-sm" v-model="serviceCloseListSearch.ownerName"
                                   placeholder="请输入车主姓名"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">车辆VIN码：</label>
                            <input type="text" class="form-control input-sm" v-model="serviceCloseListSearch.vin"
                                   placeholder="请输入车辆VIN码"/>
                        </div>
                    </form>
                    <form class="form-inline m-top-xs" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">选择时间：</label>
                            <date-picker class="right" v-model="serviceCloseListSearch.dateTime" type="datetimerange"
                                         :options="datePickerOption" placeholder="请选择开始时间 —— 结束时间"
                                         style="width: 280px"></date-picker>
                        </div>
                        <button type="button" class="btn btn-sm btn-success"
                                v-on:click="searchServiceCloseList('search')">查询
                        </button>
                        <button type="button" class="btn btn-sm btn-success right" v-on:click="showCloseStep()" v-if="message['/tservice/closeServiceHistory/close']">关闭T服务
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>车主姓名</th>
                    <th>手机号</th>
                    <th>车辆VIN码</th>
                    <th>身份证号码</th>
                    <th>关闭时间</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="serviceClose in serviceCloseListData">
                    <td>{{serviceClose.ownerName}}</td>
                    <td>{{serviceClose.userName}}</td>
                    <td>{{serviceClose.vin}}</td>
                    <td>{{serviceClose.idNumber}}</td>
                    <td>{{serviceClose.closeTime | activeDateFilter}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="serviceCloseListSearchParam.pageIndex"
                          :page-size="serviceCloseListSearchParam.pageSize"
                          :total="serviceCloseListTotalCount" :max-link="5"
                          :page-handler="searchServiceCloseList"></zpagenav>
            </div>
        </div>
        <modal v-model="modalShow" :backdrop="false">
            <template v-if="stepShow[0]">
                <div slot="modal-header" class="modal-header">
                    <button type="button" class="close" v-on:click="resetModal()">
                        <span>×</span></button>
                    <h4 class="modal-title">关闭T服务</h4>
                </div>
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                          data-vv-scope="closeTserviceForm">
                        <div class="form-group">
                            <label for="oservice-vin"
                                   class="col-md-3 col-sm-3 control-label form-required">车辆VIN码后六位:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="6" placeholder="请输入车辆VIN码后六位"
                                       id="oservice-vin" data-vv-as="车辆VIN码后六位" name="vin"
                                       v-model="TserviceSearch.vin" v-validate:vin="'required|min:6|numeric'"
                                       :class="{'input': true, 'is-danger': errors.has('closeTserviceForm.vin') }"/>
                                <i v-show="errors.has('closeTserviceForm.vin')" class="fa fa-warning"></i>
                                <span v-show="errors.has('closeTserviceForm.vin')"
                                      class="help is-danger">{{ errors.first('closeTserviceForm.vin') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="oservice-engine"
                                   class="col-md-3 col-sm-3 control-label form-required">发动机号码后六位:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="6" placeholder="请输入发动机号码后六位"
                                       id="oservice-engine" data-vv-as="发动机号码后六位" name="password"
                                       v-model="TserviceSearch.engineNumber"
                                       v-validate:engine="'required|min:6|alpha_num'"
                                       :class="{'input': true, 'is-danger': errors.has('closeTserviceForm.engine') }"/>
                                <i v-show="errors.has('closeTserviceForm.engine')" class="fa fa-warning"></i>
                                <span v-show="errors.has('closeTserviceForm.engine')"
                                      class="help is-danger">{{ errors.first('closeTserviceForm.engine') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetModal()">取消
                    </button>
                    <button type="button" class="btn btn-success" @click="fromStep1ToStep2('closeTserviceForm')">下一步
                    </button>
                </div>
            </template>
            <template v-if="stepShow[1]">
                <div slot="modal-header" class="modal-header">
                    <button type="button" class="close" v-on:click="resetModal()"><span>×</span></button>
                    <h4 class="modal-title">确认关闭</h4>
                </div>
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" novalidate>
                        <div class="form-group">
                            <label class="col-md-2 control-label">车主姓名:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.ownerName}}</p>
                            </div>
                            <label class="col-md-2 control-label">车主性别:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.gender | genderFilter}}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">车主手机:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.userName}}</p>
                            </div>
                            <label class="col-md-2 control-label">经销商名称:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.dealerName}}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">车型:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.modelName}}</p>
                            </div>
                            <label class="col-md-2 control-label">服务开通日期:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.startTime | activeDateFilter}}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">单据编号:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.formId}}</p>
                            </div>
                            <label class="col-md-2 control-label">服务截止日期:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.endTime | activeDateFilter}}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">身份证号:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.idNumber}}</p>
                            </div>
                            <label class="col-md-2 control-label">单据建立日期:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.createTime | activeDateFilter}}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">套餐名称:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.packageName}}</p>
                            </div>
                            <label class="col-md-2 control-label">紧急联系人:</label>
                            <div class="col-md-4">
                                <p class="form-control-static">{{TserviceData.emergencyContact}}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">开通渠道:</label>
                            <div class="col-md-3">
                                <p class="form-control-static">{{TserviceData.opener | openerFilter}}</p>
                            </div>
                            <div class="col-md-7">
                                <p class="form-control-static">（确认关闭？关闭后车主不能使用T服务相关功能）</p>
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetModal()">取消</button>
                    <button type="button" class="btn btn-success" @click="closeTservice()">关闭T服务
                    </button>
                </div>
            </template>
        </modal>
        <alert v-model="windowAlert.isShow" placement="top" duration="3000" :type="windowAlert.type" width="400px"
               dismissable>
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="windowAlert.content"></p>
        </alert>
    </div>
</template>
<script>
    import {modal, alert} from 'vue-strap'
    import $ from 'jquery'
    import datePicker from 'iview/src/components/date-picker'
    export default{
        data(){
            return {
                datePickerOption: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                serviceCloseListSearch: {
                    ownerName: "",
                    vin: "",
                    dateTime: [null, null],
                    packageStatus: "closed",
                    filterField: "close_time",
                    pageIndex: 1,
                    pageSize: 10
                },
                serviceCloseListSearchParam: {},
                serviceCloseListData: {},
                serviceCloseListTotalCount: null,
                modalShow: false,
                stepShow: [false, false],
                TserviceSearch: {
                    vin: "",
                    engineNumber: ""
                },
                TserviceData: {},
                windowAlert: {
                    isShow: false,
                    type: "",
                    content: ""
                }
            }
        },
        computed: {},
        components: {
            datePicker, modal, alert
        },
        methods: {
            searchServiceCloseList(method){
                let _this = this;
                if (method === 'search') {
                    for (let key in _this.serviceCloseListSearch) {
                        if (key !== 'dateTime') {
                            _this.serviceCloseListSearchParam[key] = _this.serviceCloseListSearch[key];
                        }
                    }
                    _this.serviceCloseListSearchParam.startTime = _this.serviceCloseListSearch.dateTime[0] ? _this.serviceCloseListSearch.dateTime[0].getTime() : 0;
                    _this.serviceCloseListSearchParam.endTime = _this.serviceCloseListSearch.dateTime[1] ? _this.serviceCloseListSearch.dateTime[1].getTime() : new Date().getTime();
                }
                if (typeof method === "number") {
                    _this.serviceCloseListSearchParam.pageIndex = method;
                }
                _this.$http.get('api/queryVehsByUser', {params: _this.serviceCloseListSearchParam}).then(function (res) {
                    if (res.body.status === "SUCCEED") {
                        _this.serviceCloseListData = res.body.datas;
                        _this.serviceCloseListTotalCount = res.body.totalCount;
                    }
                });
            },
            showCloseStep(){
                this.modalShow = true;
                this.stepShow = [true, false];
            },
            fromStep1ToStep2(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    let param = {
                        vin: _this.TserviceSearch.vin,
                        engineNumber: _this.TserviceSearch.engineNumber,
                    };
                    return _this.$http.get('api/queryTService', {params: param})
                }).then(function (res) {
                    if (res.body.status === 'SUCCEED') {
                        let result = res.body.data;
                        _this.TserviceData = result;
                        _this.stepShow = [false, true];
                    } else {
                        _this.showAlert({
                            type: "danger",
                            content: res.body.errorMessage
                        })
                    }
                })
            },
            closeTservice(){
                let _this = this;
                _this.$http.get('api/closeTService', {params: {vehicleId: _this.TserviceData.vehicleId,ownerId: _this.TserviceData.ownerId}}).then(function (res) {
                    if (res.body.status === "SUCCEED") {
                        _this.showAlert({
                            type: "success",
                            content: "关闭成功！"
                        });
                        _this.resetModal();
                        _this.searchServiceCloseList('search');
                    } else {
                        _this.showAlert({
                            type: "danger",
                            content: res.body.errorMessage
                        })
                    }
                });
            },
            resetModal(){
                this.modalShow = false;
                this.TserviceSearch.vin = "";
                this.TserviceSearch.engineNumber = "";
                this.TserviceData = {};
                this.$validator.getErrors().clear('openTserviceForm');
            },
            showAlert(options){
                let _this = this;
                _this.windowAlert.isShow = true;
                _this.windowAlert.type = options.type;
                _this.windowAlert.content = options.content;
            }
        },
        created() {
            this.searchServiceCloseList('search');
        },
        mounted(){
        },
        props:["message"]
    }

</script>
