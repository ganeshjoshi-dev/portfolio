/**
 * Wordle word list: wordlist-english (SCOWL) + fallback common 5-letter words.
 * The American spelling lists have very few 5-letter words, so we merge with a
 * large list of common words so normal guesses (hello, world, hurry, etc.) are valid.
 */

import american10 from 'wordlist-english/american-words-10.json';
import american20 from 'wordlist-english/american-words-20.json';
import american35 from 'wordlist-english/american-words-35.json';
import american40 from 'wordlist-english/american-words-40.json';

const LEN = 5;

function filterFiveLetter(words: readonly string[]): string[] {
  return words
    .filter((w) => typeof w === 'string' && w.length === LEN && /^[a-z]+$/.test(w.toLowerCase()))
    .map((w) => w.toLowerCase());
}

/** Common 5-letter words for answers and valid guesses (fallback when library has few). */
const commonFiveLetterWords: string[] = [
  'about', 'above', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert',
  'alike', 'alive', 'allow', 'alone', 'along', 'alter', 'among', 'angel', 'anger', 'angle',
  'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'array', 'aside', 'asset',
  'avoid', 'await', 'aware', 'badly', 'baker', 'bases', 'basic', 'basis', 'beach', 'began',
  'begin', 'begun', 'being', 'below', 'bench', 'birth', 'black', 'blade', 'blame', 'blank',
  'blast', 'bleed', 'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand',
  'brass', 'bread', 'break', 'breed', 'brief', 'bring', 'broad', 'broke', 'build', 'built',
  'burst', 'buyer', 'cabin', 'cache', 'candy', 'carry', 'catch', 'cause', 'chain', 'chair',
  'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child', 'china', 'claim', 'class',
  'clean', 'clear', 'click', 'climb', 'clock', 'close', 'cloth', 'cloud', 'coach', 'coast',
  'color', 'could', 'count', 'court', 'cover', 'crack', 'craft', 'crash', 'crazy', 'cream',
  'crime', 'cross', 'crowd', 'crown', 'curve', 'cycle', 'daily', 'dance', 'death', 'delay',
  'delta', 'dirty', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'drawn', 'dream', 'dress',
  'drink', 'drive', 'drove', 'dying', 'eager', 'early', 'earth', 'eight', 'elder', 'elect',
  'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'event', 'every', 'exact',
  'exist', 'extra', 'faith', 'false', 'fault', 'favor', 'fence', 'fewer', 'field', 'fifth',
  'fifty', 'fight', 'final', 'first', 'fixed', 'flash', 'floor', 'fluid', 'focus', 'force',
  'forth', 'forty', 'forum', 'found', 'frame', 'fresh', 'front', 'fruit', 'fully', 'glass',
  'globe', 'grace', 'grade', 'grain', 'grand', 'grant', 'grass', 'great', 'green', 'gross',
  'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'heart', 'heavy', 'hello',
  'hence', 'horse', 'hotel', 'house', 'human', 'hurry', 'ideal', 'image', 'index', 'inner',
  'input', 'issue', 'joint', 'judge', 'juice', 'known', 'label', 'large', 'laser', 'later',
  'laugh', 'layer', 'learn', 'least', 'leave', 'legal', 'level', 'light', 'limit', 'local',
  'logic', 'loose', 'loved', 'lunch', 'major', 'maker', 'march', 'match', 'maybe', 'media',
  'metal', 'meter', 'midst', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month',
  'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie', 'music', 'naked', 'never', 'night',
  'noise', 'north', 'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'order', 'other',
  'ought', 'outer', 'owner', 'paint', 'panel', 'paper', 'party', 'peace', 'phase', 'phone',
  'photo', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point',
  'pound', 'power', 'press', 'price', 'prime', 'print', 'prior', 'prize', 'proof', 'proud',
  'prove', 'quick', 'quiet', 'quite', 'quote', 'radio', 'raise', 'range', 'rapid', 'ratio',
  'reach', 'ready', 'refer', 'right', 'river', 'roman', 'rough', 'round', 'route', 'royal',
  'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape',
  'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shirt', 'shock', 'shoot', 'short',
  'shown', 'sight', 'since', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smoke',
  'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend',
  'split', 'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam',
  'steel', 'stick', 'still', 'stock', 'stone', 'store', 'storm', 'story', 'strip', 'stuck',
  'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table', 'taken', 'taste',
  'teach', 'teeth', 'thank', 'theme', 'there', 'these', 'thick', 'thing', 'think', 'third',
  'those', 'three', 'throw', 'tight', 'today', 'total', 'touch', 'tough', 'tower', 'track',
  'trade', 'train', 'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'truly', 'trust',
  'truth', 'twice', 'under', 'union', 'unity', 'until', 'upper', 'urban', 'usual', 'valid',
  'value', 'video', 'virus', 'visit', 'vital', 'voice', 'waste', 'watch', 'water', 'wheel',
  'where', 'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world', 'worry',
  'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'yield', 'young',
  'youth',
];

const wordleWords: string[] = (() => {
  const fromLibrary = [
    ...filterFiveLetter(american10 as string[]),
    ...filterFiveLetter(american20 as string[]),
    ...filterFiveLetter(american35 as string[]),
    ...filterFiveLetter(american40 as string[]),
  ];
  return [...new Set([...fromLibrary, ...commonFiveLetterWords])];
})();

export { wordleWords };

export function getRandomWordleWord(): string {
  const i = Math.floor(Math.random() * wordleWords.length);
  return wordleWords[i] ?? wordleWords[0];
}

export function isValidWordleWord(word: string): boolean {
  return wordleWords.includes(word.toLowerCase());
}
