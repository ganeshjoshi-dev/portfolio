export interface GitignoreGroup {
  id: string;
  name: string;
  entries: { pattern: string; comment?: string }[];
}

export const GITIGNORE_GROUPS: GitignoreGroup[] = [
  {
    id: 'os',
    name: 'Operating System',
    entries: [
      { pattern: '.DS_Store', comment: 'macOS' },
      { pattern: 'Thumbs.db', comment: 'Windows' },
      { pattern: 'desktop.ini', comment: 'Windows' },
      { pattern: '*.swp', comment: 'Vim' },
      { pattern: '*.swo', comment: 'Vim' },
      { pattern: '*~', comment: 'Backup files' },
    ],
  },
  {
    id: 'editors',
    name: 'Editors & IDEs',
    entries: [
      { pattern: '.vscode/', comment: 'VS Code (optional: remove to share settings)' },
      { pattern: '.idea/', comment: 'JetBrains IDEs' },
      { pattern: '*.sublime-workspace', comment: 'Sublime Text' },
      { pattern: '*.sublime-project', comment: 'Sublime Text' },
    ],
  },
  {
    id: 'node',
    name: 'Node.js',
    entries: [
      { pattern: 'node_modules/' },
      { pattern: 'npm-debug.log*' },
      { pattern: 'yarn-debug.log*' },
      { pattern: 'yarn-error.log*' },
      { pattern: '.pnpm-debug.log*' },
      { pattern: '.npm' },
      { pattern: '.yarn-integrity' },
      { pattern: '.pnp.*' },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    entries: [
      { pattern: '__pycache__/' },
      { pattern: '*.py[cod]' },
      { pattern: '*$py.class' },
      { pattern: '*.so' },
      { pattern: '.Python' },
      { pattern: 'venv/' },
      { pattern: 'env/' },
      { pattern: '.venv/' },
      { pattern: '*.egg-info/' },
      { pattern: '*.egg' },
      { pattern: '.eggs/' },
      { pattern: '.tox/' },
      { pattern: '.nox/' },
      { pattern: '.coverage' },
      { pattern: '.pytest_cache/' },
    ],
  },
  {
    id: 'java',
    name: 'Java',
    entries: [
      { pattern: '*.class' },
      { pattern: '*.jar' },
      { pattern: '*.war' },
      { pattern: 'target/' },
      { pattern: '.gradle/' },
      { pattern: 'build/' },
    ],
  },
  {
    id: 'dotnet',
    name: '.NET',
    entries: [
      { pattern: 'bin/' },
      { pattern: 'obj/' },
      { pattern: '*.user' },
      { pattern: '*.suo' },
      { pattern: '*.cache' },
      { pattern: 'packages/' },
    ],
  },
  {
    id: 'rust',
    name: 'Rust',
    entries: [
      { pattern: 'target/' },
      { pattern: 'Cargo.lock', comment: 'optional: remove for libraries' },
    ],
  },
  {
    id: 'go',
    name: 'Go',
    entries: [
      { pattern: '*.exe' },
      { pattern: '*.test' },
      { pattern: 'vendor/' },
      { pattern: '*.out' },
    ],
  },
  {
    id: 'docker',
    name: 'Docker',
    entries: [
      { pattern: '*.log' },
      { pattern: '.dockerignore' },
    ],
  },
  {
    id: 'logs',
    name: 'Logs & temp',
    entries: [
      { pattern: 'logs/' },
      { pattern: '*.log' },
      { pattern: 'tmp/' },
      { pattern: 'temp/' },
      { pattern: '*.tmp' },
    ],
  },
  {
    id: 'env',
    name: 'Environment & secrets',
    entries: [
      { pattern: '.env' },
      { pattern: '.env.local' },
      { pattern: '.env.*.local' },
      { pattern: '*.pem' },
      { pattern: '.secrets' },
    ],
  },
  {
    id: 'next',
    name: 'Next.js',
    entries: [
      { pattern: '.next/' },
      { pattern: 'out/' },
    ],
  },
  {
    id: 'nuxt',
    name: 'Nuxt',
    entries: [
      { pattern: '.nuxt/' },
      { pattern: 'dist/' },
    ],
  },
  {
    id: 'vite',
    name: 'Vite / build',
    entries: [
      { pattern: 'dist/' },
      { pattern: 'dist-ssr/' },
      { pattern: '*.local' },
    ],
  },
];
