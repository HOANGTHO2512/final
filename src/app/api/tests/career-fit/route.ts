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
      totalScore,
      dimensions,
      strengths,
      weaknesses,
      actionPlan,
      recommendations,
      answers,
    } = await request.json();

    await connectDB();

    // Create test result
    const testResult = new TestResult({
      userId: (decoded as any).userId,
      testType: 'careerFit',
      totalScore,
      dimensions,
      strengths,
      weaknesses,
      actionPlan,
      recommendations,
      answers,
    });

    await testResult.save();

    // Update user with result reference
    await User.findByIdAndUpdate((decoded as any).userId, {
      careerFitResult: testResult._id,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Career fit result saved',
        resultId: testResult._id,
        totalScore,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save career fit test error:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
