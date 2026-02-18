# Capability Flow Diagrams

> Generated at 2026-02-17T10:24:07.154Z

## Capability Coverage

```mermaid
flowchart LR

  subgraph mutation["MUTATION"]
    contacts_create["✅ contacts.create"]
    contacts_update["✅ contacts.update"]
    contacts_delete["✅ contacts.delete"]
    contacts_restore["✅ contacts.restore"]
    companies_create["✅ companies.create"]
    companies_update["✅ companies.update"]
    companies_delete["✅ companies.delete"]
    companies_restore["✅ companies.restore"]
  end

  subgraph read["READ"]
    contacts_read["✅ contacts.read"]
    contacts_list["✅ contacts.list"]
    contacts_versions["✅ contacts.versions"]
    contacts_audit["✅ contacts.audit"]
    custom_fields_read["✅ custom_fields.read"]
    views_read["✅ views.read"]
    companies_read["✅ companies.read"]
    companies_list["✅ companies.list"]
    companies_versions["✅ companies.versions"]
    companies_audit["✅ companies.audit"]
  end

  subgraph search["SEARCH"]
    contacts_search["✅ contacts.search"]
    search_global["✅ search.global"]
  end

  subgraph admin["ADMIN"]
    admin_custom_fields_define["⚠️ admin.custom_fields.define"]
    admin_custom_fields_sync["⚠️ admin.custom_fields.sync"]
    admin_aliases_resolve["⚠️ admin.aliases.resolve"]
    admin_views_manage["✅ admin.views.manage"]
    system_workflows_manage["⚠️ system.workflows.manage"]
  end

  subgraph system["SYSTEM"]
    system_workflows_evaluate["⚠️ system.workflows.evaluate"]
    system_advisory_detect["⚠️ system.advisory.detect"]
    system_advisory_forecast["⚠️ system.advisory.forecast"]
    system_advisory_explain["⚠️ system.advisory.explain"]
  end

  subgraph auth["AUTH"]
    auth_sign_in["✅ auth.sign_in"]
    auth_sign_out["✅ auth.sign_out"]
  end

  subgraph storage["STORAGE"]
    storage_files_upload["🛡️ storage.files.upload"]
    storage_files_metadata["✅ storage.files.metadata"]
    storage_files_save["🛡️ storage.files.save"]
  end

  apps_web_app_actions_contacts_capabilities_ts[/"contacts.capabilities.ts"/]
  apps_web_app_actions_contacts_capabilities_ts --> contacts_create
  packages_crud_src_handlers_contacts_ts[/"contacts.ts"/]
  packages_crud_src_handlers_contacts_ts --> contacts_create
  apps_web_app_actions_contacts_capabilities_ts --> contacts_update
  packages_crud_src_handlers_contacts_ts --> contacts_update
  apps_web_app_actions_contacts_capabilities_ts --> contacts_delete
  packages_crud_src_handlers_contacts_ts --> contacts_delete
  apps_web_app_actions_contacts_capabilities_ts --> contacts_restore
  packages_crud_src_handlers_contacts_ts --> contacts_restore
  apps_web_app_actions_contacts_capabilities_ts --> contacts_read
  apps_web_app_actions_contacts_capabilities_ts --> contacts_list
  apps_web_app_actions_contacts_capabilities_ts --> contacts_versions
  apps_web_app_actions_contacts_capabilities_ts --> contacts_audit
  apps_web_app_api_search_route_ts[/"route.ts"/]
  apps_web_app_api_search_route_ts --> contacts_search
  apps_web_app_api_search_route_ts --> search_global
  apps_web_app_api_custom_fields__entityType__route_ts[/"route.ts"/]
  apps_web_app_api_custom_fields__entityType__route_ts --> custom_fields_read
  apps_web_app_api_views__entityType__route_ts[/"route.ts"/]
  apps_web_app_api_views__entityType__route_ts --> views_read
  apps_web_app_api_meta_capabilities_route_ts[/"route.ts"/]
  apps_web_app_api_meta_capabilities_route_ts --> admin_views_manage
  apps_web_app_api_meta_capabilities_flags_route_ts[/"route.ts"/]
  apps_web_app_api_meta_capabilities_flags_route_ts --> admin_views_manage
  apps_web_app_api_auth_____path__route_ts[/"route.ts"/]
  apps_web_app_api_auth_____path__route_ts --> auth_sign_in
  apps_web_app_api_auth_____path__route_ts --> auth_sign_out
  apps_web_app_api_storage_presign_route_ts[/"route.ts"/]
  apps_web_app_api_storage_presign_route_ts --> storage_files_upload
  apps_web_app_api_storage_metadata_route_ts[/"route.ts"/]
  apps_web_app_api_storage_metadata_route_ts --> storage_files_metadata
  apps_web_app_api_storage_metadata_route_ts --> storage_files_save
  apps_web_app_actions_companies_capabilities_ts[/"companies.capabilities.ts"/]
  apps_web_app_actions_companies_capabilities_ts --> companies_create
  packages_crud_src_handlers_companies_ts[/"companies.ts"/]
  packages_crud_src_handlers_companies_ts --> companies_create
  apps_web_app_actions_companies_capabilities_ts --> companies_update
  packages_crud_src_handlers_companies_ts --> companies_update
  apps_web_app_actions_companies_capabilities_ts --> companies_delete
  packages_crud_src_handlers_companies_ts --> companies_delete
  apps_web_app_actions_companies_capabilities_ts --> companies_restore
  packages_crud_src_handlers_companies_ts --> companies_restore
  apps_web_app_actions_companies_capabilities_ts --> companies_read
  apps_web_app_actions_companies_capabilities_ts --> companies_list
  apps_web_app_actions_companies_capabilities_ts --> companies_versions
  apps_web_app_actions_companies_capabilities_ts --> companies_audit
```

## Package Dependencies

```mermaid
flowchart TD

  afenda_monorepo["afenda-monorepo"]
  web["web"]
  afenda_accounting["afenda-accounting"]
  afenda_crm["afenda-crm"]
  afenda_canon["afenda-canon"]
  afenda_advisory["afenda-advisory"]
  afenda_budgeting["afenda-budgeting"]
  afenda_crud["afenda-crud"]
  afenda_database["afenda-database"]
  afenda_eslint_config["afenda-eslint-config"]
  afenda_fixed_assets["afenda-fixed-assets"]
  afenda_forecasting["afenda-forecasting"]
  afenda_intercompany["afenda-intercompany"]
  afenda_inventory["afenda-inventory"]
  afenda_migration["afenda-migration"]
  afenda_logger["afenda-logger"]
  afenda_payables["afenda-payables"]
  afenda_planning["afenda-planning"]
  afenda_observability["afenda-observability"]
  afenda_procurement["afenda-procurement"]
  afenda_production["afenda-production"]
  afenda_purchasing["afenda-purchasing"]
  afenda_quality_mgmt["afenda-quality-mgmt"]
  afenda_receivables["afenda-receivables"]
  afenda_receiving["afenda-receiving"]
  afenda_shipping["afenda-shipping"]
  afenda_sales["afenda-sales"]
  afenda_search["afenda-search"]
  afenda_supplier_portal["afenda-supplier-portal"]
  afenda_tax_compliance["afenda-tax-compliance"]
  afenda_transportation["afenda-transportation"]
  afenda_treasury["afenda-treasury"]
  afenda_typescript_config["afenda-typescript-config"]
  afenda_ui["afenda-ui"]
  afenda_warehouse["afenda-warehouse"]
  afenda_workflow["afenda-workflow"]
  _afenda_cli["@afenda/cli"]
  quality_metrics["quality-metrics"]

  web --> afenda_canon
  web --> afenda_crud
  web --> afenda_database
  web --> afenda_logger
  web --> afenda_observability
  web --> afenda_search
  web --> afenda_ui
  web --> afenda_workflow
  web -.-> afenda_eslint_config
  web -.-> afenda_typescript_config
  afenda_accounting --> afenda_canon
  afenda_accounting --> afenda_database
  afenda_accounting -.-> afenda_eslint_config
  afenda_accounting -.-> afenda_typescript_config
  afenda_crm --> afenda_canon
  afenda_crm --> afenda_database
  afenda_crm -.-> afenda_eslint_config
  afenda_crm -.-> afenda_typescript_config
  afenda_canon -.-> afenda_eslint_config
  afenda_canon -.-> afenda_typescript_config
  afenda_advisory --> afenda_canon
  afenda_advisory --> afenda_database
  afenda_advisory -.-> afenda_eslint_config
  afenda_advisory -.-> afenda_typescript_config
  afenda_budgeting --> afenda_canon
  afenda_budgeting --> afenda_database
  afenda_budgeting --> afenda_accounting
  afenda_budgeting --> afenda_workflow
  afenda_budgeting -.-> afenda_eslint_config
  afenda_budgeting -.-> afenda_typescript_config
  afenda_crud --> afenda_accounting
  afenda_crud --> afenda_canon
  afenda_crud --> afenda_crm
  afenda_crud --> afenda_database
  afenda_crud --> afenda_intercompany
  afenda_crud --> afenda_inventory
  afenda_crud --> afenda_logger
  afenda_crud --> afenda_workflow
  afenda_crud -.-> afenda_eslint_config
  afenda_crud -.-> afenda_typescript_config
  afenda_database -.-> afenda_eslint_config
  afenda_database -.-> afenda_typescript_config
  afenda_fixed_assets --> afenda_canon
  afenda_fixed_assets --> afenda_database
  afenda_fixed_assets --> afenda_accounting
  afenda_fixed_assets -.-> afenda_eslint_config
  afenda_fixed_assets -.-> afenda_typescript_config
  afenda_forecasting --> afenda_canon
  afenda_forecasting --> afenda_database
  afenda_forecasting --> afenda_sales
  afenda_forecasting -.-> afenda_eslint_config
  afenda_forecasting -.-> afenda_typescript_config
  afenda_intercompany --> afenda_canon
  afenda_intercompany --> afenda_database
  afenda_intercompany --> afenda_logger
  afenda_intercompany -.-> afenda_eslint_config
  afenda_intercompany -.-> afenda_typescript_config
  afenda_inventory --> afenda_canon
  afenda_inventory --> afenda_database
  afenda_inventory -.-> afenda_eslint_config
  afenda_inventory -.-> afenda_typescript_config
  afenda_migration --> afenda_canon
  afenda_migration --> afenda_database
  afenda_migration --> afenda_logger
  afenda_migration -.-> afenda_eslint_config
  afenda_migration -.-> afenda_typescript_config
  afenda_logger -.-> afenda_eslint_config
  afenda_logger -.-> afenda_typescript_config
  afenda_payables --> afenda_canon
  afenda_payables --> afenda_database
  afenda_payables --> afenda_workflow
  afenda_payables --> afenda_receiving
  afenda_payables -.-> afenda_eslint_config
  afenda_payables -.-> afenda_typescript_config
  afenda_planning --> afenda_canon
  afenda_planning --> afenda_database
  afenda_planning --> afenda_inventory
  afenda_planning --> afenda_sales
  afenda_planning --> afenda_purchasing
  afenda_planning -.-> afenda_eslint_config
  afenda_planning -.-> afenda_typescript_config
  afenda_observability --> afenda_logger
  afenda_observability -.-> afenda_eslint_config
  afenda_observability -.-> afenda_typescript_config
  afenda_procurement --> afenda_canon
  afenda_procurement --> afenda_database
  afenda_procurement --> afenda_workflow
  afenda_procurement --> afenda_crm
  afenda_procurement -.-> afenda_eslint_config
  afenda_procurement -.-> afenda_typescript_config
  afenda_production --> afenda_canon
  afenda_production --> afenda_database
  afenda_production --> afenda_inventory
  afenda_production -.-> afenda_eslint_config
  afenda_production -.-> afenda_typescript_config
  afenda_purchasing --> afenda_canon
  afenda_purchasing --> afenda_database
  afenda_purchasing --> afenda_workflow
  afenda_purchasing --> afenda_procurement
  afenda_purchasing -.-> afenda_eslint_config
  afenda_purchasing -.-> afenda_typescript_config
  afenda_quality_mgmt --> afenda_canon
  afenda_quality_mgmt --> afenda_database
  afenda_quality_mgmt --> afenda_production
  afenda_quality_mgmt --> afenda_receiving
  afenda_quality_mgmt -.-> afenda_eslint_config
  afenda_quality_mgmt -.-> afenda_typescript_config
  afenda_receivables --> afenda_canon
  afenda_receivables --> afenda_database
  afenda_receivables --> afenda_workflow
  afenda_receivables --> afenda_sales
  afenda_receivables --> afenda_crm
  afenda_receivables -.-> afenda_eslint_config
  afenda_receivables -.-> afenda_typescript_config
  afenda_receiving --> afenda_canon
  afenda_receiving --> afenda_database
  afenda_receiving --> afenda_inventory
  afenda_receiving --> afenda_purchasing
  afenda_receiving -.-> afenda_eslint_config
  afenda_receiving -.-> afenda_typescript_config
  afenda_shipping --> afenda_canon
  afenda_shipping --> afenda_database
  afenda_shipping --> afenda_sales
  afenda_shipping -.-> afenda_eslint_config
  afenda_shipping -.-> afenda_typescript_config
  afenda_sales --> afenda_canon
  afenda_sales --> afenda_database
  afenda_sales --> afenda_workflow
  afenda_sales --> afenda_inventory
  afenda_sales --> afenda_crm
  afenda_sales -.-> afenda_eslint_config
  afenda_sales -.-> afenda_typescript_config
  afenda_search --> afenda_database
  afenda_search --> afenda_logger
  afenda_search -.-> afenda_eslint_config
  afenda_search -.-> afenda_typescript_config
  afenda_supplier_portal --> afenda_canon
  afenda_supplier_portal --> afenda_database
  afenda_supplier_portal --> afenda_purchasing
  afenda_supplier_portal -.-> afenda_eslint_config
  afenda_supplier_portal -.-> afenda_typescript_config
  afenda_tax_compliance --> afenda_canon
  afenda_tax_compliance --> afenda_database
  afenda_tax_compliance --> afenda_accounting
  afenda_tax_compliance --> afenda_sales
  afenda_tax_compliance --> afenda_payables
  afenda_tax_compliance -.-> afenda_eslint_config
  afenda_tax_compliance -.-> afenda_typescript_config
  afenda_transportation --> afenda_canon
  afenda_transportation --> afenda_database
  afenda_transportation --> afenda_shipping
  afenda_transportation -.-> afenda_eslint_config
  afenda_transportation -.-> afenda_typescript_config
  afenda_treasury --> afenda_canon
  afenda_treasury --> afenda_database
  afenda_treasury --> afenda_payables
  afenda_treasury --> afenda_receivables
  afenda_treasury -.-> afenda_eslint_config
  afenda_treasury -.-> afenda_typescript_config
  afenda_ui -.-> afenda_eslint_config
  afenda_ui -.-> afenda_typescript_config
  afenda_warehouse --> afenda_canon
  afenda_warehouse --> afenda_database
  afenda_warehouse --> afenda_inventory
  afenda_warehouse --> afenda_sales
  afenda_warehouse -.-> afenda_eslint_config
  afenda_warehouse -.-> afenda_typescript_config
  afenda_workflow --> afenda_canon
  afenda_workflow --> afenda_database
  afenda_workflow -.-> afenda_eslint_config
  afenda_workflow -.-> afenda_typescript_config
  _afenda_cli --> afenda_canon
  _afenda_cli -.-> afenda_eslint_config
  _afenda_cli -.-> afenda_typescript_config
```
