<template>
    <div>
        <ul class="breadcrumb">
            <li>设备管理</li>
            <li>设备参数批量配置</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">任务名：</label>
                            <input type="text" class="form-control input-sm" v-model="findBatchConfig.groupName" placeholder="请输入任务名"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">状态:</label>
                            <select class="form-control input-sm" v-model="findBatchConfig.status">
                                <option value="">--请选择--</option>
                                <option v-for="cmdStatus in cmdStatusList" :value="cmdStatus.value">{{cmdStatus.name}}</option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" @click="findBatchConfigEvent(1);">搜索</button>
                        <button type="button" class="btn btn-sm btn-success pull-right" @click="addConfigs">新增</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>任务名</th>
                    <th>状态</th>
                    <th>任务描述</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="config in batchConfigList">
                    <td>{{config.groupName}}</td>
                    <td>{{config.status | cmdStateFilter}}</td>
                    <td>{{config.description}}</td>
                    <td>{{config.createdTime | DateFilter}}</td>
                    <td><a href="javascript:void(0)" v-on:click="findSendBatchConfigs(config.groupId)">详情</a></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="findBatchConfig.pageIndex" :page-size="findBatchConfig.pageSize" :total="totalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
            </div>
        </div>
        <modal v-model="batchConfigDetailModal.isShow" :backdrop="false" large>
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="batchConfigDetailModal.isShow=false;"><span>×</span></button>
                <h4 class="modal-title">配置任务详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-md-3 control-label">任务名<span class="form-validation">*</span>:</label>
                        <div class="col-md-3 control-div">
                            {{batchConfigDetail.groupName}}
                        </div>
                        <label class="col-md-3 control-label">任务描述:</label>
                        <div class="col-md-3 control-div">
                            {{batchConfigDetail.description}}
                        </div>
                    </div>
                    <!--
                    <div class="form-group">
                        <label class="col-md-3 control-label">设备供应商:</label>
                        <div class="col-md-3 control-div">
                            {{batchConfigDetail.condition.manufacturerName}}
                        </div>
                        <label class="col-md-3 control-label">设备类型:</label>
                        <div class="col-md-3 control-div">
                            {{batchConfigDetail.condition.modelName}}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">关键字:</label>
                        <div class="col-md-3 control-div">
                            {{batchConfigDetail.condition.type}}
                        </div>
                        <label class="col-md-3 control-label">过滤条件:</label>
                        <div class="col-md-3 control-div">
                            {{batchConfigDetail.condition.keyword}}
                        </div>
                    </div>
                -->
                </form>
                <div class="data-table table-responsive">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>参数项</th>
                            <th>参数值</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="config in batchConfigDetail.configs">
                            <td>{{config.name}}</td>
                            <td>{{config.value}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    执行中：{{batchConfigDetailStat.CMD_PROCESSING}}
                    &nbsp;&nbsp;&nbsp;&nbsp;成功：{{batchConfigDetailStat.CMD_SUCCEED}}
                    &nbsp;&nbsp;&nbsp;&nbsp;失败：{{batchConfigDetailStat.CMD_FAILED}}
                </div>
                <div style="margin: 15px 0;">
                    <form class="form-inline" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">任务状态:</label>
                            <select class="form-control input-sm" v-model="searchDeviceConfig.status">
                                <option value="">--请选择--</option>
                                <option v-for="cmdStatus in cmdStatusList" :value="cmdStatus.value">{{cmdStatus.name}}</option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" @click="searchDeviceConfigsHistory();">搜索</button>
                    </form>
                </div>
                <div class="data-table table-responsive">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>设备号</th>
                            <th>IMEI</th>
                            <th>设备供应商</th>
                            <th>设备类型</th>
                            <th>经销商</th>
                            <th>配置状态</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="searchDeviceConfig in searchDeviceConfigList">
                            <td>{{searchDeviceConfig.deviceSN}}</td>
                            <td>{{searchDeviceConfig.imei}}</td>
                            <td>{{searchDeviceConfig.deviceProvider}}</td>
                            <td>{{searchDeviceConfig.deviceModelName}}</td>
                            <td>{{searchDeviceConfig.dealerName === 'null' ? '' : searchDeviceConfig.dealerName}}</td>
                            <td>{{searchDeviceConfig.status | cmdStateFilter}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination-row clearfix">
                    <div class="pull-right pull-left-sm">
                        <zpagenav :page="searchDeviceConfig.pageIndex" :page-size="searchDeviceConfig.pageSize" :total="searchDeviceConfigTotalCount" :max-link="maxLink" :page-handler="searchDeviceConfigPageHandler"></zpagenav>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="batchConfigDetailModal.isShow=false;">取消</button>
            </div>
        </modal>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
        <modal v-model="addModal.isShow" style="z-index:1049" :backdrop="false" large>
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="addModal.isShow=false;findConfigsModal.isShow=false;confirmConfigModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">新增配置任务</h4>
            </div>
            <div slot="modal-body" class="modal-body">

                <!-- 第一步 -->
                <div v-show="findDeviceModal.isShow">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <div class="form-line-validator">
                                <label class="col-md-2 control-label label-name">任务名<span class="form-validation">*</span>:</label>
                                <div class="col-md-3">
                                    <input type="text" class="form-control input-sm" v-model="sendBatchConfig.groupName" name="groupName" maxlength='20' v-regexEmpty placeholder="字符长度20字以内">
                                </div>
                            </div>
                            <label class="col-md-2 control-label">任务描述:</label>
                            <div class="col-md-3">
                                <input type="text" class="form-control input-sm" v-model="sendBatchConfig.description" maxlength="45" placeholder="字符长度45字以内">
                            </div>
                        </div>
                        <hr>
                        <div class="form-group">
                            <div class="form-line-validator">
                                <label class="col-md-2 control-label label-name">设备供应商:</label>
                                <div class="col-md-3">
                                    <select class="form-control" v-model="sendBatchConfig.condition.manufacturerId" v-on:change="manufacturerChange()">
                                        <option value="" >--请选择--</option>
                                        <option v-for="deviceManufacturer in deviceManufacturerList" v-bind:value="deviceManufacturer.id">{{deviceManufacturer.name}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-line-validator">
                                <label class="col-md-2 control-label label-name">设备类型:</label>
                                <div class="col-md-3">
                                    <select class="form-control" v-model="sendBatchConfig.condition.modelId" v-on:change="manufacturerModelChange()">
                                        <option value="" selected>--请选择--</option>
                                        <option v-for="deviceModel in deviceModelList" v-bind:value="deviceModel.id">{{deviceModel.name}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">关键字:</label>
                            <div class="col-md-3">
                                <select class="form-control input-sm" v-model="sendBatchConfig.condition.type">
                                    <option value="" selected>--请选择--</option>
                                    <option v-for="deviceType in deviceTypeList" :value="deviceType.value">{{deviceType.name}}</option>
                                </select>
                            </div>
                            <label class="col-md-2 control-label">过滤条件:</label>
                            <div class="col-md-3">
                                <input type="text" class="form-control input-sm" v-model="sendBatchConfig.condition.keyword">
                            </div>
                            <div class="col-md-2">
                                <button type="button" class="btn btn-sm btn-success" @click="findDevice">搜索</button>
                            </div>
                        </div>
                    </form>
                    <div class="help is-danger">{{deviceIdsError}}</div>
                    <div class="data-table table-responsive">
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th><input type="checkbox" v-model="checkAllDevice"></th>
                                <th>设备号</th>
                                <th>IMEI</th>
                                <th>设备供应商</th>
                                <th>设备类型</th>
                                <th>VIN</th>
                                <th>ICCID</th>
                                <th>经销商</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="vehDeviceInfo in vehDeviceInfoList">
                                <td><input type="checkbox" :value="vehDeviceInfo.vin" v-model="sendBatchConfig.deviceIds" :disabled="!vehDeviceInfo.vin"></td>
                                <td>{{vehDeviceInfo.sn}}</td>
                                <td>{{vehDeviceInfo.imei}}</td>
                                <td>{{vehDeviceInfo.manufacturerName}}</td>
                                <td>{{vehDeviceInfo.modelName}}</td>
                                <td>{{vehDeviceInfo.vin}}</td>
                                <td>{{vehDeviceInfo.iccid}}</td>
                                <td>{{vehDeviceInfo.dealerName}}</td>
                            </tr>
                            </tbody>
                        </table>
                        <!--<div>selected: {{vehDeviceVins}}</div>-->
                    </div>
                    <div class="pagination-row clearfix">
                        <div class="pull-right pull-left-sm">
                            <zpagenav :page="sendBatchConfig.condition.pageIndex" :page-size="sendBatchConfig.condition.pageSize" :total="deviceInfoTotalCount" :max-link="maxLink" :page-handler="deviceInfoPageHandler"></zpagenav>
                        </div>
                    </div>
                </div>

                <!-- 第二步 -->
                <div v-show="findConfigsModal.isShow">
                    <div class="data-table table-responsive">
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>参数项</th>
                                <th>参数说明</th>
                                <th>参数值</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="config in configList">
                                <td style="white-space:normal">{{config.name}}</td>
                                <td style="white-space:normal">{{config.description}}</td>
                                <td>
                                    <!--
                                    <input type="text" class="form-control" :id="'code'+config.code" :regStr="config.regexStr" v-model="config.value" v-reg  
                                    exVerify :regNum="1" >
                                -->
                                <input type="text" class="form-control" v-model="config.value" data-valid-message="请注意参数说明！" :data-regex-str="config.regexStr" v-verify:reform>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 第三步 -->
                <div v-show="confirmConfigModal.isShow">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-3 control-label">任务名<span class="form-validation">*</span>:</label>
                            <div class="col-md-3 control-div">
                                {{sendBatchConfig.groupName}}
                            </div>
                            <label class="col-md-3 control-label">任务描述:</label>
                            <div class="col-md-3 control-div">
                                {{sendBatchConfig.description}}
                            </div>
                        </div>
                    </form>
                    <div class="data-table table-responsive">
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>参数项</th>
                                <th>参数说明</th>
                                <th>参数值</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="config in configList">
                                <td style="white-space:normal">{{config.name}}</td>
                                <td style="white-space:normal">{{config.description}}</td>
                                <td style="white-space:normal">{{config.value}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">

                <!-- 第一步 -->
                <div v-show="findDeviceModal.isShow">
                    <button type="button" class="btn btn-default" @click="addModal.isShow=false;findDeviceModal.isShow=false">取消</button>
                    <button type="button" class="btn btn-default" :disabled="errors.any('deviceVali')" @click="findDeviceNext('deviceVali')">下一步</button>
                </div>

                <!-- 第二步 -->
                <div v-show="findConfigsModal.isShow">
                    <button type="button" class="btn btn-default" @click="addModal.isShow=false;findConfigsModal.isShow=false">取消</button>
                    <button type="button" class="btn btn-default" @click="findConfigsBack()">上一步</button>
                    <button type="button" class="btn btn-default" @click="findConfigsNext()" :disabled="reform.isValid">下一步</button>
                </div>

                <!-- 第三步 -->
                <div v-show="confirmConfigModal.isShow">
                    <button type="button" class="btn btn-default" @click="addModal.isShow=false;confirmConfigModal.isShow=false">取消</button>
                    <button type="button" class="btn btn-default" @click="confirmConfigBack()">上一步</button>
                    <button type="button" class="btn btn-default" @click="sendBatchConfigs()">确定</button>
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
    import {modal,alert} from 'vue-strap';
    import Vue from 'vue';
    let _this = null;

    export default {
        data () {
            return {
                reform: { isValid: false },
                depCopy: {},
                maxLink: 5,
                totalCount: 0,
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
                },
                addModal: {
                    isShow: false
                },
                cmdStatusList: [
                    {
                        name: "执行中",
                        value:"CMD_PROCESSING"
                    },
                    {
                        name: "成功",
                        value:"CMD_SUCCEED"
                    },
                    {
                        name: "失败",
                        value:"CMD_FAILED"
                    }
                ],
                findBatchConfig: {
                    groupName: "",
                    status: "",
                    pageIndex:1,
                    pageSize:10
                },
                batchConfigDetailModal: {
                    isShow: false
                },
                batchConfigList: [],
                batchConfigDetail: {
                    condition: {}
                },
                batchConfigDetailStat: {},
                searchDeviceConfig: {
                    groupId: "",
                    status: "",
                    pageIndex:1,
                    pageSize:10
                },
                searchDeviceConfigTotalCount: 0,
                searchDeviceConfigList: [],
                findDeviceModal: {
                    isShow: false
                },
                sendBatchConfig: {
                    groupName: "",
                    description: "",
                    condition: {
                        manufacturerName: "",
                        manufacturerId: "",
                        modelId: "",
                        modelName: "",
                        type: "",
                        keyword: "",
                        pageIndex:1,
                        pageSize:10,
                        installStatus: true,
                        batchs: []
                    },
                    configs: [],
                    deviceIds: []
                },
                deviceManufacturerList: [],
                deviceModelList: [],
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
                vehDeviceInfoList: [],
                deviceInfoTotalCount: 0,
                checkAllDevice: "",
                findConfigsModal: {
                    isShow: false
                },
                configList: [],
                confirmConfigModal: {
                    isShow: false
                },
                deviceIdsError: "",
                checked: []// 存放checked对象
            }
        },
        components: {
            modal,
            alert
        },
        directives: {
            regexVerify: {
                inserted: function(el) {
                    el.addEventListener('blur', function() {
                        let regStr = el.getAttribute('regStr');
                        // let reg = /^\d{1,4}$|^[1-5]\d{4}$|^60000$/;
                        let regNum = el.getAttribute('regNum');
                        let reg = new RegExp(regStr);
                        if (el.value && !reg.test(el.value)) {
                            el.style.borderColor = 'red';
                            _this.alert = {
                                isShow: true,
                                content: '请注意参数说明！',
                                type: "danger"
                            }
                        } else {
                            el.style.borderColor = '';
                        }
                    });
                }
            },
            regexEmpty: {
                inserted: function(el) {
                    el.addEventListener('blur', function() {
                        if (!/./.test(el.value)) {
                            el.style.borderColor = 'red';
                            _this.alert = {
                                isShow: true,
                                content: '任务名不能为空！',
                                type: "danger"
                            }
                            el.focus();
                        } else {
                            el.style.borderColor = '';
                        }
                    });
                }
            }
        },
        methods: {
            findBatchConfigEvent(pageIndex){
                let _this = this;
                if (pageIndex) {
                    _this.findBatchConfig.pageIndex = 1
                }
                _this.$http.get('api/searchSendBatchConfigsHistory', { params: _this.findBatchConfig }).then(function(data){
                    if(data.body.status){
                        _this.batchConfigList = data.body.datas;
                        _this.findBatchConfig.pageIndex = data.body.pageIndex;
                        _this.totalCount = data.body.totalCount;
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
            pageHandler:function (pageIndex){
                if (pageIndex === 0) {
                    return
                }
                let _this = this;
                if (pageIndex === 0) {
                    return
                }
                _this.findBatchConfig.pageIndex = pageIndex;
                _this.findBatchConfigEvent();
            },
            findSendBatchConfigs(groupId) {
                let _this = this;
                _this.searchDeviceConfig.groupId = groupId;
                _this.batchConfigDetailModal.isShow = true;
                _this.$http.get('api/findSendBatchConfigs', { params:  {groupId: groupId}}).then(function(data){
                    if(data.body.status){
                        _this.searchDeviceConfig.status = ''
                        _this.batchConfigDetail = data.body.datas;
                        _this.batchConfigDetailStat = _this.batchConfigDetail.stat;
                        _this.searchDeviceConfigsHistory();
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
            searchDeviceConfigsHistory(){
                let _this = this;
                _this.$http.get('api/searchDeviceConfigsHistory', { params: _this.searchDeviceConfig}).then(function(data){
                    if(data.body.status){
                        _this.searchDeviceConfigList = data.body.datas;
                        _this.searchDeviceConfig.pageIndex = data.body.pageIndex;
                        _this.searchDeviceConfigTotalCount = data.body.totalCount;
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
            searchDeviceConfigPageHandler:function (pageIndex){
                if (pageIndex === 0) {
                    return
                }
                let _this = this;
                if (pageIndex === 0) {
                    return
                }
                _this.searchDeviceConfig.pageIndex = pageIndex;µ
                _this.searchDeviceConfigsHistory();
            },
            addConfigs(){
                let _this = this;
                // Object.assign(_this.sendBatchConfig, _this.depCopy);
                // Object.assign(this.$data.sendBatchConfig, this.$options.data().sendBatchConfig)
                $.extend(this.$data.sendBatchConfig, this.$options.data().sendBatchConfig);
                _this.addModal.isShow = true
                _this.findDeviceModal.isShow = true;
                _this.findDevice();
                _this.$http.get('api/getDeviceManufacturer', { params: {type: "name", pageSize: 999}}).then(function(data){
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
                let manufacturerId = _this.sendBatchConfig.condition.manufacturerId;
                if(manufacturerId){
                    for(let manufacturer of _this.deviceManufacturerList){
                        if(manufacturer.id == manufacturerId){
                            _this.sendBatchConfig.condition.manufacturerName = manufacturer.name;
                            break;
                        }
                    }
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
            manufacturerModelChange(){
                let _this = this;
                let modelId = _this.sendBatchConfig.condition.modelId;
                if(modelId){
                    for(let model of _this.deviceModelList){
                        if(model.id == modelId){
                            _this.sendBatchConfig.condition.modelName = model.name;
                            break;
                        }
                    }
                }
            },
            findDeviceNext(scope) {
                let _this = this;
                if (!this.sendBatchConfig.groupName) {
                    // this.deviceIdsError = "任务名为必填项！";
                    _this.alert = {
                        isShow: true,
                        content: "任务名为必填项！",
                        type: "danger"
                    }
                } else if(_this.sendBatchConfig.deviceIds.length==0){
                    // this.deviceIdsError = "请至少勾选一个设备！";
                    _this.alert = {
                        isShow: true,
                        content: "请至少勾选一个设备！",
                        type: "danger"
                    }
                }else if(scope){
                    this.deviceIdsError = "";
                    _this.$validator.validateAll(scope).then(() => {
                        _this.findDeviceModal.isShow = false;
                        setTimeout(function(){
                            _this.findConfigsModal.isShow = true;
                        },350);
                        _this.$http.get('api/findConfigs', { params: {}}).then(function(data){
                            if(data.body.status){
                                _this.configList = data.body.datas;
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
                    });
                }
            },
            findDevice(e){
                let _this =this;

                if (e) {
                    if (e.target.nodeName === 'BUTTON') {
                        _this.sendBatchConfig.condition.pageIndex = 1;
                    }
                }

                _this.$http.get('api/getVehDeviceInfoList', { params: _this.sendBatchConfig.condition}).then(function(data) {
                    if(data.body.status){
                        _this.vehDeviceInfoList = data.body.datas;
                        _this.sendBatchConfig.condition.pageIndex = data.body.pageIndex;
                        _this.deviceInfoTotalCount = data.body.totalCount;
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
            deviceInfoPageHandler:function (pageIndex) {
                let _this = this;
                if (pageIndex === 0) {
                    return
                }
                _this.sendBatchConfig.condition.pageIndex = pageIndex;
                _this.findDevice();
                _this.checkAllDevice = false;
            },
            findConfigsNext(){
                let _this = this;
                _this.findConfigsModal.isShow = false;
                setTimeout(function(){
                    _this.confirmConfigModal.isShow = true;
                },350);
            },
            findConfigsBack(){
                let _this = this;
                _this.findConfigsModal.isShow = false;
                setTimeout(function(){
                    _this.findDeviceModal.isShow = true;
                },350);
            },
            confirmConfigBack(){
                let _this = this;
                _this.confirmConfigModal.isShow = false;
                setTimeout(function(){
                    _this.findConfigsModal.isShow = true;
                },350);
            },
            sendBatchConfigs(){
                let _this = this;

                let _configList = JSON.parse(JSON.stringify(_this.configList))

                console.log('configList:=>>', _this.configList)
                _configList.map((item, index) => {
                    delete item.description;
                })

                console.log('configList:=>>>>>>>', _this.configList)
                console.log('_configList:=>>>>>>>>', _configList)

                // for(let config in _this.configList) {

                //     delete config.description;
                // }
                _this.sendBatchConfig.configs = _configList;

                _this.sendBatchConfig.condition = JSON.stringify(_this.sendBatchConfig.condition);
                /*
                    使用deviceId找到勾选的对象
                */

                // _this.sendBatchConfig.deviceIds

                let ids = _this.sendBatchConfig.deviceIds

                // vehDeviceInfoList

                let batchs = []
                this.vehDeviceInfoList.map((item, index) => {
                    for (let i = 0; i < ids.length; i++) {
                        if (item.vin === ids[i]) {
                            batchs.push(item)
                        }
                    }
                })

                _this.sendBatchConfig.batchs = batchs

                _this.$http.post('api/sendBatchConfigs', _this.sendBatchConfig).then(function(data) {
                    if(data.body.status){
                        _this.findConfigsModal.isShow = false
                        _this.confirmConfigModal.isShow = false;
                        _this.addModal.isShow = false
                        _this.alert = {
                            isShow: true,
                            content: "新增配置任务成功！",
                            type: "success"
                        }
                        this.findBatchConfigEvent();
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
            depCopyFunc(obj) {
                let copySendBatchConfig = JSON.parse(JSON.stringify(obj));
                return copySendBatchConfig;
            }
        },
        created(){
            this.findBatchConfigEvent();
            this.depCopy = this.depCopyFunc(this.sendBatchConfig);
        },
        mounted() {
            _this = this;
        },
        watch: {
            checkAllDevice: function(newCheckAllDevice){
                this.deviceIdsError = "";
                if(newCheckAllDevice){
                    this.sendBatchConfig.deviceIds = [];
                    for(let vehDevice of this.vehDeviceInfoList){
                        if(vehDevice.vin){
                            this.sendBatchConfig.deviceIds.push(vehDevice.vin);
                        }
                    }
                }else{
                    for(let vehDevice of this.vehDeviceInfoList){
                        this.sendBatchConfig.deviceIds.pop();
                    }
                }
            },
            "sendBatchConfig.deviceIds": function(a){
                this.deviceIdsError = "";
            }
        }
    }
</script>