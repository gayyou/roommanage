import axios from 'axios';
import router from '@/router/router';
import {message} from '@/utils/shared/message';
import {userManage} from "@/store/modules/UserManage";
import {getToken} from "@/utils/shared/localStorage";
import {isUndef} from "@/utils/shared";

let baseUrl: string;

if (process.env.NODE_ENV === 'production') {
  // 生产环境下使用真实路径
  baseUrl = 'http://47.106.213.116/api';
} else {
  // 非生产环境下，都使用代理服务器
  baseUrl = '/api/admin';
}

// @ts-ignore
const _Request = axios.create({
  baseURL: baseUrl,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 统一对请求进行处理
 */
_Request.interceptors.request.use((config: any): any => {
  // 当存在token的时候，将token加到请求头上面
  let token = getToken();
  // @ts-ignore
  if (!isUndef(token) && token.length != 0) {
    if (config.url.indexOf('?') == -1) {
      // 如果没有问号的话，那么就直接在后面添加下面内容
      config.url += '?tokens=' + token;
    } else if (config.url.indexOf('?') == config.url.length - 1) {
      // 如果问号是最后一个的话
      config.url += 'tokens=' + token;
    } else {
      config.url += '&tokens=' + token;
    }
  }

  return config;
}, error => {});

/**
 * 统一对返回的数据进行过滤
 */
_Request.interceptors.response.use((result: any): any => {
  let data = result.data;


  if (result.data.msg == '没有操作权限') {
    router.replace('/login');
  }

  // 当没有前面的问题的时候，返回请求对象的数据
  return result.data;

}, (error: any) => {
  // 请求发生错误的时候
  // let status = error.response.status;
  //
  // switch (status) {
  //   case 500: {
  //     // 服务器错误
  //     message.setNotice({
  //       title: '服务器发生500错误'
  //     });
  //     break;
  //   }
  //
  //   case 401: {
  //     // token没有权限，此时应当进行页面重定向
  //     router.go(-100000)
  //     router.push('/login');
  //     break;
  //   }
  //
  //   case 404: {
  //     // 发生404错误，这时候应当有所反应
  //     break;
  //   }
  //
  //   default: {
  //     // 请求发不出的问题
  //     message.setNotice({
  //       title: '请求发不出去，请检查您的网络'
  //     });
  //   }
  // }
  // console.log(error);

  return error;
});

interface ReturnData {
  status: number;
  message: string;
  data?: any;
}

export class Request {
  public get(url: string): Promise<ReturnData> {
    return _Request.get(url);
  }

  public post(url: string, data: any): Promise<ReturnData> {
    let token = getToken();
    // @ts-ignore
    if (!isUndef(token) && token.length != 0) {
      data['tokens'] = userManage.token;
    }
    return _Request.post(url, data);
  }

  public upload(url: string, data: any): Promise<ReturnData> {
    let token = getToken();
    // @ts-ignore
    if (!isUndef(token) && token.length != 0) {
      data['tokens'] = userManage.token;
    }
    return _Request.post(url, data, {
      headers:{'Content-Type':'multipart/form-data'}
    });
  }

  public put(url: string, data: any): Promise<ReturnData> {
    let token = getToken();
    // @ts-ignore
    if (!isUndef(token) && token.length != 0) {
      data['tokens'] = userManage.token;
    }
    return _Request.put(url, data);
  }

  public delete(url: string, data: any): Promise<ReturnData> {
    return _Request.delete(url);
  }
}
