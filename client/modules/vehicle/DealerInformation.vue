<template>
    <div>
        <ul class="breadcrumb">
            <li>基础信息管理</li>
            <li>经销商信息管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline no-margin" @submit.prevent="searchVehDealerList">
                        <div class="form-group">
                            <label class="control-label label-name">条件：</label>
                            <select class="form-control input-sm" v-model="searchDealerParam.type">
                                <option v-for="type in searchTypes" v-bind:value="type.value">{{type.name}}</option>
                            </select>
                            <input type="text" class="form-control input-sm" v-model="searchDealerParam.keyword" placeholder="关键字"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">省：</label>
                            <select class="form-control input-sm" v-model="searchDealerParam.provinceCode" v-on:change="provinceChange()">
                                <option value="">全部</option>
                                <option v-for="provinceItem in provinceList" v-bind:value="provinceItem.id">{{provinceItem.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">市：</label>
                            <select class="form-control input-sm" v-model="searchDealerParam.cityCode">
                                <option value="">全部</option>
                                <option v-for="cityItem in searchCityList" v-bind:value="cityItem.id">{{cityItem.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">状态：</label>
                            <select class="form-control input-sm" v-model="searchDealerParam.status">
                                <option v-for="state in dealerStates" v-bind:value="state.value">{{state.name}}</option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="searchVehDealerList">搜索</button>
                        <button type="button" class="btn btn-sm btn-success right" v-if="message['/vehicle/dealerInformation/isDealersAdd']" v-on:click="informationadd">新增</button>
                        <button type="button" class="btn btn-sm btn-success right">导入</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="dataTable">
                <thead>
                <tr>
                    <th>经销商名称</th>
                    <th>经销商代码</th>
                    <th>经销商状态</th>
                    <th>经销商类型</th>
                    <th>品牌</th>
                    <th>省</th>
                    <th>市</th>
                    <th>地址</th>
                    <th>联系人</th>
                    <th>售后服务电话</th>
                    <th>救援电话</th>
                    <th>销售经理</th>
                    <th>销售经理电话</th>
                    <th>退网时间</th>
                    <th>备注</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="vehDealer in vehDealerList">
                    <td>{{vehDealer.name}}</td>
                    <td>{{vehDealer.code}}</td>
                    <td v-text="dealerStateFilter(vehDealer.status)"></td>
                    <td v-text="vehDealer.dealerType.indexOf('4')>-1?'经销商':'服务站'"></td>
                    <td>{{vehDealer.brandName}}</td>
                    <td v-text="searchByprovinceCode(vehDealer.provinceCode)"></td>
                    <td v-text="searchByCityCode(vehDealer.cityCode)"></td>
                    <td >{{vehDealer.address}}</td>
                    <td>{{vehDealer.contactName}}</td>
                    <td>{{vehDealer.afterSalePhone}}</td>
                    <td>{{vehDealer.rescuePhone}}</td>
                    <td>{{vehDealer.saleName}}</td>
                    <td>{{vehDealer.salePhone}}</td>
                    <td>{{vehDealer.closeTime | activeDateFilter}}</td>
                    <td>{{vehDealer.remark}}</td>
                    <td>
                        <i-button type="ghost" size="small" icon="android-delete" v-if="message['/vehicle/dealerInformation/isDealerNetwork'] && vehDealer.status=='ACTIVE'?true:false" @click="networkLeave(vehDealer)">退网</i-button>
                        <i-button type="ghost" size="small" icon="document-text" @click="informationDetails(vehDealer)">详情</i-button>
                        <i-button type="ghost" size="small" icon="edit" v-if="message['/vehicle/dealerInformation/isDealerEdit']" @click="informationEdit(vehDealer)">编辑</i-button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="searchDealerParam.pageIndex" :page-size="searchDealerParam.pageSize"
                          :total="searchDealerParamPage.totalCount" :max-link="searchDealerParamPage.maxLink"
                          :page-handler="pageHandler"></zpagenav>
            </div>
        </div>
        <!--详情-->
        <modal v-model="dealerInfoModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="dealerInfoModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">
                    经销商详情
                    <span :class='vehDealer.closeTime?"is-danger":""'>( {{ vehDealer.closeTime?"已退网":"在网" }} )</span>
                </h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal" role="form">
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label">名称：</label>
                        <div class="col-md-6 col-sm-6 vehicle-info-text">
                            {{vehDealer.name}}
                        </div>
                        <div class="col-md-2 col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label">开业时间：</label>
                        <div class="col-md-6 col-sm-6 vehicle-info-text">
                            {{vehDealer.openTime | activeDateFilter}}
                        </div>
                        <div class="col-md-2 col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label">退网时间：</label>
                        <div class="col-md-6 col-sm-6 vehicle-info-text">
                            {{vehDealer.closeTime | activeDateFilter}}
                        </div>
                        <div class="col-md-2 col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label">联系人：</label>
                        <div class="col-md-6 col-sm-6 vehicle-info-text">
                            {{vehDealer.contactName}}
                        </div>
                        <div class="col-md-2 col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label">联系人电话：</label>
                        <div class="col-md-6 col-sm-6 vehicle-info-text">
                            {{vehDealer.contactPhone}}
                        </div>
                        <div class="col-md-2 col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label">电子邮件：</label>
                        <div class="col-md-6 col-sm-6 vehicle-info-text">
                            {{vehDealer.email}}
                        </div>
                        <div class="col-md-2 col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label">经销商位置经度：</label>
                        <div class="col-md-6 col-sm-6 vehicle-info-text">
                            {{vehDealer.longitude}}
                        </div>
                        <div class="col-md-2 col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 col-sm-4 control-label">经销商位置纬度：</label>
                        <div class="col-md-6 col-sm-6 vehicle-info-text">
                            {{vehDealer.latitude}}
                        </div>
                        <div class="col-md-2 col-sm-2"></div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" v-on:click="dealerInfoModal.isShow=false">关闭</button>
            </div>
        </modal>
        <!--新增-->
        <modal v-model="dealerAddModal.isShow" :backdrop="false" large>
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="dealerAddCancel"><span>×</span></button>
                <h4 class="modal-title">{{dealerInfoAddOrEditShow}}经销商</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal" role="form" novalidate data-vv-scope="dealerInfoForm">
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label for="brand" class="col-md-4 col-sm-4 control-label label-name">品牌：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <select class="form-control form-control-line input-sm brandValue" name="brandValue" id="brand"
                                v-validate="'required'" data-vv-as="品牌" :class="{'select': true, 'is-danger': errors.has('dealerInfoForm.brandValue') }">
                                    <i v-show="errors.has('dealerInfoForm.brandValue')" class="fa fa-warning"></i>
                                    <option value="">请选择</option>
                                    <option v-for="brand in vehAttributeList" v-bind:value="brand.id">{{brand.name}}</option>
                                </select>
                                <span v-show="errors.has('dealerInfoForm.brandValue')" class="help is-danger">{{ errors.first('dealerInfoForm.brandValue') }}</span>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="name" class="col-md-4 col-sm-4 control-label label-name">经销商名称：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input
                                v-validate="'required|max:45'" name="newname" data-vv-as="名称" :class="{'input': true, 'is-danger': errors.has('dealerInfoForm.newname') }"
                                 type="text" class="form-control form-control-line input-sm newname" id="name" :disabled="dealerInfoAddOrEditShow=='编辑'?true:false"/>
                                 <i v-show="errors.has('dealerInfoForm.newname')" class="fa fa-warning"></i>
                                <span v-show="errors.has('dealerInfoForm.newname')" class="help is-danger">{{ errors.first('dealerInfoForm.newname')}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label for="code" class="col-md-4 col-sm-4 control-label label-name">经销商代码：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input
                                v-validate="'required|max:45'" name="dealerCode" data-vv-as="经销商代码" :class="{'input': true, 'is-danger': errors.has('dealerInfoForm.dealerCode') }"
                                 type="text" class="form-control form-control-line input-sm dealerCode" id="code" :disabled="dealerInfoAddOrEditShow=='编辑'?true:false"/>
                                 <i v-show="errors.has('dealerInfoForm.dealerCode')" class="fa fa-warning"></i>
                                <span v-show="errors.has('dealerInfoForm.dealerCode')" class="help is-danger">{{ errors.first('dealerInfoForm.dealerCode')}}</span>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="contactName" class="col-md-4 col-sm-4 control-label label-name">联系人：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input type="text" class="form-control form-control-line input-sm" id="contactName"  v-model="addVehDealerParam.contactName"/>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label class="col-md-4 col-sm-4 control-label label-name">销售经理电话：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input type="text"
                                v-validate="'min:6|max:12'" name="dealerSalePhone" data-vv-as="销售经理电话" :class="{'input': true, 'is-danger': errors.has('dealerInfoForm.dealerSalePhone') }"
                                 class="form-control form-control-line input-sm" v-model="dealerSalePhone"/>
                                 <i v-show="errors.has('dealerInfoForm.dealerSalePhone')" class="fa fa-warning"></i>
                                <span v-show="errors.has('dealerInfoForm.dealerSalePhone')" class="help is-danger">{{ errors.first('dealerInfoForm.dealerSalePhone')}}</span>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="email" class="col-md-4 col-sm-4 control-label label-name">电子邮件：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input
                                name="dealerEmail" 
                                :class="['input form-control form-control-line input-sm',emailShow?'is-danger':'']"
                                type="text"
                                id="email"  
                                v-model="dealerEmail"
                                @keyup='reqTest(dealerEmail,"email")'
                                @blur='reqTest(dealerEmail,"email")'
                                />
                                 
                                 <i v-show="emailShow" class="fa fa-warning"></i>
                                <span v-show="emailShow" class="help is-danger">
                                    请输入正确的邮箱
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label class="col-md-4 col-sm-4 control-label label-name">售后服务电话：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input type="text"
                                       v-validate="'required|min:6|max:12'" name="dealerAfterSalePhone" data-vv-as="售后服务电话" :class="{'input': true, 'is-danger': errors.has('dealerInfoForm.dealerAfterSalePhone') }"
                                       class="form-control form-control-line input-sm dealerAfterSalePhone" v-if="message['/vehicle/dealerInformation/isSalesManagerInfo']"/>
                                <input type="text"
                                       v-validate="'min:6|max:12'" name="dealerAfterSalePhone" data-vv-as="售后服务电话" :class="{'input': true, 'is-danger': errors.has('dealerInfoForm.dealerAfterSalePhone') }"
                                       class="form-control form-control-line input-sm dealerAfterSalePhone" v-if="!message['/vehicle/dealerInformation/isSalesManagerInfo']"/>
                                 <i v-show="errors.has('dealerInfoForm.dealerAfterSalePhone')" class="fa fa-warning"></i>
                                <span v-show="errors.has('dealerInfoForm.dealerAfterSalePhone')" class="help is-danger">{{ errors.first('dealerInfoForm.dealerAfterSalePhone')}}</span>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="phone" class="col-md-4 col-sm-4 control-label label-name">救援电话：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input
                                v-validate="'min:6|max:12'" name="dealerRescuePhone" data-vv-as="救援电话" :class="{'input': true, 'is-danger': errors.has('dealerInfoForm.dealerRescuePhone') }"
                                 type="text" class="form-control form-control-line input-sm" id="phone"  v-model="dealerRescuePhone"/>
                                 <i v-show="errors.has('dealerInfoForm.dealerRescuePhone')" class="fa fa-warning"></i>
                                <span v-show="errors.has('dealerInfoForm.dealerRescuePhone')" class="help is-danger">{{ errors.first('dealerInfoForm.dealerRescuePhone')}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label class="col-md-4 col-sm-4 control-label label-name">开业时间：</label>
                            <div class="col-md-8 col-sm-8">
                                <date-picker :confirm="true" class="float-l" v-model="openTime" type="datetime" placeholder="开业时间" style="width: 283px"></date-picker>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="phone" class="col-md-4 col-sm-4 control-label label-name">联系人电话：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input
                                v-validate="'min:6|max:12'" name="dealerContactPhone" data-vv-as="联系人电话" :class="{'input': true, 'is-danger': errors.has('dealerInfoForm.dealerContactPhone') }"
                                 type="text" class="form-control form-control-line input-sm" id="contactPhone"  v-model="dealerContactPhone"/>
                                 <i v-show="errors.has('dealerInfoForm.dealerContactPhone')" class="fa fa-warning"></i>
                                <span v-show="errors.has('dealerInfoForm.dealerContactPhone')" class="help is-danger">{{ errors.first('dealerInfoForm.dealerContactPhone')}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label for="longitude" class="col-md-4 col-sm-4 control-label label-name">经度：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input
                                name="dealerLongitude" 
                                :class="['input form-control form-control-line input-sm',dealerLongitudeShow?'is-danger':'']"
                                type="text"
                                id="longitude"  
                                @keyup='reqTest(dealerLongitude,"dealerLongitude")'
                                @blur='reqTest(dealerLongitude,"dealerLongitude")'
                                v-model="dealerLongitude"/>
                                 <i v-show="dealerLongitudeShow" class="fa fa-warning"></i>
                                <span v-show="dealerLongitudeShow" class="help is-danger">
                                    经度必须是数字且范围-180~+180
                                </span>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="latitude" class="col-md-4 col-sm-4 control-label label-name">纬度：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input
                                name="dealerLatitude" 
                                :class="['input form-control form-control-line input-sm',dealerLatitudeShow?'is-danger':'']"
                                type="text" 
                                id="latitude"  
                                v-model="dealerLatitude"
                                @keyup='reqTest(dealerLatitude,"dealerLatitude")'
                                @blur='reqTest(dealerLatitude,"dealerLatitude")'
                                />
                                <i v-show="dealerLatitudeShow" class="fa fa-warning"></i>
                                <span v-show="dealerLatitudeShow" class="help is-danger">纬度必须是数字且范围-90~+90</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label for="longitude" class="col-md-4 col-sm-4 control-label label-name">省份：</label>
                            <div class="col-md-8 col-sm-8">
                                <select class="form-control form-control-line" v-model="addVehDealerParam.provinceCode" v-on:change="provinceChange">
                                    <option value="">--请选择--</option>
                                    <option v-for="provinceitem in provinceList" v-bind:value="provinceitem.id">{{provinceitem.name}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="latitude" class="col-md-4 col-sm-4 control-label label-name">城市：</label>
                            <div class="col-md-8 col-sm-8">
                                <select class="form-control form-control-line" v-model="addVehDealerParam.cityCode" v-on:change="cityChange">
                                    <option value="">--请选择--</option>
                                    <option v-for="cityitem in addCityList" v-bind:value="cityitem.id">{{cityitem.name}}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label for="longitude" class="col-md-4 col-sm-4 control-label label-name">区：</label>
                            <div class="col-md-8 col-sm-8">
                                <select class="form-control form-control-line" v-model="addVehDealerParam.districtCode">
                                    <option value="">--请选择--</option>
                                    <option v-for="areaitem in areaList" v-bind:value="areaitem.id">{{areaitem.name}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="latitude" class="col-md-4 col-sm-4 control-label label-name">销售经理：</label>
                            <div class="col-md-8 col-sm-8">
                                <input type="text" class="form-control form-control-line input-sm"  v-model="addVehDealerParam.saleName"/>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label for="address" class="col-md-4 col-sm-4 control-label label-name">详细地址：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input
                                v-validate="'max:45'" name="dealerAddress" data-vv-as="详细地址" :class="{'input': true, 'is-danger': errors.has('dealerInfoForm.dealerAddress') }"
                                 type="text" class="form-control form-control-line input-sm" id="address"  v-model="dealerAddress"/>
                                 <i v-show="errors.has('dealerInfoForm.dealerAddress')" class="fa fa-warning"></i>
                                <span v-show="errors.has('dealerInfoForm.dealerAddress')"
                                class="help is-danger">{{ errors.first('dealerInfoForm.dealerAddress') }}</span>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label class="col-md-4 col-sm-4 control-label label-name">父级经销商：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <v-select class="dealerlist" style="width:283px;" v-model="dealerName" :options="allgetVehDealerList" options-value="id"
                                          placeholder="请选择"
                                          options-label="name" search-text="请输入" search
                                          :disabled="dealerInfoAddOrEditShow=='编辑'?true:false"
                                ></v-select>
                                <i v-show="parentDealersTips?true:false" class="fa fa-warning"></i>
                                <span v-show="parentDealersTips?true:false" class="help is-danger">父级经销商为必填项</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label for="address" class="col-md-4 col-sm-4 control-label label-name">经销商类型：</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <select class="form-control form-control-line" v-model="addVehDealerParam.dealerType" :disabled="dealerInfoAddOrEditShow=='编辑'?true:false">
                                    <option value="4S">经销商</option>
                                    <option value="2S">服务站</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">经销商备注：</label>
                        <div class="col-md-10 col-sm-10 has-icon has-icon-right">
                            <textarea
                            v-validate="'max:40'" name="dealerRemark" data-vv-as="经销商备注" :class="{'textarea': true, 'is-danger': errors.has('dealerInfoForm.dealerRemark') }"
                             rows="3" cols="20" class="form-control form-control-line" v-model="dealerRemark"></textarea>
                             <i v-show="errors.has('dealerInfoForm.dealerRemark')" class="fa fa-warning"></i>
                            <span v-show="errors.has('dealerInfoForm.dealerRemark')" class="help is-danger">{{ errors.first('dealerInfoForm.dealerRemark') }}</span>
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="dealerAddCancel">取消</button>
                <button type="button" class="btn btn-success" v-show="dealerInfoAddOrEditShow=='新增'?true:false" @click="informationAddCall('dealerInfoForm')" :disabled="isPassVali">确定</button>
                <button type="button" class="btn btn-success" v-show="dealerInfoAddOrEditShow=='编辑'?true:false" @click="informationEditCall('dealerInfoForm')" :disabled="isPassVali">确定</button>
            </div>
        </modal>
        <!--退网确认-->
        <modal v-model="networkModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="networkModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">退网确认</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <p>{{networkInfo.name}}确认要退网吗？</p>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="networkModal.isShow = false">取消</button>
                <button type="button" class="btn btn-success" @click="networkLeaveCall">确定</button>
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
    .form-line-validator{
        width:50%;
        float:left;
    }
    .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{
        padding-left:8px !important;
        padding-right:8px !important;
    }
    .vehicle-info-text{
        line-height:34px;
    }
</style>
<script>
    import { tabs, tab ,modal,alert,select} from 'vue-strap';
    import datePicker from 'iview/src/components/date-picker';
    export default{
        data(){
            return{
                emailShow:false,/*邮箱*/
                dealerLongitudeShow:false,/*经度*/
                dealerLatitudeShow:false,/*纬度*/
                dealerAddModal: {
                    isShow: false
                },
                dealerInfoModal: {
                    isShow: false
                },
                networkModal:{
                    isShow:false
                },
                networkInfo:{
                    name:"",
                    id:""
                },
                isCall:false,
                allgetVehDealerList:[],
                openTime:null,
                closeTime:null,
                dealerInfoAddOrEditShow:"新增",
                dealerName:"",
                parentDealerName:"",
                parentDealerNameOrg:"",
                name:"",
                parentDealerCode:"",
                parentDealerId:"",
                provinceList:{},
                searchCityList:{},
                addCityList:{},
                areaList:"",
                timeTips:"退网时间需大于开业时间",
                timeCompare:false,
                brandValue: "",
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
                },
                dealerStates:[
                    {
                        value:"",
                        name:"全部"
                    },
                    {
                        value:"ACTIVE",
                        name:"在网"
                    },
                    {
                        value:"INACTIVE",
                        name:"退网"
                    }
                ],
                searchTypes:[
                    {
                        value: "name",
                        name: "经销商名称"
                    },
                    {
                        value: "code",
                        name: "经销商代码"
                    },
                    {
                        value: "brandName",
                        name: "品牌"
                    }
                ],
                searchDealerParam: {
                    type: "name",
                    keyword: "",
                    pageIndex: 1,
                    pageSize: 10,
                    provinceCode :"",
                    cityCode :"",
                    status :""
                },
                searchDealerParamPage:{
                    maxLink: 5,
                    totalCount: 0
                },
                vehDealerList: [],
                vehDealer: {},
                vehAttributeList: [],
                vehAttribute: {
                    brand: ""
                },
                addVehDealerParam:{
                    id: 0,
                    allChildrenDealerNum: 0,
                    allChildrenDealerVehNum: 0,
                    address: "",
                    afterSalePhone: "",
                    brandId: "",
                    brandName: "",
                    cityCode: "",
                    districtCode:"",
                    closeTime: "",
                    code: "",
                    code2: "",
                    countryCode: "",
                    countyCode: "",
                    dealerType: "4S",
                    email: "",
                    imageUrl: "",
                    latitude: "",
                    longitude: "",
                    name: "",
                    openTime: null,
                    parentId: "",
                    provinceCode: "",
                    remark: "",
                    rescuePhone: "",
                    salePhone: "",
                    saleName:"",
                    status: "ACTIVE",
                    parentName:"",
                    contactPhone:"",
                    contactName:""
                },
                allgetVehDealerList:[],
                dealerTypes: [
                    {
                        value: "4S",
                        name: "4S店"
                    },
                    {
                        value: "2S",
                        name: "2S店"
                    },
                    {
                        value: "REPAIR_SITE",
                        name: "修理站"
                    },
                    {
                        value: "VIRTUAL",
                        name: "虚拟"
                    }
                ],
                dealerCode :"",
                dealerSalePhone:"",
                dealerEmail :"",
                dealerAfterSalePhone:"",
                dealerRescuePhone:"",
                dealerContactPhone:"",
                dealerLongitude:"",
                dealerLatitude:"",
                dealerAddress:"",
                dealerRemark:"",
                newname:""
            }
        },
        computed:{
            isPassVali(){
                let _this = this;
                let isDealerMust = _this.message['/vehicle/dealerInformation/isParentDealers'];
                if(isDealerMust){
                    if(_this.dealerName){
                        return true;
                    }else{
                        return _this.errors.any('dealerInfoForm');
                    }
                }else{
                    return _this.errors.any('dealerInfoForm');
                }
            },
            parentDealersTips(){
                let _this = this;
                let isDealerMust = _this.message['/vehicle/dealerInformation/isParentDealers'];
                if(isDealerMust){
                    if(_this.dealerName){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        },
        components: {
            tabs,
            tab,
            modal,
            alert,
            datePicker,
            vSelect: select
        },
        methods: {
            reqTest(value,type){
                let reqEmail = /^[a-zA-Z][\w.-]*@[a-zA-Z0-9][\w-]*\.(?:com|cn)$/;
                let reqLongi = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,4})?)|180(([.][0]{1,4})?))$/;
                let reqLati = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/;
                switch(type){
                    case 'email' : 
                        if( reqEmail.test(value) ){
                            this.emailShow=false;
                        }else{
                            this.emailShow=true;
                        };
                        break;
                    case 'dealerLongitude':
                        if( reqLongi.test(value) ){
                            this.dealerLongitudeShow=false;
                        }else{
                            this.dealerLongitudeShow=true;
                        };
                        break;
                    case 'dealerLatitude':
                        if( reqLati.test(value) ){
                            this.dealerLatitudeShow=false;
                        }else{
                            this.dealerLatitudeShow=true;
                        };
                        break;    
                    default : return;    
                }
                


            },
            getVehDealerListAll(){
                let _this = this;
                _this.$http.get('api/getVehDealerList',{params:{pageAll:true,status:'ACTIVE'}}).then(function(res){
                    if(res.body.status){
                        _this.allgetVehDealerList = res.body.datas;
                    }
                });
            },
            dealerAddCancel(){
                this.dealerAddModal.isShow=false;
                this.errors.clear('dealerInfoForm');
            },
            getVehDealerList(){
                let _this = this;
                _this.$http.get('api/getVehDealerList', { params: _this.searchDealerParam }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehDealerList = data.body.datas;
                        _this.searchDealerParam.pageIndex = data.body.pageIndex;
                        _this.searchDealerParamPage.totalCount = data.body.totalCount;
                    }
                });
            },
            networkLeave(vehdealer){
                let _this = this;
                _this.networkModal.isShow = true;
                _this.networkInfo = {
                    name:vehdealer.name,
                    id:vehdealer.id
                };
            },
            networkLeaveCall(){
                let _this = this;
                _this.$http.post('api/withdrawNetWork', { dealerId: _this.networkInfo.id }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.networkModal.isShow = false;
                        _this.getVehDealerList();
                        _this.alert= {
                            isShow: true,
                            content: "经销商退网成功",
                            type: "success"
                        };
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "经销商退网失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            getParentDealer(){
                let _this = this;
                let isArray = true;
                if(_this.message['/vehicle/dealerInformation/isParentDealers']){
                    _this.$http.get('api/findOrgById', {}).then(function(result){
                        if(result.body.status && result.body.orgs){
                            isArray = Array.isArray(result.body.orgs);
                            if(isArray){
                                _this.parentDealerName = result.body.orgs[0].name;
                                _this.parentDealerNameOrg = result.body.orgs[0].name;
                                _this.parentDealerCode = result.body.orgs[0].code;
                                _this.parentDealerId = result.body.orgs[0]._id;
                            }else{
                                _this.parentDealerName = result.body.orgs.name;
                                _this.parentDealerNameOrg = result.body.orgs.name;
                                _this.parentDealerCode = result.body.orgs.code;
                                _this.parentDealerId = result.body.orgs._id;
                            }
                        }else{
                            console.log("异步获取数据出现异常。");
                        }
                    });
                }
            },
            addParentDealer(parentCode,code,name){
                let _this = this;
                _this.$http.post('api/addOrgByDealer', {parentCode:parentCode,code:code,name:name,isParent:true}).then(function(result){
                    if(result.body.status){

                    }else{

                    }
                });
            },
            getProvinceList(){
                let _this = this;
                _this.$http.get('api/findProvincesAndCities',{params:{keywords: "中国", level: "COUNTRY", sub: 3}}).then(function(res){
                    if(res.body.status && res.body.data[0]){
                        _this.provinceList = res.body.data[0].divisions;
                    }
                });
            },
            searchVehDealerList(){
                let _this = this;
                _this.searchDealerParam.pageIndex = 1;
                _this.getVehDealerList();
            },
            pageHandler(pageIndex){
                let _this = this;
                _this.searchDealerParam.pageIndex = pageIndex;
                _this.getVehDealerList();
            },
            informationadd(){
                let _this = this;
                if(!_this.isCall){
                    _this.getVehDealerListAll();
                }
                _this.isCall = !_this.isCall;
                _this.dealerInfoAddOrEditShow="新增";
                _this.openTime = null;
                _this.addVehDealerParam = {};
                _this.addVehDealerParam.dealerType = "4S";
                _this.dealerName = "";
                _this.dealerCode ="";
                _this.dealerSalePhone = "";
                _this.dealerEmail  = "";
                _this.dealerAfterSalePhone = "";
                _this.dealerRescuePhone = "";
                _this.dealerContactPhone = "";
                _this.dealerLongitude = "";
                _this.dealerLatitude = "";
                _this.dealerAddress = "";
                _this.dealerRemark = "";
                $(".brandValue").val('');
                $(".newname").val('');
                $(".dealerCode").val('');
                $(".dealerAfterSalePhone").val('');
                _this.dealerAddModal.isShow = true;
            },
            informationAddCall(scope){
                let _this = this;
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.addVehDealerParam.parentId = _this.dealerName;
                        _this.addVehDealer();
                    })
                }
            },
            addVehDealer(){
                let code;
                let _this = this;
                _this.addVehDealerParam.allChildrenDealerNum = 0;
                _this.addVehDealerParam.allChildrenDealerVehNum = 0;
                _this.addVehDealerParam.status = "ACTIVE";
                _this.addVehDealerParam.openTime = _this.openTime;
                _this.addVehDealerParam.salePhone = _this.dealerSalePhone;
                _this.addVehDealerParam.email = _this.dealerEmail;
                _this.addVehDealerParam.rescuePhone = _this.dealerRescuePhone;
                _this.addVehDealerParam.contactPhone = _this.dealerContactPhone;
                _this.addVehDealerParam.longitude = _this.dealerLongitude;
                _this.addVehDealerParam.latitude = _this.dealerLatitude;
                _this.addVehDealerParam.address = _this.dealerAddress;
                _this.addVehDealerParam.remark = _this.dealerRemark;
                _this.addVehDealerParam.name = $(".newname").val();
                _this.addVehDealerParam.brandId = $(".brandValue").val();
                _this.addVehDealerParam.code = $(".dealerCode").val();
                _this.addVehDealerParam.afterSalePhone = $(".dealerAfterSalePhone").val();
                _this.$http.post('api/addVehDealer', _this.addVehDealerParam).then(function(reponse){
                    var result = reponse.body;
                    if(result.status == "SUCCEED"){
                        code = result.data.id;
                        _this.dealerAddModal.isShow = false;
                        _this.searchVehDealerList();
                        if(_this.isParentDealers){
                            _this.addParentDealer(_this.addVehDealerParam.parentId,code,_this.newname);
                        }
                        _this.alert= {
                            isShow: true,
                            content: "新增经销商成功",
                            type: "success"
                        };
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "新增经销商失败,"+result.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            informationEditCall(scope){
                let _this = this;
                let code;
                _this.addVehDealerParam.parentId = _this.parentDealerCode;
                _this.addVehDealerParam.openTime = _this.openTime;
                _this.addVehDealerParam.allChildrenDealerNum = 0;
                _this.addVehDealerParam.allChildrenDealerVehNum = 0;
                _this.addVehDealerParam.salePhone = _this.dealerSalePhone;
                _this.addVehDealerParam.email = _this.dealerEmail;
                _this.addVehDealerParam.rescuePhone = _this.dealerRescuePhone;
                _this.addVehDealerParam.contactPhone = _this.dealerContactPhone;
                _this.addVehDealerParam.longitude = _this.dealerLongitude;
                _this.addVehDealerParam.latitude = _this.dealerLatitude;
                _this.addVehDealerParam.address = _this.dealerAddress;
                _this.addVehDealerParam.remark = _this.dealerRemark;
                _this.addVehDealerParam.parentId = _this.dealerName;
                _this.addVehDealerParam.name = $(".newname").val();
                _this.addVehDealerParam.brandId = $(".brandValue").val();
                _this.addVehDealerParam.code = $(".dealerCode").val();
                _this.addVehDealerParam.afterSalePhone = $(".dealerAfterSalePhone").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateVehDealer', _this.addVehDealerParam).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                code = result.data;
                                _this.dealerAddModal.isShow = false;
                                _this.searchVehDealerList();
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑经销商成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑经销商失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            informationEdit(vehDealer){
                let _this = this;
                _this.dealerAddModal.isShow = true;
                _this.dealerInfoAddOrEditShow="编辑";
                _this.addVehDealerParam = {
                    id: vehDealer.id,
                    allChildrenDealerNum: vehDealer.allChildrenDealerNum,
                    allChildrenDealerVehNum: vehDealer.allChildrenDealerVehNum,
                    address: vehDealer.address,
                    afterSalePhone: vehDealer.afterSalePhone,
                    brandId: vehDealer.brandId,
                    brandName: vehDealer.brandName,
                    cityCode: vehDealer.cityCode,
                    districtCode:vehDealer.districtCode,
                    closeTime: vehDealer.closeTime,
                    code: vehDealer.code,
                    code2: "",
                    countryCode: vehDealer.countryCode,
                    countyCode: vehDealer.countyCode,
                    dealerType: vehDealer.dealerType.toUpperCase(),
                    email: vehDealer.email,
                    imageUrl: "",
                    latitude: vehDealer.latitude,
                    longitude: vehDealer.longitude,
                    name: vehDealer.name,
                    openTime: vehDealer.openTime,
                    parentId: vehDealer.parentId,
                    provinceCode: vehDealer.provinceCode,
                    remark: vehDealer.remark,
                    rescuePhone: vehDealer.rescuePhone,
                    salePhone: vehDealer.salePhone,
                    saleName: vehDealer.saleName,
                    status: vehDealer.status,
                    parentName:vehDealer.parentName,
                    contactPhone:vehDealer.contactPhone,
                    contactName:vehDealer.contactName
                };
                _this.openTime = vehDealer.openTime?new Date(vehDealer.openTime) : null;
                _this.dealerName = vehDealer.parentId;
                _this.parentDealerCode = vehDealer.parentId;
                _this.dealerSalePhone = vehDealer.salePhone;
                _this.dealerEmail  = vehDealer.email;
                _this.dealerRescuePhone = vehDealer.rescuePhone;
                _this.dealerContactPhone = vehDealer.contactPhone;
                _this.dealerLongitude = vehDealer.longitude;
                _this.dealerLatitude = vehDealer.latitude;
                _this.dealerAddress = vehDealer.address;
                _this.dealerRemark = vehDealer.remark;
                $(".brandValue").val(vehDealer.brandId);
                $(".newname").val(vehDealer.name);
                $(".dealerCode").val(vehDealer.code);
                $(".dealerAfterSalePhone").val(vehDealer.afterSalePhone);
            },
            informationDetails(vehDealer){
                this.vehDealer = vehDealer;
                this.dealerInfoModal.isShow = true;
            },
            onOpenTimeChanged(newEnd){
                if(this.closeTime!=""){
                    this.timeCompare=this.closeTime>this.openTime;
                }
                this.addVehDealerParam.openTime = this.openTime;
            },
            onCloseTimeChanged(newEnd){
                this.timeCompare=this.closeTime>this.openTime;
                this.addVehDealerParam.closeTime = this.closeTime;
            },
            dealerStateFilter(dealerState){
                if(dealerState=="ACTIVE"){
                    return "在网";
                }else{
                    return "退网";
                }
            },
            provinceChange:function(){
                this.searchCityList={};
                this.addCityList={};
                for(let i in this.provinceList){
                    if(this.provinceList[i].id==this.addVehDealerParam.provinceCode){
                        this.addCityList=this.provinceList[i].divisions;
                    }
                }

                for(let i in this.provinceList){
                    if(this.provinceList[i].id==this.searchDealerParam.provinceCode){
                        this.searchCityList=this.provinceList[i].divisions;
                    }
                }
            },
            cityChange:function(){
                this.areaList={};
                for(let j in this.addCityList){
                    if(this.addCityList[j].id==this.addVehDealerParam.cityCode){
                        this.areaList=this.addCityList[j].divisions;
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
            getVehAttribute:function (){
                let _this = this;
                _this.getVehDealerList();
                _this.$http.get('api/getVehAttribute', {params: {}}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehAttributeList = data.body.datas;
                    }
                });
            }
        },
        created() {
            let _this = this;
            _this.getVehAttribute();
            _this.getProvinceList();
            _this.getParentDealer();
        },
        props:["message"]
    }

</script>
