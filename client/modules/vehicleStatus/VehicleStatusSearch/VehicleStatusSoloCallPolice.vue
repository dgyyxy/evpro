<template>
    <div>
        <!--报警处理-->
        <modal large v-model="alertHandleModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="alertHandleModalShow=false;errors.clear('alertHandle')"><span>×</span></button>
                <h4 class="modal-title">报警处理</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal" role="form" novalidate data-vv-scope="alertHandle">
                    <div class="form-group" v-if="alertHandleModalTotalNum > 1">
                        <label class="col-md-3 control-label">批量处理数量</label>
                        <div class="col-md-6">
                            <p class="form-control-static">{{alertHandleModalTotalNum}}</p>
                        </div>
                        <div class="col-md-3">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label form-required" for="alertHandlePeople">处理人：</label>
                        <div class="col-md-6 has-icon has-icon-right">
                            <input type="text" id="alertHandlePeople" class="form-control" name="name" data-vv-as="姓名"
                                   v-model="alertHandle.handlePeople" placeholder="请输入姓名"
                                   :class="{'input': true, 'is-danger': errors.has('alertHandle.name') }"
                                   v-validate:name="'required|min:2|max:14'"/>
                            <i v-show="errors.has('alertHandle.name')" class="fa fa-warning"></i>
                            <span v-show="errors.has('alertHandle.name')"
                                  class="help is-danger">{{ errors.first('alertHandle.name') }}</span>
                        </div>
                        <div class="col-md-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label form-required" for="alertHandleTel">联系电话：</label>
                        <div class="col-md-6 has-icon has-icon-right">
                            <input type="text" id="alertHandleTel" class="form-control" name="mobile" data-vv-as="手机号"
                                   v-model="alertHandle.phoneNum" placeholder="请输入联系电话"
                                   :class="{'input': true, 'is-danger': errors.has('alertHandle.mobile') }"
                                   v-validate:mobile="'required|mobile'"
                            />
                            <i v-show="errors.has('alertHandle.mobile')" class="fa fa-warning"></i>
                            <span v-show="errors.has('alertHandle.mobile')"
                                  class="help is-danger">{{ errors.first('alertHandle.mobile') }}</span>
                        </div>
                        <div class="col-md-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label" for="alertHandleRemark">处理备注 </label>
                        <div class="col-md-6 has-icon has-icon-right">
                            <textarea type="text" id="alertHandleRemark" class="form-control" name="remark"
                                      data-vv-as="备注"
                                      v-model="alertHandle.remark"
                                      placeholder="请输入处理过程中的备注（500字以内）"
                                      rows="6" cols="20" style="resize:none"
                                      :class="{'input': true, 'is-danger': errors.has('alertHandle.remark') }"
                                      v-validate:mobile="'max:500'"
                            ></textarea>
                            <i v-show="errors.has('alertHandle.remark')" class="fa fa-warning"></i>
                            <span v-show="errors.has('alertHandle.remark')"
                                  class="help is-danger">{{ errors.first('alertHandle.remark') }}</span>
                        </div>
                        <div class="col-md-3 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label form-required">是否继续处理：</label>
                        <div class="col-md-6 status-radios">
                            <radio v-model="alertHandle.handleState" button selected-value="1"
                            >是（继续处理）
                            </radio>
                            <radio v-model="alertHandle.handleState" button selected-value="2"
                            >否（处理完毕）
                            </radio>
                            <input type="hidden" v-model="alertHandle.handleState" name="handleState"/>
                        </div>
                        <div class="col-md-3 form-validation">
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="alertHandleModalShow=false;errors.clear('alertHandle')">取消</button>
                <button type="button" class="btn btn-success"
                        @click="alertHandleConfirm('alertHandle')">确定
                </button>
            </div>
        </modal>
        <!--报警详情-->
        <modal large v-model="alertDetailModalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="alertDetailModalShow=false"><span>×</span></button>
                <h4 class="modal-title">报警详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="status-alert-detail-top">
                    <div class="row">
                        <div class="col-md-6">报警类型：{{alertDetailModalData.alertType}}</div>
                        <div class="col-md-6">报警级别：{{alertDetailModalData.alertLevel}}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">报警时间：{{alertDetailModalData.alertTime | DateFilter}}</div>
                    </div>
                </div>
                <div class="status-alert-detail-bottom">
                    <div class="status-alert-detail-title">处理日志</div>
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>处理时间</th>
                            <th>处理人</th>
                            <th>联系电话</th>
                            <th>是否继续处理</th>
                            <th>处理备注</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="alertHandleLog in alertDetailModalData.log">
                            <td>{{alertHandleLog.handleTime | DateFilter}}</td>
                            <td>{{alertHandleLog.handlePeople}}</td>
                            <td>{{alertHandleLog.phoneNum}}</td>
                            <td>{{alertHandleLog.handleState === 1 ? '是（继续处理）' : '否（处理完毕）'}}</td>
                            <td>{{alertHandleLog.remark}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="alertDetailModalShow=false">确定</button>
            </div>
        </modal>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline no-margin">
                        <div class="form-group">
                            <select class="form-control input-sm" v-model="vehicleAlert.alertLevelCode">
                                <option value="">报警级别</option>
                                <option v-for="level in alertLevels" v-bind:value="level.code">
                                    {{level.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group m-left-xs">
                            <input class="form-control input-sm m-left-xs" type="text" v-model="vehicleAlert.alertKeyWord"
                                   placeholder="报警类型关键字">
                        </div>
                        <div class="form-group m-left-xs">
                            <select class="form-control input-sm" v-model="vehicleAlert.handleState">
                                <option value="">处理状态</option>
                                <option v-for="handleStateType in handleStateTypes" v-bind:value="handleStateType.value">{{handleStateType.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group m-left-xs">
                            <date-picker v-model="vehicleAlert.dateTime" type="datetimerange"
                                         :options="datePickerOption" placeholder="请选择开始时间 —— 结束时间"
                                         placement="bottom-end"
                                         style="width: 280px"></date-picker>
                        </div>
                        <button type="button" class="btn btn-sm btn-success m-left-lg"
                                v-on:click="getAlertLevelList('search')">搜索
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div class="state-banner clearfix">
            <div class="text left m-left-sm">
                <span class="m-right-lg">待处理报警总数：{{todoAndDoingVehicleAlertNum.total}}</span><span>待处理3级报警数：{{todoAndDoingVehicleAlertNum.level3}}</span>
            </div>
            <div class="right m-right-lg">
                <button type="button" class="btn btn-sm btn-success m-right-sm" v-on:click="alertHandleShow()"
                        :disabled="alertHandleIds.length<=1">批量处理
                </button>
                <button type="button" class="btn btn-sm btn-success" v-on:click="alertRefresh()">
                    刷新
                </button>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="status-soloalert-table">
                <thead>
                <tr>
                    <th></th>
                    <th>报警类型</th>
                    <th>报警级别</th>
                    <th>报警时间</th>
                    <th>处理状态</th>
                    <th>最近处理时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="callPolice in callPoliceList" @click="checkTableTr(callPolice)"
                    :class="{'alert-checked-tr':callPolice.handleState !== 2,'status-alert-activetr':callPolice.active}">
                    <td>
                        <input type="checkbox" :value="callPolice.alertId" v-model="alertHandleIds" class="alert-checked-tr"
                               v-if="callPolice.handleState !== 2" @click="checkTableTr(callPolice)"/>
                    </td>
                    <td>{{callPolice.name}}</td>
                    <td>{{callPolice.levelName}}</td>
                    <td>{{callPolice.alertTime | DateFilter}}</td>
                    <td>{{callPolice.handleState | handleStateFilter}}</td>
                    <td>{{callPolice.latestHandleTime | DateFilter}}</td>
                    <td>
                        <a href="javascript:void(0)"
                           v-if="callPolice.handleState===0 || callPolice.handleState===1"
                           @click.stop="alertHandleShow(callPolice)"
                        >处理
                        </a>
                        <a href="javascript:void(0)"
                           v-if="callPolice.handleState===1 || callPolice.handleState===2"
                           @click.stop="alertDetailShow(callPolice)"
                        >详情
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="vehicleAlertSearch.pageIndex" :page-size="vehicleAlertSearch.pageSize"
                          :total="alertLevelPage.totalCount" :max-link="alertLevelPage.maxLink"
                          :page-handler="alertLevelPageHandler"></zpagenav>
            </div>
        </div>
    </div>
</template>
<script>
    import {modal, radio} from 'vue-strap';
    import datePicker from 'iview/src/components/date-picker';
    import $ from 'jquery';

    export default{
        data(){
            return {
                datePickerOption: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                alertHandleModalShow: false,
                alertDetailModalShow: false,
                callPoliceList: [],
                todoAndDoingVehicleAlertNum: {},
                vehicleAlert: {
                    handleState:"",
                    alertLevelCode: '',
                    alertKeyWord: '',
                    deviceType: 'VEHICLE',
                    dateTime: [null, null],
                    pageIndex: 1,
                    pageSize: 10,
                    handleStates: "0,1"//仅查询概况用
                },
                vehicleAlertSearch: {},
                alertHandleIds: [],
                alertHandleId: '',
                alertHandleModalTotalNum: null,
                alertHandle: {
                    handlePeople: "",
                    handleState: "1",
                    phoneNum: "",
                    remark: ""
                },
                alertDetailModalData: {
                    alertType: "",
                    alertLevel: "",
                    alertTime: "",
                    log: []
                },
                alertLevelPage: {
                    maxLink: 5,
                    totalCount: 0
                },
                handleStateTypes: [
                    {
                        value: "0",
                        name: "未处理"
                    },
                    {
                        value: "1",
                        name: "处理中"
                    },
                    {
                        value: "2",
                        name: "已处理"
                    }
                ]
            }
        },
        components: {
            modal,
            radio,
            datePicker
        },
        computed: {
            currentDeviceId(){
                return this.$store.state.vehicleStatusSearch.deviceId;
            },
            alertLevels(){
                return this.$store.state.vehicleStatus.alertLevels;
            }
        },
        methods: {
            //----------------------报警------------------------
            //分页查询报警列表
            getAlertLevelList(method, showAlert){
                let _this = this;
                _this.alertHandleIds = [];
                if (method === 'search') {
                    _this.vehicleAlert.pageIndex = 1;
                    for (let key in _this.vehicleAlert) {
                        if(key !== 'dateTime') {
                            _this.vehicleAlertSearch[key] = _this.vehicleAlert[key];
                        }
                    }
                    _this.vehicleAlertSearch.startTime = _this.vehicleAlert.dateTime[0] ? _this.vehicleAlert.dateTime[0].getTime() : 0;
                    _this.vehicleAlertSearch.endTime = _this.vehicleAlert.dateTime[1] ? _this.vehicleAlert.dateTime[1].getTime() : new Date().getTime();
                }
                _this.vehicleAlertSearch.deviceId = _this.currentDeviceId;
                _this.$http.get('api/findAlertAlarmHistoryByTimeRange', {params: _this.vehicleAlertSearch}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.callPoliceList = data.body.datas;
                        _this.vehicleAlertSearch.pageIndex = data.body.pageIndex;
                        _this.vehicleAlertSearch.pageSize = data.body.pageSize;
                        _this.alertLevelPage.totalCount = data.body.totalCount;
                        if (showAlert) {
                            _this.$store.dispatch('setWindowAlert', {
                                type: "success",
                                text: "刷新成功"
                            })
                        }
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取报警列表失败"
                        })
                    }
                });
                //获取待处理报警数量
                _this.$http.get('api/getAlertStat', {params: _this.vehicleAlertSearch}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        //报警总数!!!!
                        _this.todoAndDoingVehicleAlertNum = data.body.data;
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取报警数量失败"
                        })
                    }
                });
            },
            //翻页
            alertLevelPageHandler(pageIndex){
                let _this = this;
                _this.vehicleAlertSearch.pageIndex = pageIndex;
                _this.getAlertLevelList();
            },
            //刷新
            alertRefresh(){
                let _this = this;
                _this.vehicleAlertSearch.pageIndex = 1;
                _this.getAlertLevelList('search', 1);
            },
            //处理报警模态框
            alertHandleShow(oneAlert){
                let _this = this;
                _this.alertHandle.handleState = "1";
                let param = {};
                if (oneAlert) {
                    _this.alertHandleModalTotalNum = 1;
                    param.alertId = oneAlert.alertId;
                    _this.alertHandleId = oneAlert.alertId;
                    _this.$http.get('api/findAlertAlarmLogs', {params: param}).then(function (data) {
                        if (data.body.status === "SUCCEED") {
                            if (data.body.data.length) {
                                _this.alertHandle.handlePeople = data.body.data[0].handlePeople;
                                _this.alertHandle.phoneNum = data.body.data[0].phoneNum;
                                _this.alertHandle.remark = data.body.data[0].remark;
                            } else {
                                _this.alertHandle.handlePeople = "";
                                _this.alertHandle.phoneNum = "";
                                _this.alertHandle.remark = "";
                            }
                            _this.alertHandleModalShow = true;
                        } else {
                            _this.$store.dispatch('setWindowAlert', {
                                type: "danger",
                                text: "获取日志失败，请重试"
                            })
                        }
                    })
                } else {
                    _this.alertHandleModalTotalNum = _this.alertHandleIds.length;
                    _this.alertHandleId = "";
                    _this.alertHandle.handlePeople = "";
                    _this.alertHandle.phoneNum = "";
                    _this.alertHandle.remark = "";
                    _this.alertHandleModalShow = true;
                }


            },
            //处理报警
            alertHandleConfirm(scope){
                let _this = this;
                let param = {};
                param.alertIds = _this.alertHandleId ? _this.alertHandleId : _this.alertHandleIds.join(",");
                _this.$validator.validateAll(scope).then(function () {
                    return _this.$http.post('api/handleAlertAlarm', _this.alertHandle, {params: param})
                }).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.alertHandleModalShow = false;
                        _this.$store.dispatch('setWindowAlert', {
                            type: "success",
                            text: "处理成功"
                        });

                        //解决solr同步延迟问题
                        _this.$store.commit('SET_LOADING_SHOW');
                        setTimeout(()=>{
                            _this.getAlertLevelList('search');
                            _this.$store.commit('SET_LOADING_HIDE');
                        },500);

                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "处理失败，请重试"
                        })
                    }
                });

            },
            //报警详情模态框
            alertDetailShow(oneAlert){
                let _this = this;
                _this.alertDetailModalData.alertType = oneAlert.name;
                _this.alertDetailModalData.alertLevel = oneAlert.levelName;
                _this.alertDetailModalData.alertTime = oneAlert.alertTime;
                _this.$http.get('api/findAlertAlarmLogs', {params: {alertId: oneAlert.alertId}}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.alertDetailModalData.log = data.body.data;
                        _this.alertDetailModalShow = true;
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "详情获取失败，请重试"
                        })
                    }
                });
            },
            checkTableTr(callPolice){
                if(callPolice.status !== 2){
                    let id = callPolice.alertId;
                    let ids = this.alertHandleIds;
                    for (let i = 0; i < ids.length; i++) {
                        if (ids[i] === id) {
                            this.alertHandleIds.splice(i, 1);
                            callPolice.active = false;
                            return
                        }
                    }
                    callPolice.active = true;
                    this.alertHandleIds.push(id);
                }
            }
        },
        created(){
            let _this = this;
            _this.getAlertLevelList('search');              //报警概况和列表
        },
        mounted(){
        }
    }
</script>
