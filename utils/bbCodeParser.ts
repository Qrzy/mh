import jsBbCodeParser from 'js-bbcode-parser/dist/simple.esm.js';
import { BbCodeParser } from '~/composables/useMhGeeklist/types';

export const bbCodeParser: BbCodeParser = jsBbCodeParser.parse.bind(jsBbCodeParser);
