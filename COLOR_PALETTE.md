# 🎨 Bảng Màu Dự Án Career Fit Pro

## 📊 Color Palette Chính

### Primary Colors (Màu Chính)
- **Primary Blue**: `#2563EB` - Màu xanh dương chính, đại diện cho tín cậy và chuyên nghiệp
- **Primary Purple**: `#7C3AED` - Màu tím, đại diện cho sáng tạo và tương lai
- **Primary Green**: `#10B981` - Màu xanh lá, đại diện cho tăng trưởng và thành công

### Secondary Colors (Màu Phụ)
- **Light Blue**: `#3B82F6` - Xanh nhạt cho hover states
- **Light Purple**: `#A78BFA` - Tím nhạt cho backgrounds
- **Light Green**: `#6EE7B7` - Xanh nhạt cho accents

### Neutral Colors (Màu Trung Tính)
- **White**: `#FFFFFF` - Nền chính
- **Light Gray**: `#F3F4F6` - Nền phụ, cards
- **Gray**: `#9CA3AF` - Text phụ
- **Dark Gray**: `#374151` - Text chính
- **Black**: `#111827` - Text đậm nhất

### Status Colors (Màu Trạng Thái)
- **Success**: `#10B981` - Thành công, xác nhận
- **Warning**: `#F59E0B` - Cảnh báo, chú ý
- **Error**: `#EF4444` - Lỗi, nguy hiểm
- **Info**: `#0EA5E9` - Thông tin, gợi ý

---

## 🎯 Cách Sử Dụng

### Thêm vào `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        accent: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#0EA5E9',
      },
    },
  },
  plugins: [],
}
```

### Sử dụng trong React Components:

```jsx
// Button Primary
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
  Nút Chính
</button>

// Card với Background
<div className="bg-light-gray text-dark-gray p-6 rounded-lg">
  Nội dung
</div>

// Text Status
<span className="text-success">✓ Thành công</span>
<span className="text-error">✗ Lỗi</span>
<span className="text-warning">⚠ Cảnh báo</span>
```

---

## 🎨 Ứng Dụng Màu Sắc

| Thành Phần | Màu Sắc | Hex Code |
|-----------|---------|----------|
| Header | Primary Blue | #2563EB |
| Buttons (CTA) | Primary Purple | #7C3AED |
| Success Messages | Green | #10B981 |
| Error Messages | Red | #EF4444 |
| Warning Messages | Amber | #F59E0B |
| Card Backgrounds | Light Gray | #F3F4F6 |
| Text Chính | Dark Gray | #374151 |
| Text Phụ | Medium Gray | #9CA3AF |
| Borders | Light Gray | #E5E7EB |

---

## 🌈 Gradient Suggestions

### Hero Section
```css
background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
```

### Card Hover
```css
background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
```

### Success State
```css
background: linear-gradient(135deg, #10B981 0%, #6EE7B7 100%);
```

---

## 📝 Lưu Ý

✅ **Accessibility**: Đảm bảo contrast ratio ≥ 4.5:1 cho text  
✅ **Consistency**: Sử dụng colors từ palette trên toàn bộ ứng dụng  
✅ **Dark Mode**: Cân nhắc thêm dark mode colors nếu cần  

---

**Được thiết kế cho:** Career Fit Pro - Professional Career Assessment Platform  
**Ngày tạo:** 2026-02-03
