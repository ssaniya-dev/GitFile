provider "azurerm" {
  version = "3.0.0"
  features {}
}

resource "azurerm_resource_group" "hackutd" {
  name     = "hackutd-resources"
  location = "West US"
}

resource "azurerm_virtual_network" "hackutd" {
  name                = "hackutd-virtual-network"
  resource_group_name = azurerm_resource_group.hackutd.name
  location            = azurerm_resource_group.hackutd.location
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "hackutd" {
  name                 = "hackutd-subnet"
  resource_group_name = azurerm_resource_group.hackutd.name
  virtual_network_name = azurerm_virtual_network.hackutd.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "hackutd" {
  name                = "hackutd-public-ip"
  resource_group_name = azurerm_resource_group.hackutd.name
  location            = azurerm_resource_group.hackutd.location
  allocation_method   = "Static"
}

resource "azurerm_lb" "hackutd" {
  name                = "hackutd-lb"
  resource_group_name = azurerm_resource_group.hackutd.name
  location            = azurerm_resource_group.hackutd.location

  frontend_ip_configuration {
    name                 = "hackutd-frontend-ip"
    public_ip_address_id = azurerm_public_ip.hackutd.id
  }
}

resource "azurerm_lb_backend_address_pool" "hackutd" {
  name            = "hackutd-backend-pool"
  loadbalancer_id = azurerm_lb.hackutd.id
}

resource "azurerm_lb_backend_address_pool_address" "hackutd" {
  name                    = "hackutd-backend-pool-address"
  backend_address_pool_id = azurerm_lb_backend_address_pool.hackutd.id
  virtual_network_id      = azurerm_virtual_network.hackutd.id
  ip_address               = "10.0.1.10"
}

resource "azurerm_lb_rule" "hackutd" {
  name                           = "hackutd-lb-rule"
  loadbalancer_id                = azurerm_lb.hackutd.id
  protocol                       = "Tcp"
  frontend_port                  = 80
  backend_port                   = 80
  frontend_ip_configuration_name = "hackutd-frontend-ip"
  backend_address_pool_ids       = [azurerm_lb_backend_address_pool.hackutd.id]
}