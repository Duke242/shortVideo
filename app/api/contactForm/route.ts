import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, additional_info } = await request.json();

    const { data, error } = await supabase
      .from('contact_requests')
      .insert([{ name, email, phone, additional_info }]);

    if (error) throw error;

    return NextResponse.json({ message: 'Your request has been submitted successfully! We will get back to you shortly.' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting to Supabase:', error);
    return NextResponse.json({ message: 'An error occurred while submitting your request.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}