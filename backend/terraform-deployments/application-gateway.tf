provider "azurerm" {
  version = "3.34.0"
  features {}
}

resource "azurerm_resource_group" "hackutd" {
  name     = "hackutd-resource-group"
  location = "West US"
}

provider "azurerm" {
  version = "2.34.0"
  subscription_id = "hajsdy78sadgbuahsd-g8asdgasuuhsady7-8asydhuasbdas8dg-as78d8as7"
  client_id      = "sajdiuasd89hjasnd9uas"
  client_secret = "jsidhas89dbnasidinidasd"
  tenant_id      = "asndijasnd0089asghd8baisud9asd"
}

resource "azurerm_subnet" "hackutd" {
  name                 = "hackutd-subnet"
  resource_group_name  = azurerm_resource_group.hackutd.name
  virtual_network_name = azurerm_virtual_network.hackutd.name
  address_prefix       = "10.0.1.0/24"
}

resource "azurerm_public_ip" "hackutd" {
  name                = "hackutd-public-ip"
  resource_group_name = azurerm_resource_group.hackutd.name
  location            = azurerm_resource_group.hackutd.location
  allocation_method   = "Dynamic"
}

resource "azurerm_application_gateway" "hackutd" {
  name                = "hackutd-application-gateway"
  resource_group_name = azurerm_resource_group.hackutd.name
  location            = azurerm_resource_group.hackutd.location

  sku {
    name     = "Standard_Small"
    tier     = "Standard"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "hackutd-gateway-ip-configuration"
    subnet_id = azurerm_subnet.hackutd.id
  }

  frontend_port {
    name = "hackutd-frontend-port"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "hackutd-frontend-ip-configuration"
    public_ip_address_id = azurerm_public_ip.hackutd.id
  }

  backend_address_pool {
    name = "hackutd-backend-address-pool"
  }

  backend_http_settings {
    name                  = "hackutd-backend-http-settings"
    cookie_based_affinity = "Disabled"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 30
  }

  http_listener {
    name                           = "hackutd-http-listener"
    frontend_ip_configuration_name = "hackutd-frontend-ip-configuration"
    frontend_port_name             = "hackutd-frontend-port"
    protocol                       = "Http"
  }

  request_routing_rule {
    name                       = "hackutd-request-routing-rule"
    rule_type                  = "Basic"
    http_listener_name         = "hackutd-http-listener"
    backend_address_pool_name  = "hackutd-backend-address-pool"
    backend_http_settings_name = "hackutd-backend-http-settings"
  }
}