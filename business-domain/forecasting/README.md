# @afenda-forecasting

Enterprise statistical forecasting and demand sensing.

## Features

- **Statistical Models**: Time series, exponential smoothing, ARIMA
- **Seasonal Adjustment**: Detection and decomposition of seasonal patterns
- **Demand Sensing**: Real-time signal capture, short-term adjustments
- **Consensus Planning**: Collaborative forecasting, stakeholder input
- **Forecast Accuracy**: MAD, MAPE, bias, tracking signal

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, sales, drizzle-orm, zod

**Cross-Domain Dependencies**: sales (historical orders) - documented as
exception for forecast calculations
