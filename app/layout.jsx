import './globals.css';
import { Inter, Poppins, Cairo } from 'next/font/google';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata = {
  title: 'AGILICS - Détection Maladies Agricoles',
  description: 'Détectez et traitez les maladies des plantes au Maroc avec l\'IA',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AGILICS',
  },
  formatDetection: {
  telephone: false,
  email: false,
  address: false,
},
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#2D6A4F" />
        <meta name="description" content="Détectez et traitez les maladies des plantes au Maroc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AGILICS" />
      </head>
      <body className={`${inter.variable} ${cairo.variable} bg-background font-inter`}>
        <Providers>
          <Header />
          <main className="pb-20 md:pb-0">
            {children}
          </main>
          <BottomNav />
        </Providers>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/service-worker.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
