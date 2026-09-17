import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favorites',
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesPage() {
  redirect('/profile');
}
