import * as faker from 'faker';

export class KlassFaker {
    compileTemplate(template) {
        // https://www.regextester.com/94730

        const regexp = new RegExp('{{faker\\..*?\\)}}', 'g');
        let compiledTemplate = template.replace(regexp, this.replacer.bind(this));
        return compiledTemplate;
    }

    compileObject(object) {
        let s = JSON.stringify(object);
        s = this.compileTemplate(s);
        return JSON.parse(s);
    }

    replacer(match, p1, p2, p3, offset, string) {
        let m = match.replace('{{', '');
        m = m.replace('()}}', '');
        let arr = m.split('.');

        const section = arr[1];
        const method = arr[2];
        return faker[section][method]();
    }
}
