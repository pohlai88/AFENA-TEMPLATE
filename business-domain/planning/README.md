# @afenda-planning

<!-- afenda:badges -->
![D - Manufacturing & Quality](https://img.shields.io/badge/D-Manufacturing+%26+Quality-6554C0?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--planning-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-D%20·%20of%2010-lightgrey?style=flat-square)


Enterprise demand planning and material requirements planning (MRP/MPS).

## Features

- **Demand Planning**: Statistical forecasting, demand aggregation, consensus
  planning
- **MRP**: Material requirements explosion, lot sizing, planned orders
- **MPS**: Master production schedule, capacity planning, rough-cut capacity
- **Safety Stock**: Reorder point calculation, safety stock optimization
- **Planning Analytics**: Plan vs. actual, forecast accuracy, service level

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, inventory, sales, purchasing, drizzle-orm,
zod
