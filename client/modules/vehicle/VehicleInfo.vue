<template>
    <div>
        <ul class="breadcrumb">
            <li>基础信息管理</li>
            <li>车辆信息管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body clearfix">
                    <div class="control-search col-md-9 col-sm-9">
                        <form class="form-inline  no-margin" @submit.prevent="vehicleSearch">
                            <div class="form-group">
                                <label class="control-label label-name">状态：</label>
                                <select class="form-control input-sm input-fixed" v-model="vehicleinfo.status">
                                    <option value="">全部</option>
                                    <option v-for="status in statusList" v-bind:value="status.value">{{status.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="control-label label-name">类型：</label>
                                <select class="form-control input-sm input-fixed" v-model="vehicleinfo.tagType">
                                    <option value="">全部</option>
                                    <option v-for="tagType in tagTypeList" v-bind:value="tagType.name">{{tagType.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="control-label label-name">条件：</label>
                                <select class="form-control input-sm input-fixed" v-model="vehicleinfo.type">
                                    <option v-for="type in searchTypes" v-bind:value="type.value">{{type.name}}</option>
                                </select>
                                <input type="text" class="form-control input-sm input-fixed" v-model="vehicleinfo.keyword" placeholder="关键字"/>
                            </div>
                        </form>
                        <form class="form-inline m-bottom-md" @submit.prevent="vehicleSearch">
                            <div class="form-group">
                                <label class="control-label label-name">品牌：</label>
                                <select class="form-control input-sm input-fixed" v-model="vehicleinfo.brandId" v-on:change="vehicleInfoBrandChanged()">
                                    <option value="">全部</option>
                                    <option v-for="brand in vehBrandList" v-bind:value="brand.id">{{brand.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="control-label label-name">车系：</label>
                                <select class="form-control input-sm input-fixed" v-model="vehicleinfo.seriesId" v-on:change="vehicleInfoSeriesChanged()">
                                    <option value="">全部</option>
                                    <option v-for="series in vehSeriesList" v-bind:value="series.id">{{series.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="control-label label-name">车型：</label>
                                <select class="form-control input-sm input-fixed" v-model="vehicleinfo.modelId">
                                    <option value="">全部</option>
                                    <option v-for="model in vehModelList" v-bind:value="model.id">{{model.name}}</option>
                                </select>
                            </div>
                            <button type="button" id="vehicleSearch" class="btn btn-sm btn-success" v-on:click="vehicleSearch">搜索</button>
                        </form>
                    </div>
                    <div class="control-input col-md-3 col-sm-3">
                        <button type="button" class="btn btn-sm btn-success right" v-if="message['/vehicle/vehicleInfo/isVehAddAndEdit']" v-on:click="addSelectCall">新增</button>
                        <button type="button" class="btn btn-sm btn-success right m-right-lg" v-on:click="importVehicle" v-if="message['/vehicle/vehicleInfo/importVehicle']">导入车辆信息</button>
                        <!--<button type="button" class="btn btn-sm btn-success right m-right-lg" v-if="message['/vehicle/vehicleInfo/isVehDeleteLogo']" v-on:click="importVehLogo">导入车辆标识</button>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="dataTable">
                <thead>
                <tr>
                    <th>VIN</th>
                    <th>车牌号</th>
                    <th>引擎号</th>
                    <th>下线时间</th>
                    <th>车主姓名</th>
                    <th>品牌</th>
                    <th>车系</th>
                    <th>车型</th>
                    <th>经销商名称</th>
                    <th>设备编号</th>
                    <th>状态</th>
                    <th>车辆类型</th>
                    <th>SIM卡电话号码</th>
                    <th>设备信息</th>
                    <th>购车信息</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="vehicle in vehicleinformation.datas">
                    <td>{{vehicle.vin}}</td>
                    <td>{{vehicle.licensePlate}}</td>
                    <td>{{vehicle.engineNumber}}</td>
                    <td>{{vehicle.offLineDate | activeDateFilter}}</td>
                    <td>{{vehicle.ownerName}}</td>
                    <td>{{vehicle.brandName}}</td>
                    <td>{{vehicle.seriesName}}</td>
                    <td>{{vehicle.modelName}}</td>
                    <td>{{vehicle.dealerName}}</td>
                    <td>{{vehicle.deviceSN}}</td>
                    <td v-text="vehStatus(vehicle.status)"></td>
                    <td>{{vehicle.tagType}}</td>
                    <td>{{vehicle.simNumber}}</td>
                    <td>
                        <i-button type="ghost" size="small" icon="document-text" @click="details(vehicle)" v-if="vehicle.deviceList.length>0 ? true : false">详情</i-button>
                        <i-button type="ghost" size="small" icon="link" @click="deviceBinding(vehicle)" v-if="isDeviceToVehBind(vehicle) && message['/vehicle/vehicleInfo/isVehBindDevAndOwner']">绑定</i-button>
                    </td>
                    <td>
                        <i-button type="ghost" size="small" icon="document-text" @click="buyDetails(vehicle)" v-if="vehicle.saleInfoList.length>0 ? true : false">详情</i-button>
                        <i-button type="ghost" size="small" icon="link" @click="buyBinding(vehicle)" v-if="isOwnerToVehBind(vehicle) && message['/vehicle/vehicleInfo/isVehBindDevAndOwner']">绑定</i-button>
                    </td>

                    <td>
                        <i-button type="ghost" size="small" icon="edit" @click="allEdit(vehicle)" v-if="message['/vehicle/vehicleInfo/isVehAddAndEdit'] && vehicle.status!='WRITTENOFF'?true:false">编辑</i-button>
                        <i-button type="ghost" size="small" icon="document-text" @click="invalidDetails(vehicle)" v-if="vehicle.status=='WRITTENOFF'?true:false">详情</i-button>
                        <i-button type="ghost" size="small" icon="android-delete" @click="invalidVehicle(vehicle)" v-if="message['/vehicle/vehicleInfo/isVehWrittenOff'] && vehicle.status!='WRITTENOFF'?true:false">作废</i-button>
                        <i-button type="ghost" size="small" icon="android-close" v-if="message['/vehicle/vehicleInfo/isVehDeleteLogo'] && vehicle.tagType!='普通车辆'" @click="deleteVehlLogo(vehicle)">删除标识</i-button>
                        <i-button type="ghost" size="small" icon="android-sync" v-if="message['/vehicle/vehicleInfo/isVehReturnGoods'] && !isOwnerToVehBind(vehicle)" @click="vehReturnSales(vehicle)">退货</i-button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="vehicleinfo.pageIndex" :page-size="vehicleinfo.pageSize" :total="totalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
            </div>
        </div>
        <!--新增/编辑车辆-->
        <modal v-model="vehicleAddModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehicleAddCancel"><span>×</span></button>
                <h4 class="modal-title">{{vehicleModelAddOrEditShow}}车辆</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal" role="form" novalidate data-vv-scope="addVehicleVali">
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">品牌：</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <select
                                    v-validate:brand="'required'" data-vv-as="品牌" name="brand" :class="{'select': true, 'is-danger': errors.has('addVehicleVali.brand') }"
                                    class="form-control input-sm input-sm" v-model="addSelect.brand">
                                <i v-show="errors.has('addVehicleVali.brand')" class="fa fa-warning"></i>
                                <option value="">--请选择--</option>
                                <option v-for="brand in vehAttribute" v-bind:value="brand">{{brand.name}}</option>
                            </select>
                            <span v-show="errors.has('addVehicleVali.brand')" class="help is-danger">{{ errors.first('addVehicleVali.brand') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">车系：</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <select
                                    v-validate:series="'required'" name="series" data-vv-as="车系" :class="{'select': true, 'is-danger': errors.has('addVehicleVali.series') }"
                                    class="form-control input-sm" v-model="addSelect.series">
                                <i v-show="errors.has('addVehicleVali.series')" class="fa fa-warning"></i>
                                <option value="">--请选择--</option>
                                <option v-for="series in addSelect.brand.vehicleSeriesList" v-bind:value="series">{{series.name}}</option>
                            </select>
                            <span v-show="errors.has('addVehicleVali.series')" class="help is-danger">{{ errors.first('addVehicleVali.series') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">车型：</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <select
                                    v-validate:model="'required'" name="model" data-vv-as="车型" :class="{'select': true, 'is-danger': errors.has('addVehicleVali.model') }"
                                    class="form-control input-sm" v-model="addSelect.model">
                                <i v-show="errors.has('addVehicleVali.model')" class="fa fa-warning"></i>
                                <option value="">--请选择--</option>
                                <option v-for="model in addSelect.series.vehicleModelList" v-bind:value="model">{{model.name}}</option>
                            </select>
                            <span v-show="errors.has('addVehicleVali.model')" class="help is-danger">{{ errors.first('addVehicleVali.model') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">颜色：</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <select
                            v-validate="'required'" name="vehcolorId" data-vv-as="颜色" :class="{'select': true, 'is-danger': errors.has('addVehicleVali.vehcolorId') }"
                             class="form-control input-sm vehcolorId">
                             <i v-show="errors.has('addVehicleVali.vehcolorId')" class="fa fa-warning"></i>
                                <option value="">--请选择--</option>
                                <option v-for="color in vehColorList" v-bind:value="color.id">{{color.name}}</option>
                            </select>
                            <span v-show="errors.has('addVehicleVali.vehcolorId')" class="help is-danger">{{ errors.first('addVehicleVali.vehcolorId') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3  control-label label-name">VIN：</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input v-validate="'required|alphaANum'" name="vehvin" type="text" data-vv-as="VIN"
                            class="form-control input-sm vehvin" placeholder=""
                            :class="{'input': true, 'is-danger': errors.has('addVehicleVali.vehvin') }"/>
                            <i v-show="errors.has('addVehicleVali.vehvin')" class="fa fa-warning"></i>
                            <span v-show="errors.has('addVehicleVali.vehvin')"
                            class="help is-danger">{{ errors.first('addVehicleVali.vehvin')+"并精确到17个字符" }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">引擎编号：</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input v-validate="'required|blankSpace|max:20'" type="text" data-vv-as="引擎编号"
                            :class="{'input': true, 'is-danger': errors.has('addVehicleVali.vehengineNumber') }" name="vehengineNumber"
                            class="form-control input-sm vehengineNumber" placeholder="引擎编号"/>
                            <i v-show="errors.has('addVehicleVali.vehengineNumber')" class="fa fa-warning"></i>
                            <span v-show="errors.has('addVehicleVali.vehengineNumber')"
                            class="help is-danger">{{ errors.first('addVehicleVali.vehengineNumber') }}</span>
                            <ul class="has-error-message">

                            </ul>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group" v-if="false">
                        <label class="col-md-3 col-sm-3 control-label label-name">车牌号：</label>
                        <div class="col-md-6 col-sm-6 has-icon has-icon-right">
                            <input v-validate="'required|min:1|max:9'" type="text" data-vv-as="车牌号"
                            :class="{'input': true, 'is-danger': errors.has('addVehicleVali.vehlicensePlate') }" name="vehlicensePlate"
                            class="form-control input-sm" placeholder="车牌号"  v-model="vehlicensePlate"/>
                            <i v-show="errors.has('addVehicleVali.vehlicensePlate')" class="fa fa-warning"></i>
                            <span v-show="errors.has('addVehicleVali.vehlicensePlate')"
                            class="help is-danger">{{ errors.first('addVehicleVali.vehlicensePlate') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">下线时间：</label>
                        <div class="col-md-6 col-sm-6">
                            <date-picker :confirm="true" class="float-l" v-model="offLineDate" type="datetime" placeholder="下线时间" style="width: 283px" @on-ok="timeChange"></date-picker>
                            <i v-show="!timeCompare" class="fa fa-warning"></i>
                            <span v-show="!timeCompare" class="help is-danger">{{ timeTips }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3"></div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehicleAddCancel">取消</button>
                <button type="button" class="btn btn-success" @click="generateVehicle('addVehicleVali')" v-show="isAdd" :disabled="errors.any('addVehicleVali') || !timeCompare">确定</button>
                <button type="button" class="btn btn-success" @click="generateVehicleEdit('addVehicleVali')" v-show="!isAdd" :disabled="errors.any('addVehicleVali') || !timeCompare">确定</button>
            </div>
        </modal>
        <!--设备信息-详情-->
        <modal v-model="deviceInfoModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="deviceInfoModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">设备详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <label class="control-label label-title">车辆信息：</label>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">vin码：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{equipmentDetailsList.vin}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">车型：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{equipmentDetailsList.modelName}}</label>
                </div>
                <label class="control-label label-title">设备信息：
                    {{equipmentDetailsList.status=="VALID"?"绑定":"未绑定"}}
                </label>
                <div class="data-table table-responsive">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>设备类型</th>
                            <th>设备编号</th>
                            <th>IMEI</th>
                            <th>设备与车关系</th>
                            <th>解绑时间</th>
                            <th v-if="message['/vehicle/vehicleInfo/isVehUnbindDevAndOwner']">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in equipmentDetailsList.deviceList">
                            <td>{{item.modelName}}</td>
                            <td>{{item.sn}}</td>
                            <td>{{item.imei}}</td>
                            <td>{{vehDeviceChange(item.installStatus)}}</td>
                            <td>{{item.uninstallDate | activeDateFilter}}</td>
                            <td v-if="message['/vehicle/vehicleInfo/isVehUnbindDevAndOwner']">
                                <button type="button" class="btn btn-sm btn-success m-right-md" v-on:click="unbundling(equipmentDetailsList)" :disabled="item.installStatus=='VALID'?false:true">解绑</button>
                                <button type="button" class="btn btn-sm btn-success" v-on:click="writeOffDevice(equipmentDetailsList)" :disabled="item.installStatus=='VALID'?false:true">作废</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="deviceInfoModal.isShow = false">关闭</button>
            </div>
        </modal>
        <!-- 设备信息-绑定-->
        <modal v-model="deviceBindModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="deviceBindModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">绑定确认</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <label class="control-label label-title">车辆信息：</label>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">vin码：</label>
                    <label class="control-label label-text col-md-3 col-sm-3">{{equipmentBindingList.vin}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">车型：</label>
                    <label class="control-label label-text col-md-3 col-sm-3">{{equipmentBindingList.modelName}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">设备类型：</label>
                    <label class="control-label label-text col-md-3 col-sm-3">{{isUndefined(equipmentBindingList.deviceList)}}</label>
                </div>
                <label class="control-label label-title">设备信息：</label>
                <div class="form-group clearfix">
                    <div class="col-md-3 col-sm-3">
                        <select class="form-control" v-model="bindingEquipmentSearch.type">
                            <option value="sn">设备编号</option>
                            <option value="imei">IMEI</option>
                        </select>
                    </div>
                    <div class="col-md-4 col-sm-4">
                        <input type="text" class="form-control" v-model="bindingEquipmentSearch.keyword"/>
                    </div>
                    <button type="button" class="btn btn-sm btn-success" v-on:click="searchBinding" :disabled="bindingEquipmentSearch.keyword.length>0?false:true">搜索</button>
                </div>
                <div class="data-table table-responsive" v-show="isSearchClick && !isSearchClickTips">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>设备编号</th>
                            <th>设备类型</th>
                            <th>IMEI</th>
                            <th>设备备注</th>
                            <th>设备状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{{equipmentSearchResult.sn}}</td>
                            <td>{{equipmentSearchResult.modelName}}</td>
                            <td>{{equipmentSearchResult.imei}}</td>
                            <td>{{equipmentSearchResult.remark}}</td>
                            <td>{{equipmentStatus(equipmentSearchResult.status)}}</td>
                            <td>
                                <button type="button" class="btn btn-sm btn-success" v-on:click="bundlingEquipment(equipmentBindingList,equipmentSearchResult)"  :disabled="equipmentSearchResult.status=='VALID'?true:false">绑定</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <p v-show="isSearchClickTips">暂无搜索结果</p>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="deviceBindModal.isShow=false">关闭</button>
            </div>
        </modal>
        <!-- 购车-详情-->
        <modal v-model="ownerInfoModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="ownerInfoModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">购车详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">vin码：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{vehicleDetailsList.vin}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">车型：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{vehicleDetailsList.modelName}}</label>
                </div>
                <div class="data-table table-responsive">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>车主姓名</th>
                            <th>身份证号</th>
                            <th>手机号</th>
                            <th>购车日期</th>
                            <th>经销商名称</th>
                            <th>车主状态</th>
                            <th>解绑时间</th>
                            <th v-if="message['/vehicle/vehicleInfo/isVehUnbindDevAndOwner']">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in vehicleDetailsList.saleInfoList">
                            <td>{{item.vehicleOwner.ownerName}}</td>
                            <td>{{item.vehicleOwner.idNumber}}</td>
                            <td>{{item.vehicleOwner.mobilePhone}}</td>
                            <td>{{item.saleDate | activeDateFilter}}</td>
                            <td>{{item.vehicleDealer.name}}</td>
                            <td>{{ownerStatus(item.relationType)}}</td>
                            <td>{{item.unbindDate | activeDateFilter}}</td>
                            <td v-if="message['/vehicle/vehicleInfo/isVehUnbindDevAndOwner']">
                                <button type="button" class="btn btn-sm btn-success" v-on:click="bundlingOwner(vehicleDetailsList)" :disabled="item.relationType=='OWNED'?false:true">解绑</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="ownerInfoModal.isShow = false">关闭</button>
            </div>
        </modal>
        <!--购车-绑定-->
        <modal v-model="ownerBindModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="ownerBindModalCancel"><span>×</span></button>
                <h4 class="modal-title">绑定确认</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal" role="form" novalidate data-vv-scope="ownerVali">
                    <div class="form-group">
                        <label class="control-label label-name col-md-2 col-sm-2">vin码：</label>
                        <label class="control-label label-text col-md-4 col-sm-4">{{ownerBindVehicleList.vin}}</label>
                        <label class="control-label label-name col-md-2 col-sm-2">车型：</label>
                        <label class="control-label label-text col-md-4 col-sm-4">{{ownerBindVehicleList.modelName}}</label>
                    </div>
                    <div class="form-group">
                        <label class="control-label label-name col-md-2 col-sm-2">经销商名称：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <v-select class="dealerlist" style="width:183px;" v-model="dealerName" :options="allgetVehDealerList" options-value="id"
                                      placeholder="请选择"
                                      options-label="name" search-text="请输入" search
                            ></v-select>
                            <i v-show="parentDealersTips?true:false" class="fa fa-warning"></i>
                            <span v-show="parentDealersTips?true:false" class="help is-danger">经销商名称为必填项</span>
                        </div>
                        <label class="control-label label-name col-md-2 col-sm-2">购车日期：</label>
                        <div class="col-md-4 col-sm-4">
                            <date-picker class="float-l" v-model="vehicleBuyDate" type="datetime" placeholder="购车日期" style="width: 183px"></date-picker>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="control-label label-name col-md-2 col-sm-2">车牌号：</label>
                        <div class="col-md-4 col-sm-4">
                            <input type="text" 
                            class="form-control input-sm" 
                            v-model="ownerBindVehicleParams.vehicle.licensePlate"
                            />
                            <span v-show="ownerBindVehicleParams.vehicle.licensePlate.length==0?false:ownerBindVehicleParams.vehicle.licensePlate.length==7?false:true" class="help is-danger">请填写正确的车牌号</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="control-label label-name col-md-2 col-sm-2">车主：</label>
                        <div class="col-md-6 col-sm-6 form-height">
                            <input type="radio" name="ownername" class="" v-model="ownerStatusStyle" value="newOwnername" v-on:change="ownerChange('newOwnername')"/>新增车主
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="radio" name="ownername" class="" v-model="ownerStatusStyle" value="oldOwnername" v-on:change="ownerChange('oldOwnername')"/>已有车主
                        </div>
                    </div>
                    <div class="" v-show="!ownerAddShow">
                        <div class="form-group">
                            <label class="col-md-2 col-sm-2 control-label label-name">省：</label>
                            <div class="col-md-4 col-sm-4">
                                <select class="form-control input-sm" v-model="ownerBindVehicleParams.vehicleOwner.provinceCode" v-on:change="provinceChange">
                                    <option>--请选择--</option>
                                    <option v-for="provinceItem in provinceList" v-bind:value="provinceItem.id">{{provinceItem.name}}</option>
                                </select>
                            </div>
                            <label class="col-md-2 col-sm-2 control-label label-name">市：</label>
                            <div class="col-md-4 col-sm-4">
                                <select class="form-control input-sm" v-model="ownerBindVehicleParams.vehicleOwner.cityCode">
                                    <option>--请选择--</option>
                                    <option v-for="cityItem in cityList" v-bind:value="cityItem.id">{{cityItem.name}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-line-validator">
                                <label class="col-md-4 col-sm-4 control-label label-name">身份证号：</label>
                                <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                    <input type="text" class="form-control input-sm owneridNumber" v-validate="'required|idCard'" name="owneridNumber" data-vv-as="身份证号" :class="{'input': true, 'is-danger': errors.has('ownerVali.owneridNumber') }"/>
                                    <i v-show="errors.has('ownerVali.owneridNumber')" class="fa fa-warning"></i>
                                    <span v-show="errors.has('ownerVali.owneridNumber')"
                                          class="help is-danger">{{ errors.first('ownerVali.owneridNumber') }}</span>

                                </div>
                            </div>
                            <div class="form-line-validator">
                                <label class="col-md-4 col-sm-4 control-label label-name">姓名：</label>
                                <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                    <input type="text" class="form-control input-sm ownerfirstName" v-validate="'required|max:20'" name="ownerfirstName" data-vv-as="姓名" :class="{'input': true, 'is-danger': errors.has('ownerVali.ownerfirstName') }"/>
                                    <i v-show="errors.has('ownerVali.ownerfirstName')" class="fa fa-warning"></i>
                                    <span v-show="errors.has('ownerVali.ownerfirstName')"
                                          class="help is-danger">{{ errors.first('ownerVali.ownerfirstName') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-line-validator">
                                <label class="col-md-4 col-sm-4 control-label label-name">手机号：</label>
                                <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                    <input type="text" class="form-control input-sm ownermobilePhone" v-validate="'required|mobile'" name="ownermobilePhone" data-vv-as="手机号" :class="{'input': true, 'is-danger': errors.has('ownerVali.ownermobilePhone') }"/>
                                    <i v-show="errors.has('ownerVali.ownermobilePhone')" class="fa fa-warning"></i>
                                    <span v-show="errors.has('ownerVali.ownermobilePhone')"
                                          class="help is-danger">{{ errors.first('ownerVali.ownermobilePhone') }}</span>
                                </div>
                            </div>
                            <div class="form-line-validator">
                                <label class="col-md-4 col-sm-4 control-label label-name">性别：</label>
                                <div class="col-md-8 col-sm-8 form-height">
                                    <input type="radio" name="gender" value="M" v-model="ownerBindVehicleParams.vehicleOwner.gender" checked/>男
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <input type="radio" name="gender" value="F" v-model="ownerBindVehicleParams.vehicleOwner.gender"/>女
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="" v-show="ownerAddShow">
                        <div class="form-group">
                            <label class="col-md-2 col-sm-2 control-label label-name">身份证号：</label>
                            <div class="col-md-4 col-sm-4">
                                <input type="text" class="form-control" v-model="searchIdNumber"/>
                            </div>
                            <button type="button" class="btn btn-success" :disabled="searchIdNumber.length>0?false:true" @click="searchByIdnumber">搜索</button>
                        </div>
                        <div v-if="searchResult && searchResultData">
                            <div class="form-group">
                                <label class="col-sm-2 col-md-2 control-label label-name">省份：</label>
                                <label class="col-sm-2 col-md-2 control-label label-text">{{searchByprovinceCode(searchIdNumberResult.provinceCode)}}</label>
                                <label class="col-sm-2 col-md-2 control-label label-name">城市：</label>
                                <label class="col-sm-2 col-md-2 control-label label-text">{{searchByCityCode(searchIdNumberResult.cityCode)}}</label>
                                <label class="col-sm-2 col-md-2 control-label label-name">姓名：</label>
                                <label class="col-sm-2 col-md-2 control-label label-text">{{searchIdNumberResult.firstName}}</label>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 col-md-2 control-label label-name">手机号：</label>
                                <label class="col-sm-2 col-md-2 control-label label-text">{{searchIdNumberResult.mobilePhone}}</label>
                                <label class="col-sm-2 col-md-2 control-label label-name">性别：</label>
                                <label class="col-sm-2 col-md-2 control-label label-text" v-text="searchIdNumberResult.gender=='F'?'女':'男'"></label>
                            </div>
                        </div>
                        <p v-if="searchResult && !searchResultData">查无此人</p>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="ownerBindModalCancel">取消</button>
                <button type="button" class="btn btn-success" :disabled="isBindOwnerToVeh" @click="buyBindingCall(ownerBindVehicleList,'ownerVali')">绑定</button>
            </div>
        </modal>
        <!--详情-->
        <modal v-model="vehicleInfoModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehicleInfoModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">车辆详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <table class="table table-striped" >
                    <thead>
                    <tr>
                        <th>品牌</th>
                        <th>车系</th>
                        <th>车型</th>
                        <th>颜色</th>
                        <th>VIN</th>
                        <th>车牌号</th>
                        <th>引擎</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{{allDetailsInfor.brandName}}</td>
                        <td>{{allDetailsInfor.seriesName}}</td>
                        <td>{{allDetailsInfor.modelName}}</td>
                        <td>{{allDetailsInfor.colorName}}</td>
                        <td>{{allDetailsInfor.vin}}</td>
                        <td>{{allDetailsInfor.licensePlate}}</td>
                        <td>{{allDetailsInfor.engineNumber}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehicleInfoModal.isShow=false">取消</button>
                <button type="button" class="btn btn-success" @click="allDetailsCall">确定</button>
            </div>
        </modal>
        <!--作废-->
        <modal v-model="vehicleValidModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehicleValidModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">作废确认</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <p><span class="red">*</span> 车辆作废后，与此车相关联的设备也默认作废！</p>
                <input type="text" class="form-control input-sm hide" v-model="invalidParams.vin"/>
                <form class="form-horizontal" role="form">
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">处理人：</label>
                        <div class="col-md-5 col-sm-5">
                            <input type="text" class="form-control input-sm" v-model="invalidParams.updatedBy"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">作废备注：</label>
                        <div class="col-md-5 col-sm-5">
                            <textarea rows="3" cols="30" class="form-control" v-model="invalidParams.remark"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehicleValidModal.isShow=false">取消</button>
                <button type="button" class="btn btn-success" @click="invalidCall">确定</button>
            </div>
        </modal>
        <!--作废详情-->
        <modal v-model="vehicleValidInfoModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehicleValidInfoModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">车辆详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal" role="form">
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">品牌：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{invalidDetailsList.brandName}}</label>
                        <label class="col-md-2 col-sm-2 control-label label-name">车系：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{invalidDetailsList.seriesName}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">车型：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">车{{invalidDetailsList.modelName}}</label>
                        <label class="col-md-2 col-sm-2 control-label label-name">车身颜色：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{invalidDetailsList.colorName}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">VIN码：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{invalidDetailsList.vin}}</label>
                        <label class="col-md-2 col-sm-2 control-label label-name">引擎编号：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{invalidDetailsList.engineNumber}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">车牌号：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{invalidDetailsList.licensePlate}}</label>
                        <label class="col-md-2 col-sm-2 control-label label-name">下线时间：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{invalidDetailsList.createTime | activeDateFilter}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">处理人：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{invalidDetailsList.updatedBy}}</label>
                        <label class="col-md-2 col-sm-2 control-label label-name">处理时间：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{invalidDetailsList.updateTime | activeDateFilter}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">作废备注：</label>
                        <label class="col-md-10 col-sm-10 control-label label-text">{{invalidDetailsList.remark}}</label>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehicleValidInfoModal.isShow=false">关闭</button>
            </div>
        </modal>
        <!--退货详情-->
        <modal v-model="vehReturnSalesModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehReturnSalesModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">退货详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal" role="form">
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">车主姓名：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{returnedGoodsList.ownerName}}</label>
                        <label class="col-md-3 col-sm-3 control-label label-name">车主性别：</label>
                        <label class="col-md-3 col-sm-3 control-label label-text">{{returnedGoodsList.gender | genderFilter}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">车主手机：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{returnedGoodsList.userName}}</label>
                        <label class="col-md-3 col-sm-3 control-label label-name">经销商名称：</label>
                        <label class="col-md-3 col-sm-3 control-label label-text">{{returnedGoodsList.dealerName}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">车型：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{returnedGoodsList.modelName}}</label>
                        <label class="col-md-3 col-sm-3 control-label label-name">服务开通日期：</label>
                        <label class="col-md-3 col-sm-3 control-label label-text">{{returnedGoodsList.startTime | activeDateFilter}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">单据编号：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{returnedGoodsList.formId}}</label>
                        <label class="col-md-3 col-sm-3 control-label label-name">服务截止日期：</label>
                        <label class="col-md-3 col-sm-3 control-label label-text">{{returnedGoodsList.endTime | activeDateFilter}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">身份证号：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{returnedGoodsList.idNumber}}</label>
                        <label class="col-md-3 col-sm-3 control-label label-name">单据建立日期：</label>
                        <label class="col-md-3 col-sm-3 control-label label-text">{{returnedGoodsList.createTime | activeDateFilter}}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">套餐名称：</label>
                        <label class="col-md-4 col-sm-4 control-label label-text">{{returnedGoodsList.packageName}}</label>
                        <label class="col-md-3 col-sm-3 control-label label-name">紧急联系人：</label>
                        <label class="col-md-3 col-sm-3 control-label label-text">{{returnedGoodsList.emergencyContact}}</label>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehReturnSalesModal.isShow=false">关闭</button>
                <button type="button" class="btn btn-default btn-success" @click="vehReturnSalesCall">退货</button>
            </div>
        </modal>
        <!--车辆与设备解绑确认-->
        <modal v-model="vehToDeviceUnbundlingModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehToDeviceUnbundlingModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">车辆与设备解绑确认</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <p>您确定要将车辆与设备解绑吗？</p>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehToDeviceUnbundlingModal.isShow = false">取消</button>
                <button type="button" class="btn btn-success" @click="unbundlingCall">确定</button>
            </div>
        </modal>
        <!--车辆与设备作废确认-->
        <modal v-model="vehToDeviceWriteOffModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehToDeviceWriteOffModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">车辆与设备作废确认</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <p>确定要解除车辆与设备的绑定关系，并作废设备吗？</p>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehToDeviceWriteOffModal.isShow = false">取消</button>
                <button type="button" class="btn btn-success" @click="writeOffDeviceCall">确定</button>
            </div>
        </modal>
        <!--车辆与车主解绑确认-->
        <modal v-model="vehToOwnerUnbundlingModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehToOwnerUnbundlingModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">车辆与车主解绑确认</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <p>您确定要将车辆与车主解绑吗?</p>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehToOwnerUnbundlingModal.isShow = false">取消</button>
                <button type="button" class="btn btn-success" @click="bundlingOwnerCall">确定</button>
            </div>
        </modal>
        <!--导入-->
        <modal v-model="vehImportModal.isShow">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehImportModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">车辆导入</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form method="POST" id="importVehForm" action="api/importVeh" enctype="multipart/form-data">
                    <input type="file" name="vehFile" @change="previewFile"/>
                    <div class="btn-warp">
                        <button type="button" class="btn btn-default right" @click="vehImportModal.isShow = false">取消</button>
                        <button type="button" class="btn btn-success right m-right-sm" @click="submitVehFile" :disabled="isFileHas">导入</button>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer hide">
                <button type="button" class="btn btn-default" @click="vehImportModal.isShow = false">取消</button>
                <button type="submit" class="btn btn-success" :disabled="isFileHas">导入</button>
            </div>
        </modal>
        <!--导入结果反馈-->
        <modal v-model="vehImportResultModal.isShow">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehImportResultModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">导入结果反馈</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">导入数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importVehResult.totalRowNumber}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">正常数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importVehResult.correctNumber}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">绑定数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importVehResult.succeedNumber}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">错误数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importVehResult.errorNumber}}</label>
                </div>
                <label class="control-label label-title">出错详情：</label>
                <div class="data-table table-responsive importResultClass" v-if="importVehResult.errorList">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>行号</th>
                            <th>错误原因</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in importVehResult.errorList" v-if="index<10">
                            <td>{{item.rowNumber}}</td>
                            <td>{{item.message}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehImportResultModal.isShow = false">关闭</button>
            </div>
        </modal>
        <!--导入-->
        <modal v-model="vehTagImportModal.isShow">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehTagImportModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">车辆标识导入</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form method="POST" id="uploadForm" action="api/importVehTag" enctype="multipart/form-data">
                    <input type="file" name="simFile" @change="previewFile"/>
                    <div class="btn-warp">
                        <button type="button" class="btn btn-default right" @click="vehTagImportModal.isShow = false">取消</button>
                        <button type="button" class="btn btn-success right m-right-sm" @click="submitFile" :disabled="isFileHas">导入</button>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer hide">
                <button type="button" class="btn btn-default" @click="vehTagImportModal.isShow = false">取消</button>
                <button type="submit" class="btn btn-success" :disabled="isFileHas">导入</button>
            </div>
        </modal>
        <!--导入结果反馈-->
        <modal v-model="vehTagImportResultModal.isShow">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehTagImportResultModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">导入结果反馈</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">导入数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importResult.totalRowNumber}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">正常数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importResult.correctNumber}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">绑定数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importResult.succeedNumber}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">错误数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importResult.errorNumber}}</label>
                </div>
                <label class="control-label label-title">出错详情：</label>
                <div class="data-table table-responsive importResultClass" v-if="importResult.errorList">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>行号</th>
                            <th>错误原因</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in importResult.errorList" v-if="index<10">
                            <td>{{item.rowNumber}}</td>
                            <td>{{item.message}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehTagImportResultModal.isShow = false">关闭</button>
            </div>
        </modal>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<style>

    .label-text{
        text-align:left !important;
        font-weight: normal;
        color: #666;
    }
    .label-title{
        font-weight:bold;
        text-align:left;
        font-size:16px;
        line-height:40px;
    }
    .red{
        color: red;
    }
    .form-height{
        height:34px;
        line-height:34px;
    }
    .control-label{
        padding-top: 0 !important;
        line-height:34px;
    }
    .modal{
        z-index:3 !important;
    }
    .dialog{
        z-index:10;
    }
    .dealertips{
        z-index:12;
    }
    .pagination>.active>a, .pagination>.active>a:focus, .pagination>.active>a:hover, .pagination>.active>span, .pagination>.active>span:focus, .pagination>.active>span:hover {
        z-index: 1 !important;
    }
</style>
<script>
    import {modal, alert, select} from 'vue-strap';
    import datePicker from 'iview/src/components/date-picker';
    export default{
        data() {
            return {
                vehCarNumber:{
                    isShow:false
                },
                vehReturnSalesModal:{
                    isShow:false
                },
                vehTagImportModal:{
                    isShow:false
                },
                vehTagImportResultModal:{
                    isShow:false
                },
                vehImportModal:{
                    isShow:false
                },
                vehImportResultModal:{
                    isShow:false
                },
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
                },
                deviceInfoModal:{
                    isShow:false
                },
                deviceBindModal:{
                    isShow:false
                },
                ownerInfoModal:{
                    isShow:false
                },
                ownerBindModal:{
                    isShow:false
                },
                vehicleAddModal:{
                    isShow:false
                },
                vehicleInfoModal:{
                    isShow:false
                },
                vehicleValidModal:{
                    isShow:false
                },
                vehicleValidInfoModal:{
                    isShow:false
                },
                vehToDeviceUnbundlingModal:{
                    isShow:false
                },
                vehToDeviceWriteOffModal:{
                    isShow:false
                },
                vehToOwnerUnbundlingModal:{
                    isShow:false
                },
                returnedGoodsList:{},
                ownerStatusStyle:"newOwnername",
                dealerName:"",
                tagTypeList:[],
                allgetVehDealerList:[],
                parentDealersTips:true,
                vehToDeviceUnbundlingInfo:{},
                vehToDeviceWriteOffInfo:{},
                vehToOwnerUnbundlingInfo:{},
                importResult:{},
                importVehResult:{},
                timeTips:"下线时间需小于当前时间",
                timeCompare:true,
                offLineDate: null,
                allAddShow:false,
                detailsShow:true,
                showCustomModal:false,
                deviceBindingShow:false,
                simBindingShow:false,
                buyDetailsShow:false,
                buyBindingShow:false,
                allDetailsShow:false,
                invalidShow:false,
                searchResult:false,
                searchResultData:false,
                isSearchClick:false,
                isSearchClickTips:false,
                invalidDetailsList:{},
                dealerPageIds:1,
                provinceList:{},
                cityList:{},
                name:"",
                vehicleModelAddOrEditShow:"新增",
                isAdd:true,
                modelName :"",
                vehVin:"",
                vehicleBuyDate:"",
                provinceCode:"",
                cityCode:"",
                invalidParams:{
                    vin  : 0,
                    remark : "",
                    updatedBy : ""
                },
                vehicleinfo: {
                    keyword:"",
                    type:"vin",
                    brandId:"",
                    seriesId:"",
                    modelId:"",
                    dealerIds:"",
                    status:"",
                    tagType:"",
                    pageIndex:1,
                    pageSize:10
                },
                statusList:[
                    {
                        "value":"VALID",
                        "name":"有效"
                    },
                    {
                        "value":"RESALE",
                        "name":"已转卖"
                    },
                    {
                        "value":"WRITTENOFF",
                        "name":"已作废"
                    }
                ],
                maxLink: 5,
                totalCount: 0,
                vehicleinformation:[],
                allDetailsInfor:{},
                vehAttribute:[],
                vehBrandList:[],
                vehSeriesList:[],
                vehModelList:[],
                searchType: "",
                seriseType:"",
                modelType:"",
                colorType:"",
                ownerAddShow: false,
                searchTypes: [
                    {
                        value: "vin",
                        name: "VIN"
                    },
                    {
                        value: "licensePlate",
                        name: "车牌号"
                    },
                    {
                        value: "engineNumber",
                        name: "引擎号"
                    },
                    {
                        value: "ownerName",
                        name: "车主姓名"
                    },
                    {
                        value: "dealerName",
                        name: "经销商名称"
                    },
                    {
                        value: "deviceSN",
                        name: "设备编号"
                    },
                    {
                        value: "simNumber",
                        name: "SIM卡电话号码"
                    }
                ],
                addSelect:{
                    brand: "",
                    series: "",
                    model: ""
                },
                addVehicle: {
                    id: 0,
                    vin: "",
                    offLineDate: "",
                    licensePlate: "",
                    engineNumber: "",
                    modelId: "",
                    colorId: ""
                },
                vehColorList: [],
                deviceInfoList:{},
                searchIdNumber:"",
                searchIdNumberResult:{},
                equipmentDetailsList:{},
                vehicleDetailsList:{},
                equipmentBindingList:{},
                equipmentSearchResult:{},
                isOwnerCurrent:true,
                bindingEquipmentSearch:{
                    type:"sn",
                    keyword:""
                },
                ownerBindVehicleList:{},
                ownerBindVehicleParams:{
                    "dealerId": 1,
                    "saleDate":"",
                    "vehicle": {
                        "vin": "",
                        "licensePlate":""
                    },
                    "vehicleOwner": {
                        "address": "",
                        "birthday": "",
                        "cityCode": "",
                        "countryCode": "",
                        "createTime": new Date(),
                        "createdBy": "",
                        "districtCode": "",
                        "email": "",
                        "firstName": "",
                        "gender": "M",
                        "homePhone": "",
                        "id": 0,
                        "idNumber": "",
                        "idType": "ID_CARD",
                        "lastName": "",
                        "mobilePhone": "",
                        "provinceCode": "",
                        "updateTime": "",
                        "updatedBy": ""
                    }
                },
                vehcolorId : "",
                vehvin : "",
                vehengineNumber : "",
                vehlicensePlate : "",
                owneridNumber : "",
                ownerfirstName : "",
                ownermobilePhone : "",
                file: null,
                isFileHas:true,
                isCall:false
            }
        },
        components: {
            modal,
            alert: alert,
            vSelect: select,
            datePicker
        },
        watch:{
            'dealerName':function(){
                if(this.dealerName ){
                    if(this.dealerName.length==0){
                        this.parentDealersTips=true;
                    }else{
                        this.parentDealersTips=false;
                    }
                }else{
                    this.parentDealersTips=false;
                }
            }
        },
        created (){
            let _this = this;
            _this.getProvinceList();
            _this.vehicleSearchList();
            _this.getVehAttribute();
            _this.getVehColorList();
            _this.getVehTagTypeAll();
            _this.parentDealersTips = true;
        },
        computed:{
            isBindOwnerToVeh(){
                let _this = this;
                if(!_this.parentDealersTips){
                    if(_this.ownerAddShow){  //已有
                        return !_this.searchResultData;
                    }else{  //新增
                        return _this.errors.any('ownerVali');
                    }
                }else{
                    return true;
                }
            }
        },
        methods: {
            vehReturnSales(vehicle){
                let _this = this;
                _this.vehReturnSalesModal.isShow = true;
                let engineNumber = vehicle.engineNumber.substring(vehicle.engineNumber.length-6);
                _this.$http.get('api/queryTService', { params: {vin:vehicle.vin,engineNumber:engineNumber} }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.returnedGoodsList = data.body.data;
                    }
                });
            },
            vehReturnSalesCall(){
                let _this = this;
                _this.$http.post('api/returnedGoods', {vehicleId:_this.returnedGoodsList.vehicleId,ownerId:_this.returnedGoodsList.ownerId}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.alert= {
                            isShow: true,
                            content: "车辆退货成功",
                            type: "success"
                        };
                        _this.vehReturnSalesModal.isShow = false;
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "车辆退货失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            remoteMethod(query){
                console.log(query);
            },
            isDeviceToVehBind(veh){
                if(veh.status=='WRITTENOFF'){
                    return false;
                }else{
                    if(veh.deviceList.length>0){
                        if(veh.deviceList[0].installStatus=='VALID'){
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            },
            isOwnerToVehBind(veh){
                if(veh.status=='WRITTENOFF'){
                    return false;
                }else{
                    if(veh.saleInfoList.length>0){
                        if(veh.saleInfoList[0].relationType=='OWNED'){
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            },
            ownerBindModalCancel(){
                let _this = this;
                _this.ownerBindModal.isShow=false;
                _this.errors.clear('ownerVali');
            },
            importVehLogo(){
                this.vehTagImportModal.isShow = true;
            },
            deleteVehlLogo(vehicle){
                let _this = this;
                _this.$http.post('api/deleteVehTagByVin', { tagRelId:vehicle.tagRelId }).then(function(data){
                    if(data.body.status){
                        _this.alert= {
                            isShow: true,
                            content: "删除车辆标识成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "删除车辆标识失败",
                            type: "danger"
                        };
                    }
                });
            },
            vehicleAddCancel() {
                this.vehicleAddModal.isShow=false;
                this.errors.clear('addVehicleVali');
                this.timeCompare = true;
            },
            vehicleSearchList(){
                let _this = this;
                _this.vehicleinfo.dealerIds = "";
                _this.$http.get('api/getVehInfoList', { params: _this.vehicleinfo }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehicleinformation = data.body;
                        _this.pageIndex = data.body.pageIndex;
                        _this.totalCount = data.body.totalCount;
                    }
                });
            },
            timeChange(){
                this.timeCompare=this.offLineDate<new Date();
            },
            getProvinceList(){
                let _this = this;
                _this.$http.get('api/findProvincesAndCities',{params:{keywords: "中国", level: "COUNTRY", sub: 2}}).then(function(res){
                    if(res.body.status && res.body.data[0]){
                        _this.provinceList = res.body.data[0].divisions;
                    }
                });
            },
            getDealerIds(){
                let _this = this;
                let isArray = true;
                _this.$http.get('api/findOrgById', {}).then(function(result){
                    if(result.body.status && result.body.orgs){
                        isArray = Array.isArray(result.body.orgs);
                        if(isArray){
                            _this.dealerPageIds = result.body.orgs[0].code;
                        }else{
                            _this.dealerPageIds = result.body.orgs.code;
                        }
                    }else{
                        console.log("获取数据失败！");
                    }
                });
            },
            getVehDealerList(){
                let _this = this;
                _this.$http.get('api/getVehDealerList',{params:{pageAll:true,status:'ACTIVE'}}).then(function(res){
                    if(res.body.status){
                        _this.allgetVehDealerList = res.body.datas;
                    }
                });
            },
            importVehicle(){
                this.vehImportModal.isShow = true;
            },
            generateVehicle(scope){
                let _this = this;
                _this.addVehicle.modelId = _this.addSelect.model.id;
                _this.addVehicle.offLineDate = _this.offLineDate;
                _this.addVehicle.vin = $(".vehvin").val();
                _this.addVehicle.licensePlate = _this.vehlicensePlate;
                _this.addVehicle.engineNumber = $(".vehengineNumber").val();
                _this.addVehicle.colorId = $(".vehcolorId").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addVeh', _this.addVehicle).then(function(data){
                            if(data.body.status=="SUCCEED"){
                                _this.vehicleAddModal.isShow = false;
                                _this.vehicleSearchList();
                                _this.alert= {
                                    isShow: true,
                                    content: "添加车辆成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "添加车辆失败,"+data.body.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            generateVehicleEdit(scope){
                let _this = this;
                _this.addVehicle.modelId = _this.addSelect.model.id;
                _this.addVehicle.offLineDate = _this.offLineDate;
                _this.addVehicle.vin = $(".vehvin").val();
                _this.addVehicle.licensePlate = _this.vehlicensePlate;
                _this.addVehicle.engineNumber = $(".vehengineNumber").val();
                _this.addVehicle.colorId = $(".vehcolorId").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateVeh', _this.addVehicle).then(function(data){
                            if(data.body.status=="SUCCEED"){
                                _this.vehicleAddModal.isShow = false;
                                _this.vehicleSearchList();
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车辆成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车辆失败,"+data.body.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            allEdit(vehicle){
                let _this = this;
                _this.vehicleAddModal.isShow = true;
                _this.vehicleModelAddOrEditShow="编辑";
                _this.isAdd = false;
                _this.offLineDate = vehicle.offLineDate?new Date(vehicle.offLineDate) : "";
                _this.addVehicle = {
                    id: vehicle.id,
                    vin: vehicle.vin,
                    licensePlate: vehicle.licensePlate,
                    engineNumber: vehicle.engineNumber,
                    modelId: vehicle.modelId,
                    colorId: vehicle.colorId
                };
                $(".vehvin").val(vehicle.vin);
                _this.vehlicensePlate = vehicle.licensePlate;
                $(".vehengineNumber").val(vehicle.engineNumber);
                $(".vehcolorId").val(vehicle.colorId);
                _this.vehAttribute.forEach(function(va){
                    if(va.id == vehicle.brandId){
                        _this.addSelect.brand = va;
                        va.vehicleSeriesList.forEach(function(vs){
                            if(vs.id == vehicle.seriesId){
                                _this.addSelect.series = vs;
                                vs.vehicleModelList.forEach(function(vm){
                                    if(vm.id == vehicle.modelId){
                                        _this.addSelect.model = vm;
                                    }
                                });
                            }
                        });
                    }
                });
            },
            invalidVehicle(vehicle){
                this.vehicleValidModal.isShow = true;
                this.invalidParams.vin = vehicle.vin;
                this.invalidParams.updatedBy = "";
                this.invalidParams.remark = "";
            },
            deviceBinding(vehicle){
                this.deviceBindModal.isShow=true;
                this.equipmentBindingList = vehicle;
                this.equipmentSearchResult = {};
                this.isSearchClick = false;
                this.isSearchClickTips = false;
                this.bindingEquipmentSearch.type = "sn";
                this.bindingEquipmentSearch.keyword = "";
            },
            deviceBindingCall(){
                this.$http.get('api/deviceBinding', {params: {keyword: keyword, value: type.value}}).then(function(data){
                    if(data.status=="SUCCEED"){
                        this.vehicleinformation = data.body.data;
                    }
                });
            },
            simBindingCall(){
                this.$http.get('api/simBinding', {params: {keyword: this.keyword, value: this.type.value}}).then(function(data){
                    if(data.status=="SUCCEED"){
                        this.search = data.data;
                    }
                });
            },
            buyDetails(vehicle){
                this.ownerInfoModal.isShow=true;
                this.vehicleDetailsList = vehicle;
            },
            buyDetailsCall(){
                this.ownerInfoModal.isShow=false
            },
            buyBinding(vehicle){
                let _this = this;
                if(!_this.isCall){
                    _this.getVehDealerList();
                }
                _this.isCall = !_this.isCall;
                _this.ownerBindVehicleList = vehicle;
                _this.ownerBindVehicleParams = {
                    "dealerId": 1,
                    "saleDate":"",
                    "vehicle": {
                        "vin": "",
                        "licensePlate":""
                    },
                    "vehicleOwner": {
                        "address": "",
                        "birthday": "",
                        "cityCode": "",
                        "countryCode": "",
                        "createTime": new Date(),
                        "createdBy": "",
                        "districtCode": "",
                        "email": "",
                        "firstName": "",
                        "gender": "M",
                        "homePhone": "",
                        "id": 0,
                        "idNumber": "",
                        "idType": "ID_CARD",
                        "lastName": "",
                        "mobilePhone": "",
                        "provinceCode": "",
                        "updateTime": "",
                        "updatedBy": ""
                    }
                };
                _this.vehicleBuyDate = null;
                $(".owneridNumber").val('');
                $(".ownerfirstName").val('');
                $(".ownermobilePhone").val('');
                _this.parentDealersTips = true;
                _this.dealerName = "";
                _this.ownerAddShow = false;
                _this.searchIdNumberResult = {};
                _this.searchResult = false;
                _this.searchResultData = false;
                _this.searchIdNumber = "";
                _this.ownerStatusStyle = "newOwnername";
                _this.ownerBindModal.isShow = true;
                setTimeout(function (){
                    _this.errors.clear('ownerVali');
                },30);
            },
            buyBindingCall(value,scope){
                let _this = this;
                let isOwnerExist = false;
                _this.ownerBindVehicleParams.vehicle.vin = value.vin;
                _this.ownerBindVehicleParams.saleDate = _this.vehicleBuyDate;
                _this.ownerBindVehicleParams.vehicleOwner.idNumber = $(".owneridNumber").val();
                _this.ownerBindVehicleParams.vehicleOwner.firstName = $(".ownerfirstName").val();
                _this.ownerBindVehicleParams.vehicleOwner.mobilePhone = $(".ownermobilePhone").val();
                _this.ownerBindVehicleParams.dealerId = _this.dealerName;
                if(_this.ownerAddShow){
                    _this.ownerBindVehicleParams.vehicleOwner = _this.searchIdNumberResult;
                    isOwnerExist = true;
                    _this.bindOwner(isOwnerExist);
                }else{
                    if(scope){
                        _this.$validator.validateAll(scope).then(() => {
                            isOwnerExist = false;
                            _this.bindOwner(isOwnerExist);
                        })
                    }
                }
            },
            bindOwner(isOwnerExist){
                let _this = this;
                _this.$http.post('api/bindOwner', {vehicleSaleInfo:_this.ownerBindVehicleParams,ownerExist:isOwnerExist}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.ownerBindModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "车主与车辆绑定成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "车主与车辆绑定失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            allDetailsCall(){
                this.vehicleInfoModal.isShow=false;
            },
            vehicleSearch(){
                this.vehicleinfo.pageIndex = 1;
                this.vehicleSearchList();
            },
            pageHandler(pageIndex){
                this.vehicleinfo.pageIndex = pageIndex;
                this.vehicleSearchList();
            },
            findDealerIdByName:function(name,dealerList){
                for(var i in dealerList){
                    if(dealerList[i].name==name){
                        return dealerList[i].id;
                    }
                }
            },
            onEndDatetimeChanged(newEnd){
                this.addVehicle.offLineDate = this.offLineDate;
            },
            addSelectCall(){
                let _this = this;
                _this.vehicleAddModal.isShow = true;
                _this.vehicleModelAddOrEditShow = "新增";
                _this.isAdd = true;
                _this.addSelect = {
                    brand: "",
                    series: "",
                    model: ""
                };
                _this.addVehicle = {
                    colorId  : "",
                    vin : "",
                    engineNumber  : "",
                    licensePlate  : ""
                };
                _this.offLineDate = null;
                _this.vehlicensePlate = "";
                $(".vehcolorId").val('');
                $(".vehvin").val('');
                $(".vehengineNumber").val('');
            },
            unbundling: function (equipmentDetailsList){
                let _this = this;
                _this.vehToDeviceUnbundlingModal.isShow = true;
                _this.vehToDeviceUnbundlingInfo = equipmentDetailsList;
            },
            unbundlingCall:function (){
                let _this= this;
                let vehId = _this.vehToDeviceUnbundlingInfo.deviceList[0].vehicleId;
                let devId = _this.vehToDeviceUnbundlingInfo.deviceList[0].id;
                let installId = _this.vehToDeviceUnbundlingInfo.deviceList[0].installId;

                _this.$http.post('api/unBindDevForVehicle', {vehId:vehId,devId:devId,installId:installId }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehToDeviceUnbundlingModal.isShow = false;
                        _this.deviceInfoModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆解绑成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆解绑失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            writeOffDevice(equipmentDetailsList){
                let _this = this;
                _this.vehToDeviceWriteOffModal.isShow = true;
                _this.vehToDeviceWriteOffInfo = equipmentDetailsList;
            },
            writeOffDeviceCall(){
                let _this= this;
                let devicSn = _this.vehToDeviceWriteOffInfo.deviceList[0].sn;
                let vin = _this.vehToDeviceWriteOffInfo.vin;

                _this.$http.post('api/vehDevWriteOffAndUnBind', {devicSn:devicSn,vin:vin }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehToDeviceWriteOffModal.isShow = false;
                        _this.deviceInfoModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆作废成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆作废失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            bundlingEquipment:function (vehicle,equipment){
                let _this= this;
                let vehId = vehicle.id;
                let devId = equipment.id;

                _this.$http.post('api/bindDevForVehicle', {vehId:vehId,devId:devId }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.deviceBindModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆绑定成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆绑定失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            bundlingOwner: function (vehicleDetailsList){
                let _this = this;
                _this.vehToOwnerUnbundlingModal.isShow = true;
                _this.vehToOwnerUnbundlingInfo = vehicleDetailsList;
            },
            bundlingOwnerCall:function (){
                let _this= this;
                let vin = _this.vehicleDetailsList.vin;
                let ownerId = _this.vehicleDetailsList.saleInfoList[0].vehicleOwner.id;
                let installId = _this.vehicleDetailsList.saleInfoList[0].id;

                _this.$http.post('api/unbindOwner', {vin:vin,ownerId:ownerId,installId:installId}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehToOwnerUnbundlingModal.isShow = false;
                        _this.ownerInfoModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "车主与车辆解绑成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "车主与车辆解绑失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            searchBinding: function (){
                let _this = this;
                _this.equipmentSearchResult = {};
                let type = _this.bindingEquipmentSearch.type;
                let keyword = _this.bindingEquipmentSearch.keyword;
                _this.$http.get('api/getVehDeviceByType', {params:{type:type,keyword:keyword}}).then(function(data){
                    if(data.body.status=="SUCCEED" && data.body.data){
                        _this.isSearchClick = true;
                        _this.isSearchClickTips = false;
                        _this.equipmentSearchResult = data.body.data;
                    }else{
                        _this.isSearchClickTips = true;
                    }
                });
            },
            details: function (vehicle){
                console.log(vehicle)
                let _this = this;
                _this.deviceInfoModal.isShow = true;
                _this.equipmentDetailsList = vehicle;
            },
            invalidCall: function (){
                let _this = this;
                _this.$http.post('api/writeOff',  _this.invalidParams ).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehicleValidModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "车辆作废成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "车辆作废失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            ownerChange: function (value){
                if( value=="newOwnername" ){
                    this.ownerAddShow = false;
                }else{
                    this.ownerAddShow = true;
                }
            },
            searchByIdnumber: function (){
                let _this = this;
                _this.searchResult = true;
                let idNumber = _this.searchIdNumber;
                _this.$http.get('api/getVehOwnerByIdNumber', {params:{idNumber:idNumber}}).then(function(data){
                    if(data.body.status=="SUCCEED" && data.body.data){
                        _this.searchIdNumberResult = data.body.data;
                        _this.searchResultData = true;
                    }else{
                        _this.searchResultData = false;
                    }
                });
            },
            vehDeviceChange(deviceStatus){
                let _this = this;
                if(deviceStatus=="VALID"){
                    return "当前设备";
                }else if(deviceStatus=="UNINSTALLED"){
                    return "历史设备";
                }else{
                    return "作废设备";
                }
            },
            provinceChange:function(){
                let _this = this;
                _this.cityList={};
                for(let i in _this.provinceList){
                    if(_this.provinceList[i].id==_this.ownerBindVehicleParams.vehicleOwner.provinceCode){
                        _this.cityList=_this.provinceList[i].divisions;
                    }
                }
            },
            searchByprovinceCode:function(provinceCode){
                for(let i in this.provinceList){
                    if(this.provinceList[i].id==provinceCode){
                        return this.provinceList[i].name;
                    }
                }
            },
            searchByCityCode:function(cityCode){
                for(let i in this.provinceList){
                    for(let j in this.provinceList[i].divisions){
                        if(this.provinceList[i].divisions[j].id==cityCode){
                            return this.provinceList[i].divisions[j].name;
                        }
                    }
                }
            },
            ownerStatus:function (value){
                if(value=="OWNED"){
                    return "当前车主";
                }else{
                    return "历史车主";
                }
            },
            isUndefined:function (value){
                if(value && value[0]){
                    return value[0].modelName;
                }else{
                    return "";
                }
            },
            equipmentStatus(status){
                if(status=="VALID"){
                    return "已安装";
                }else if(status=="UNINSTALLED"){
                    return "未安装";
                }else{
                    return "已报废";
                }
            },
            vehStatus(status){
                if(status=="VALID"){
                    return "有效";
                }else if(status=="RESALE"){
                    return "已转卖";
                }else{
                    return "已作废";
                }
            },
            invalidDetails:function(vehicle){
                let _this = this;
                _this.vehicleValidInfoModal.isShow = true;
                let vin = vehicle.vin;
                _this.$http.get('api/getVehByVin', {params:{vin:vin}}).then(function(data){
                    if(data.body.status=="SUCCEED" && data.body.data){
                        _this.invalidDetailsList = data.body.data;
                    }else{

                    }
                });
            },
            vehicleInfoBrandChanged(){
                let _this = this;
                let id = _this.vehicleinfo.brandId;
                let vehBrandList = _this.vehBrandList;
                if(id){
                    for(let i in vehBrandList){
                        if(vehBrandList[i].id === id){
                            _this.vehSeriesList = vehBrandList[i].vehicleSeriesList;
                        }
                    }
                }else{
                    _this.vehSeriesList = [];
                    _this.vehModelList = [];
                }
                _this.vehicleinfo.modelId = "";
                _this.vehicleinfo.seriesId = "";
            },
            vehicleInfoSeriesChanged(){
                let _this = this;
                let id = _this.vehicleinfo.seriesId;
                let vehSeriesList = _this.vehSeriesList;
                if(id){
                    for(let i in vehSeriesList){
                        if(vehSeriesList[i].id === id){
                            _this.vehModelList = vehSeriesList[i].vehicleModelList;
                        }
                    }
                }else{
                    _this.vehModelList = [];
                }
                _this.vehicleinfo.modelId = "";
            },
            getVehAttribute(){
                this.$http.get('api/getVehAttribute', {params: {}}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        this.vehAttribute = data.body.datas;
                        this.vehBrandList = data.body.datas;
                    }
                });
            },
            getVehColorList(){
                this.$http.get('api/getVehColorList').then(function(data){
                    if(data.body.status=="SUCCEED"){
                        this.vehColorList = data.body.datas;
                    }
                });
            },
            getVehTagTypeAll(){
                this.$http.get('api/getVehTagTypeAll').then(function(data){
                    if(data.body.status=="SUCCEED"){
                        this.tagTypeList = data.body.data;
                    }
                });
            },
            previewFile (e) {
                let _this = this;
                let fileTem = e.target.files[0];
                /*let supportedTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];*/
                let suffixName =  fileTem.name.split('.')[1];
                if (fileTem && (suffixName=='xls'||suffixName=='xlsx') ) {
                    this.file = fileTem;
                    this.isFileHas = false;
                } else {
                    window.alert('我们目前仅支持xlsx/xls这两种后缀名的excel文档，请注意格式！');
                    this.isFileHas = true;
                }
                if(fileTem.size>2048000){
                    this.isFileHas = true;
                    _this.alert= {
                        isShow: true,
                        content: "文件大小不建议超过2M",
                        type: "danger"
                    };
                }
            },
            clearFile () {
                this.file = null;
            },
            submitFile () {
                let _this = this;
                var form = new FormData(document.getElementById("uploadForm"));
                if (_this.file) {
                    $.ajax({
                        url:"api/importVehTag",
                        type:"post",
                        data:form,
                        processData:false,
                        contentType:false,
                        success:function(data){
                            if(data.status=='SUCCEED'){
                                _this.alert= {
                                    isShow: true,
                                    content: "导入车辆标识成功",
                                    type: "success"
                                };
                                _this.vehTagImportModal.isShow = false;
                                _this.vehicleSearchList();
                            }else if(data.errorNumber>0){
                                _this.vehTagImportResultModal.isShow = true;
                                _this.vehTagImportModal.isShow = false;
                                _this.importResult = data;
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "导入车辆标识失败，解析文件时出错",
                                    type: "danger"
                                };
                            }
                        },
                        error:function(e){
                            _this.alert= {
                                isShow: true,
                                content: "导入车辆标识失败，出现未知错误，可能是磁盘空间已满，请注意清理",
                                type: "danger"
                            };
                        }
                    });
                }
            },
            submitVehFile () {
                let _this = this;
                var form = new FormData(document.getElementById("importVehForm"));
                if (_this.file) {
                    $.ajax({
                        url:"api/importVeh",
                        type:"post",
                        data:form,
                        processData:false,
                        contentType:false,
                        success:function(data){
                            console.log(JSON.stringify(data));
                            if(data.status=='SUCCEED'){
                                _this.alert= {
                                    isShow: true,
                                    content: "导入车辆成功",
                                    type: "success"
                                };
                                _this.vehImportModal.isShow = false;
                                _this.vehicleSearchList();
                            }else if(data.errorNumber>0){
                                _this.vehImportResultModal.isShow = true;
                                _this.vehImportModal.isShow = false;
                                _this.importVehResult = data;
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "导入车辆标识失败，解析文件时出错",
                                    type: "danger"
                                };
                            }
                        },
                        error:function(e){
                            _this.alert= {
                                isShow: true,
                                content: "导入车辆标识失败，出现未知错误，可能是磁盘空间已满，请注意清理",
                                type: "danger"
                            };
                        }
                    });
                }
            }
        },
        props:["message"]
    }
</script>
