# Analytics Dashboard Implementation

## Overview

Comprehensive analytics dashboard at `/admin/analytics` showing revenue, rental statistics, peak hours analysis, and vehicle distribution across branches.

## Features Implemented

### 1. Dashboard Statistics (Key Metrics)

- **Tổng doanh thu** (Total Revenue): Shows total revenue with rental count
- **Tổng số xe** (Total Vehicles): Shows total fleet size with active vehicles
- **Tỷ lệ sử dụng** (Utilization Rate): System-wide utilization percentage with color coding
- **Điểm cho thuê** (Rental Points): Number of active branches

### 2. Peak Hours Analysis

- **Giờ cao điểm** (Peak Hours): Visualizes rental demand across 6 time slots (7-9h, 9-11h, 11-13h, 13-15h, 15-17h, 17-19h)
- **Visual Indicators**:
  - Red bars (≥90%): Critical demand - need backup vehicles
  - Yellow bars (≥75%): High demand
  - Green bars (<75%): Normal demand
- **Peak Insights**:
  - Highest peak: 17:00-19:00 (95% demand)
  - Lowest peak: 13:00-15:00 (58% demand)

### 3. Vehicle Distribution by Branch

Real-time vehicle distribution showing for each branch:

- **Branch Information**: Name and address
- **Total Vehicles**: Total fleet size at branch
- **Vehicle Status Breakdown**:
  - Sẵn sàng (Available): Green indicator
  - Đang thuê (In-Use): Blue indicator
  - Bảo trì (Maintenance): Orange indicator
  - Sử dụng (Utilization %): Purple indicator with color coding
- **Utilization Progress Bar**: Visual representation of branch utilization rate

### 4. Detailed Insights

- **Doanh thu trung bình/chuyến** (Average Revenue per Rental)
- **Số lượt thuê trung bình/xe** (Average Rentals per Vehicle)
- **Xe đang hoạt động** (Active Vehicles): Current ratio

### 5. Recommendations (Khuyến nghị)

Smart recommendations based on system metrics:

- **Utilization Status**: Warnings based on utilization levels (high/medium/low)
- **Peak Hours Optimization**: Recommendations for peak hour staffing
- **Flexible Pricing Strategy**: Suggestions for off-peak discounts

## Data Integration

### Real Data Sources

- **Branch Data**: `branchService.getAllBranches()` - Real branch information
- **Vehicle Data**: `fleetService.getAllVehicles()` - Real fleet data with status
- **Calculations**:
  - Real-time vehicle counts per branch
  - Live utilization rate calculations
  - Dynamic vehicle status aggregation

### Mock Data (To be replaced)

- Revenue data (125M VND) - Backend API exists at `/businessanalytics/summary`
- Rental count (1,250) - Backend API exists at `/businessanalytics/dashboard`
- Peak hours percentages - Can be integrated from `/businessanalytics/peak-hours`

## Technical Implementation

### Data Loading

```typescript
loadAnalyticsData()
  ├── branchService.getAllBranches()
  ├── fleetService.getAllVehicles()
  ├── calculateStats(vehicles)
  └── calculateBranchStats(branches, vehicles)
```

### Statistics Calculation

- **Overall Stats**: Aggregates all vehicles for system-wide metrics
- **Branch Stats**: Filters vehicles by branchId for per-branch analysis
- **Utilization Rate**: `(inUseVehicles / totalVehicles) * 100`

### Color Coding Logic

- **Utilization ≥80%**: Red (Critical - need expansion)
- **Utilization ≥60%**: Yellow (Moderate - monitor closely)
- **Utilization ≥40%**: Green (Good - optimal usage)
- **Utilization <40%**: Blue (Low - marketing needed)

## UI Components Used

- **Shadcn UI**: Card, CardHeader, CardContent, CardTitle, Select
- **Lucide Icons**: BarChart3, Car, Clock, DollarSign, MapPin, TrendingUp, TrendingDown, Activity
- **Layout**: Responsive grid layout (4 columns for metrics, 2 columns for insights)

## Period Filtering

Dropdown selector for time periods:

- Hôm nay (Today)
- Tuần này (This Week)
- Tháng này (This Month) - Default
- Năm này (This Year)

_Note: Period filtering logic is ready but not yet connected to backend API_

## Next Steps for Enhancement

### Backend Integration

1. Create `businessAnalyticsService.ts`:

   ```typescript
   - getDashboardSummary() → /businessanalytics/dashboard
   - getRevenueSummary() → /businessanalytics/summary
   - getPeakHours() → /businessanalytics/peak-hours
   - getComparison() → /businessanalytics/comparison
   ```

2. Replace mock data with real API calls:
   - Revenue and rental counts from summary endpoint
   - Peak hours from analytics endpoint
   - Period comparison for trend analysis

### Advanced Features

1. **Charts**: Add visual charts for revenue trends (recharts library)
2. **Real-time Updates**: WebSocket integration for live vehicle status
3. **Export Functionality**: Download reports as PDF/Excel
4. **Branch Comparison**: Side-by-side branch performance analysis
5. **Historical Trends**: 6-month revenue and utilization graphs

## File Location

`d:\EV_Station_Rental_System\PRN232-FE\app\admin\analytics\page.tsx` (500 lines)

## Dependencies

- branchService (existing)
- fleetService (existing)
- businessAnalyticsService (to be created for full backend integration)

## Status

✅ **Completed**: Core dashboard with real vehicle and branch data
🔄 **In Progress**: Backend API integration for revenue/rental statistics
⏳ **Planned**: Advanced charting and trend analysis features
