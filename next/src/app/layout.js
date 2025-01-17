import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

import './globals.css';
import Header from '@/components/Header/Header';
import StoreProvider from './StoreProvider';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <StoreProvider>
      <html lang="en">
        <body>
          <Header/>
          {children}
        </body>
      </html>
      </StoreProvider>
    </ClerkProvider>
  )
}