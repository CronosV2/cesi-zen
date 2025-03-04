import localFont from 'next/font/local';

export const marianne = localFont({
  src: [
    {
      path: './fonts/Marianne-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Marianne-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Marianne-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-marianne',
}); 