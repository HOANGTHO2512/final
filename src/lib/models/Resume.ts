import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Personal Info
    name: String,
    email: String,
    phone: String,
    linkedIn: String,

    // Education
    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        startDate: String,
        endDate: String,
      },
    ],

    // Experience
    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    // Skills
    skills: [
      {
        name: String,
        proficiency: String,
      },
    ],

    // Certifications
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
      },
    ],

    // Holland Code & Strengths
    hollandCode: String,
    topStrengths: [String],

    // Auto-generated sections
    selfIntroduction: String,
    brandStatement: String,
    actionItems: [String],

    // AI-Generated Content
    aiGeneratedSections: {
      motivation: String,
      keyAchievements: [String],
      futureGoals: String,
    },

    // Metadata
    version: {
      type: Number,
      default: 1,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
