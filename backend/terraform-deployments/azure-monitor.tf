# Configure the Azure Provider
provider "azurerm" {
  version = "2.34.0"
  subscription_id = "hajsdy78sadgbuahsd-g8asdgasuuhsady7-8asydhuasbdas8dg-as78d8as7"
  client_id      = "sajdiuasd89hjasnd9uas"
  client_secret = "jsidhas89dbnasidinidasd"
  tenant_id      = "asndijasnd0089asghd8baisud9asd"
}

# Create a Log Analytics workspace
resource "azurerm_log_analytics_workspace" "hackutd" {
  name                = "hackutd-log-analytics-workspace"
  location            = "West US"
  resource_group_name = "hackutd-resource-group"
  sku                 = "PerGB2018"
}

# Create a metric alert
resource "azurerm_metric_alert" "hackutd" {
  name                = "hackutd-metric-alert"
  resource_group_name = "hackutd-resource-group"
  scope                = azurerm_log_analytics_workspace.hackutd.id
  alert_rule_resource_id = azurerm_log_analytics_workspace.hackutd.id
  severity             = "Critical"
  frequency           = "PT1M"
  window_size         = "PT5M"

  criteria {
    metric_namespace = "Microsoft.Compute/virtualMachines"
    metric_name      = "CPUUsagePercentage"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = azurerm_action_group.hackutd.id
  }
}

# Create a log alert
resource "azurerm_log_alert" "hackutd" {
  name                = "hackutd-log-alert"
  resource_group_name = "hackutd-resource-group"
  scope                = azurerm_log_analytics_workspace.hackutd.id
  criteria {
    query = "AzureDiagnostics"
    condition = "countif(AzureDiagnostics) > 10"
  }

  action {
    action_group_id = azurerm_action_group.hackutd.id
  }
}

# Create an action group
resource "azurerm_action_group" "hackutd" {
  name                = "hackutd-action-group"
  resource_group_name = "hackutd-resource-group"
  short_name          = "hackutd-action-group"
  enabled             = true

  email_receiver {
    name                    = "hackutd-email-receiver"
    email_address          = "hackutd-email@hackutd.com"
    use_common_alert_message = true
  }
}