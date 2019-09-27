import poem from './poem';
import Analyzer from './Analyzer';

const processor = new Analyzer(poem.text);
processor.analyze();
