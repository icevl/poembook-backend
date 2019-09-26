export class ParamsStorage {
    constructor() {
        this.params = {};
    }

    setParam(name, value) {
        this.params[name] = value;
    }

    compileTemplateString(template) {
        for (let key in this.params) {
            let regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, this.params[key]);
        }

        return template;
    }

    replaceParams(object) {
        let str = JSON.stringify(object);
        str = this.compileTemplateString(str);
        return JSON.parse(str);
    }
}
