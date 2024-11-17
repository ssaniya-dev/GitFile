provider "azurerm" {
  version = "3.34.0"
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
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "hackutd" {
  name                = "hackutd-public-ip"
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name
  allocation_method   = "Dynamic"
}

resource "azurerm_network_interface" "hackutd" {
  name                = "hackutd-nic"
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name

  ip_configuration {
    name                          = "hackutd-ip-config"
    subnet_id                     = azurerm_subnet.hackutd.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.hackutd.id
  }
}

resource "azurerm_linux_virtual_machine" "hackutd" {
  name                = "hackutd-vm"
  location            = azurerm_resource_group.hackutd.location
  resource_group_name = azurerm_resource_group.hackutd.name
  size                = "Standard_DS2_v2"

  network_interface_ids = [azurerm_network_interface.hackutd.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "16.04-LTS"
    version   = "latest"
  }

  admin_username = "adminuser"
  admin_password = "<not pushed via git>"
}