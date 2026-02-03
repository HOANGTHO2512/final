import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    testType: {
      type: String,
      enum: ['brand', 'careerFit'],
      required: true,
    },

    // Brand Test Results
    bestDept: String,
    maxFit: Number,
    hollandCode: String,
    radarData: [Number],
    topStrengths: [
      {
        code: String,
        name: String,
        score: Number,
      },
    ],
    topHolland: [
      {
        code: String,
        name: String,
        score: Number,
      },
    ],
    resumeDraft: String,

    // Career Fit Results
    totalScore: Number,
    dimensions: {
      academic: Number,
      practical: Number,
      skill: Number,
      match: Number,
      communication: Number,
    },
    strengths: [String],
    weaknesses: [String],
    actionPlan: [
      {
        day: String,
        action: String,
      },
    ],
    recommendations: [String],

    // Metadata
    answers: mongoose.Schema.Types.Mixed,
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TestResult || mongoose.model('TestResult', testResultSchema);
