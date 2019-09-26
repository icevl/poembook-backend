import request from 'request';
import { CoreOptions } from 'request';
import { ParamsStorage } from './ParamsStorage';

export class Sender {
    constructor(domain, storage) {
        this.domain = domain;
        this.storage = storage;
    }

    async send(req) {
        req = this.storage.replaceParams(req);
        console.log(`--> ${req.url}`);

        const method = req.method || 'post';

        const url = `http://${this.domain}${req.url}`;
        let options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...req.headers
            },
            body: req.body,
            json: true
        };

        let response = await this.httpRequest(url, options);

        if (req.log) {
            console.log(response.body);
        }

        if (response.body.errors) {
            console.log(response.body.errors);
        }

        if (req.expected) {
            const expected = req.expected;

            Sender.containAllProperties(expected.body, response.body);
        }

        this.saveParamsToStorage(req, response);

        return response;
    }

    saveParamsToStorage(req, response) {
        const paramsToSave = req.response;
        const data = response.body || null;
        let storedParams = {};

        if (paramsToSave && data) {
            storedParams = Object.keys(paramsToSave).reduce(
                (acc, item) => (item in data ? { ...acc, [item]: data[item] } : acc),
                {}
            );
        }

        if (Object.keys(storedParams).length) {
            console.log('===========');
            console.log(storedParams);
            console.log('===========');
            Object.keys(storedParams).forEach(item => this.storage.setParam(item, storedParams[item]));
        }
    }

    async httpRequest(uri, options) {
        return new Promise((resolve, reject) => {
            request(uri, options, (error, httpResponse, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                let statusCode = httpResponse.statusCode;
                resolve({ statusCode: statusCode, body: body });
            });
        });
    }

    static containAllProperties(small, big, level = '') {
        for (let key in small) {
            if (typeof small[key] === 'object') {
                level += `${level}.${key}`;
                Sender.containAllProperties(small[key], big[key], level);
            } else {
                if (small[key] != big[key]) {
                    throw new Error(`Expected param ${level}.${key}=${small[key]} But got: ${big[key]}`);
                }
            }
        }
    }
}
