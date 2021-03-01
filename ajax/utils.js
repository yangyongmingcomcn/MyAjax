// 工具函数

// 序列化参数
const serialize = (param) => {
  const results = [];

  for (const [key, value] of Object.entries(param)) {
    results.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  return results.join("&");
};

// 给URL添加参数
const addUrlData = (url, data) => {
  if (!data) return "";
  const mark = url.includes("?") ? "&" : "?";
  return `${mark}${data}`;
};

// 序列化成JSON格式的字符串
const serializeJSON = (param) => {
  return JSON.stringify(param);
};

export { serialize, addUrlData, serializeJSON };
