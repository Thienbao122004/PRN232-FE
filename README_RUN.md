# 🚀 Hướng dẫn chạy Frontend - EV Station Rental System

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0 (khuyến nghị 18.x hoặc 20.x)
- **Package Manager**: pnpm (được sử dụng trong project)
- **Operating System**: Windows/macOS/Linux

## 🔧 Bước 1: Cài đặt Node.js & pnpm

### Kiểm tra Node.js

```powershell
node --version
# Nên hiển thị v18.x.x hoặc cao hơn
```

Nếu chưa có Node.js, tải tại: https://nodejs.org/

### Cài đặt pnpm

```powershell
# Cài pnpm globally
npm install -g pnpm

# Kiểm tra version
pnpm --version
```

## 📦 Bước 2: Cài đặt Dependencies

```powershell
# Di chuyển vào thư mục frontend
cd d:\EV_Station_Rental_System\PRN232-FE

# Cài đặt tất cả packages
pnpm install
```

**Thời gian cài đặt**: ~2-5 phút (tùy tốc độ internet)

## ⚙️ Bước 3: Cấu hình Backend Services

Frontend cần kết nối với 3 backend services. Kiểm tra file `lib/api-config.ts`:

```typescript
export const API_CONFIG = {
  USER_SERVICE_URL: 'http://localhost:5227', // UserService
  RENTAL_PAYMENT_SERVICE_URL: 'http://localhost:5035', // RentalPaymentService
  FLEET_SERVICE_URL: 'http://localhost:5142', // FleetService
}
```

### ✅ Đảm bảo các Backend Services đang chạy

**UserService:**

```powershell
cd d:\EV_Station_Rental_System\EV_StationRentalSystem_UserService
dotnet run --project EV_StationRentalSystem.API
# Should run on: https://localhost:7105 or http://localhost:5227
```

**RentalPaymentService:**

```powershell
cd d:\EV_Station_Rental_System\EV_StationRentalSystem_RentalPaymentService
dotnet run --project EV_StationRentalSystem.API
# Should run on: https://localhost:7107 or http://localhost:5035
```

**FleetService:**

```powershell
cd d:\EV_Station_Rental_System\EV_StationRentalSystem_FleetService
dotnet run --project EV_StationRentalSystem.API
# Should run on: https://localhost:7XXX or http://localhost:5142
```

### 🔄 Cập nhật API URLs (nếu cần)

Nếu backend services chạy trên ports khác, cập nhật `lib/api-config.ts`:

```typescript
export const API_CONFIG = {
  USER_SERVICE_URL: 'http://localhost:YOUR_PORT',
  RENTAL_PAYMENT_SERVICE_URL: 'http://localhost:YOUR_PORT',
  FLEET_SERVICE_URL: 'http://localhost:YOUR_PORT',
}
```

## 🚀 Bước 4: Chạy Development Server

```powershell
# Trong thư mục PRN232-FE
pnpm dev
```

**Output mong đợi:**

```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

## 🌐 Bước 5: Truy cập ứng dụng

Mở trình duyệt và truy cập:

- **URL**: http://localhost:3000
- **Login page**: http://localhost:3000/login
- **Admin page**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/dashboard

## 📱 Các trang chính trong ứng dụng

### Customer Pages

- `/` - Trang chủ
- `/login` - Đăng nhập
- `/dashboard` - Dashboard khách hàng
- `/dashboard/booking` - Đặt xe
- `/dashboard/history` - Lịch sử thuê
- `/dashboard/profile` - Thông tin cá nhân

### Admin Pages

- `/admin` - Admin dashboard
- `/admin/analytics` - Business analytics
- `/admin/customers` - Quản lý khách hàng
- `/admin/fleet` - Quản lý xe
- `/admin/staff` - Quản lý nhân viên

### Staff Pages

- `/staff` - Staff dashboard
- `/staff/handover` - Bàn giao xe
- `/staff/payment` - Thanh toán
- `/staff/vehicles` - Kiểm tra xe
- `/staff/verification` - Xác thực tài liệu

## 🔑 Test Accounts (sau khi có data)

```
Manager Account:
Email: manager@ev.com
Password: Manager123!

Staff Account:
Email: staff@ev.com
Password: Staff123!

Customer Account:
Email: customer@ev.com
Password: Customer123!
```

## 🐛 Troubleshooting

### Lỗi: `pnpm: command not found`

```powershell
npm install -g pnpm
```

### Lỗi: `Port 3000 already in use`

```powershell
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID_NUMBER> /F

# Hoặc chạy trên port khác
pnpm dev -p 3001
```

### Lỗi: `Cannot connect to backend`

1. Kiểm tra backend services đang chạy
2. Kiểm tra CORS configuration trong backend
3. Kiểm tra firewall/antivirus
4. Xem browser console (F12) để check lỗi cụ thể

### Lỗi: `Module not found`

```powershell
# Xóa node_modules và cài lại
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml
pnpm install
```

### Lỗi CORS khi gọi API

Backend cần enable CORS. Kiểm tra `Program.cs` của mỗi service:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ...

app.UseCors("AllowAll");
```

## 📊 Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl (English/Vietnamese)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Authentication**: JWT + React OAuth (Google)

## 🏗️ Project Structure

```
PRN232-FE/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages
│   ├── dashboard/         # Customer dashboard
│   ├── staff/             # Staff pages
│   ├── login/             # Authentication
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── services/             # API service layers
│   ├── authService.ts
│   ├── vehicleService.ts
│   ├── rentalOrderService.ts
│   └── ...
├── lib/                  # Utility functions
│   ├── api-config.ts     # API endpoints configuration
│   ├── auth.ts           # Auth utilities
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
├── i18n/                 # Internationalization
│   └── messages/         # Language files (en, vi)
└── public/               # Static assets
```

## 🎨 Available Scripts

```powershell
# Development mode (with hot reload)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## 🌍 Multi-language Support

Ứng dụng hỗ trợ 2 ngôn ngữ:

- 🇺🇸 English
- 🇻🇳 Tiếng Việt

Ngôn ngữ có thể được chuyển đổi qua component `<LanguageSwitcher />`

## 🔐 Authentication Flow

1. User login qua `/login`
2. Backend trả về JWT token
3. Token được lưu trong localStorage
4. Mỗi API call tự động attach token vào header
5. Middleware check authentication cho protected routes

## 📝 Notes

- **Hot Reload**: Code changes tự động reload browser
- **TypeScript**: Strict mode enabled
- **ESLint**: Bị ignore during builds (có thể enable lại)
- **Images**: Unoptimized (có thể optimize cho production)

## 🚀 Production Deployment

### Build for production

```powershell
pnpm build
```

### Start production server

```powershell
pnpm start
```

### Environment Variables (nếu cần)

Tạo file `.env.local`:

```env
NEXT_PUBLIC_USER_SERVICE_URL=http://your-api.com:5227
NEXT_PUBLIC_RENTAL_SERVICE_URL=http://your-api.com:5035
NEXT_PUBLIC_FLEET_SERVICE_URL=http://your-api.com:5142
```

## 📞 Support

Nếu gặp vấn đề:

1. Check browser console (F12)
2. Check terminal logs
3. Check backend API logs
4. Verify network requests trong DevTools

---

**Happy Coding! 🎉**

Last Updated: 2024-11-16
