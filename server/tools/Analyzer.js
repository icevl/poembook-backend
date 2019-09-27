export default class Analyzer {
    constructor(text) {
        this.text = text;

        this.lines = [];
        this.result = {};
    }

    processLines() {
        this.lines = this.text
            .trim()
            .split('\n')
            .reduce((acc, el) => [...acc, el.trim()], []);

        this.lines = this.lines
            .map((line, index) =>
                index === 0 || line !== '' || (line === '' && this.lines[index - 1] !== '') ? line : null
            )
            .filter(el => el !== null);
    }

    analyze() {
        this.processLines();

        /* eslint-disable no-console */
        console.log('LINES', this.lines);
    }

    get results() {
        return this.result;
    }
}
