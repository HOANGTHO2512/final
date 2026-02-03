import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Resume from '@/lib/models/Resume';
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
      name,
      email,
      phone,
      linkedIn,
      education,
      experience,
      skills,
      certifications,
      hollandCode,
      topStrengths,
      selfIntroduction,
      brandStatement,
      actionItems,
      aiGeneratedSections,
    } = await request.json();

    await connectDB();

    // Check if resume already exists
    let resume = await Resume.findOne({ userId: (decoded as any).userId });

    if (resume) {
      // Update existing resume
      resume = await Resume.findByIdAndUpdate(
        resume._id,
        {
          name,
          email,
          phone,
          linkedIn,
          education,
          experience,
          skills,
          certifications,
          hollandCode,
          topStrengths,
          selfIntroduction,
          brandStatement,
          actionItems,
          aiGeneratedSections,
          version: resume.version + 1,
          lastModified: new Date(),
        },
        { new: true }
      );
    } else {
      // Create new resume
      resume = new Resume({
        userId: (decoded as any).userId,
        name,
        email,
        phone,
        linkedIn,
        education,
        experience,
        skills,
        certifications,
        hollandCode,
        topStrengths,
        selfIntroduction,
        brandStatement,
        actionItems,
        aiGeneratedSections,
      });

      await resume.save();

      // Update user with resume reference
      await User.findByIdAndUpdate((decoded as any).userId, {
        resume: resume._id,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(
      {
        message: 'Resume saved successfully',
        resumeId: resume._id,
        version: resume.version,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save resume error:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const resume = await Resume.findOne({ userId: (decoded as any).userId });

    if (!resume) {
      return NextResponse.json(
        { message: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resume, { status: 200 });
  } catch (error) {
    console.error('Get resume error:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    await Resume.deleteOne({ userId: (decoded as any).userId });

    await User.findByIdAndUpdate((decoded as any).userId, {
      resume: null,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Resume deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete resume error:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
