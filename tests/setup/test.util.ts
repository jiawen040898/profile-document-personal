import { AxiosResponse } from 'axios';

const mockAxiosResponse = <T>(obj: T): AxiosResponse<T> => {
    return {
        data: obj,
        status: 200,
        statusText: 'OK',
        headers: {} as SafeAny,
        config: {} as SafeAny,
    };
};

export const testUtil = {
    mockAxiosResponse,
};
