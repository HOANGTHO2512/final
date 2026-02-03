import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Authentication
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    // Profile
    name: {
      type: String,
      default: '',
    },
    studentId: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    grade: {
      type: String,
      default: '',
    },

    // Test Results Reference
    brandTestResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestResult',
      default: null,
    },
    careerFitResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestResult',
      default: null,
    },

    // Resume Reference
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },

    // Holland Code (synced from Brand Test)
    hollandCode: {
      type: String,
      default: '',
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
