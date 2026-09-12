import { redirect } from 'next/navigation';

export default function PGRoomsPage() {
  redirect('/search?type=pg');
}
