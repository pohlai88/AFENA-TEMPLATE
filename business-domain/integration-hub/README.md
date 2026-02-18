# @afenda-integration-hub

<!-- afenda:badges -->
![I - Analytics, Data & Integration](https://img.shields.io/badge/I-Analytics%2C+Data+%26+Integration-00C7E6?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--integration--hub-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-I%20·%20of%2010-lightgrey?style=flat-square)


Enterprise integration and API management.

## Services

### edi.ts

- `sendEDIDocument` - Send EDI document
- `receiveEDIDocument` - Receive EDI document

### api-gateway.ts

- `registerAPI` - Register API endpoint
- `routeRequest` - Route API request

### message-broker.ts

- `publishMessage` - Publish message to topic
- `subscribeToTopic` - Subscribe to message topic

### transformation.ts

- `transformData` - Transform data format
- `applyMapping` - Apply data mapping

### integration-monitoring.ts

- `trackIntegrationHealth` - Monitor integration health
- `alertOnFailure` - Alert on integration failure

Layer 2 (Domain Services), pure functions, no logging, Zod validation.
