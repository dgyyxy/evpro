<template>
    <div id="app">
        <router-view>

        </router-view>
    </div>
</template>
<style>
    #app{
        width:100%;
        height:100%;
    }
    .auto-scroll{
        height: 100%;
        overflow-y:auto;
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        data () {
            return {}
        },
        methods: {
            ...mapActions(['setConfig'])
        },
        computed: mapGetters({
            brand: 'getBrand'
        }),
        watch: {
            brand: (val) => {
                document.title = val;
            }
        },
        created(){
            this.setConfig(this);
            document.onkeydown=function(e){
                var ev =e ||event;
                var obj = ev.target || ev.srcElement;//获取事件源
                var t = obj.type || obj.getAttribute('type');//获取事件源类型
                if( ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" ){
                    return false;
                }
            }
        }
    }
</script>