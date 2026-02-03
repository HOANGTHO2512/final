import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import TestResult from '@/lib/models/TestResult';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { resultId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const result = await TestResult.findById(params.resultId);

    if (!result) {
      return NextResponse.json(
        { message: 'Test result not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (result.userId.toString() !== (decoded as any).userId.toString()) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Get test result error:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
