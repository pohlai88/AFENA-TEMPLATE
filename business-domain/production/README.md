# @afenda-production

Enterprise production and manufacturing execution system (MES).

## Features

- **Work Orders**: Creation, release, tracking, close-out
- **Routing**: Operation sequences, work centers, setup/run times
- **Scheduling**: Finite/infinite capacity, job sequencing, dispatch lists
- **Shop Floor Control**: Labor reporting, material issues, scrap tracking
- **Production Analytics**: OEE, cycle time, throughput analysis

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, inventory, drizzle-orm, zod
