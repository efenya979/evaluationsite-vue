import axios from 'axios'
import console from 'console';
import store from '../store/index'

//异步请求默认超时时间设为10s
axios.defaults.timeout = 10000
axios.defaults.baseURL = 'http://localhost:20000/v1'

// 自定义判断元素类型JS
function toType(obj) {
    return {}.toString
        .call(obj)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase();
}
// 参数过滤函数
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key];
        }
        if (toType(o[key]) === "string") {
            o[key] = o[key].trim();
        } else if (toType(o[key]) === "object") {
            o[key] = filterNull(o[key]);
        } else if (toType(o[key]) === "array") {
            o[key] = filterNull(o[key]);
        }
    }
    return o;
}

// http request interceptors
var requestStore = store
axios.interceptors.request.use(
    config => {
        console.log(config.params)
        if (requestStore.state.token) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = "Bearer " + requestStore.state.token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
// http response interceptors
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    // Vuex模块化管理，调用具体的mutation需加上namespace
                    store.commit("identity/saveToken", "");
                    window.localStorage.removeItem("USER_NICKNAME");
                    applicationUserManager.login();
            }
        }
        return Promise.reject(error.response.data); // 返回接口返回的错误信息
    }
);

function apiAxios(method, url, params, success, failure) {
    if (params) {
        params = filterNull(params);
    }
    axios({
        method: method,
        url: url,
        data: method === "POST" || method === "PUT" ? params : null,
        params: method === "GET" || method === "DELETE" ? params : null,
        baseURL: root,
        // `headers` 是即将被发送的自定义请求头
        withCredentials: false
    })
        .then(function (res) {
            success(res.data);
        })
        .catch(function (err) {
            let res = err.response;
            if (err) {
                window.alert("api error, HTTP CODE: " + res.status);
                console.log('err message: ', err)
            }
        });
}

// 返回在vue模板中的调用接口
export default {
    get: function (url, params, success, failure) {
        return apiAxios("GET", url, params, success, failure);
    },
    post: function (url, params, success, failure) {
        return apiAxios("POST", url, params, success, failure);
    },
    put: function (url, params, success, failure) {
        return apiAxios("PUT", url, params, success, failure);
    },
    delete: function (url, params, success, failure) {
        return apiAxios("DELETE", url, params, success, failure);
    }
};