import Disk from './Disk';
import * as path from 'path';
import * as fs from 'fs';
import { Sender } from './Sender';
import { ParamsStorage } from './ParamsStorage';
import { KlassFaker } from './KlassFaker';

async function main() {

   
    const arr = await getFlowArray();

    const storage = new ParamsStorage();
    const apiDomain = getAPIDomain();
    console.log(`  API Domain: ${apiDomain}`);
    const sender = new Sender(apiDomain, storage);
    const klassFaker = new KlassFaker();

    /*if (r.statusCode === 502) {
        throw new Error("API response 502");
    }*/

    for (let req of arr) {
        req = klassFaker.compileObject(req);
        let r = await sender.send(req);
    }
}

function getAPIDomain() {
    if (process.argv[3]) {
        return process.argv[3];
    }
    return 'localhost:4000';
}

function getFolder() {
    if (process.argv[2]) {
        return process.argv[2];
    }
    return 'default';
}

async function getFlowArray() {
    const seedsDir = path.resolve(__dirname, '../../seeds/' + getFolder());
    const disk = new Disk(seedsDir);
    let files = await disk.getFiles();
    console.log(files);
    let arr = [];
    for (let file of files) {
        const data = JSON.parse(fs.readFileSync(file).toString());
        arr = arr.concat(data);
    }

    arr = repeat(arr);

    return arr;
}

function repeat(arr) {
    let newArr = [];
    for (let item of arr) {
        let repeat = 1;
        if (item.repeat) {
            repeat = parseInt(item.repeat);
        }

        for (let i = 0; i < repeat; i++) {
            newArr.push(item);
        }
    }

    return newArr;
}

main();
