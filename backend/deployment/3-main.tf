terraform {
  backend "s3" {
    backend = "socialnetwork-terraform-state"
    key = "develop/socialnetwork.tfstate"
    region = var.aws_region
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
  common_tags = {
    Enviroment = terraform.workspace
    Project = var.project
    ManagedBy = "Terraform"
    Owner = "Eldad Fikre Mamo"
  }
}

