export default class Analyzer {
    constructor(text) {
        this.text = text;

        this.lines = [];
        this.result = {
            count: {
                lines: 0,
                words: 0,
                strophes: 0
            },
            strophes: []
        };
    }

    getLines() {
        this.lines = this.text
            .trim()
            .split('\n')
            .reduce((acc, el) => [...acc, el.trim()], []);

        /**
         * Removing extra space between strophes
         */
        this.lines = this.lines
            .map((line, index) =>
                index === 0 || line !== '' || (line === '' && this.lines[index - 1] !== '') ? line : null
            )
            .filter(el => el !== null);

        /**
         * Count
         */
        this.result.count.lines = this.lines.reduce((acc, line) => (line !== '' ? acc + 1 : acc), 0);
        this.result.count.words = this.lines.reduce((acc, line) => acc + line.split(/\s+/).length, 0);
    }

    getStrophes() {
        const stropes = [];
        let stropesCount = 0;
        for (let i = 0; i < this.lines.length; i += 1) {
            const line = this.lines[i];
            if (i === 0 && line !== '') {
                stropes.push({ text: [line] });
                stropesCount += 1;
            }

            if (i > 0 && line !== '') {
                stropes[stropesCount - 1].text.push(line);
            }

            if (i > 0 && line === '') {
                stropes.push({ text: [] });
                stropesCount += 1;
            }
        }

        this.result.count.strophes = stropesCount;
        this.result.strophes = stropes;
    }

    processStrophe(index) {
        const strope = this.result.strophes[index];
        strope.lines = strope.text.length;

        this.results.strophes[index] = strope;
        /* eslint-disable no-console */
        console.log('text', strope);
    }

    processStrophes() {
        this.result.strophes.forEach((strope, index) => this.processStrophe(index));
    }

    analyze() {
        this.getLines();
        this.getStrophes();
        this.processStrophes();

        /* eslint-disable no-console */
        // console.log('LINES', this.lines);
        // console.log('Results', this.results);
    }

    get results() {
        return this.result;
    }
}
