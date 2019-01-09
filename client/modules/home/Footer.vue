<template>
    <footer>
        <span class="footer-brand">
            <strong>{{brand}}</strong>
        </span>
        <p class="no-margin">
            &copy; {{copyright.year}} <strong>{{copyright.name}}</strong>. ALL Rights Reserved.
        </p>
    </footer>
</template>
<style lang="less">
    @import '~ne-style/util/variables.less';
    footer {
        position: absolute;
        line-height: @view-bottom;
        bottom: 0;
        right: 0;
        left: 240px;
        background: @white-color;
        color: #666666;
        box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.05) ;
        transition: left .5s ease;
        .footer-brand {
            font-size: 18px;
            margin:0 20px 0 30px;
            strong {
                color: #e36159;
            }
            span {
                font-size: 16px;
            }
        }
        p {
            display: inline-block;
        }
    }

    footer.animate-to-left{
        left:0;
        animation:animate-to-left,.5s,forward;
    }

    @keyframes animate-to-left {
        from{left:@view-left}
        to{left:0}
    }

    footer.animate-to-right{
        left:@view-left;
        animation:animate-to-right ,.5s ,forward;
    }

    @keyframes animate-to-right {
        from{left:0}
        to{left:@view-left}
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex'
    export default{
        data(){
            return {}
        },
        computed: mapGetters({
            brand: 'getBrand',
            copyright: 'getCopyright'
        }),
        created(){
        }
    }
</script>
