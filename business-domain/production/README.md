# @afenda-production

<!-- afenda:badges -->
![D - Manufacturing & Quality](https://img.shields.io/badge/D-Manufacturing+%26+Quality-6554C0?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--production-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-D%20·%20of%2010-lightgrey?style=flat-square)


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
