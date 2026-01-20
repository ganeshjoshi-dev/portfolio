import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timestamp Converter - Unix Epoch to Date & Time',
  description: 'Free timestamp converter. Convert Unix timestamps to human-readable dates and vice versa. Support for multiple timezones and formats. Current timestamp included.',
  keywords: [
    'timestamp converter',
    'unix timestamp',
    'epoch converter',
    'unix time',
    'timestamp to date',
    'date to timestamp',
    'epoch time',
    'unix epoch',
    'time converter',
    'milliseconds to date',
  ],
  openGraph: {
    title: 'Timestamp Converter - Unix Epoch & Date Conversion',
    description: 'Convert between Unix timestamps and human-readable dates. Support for multiple timezones and formats.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timestamp Converter - Unix Time to Date',
    description: 'Convert Unix timestamps to dates and vice versa. Multiple timezone support.',
  },
};

export default function TimestampConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
