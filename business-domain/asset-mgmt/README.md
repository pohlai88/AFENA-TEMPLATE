# Asset Management Package

Enterprise asset management and maintenance with preventive maintenance schedules,
work requests, spare parts tracking, calibration management, and EAM analytics.

## Features

- **Preventive Maintenance**: Schedule and execute preventive maintenance tasks
- **Work Requests**: Create and manage work orders and requests
- **Spare Parts**: Link spare parts to assets and track consumption
- **Calibration**: Schedule calibration and track certifications
- **EAM Analytics**: MTBF, MTTR, maintenance costs, and dashboard metrics

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
    createPMSchedule,
    createWorkRequest,
    linkSparePart,
    scheduleCalibration,
    getMTBF,
} from "afenda-asset-mgmt";
```

## Services

1. **Preventive Maintenance**: PM schedule creation and execution
2. **Work Requests**: Work order creation and management
3. **Spare Parts**: Parts linking and consumption tracking
4. **Calibration**: Calibration scheduling and certification tracking
5. **EAM Analytics**: Asset performance metrics and dashboards
