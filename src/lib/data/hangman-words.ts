/**
 * Words by category for Hangman game.
 * 50+ words per category.
 */

export type HangmanCategory = 'animals' | 'countries' | 'fruits' | 'technology' | 'sports';

export const hangmanCategories: Record<HangmanCategory, string[]> = {
  animals: [
    'elephant', 'giraffe', 'kangaroo', 'penguin', 'dolphin', 'butterfly',
    'crocodile', 'hedgehog', 'octopus', 'squirrel', 'rhinoceros', 'hippopotamus',
    'chameleon', 'flamingo', 'porcupine', 'armadillo', 'platypus', 'peacock',
    'cheetah', 'leopard', 'panther', 'gorilla', 'chimpanzee', 'orangutan',
    'alligator', 'tortoise', 'hummingbird', 'woodpecker', 'pelican', 'ostrich',
    'zebra', 'buffalo', 'mongoose', 'raccoon', 'koala', 'wombat',
    'meerkat', 'sloth', 'anteater', 'tapir', 'llama', 'alpaca',
    'walrus', 'seal', 'otter', 'beaver', 'badger', 'ferret',
    'hamster', 'gerbil', 'guinea', 'parrot', 'macaw', 'cockatoo',
    'falcon', 'eagle', 'hawk', 'owl', 'vulture', 'stork',
  ],
  countries: [
    'australia', 'brazil', 'canada', 'denmark', 'egypt', 'finland',
    'germany', 'hungary', 'iceland', 'japan', 'kenya', 'lebanon',
    'morocco', 'norway', 'oman', 'poland', 'qatar', 'russia',
    'spain', 'turkey', 'ukraine', 'vietnam', 'yemen', 'zambia',
    'albania', 'belgium', 'croatia', 'estonia', 'france', 'greece',
    'ireland', 'italy', 'jordan', 'latvia', 'malta', 'monaco',
    'netherlands', 'portugal', 'romania', 'sweden', 'switzerland',
    'thailand', 'uruguay', 'austria', 'bulgaria', 'cyprus', 'indonesia',
    'mexico', 'nigeria', 'pakistan', 'singapore', 'argentina', 'colombia',
    'ecuador', 'ethiopia', 'ghana', 'israel', 'malaysia', 'philippines',
    'slovakia', 'tanzania', 'venezuela', 'afghanistan', 'bangladesh',
  ],
  fruits: [
    'apple', 'banana', 'orange', 'grape', 'mango', 'melon',
    'peach', 'pear', 'plum', 'cherry', 'berry', 'strawberry',
    'blueberry', 'blackberry', 'raspberry', 'cranberry', 'watermelon',
    'pineapple', 'coconut', 'papaya', 'avocado', 'kiwi', 'lime',
    'lemon', 'apricot', 'fig', 'date', 'prune', 'raisin',
    'grapefruit', 'tangerine', 'clementine', 'pomegranate', 'persimmon',
    'dragonfruit', 'passionfruit', 'guava', 'lychee', 'mangosteen',
    'durian', 'jackfruit', 'starfruit', 'cantaloupe', 'honeydew',
    'blackcurrant', 'redcurrant', 'gooseberry', 'elderberry', 'boysenberry',
    'loganberry', 'mulberry', 'acai', 'elderberry', 'cranberry',
    'bilberry', 'cloudberry', 'huckleberry', 'juniper', 'quince',
  ],
  technology: [
    'computer', 'keyboard', 'monitor', 'browser', 'network', 'server',
    'database', 'software', 'hardware', 'algorithm', 'function', 'variable',
    'internet', 'website', 'application', 'interface', 'protocol',
    'firewall', 'encryption', 'password', 'username', 'download',
    'upload', 'streaming', 'bandwidth', 'processor', 'memory', 'storage',
    'bluetooth', 'wireless', 'ethernet', 'router', 'modem', 'cable',
    'javascript', 'typescript', 'python', 'framework', 'library',
    'database', 'query', 'backend', 'frontend', 'api', 'sdk',
    'cloud', 'serverless', 'container', 'kubernetes', 'docker',
    'machine', 'learning', 'artificial', 'neural', 'blockchain',
    'cryptocurrency', 'bitcoin', 'ethereum', 'smartphone', 'tablet',
    'laptop', 'desktop', 'peripheral', 'microphone', 'headphones',
  ],
  sports: [
    'football', 'basketball', 'baseball', 'volleyball', 'tennis', 'hockey',
    'cricket', 'rugby', 'golf', 'boxing', 'wrestling', 'swimming',
    'running', 'cycling', 'skiing', 'surfing', 'sailing', 'rowing',
    'marathon', 'sprint', 'javelin', 'discus', 'hammer', 'pole',
    'gymnastics', 'diving', 'fencing', 'archery', 'shooting', 'badminton',
    'squash', 'tabletennis', 'bowling', 'curling', 'lacrosse', 'handball',
    'waterpolo', 'triathlon', 'pentathlon', 'decathlon', 'kickboxing',
    'judo', 'karate', 'taekwondo', 'sumo', 'weightlifting', 'crossfit',
    'climbing', 'skateboarding', 'snowboarding', 'paragliding', 'kayaking',
    'canoeing', 'paddleboard', 'snorkeling', 'scuba', 'biathlon',
  ],
};

export function getRandomHangmanWord(category: HangmanCategory): string {
  const words = hangmanCategories[category];
  const i = Math.floor(Math.random() * words.length);
  return words[i] ?? words[0];
}

export function getAllHangmanCategories(): HangmanCategory[] {
  return Object.keys(hangmanCategories) as HangmanCategory[];
}

export function getCategoryDisplayName(category: HangmanCategory): string {
  const names: Record<HangmanCategory, string> = {
    animals: 'Animals',
    countries: 'Countries',
    fruits: 'Fruits',
    technology: 'Technology',
    sports: 'Sports',
  };
  return names[category];
}
