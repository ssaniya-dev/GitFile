provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "hackutd" {
  name     = "hackutd-resource-group"
  location = "West US"
}

resource "azurerm_virtual_network" "hackutd" {
  name                = "hackutd-virtual-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name
}

resource "azurerm_subnet" "hackutd" {
  name                 = "hackutd-subnet"
  resource_group_name = azurerm_resource_group.hackutd.name
  virtual_network_name = azurerm_virtual_network.hackutd.name
  address_prefix       = "10.0.1.0/24"
}

resource "azurerm_public_ip" "hackutd" {
  name                = "hackutd-public-ip"
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name
  allocation_method   = "Dynamic"
}

resource "azurerm_virtual_network_gateway" "hackutd" {
  name                = "hackutd-vpn-gateway"
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name

  type     = "Vpn"
  vpn_type = "RouteBased"

  active_active = false
  enable_bgp    = false
  sku           = "VpnGw1"

  ip_configuration {
    name                          = "hackutd-ip-configuration"
    public_ip_address_id          = azurerm_public_ip.hackutd.id
    private_ip_address_allocation = "Dynamic"
    subnet_id                     = azurerm_subnet.hackutd.id
  }
}

resource "azurerm_virtual_network_gateway_connection" "hackutd" {
  name                = "hackutd-vpn-connection"
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name

  type                       = "IPsec"
  virtual_network_gateway_id = azurerm_virtual_network_gateway.hackutd.id

  local_network_gateway_id = azurerm_local_network_gateway.hackutd.id

  shared_key = "hackutd-shared-key"
}

resource "azurerm_local_network_gateway" "hackutd" {
  name                = "hackutd-local-network-gateway"
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name

  gateway_address = "192.168.1.1"
  address_space    = ["192.168.1.0/24"]
}