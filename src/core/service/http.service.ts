import http        from 'http';
import url         from 'url';
import ClientCache from './clientCache.service';

export class Http {

    public url: string;
    public params: any;
    public headers: object;
    public method: string;
    public authToken: string | undefined;

    constructor(url: string, params: any = {}, headers: object = {}, method: string = 'POST') {
        this.url       = url;
        this.params    = params;
        this.method    = method;
        this.headers   = headers;
        this.authToken = undefined;

    }

    public async getAuthToken() {
        const localCacheSignStateInfo = await ClientCache('/user/signState').getSignState();
        if (localCacheSignStateInfo && localCacheSignStateInfo.token && localCacheSignStateInfo.token !== '') {
            this.authToken = localCacheSignStateInfo.token;
        } else {
            this.authToken = undefined;
        }
    }

    public Init(): any {

        let p;

        switch (this.method) {
            case 'POST':
                p = <any>this.POST();
                break;
            case 'GET':
                p = <any>this.GET();
                break;
        }

        return p;
    }

    public GET() {

    }

    public async POST() {

        await this.getAuthToken();

        return await new Promise((resolve, reject) => {

            const requestParams    = JSON.stringify(this.params);
            const urlObject        = url.parse(this.url);
            const hostname: string = urlObject.hostname || '';
            const port: number     = Number(urlObject.port) || 80;
            const path: string     = urlObject.path || '';

            const options: any = {
                hostname: hostname,
                port    : port,
                path    : path,
                method  : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                }
            };

            if (this.authToken) {
                options.headers['Auth-Token'] = this.authToken;
            }

            options.headers = Object.assign(options.headers, this.headers);

            const req = http.request(options, (res) => {
                res.setEncoding('utf8');
                let response: string = '';
                res.on('data', (chunk) => {
                    response += chunk;
                });
                res.on('end', () => {
                    try {
                        response = JSON.parse(response);
                        resolve(response);
                    } catch (e) {
                        reject({url: this.url, params: this.params, status: 1, message: `request '${this.url}' failed`});
                    }
                });
            });

            req.on('error', (e) => {
                reject(e);
            });

            req.write(requestParams);
            req.end();
        })
    }
}