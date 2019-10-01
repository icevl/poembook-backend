function buildPoemArray(text) {
    let lines = text
        .trim()
        .split('\n')
        .reduce((acc, el) => [...acc, el.trim()], []);

    /**
     * Removing extra space between strophes
     */
    lines = lines
        .map((line, index) =>
            index === 0 || line !== '' || (line === '' && this.lines[index - 1] !== '') ? line : null
        )
        .filter(el => el !== null);

    return lines;
}

export default { buildPoemArray };
