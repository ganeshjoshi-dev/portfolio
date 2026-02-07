/** Short passages for typing speed test. Generic sentences, no copyrighted content. */
export const TYPING_PASSAGES = [
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.',
  'Practice makes perfect. Typing every day will help you get faster and more accurate over time.',
  'Technology changes the way we work and communicate. Learning new skills keeps us adaptable.',
  'The sun rises in the east and sets in the west. Every day brings new opportunities.',
  'Reading and writing are fundamental skills. They open doors to knowledge and creativity.',
  'Good habits take time to build. Start small and stay consistent with your goals.',
  'Coffee in the morning helps many people wake up. Tea is another popular choice worldwide.',
  'Birds fly south for the winter. They return when the weather gets warm again.',
  'Clean code is easy to read and maintain. Comments help explain the tricky parts.',
  'Music can improve your mood and focus. Many people listen while they work or study.',
  'Walking is one of the best exercises. It requires no equipment and can be done anywhere.',
  'Books contain ideas that can change how we think. Libraries keep these ideas available to all.',
  'Friends make life more enjoyable. Stay in touch with the people who matter to you.',
  'Water is essential for health. Drink enough throughout the day to stay hydrated.',
  'Sleep helps your body and mind recover. Most adults need seven to eight hours each night.',
];

export function getRandomPassage(): string {
  return TYPING_PASSAGES[Math.floor(Math.random() * TYPING_PASSAGES.length)]!;
}
