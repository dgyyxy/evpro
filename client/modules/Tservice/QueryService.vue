<template>
    <div>
        <ul class="breadcrumb">
            <li>T服务管理</li>
            <li>T服务开通</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline m-bottom-xs" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">车辆VIN码：</label>
                            <input type="text" class="form-control input-sm" v-model="serviceListSearch.vin"
                                   placeholder="请输入车辆VIN码"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">车主手机号：</label>
                            <input type="text" class="form-control input-sm" v-model="serviceListSearch.userName"
                                   placeholder="请输入车主手机号"/>
                        </div>
                    </form>
                    <form class="form-inline" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">时间筛选：</label>
                            <select class="form-control input-sm" v-model="serviceListSearch.filterField">
                                <option v-for="searchTime in searchTimeType" :value="searchTime.value">{{searchTime.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">选择时间：</label>
                            <date-picker class="right" v-model="serviceListSearch.dateTime" type="datetimerange"
                                         :options="datePickerOption" placeholder="请选择开始时间 —— 结束时间"
                                         style="width: 280px"></date-picker>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="searchServiceList('search')">查询
                        </button>
                        <button type="button" class="btn btn-sm btn-success right" v-on:click="showStep1()" v-if="message['/tservice/queryService/openTservice']">开通T服务
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>单据编号</th>
                    <th>单据建立时间</th>
                    <th>开通渠道</th>
                    <th>车主姓名</th>
                    <th>手机号</th>
                    <th>车主性别</th>
                    <th>身份证号</th>
                    <th>车辆VIN码</th>
                    <th>车型</th>
                    <th>套餐名称</th>
                    <th>状态</th>
                    <th>服务开通时间</th>
                    <th>服务截止时间</th>
                    <th>服务经理电话</th>
                    <th>紧急联系人电话</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="serviceData in serviceDataList">
                    <td>{{serviceData.formId}}</td>
                    <td>{{serviceData.createTime | activeDateFilter}}</td>
                    <td>{{serviceData.opener | openerFilter}}</td>
                    <td>{{serviceData.ownerName}}</td>
                    <td>{{serviceData.userName}}</td>
                    <td>{{serviceData.gender | genderFilter}}</td>
                    <td>{{serviceData.idNumber}}</td>
                    <td>{{serviceData.vin}}</td>
                    <td>{{serviceData.modelName}}</td>
                    <td>{{serviceData.packageName}}</td>
                    <td>{{serviceData.packageStatus | TservicePackageStatusFilter}}</td>
                    <td>{{serviceData.startTime | activeDateFilter}}</td>
                    <td>{{serviceData.endTime | activeDateFilter}}</td>
                    <td>{{serviceData.afterSalePhone}}</td>
                    <td>{{serviceData.emergencyContact}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="serviceListSearchParam.pageIndex" :page-size="serviceListSearchParam.pageSize"
                          :total="serviceListSearchTotalCount" :max-link="5"
                          :page-handler="searchServiceList"></zpagenav>
            </div>
        </div>
        <modal v-model="modalShow" :backdrop="false">
            <template v-if="stepShow[0]">
                <div slot="modal-header" class="modal-header">
                    <button type="button" class="close" v-on:click="resetModal()">
                        <span>×</span></button>
                    <h4 class="modal-title">开通T服务</h4>
                </div>
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" role="form" novalidate
                          data-vv-scope="openTserviceForm1">
                        <div class="form-group">
                            <label for="oservice-vin" class="col-md-3 col-sm-3 control-label form-required">车辆VIN码后六位：</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="6" placeholder="请输入车辆VIN码后六位"
                                       id="oservice-vin" data-vv-as="车辆VIN码后六位" name="vin"
                                       v-model="TserviceSearch.vin" v-validate:vin="'required|min:6|numeric'"
                                       :class="{'input': true, 'is-danger': errors.has('openTserviceForm1.vin') }"/>
                                <i v-show="errors.has('openTserviceForm1.vin')" class="fa fa-warning"></i>
                                <span v-show="errors.has('openTserviceForm1.vin')"
                                      class="help is-danger">{{ errors.first('openTserviceForm1.vin') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="oservice-engine" class="col-md-3 col-sm-3 control-label form-required">发动机号码后六位：</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="6" placeholder="请输入发动机号码后六位"
                                       id="oservice-engine" data-vv-as="发动机号码后六位" name="engine"
                                       v-model="TserviceSearch.engineNumber" v-validate:engine="'required|min:6|alpha_num'"
                                       :class="{'input': true, 'is-danger': errors.has('openTserviceForm1.engine') }"/>
                                <i v-show="errors.has('openTserviceForm1.engine')" class="fa fa-warning"></i>
                                <span v-show="errors.has('openTserviceForm1.engine')"
                                      class="help is-danger">{{ errors.first('openTserviceForm1.engine') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetModal()">取消
                    </button>
                    <button type="button" class="btn btn-success" @click="fromStep1ToStep2('openTserviceForm1')">下一步
                    </button>
                </div>
            </template>
            <template v-if="stepShow[1]">
                <div slot="modal-header" class="modal-header">
                    <button type="button" class="close" v-on:click="resetModal()"><span>×</span></button>
                    <h4 class="modal-title">校验车主手机号</h4>
                </div>
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" novalidate data-vv-scope="openTserviceForm2">
                        <div class="form-group">
                            <label class="col-md-3 control-label">车型:</label>
                            <div class="col-md-6">
                                <p class="form-control-static">{{TserviceData.modelName}}</p>
                            </div>
                            <div class="col-md-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label">经销商名称:</label>
                            <div class="col-md-6">
                                <p class="form-control-static">{{TserviceData.dealerName}}</p>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label">服务经理电话:</label>
                            <div class="col-md-6">
                                <p class="form-control-static">{{TserviceData.dealerPhone}}</p>
                            </div>
                            <div class="col-md-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="oservice-phone" class="col-md-3 col-sm-3 control-label form-required">手机号：</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="11" placeholder="请输入11位手机号"
                                       id="oservice-phone" data-vv-as="手机号" name="phone"
                                       v-model="icodeVali.phone" v-validate:phone="'required|mobile'"
                                       :class="{'input': true, 'is-danger': errors.has('openTserviceForm2.phone') }"/>
                                <i v-show="errors.has('openTserviceForm2.phone')" class="fa fa-warning"></i>
                                <span v-show="errors.has('openTserviceForm2.phone')"
                                      class="help is-danger">{{ errors.first('openTserviceForm2.phone') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="oservice-icode" class="col-md-3 col-sm-3 control-label form-required">验证码：</label>
                            <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="6" placeholder="请输入6位验证码"
                                       id="oservice-icode" data-vv-as="验证码" name="icode"
                                       v-model="icodeVali.icode" v-validate:icode="'required|min:6|numeric'"
                                       :class="{'input': true, 'is-danger': errors.has('openTserviceForm2.icode') }"/>
                                <i v-show="errors.has('openTserviceForm2.icode')" class="fa fa-warning"></i>
                                <span v-show="errors.has('openTserviceForm2.icode')"
                                      class="help is-danger">{{ errors.first('openTserviceForm2.icode') }}</span>
                            </div>
                            <div class="col-md-5 col-sm-5">
                                <button class="btn btn-success btn-sm" @click="getIcode('openTserviceForm2')"
                                        :disabled="icodeBtn.timer">{{icodeBtn.second + icodeBtn.text}}
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-offset-3">
                                <span>（开通成功后，魔盒APP的登录名和密码将发到该手机号）</span>
                            </div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetModal()">取消</button>
                    <button type="button" class="btn btn-success" @click="fromStep2ToStep3('openTserviceForm2')">下一步
                    </button>
                </div>
            </template>
            <template v-if="stepShow[2]">
                <div slot="modal-header" class="modal-header">
                    <button type="button" class="close" v-on:click="resetModal()"><span>×</span></button>
                    <h4 class="modal-title">填写车主信息</h4>
                </div>
                <div slot="modal-body" class="modal-body">
                    <form onsubmit="return false;" class="form-horizontal" novalidate data-vv-scope="openTserviceForm3">
                        <div class="form-group">
                            <label class="col-md-3 control-label">手机号:</label>
                            <div class="col-md-6">
                                <p class="form-control-static">{{icodeVali.phone}}</p>
                            </div>
                            <div class="col-md-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 col-sm-3 control-label form-required">车主性别：</label>
                            <div class="col-md-6 col-sm-6">
                                <radio class="btn-sm" button v-model="ServiceOpenParam.gender" selected-value="M"
                                       :readonly="ServiceOpenParamExist"
                                >男
                                </radio>
                                <radio class="btn-sm" button v-model="ServiceOpenParam.gender" selected-value="F"
                                       :readonly="ServiceOpenParamExist"
                                >女
                                </radio>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="oservice-idNumber" class="col-md-3 col-sm-3 control-label form-required">身份证号：</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="18" placeholder="请输入正确的身份证号"
                                       id="oservice-idNumber" data-vv-as="身份证号" name="idnumber"
                                       v-model="ServiceOpenParam.idNumber" v-validate:idnumber="'required|idCard'"
                                       :class="{'input': true, 'is-danger': errors.has('openTserviceForm3.idnumber') }"
                                       :readOnly="ServiceOpenParamExist"/>
                                <i v-show="errors.has('openTserviceForm3.idnumber')" class="fa fa-warning"></i>
                                <span v-show="errors.has('openTserviceForm3.idnumber')"
                                      class="help is-danger">{{ errors.first('openTserviceForm3.idnumber') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="oservice-emergencyContact" class="col-md-3 col-sm-3 control-label form-required">紧急联系人：</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="11" placeholder="请输入紧急联系人电话"
                                       id="oservice-emergencyContact" data-vv-as="紧急联系人" name="emergencyContact"
                                       v-model="ServiceOpenParam.emergencyContact"
                                       v-validate:emergencyContact="'required|mobile'"
                                       :class="{'input': true, 'is-danger': errors.has('openTserviceForm3.emergencyContact') }"
                                       :readOnly="ServiceOpenParamExist"/>
                                <i v-show="errors.has('openTserviceForm3.emergencyContact')" class="fa fa-warning"></i>
                                <span v-show="errors.has('openTserviceForm3.emergencyContact')"
                                      class="help is-danger">{{ errors.first('openTserviceForm3.emergencyContact') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="oservice-name" class="col-md-3 col-sm-3 control-label form-required">车主姓名：</label>
                            <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                                <input type="text" class="form-control" maxlength="11" placeholder="请输入车主姓名"
                                       id="oservice-name" data-vv-as="车主姓名" name="name"
                                       v-model="ServiceOpenParam.firstName" v-validate:name="'required|max:10'"
                                       :class="{'input': true, 'is-danger': errors.has('openTserviceForm3.name')}"
                                       :readOnly="ServiceOpenParamExist"/>
                                <i v-show="errors.has('openTserviceForm3.name')" class="fa fa-warning"></i>
                                <span v-show="errors.has('openTserviceForm3.name')"
                                      class="help is-danger">{{ errors.first('openTserviceForm3.name') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-3 form-validation">
                            </div>
                        </div>
                        <div class="form-group" v-if="ServiceOpenParamExist">
                            <div class="col-md-offset-1">（该手机号已经存在开通T服务的车辆，继续开通，当前车辆也将与手机号绑定。）</div>
                        </div>
                    </form>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="resetModal()">取消</button>
                    <button type="button" class="btn btn-success" @click="openTservice('openTserviceForm3')">开通T服务</button>
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
    import {modal, alert, radio} from 'vue-strap'
    import datePicker from 'iview/src/components/date-picker'
    export default{
        data(){
            return {
                datePickerOption: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                searchTimeType: [
                    {
                        value: "start_time",
                        name: "开通时间"
                    },
                    {
                        value: "expired_time",
                        name: "截止时间"
                    }
                ],
                serviceListSearch: {
                    vin: "",
                    userName: "",
                    filterField: "start_time",
                    dateTime:[null,null],
                    pageIndex: 1,
                    pageSize: 10,
                    dealerId: ""
                },
                serviceListSearchParam: {},
                serviceListSearchTotalCount: null,
                serviceDataList: [],
                //----------------------开通T服务
                modalShow:false,
                stepShow: [false, false, false],
                //step---------------1
                //搜索绑定值
                TserviceSearch: {
                    vin: "",
                    engineNumber: ""
                },
                //step---------------2
                //T服务数据
                TserviceData: {
                    vin: "",
                    engineNumber: "",
                    modelName: "",
                    dealerName:"",
                    dealerPhone:""
                },
                //手机验证
                icodeVali: {
                    phone: "",
                    icode: ""
                },
                //手机验证
                icodeBtn: {
                    text: "获取验证码",
                    second: "",
                    timer: null
                },
                //step---------------3
                //开通T服务参数
                ServiceOpenParamExist: false,
                ServiceOpenParam: {
                    gender: "M",
                    idNumber: "",
                    emergencyContact: "",
                    firstName: "",
                },
                windowAlert: {
                    isShow: false,
                    type: "",
                    content: ""
                }
            }
        },
        components: {
            datePicker, modal, alert, radio
        },
        methods: {
            searchServiceList(method){
                let _this = this;
                if (method === 'search') {
                    for (let key in _this.serviceListSearch) {
                        if(key !== 'dateTime'){
                            _this.serviceListSearchParam[key] = _this.serviceListSearch[key];
                        }
                    }
                    _this.serviceListSearchParam.startTime = _this.serviceListSearch.dateTime[0] ? _this.serviceListSearch.dateTime[0].getTime() : 0;
                    _this.serviceListSearchParam.endTime = _this.serviceListSearch.dateTime[1] ? _this.serviceListSearch.dateTime[1].getTime() : new Date().getTime();
                }
                if (typeof method === "number") {
                    _this.serviceListSearchParam.pageIndex = method;
                }
                _this.$http.get('api/queryVehsByUser', {params: _this.serviceListSearchParam}).then(function (res) {
                    if (res.body.status === "SUCCEED") {
                        _this.serviceDataList = res.body.datas;
                        _this.serviceListSearchTotalCount = res.body.totalCount;
                    }
                });
            },
            showStep1(){
                this.modalShow = true;
                this.stepShow = [true, false, false];
            },
            fromStep1ToStep2(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    let param = {
                        vin: _this.TserviceSearch.vin,
                        engineNumber: _this.TserviceSearch.engineNumber,
                        business: "open"
                    };
                    return _this.$http.get('api/checkVinAndEng', {params: param})
                }).then(function (res) {
                    if (res.body.status === 'SUCCEED') {
                        let result = res.body.data;
                        _this.TserviceData.modelName = result.modelName;
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
                let phoneFlag = _this.icodeVali.phone.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(_this.icodeVali.phone);
                if (phoneFlag) {
                    let param = {
                        eventId: _this.icodeVali.phone,
                        eventType: "OPEN_T_SERVICE",
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
                } else {
                    _this.showAlert({
                        type: "danger",
                        content: "请填写正确的手机号格式"
                    })
                }

            },
            fromStep2ToStep3(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    let param = {
                        eventId: _this.icodeVali.phone,
                        code: _this.icodeVali.icode,
                        eventType: "OPEN_T_SERVICE"
                    };
                    return _this.$http.get('api/checkCode', {params: param})
                }).then(function (res) {
                    if (res.body.status === 'SUCCEED') {
                        let param = {
                            userName: _this.icodeVali.phone,
                            packageStatus: "using"
                        };
                        _this.$http.get('api/queryVehsByUser', {params: param}).then(function (res) {
                            if (res.body.status === 'SUCCEED') {
                                if (res.body.datas.length > 0) {
                                    let data = res.body.datas[0];
                                    _this.ServiceOpenParam.gender = data.gender;
                                    _this.ServiceOpenParam.idNumber = data.idNumber;
                                    _this.ServiceOpenParam.emergencyContact = data.emergencyContact;
                                    _this.ServiceOpenParam.firstName = data.ownerName;
                                    _this.ServiceOpenParamExist = true;
                                }
                                _this.stepShow = [false, false, true];
                            } else {
                                _this.showAlert({
                                    type: "danger",
                                    content: res.body.errorMessage
                                })
                            }
                        });
                    } else {
                        _this.showAlert({
                            type: "danger",
                            content: res.body.errorMessage
                        })
                    }
                })
            },
            openTservice(scope){
                let _this = this;
                _this.$validator.validateAll(scope).then(function () {
                    let param = {
                        vin: _this.TserviceSearch.vin,
                        dealerId: _this.ServiceOpenParam.dealerId,
                        firstName: _this.ServiceOpenParam.firstName,
                        idNumber: _this.ServiceOpenParam.idNumber,
                        emergencyContact: _this.ServiceOpenParam.emergencyContact,
                        gender: _this.ServiceOpenParam.gender,
                        userName: _this.icodeVali.phone,
                        engineNumber: _this.TserviceSearch.engineNumber,
                        opener: "dealer"
                    };
                    return _this.$http.post('api/openTService', param)
                }).then(function (res) {
                    if (res.body.status === 'SUCCEED') {
                        _this.showAlert({
                            type: "success",
                            content: "开通成功！"
                        });
                        _this.resetModal();

                        //解决solr同步延迟问题
                        _this.$store.commit('SET_LOADING_SHOW');
                        setTimeout(()=>{
                            _this.searchServiceList('search');
                            _this.$store.commit('SET_LOADING_HIDE');
                        },500);

                    } else {
                        _this.showAlert({
                            type: "danger",
                            content: res.body.errorMessage
                        })
                    }
                })
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
                this.modalShow = false;
                this.TserviceSearch.vin = "";
                this.TserviceSearch.engineNumber = "";
                this.TserviceData.vin = "";
                this.TserviceData.engineNumber = "";
                this.TserviceData.modelName = "";
                this.icodeVali.phone = "";
                this.icodeVali.icode = "";
                this.ServiceOpenParam.gender = "M";
                this.ServiceOpenParam.idNumber = "";
                this.ServiceOpenParam.emergencyContact = "";
                this.ServiceOpenParam.firstName = "";
                this.ServiceOpenParamExist = false;
                this.$validator.getErrors().clear('openTserviceForm1');
                this.$validator.getErrors().clear('openTserviceForm2');
                this.$validator.getErrors().clear('openTserviceForm3');
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
                if(debug){
                    response.body.status = 1;
                    response.body.admin = {org:{code:1}};
                }
                //npm start开发时

                if (response.body.status === 1) {
                    let admin = response.body.admin;
                    //有组织机构
                    if (admin.org) {
                        this.ServiceOpenParam.dealerId = admin.org.code;
                        this.serviceListSearch.dealerId = admin.org.code;
                        this.$http.get('api/getVehDealerById', {params: {vehDealerId: admin.org.code}}).then(res => {
                            if (res.body.status === 'SUCCEED') {
                                this.TserviceData.dealerName = res.body.data.name;
                                this.TserviceData.dealerPhone = res.body.data.salePhone;
                            }
                        });
                        this.searchServiceList('search');
                        //无组织机构
                    } else {
                        this.showAlert({
                            type: "danger",
                            content: "该账户无组织机构！"
                        });
                    }
                }else{
                    this.showAlert({
                        type: "danger",
                        content: response.body.errorMessage
                    });
                }
            });

        },
        mounted(){
        },
        props:["message"]
    }

</script>
