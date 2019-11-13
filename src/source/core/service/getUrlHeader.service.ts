const request = require('request');

export class GetUrlHeader {

    public testUrlAddress: string;

    constructor(url: string) {
        this.testUrlAddress = url;
    }

    public send() {
        request(this.testUrlAddress, (error: any, response: any, body: string) => {
            console.log(response);
        });
    }
}
