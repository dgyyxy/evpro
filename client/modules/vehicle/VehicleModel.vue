<template>
    <div class="model-container">
        <ul class="breadcrumb">
            <li>基础信息管理</li>
            <li>车型信息管理</li>
        </ul>
        <div class="tab-container">
            <tabs >
                <tab header="品牌">
                    <div class="smart-widget">
                        <div class="smart-widget-inner">
                            <div class="smart-widget-body">
                                <form class="form-inline no-margin" @submit.prevent="brandSearch">
                                    <div class="form-group" style="width:100%;">
                                        <label class="control-label">品牌:</label>
                                        <input type="text" class="form-control input-sm m-right-lg" v-model="searchBrand.keyword"/>
                                        <button type="button" class="btn btn-sm btn-success" v-on:click="brandSearch()">搜索</button>
                                        <button type="button" class="btn btn-sm btn-success right" v-if="message['/vehicle/vehicleModel/isVehBrandAdd']" v-on:click="addBrand()">新增</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="data-table table-responsive">
                        <table class="table table-bordered" id="dataTable1">
                            <thead>
                            <tr>
                                <th>品牌</th>
                                <th>品牌代码</th>
                                <th>备注</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="brandItem in brandList">
                                <td>{{brandItem.name}}</td>
                                <td>{{brandItem.code}}</td>
                                <td>{{brandItem.remark}}</td>
                                <td>
                                    <i-button type="ghost" size="small" icon="edit" v-if="message['/vehicle/vehicleModel/isVehBrandEdit']"  @click="brandEdit(brandItem)">编辑</i-button>
                                    <i-button type="ghost" size="small" icon="android-delete" v-if="message['/vehicle/vehicleModel/isVehBrandDel']" @click="brandDel(brandItem)">删除</i-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination-row clearfix">
                        <div class="pull-right pull-left-sm">
                            <zpagenav :page="searchBrand.pageIndex" :page-size="searchBrand.pageSize" :total="searchBrand.totalCount" :max-link="maxLink" :page-handler="brandPageHandler"></zpagenav>
                        </div>
                    </div>
                    <!--品牌-新增-->
                    <modal v-model="brandAddModal.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="brandAddCancel"><span>×</span></button>
                            <h4 class="modal-title">{{brandModalTitle}}品牌</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <form class="form-horizontal" role="form" novalidate data-vv-scope="brandParamsVali">
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">品牌代码：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input type="text" class="form-control input-sm hide" v-model="brandParams.id"/>
                                       <input type="text" class="form-control input-sm brandcode" placeholder="" v-validate="'required|max:10'" name="brandcode" data-vv-as="品牌代码" :class="{'input': true, 'is-danger': errors.has('brandParamsVali.brandcode') }"/>
                                         <i v-show="errors.has('brandParamsVali.brandcode')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('brandParamsVali.brandcode')" class="help is-danger">{{ errors.first('brandParamsVali.brandcode') }}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">品牌名称：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input type="text" v-validate="'required|max:10'"
                                        :class="{'input': true, 'is-danger': errors.has('brandParamsVali.brandname') }"
                                        class="form-control input-sm brandname" name="brandname" data-vv-as="品牌名称"/>
                                        <i v-show="errors.has('brandParamsVali.brandname')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('brandParamsVali.brandname')" class="help is-danger">{{ errors.first('brandParamsVali.brandname') }}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">备注：</label>
                                    <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                        <textarea
                                         v-validate="'max:40'" name="brandremark" data-vv-as="备注" :class="{'textarea': true, 'is-danger': errors.has('brandParamsVali.brandremark') }"
                                         rows="2" cols="20" class="form-control brandremark" id="remark" placeholder=""></textarea>
                                         <i v-show="errors.has('brandParamsVali.brandremark')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('brandParamsVali.brandremark')" class="help is-danger">{{ errors.first('brandParamsVali.brandremark') }}</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="brandAddCancel">取消</button>
                            <button type="button" class="btn btn-success" @click="brandAddCall('brandParamsVali')" v-show="brandModalTitle=='新增'?true:false" :disabled="errors.any('brandParamsVali')">确定</button>
                            <button type="button" class="btn btn-success" @click="brandEditCall('brandParamsVali')" v-show="brandModalTitle=='编辑'?true:false" :disabled="errors.any('brandParamsVali')">确定</button>
                        </div>
                    </modal>
                    <!-- 品牌-删除-->
                    <modal v-model="brandDelModal.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="brandDelModal.isShow=false"><span>×</span></button>
                            <h4 class="modal-title">删除确认</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <p>您确定要删除品牌{{brandDelList.name}}?</p>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="brandDelModal.isShow = false">取消</button>
                            <button type="button" class="btn btn-success" @click="brandDelCall">确定</button>
                        </div>
                    </modal>
                </tab>
                <tab header="车系">
                    <div class="smart-widget">
                        <div class="smart-widget-inner">
                            <div class="smart-widget-body">
                                <form class="form-inline no-margin" @submit.prevent="searchSeriesCall">
                                    <div class="form-group" style="width:100%;">
                                        <label class="control-label">品牌:</label>
                                        <select class="form-control input-sm m-right-lg" v-model="searchSeries.brandId">
                                            <option value="">--请选择--</option>
                                            <option v-for="brandItem in brandListAll" v-bind:value="brandItem.id">{{brandItem.name}}</option>
                                        </select>
                                        <label class="control-label">车系名称:</label>
                                        <input type="text" class="form-control input-sm m-right-lg" v-model="searchSeries.keyword"/>
                                        <button type="button" class="btn btn-sm btn-success" v-on:click="searchSeriesCall">搜索</button>
                                        <button type="button" class="btn btn-sm btn-success right" v-if="message['/vehicle/vehicleModel/isVehSeriesAdd']" v-on:click="addSeries">新增</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="data-table table-responsive">
                        <table class="table table-bordered" id="dataTable2">
                            <thead>
                            <tr>
                                <th>品牌</th>
                                <th>车系名称</th>
                                <th>车系代码</th>
                                <th>备注</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="vehSeriesItem in vehSeriesList">
                                <td>{{vehSeriesItem.brandName}}</td>
                                <td>{{vehSeriesItem.name}}</td>
                                <td>{{vehSeriesItem.code}}</td>
                                <td>{{vehSeriesItem.remark}}</td>
                                <td>
                                    <i-button type="ghost" size="small" icon="edit" v-if="message['/vehicle/vehicleModel/isVehSeriesEdit']" v-on:click="seriesEdit(vehSeriesItem)">编辑</i-button>
                                    <i-button type="ghost" size="small" icon="android-delete" v-if="message['/vehicle/vehicleModel/isVehSeriesDel']" v-on:click="seriesDel(vehSeriesItem)">删除</i-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination-row clearfix">
                        <div class="pull-right pull-left-sm">
                            <zpagenav :page="searchSeries.pageIndex" :page-size="searchSeries.pageSize" :total="searchSeries.totalCount" :max-link="maxLink" :page-handler="seriesPageHandler"></zpagenav>
                        </div>
                    </div>
                    <!--新增  车系-->
                    <modal v-model="seriesAddModal.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="seriesAddCancel"><span>×</span></button>
                            <h4 class="modal-title">{{seriesTitle}}车系</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <form class="form-horizontal" role="form" novalidate data-vv-scope="seriesParamsVali">
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">品牌：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <select
                                        v-validate="'required'" name="seriesToBrandId" data-vv-as="品牌" :class="{'select': true, 'is-danger': errors.has('seriesParamsVali.seriesToBrandId') }"
                                         class="form-control input-sm seriesToBrandId">
                                            <option value="">--请选择--</option>
                                            <option v-for="brandItem in brandListAll" v-bind:value="brandItem.id">{{brandItem.name}}</option>
                                        </select>
                                        <span v-show="errors.has('seriesParamsVali.seriesToBrandId')" class="help is-danger">{{ errors.first('seriesParamsVali.seriesToBrandId') }}</span>
                                    </div>
                                    <div class="col-md-4 col-sm-4">

                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">车系代码：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input
                                        v-validate="'required|max:10'" name="seriescode" data-vv-as="车系代码"
                                        :class="{'input': true, 'is-danger': errors.has('seriesParamsVali.seriescode') }"
                                        type="text" class="form-control input-sm seriescode"/>
                                        <i v-show="errors.has('seriesParamsVali.seriescode')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('seriesParamsVali.seriescode')"
                                        class="help is-danger">{{ errors.first('seriesParamsVali.seriescode') }}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">车系名称：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input
                                        v-validate="'required|max:10'" name="seriesname" data-vv-as="车系名称"
                                        :class="{'input': true, 'is-danger': errors.has('seriesParamsVali.seriesname') }"
                                         type="text" class="form-control input-sm seriesname"/>
                                         <i v-show="errors.has('seriesParamsVali.seriesname')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('seriesParamsVali.seriesname')"
                                        class="help is-danger">{{ errors.first('seriesParamsVali.seriesname') }}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">备注：</label>
                                    <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                        <textarea
                                         v-validate="'max:40'" name="seriesremark" data-vv-as="备注"
                                         :class="{'textarea': true, 'is-danger': errors.has('seriesParamsVali.seriesremark') }"
                                         rows="3" cols="30" class="form-control seriesremark"></textarea>
                                         <i v-show="errors.has('seriesParamsVali.seriesremark')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('seriesParamsVali.seriesremark')" class="help is-danger">{{ errors.first('seriesParamsVali.seriesremark') }}</span>
                                    </div>
                                    <div class="col-md-2 col-sm-2"></div>
                                </div>
                            </form>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="seriesAddCancel">取消</button>
                            <button type="button" class="btn btn-success" @click="addSeriesModelCall('seriesParamsVali')" v-show="seriesTitle=='新增'?true:false" :disabled="errors.any('seriesParamsVali')">确定</button>
                            <button type="button" class="btn btn-success" @click="editSeriesModelCall('seriesParamsVali')" v-show="seriesTitle=='编辑'?true:false" :disabled="errors.any('seriesParamsVali')">确定</button>
                        </div>
                    </modal>
                    <!--删除  车系-->
                    <modal v-model="seriesDelModal.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="seriesDelModal.isShow=false"><span>×</span></button>
                            <h4 class="modal-title">删除确认</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <p>确认删除车系：{{seriesSeriesDelList.name}}？</p>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="seriesDelModal.isShow = false">取消</button>
                            <button type="button" class="btn btn-success" @click="deviceSeriesDelCall">确定</button>
                        </div>
                    </modal>
                </tab>
                <tab header="车型">
                    <div class="smart-widget">
                        <div class="smart-widget-inner">
                            <div class="smart-widget-body">
                                <form class="form-inline no-margin" @submit.prevent="searchModelCall">
                                    <div class="form-group" style="width:100%;">
                                        <label class="control-label">品牌:</label>
                                        <select class="form-control input-sm m-right-lg"  v-on:change="brandChange('search')" v-model="searchModelParams.brandId">
                                            <option value="">--请选择--</option>
                                            <option v-for="brandItem in brandListAll" v-bind:value="brandItem.id">{{brandItem.name}}</option>
                                        </select>
                                        <label class="control-label">车系:</label>
                                        <select class="form-control input-sm m-right-lg" v-model="searchModelParams.seriesId">
                                            <option value="">--请选择--</option>
                                            <option v-for="seriesItem in brandToSeriesSearch" v-bind:value="seriesItem.id">{{seriesItem.name}}</option>
                                        </select>
                                        <label class="control-label">车型名称:</label>
                                        <input type="text" class="form-control input-sm m-right-lg" v-model="searchModelParams.keyword"/>
                                        <button type="button" class="btn btn-sm btn-success" v-on:click="searchModelCall">搜索</button>
                                        <button type="button" class="btn btn-sm btn-success right"v-if="message['/vehicle/vehicleModel/isVehModelAdd']" v-on:click="modelAdd">新增</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="data-table table-responsive">
                        <table class="table table-bordered" id="dataTable3">
                            <thead>
                            <tr>
                                <th>品牌名称</th>
                                <th>车系名称</th>
                                <th>车型名称</th>
                                <th>车型代码</th>
                                <th>车型类型</th>
                                <th>发布日期</th>
                                <th>备注</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="vehModelItem in vehModelList">
                                <td>{{vehModelItem.brandName}}</td>
                                <td>{{vehModelItem.seriesName}}</td>
                                <td>{{vehModelItem.name}}</td>
                                <td>{{vehModelItem.code}}</td>
                                <td v-text="modelTypeChange(vehModelItem.modelTypeId)"></td>
                                <td>{{vehModelItem.publishTime | activeYearFilter}}</td>
                                <td>{{vehModelItem.remark}}</td>
                                <td>
                                    <i-button type="ghost" size="small" icon="edit" v-if="message['/vehicle/vehicleModel/isVehModelEdit']" v-on:click="modelEdit(vehModelItem)">编辑</i-button>
                                    <i-button type="ghost" size="small" icon="android-delete" v-if="message['/vehicle/vehicleModel/isVehModelDel']" v-on:click="modelDel(vehModelItem)">删除</i-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination-row clearfix">
                        <div class="pull-right pull-left-sm">
                            <zpagenav :page="searchModelParams.pageIndex" :page-size="searchModelParams.pageSize" :total="searchModelParams.totalCount" :max-link="maxLink" :page-handler="modelPageHandler"></zpagenav>
                        </div>
                    </div>
                    <!--新增  车型-->
                    <modal v-model="modelAddModal.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" @click="modelAddCancel"><span>×</span></button>
                            <h4 class="modal-title">{{modelTitle}}车型</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <form class="form-horizontal" role="form" novalidate data-vv-scope="modelAddModalVali">
                                <div class="form-group">
                                    <div class="form-line-validator">
                                        <label class="col-md-4 col-sm-4 control-label label-name">品牌：</label>
                                        <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                            <select
                                                    v-validate="'required'" data-vv-as="品牌" name="brandInfo" :class="{'select': true, 'is-danger': errors.has('modelAddModalVali.brandInfo') }"
                                                    class="form-control input-sm brandInfo" v-on:change="brandChange('add')">
                                                <option value="">--请选择--</option>
                                                <option v-for="brandItem in brandListAll" v-bind:value="brandItem.id">{{brandItem.name}}</option>
                                            </select>
                                            <span v-show="errors.has('modelAddModalVali.brandInfo')" class="help is-danger">{{ errors.first('modelAddModalVali.brandInfo') }}</span>
                                        </div>
                                    </div>
                                    <div class="form-line-validator">
                                        <label class="col-md-4 col-sm-4 control-label label-name">车系：</label>
                                        <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                            <select
                                                    v-validate="'required'" data-vv-as="车系" name="seriesInfo" :class="{'select': true, 'is-danger': errors.has('modelAddModalVali.seriesInfo') }"
                                                    class="form-control input-sm seriesInfo">
                                                <option value="">--请选择--</option>
                                                <option v-for="seriesItem in brandToSeriesAdd" v-bind:value="seriesItem.id">{{seriesItem.name}}</option>
                                            </select>
                                            <span v-show="errors.has('modelAddModalVali.seriesInfo')" class="help is-danger">{{ errors.first('modelAddModalVali.seriesInfo') }}</span>
                                            <input type="hidden" class="form-control input-sm" placeholder="" v-model="seriesInfo"/>
                                        </div>
                                    </div>

                                </div>
                                <div class="form-group">
                                    <div class="form-line-validator">
                                        <label class="col-md-4 col-sm-4 control-label label-name">车型代码：</label>
                                        <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                            <input
                                                    v-validate="'required|max:20'" name="modelcode" data-vv-as="车型代码"
                                                    :class="{'input': true, 'is-danger': errors.has('modelAddModalVali.modelcode') }"
                                                    type="text" class="form-control input-sm modelcode"/>
                                            <i v-show="errors.has('modelAddModalVali.modelcode')" class="fa fa-warning"></i>
                                            <span v-show="errors.has('modelAddModalVali.modelcode')"
                                                  class="help is-danger">{{ errors.first('modelAddModalVali.modelcode') }}</span>
                                        </div>
                                    </div>
                                    <div class="form-line-validator">
                                        <label class="col-md-4 col-sm-4 control-label label-name">车型名称：</label>
                                        <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                            <input
                                                    v-validate="'required|max:20'" name="modelname" data-vv-as="车型名称"
                                                    :class="{'input': true, 'is-danger': errors.has('modelAddModalVali.modelname') }"
                                                    type="text" class="form-control input-sm modelname"/>
                                            <i v-show="errors.has('modelAddModalVali.modelname')" class="fa fa-warning"></i>
                                            <span v-show="errors.has('modelAddModalVali.modelname')"
                                                  class="help is-danger">{{ errors.first('modelAddModalVali.modelname') }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="form-line-validator">
                                        <label class="col-md-4 col-sm-4 control-label label-name">车型类型：</label>
                                        <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                            <select
                                                    v-validate="'required'" data-vv-as="车型类型" name="modelTypeId" :class="{'select': true, 'is-danger': errors.has('modelAddModalVali.modelTypeId') }"
                                                    class="form-control input-sm modelTypeId">
                                                <option value="">--请选择--</option>
                                                <option v-for="modelTypeItem in modelTypeList" v-bind:value="modelTypeItem.id">{{modelTypeItem.name}}</option>
                                            </select>
                                            <span v-show="errors.has('modelAddModalVali.modelTypeId')" class="help is-danger">{{ errors.first('modelAddModalVali.modelTypeId') }}</span>
                                        </div>
                                    </div>
                                    <div class="form-line-validator">
                                        <label class="col-md-4 col-sm-4 control-label label-name">发布日期：</label>
                                        <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                            <div class="dateWrap">
                                                <date-picker class="float-l" v-model="publishTime" type="date" :confirm="true" placeholder="发布日期" style="width: 185px" @on-ok="compareTime()" :class="{'is-danger': timeCompare }"></date-picker>
                                                <span v-show="timeCompare" class="help is-danger">发布日期  不得大于当前日期</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">备注：</label>
                                    <div class="col-md-10 col-sm-10 has-icon has-icon-right">
                                        <textarea
                                        v-validate="'max:40'" name="modelremark" data-vv-as="备注" :class="{'textarea': true, 'is-danger': errors.has('modelAddModalVali.modelremark') }"
                                         rows="3" cols="30" class="form-control modelremark"></textarea>
                                         <i v-show="errors.has('modelAddModalVali.modelremark')" class="fa fa-warning"></i>
                                         <span v-show="errors.has('modelAddModalVali.modelremark')" class="help is-danger">{{ errors.first('modelAddModalVali.modelremark') }}</span>
                                    </div>
                                    <div class="col-md-2 col-sm-2"></div>
                                </div>
                            </form>
                            <label class="control-label label-title" v-if="message['/vehicle/vehicleModel/isVehModelConfiguration'] && vehModelConfigList.length">服务功能配置：</label>
                            <div class="" v-if="message['/vehicle/vehicleModel/isVehModelConfiguration'] && vehModelConfigList.length">
                                <div class="modelConfigWarp" v-for="(items,index) in vehModelConfigList">
                                    <div class="modelConfigFirst clearfix" :class="{ 'modelConfigFirstDev': items.items.length==0?true:false}">
                                        <input type="checkbox" checked :disabled="true">
                                        <span class="modelConfigTxt">{{items.name}}</span>
                                        <div class="modelConfigSecond clearfix">
                                            <div class="col-md-3 col-sm-3" v-for="item in items.items">
                                                <input type="checkbox" checked :disabled="true">
                                                <span class="modelConfigText">{{item.name}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="modelAddCancel">取消</button>
                            <button type="button" class="btn btn-success" @click="addModelCall('modelAddModalVali')" v-show="modelTitle=='新增'?true:false" :disabled="errors.any('modelAddModalVali') || timeCompare">确定</button>
                            <button type="button" class="btn btn-success" @click="editModelCall('modelAddModalVali')" v-show="modelTitle=='编辑'?true:false" :disabled="errors.any('modelAddModalVali') || timeCompare">确定</button>
                        </div>
                    </modal>
                    <!--删除  车型-->
                    <modal v-model="modelDelModal.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="modelDelModal.isShow=false"><span>×</span></button>
                            <h4 class="modal-title">删除确认</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <p>确认删除车型：{{modelDelInfo.name}}？</p>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="modelDelModal.isShow = false">取消</button>
                            <button type="button" class="btn btn-success" @click="deviceModelDelCall">确定</button>
                        </div>
                    </modal>
                </tab>
                <tab header="车身">
                    <div class="smart-widget">
                        <div class="smart-widget-inner">
                            <div class="smart-widget-body">
                                <form class="form-inline no-margin" @submit.prevent="colorSearch">
                                    <div class="form-group" style="width:100%;">
                                        <label class="control-label">颜色关键字:</label>
                                        <input type="text" class="form-control input-sm m-right-lg" v-model="searchColor.keyword"/>
                                        <button type="button" class="btn btn-sm btn-success" v-on:click="colorSearch()">搜索</button>
                                        <button type="button" class="btn btn-sm btn-success right" v-if="message['/vehicle/vehicleModel/isVehColorAdd']" v-on:click="colorAdd()">新增</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="data-table table-responsive">
                        <table class="table table-bordered" id="dataTable4">
                            <thead>
                            <tr>
                                <th>颜色名称</th>
                                <th>颜色代码</th>
                                <th>备注</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="colorItem in colorList">
                                <td>{{colorItem.name}}</td>
                                <td>{{colorItem.code}}</td>
                                <td>{{colorItem.remark}}</td>
                                <td>
                                    <i-button type="ghost" size="small" icon="edit" v-if="message['/vehicle/vehicleModel/isVehColorEdit']" v-on:click="colorEdit(colorItem)">编辑</i-button>
                                    <i-button type="ghost" size="small" icon="android-delete" v-if="message['/vehicle/vehicleModel/isVehColorDel']" v-on:click="colorDel(colorItem)">删除</i-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination-row clearfix">
                        <div class="pull-right pull-left-sm">
                            <zpagenav :page="searchColor.pageIndex" :page-size="searchColor.pageSize" :total="searchColor.totalCount" :max-link="maxLink" :page-handler="colorPageHandler"></zpagenav>
                        </div>
                    </div>
                    <!--颜色-新增-->
                    <modal v-model="colorAddModal.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="colorAddCancel"><span>×</span></button>
                            <h4 class="modal-title">{{colorModalTitle}}颜色</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <form class="form-horizontal" role="form" novalidate data-vv-scope="addColorParamsVali">
                                <div class="form-group">
                                    <label class="col-md-3 col-sm-3 control-label label-name">车身颜色代码：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input type="text" class="form-control input-sm hide" v-model="addColorParams.id"/>
                                        <input
                                        v-validate="'required|max:10'" name="colorcode" data-vv-as="车身颜色代码" :class="{'input': true, 'is-danger': errors.has('addColorParamsVali.colorcode') }"
                                         type="text" class="form-control input-sm colorcode"/>
                                         <i v-show="errors.has('addColorParamsVali.colorcode')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('addColorParamsVali.colorcode')" class="help is-danger">{{ errors.first('addColorParamsVali.colorcode')}}</span>
                                    </div>
                                    <div class="col-md-4 col-sm-4 form-validation">

                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-3 col-sm-3 control-label label-name">车身颜色名称：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input
                                        v-validate="'required|max:10'" name="colorname" data-vv-as="车身颜色名称" :class="{'input': true, 'is-danger': errors.has('addColorParamsVali.colorname') }"
                                         type="text" class="form-control input-sm colorname"/>
                                         <i v-show="errors.has('addColorParamsVali.colorname')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('addColorParamsVali.colorname')" class="help is-danger">{{ errors.first('addColorParamsVali.colorname')}}</span>
                                    </div>
                                    <div class="col-md-4 col-sm-4 form-validation">

                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-3 col-sm-3 control-label label-name">车身颜色备注：</label>
                                    <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                        <textarea
                                        v-validate="'max:40'" name="colorremark" data-vv-as="车身颜色备注" :class="{'textarea': true, 'is-danger': errors.has('addColorParamsVali.colorremark') }"
                                         rows="2" cols="20" class="form-control colorremark" placeholder=""></textarea>
                                         <i v-show="errors.has('addColorParamsVali.colorremark')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('addColorParamsVali.colorremark')" class="help is-danger">{{ errors.first('addColorParamsVali.colorremark') }}</span>
                                    </div>
                                    <div class="col-md-2 col-sm-2"></div>
                                </div>
                            </form>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="colorAddCancel">取消</button>
                            <button type="button" class="btn btn-success" @click="colorAddCall('addColorParamsVali')" v-show="colorModalTitle=='新增'?true:false" :disabled="errors.any('addColorParamsVali')">确定</button>
                            <button type="button" class="btn btn-success" @click="colorEditCall('addColorParamsVali')" v-show="colorModalTitle=='编辑'?true:false" :disabled="errors.any('addColorParamsVali')">确定</button>
                        </div>
                    </modal>
                    <!-- 品牌-删除-->
                        <modal v-model="colorDelModal.isShow" :backdrop="false">
                            <div slot="modal-header" class="modal-header">
                                <button type="button" class="close" v-on:click="colorDelModal.isShow=false"><span>×</span></button>
                                <h4 class="modal-title">删除确认</h4>
                            </div>
                            <div slot="modal-body" class="modal-body">
                                <p>您确定要删除颜色：{{colorDelList.name}}?</p>
                            </div>
                            <div slot="modal-footer" class="modal-footer">
                                <button type="button" class="btn btn-default" @click="colorDelModal.isShow = false">取消</button>
                                <button type="button" class="btn btn-success" @click="colorDelCall">确定</button>
                            </div>
                        </modal>
                </tab>
            </tabs>
        </div>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<style scoped>
    .model-container{
        height: 1000px;
    }
    .modal{
        position: fixed;
    }
    .modelConfigTxt{
        color:#333;
        font-size:13px;
        font-weight:bold;
    }
    .modelConfigFirstDev{
        width:25%;
        float:left;
    }
</style>
<script>
    import { tabs, tab ,modal,alert} from 'vue-strap';
    import datePicker from 'iview/src/components/date-picker';
    export default{
        data(){
            return {
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
                },
                brandAddModal:{
                    isShow:false
                },
                brandDelModal:{
                    isShow:false
                },
                seriesAddModal:{
                    isShow:false
                },
                seriesDelModal:{
                    isShow:false
                },
                modelAddModal:{
                    isShow:false
                },
                modelDelModal:{
                    isShow:false
                },
                colorAddModal:{
                    isShow:false
                },
                colorDelModal:{
                    isShow:false
                },
                test:true,
                timeCompare:false,
                maxLink:5,
                brandModalTitle:"新增",
                brandList:{},
                brandListAll:{},
                brandDelList:{},
                remoteCodes: [],
                vehModelConfigList:{},
                vehModelSelFirst:[],
                vehModelSelSecond:[],
                searchBrand:{
                    keyword:"",
                    pageIndex:1,
                    pageSize:10,
                    totalCount:0
                },
                brandParams:{
                    id:0,
                    name:"",
                    nameAlias:"",
                    code:"",
                    remark:""
                },
                seriesSeriesDelList:{
                    name:"",
                    id:""
                },
                brandInfo:"",
                seriesInfo:"",
                seriesParams:{
                    id:0,
                    brandId:"",
                    code:"",
                    brandName:"",
                    name:"",
                    nameAlias:"",
                    remark:"",
                    seriesTypeId:""
                },
                seriesTitle:"新增",
                searchSeries:{
                    brandId:"",
                    keyword:"",
                    pageIndex:1,
                    pageSize:10,
                    totalCount:0
                },
                vehSeriesList:{},
                vehSeriesListAll:{},
                vehModelList:{},
                searchModelParams:{
                    brandId:"",
                    seriesId:"",
                    keyword:"",
                    pageIndex:1,
                    pageSize:10,
                    totalCount:0
                },
                publishTime:null,
                addModelParams:{
                    code: "",
                    id: 0,
                    modelTypeId: 0,
                    name: "",
                    nameAlias: "",
                    publishTime: "",
                    remark: "",
                    seriesId: 0
                },
                modelTypeList:{},
                modelTitle:"新增",
                modelDelInfo:{
                    name:"",
                    vehModelId:""
                },
                brandToSeriesSearch:{},
                brandToSeriesAdd:{},
                searchColor:{
                    keyword:"",
                    pageIndex:1,
                    pageSize:10,
                    totalCount:0
                },
                colorList:{},
                colorModalTitle:"新增",
                addColorParams:{
                    code: "",
                    id: 0,
                    name: "",
                    nameAlias: "",
                    remark: ""
                },
                colorDelList:{},
                brandcode : "",
                brandname : "",
                brandremark : "",
                seriesToBrandId : "",
                seriescode : "",
                seriesname : "",
                seriesremark : "",
                modelcode  : "",
                modelname : "",
                modelTypeId : "",
                modelremark : "",
                colorcode : "",
                colorname : "",
                colorremark : ""
            }
        },
        components: {
            tabs,
            tab,
            modal,
            alert,
            datePicker
        },
        methods: {
            modelTypeChange(id){
                let _this = this;
                for(var i in _this.modelTypeList){
                    if(_this.modelTypeList[i].id==id){
                        return _this.modelTypeList[i].name;
                    }
                }
            },
            compareTime(){
                if(this.publishTime){
                    this.timeCompare = this.publishTime > new Date();
                }else{
                    this.timeCompare = false;
                }
            },
            getVehItemAll(){
                let _this = this;
                _this.$http.get('api/getVehItemAll').then(function(data){
                    if(data.body.status){
                        _this.vehModelConfigList = data.body.data;
                        for(var i in _this.vehModelConfigList){
                            for(var j in _this.vehModelConfigList[i].items){
                                _this.remoteCodes.push(_this.vehModelConfigList[i].items[j].code);
                            }
                        }
                    }
                });
            },
            getBrand(way){
                let _this = this;
                _this.$http.get('api/getVehBrandList', { params: _this.searchBrand }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        if(way!='search' && way!='page'){
                            _this.getBrandAll();
                        }
                        _this.brandList = data.body.datas;
                        _this.searchBrand.pageIndex = data.body.pageIndex;
                        _this.searchBrand.totalCount = data.body.totalCount;
                    }
                });
            },
            getBrandAll(){
                let _this = this;
                _this.$http.get('api/getVehBrandList',{ params:{pageIndex:1,pageSize:999}}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.brandListAll = data.body.datas;
                    }
                });
            },
            getVehSeriesList(way){
                let _this = this;
                _this.$http.get('api/getVehSeriesList', { params: _this.searchSeries }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehSeriesList = data.body.datas;
                        if(way!='search' && way!='page'){
                            _this.$http.get('api/getVehSeriesList', { params:{pageIndex:1,pageSize:999} }).then(function(data){
                                if(data.body.status=="SUCCEED"){
                                    _this.vehSeriesListAll = data.body.datas;
                                }
                            });
                        }
                        _this.searchSeries.pageIndex = data.body.pageIndex;
                        _this.searchSeries.totalCount = data.body.totalCount;
                    }
                });
            },
            getVehModelList(way){
                let _this = this;
                _this.$http.get('api/getVehModelList', { params: _this.searchModelParams }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehModelList = data.body.datas;
                        _this.searchModelParams.pageIndex = data.body.pageIndex;
                        _this.searchModelParams.totalCount = data.body.totalCount;
                    }
                });
            },
            getVehColorList(){
                let _this = this;
                _this.$http.get('api/getVehColorList', { params: _this.searchColor }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.colorList = data.body.datas;
                        _this.searchColor.pageIndex = data.body.pageIndex;
                        _this.searchColor.totalCount = data.body.totalCount;
                    }
                });
            },
            getVehModelType(){
                let _this = this;
                _this.$http.get('api/getVehModelType').then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.modelTypeList = data.body.data;
                    }
                });
            },
            brandSearch:function (){
                this.searchBrand.pageIndex = 1;
                this.getBrand('search');
            },
            brandPageHandler:function (page){
                this.searchBrand.pageIndex = page;
                this.getBrand('page');
            },
            addBrand:function (){
                let _this = this;
                _this.brandModalTitle = "新增";
                _this.brandParams = {};
                $(".brandcode").val('');
                $(".brandname").val('');
                $(".brandremark").val('');
                _this.brandAddModal.isShow = true;
            },
            brandEdit:function (brand){
                let _this = this;
                _this.brandModalTitle = "编辑";
                _this.brandAddModal.isShow = true;
                _this.brandParams = {
                    id:brand.id,
                    name:brand.name,
                    nameAlias:brand.nameAlias,
                    code:brand.code,
                    remark:brand.remark
                };
                $(".brandcode").val(brand.code);
                $(".brandname").val(brand.name);
                $(".brandremark").val(brand.remark);
            },
            brandDel:function (brand){
                this.brandDelModal.isShow = true;
                this.brandDelList = brand;
            },
            brandAddCall:function (scope){
                let _this = this;
                _this.brandParams = {
                    id: "",
                    code:$(".brandcode").val(),
                    name:$(".brandname").val(),
                    remark:$(".brandremark").val()
                };
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addVehBrand', _this.brandParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.brandAddModal.isShow = false;
                                _this.getBrand('add');
                                _this.alert= {
                                    isShow: true,
                                    content: "新增品牌成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "新增品牌失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            brandEditCall:function (scope){
                let _this = this;
                _this.brandParams = {
                    code:$(".brandcode").val(),
                    name:$(".brandname").val(),
                    remark:$(".brandremark").val(),
                    id: _this.brandParams.id
                };
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateVehBrand', _this.brandParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.brandAddModal.isShow = false;
                                _this.getBrand('edit');
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑品牌成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑品牌失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            brandDelCall:function (){
                let _this = this;
                _this.$http.post('api/deleteVehBrand', {vehBrandId:_this.brandDelList.id}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status == "SUCCEED"){
                        _this.brandDelModal.isShow = false;
                        _this.getBrand('del');
                        _this.alert= {
                            isShow: true,
                            content: "删除品牌成功",
                            type: "success"
                        };
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "删除品牌失败,"+result.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            searchSeriesCall:function (){
                this.searchSeries.pageIndex = 1;
                this.getVehSeriesList('search');
            },
            seriesPageHandler:function (page){
                this.searchSeries.pageIndex = page;
                this.getVehSeriesList('page');
            },
            addSeries:function (DeviceModel){
                let _this = this;
                _this.seriesAddModal.isShow = true;
                _this.seriesTitle = "新增";
                _this.seriesParams = {};
                $(".seriesToBrandId").val('');
                $(".seriescode").val('');
                $(".seriesname").val('');
                $(".seriesremark").val('');
            },
            seriesEdit:function (series){
                let _this = this;
                _this.seriesAddModal.isShow = true;
                _this.seriesTitle = "编辑";
                _this.seriesParams = {
                    id:series.id,
                    brandId:series.brandId,
                    brandName:series.brandName,
                    name:series.name,
                    code:series.code,
                    nameAlias:series.nameAlias,
                    remark:series.remark,
                    seriesTypeId:series.seriesTypeId
                };
                $(".seriesToBrandId").val(series.brandId);
                $(".seriescode").val(series.code);
                $(".seriesname").val(series.name);
                $(".seriesremark").val(series.remark);
            },
            seriesDel:function (series){
                this.seriesDelModal.isShow = true;
                this.seriesSeriesDelList = {
                    name:series.name,
                    id:series.id
                };
            },
            addSeriesModelCall:function (scope){
                let _this = this;
                _this.seriesParams.brandId = $(".seriesToBrandId").val();
                _this.seriesParams.name = $(".seriesname").val();
                _this.seriesParams.code = $(".seriescode").val();
                _this.seriesParams.remark = $(".seriesremark").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addVehSeries', _this.seriesParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.seriesAddModal.isShow = false;
                                _this.getVehSeriesList('add');
                                _this.alert= {
                                    isShow: true,
                                    content: "新增车系成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "新增车系失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            editSeriesModelCall:function (scope){
                let _this = this;
                _this.seriesParams.brandId = $(".seriesToBrandId").val();
                _this.seriesParams.name = $(".seriesname").val();
                _this.seriesParams.code = $(".seriescode").val();
                _this.seriesParams.remark = $(".seriesremark").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateVehSeries', _this.seriesParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.seriesAddModal.isShow = false;
                                _this.getVehSeriesList('edit');
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车系成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车系失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            deviceModelDelCall:function (){
                let _this = this;
                _this.$http.post('api/deleteVehModel', {vehModelId:_this.modelDelInfo.id}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status == "SUCCEED"){
                        _this.modelDelModal.isShow = false;
                        _this.getVehModelList('del');
                        _this.alert= {
                            isShow: true,
                            content: "删除车型成功",
                            type: "success"
                        };
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "删除车型失败,"+result.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            searchModelCall:function (){
                this.searchModelParams.pageIndex = 1;
                this.getVehModelList();
            },
            modelAdd:function (){
                let _this = this;
                _this.modelTitle = "新增";
                _this.addModelParams = {};
                _this.publishTime = null;
                _this.brandToSeriesSearch = {};
                _this.brandToSeriesAdd = [];
                _this.modelAddModal.isShow = true;
                $(".brandInfo").val('');
                $(".seriesInfo").val('');
                $(".modelcode").val('');
                $(".modelname").val('');
                $(".modelTypeId").val('');
                $(".modelremark").val('');
            },
            modelEdit:function (model){
                let _this = this;
                _this.modelAddModal.isShow = true;
                _this.modelTitle = "编辑";
                _this.addModelParams = {
                    code: model.code,
                    id: model.id,
                    modelTypeId: model.modelTypeId,
                    name: model.name,
                    nameAlias: model.nameAlias,
                    publishTime: model.publishTime?new Date(model.publishTime):null,
                    remark: model.remark,
                    seriesId: model.seriesId
                }
                _this.publishTime = model.publishTime?new Date(model.publishTime):null;
                $(".brandInfo").val(model.brandId);
                $(".modelcode").val(model.code);
                $(".modelname").val(model.name);
                $(".modelTypeId").val(model.modelTypeId);
                $(".modelremark").val(model.remark);
                _this.$http.get('api/getVehSeriesList', {params:{brandId:_this.brandInfo}}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status == "SUCCEED"){
                        _this.brandToSeriesAdd = result.datas;
                        $(".seriesInfo").val(model.seriesId);
                    }
                });
            },
            modelDel:function (model){
                let _this = this;
                _this.modelDelInfo = model;
                _this.modelDelModal.isShow = true;
            },
            modelPageHandler:function (page){
                this.searchModelParams.pageIndex = page;
                this.getVehModelList();
            },
            addModelCall:function (scope){
                let _this = this;
                _this.addModelParams.publishTime = _this.publishTime?_this.publishTime.getTime():null;
                _this.addModelParams.seriesId = $(".seriesInfo").val();
                _this.addModelParams.name = $(".modelname").val();
                _this.addModelParams.code = $(".modelcode").val();
                _this.addModelParams.modelTypeId = $(".modelTypeId").val();
                _this.addModelParams.remark = $(".modelremark").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addVehModelAndRemote', {vehicleModel:_this.addModelParams,remoteCodes:_this.remoteCodes}).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.modelAddModal.isShow = false;
                                _this.getVehModelList();
                                _this.alert= {
                                    isShow: true,
                                    content: "新增车型成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "新增车型失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            editModelCall:function (scope){
                let _this = this;
                _this.addModelParams.publishTime = _this.publishTime?_this.publishTime.getTime():null;
                _this.addModelParams.seriesId = $(".seriesInfo").val();
                _this.addModelParams.name = $(".modelname").val();
                _this.addModelParams.code = $(".modelcode").val();
                _this.addModelParams.modelTypeId = $(".modelTypeId").val();
                _this.addModelParams.remark = $(".modelremark").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateVehModelAndRemote', {vehicleModel:_this.addModelParams,remoteCodes:_this.remoteCodes}).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.modelAddModal.isShow = false;
                                _this.getVehModelList();
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车型成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车型失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            deviceSeriesDelCall:function (){
                let _this = this;
                _this.$http.post('api/deleteVehSeries', {vehSeriesId:_this.seriesSeriesDelList.id}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status == "SUCCEED"){
                        _this.seriesDelModal.isShow = false;
                        _this.getVehSeriesList();
                        _this.alert= {
                            isShow: true,
                            content: "删除车系成功",
                            type: "success"
                        };
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "删除车系失败,"+result.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            brandChange:function (way){
                let _this = this;
                _this.brandToSeriesSearch = {};
                _this.brandToSeriesAdd = {};
                let brandId = "";
                if(way=='search'){
                    brandId = _this.searchModelParams.brandId;
                    _this.$http.get('api/getVehSeriesList', {params:{brandId:brandId,pageIndex:1,pageSize:999}}).then(function(reponse){
                        var result = reponse.body;
                        if(result.status == "SUCCEED"){
                            _this.brandToSeriesSearch = result.datas;
                        }
                    });
                }else{
                    brandId = $(".brandInfo").val();
                    _this.$http.get('api/getVehSeriesList', {params:{brandId:brandId,pageIndex:1,pageSize:999}}).then(function(reponse){
                        var result = reponse.body;
                        if(result.status == "SUCCEED"){
                            _this.brandToSeriesAdd = result.datas;
                        }
                    });
                }
            },
            colorSearch:function (){
                this.searchColor.pageIndex = 1;
                this.getVehColorList();
            },
            colorAdd:function (){
                let _this = this;
                _this.colorAddModal.isShow = true;
                _this.colorModalTitle = "新增";
                _this.addColorParams = {};
                $(".colorcode").val('');
                $(".colorname").val('');
                $(".colorremark").val('');
            },
            colorEdit:function (color){
                let _this = this;
                _this.colorAddModal.isShow = true;
                _this.colorModalTitle = "编辑";
                _this.addColorParams = {
                    code: color.code,
                    id: color.id,
                    name: color.name,
                    nameAlias: color.nameAlias,
                    remark: color.remark
                };
                $(".colorcode").val(color.code);
                $(".colorname").val(color.name);
                $(".colorremark").val(color.remark);
            },
            colorDel:function (color){
                let _this = this;
                _this.colorDelModal.isShow = true;
                _this.colorDelList = color;
            },
            colorPageHandler:function (page){
                this.searchColor.pageIndex = page;
                this.getVehColorList();
            },
            colorAddCall:function (scope){
                let _this = this;
                _this.addColorParams = {
                    code: $(".colorcode").val(),
                    name: $(".colorname").val(),
                    id: "",
                    remark: $(".colorremark").val()
                };
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addVehColor', _this.addColorParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.colorAddModal.isShow = false;
                                _this.getVehColorList();
                                _this.alert= {
                                    isShow: true,
                                    content: "新增车身颜色成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "新增车身颜色失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            colorEditCall:function (scope){
                let _this = this;
                _this.addColorParams = {
                    code: $(".colorcode").val(),
                    name: $(".colorname").val(),
                    id: _this.addColorParams.id,
                    remark: $(".colorremark").val()
                };
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateVehColor', _this.addColorParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.colorAddModal.isShow = false;
                                _this.getVehColorList();
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车身颜色成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车身颜色失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            colorDelCall:function (){
                let _this = this;
                _this.$http.post('api/deleteVehColor', {vehColorId:_this.colorDelList.id}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status == "SUCCEED"){
                        _this.colorDelModal.isShow = false;
                        _this.getVehColorList();
                        _this.alert= {
                            isShow: true,
                            content: "删除车身颜色成功",
                            type: "success"
                        };
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "删除车身颜色失败,"+result.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            brandAddCancel(){
                this.brandAddModal.isShow = false;
                this.errors.clear('brandParamsVali');
            },
            seriesAddCancel(){
                this.seriesAddModal.isShow = false;
                this.errors.clear('seriesParamsVali');
            },
            modelAddCancel(){
                this.modelAddModal.isShow = false;
                this.errors.clear('modelAddModalVali');
            },
            colorAddCancel(){
                this.colorAddModal.isShow = false;
                this.errors.clear('addColorParamsVali');
            }
        },
        created (){
            this.getBrand('onload');
            this.getVehSeriesList('onload');
            this.getVehModelList();
            this.getVehModelType();
            this.getVehColorList();
            this.getBrandAll();
            this.getVehItemAll();
        },
        props:["message"]
    }
</script>