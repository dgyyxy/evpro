<template>
    <div>
        <ul class="breadcrumb">
            <li>设备管理</li>
            <li>设备参数查询</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">查询</label>
                            <select class="form-control input-sm" v-model="findDevice.type">
                                <option v-for="deviceType in deviceTypeList" :value="deviceType.value">{{deviceType.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">关键字：</label>
                            <input type="text" class="form-control input-sm" v-model="findDevice.keyword" placeholder="请输入关键字"/>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" @click="changeFindDeviceModal">搜索</button>
                        <button type="button" class="btn btn-sm btn-success pull-right mg-lf-12" @click="deviceConfigRefresh();" v-show="deviceVin">刷新</button>
                        <button type="button" class="btn btn-sm btn-success pull-right" v-show="deviceVin" data-toggle="modal" data-target="#confirmModal">下发查询指令</button>
                        
                        <!--<button type="button" class="btn btn-sm btn-success fr" @click="" style="margin: 0 15px;">参数查询</button>
                        <button type="button" class="btn btn-sm btn-success fr" @click="">设备搜索</button>-->
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
                    <th>参数查询时间</th>
                    <th>硬件版本</th>
                    <th>固件版本</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{{deviceConfigs.deviceSN}}</td>
                    <td>{{deviceConfigs.deviceId}}</td>
                    <td>{{deviceConfigs.uploadTime | DateFilter}}</td>
                    <td>{{deviceConfigs.hardwareVersion}}</td>
                    <td>{{deviceConfigs.firmwareVersion}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>参数ID</th>
                    <th>参数描述</th>
                    <th>参数值</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="config in deviceConfigs.configs">
                    <td>{{config.code}}</td>
                    <td>{{config.name}}</td>
                    <td>{{config.value}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <modal v-model="findDeviceModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="findDeviceModal.isShow=false;"><span>×</span></button>
                <h4 class="modal-title">设备搜索</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-inline" onsubmit="return false">
                    <div class="form-group">
                        <label class="control-label label-name">查询</label>
                        <select class="form-control input-sm" v-model="findDevice.type">
                            <option v-for="deviceType in deviceTypeList" :value="deviceType.value">{{deviceType.name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="control-label label-name">关键字：</label>
                        <input type="text" class="form-control input-sm" v-model="findDevice.keyword" placeholder="请输入关键字"/>
                    </div>
                    <button type="button" class="btn btn-sm btn-success" @click="findDeviceEvent();">搜索</button>
                </form>
                <div class="data-table table-responsive" style="margin-top: 15px;">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>设备号</th>
                            <th>IMEI</th>
                            <th>VIN</th>
                            <th>参数</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="deviceInfo in deviceInfoList">
                            <td>{{deviceInfo.sn}}</td>
                            <td>{{deviceInfo.imei}}</td>
                            <td>{{deviceInfo.vin}}</td>
                            <td><a href="javascript:void(0)" v-on:click="findLatestDeviceUploadConfigs(deviceInfo.vin, deviceInfo.sn);">查询</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination-row clearfix">
                    <div class="pull-right pull-left-sm">
                        <zpagenav :page="findDevice.pageIndex" :page-size="findDevice.pageSize" :total="deviceInfoTotalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="findDeviceModal.isShow=false;">取消</button>
            </div>
        </modal>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>

        <div class="modal bs-example-modal-sm" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
          <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">注意</h4>
              </div>
              <div class="modal-body">
                <p>&nbsp;&nbsp;该操作是向车载终端发送查询命令，不会立即得到结果，请稍后点击“刷新”，确认后开始下发查询命令。</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-success btn-sm" @click="sendSearchCommand">确认</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
    import {modal,alert} from 'vue-strap';
    export default {
        data () {
            return {
                maxLink: 5,
                deviceInfoTotalCount: 0,
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
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
                        name: "VIN",
                        value:"vin"
                    }
                ],
                findDevice: {
                    type: "sn",
                    keyword: "",
                    pageIndex:1,
                    pageSize:10,
                    installStatus: true
                },
                findDeviceModal: {
                    isShow: false
                },
                deviceInfoList: [],
                deviceConfigs: {},
                deviceVin: '' // 设置临时vin变量
            }
        },
        components: {
            modal,
            alert
        },
        methods: {
            changeFindDeviceModal() {
                this.findDeviceModal.isShow = true;
                this.findDeviceEvent();
            },
            findDeviceEvent(){
                let _this = this;
                _this.$http.get('api/getVehDeviceInfoList', { params: _this.findDevice }).then(function(data){
                    if(data.body.status === 1) {
                        _this.deviceInfoList = data.body.datas;
                        _this.pageIndex = data.body.pageIndex;
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
            findLatestDeviceUploadConfigs(deviceId, deviceSN) {
                this.deviceVin = deviceId;
                let _this = this;
                _this.findDeviceModal.isShow = false;
                _this.$http.get('api/findLatestDeviceUploadConfigs', { params: {deviceId: deviceId} }).then(function(data){
                    if(data.body.status === 1 && data.body.datas) {
                        _this.deviceConfigs = data.body.datas;
                        _this.deviceConfigs.deviceId = deviceId
                        _this.deviceConfigs.deviceSN = deviceSN
                    }else{
                        _this.alert = {
                            isShow: true,
                            content: data.errorMessage || '数据错误',
                            type: "danger"
                        }
                        _this.deviceConfigs = [];
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
                let _this = this;
                _this.findDevice.pageIndex = pageIndex;
                _this.findDeviceEvent();
            },
            deviceConfigRefresh() {
                this.findLatestDeviceUploadConfigs(this.deviceVin);
            },

            /**
             * 下发查询指令
             */
            sendSearchCommand() {
                let params = {
                    deviceId: this.deviceVin,
                    cmdCode: '00502',
                    deviceType: 'vehicle'
                };
                this.$http.post('api/sendCommand', {params: params}).then((data) => {
                    console.log('data:', data);
                    $("#confirmModal").modal('hide');
                });
            }
        }
    }
</script>