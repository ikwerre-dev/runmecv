import { NextResponse } from 'next/server';
import { getJobStatus } from '@/services/jobQueue';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing job ID' }, { status: 400 });
  }

  try {
    const status = await getJobStatus(id);
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get job status' }, { status: 500 });
  }
}