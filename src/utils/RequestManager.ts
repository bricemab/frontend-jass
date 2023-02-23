import { Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import config from '../config/config';
// import { ApplicationReject, ApplicationResponse } from '../Types/GlobalType';
import Global from '@/utils/Global';
import { ApplicationReject, ApplicationResponse } from '@/Types/GlobalType';

export default class RequestManager {
  static createAxiosInstance () {
    return axios.create({
      baseURL: config.backendApiEndPoint,
      timeout: 1000 * 60, // 1 minutes
      headers: {
        'x-access-token': config.backendSecretKey
      }
    });
  }

  static asyncResolver (fn: any) {
    return function (request: any, response: any, next: any) {
      Promise.resolve(fn(request, response, next)).catch(function (error: any) {
        RequestManager.sendResponse(response, {
          success: false,
          error
        });
      });
    };
  }

  static sendResponse (
    response: Response,
    dataToSend: ApplicationResponse<any>,
    status?: number
  ) {
    if (dataToSend && dataToSend.success) {
      response.status(200).json(dataToSend);
    } else {
      response.status(status || 460).json({
        success: false,
        error: dataToSend.error
      });
    }
  }

  static executePost<DataType> (
    url: string,
    params: any,
    specialConfig?: AxiosRequestConfig
  ) {
    return new Promise<DataType>(function (resolve, reject: ApplicationReject) {
      Global.instanceAxios
        .post(url, params, specialConfig)
        .then(function (response) {
          const { status, data } = response;
          resolve(data);
        })
        .catch(function (error) {
          resolve(error.response.data);
        });
    });
  }
}
const instance = RequestManager.createAxiosInstance();
