<template>
    <div>
        <ul class="breadcrumb">
            <li>TBOX管理</li>
            <li>TBOX更换</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">车辆VIN码：</label>
                            <input type="text" class="form-control input-sm" v-model="boxReplaceListSearch.vin"
                                   placeholder="请输入车辆VIN码"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">车主姓名：</label>
                            <input type="text" class="form-control input-sm" v-model="boxReplaceListSearch.ownerName"
                                   placeholder="请输入车主姓名"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">手机号：</label>
                            <input type="text" class="form-control input-sm" v-model="boxReplaceListSearch.mobilePhone"
                                   placeholder="请输入手机号"/>
                        </div>
                    </form>
                    <form class="form-inline m-top-xs" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">经销商名称：</label>
                            <input type="text" class="form-control input-sm" v-model="boxReplaceListSearch.dealerName"
                                   placeholder="请输入经销商名称" :readonly="dealerFlag"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">选择时间：</label>
                            <date-picker class="right" v-model="boxReplaceListSearch.dateTime" type="datetimerange"
                                         :options="datePickerOption" placeholder="请选择开始时间 —— 结束时间"
                                         style="width: 280px"></date-picker>
                        </div>
                        <button type="button" class="btn btn-sm btn-success"
                                v-on:click="searchBoxReplaceList('search')">查询
                        </button>
                        <button type="button" class="btn btn-sm btn-success right" v-on:click="showReplaceStep()"
                                v-if="message['/tbox/replaceBoxHistory/replaceTBox']">更换Tbox
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>更换时间</th>
                    <th>更换经销商</th>
                    <th>车主姓名</th>
                    <th>车辆VIN码</th>
                    <th>手机号</th>
                    <th>身份证号</th>
                    <th>新Tbox设备号</th>
                    <th>旧Tbox设备号</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="boxReplaceData in boxReplaceListData">
                    <td>{{boxReplaceData.changeDate | activeDateFilter}}</td>
                    <td>{{boxReplaceData.dealerName}}</td>
                    <td>{{boxReplaceData.ownerName}}</td>
                    <td>{{boxReplaceData.vin}}</td>
                    <td>{{boxReplaceData.mobilePhone}}</td>
                    <td>{{boxReplaceData.idNumber}}</td>
                    <td>{{boxReplaceData.newDeviceSn}}</td>
                    <td>{{boxReplaceData.oldDeviceSn}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="boxReplaceListSearchParam.pageIndex"
                          :page-size="boxReplaceListSearchParam.pageSize"
                          :total="boxReplaceListTotalCount" :max-link="5"
                          :page-handler="searchBoxReplaceList"></zpagenav>
            </div>
        </div>
        <modal v-model="modalShow" :backdrop="false">
            <template v-if="stepShow[0]">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="resetModal()">
                    <span>×</span></button>
                <h4 class="modal-title">更换Tbox</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                      data-vv-scope="replaceBoxForm1">
                    <div class="form-group">
                        <label for="oservice-vin" class="col-md-3 col-sm-3 control-label form-required">车辆VIN码:</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input type="text" class="form-control" maxlength="17" placeholder="请输入车辆VIN码"
                                   id="oservice-vin" data-vv-as="车辆VIN码" name="vin"
                                   v-model="TboxSearch.vin" v-validate:vin="'required|min:17|alpha_num'"
                                   :class="{'input': true, 'is-danger': errors.has('replaceBoxForm1.vin') }"/>
                            <i v-show="errors.has('replaceBoxForm1.vin')" class="fa fa-warning"></i>
                            <span v-show="errors.has('replaceBoxForm1.vin')"
                                  class="help is-danger">{{ errors.first('replaceBoxForm1.vin') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3 form-validation">
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="resetModal()">取消
                </button>
                <button type="button" class="btn btn-success" @click="fromStep1ToStep2('replaceBoxForm1')">下一步
                </button>
            </div>
            </template>
            <template v-if="stepShow[1]">
                <div slot="modal-header" class="modal-header">
                    <button type="button" class="close" v-on:click="resetModal()"><span>×</span></button>
                    <h4 class="modal-title">更换Tbox</h4>
                </div>
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" novalidate data-vv-scope="replaceBoxForm2">
                        <div class="form-group">
                            <label class="col-md-3 control-label">车型:</label>
                            <div class="col-md-6">
                                <p class="form-control-static">{{TboxData.modelName}}</p>
                            </div>
                            <div class="col-md-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label">车主性别:</label>
                            <div class="col-md-6">
                                <p class="form-control-static">{{TboxData.gender | genderFilter}}</p>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label">手机号:</label>
                            <div class="col-md-6">
                                <p class="form-control-static">{{TboxData.mobilePhone}}</p>
                            </div>
                            <div class="col-md-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="rbox-icode" class="col-md-3 col-sm-3 control-label form-required">验证码:</label>
                            <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="6" placeholder="请输入6位验证码"
                                       id="rbox-icode" data-vv-as="验证码" name="icode"
                                       v-model="icodeVali.icode" v-validate:icode="'required|min:6|numeric'"
                                       :class="{'input': true, 'is-danger': errors.has('replaceBoxForm2.icode') }"/>
                                <i v-show="errors.has('replaceBoxForm2.icode')" class="fa fa-warning"></i>
                                <span v-show="errors.has('replaceBoxForm2.icode')"
                                      class="help is-danger">{{ errors.first('replaceBoxForm2.icode') }}</span>
                            </div>
                            <div class="col-md-5 col-sm-5">
                                <button class="btn btn-success btn-sm" @click="getIcode('replaceBoxForm2')"
                                        :disabled="icodeBtn.timer || !TboxData.mobilePhone">
                                    {{icodeBtn.second + icodeBtn.text}}
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label">原Tbox设备号:</label>
                            <div class="col-md-6">
                                <p class="form-control-static">{{TboxData.deviceSN}}</p>
                            </div>
                            <div class="col-md-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="rbox-newBox" class="col-md-3 col-sm-3 control-label form-required">新Tbox设备号:</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="45" placeholder="请输入新Tbox设备号"
                                       id="rbox-newBox" data-vv-as="新Tbox设备号" name="Tbox"
                                       v-model="TboxSearch.newDeviceSN" v-validate:Tbox="'required|min:2'"
                                       :class="{'input': true, 'is-danger': errors.has('replaceBoxForm2.Tbox') }"/>
                                <i v-show="errors.has('replaceBoxForm2.Tbox')" class="fa fa-warning"></i>
                                <span v-show="errors.has('replaceBoxForm2.Tbox')"
                                      class="help is-danger">{{ errors.first('replaceBoxForm2.Tbox') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetModal()">取消</button>
                    <button type="button" class="btn btn-success" @click="fromStep2ToStep3('replaceBoxForm2')">下一步
                    </button>
                </div>
            </template>
            <template v-if="stepShow[2]">
                <div slot="modal-header" class="modal-header">
                    <button type="button" class="close" v-on:click="resetModal"><span>×</span></button>
                    <h4 class="modal-title">确认更换</h4>
                </div>
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" novalidate>
                        <div class="form-group">
                            <label class="col-md-4 control-label">IMEI:</label>
                            <div class="col-md-8">
                                <p class="form-control-static">{{newTboxData.imei}}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label">SIM卡电话号码:</label>
                            <div class="col-md-8">
                                <p class="form-control-static">{{newTboxData.number}}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label">ICCID:</label>
                            <div class="col-md-8">
                                <p class="form-control-static">{{newTboxData.iccid}}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-offset-4">（确认更换？更换后不可恢复）
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetModal()">取消</button>
                    <button type="button" class="btn btn-success" @click="replaceTbox()">更换TBOX</button>
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
    import datePicker from 'iview/src/components/date-picker'
    export default{
        data(){
            return {
                datePickerOption: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                boxReplaceListSearch: {
                    ownerName: "",
                    mobilePhone: "",
                    vin: "",
                    dealerName: "",
                    dateTime:[null,null],
                    pageIndex: 1,
                    pageSize: 10
                },
                boxReplaceListSearchParam: {},
                boxReplaceListData: {},
                boxReplaceListTotalCount: null,
                modalShow:false,
                stepShow: [false, false, false],
                TboxSearch: {
                    vin: "",
                    newDeviceSN: ""
                },
                TboxData: {},
                icodeVali: {
                    icode: ""
                },
                //手机验证
                icodeBtn: {
                    text: "获取验证码",
                    second: "",
                    timer: null
                },
                newTboxData: {},
                windowAlert: {
                    isShow: false,
                    type: "",
                    content: ""
                },
                userDealerId: "",
                dealerFlag:false
            }
        },
        computed: {
        },
        components: {
            datePicker, modal, alert
        },
        methods: {
            searchBoxReplaceList(method){
                let _this = this;
                if (method === 'search') {
                    for (let key in _this.boxReplaceListSearch) {
                        if(key !== 'dateTime'){
                            _this.boxReplaceListSearchParam[key] = _this.boxReplaceListSearch[key];
                        }
                    }
                    _this.boxReplaceListSearchParam.startTime = _this.boxReplaceListSearch.dateTime[0] ? _this.boxReplaceListSearch.dateTime[0].getTime() : 0;
                    _this.boxReplaceListSearchParam.endTime = _this.boxReplaceListSearch.dateTime[1] ? _this.boxReplaceListSearch.dateTime[1].getTime() : new Date().getTime();
                }
                if (typeof method === "number") {
                    _this.boxReplaceListSearchParam.pageIndex = method;
                }
                _this.$http.get('api/getDeviceChangeInfoList', {params: _this.boxReplaceListSearchParam}).then(function (res) {
                    if (res.body.status === "SUCCEED") {
                        _this.boxReplaceListData = res.body.datas;
                        _this.boxReplaceListTotalCount = res.body.totalCount;
                    }
                });
            },
            showReplaceStep(){
                this.modalShow = true;
                this.stepShow = [true, false, false];
            },
            fromStep1ToStep2(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    let param = {
                        vin: _this.TboxSearch.vin,
                    };
                    return _this.$http.get('api/quertTBoxVehicle', {params: param})
                }).then(function (res) {
                    if (res.body.status === 'SUCCEED') {
                        let result = res.body.data;
                        _this.TboxData.deviceSN = result.deviceSN;
                        _this.TboxData.modelName = result.modelName;
                        _this.TboxData.gender = result.saleInfoList.length ? result.saleInfoList[0].vehicleOwner.gender: 'M';
                        _this.TboxData.mobilePhone = result.mobilePhone;
                        _this.stepShow = [false, true, false];
                    } else {
                        _this.showAlert({
                            type: "danger",
                            content: res.body.errorMessage
                        })
                    }
                })
            },
            getIcode(){
                let _this = this;
                let param = {
                    eventId: _this.TboxData.mobilePhone,
                    eventType: "UPDATE_TBOX",
                    verifyType: "SMS"
                };
                _this.$http.get('api/verif-code', {params: param}).then(function (res) {
                    if (res.body.status === 'SUCCEED') {
                        _this.showAlert({
                            type: "success",
                            content: "获取验证码成功，30分钟内输入有效"
                        });
                        _this.watchIcodeBtn();
                    } else {
                        _this.showAlert({
                            type: "danger",
                            content: res.body.errorMessage
                        })
                    }
                })
            },
            fromStep2ToStep3(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    if (_this.TboxData.deviceSN !== _this.TboxSearch.newDeviceSN) {
                        let param = {
                            type: "sn",
                            keyword: _this.TboxSearch.newDeviceSN
                        };
                        _this.$http.get('api/getVehDeviceByType', {params: param}).then(function (res) {
                            if (res.body.status === 'SUCCEED') {
                                let result = res.body.data;
                                if(result){
                                    let param = {
                                        eventId: _this.TboxData.mobilePhone,
                                        code: _this.icodeVali.icode,
                                        eventType: "UPDATE_TBOX"
                                    };
                                    _this.$http.get('api/checkCode', {params: param}).then(function (res) {
                                        if (res.body.status === 'SUCCEED') {
                                            _this.newTboxData.imei = result.imei;
                                            _this.newTboxData.iccid = result.iccid;
                                            _this.newTboxData.number = result.simNumber;
                                            _this.stepShow = [false, false, true];
                                        } else {
                                            _this.showAlert({
                                                type: "danger",
                                                content: res.body.errorMessage
                                            })
                                        }
                                    })
                                }else{
                                    _this.showAlert({
                                        type: "danger",
                                        content: "无该设备，请重新输入"
                                    })
                                }
                            } else {
                                _this.showAlert({
                                    type: "danger",
                                    content: res.body.errorMessage
                                })
                            }
                        })
                    } else {
                        _this.showAlert({
                            type: "danger",
                            content: "新旧设备号一致，请重新输入"
                        })
                    }
                })
            },
            replaceTbox(){
                let _this = this,
                    param = {
                        oldDeviceSN: _this.TboxData.deviceSN,
                        newDeviceSN: _this.TboxSearch.newDeviceSN,
                        vin: _this.TboxSearch.vin,
                        dealerId: _this.userDealerId
                    };
                _this.$http.post('api/updateTbox', param).then(function (res) {
                    if (res.body.status === "SUCCEED") {
                        _this.showAlert({
                            type: "success",
                            content: "更换成功！"
                        });
                        _this.resetModal();
                        _this.searchBoxReplaceList('search');
                    } else {
                        _this.showAlert({
                            type: "danger",
                            content: res.body.errorMessage
                        })
                    }
                });
            },
            watchIcodeBtn(){
                let _this = this;
                _this.icodeBtn.text = '秒后重新获取';
                _this.icodeBtn.second = 60;
                _this.icodeBtn.timer = setInterval(function () {
                    _this.icodeBtn.second--;
                    if (_this.icodeBtn.second === 0) {
                        clearInterval(_this.icodeBtn.timer);
                        _this.icodeBtn = {
                            text: "获取验证码",
                            second: "",
                            timer: null
                        }
                    }
                }, 1000)
            },
            resetModal(){
                let _this = this;
                _this.modalShow = false;
                _this.TboxSearch.vin = "";
                _this.TboxSearch.newDeviceSN = "";
                _this.icodeVali.icode = "";
                _this.TboxData = {};
                _this.newTboxData = {};
                _this.$validator.getErrors().clear('replaceBoxForm1');
                _this.$validator.getErrors().clear('replaceBoxForm2');
            },
            showAlert(options){
                let _this = this;
                _this.windowAlert.isShow = true;
                _this.windowAlert.type = options.type;
                _this.windowAlert.content = options.content;
            }
        },
        watch: {
        },
        created() {
            this.$http.get('api/findAdminDetailByToken').then(response => {

                //npm start开发时
                const debug = process.env.NODE_ENV !== 'production';
                if (debug) {
                    response.body.status = 1;
                    response.body.admin = {org: {code: 1}};
                }
                //npm start开发时

                if (response.body.status === 1) {
                    let admin = response.body.admin;
                    //有组织机构
                    if (admin.org) {
                        this.userDealerId = admin.org.code;
                        if(this.userDealerId){
                            this.dealerFlag = true;
                            //经销商系统
                            this.$http.get('api/getVehDealerById', {params: {vehDealerId: this.userDealerId}}).then(res => {
                                if (res.body.status === 'SUCCEED') {
                                    this.boxReplaceListSearch.dealerName = res.body.data.name;
                                    this.searchBoxReplaceList('search');
                                }
                            });
                        }else{
                            //运营系统
                            this.searchBoxReplaceList('search');
                        }
                    } else {
                        //运营系统
                        this.searchBoxReplaceList('search');
                    }
                } else {
                    this.showAlert({
                        type: "danger",
                        content: response.body.errorMessage
                    });
                }
            })
        },
        mounted(){
        },
        props:['message']
    }

</script>
