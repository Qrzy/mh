import jsBbCodeParser from 'js-bbcode-parser/dist/simple.esm.js';
import { BbCodeParser } from '@/composables/useGeeklist/types';

export const bbCodeParser: BbCodeParser = jsBbCodeParser.parse.bind(jsBbCodeParser);
