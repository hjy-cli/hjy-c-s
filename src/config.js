/**
 * Created by gyl
 */
export default {
  pageSize: 20,
  size: 'small',
  publicApi: "",
  publicUrl: '',
  publicImgUrl: '',
  // 提示信息
  info: {
    ifTimeOut: "登录过期，请重新登录!",
    delete: {
      success: '删除信息成功',
      error: '删除信息失败',
    },
    update: {
      success: '修改信息成功',
      error: '修改信息失败',
    },
    save: {
      success: '保存信息成功',
      error: '保存信息失败',
    },
  },
  reg: {
    required: {
      required: true,
      message: '必填'
    },
    phone: {
      pattern: /^1((3[\d])|(4[5,6,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[1-3,5-8])|(9[1,8,9]))\d{8}$/,
      message: '请填写正确的手机号码'
    },
    phone2: {
      pattern: /^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$/,
      message: '请填写正确的手机或座机号码'
    },
    positiveInteger: {
      pattern: /^[1-9]\d*$/,
      message: '请填写正整数'
    },
    integer: {
      pattern: /^[0-9]\d*$/,
      message: '请填写非负整数'
    },
    price: {
      pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
      message: '请填写正确的钱数'
    },
    long: {
      pattern: /^(-?\d+)(\.\d+)?$/,
      message: '请填写正确的数值'
    },
    space: {
      pattern: /^\S*$/,
      message: '请勿输入空格'
    },
    lengthMax: {
      max: 200,
      message: '超出最大字数限制'
    },
    absLong: {
      pattern: /^(\d+)(\.\d+)?$/,
      message: '请填写大于等于的0的数字'
    },
    long1: {
      pattern: /(^[1-9]\d*(\.\d{0,1})?$)|(^0(\.\d{0,1})?$)/,
      message: '保留一位小数'
    },
    long2: {
      pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
      message: '保留两位小数'
    },
    date: {
      pattern: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
      message: '日期格式应为：2018-01-01'
    },
    coordinates: {
      pattern: /^(\-|\+)?\d+(\.\d+)?(,(\-|\+)?\d+(\.\d+)?)$/,
      message: '格式错误,例:‘经度’,‘纬度’'
    },
    isURL: {
      pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|www\.)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
      message: '网址格式不正确'
    },
    zipCode: {
      pattern: /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/,
      message: '邮编格式不正确'
    },
    email: {
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: '邮箱格式不正确'
    },
    idCard: {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '身份证格式不正确'
    },
    ip: {
      pattern: /\d+\.\d+\.\d+\.\d+/,
      message: 'ip地址格式不正确'
    },
    chinese: {
      pattern: /^[\u4e00-\u9fa5]*$/,
      message: '中文'
    }
  }
}
