<template>
    <div>
        <ul class="breadcrumb">
            <li>设备管理</li>
            <li>设备升级</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-horizontal" data-vv-scope="deviceVali"  onsubmit="return false">
                        <div class="form-group">
                            <div class="form-line-validator">
                                <label class="col-md-2 control-label label-name">设备供应商<span class="form-validation">*</span>:</label>
                                <div class="col-md-3">
                                    <select v-validate:manufacturerName="'required'" name="manufacturerName" data-vv-as="设备供应商"
                                            :class="{'select': true, 'is-danger': errors.has('deviceVali.manufacturerName') }"
                                            class="form-control" v-model="upgradeParam.manufacturerId" v-on:change="manufacturerChange()">
                                        <option value="">--请选择--</option>
                                        <option v-for="deviceManufacturer in deviceManufacturerList" v-bind:value="deviceManufacturer.id">{{deviceManufacturer.name}}</option>
                                    </select>
                                    <span v-show="errors.has('deviceVali.manufacturerName')" class="help is-danger">{{ errors.first('deviceVali.manufacturerName') }}</span>
                                </div>
                            </div>
                            <div class="form-line-validator">
                                <label class="col-md-2 control-label label-name">设备类型<span class="form-validation">*</span>:</label>
                                <div class="col-md-3">
                                    <select v-validate:modelName="'required'" name="modelName" data-vv-as="设备类型"
                                            :class="{'select': true, 'is-danger': errors.has('deviceVali.modelName') }"
                                            class="form-control" v-model="upgradeParam.modelId">
                                        <option value="">--请选择--</option>
                                        <option v-for="deviceModel in deviceModelList" v-bind:value="deviceModel.id">{{deviceModel.name}}</option>
                                    </select>
                                    <span v-show="errors.has('deviceVali.modelName')" class="help is-danger">{{ errors.first('deviceVali.modelName') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">关键字:</label>
                            <div class="col-md-3">
                                <select class="form-control input-sm" v-model="upgradeParam.type">
                                    <option value="">--请选择--</option>
                                    <option v-for="deviceType in deviceTypeList" :value="deviceType.value">{{deviceType.name}}</option>
                                </select>
                            </div>
                            <label class="col-md-2 control-label">过滤条件:</label>
                            <div class="col-md-3">
                                <input type="text" class="form-control input-sm" v-model="upgradeParam.keyword">
                            </div>
                            <div class="col-md-2">
                                <button type="button" class="btn btn-sm btn-success" @click="findDevice">搜索</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>设备号</th>
                    <th>VIN</th>
                    <th>经销商</th>
                    <th>硬件版本</th>
                    <th>固件版本</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="deviceFile in deviceFileList">
                    <td>{{deviceFile.sn}}</td>
                    <td>{{deviceFile.vin}}</td>
                    <td>{{deviceFile.dealer}}</td>
                    <td>{{deviceFile.hardVersion}}</td>
                    <td>{{deviceFile.firmVersion}}</td>
                    <td>
                        <a href="javascript:void(0)" v-on:click="deviceUpgradeEvent(deviceFile)">升级</a>
                        <a href="javascript:void(0)" v-on:click="upgradeHistoryEv(deviceFile)">历史</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="upgradeParam.pageIndex" :page-size="upgradeParam.pageSize" :total="totalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
            </div>
        </div>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
        <modal v-model="deviceUpgradeModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="deviceUpgradeModal.isShow=false;"><span>×</span></button>
                <h4 class="modal-title">设备升级</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="data-table table-responsive">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>设备号</th>
                            <th>设备厂商</th>
                            <th>设备类型</th>
                            <th>VIN</th>
                            <th>硬件版本</th>
                            <th>固件版本</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{{deviceUpgrade.sn}}</td>
                            <td>{{deviceUpgrade.manufacturerName}}</td>
                            <td>{{deviceUpgrade.modelName}}</td>
                            <td>{{deviceUpgrade.vin}}</td>
                            <td>{{deviceUpgrade.hardVersion}}</td>
                            <td>{{deviceUpgrade.firmVersion}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-md-3 control-label">目标版本号<span class="form-validation">*</span>:</label>
                        <div class="col-md-3">
                            <select class="form-control input-sm">
                                <option>V1.0.1</option>
                                <option>V1.3.2</option>
                                <option>V2.1.1</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="deviceUpgradeModal.isShow=false;">取消</button>
                <button type="button" class="btn btn-default" @click="deviceUpgradeConfirm">确定</button>
            </div>
        </modal>
        <modal v-model="upgradeHistoryModal.isShow" :backdrop="false" large>
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="upgradeHistoryModal.isShow=false;"><span>×</span></button>
                <h4 class="modal-title">历史任务详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-md-3 control-label">设备号</label>
                        <div class="col-md-3 control-div">
                            {{upgradeHistory.sn}}
                        </div>
                        <label class="col-md-3 control-label">VIN:</label>
                        <div class="col-md-3 control-div">
                            {{upgradeHistory.vin}}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">设备供应商:</label>
                        <div class="col-md-3 control-div">
                            {{upgradeHistory.manufacturerName}}
                        </div>
                        <label class="col-md-3 control-label">设备类型:</label>
                        <div class="col-md-3 control-div">
                            {{upgradeHistory.modelName}}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">经销商:</label>
                        <div class="col-md-3 control-div">
                            {{upgradeHistory.dealer}}
                        </div>
                    </div>
                </form>
                <div class="data-table table-responsive">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>原版本号</th>
                            <th>当前版本号</th>
                            <th>升级时间</th>
                            <th>升级状态</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="history in upgradeHistory.history">
                            <td>{{history.lastVersion}}</td>
                            <td>{{history.version}}</td>
                            <td>{{history.upgradeTime}}</td>
                            <td>{{history.upgradeStatus}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination-row clearfix">
                    <div class="pull-right pull-left-sm">
                        <zpagenav :page="1" :page-size="10" :total="3" :max-link="5" :page-handler="pageHandler"></zpagenav>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="upgradeHistoryModal.isShow=false;">取消</button>
                <button type="button" class="btn btn-default" @click="upgradeHistoryModal.isShow=false;">确定</button>
            </div>
        </modal>
    </div>
</template>
<script>
    import {modal,alert} from 'vue-strap';
    export default {
        data () {
            return {
                alert: {
                    isShow: false
                },
                maxLink: 5,
                totalCount: 5,
                deviceFileList: [
                    {
                        sn: "3150300139",
                        vin: "LJ16AA23697002595",
                        manufacturerName: "有为",
                        modelName: "有为",
                        dealer: "北汽银翔",
                        hardVersion: "v1.0.5",
                        firmVersion: "v1.0.25",
                        history: [
                            {
                                lastVersion: "v1.0.1",
                                version: "v1.0.10",
                                upgradeTime: "2017/5/10 12:28:10",
                                upgradeStatus: "成功"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.15",
                                upgradeTime: "2017/5/15 16:13:27",
                                upgradeStatus: "失败"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.25",
                                upgradeTime: "2017/6/09 10:07:10",
                                upgradeStatus: "成功"
                            }
                        ]
                    },
                    {
                        sn: "3150300139",
                        vin: "LJ16AA23697002595",
                        manufacturerName: "有为",
                        modelName: "有为",
                        dealer: "北汽银翔",
                        hardVersion: "v1.0.5",
                        firmVersion: "v1.0.30",
                        history: [
                            {
                                lastVersion: "v1.0.1",
                                version: "v1.0.10",
                                upgradeTime: "2017/5/10 12:28:10",
                                upgradeStatus: "成功"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.15",
                                upgradeTime: "2017/5/15 16:13:27",
                                upgradeStatus: "失败"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.25",
                                upgradeTime: "2017/6/09 10:07:10",
                                upgradeStatus: "成功"
                            }
                        ]
                    },
                    {
                        sn: "3150300139",
                        vin: "LJ16AA23697002595",
                        manufacturerName: "有为",
                        modelName: "有为",
                        dealer: "北汽银翔",
                        hardVersion: "v1.0.6",
                        firmVersion: "v1.1.10",
                        history: [
                            {
                                lastVersion: "v1.0.1",
                                version: "v1.0.10",
                                upgradeTime: "2017/5/10 12:28:10",
                                upgradeStatus: "成功"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.15",
                                upgradeTime: "2017/5/15 16:13:27",
                                upgradeStatus: "失败"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.25",
                                upgradeTime: "2017/6/09 10:07:10",
                                upgradeStatus: "成功"
                            }
                        ]
                    },
                    {
                        sn: "3150300139",
                        vin: "LJ16AA23697002595",
                        manufacturerName: "有为",
                        modelName: "有为",
                        dealer: "北汽银翔",
                        hardVersion: "v1.0.6",
                        firmVersion: "v1.0.25",
                        history: [
                            {
                                lastVersion: "v1.0.1",
                                version: "v1.0.10",
                                upgradeTime: "2017/5/10 12:28:10",
                                upgradeStatus: "成功"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.15",
                                upgradeTime: "2017/5/15 16:13:27",
                                upgradeStatus: "失败"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.25",
                                upgradeTime: "2017/6/09 10:07:10",
                                upgradeStatus: "成功"
                            }
                        ]
                    },
                    {
                        sn: "3150300139",
                        vin: "LJ16AA23697002595",
                        manufacturerName: "有为",
                        modelName: "有为",
                        dealer: "北汽银翔",
                        hardVersion: "v1.0.6",
                        firmVersion: "v1.0.25",
                        history: [
                            {
                                lastVersion: "v1.0.1",
                                version: "v1.0.10",
                                upgradeTime: "2017/5/10 12:28:10",
                                upgradeStatus: "成功"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.15",
                                upgradeTime: "2017/5/15 16:13:27",
                                upgradeStatus: "失败"
                            },
                            {
                                lastVersion: "v1.0.10",
                                version: "v1.0.25",
                                upgradeTime: "2017/6/09 10:07:10",
                                upgradeStatus: "成功"
                            }
                        ]
                    }
                ],
                deviceManufacturerList: [],
                deviceModelList: [],
                upgradeParam: {
                    manufacturerId: "",
                    modelId: "",
                    type: "",
                    keyword: "",
                    pageIndex:1,
                    pageSize:10
                },
                deviceTypeList: [
                    {
                        name: "设备号",
                        value:"sn"
                    },
                    {
                        name: "IMEI",
                        value:"imei"
                    },
                    {
                        name: "经销商",
                        value:"dealerName"
                    }
                ],
                deviceUpgradeModal: {
                    isShow: false
                },
                upgradeHistoryModal: {
                    isShow: false
                },
                deviceUpgrade: {},
                upgradeHistory: []
            }
        },
        components: {
            modal,
            alert
        },
        methods: {
            findDevice(){

            },
            pageHandler(pageIndex){

            },
            getDeviceManufacturer(){
                let _this = this;
                _this.$http.get('api/getDeviceManufacturer', { params: {type: "name"}}).then(function(data){
                    if(data.body.status){
                        _this.deviceManufacturerList = data.body.datas;
                    }else{
                        _this.alert = {
                            isShow: true,
                            content: data.errorMessage,
                            type: "danger"
                        }
                    }
                }).catch(function(error){
                    _this.alert = {
                        isShow: true,
                        content: "服务器内部错误！",
                        type: "danger"
                    }
                });
            },
            manufacturerChange(){
                let _this = this;
                let manufacturerId = _this.upgradeParam.manufacturerId;
                if(manufacturerId){
                    _this.$http.get('api/getDeviceModel', { params: {type: "name", manufacturerId: manufacturerId}}).then(function(data){
                        if(data.body.status){
                            _this.deviceModelList = data.body.datas;
                        }else{
                            _this.alert = {
                                isShow: true,
                                content: data.errorMessage,
                                type: "danger"
                            }
                        }
                    }).catch(function(error){
                        _this.alert = {
                            isShow: true,
                            content: "服务器内部错误！",
                            type: "danger"
                        }
                    });
                }
            },
            deviceUpgradeEvent(param){
                this.deviceUpgradeModal.isShow = true;
                this.deviceUpgrade = param;
            },
            deviceUpgradeConfirm(){
                this.deviceUpgradeModal.isShow = false;
            },
            upgradeHistoryEv(history){
                this.upgradeHistoryModal.isShow = true;
                this.upgradeHistory = history;
            }
        },
        created(){
            this.getDeviceManufacturer();
        }
    }
</script>