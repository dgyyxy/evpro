const NE_VALIDATE = {}

const VALIDATE_EXPRESSION = {
  'required' : '.',
  'max'      : '^.{1,m}$',
  'min'      : '^.{m,}$',
  'digst'    : '^.{m}$'
}

NE_VALIDATE.install = (Vue, options) => {
  Vue.directive('verify', {
    inserted: function (el, binding, vnode) {
      let _this = vnode.context
      let validMessage = el.dataset.validMessage
      let regexStr = el.dataset.regexStr
      _this.$set(Object(binding.arg), 'isValid')
      _this[Object(binding.arg)].isValid = true

      el.addEventListener('blur', () => {

        if (regexStr) {

          let reg = new RegExp(regexStr)

          if (el.value && !reg.test(el.value)) {
            el.style.borderColor = 'red'
            _this.alert = {
                isShow: true,
                content: validMessage,
                type: "danger"
            }

            _this[Object(binding.arg)].isValid = true
            return

          } else {
            el.style.borderColor = ''
            _this[Object(binding.arg)].isValid = false
            return
          }

        }

        let str = binding.expression
        if (!str) {
          return
        }
        let expression = []
        expression = str.substring(1, str.length - 1).split('|')

        for (let item of expression) {
          if (item === 'required') {
            let reg = /./;
            if (!reg.test(el.value)) {
              el.style.borderColor = 'red'
              _this[Object(binding.arg)].isValid = true
              _this.alert = {
                  isShow: true,
                  content: validMessage,
                  type: "danger"
              }

              el.focus()
              return
            }
          } else {
            let regKeyval = item.split(':')
            let n = VALIDATE_EXPRESSION[regKeyval[0]].replace('m', regKeyval[1])
            let reg = new RegExp(n)
            if (!reg.test(el.value)) {
              el.style.borderColor = 'red'
              _this.alert = {
                  isShow: true,
                  content: validMessage,
                  type: "danger"
              }

              _this[Object(binding.arg)].isValid = true
              return
            }
          }

            _this[Object(binding.arg)].isValid = false
            el.style.borderColor = ''
        }
      })
    }
  })
}

export default NE_VALIDATE