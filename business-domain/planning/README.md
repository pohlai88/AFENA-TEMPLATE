# @afenda-planning

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
