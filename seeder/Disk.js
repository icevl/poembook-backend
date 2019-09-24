import * as fs from 'fs';
import { PathLike } from 'fs';
import * as path from 'path';

export default class Disk {
    constructor(dir) {
        this.dir = dir;
    }

    getDir() {
        return this.dir;
    }

    async getFiles() {
        let dir = this.dir;
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                files.sort(this.sortFunction);
                let arr = [];
                for (let file of files) {
                    arr.push(path.resolve(this.dir.toString(), file));
                }
                resolve(arr);
            });
        });
    }

    async read(file) {
        let path = this.dir + '/' + file;

        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(data.toString());
            });
        });
    }

    sortFunction(a, b) {
        // take index prefix from file
        // Sample: 12__file_name.json  index=12

        let a1 = parseInt(a.split('__')[0]);
        let b1 = parseInt(b.split('__')[0]);
        if (a1 > b1) {
            return 1;
        }
        if (a1 < b1) {
            return -1;
        }
        return 0;
    }
}
