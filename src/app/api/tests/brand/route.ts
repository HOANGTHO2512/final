import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import TestResult from '@/lib/models/TestResult';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
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

    const {
      bestDept,
      maxFit,
      hollandCode,
      radarData,
      topStrengths,
      topHolland,
      resumeDraft,
      answers,
    } = await request.json();

    await connectDB();

    // Create test result
    const testResult = new TestResult({
      userId: (decoded as any).userId,
      testType: 'brand',
      bestDept,
      maxFit,
      hollandCode,
      radarData,
      topStrengths,
      topHolland,
      resumeDraft,
      answers,
    });

    await testResult.save();

    // Update user with result reference and holland code
    await User.findByIdAndUpdate((decoded as any).userId, {
      brandTestResult: testResult._id,
      hollandCode: hollandCode,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Brand test result saved',
        resultId: testResult._id,
        hollandCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save brand test error:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
