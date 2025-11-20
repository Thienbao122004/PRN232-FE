# Gateway Setup Guide

## 🚀 Cấu Hình Gateway cho Workforce Service

### **Gateway Configuration (ocelot.json)**

Gateway đang chạy tại: `https://localhost:7000`

Workforce Service route:

```json
{
  "DownstreamPathTemplate": "/Workforce/{everything}",
  "DownstreamScheme": "https",
  "DownstreamHostAndPorts": [
    {
      "Host": "localhost",
      "Port": 7160
    }
  ],
  "UpstreamPathTemplate": "/workforcegateway/{everything}",
  "UpstreamHttpMethod": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "AuthenticationOptions": {
    "AuthenticationProviderKey": "Bearer"
  }
}
```

### **Frontend API Configuration**

Các API endpoints đã được cập nhật để đi qua Gateway:

```typescript
WORKFORCE_SERVICE_URL: 'https://localhost:7000'

// Ví dụ:
SHIFTS.GET_ALL: 'https://localhost:7000/workforcegateway/Shift'
WORKDAYS.GET_ALL: 'https://localhost:7000/workforcegateway/Workday'
ASSIGNMENTS.CREATE_BULK: 'https://localhost:7000/workforcegateway/Assignment/bulk'
```

### **Request Flow**

```
Frontend (localhost:3000)
    ↓
Gateway (localhost:7000) - /workforcegateway/*
    ↓
WorkforceService (localhost:7160) - /Workforce/*
```

### **Cách Chạy Đầy Đủ Hệ Thống**

#### 1. **Start Gateway**

```bash
cd EV_StationRentalSystem_GateWay/EV_StationRentalSystem.API
dotnet run
```

Gateway sẽ chạy tại: `https://localhost:7000`

#### 2. **Start WorkforceService**

```bash
cd EV_StationRentalSystem_WorkforceService/EV_StationRentalSystem.API
dotnet run
```

WorkforceService sẽ chạy tại: `https://localhost:7160`

#### 3. **Start UserService**

```bash
cd EV_StationRentalSystem_UserService/EV_StationRentalSystem.API
dotnet run
```

UserService sẽ chạy tại: `https://localhost:7105`

#### 4. **Start FleetService**

```bash
cd EV_StationRentalSystem_FleetService/EV_StationRentalSystem.API
dotnet run
```

FleetService sẽ chạy tại: `https://localhost:7042`

#### 5. **Start Frontend**

```bash
cd PRN232-FE
pnpm dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### **Test API qua Gateway**

#### Get All Shifts:

```bash
curl -X GET https://localhost:7000/workforcegateway/Shift \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Create Shift:

```bash
curl -X POST https://localhost:7000/workforcegateway/Shift \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shiftName": "Ca Sáng",
    "startTime": "07:00:00",
    "endTime": "15:00:00"
  }'
```

### **Troubleshooting**

#### Lỗi CORS:

- Đảm bảo Gateway có cấu hình CORS cho `http://localhost:3000`

#### Lỗi 401 Unauthorized:

- Kiểm tra token JWT còn hạn
- Kiểm tra Gateway có `AuthenticationOptions` đúng

#### Lỗi 404 Not Found:

- Kiểm tra WorkforceService đang chạy
- Kiểm tra route trong ocelot.json

### **Admin UI Navigation**

Sau khi đăng nhập với tài khoản Manager:

1. Trang Admin: `/admin`
2. Click sidebar menu "Nhân viên"
3. Sẽ thấy submenu:
   - **Tổng quan lịch** → `/admin/staff/schedule`
   - **Quản lý ca** → `/admin/staff/schedule/shifts`
   - **Phân công** → `/admin/staff/schedule/assign`
   - **Lịch chi nhánh** → `/admin/staff/schedule/branch`
   - **Lịch nhân viên** → `/admin/staff/schedule/staff`

### **API Endpoints Mapping**

| Frontend Request               | Gateway Route         | Backend Service         |
| ------------------------------ | --------------------- | ----------------------- |
| `/workforcegateway/Shift`      | `/workforcegateway/*` | `/Workforce/Shift`      |
| `/workforcegateway/Workday`    | `/workforcegateway/*` | `/Workforce/Workday`    |
| `/workforcegateway/Assignment` | `/workforcegateway/*` | `/Workforce/Assignment` |
