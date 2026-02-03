# CareerDNA - Next.js 遷移指南

本文檔說明如何從 React 版本遷移到 Next.js 版本，並配置 MongoDB 後端。

## 📋 系統架構

### Next.js MVC 結構
```
nextjs/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API 路由 (Controllers)
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── tests/        # 測試結果 endpoints
│   │   │   └── resume/       # 履歷 endpoints
│   │   ├── (pages)/          # 頁面路由
│   │   │   ├── brand-test/
│   │   │   ├── career-fit/
│   │   │   └── career-fit-pro/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # 首頁
│   │   └── globals.css
│   ├── components/           # React Components (Views)
│   │   ├── Navbar.tsx
│   │   ├── AuthModal.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── ChatBot.tsx
│   │   ├── RadarChart.tsx
│   │   ├── GaugeChart.tsx
│   │   ├── Footer.tsx
│   │   └── Chip.tsx
│   ├── context/              # React Context (State Management)
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── models/           # Mongoose Models
│   │   │   ├── User.ts
│   │   │   ├── TestResult.ts
│   │   │   └── Resume.ts
│   │   ├── db/               # Database Connection
│   │   │   └── mongodb.ts
│   │   └── middleware/       # Authentication Middleware
│   │       └── auth.ts
│   └── data/                 # Static Data
│       ├── quizData.ts
│       └── careerData.ts
├── .env.example              # 環境變數範本
└── package.json
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
cd nextjs
npm install
```

### 2. 配置環境變數

複製 `.env.example` 創建 `.env.local`：

```bash
cp .env.example .env.local
```

然後編輯 `.env.local` 填入你的設定：

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@your-cluster.mongodb.net/careerdna?retryWrites=true&w=majority

# JWT Secret (生成強密鑰)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Gemini API Key (用於 ChatBot)
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

應用將在 `http://localhost:3000` 運行。

## 📦 API 路由說明

### 認證 (Authentication)

#### `POST /api/auth/register`
註冊新用戶

**Request:**
```json
{
  "username": "johndoe",
  "password": "securepassword",
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "...",
  "username": "johndoe"
}
```

#### `POST /api/auth/login`
用戶登入

**Request:**
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "...",
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `GET /api/auth/me`
獲取當前用戶信息

**Headers:**
```
Authorization: Bearer <token>
```

#### `PUT /api/auth/profile`
更新用戶檔案

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "department": "CS",
  "grade": "Junior",
  "studentId": "A123456"
}
```

### 測試結果 (Test Results)

#### `POST /api/tests/brand`
保存品牌測評結果

#### `POST /api/tests/career-fit`
保存職涯適配測評結果

#### `GET /api/tests`
獲取用戶所有測評結果

#### `GET /api/tests/[resultId]`
獲取特定測評結果

### 履歷 (Resume)

#### `POST /api/resume`
創建或更新履歷

#### `GET /api/resume`
獲取用戶履歷

#### `DELETE /api/resume`
刪除用戶履歷

## 🔐 認證流程

1. **用戶註冊/登入** → 調用 `/api/auth/register` 或 `/api/auth/login`
2. **獲得 JWT Token** → 保存在 localStorage 和 HTTP-only Cookie
3. **後續請求** → Authorization header: `Bearer <token>`
4. **Token 驗證** → `verifyToken()` 中間件驗證

## 📊 MongoDB Schema

### User
```typescript
{
  username: string (unique, required)
  password: string (hashed)
  email: string (unique)
  name: string
  studentId: string
  department: string
  grade: string
  hollandCode: string
  brandTestResult: ObjectId (ref: TestResult)
  careerFitResult: ObjectId (ref: TestResult)
  resume: ObjectId (ref: Resume)
  createdAt: Date
  updatedAt: Date
}
```

### TestResult
```typescript
{
  userId: ObjectId (ref: User, required)
  testType: 'brand' | 'careerFit'
  
  // Brand test fields
  bestDept: string
  maxFit: number
  hollandCode: string
  radarData: number[]
  topStrengths: [{code, name, score}]
  topHolland: [{code, name, score}]
  resumeDraft: string
  
  // Career fit fields
  totalScore: number
  dimensions: {academic, practical, skill, match, communication}
  strengths: string[]
  weaknesses: string[]
  actionPlan: [{day, action}]
  recommendations: string[]
  
  answers: object (raw quiz answers)
  completedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### Resume
```typescript
{
  userId: ObjectId (ref: User, required)
  name: string
  email: string
  phone: string
  linkedIn: string
  
  education: [{school, degree, fieldOfStudy, startDate, endDate}]
  experience: [{company, position, startDate, endDate, description}]
  skills: [{name, proficiency}]
  certifications: [{name, issuer, date}]
  
  hollandCode: string
  topStrengths: string[]
  selfIntroduction: string
  brandStatement: string
  actionItems: string[]
  
  aiGeneratedSections: {
    motivation: string
    keyAchievements: string[]
    futureGoals: string
  }
  
  version: number
  lastModified: Date
  createdAt: Date
  updatedAt: Date
}
```

## 🔄 遷移核心差異

| React | Next.js |
|-------|---------|
| React Router | App Router (file-based routing) |
| Context API | Context API + Hooks |
| Axios client | API Routes 內 Mongoose |
| Express server | Built-in API Routes |
| localStorage | localStorage + HTTP-only Cookies |
| .env / VITE | .env.local / Node.js |

## 📝 開發流程

### 添加新的 API endpoint

1. 在 `src/app/api/` 創建新文件夾
2. 創建 `route.ts` 檔案
3. 使用 `connectDB()` 連接 MongoDB
4. 使用 `verifyToken()` 驗證認證

```typescript
// src/app/api/example/route.ts
import { connectDB } from '@/lib/db/mongodb';
import { verifyToken } from '@/lib/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'No token' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    
    // Your logic here
    
    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

### 添加新的前端頁面

1. 在 `src/app/(pages)/` 創建新文件夾
2. 創建 `page.tsx` 檔案
3. 使用 `useAuth()` Hook 獲取認證狀態

```typescript
// src/app/(pages)/example/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function ExamplePage() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    redirect('/');
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
    </div>
  );
}
```

## 🛠 構建和部署

### 開發構建
```bash
npm run dev
```

### 生產構建
```bash
npm run build
npm start
```

### 部署到 Vercel

```bash
npm install -g vercel
vercel
```

## 📚 后续功能開發

- [ ] 完整的品牌測評頁面（30 題問卷）
- [ ] 職涯適配測評計算引擎
- [ ] AI ChatBot 集成 (Google Gemini)
- [ ] 履歷 AI 生成功能
- [ ] 用戶檔案編輯頁面
- [ ] 測評歷史記錄頁面
- [ ] 數據可視化（Radar Chart、Gauge Chart）
- [ ] 個人品牌建議引擎
- [ ] 文件匯出功能 (PDF、Word)

## 🐛 常見問題

### MongoDB 連接失敗
確保 `.env.local` 中的 `MONGO_URI` 正確，並且數據庫允許你的 IP 地址訪問。

### 認證失敗
檢查 JWT 令牌是否正確傳遞。客戶端應在請求頭中發送：
```
Authorization: Bearer <your-token>
```

### CORS 錯誤
API Routes 與前端在同一域名上，不應有 CORS 問題。如果有問題，確保請求格式正確。

## 📞 支持

有任何問題，請參考：
- [Next.js 官方文檔](https://nextjs.org/docs)
- [MongoDB Mongoose 文檔](https://mongoosejs.com)
- [TypeScript 文檔](https://www.typescriptlang.org/docs)

---

**最後更新：2024年**
