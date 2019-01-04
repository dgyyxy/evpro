<template>
    <div id="app">
        <router-view :message="permission"></router-view>
    </div>
</template>
<style >
    #app{
        height: 100%;
    }

    .location-box{
        height:100%;
        position: relative;
    }

    .mapWrap {
        position: absolute;
        top:115px;
        left:0;
        right:0;
        bottom:0;
    }
</style>
<script>
    export default {
        data () {
            return {
                permission:{}
            }
        },
        methods: {
        },
        created(){
            let _this = this;
            let pathstr = _this.$route.path;
            pathstr = pathstr.substring(1);
            let topResourceName = "";
            if(pathstr.indexOf("/")===-1){
                topResourceName = pathstr;
            }else{
                topResourceName = pathstr.substring(0, pathstr.indexOf("/"));
            }
            _this.$http.get('api/findFunctionsByResource', {params: {token: _this.token, topResourceName: topResourceName}}).then(function(res){
                if(res.body.status && res.body.permission){
                    _this.permission = res.body.permission;
                }
            });
        },
        beforeCreate(){
        },
        props:["token"]
    }
</script>
