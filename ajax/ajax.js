import DEFAULTS from "./defaults.js";
import { serialize, addUrlData, serializeJSON } from "./utils.js";
import {
  HTTP_GET,
  CONTENT_TYPE_JSON,
  CONTENT_TYPE_FORM_URLENCODED,
} from "./constants.js";

// AJAX类
class Ajax {
  constructor(url, options) {
    this.url = url;
    this.options = Object.assign({}, DEFAULTS, options);
    this.init();
  }

  init() {
    const xhr = new XMLHttpRequest();

    this.xhr = xhr;

    // 绑定事件的响应程序
    this.bindEvent();

    // 准备发送请求
    xhr.open(this.options.method, this.url + this.addParam(), true);

    // 设置responseType
    this.setResponseType();

    // 设置超时
    this.setTimeout();

    // 设置跨域是否携带cookie
    this.setCookie();

    // 发送请求
    this.sendData();
  }

  // 绑定事件的响应程序
  bindEvent() {
    const xhr = this.xhr;

    const { success, httpCodeError, error, abort, timeout } = this.options;

    // load
    xhr.addEventListener("load", () => {
      if (this.ok()) {
        success(xhr.response, xhr);
      } else {
        httpCodeError(xhr.status, xhr);
      }
    });

    // error
    xhr.addEventListener("error", () => {
      error();
    });

    // abort
    xhr.addEventListener("abort", () => {
      abort();
    });

    // timeout
    xhr.addEventListener("timeout", () => {
      timeout();
    });
  }

  // 检测状态码是否正常
  ok() {
    const xhr = this.xhr;
    return (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304;
  }

  // 在地址上添加数据
  addParam() {
    const { params } = this.options;
    if (!params) return "";
    return addUrlData(this.url, serialize(params));
  }

  // 设置responseType
  setResponseType() {
    this.xhr.responseType = this.options.responseType;
  }

  // 设置超时
  setTimeout() {
    const { timeoutTime } = this.options;
    if (timeoutTime > 0) {
      this.xhr.timeout = timeoutTime;
    }
  }

  // 设置跨域是否携带cookie
  setCookie() {
    const { withCredentials } = this.options;
    if (withCredentials) {
      this.xhr.withCredentials = true;
    }
  }

  // 发送请求
  sendData() {
    const xhr = this.xhr;

    if (!this.isSendData()) {
      return xhr.send(null);
    }

    let resultData = null;
    const { data } = this.options;

    // 发送FormData格式数据
    if (this.isFormData()) {
      resultData = data;
      // 发送form-urlencoded格式数据
    } else if (this.isFormURLEncodedData()) {
      this.setContentType(CONTENT_TYPE_FORM_URLENCODED);
      resultData = serialize(data);
      // 发送JSON格式数据
    } else if (this.isJSONData()) {
      this.setContentType(CONTENT_TYPE_JSON);
      resultData = serializeJSON(data);
      // 发送其他格式数据
    } else {
      this.setContentType();
      resultData = data;
    }

    return xhr.send(resultData);
  }

  // 是否需要使用sendData发送数据
  isSendData() {
    const { data, method } = this.options;
    if (!data) return false;
    if (method.toLowerCase() === HTTP_GET.toLowerCase()) return false;
    return true;
  }

  // 判断是否发送FormData格式的数据
  isFormData() {
    return this.options.data instanceof FormData;
  }

  // 判断是否发送application/x-www-form-urlencoded格式的数据
  isFormURLEncodedData() {
    return this.options.contentType
      .toLowerCase()
      .includes(CONTENT_TYPE_FORM_URLENCODED);
  }

  // 判断是否发送JSON格式的数据
  isJSONData() {
    return this.options.contentType.toLowerCase().includes(CONTENT_TYPE_JSON);
  }

  // 设置发送的数据格式contentType
  setContentType(contentType = this.options.contentType) {
    if (!contentType) return;
    this.xhr.setRequestHeader("Content-Type", contentType);
  }

  // 获取XHR对象
  getXHR() {
    return this.xhr;
  }
}

export default Ajax;
