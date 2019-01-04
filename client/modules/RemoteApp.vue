<template>
    <transition>
        <router-view :message="permission"></router-view>
    </transition>
</template>
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
        props:["token"]
    }
</script>