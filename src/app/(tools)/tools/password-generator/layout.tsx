import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Generator - Create Strong Random Passwords Free',
  description: 'Free secure password generator. Create strong random passwords with custom length, uppercase, lowercase, numbers, and symbols. Generate multiple passwords instantly.',
  keywords: [
    'password generator',
    'strong password',
    'random password',
    'secure password',
    'password creator',
    'generate password',
    'password strength',
    'password maker',
    'complex password',
    'safe password',
    'random password generator',
    'strong password generator',
  ],
  openGraph: {
    title: 'Password Generator - Generate Strong Secure Passwords',
    description: 'Create cryptographically secure passwords with custom settings. Adjustable length, character types, and password strength indicator. Generate multiple passwords at once.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Password Generator - Strong Random Passwords',
    description: 'Generate secure passwords with custom length and character types. Free, fast, and cryptographically secure.',
  },
};

export default function PasswordGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
