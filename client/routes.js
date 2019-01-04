/**
 * Created by gary.duan on 2017/12/19
 */
import Welcome from './modules/Welcome.vue';
import Home from './modules/home/Home.vue';
import Login from './modules/Login.vue';
import RetrieveByMail from './modules/RetrieveByMail.vue';
import PersonalCenter from "./modules/userCenter/PersonalCenter.vue";
/*系统管理*/
import Foundation from './modules/UserCenterApp.vue';
import UserQuery from './modules/userCenter/UserQuery.vue';
import RoleQuery from './modules/userCenter/RoleQuery.vue';
import Organization from './modules/userCenter/Organization.vue';
import MenuQuery from "./modules/userCenter/MenuQuery.vue";
import ResourceQuery from "./modules/userCenter/ResourceQuery.vue";
import SystemLog from "./modules/userCenter/SystemLog.vue";
/*地图*/
import CheryMonitor from './modules/map/CheryMonitor.vue';
/*基础信息管理*/
import VehicleApp from './modules/VehicleApp.vue';
import VehicleModel from './modules/vehicle/VehicleModel.vue';
import VehicleInfo from './modules/vehicle/VehicleInfo.vue';
import SimInformation from './modules/vehicle/SimInformation.vue';
import OwnerInformation from './modules/vehicle/OwnerInformation.vue';
import EquipmentInformation from './modules/vehicle/EquipmentInformation.vue';
import DeviceType from './modules/vehicle/DeviceType.vue';
import DealerInformation from './modules/vehicle/DealerInformation.vue';
/*Tserver*/
import ReplaceBoxHistory from './modules/Tservice/ReplaceBoxHistory.vue';
import CloseServiceHistory from './modules/Tservice/CloseServiceHistory.vue';
import QueryService from './modules/Tservice/QueryService.vue';

/*设备管理*/
import RemoteApp from './modules/RemoteApp.vue';
import BatchConfig from './modules/remote/BatchConfig.vue';
import DeviceConfig from './modules/remote/DeviceConfig.vue';
import DeviceFile from './modules/remote/DeviceFile.vue';
import DeviceUpgrade from './modules/remote/DeviceUpgrade.vue';
import ControlOperate from './modules/remote/ControlOperate.vue';

/*车辆位置监控*/
import Location from './modules/PositionApp.vue';
import Position from './modules/position/Position.vue';
import Trace from './modules/position/Trace.vue';
/*车辆状态监控*/
import Status from './modules/VehicleStatusApp.vue';
import VehicleStatusSearch from './modules/vehicleStatus/VehicleStatusSearch.vue';

import VehicleStatusLatest from './modules/vehicleStatus/VehicleStatusSearch/VehicleStatusLatest.vue'
import VehicleStatusHistory from './modules/vehicleStatus/VehicleStatusSearch/VehicleStatusHistory.vue'
import VehicleStatusSoloCallPolice from './modules/vehicleStatus/VehicleStatusSearch/VehicleStatusSoloCallPolice.vue'
import VehicleStatusFaultCount from './modules/vehicleStatus/VehicleStatusSearch/VehicleStatusFaultCount.vue'

import VehicleCallPolice from './modules/vehicleStatus/VehicleCallPolice.vue'

/*车辆产线检测*/
import DetectionApp from './modules/DetectionApp.vue';
import DetectionList from './modules/detection/DetectionList.vue';
import VehicleData from './modules/detection/VehicleData.vue';

/*报表统计*/
import StatisticApp from './modules/StatisticApp.vue'
import VehicleStatistic from './modules/statistic/VehicleStatistic.vue'
import EquipmentStatistic from './modules/statistic/EquipmentStatistic.vue'
import SIMStatistic from './modules/statistic/SIMStatistic.vue'
import OwnerStatistic from './modules/statistic/OwnerStatistic.vue'


/*售后管理*/
import AfterSaleApp from './modules/AfterSaleApp.vue';
import TboxReplace from './modules/afterSaleMgt/TboxReplace.vue'

/*MNO管理*/
import MnoApp from './modules/MnoApp.vue';
import GprsRealQuery from './modules/mno/GprsRealQuery.vue';
import GprsPoolQuery from './modules/mno/GprsPoolQuery.vue';

const routes = [
    {path: '/login', component: Login},
    {path: '/retrieveByMail', component: RetrieveByMail},
    {
        path: '/',
        component: Home,
        children: [
            {
                path: '/'
            },
            {
                path: "/welcome",
                component: Welcome
            },
            {
                path: "/map-monitor/CheryMonitor",
                name: "map-monitor",
                component: CheryMonitor
            },
            {
                path: "/Vehicle",
                component: VehicleApp,
                children:[
                    {
                        name:'VehicleModel',
                        path:'VehicleModel',
                        component:VehicleModel
                    },
                    {
                        name:'VehicleInfo',
                        path:'VehicleInfo',
                        component:VehicleInfo
                    },
                    {
                        name:'SimInformation',
                        path:'SimInformation',
                        component:SimInformation
                    },
                    {
                        name:'OwnerInformation',
                        path:'OwnerInformation',
                        component:OwnerInformation
                    },
                    {
                        name:'EquipmentInformation',
                        path:'EquipmentInformation',
                        component:EquipmentInformation
                    },
                    {
                        name:'DeviceType',
                        path:'DeviceType',
                        component:DeviceType
                    },
                    {
                        name:'DealerInformation',
                        path:'DealerInformation',
                        component:DealerInformation
                    },
                    {
                        name:'ReplaceBoxHistory',
                        path:'ReplaceBoxHistory',
                        component:ReplaceBoxHistory
                    },
                    {
                        name:'CloseServiceHistory',
                        path:'CloseServiceHistory',
                        component:CloseServiceHistory
                    },
                    {
                        name:'QueryService',
                        path:'QueryService',
                        component:QueryService
                    }
                ]
            },
            {
                path:"/remote",
                component:RemoteApp,
                children:[
                    {
                        name:'BatchConfig',
                        path:'BatchConfig',
                        component:BatchConfig
                    },
                    {
                        name:'DeviceConfig',
                        path:'DeviceConfig',
                        component:DeviceConfig
                    },
                    {
                        name:'DeviceFile',
                        path:'DeviceFile',
                        component:DeviceFile
                    },
                    {
                        name:'DeviceUpgrade',
                        path:'DeviceUpgrade',
                        component:DeviceUpgrade
                    },
                    {
                        name:'ControlOperate',
                        path:'ControlOperate',
                        component:ControlOperate
                    }
                ]
            },
            {
                path:"/location",
                component:Location,
                children:[
                    {
                        name:'Position',
                        path:'Position',
                        component:Position
                    },
                    {
                        name:'Trace',
                        path:'Trace',
                        component:Trace
                    }
                ]
            },
            {
                path:"/status",
                component:Status,
                children:[
                    {
                        name:'VehicleStatusSearch',
                        path:'VehicleStatusSearch',
                        component:VehicleStatusSearch,
                        children:[
                            {
                                name: "VehicleStatusLatest",
                                path: "VehicleStatusLatest",
                                component: VehicleStatusLatest
                            },
                            {
                                name: "VehicleStatusHistory",
                                path: "VehicleStatusHistory",
                                component: VehicleStatusHistory
                            },
                            {
                                name: "VehicleStatusSoloCallPolice",
                                path: "VehicleStatusSoloCallPolice",
                                component: VehicleStatusSoloCallPolice
                            },
                            {
                                name: "VehicleStatusFaultCount",
                                path: "VehicleStatusFaultCount",
                                component: VehicleStatusFaultCount
                            }
                        ]
                    },
                    {
                        name: 'VehicleCallPolice',
                        path: 'VehicleCallPolice',
                        component: VehicleCallPolice
                    }
                ]
            },
            {
                path: "/personalCenter",
                component: PersonalCenter
            },
            {
                path: "/foundation",
                component: Foundation,
                children: [
                    {
                        name: "userQuery",
                        path: "UserQuery",
                        component: UserQuery
                    },
                    {
                        name: "roleQuery",
                        path: "RoleQuery",
                        component: RoleQuery
                    },
                    {
                        name: "organization",
                        path: "Organization",
                        component: Organization
                    },
                    {
                        path: "MenuQuery",
                        name: "menuQuery",
                        component: MenuQuery
                    },
                    {
                        name: "resourceQuery",
                        path: "ResourceQuery",
                        component: ResourceQuery
                    },
                    {
                        name: "systemLog",
                        path: "SystemLog",
                        component: SystemLog
                    }
                ]
            },
            {
                path: '/detection',
                component: DetectionApp,
                children:[
                    {
                        name: 'detectionList',
                        path: 'DetectionList',
                        component: DetectionList
                    },
                    {
                        name: 'vehicleData',
                        path: 'VehicleData',
                        component: VehicleData
                    }
                ]
            },
            {
                path: '/statistic',
                component: StatisticApp,
                children: [
                    {
                        name: 'vehicleStatistic',
                        path: 'VehicleStatistic',
                        component: VehicleStatistic
                    },
                    {
                        name: 'EquipmentStatistic',
                        path: 'EquipmentStatistic',
                        component: EquipmentStatistic
                    },
                    {
                        name: 'SIMStatistic',
                        path: 'SIMStatistic',
                        component: SIMStatistic
                    },
                    {
                        name: 'OwnerStatistic',
                        path: 'OwnerStatistic',
                        component: OwnerStatistic
                    }
                ]
            },
            {
                path: '/afterSale',
                component: AfterSaleApp,
                children:[
                    {
                        name: 'tboxReplace',
                        path: 'TboxReplace',
                        component: TboxReplace
                    }
                ]
            },
            {
                path: '/mno',
                component: MnoApp,
                children: [
                    {
                        name: 'gprsRealQuery',
                        path: 'GprsRealQuery',
                        component: GprsRealQuery
                    },
                    {
                        name: 'gprsPoolQuery',
                        path: 'GprsPoolQuery',
                        component: GprsPoolQuery
                    }
                ]
            },
            {
                path: '*',
                redirect: '/welcome'
            }
        ]
    }
];

export default routes;