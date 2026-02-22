import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


export async function GET(_request: Request) {
  return NextResponse.json(
    { error: 'Not implemented', message: 'Quality snapshots schema not yet provisioned' },
    { status: 503 },
  );
}
