import { HTTP_GET, CONTENT_TYPE_FORM_URLENCODED } from "./constants.js";

// 默认参数
const DEFAULTS = {
  method: HTTP_GET,

  // 请求头携带的参数
  params: null,

  // 请求体携带的参数
  data: null,

  // 属性
  contentType: CONTENT_TYPE_FORM_URLENCODED,
  responseType: "",
  timeoutTime: 0,
  withCredentials: false,

  // 方法
  success() {},
  httpCodeError() {},
  error() {},
  abort() {},
  timeout() {},
};

export default DEFAULTS;
