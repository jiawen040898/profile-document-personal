import { RawAxiosRequestHeaders } from 'axios';

export class AxiosHeaderBuilder {
    private headers: RawAxiosRequestHeaders;

    constructor(contentType = 'application/json') {
        this.headers = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': contentType,
        };
    }

    addHeader(header: { [key: string]: string }) {
        this.headers = {
            ...this.headers,
            ...header,
        };

        return this;
    }

    addAcceptEncoding(value: string) {
        return this.addHeader({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Accept-Encoding': value,
        });
    }

    addAcceptGzipEncoding() {
        this.addAcceptEncoding('gzip,deflate,compress');

        return this;
    }

    addAuthorization(value: string) {
        return this.addHeader({
            Authorization: value,
        });
    }

    addBearerAuthorizationToken(token: string) {
        return this.addAuthorization(`Bearer ${token}`);
    }

    build(): RawAxiosRequestHeaders {
        return this.headers;
    }
}
