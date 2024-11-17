provider "azurerm" {
  version = "2.34.0"
  subscription_id = "hajsdy78sadgbuahsd-g8asdgasuuhsady7-8asydhuasbdas8dg-as78d8as7"
  client_id      = "sajdiuasd89hjasnd9uas"
  client_secret = "jsidhas89dbnasidinidasd"
  tenant_id      = "asndijasnd0089asghd8baisud9asd"
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
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_firewall" "hackutd" {
  name                = "hackutd-firewall"
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name

  ip_configuration {
    name                 = "hackutd-ip-configuration"
    subnet_id           = azurerm_subnet.hackutd.id
    public_ip_address_id = azurerm_public_ip.hackutd.id
  }
}

resource "azurerm_public_ip" "hackutd" {
  name                = "hackutd-public-ip"
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name
  allocation_method = "Static"
  sku               = "Standard"
}

resource "azurerm_firewall_network_rule_collection" "hackutd" {
  name                = "hackutd-network-rule-collection"
  azure_firewall_name = azurerm_firewall.hackutd.name
  resource_group_name = azurerm_resource_group.hackutd.name
  priority           = 100

  rule {
    name                      = "hackutd-rule"
    protocol                  = "Tcp"
    source_port_range         = "*"
    destination_port_range    = "80"
    destination_address_prefix = "10.0.1.0/24"
  }
}