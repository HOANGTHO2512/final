import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/middleware/auth';

export async function PUT(request: NextRequest) {
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

    const { hollandCode } = await request.json();

    await connectDB();

    const user = await User.findByIdAndUpdate(
      (decoded as any).userId,
      { hollandCode, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json(
      {
        message: 'Holland code updated',
        hollandCode: user.hollandCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update holland code error:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
