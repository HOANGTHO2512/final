# ⚡ 快速開始清單

## 🔧 初始化步驟

### Step 1: 安裝依賴 (2-3 分鐘)
```bash
cd nextjs
npm install
```

### Step 2: 配置 MongoDB (10 分鐘)
1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 創建帳戶
2. 創建新的 Cluster
3. 添加用戶認證
4. 複製連接字符串

### Step 3: 設置環境變數 (5 分鐘)
```bash
# 複製範本
cp .env.example .env.local

# 編輯 .env.local
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/careerdna?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-please-change-this
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Step 4: 啟動開發伺服器 (1 分鐘)
```bash
npm run dev
```

訪問: http://localhost:3000

## 📝 測試清單

### 認證功能測試
- [ ] 訪問首頁 `/` 
- [ ] 點擊「免費註冊」按鈕
- [ ] 填表並提交（檢查 MongoDB 中是否創建用戶）
- [ ] 使用註冊帳號登入
- [ ] 驗證首頁變為已登入狀態
- [ ] 點擊用戶頭像下拉菜單
- [ ] 測試登出功能

### 頁面導航測試
- [ ] 未登入時訪問 `/brand-test` → 應重定向回首頁
- [ ] 登入後訪問 `/brand-test` → 應顯示測評頁面
- [ ] 測試 `/career-fit` 和 `/career-fit-pro` 頁面

### API 測試（使用 Postman 或 curl）
```bash
# 1. 註冊
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "email": "test@test.com",
    "name": "Test User"
  }'

# 2. 登入
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'

# 3. 獲取用戶信息（使用上面返回的 token）
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛠 常見問題解決

### ❌ MongoDB 連接失敗
**症狀:** `MongooseError: Cannot connect to MongoDB`

**解決:**
1. 檢查 `MONGO_URI` 拼寫
2. 檢查 MongoDB Atlas IP 白名單
3. 確認數據庫用戶名和密碼正確

### ❌ 認證失敗
**症狀:** 登入按鈕無響應或返回 401 錯誤

**解決:**
1. 檢查 `JWT_SECRET` 是否設置
2. 確認用戶是否存在於 MongoDB
3. 檢查瀏覽器控制台的錯誤信息

### ❌ CORS 錯誤
**症狀:** 前端無法調用 API

**解決:**
- 確認 `NEXT_PUBLIC_API_URL` 與實際伺服器地址一致

### ❌ 編譯錯誤
**症狀:** `npm run dev` 失敗

**解決:**
1. 刪除 `node_modules` 和 `package-lock.json`
2. 重新安裝: `npm install`
3. 清除 Next.js 緩存: `rm -rf .next`

## 📊 數據庫驗證

### 使用 MongoDB Atlas 檢查數據
1. 登入 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 進入你的 Cluster
3. 點擊「Collections」
4. 應該看到 `users` 集合
5. 檢查是否有你建立的測試用戶

## 🎯 後續步驟

### Week 1: 基礎功能
- [ ] 完整品牌測評問卷實現
- [ ] 結果顯示頁面
- [ ] 用戶檔案編輯

### Week 2: 進階功能
- [ ] 職涯適配計算
- [ ] AI ChatBot 集成
- [ ] 履歷生成

### Week 3: 優化和部署
- [ ] 性能優化
- [ ] 安全檢查
- [ ] Vercel 部署

## 📞 快速參考

### 重要文件位置
- **API 路由:** `src/app/api/`
- **前端頁面:** `src/app/(pages)/`
- **React 組件:** `src/components/`
- **數據模型:** `src/lib/models/`
- **配置文件:** `src/lib/db/mongodb.ts`
- **認證:** `src/lib/middleware/auth.ts`
- **上下文:** `src/context/AuthContext.tsx`

### 有用的命令
```bash
# 開發
npm run dev

# 構建生產版本
npm run build

# 啟動生產伺服器
npm start

# 檢查代碼
npm run lint
```

### 環境變數
```env
# 必需
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

# 可選（ChatBot）
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key

# 通常無需改動
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## ✅ 檢查清單 - 開發準備

- [ ] Node.js 版本 >= 16
- [ ] npm 或 yarn 已安裝
- [ ] MongoDB Atlas 帳戶已創建
- [ ] .env.local 已配置
- [ ] `npm install` 已執行
- [ ] 開發伺服器可以啟動（`npm run dev`）
- [ ] 可以訪問 http://localhost:3000
- [ ] 可以註冊新用戶
- [ ] 可以登入/登出

## 🚀 部署準備

### 本地驗證
- [ ] 所有頁面都能加載
- [ ] 認證流程正常工作
- [ ] 沒有控制台錯誤
- [ ] 響應式設計在手機上正常

### 部署到 Vercel
```bash
# 1. 推送到 GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. 在 Vercel 連接 GitHub 倉庫
# 3. 設置環境變數
# 4. 部署
```

---

🎉 **現在你已準備好開始開發了！祝你編碼愉快！**
