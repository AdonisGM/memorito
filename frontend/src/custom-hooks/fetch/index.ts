import axios from 'axios';
import { useLocalStorage } from '../local-manage';
import { useEffect, useState } from 'react';
import useApis from '../api';

enum StatusEnum {
  IDLE,
  FETCHING,
  SUCCESS,
  FAIL,
}

const useFetch = (name: string) => {
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
    body?: BodyInit;
    params?: {
      [name: string]: string
    };
  }) => {
    const api = apis.get(name);
    if (!api) return;

    setStatus(StatusEnum.FETCHING);
    try {
      const response = await axios(api.url, {
        params: dataRequest?.params,
        data: dataRequest?.body,
        baseURL: getEndpoint(),
        method: api.method,
        headers: {
          'Content-Type': api.contextType,
        },
        timeout: 5000,
      });

      setData(response.data);
      setStatus(StatusEnum.SUCCESS);
    } catch (e) {
      setStatus(StatusEnum.FAIL);
    }
  };

  return [execute, data, status];
};

export default useFetch;