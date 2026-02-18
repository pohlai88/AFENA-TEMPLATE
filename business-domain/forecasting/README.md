# @afenda-forecasting

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--forecasting-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


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
