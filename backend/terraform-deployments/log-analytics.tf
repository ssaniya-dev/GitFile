provider "azurerm" {
  version = "2.34.0"
  subscription_id = "your_subscription_id"
  client_id      = "your_client_id"
  client_secret = "your_client_secret"
  tenant_id      = "your_tenant_id"
}

resource "azurerm_log_analytics_workspace" "hackutd" {
  name                = "hackutd-log-analytics-workspace"
  location            = "West US"
  resource_group_name = azurerm_resource_group.hackutd.name
  sku                 = "PerGB2018"
}

resource "azurerm_log_analytics_data_source" "hackutd" {
  name                = "hackutd-log-analytics-data-source"
  resource_group_name = azurerm_resource_group.hackutd.name
  log_analytics_workspace_name = azurerm_log_analytics_workspace.hackutd.name
  type                 = "Docker"
  configuration        = jsonencode({
    "docker": {
      "logs": {
        "enabled": true
      }
    }
  })
}

resource "azurerm_log_analytics_query" "hackutd" {
  name                = "hackutd-log-analytics-query"
  resource_group_name = azurerm_resource_group.hackutd.name
  log_analytics_workspace_name = azurerm_log_analytics_workspace.hackutd.name
  query               = "AzureDiagnostics | where Category == 'ContainerLogs' | summarize count() by ContainerName"
}

resource "azurerm_log_analytics_alert_rule" "hackutd" {
  name                = "hackutd-log-analytics-alert-rule"
  resource_group_name = azurerm_resource_group.hackutd.name
  log_analytics_workspace_name = azurerm_log_analytics_workspace.hackutd.name
  query               = azurerm_log_analytics_query.hackutd.query
  severity           = "Critical"
  action_group_name = azurerm_monitor_action_group.hackutd.name
}

# Create a Monitor action group
resource "azurerm_monitor_action_group" "hackutd" {
  name                = "hackutd-monitor-action-group"
  resource_group_name = azurerm_resource_group.hackutd.name
  short_name          = "hackutd"
  enabled            = true
  webhook_properties = jsonencode({
    "webhookUrl": "https://hackutd.com/webhook"
  })
}