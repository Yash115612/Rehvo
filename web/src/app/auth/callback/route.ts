import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if user has a profile record, if not create one
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingProfile) {
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'REHVO User';

          await supabase.from('profiles').insert({
            id: user.id,
            full_name: fullName,
            email: user.email,
            profile_photo: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            role: 'renter',
            verification_status: 'unverified',
          });
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to login with error query param if exchange fails
  return NextResponse.redirect(`${origin}/login?error=oauth_exchange_failed`);
}
