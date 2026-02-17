# @afenda-integration-hub

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
