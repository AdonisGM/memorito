import axios from 'axios';
import { useLocalStorage } from '../local-manage';
import { useEffect, useState } from 'react';
import useApis from '../api';

export enum StatusEnum {
  IDLE,
  FETCHING,
  SUCCESS,
  FAIL,
}

const useFetch = (name: string): [((dataRequest: { body?: any; params?: { [p: string]: string } }) => Promise<void>), any, StatusEnum] => {
  const [data, setData] = useState<any>(undefined);
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.IDLE);

  const local = useLocalStorage();
  const apis = useApis();

  const getEndpoint = () => {
    const endpoint = local.endpoint.read();

    if (!endpoint) {
      local.endpoint.write('http://localhost:3333');
      return 'http://localhost:3333';
    }

    return endpoint;
  };

  const execute = async (dataRequest: {
    body?: any;
    params?: {
      [name: string]: string
    };
  }) => {
    const api = apis.get(name)!;

    setStatus(StatusEnum.FETCHING);
    try {
      // add token
      const response = await axios(api.url, {
        params: dataRequest?.params,
        data: dataRequest?.body,
        baseURL: getEndpoint(),
        method: api.method,
        headers: {
          'Content-Type': api.contextType,
          'Authorization': `Bearer ${local.accessToken.read()}`,
        },
        timeout: 5000,
      });

      setData(response.data);
      setStatus(StatusEnum.SUCCESS);
    } catch (e: any) {
      setData(e.response.data);
      setStatus(StatusEnum.FAIL);
    }
  };

  return [execute, data, status];
};

export default useFetch;