# Portfolio Application - Main Terraform Configuration
# AWS EKS Infrastructure as Code
# Version: 1.0.0

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  # Backend configuration for state management
  backend "s3" {
    bucket         = "portfolio-terraform-state-839868753466"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "portfolio-terraform-locks"
  }
}

# AWS Provider Configuration
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "portfolio-app"
      Environment = var.environment
      ManagedBy   = "terraform"
      Owner       = "Romeo Mukula"
      Repository  = "Mucrypt/portfolio-app"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Local variables
locals {
  cluster_name = "${var.project_name}-${var.environment}-cluster"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  # VPC CIDR blocks
  vpc_cidr = var.vpc_cidr
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = local.vpc_cidr
  azs          = local.azs

  enable_nat_gateway   = true
  enable_vpn_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = local.common_tags
}

# EKS Module
module "eks" {
  source = "./modules/eks"

  project_name = var.project_name
  environment  = var.environment
  cluster_name = local.cluster_name

  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids

  cluster_version = var.cluster_version

  node_groups = var.node_groups

  tags = local.common_tags

  depends_on = [module.vpc]
}

# IAM Module
module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
  cluster_name = local.cluster_name

  oidc_provider_arn = module.eks.oidc_provider_arn
  oidc_provider_url = module.eks.oidc_provider_url

  tags = local.common_tags

  depends_on = [module.eks]
}

# Kubernetes Provider Configuration
# Note: These providers are commented out because the k8s add-ons are already deployed via Helm CLI
# If you need to manage k8s resources via Terraform in the future, uncomment these
# provider "kubernetes" {
#   host                   = module.eks.cluster_endpoint
#   cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)
#
#   exec {
#     api_version = "client.authentication.k8s.io/v1beta1"
#     command     = "aws"
#     args = [
#       "eks",
#       "get-token",
#       "--cluster-name",
#       local.cluster_name,
#       "--region",
#       var.aws_region
#     ]
#   }
# }

# Helm Provider Configuration
# provider "helm" {
#   kubernetes {
#     host                   = module.eks.cluster_endpoint
#     cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)
#
#     exec {
#       api_version = "client.authentication.k8s.io/v1beta1"
#       command     = "aws"
#       args = [
#         "eks",
#         "get-token",
#         "--cluster-name",
#         local.cluster_name,
#         "--region",
#         var.aws_region
#       ]
#     }
#   }
# }

# Kubernetes Addons Module
# Note: Commented out because add-ons are already deployed via Helm CLI
# If you need to manage add-ons via Terraform in the future, uncomment this along with the providers above
# module "k8s_addons" {
#   source = "./modules/k8s-addons"
#
#   project_name = var.project_name
#   environment  = var.environment
#   cluster_name = local.cluster_name
#   aws_region   = var.aws_region
#   vpc_id       = module.vpc.vpc_id
#   domain_name  = var.domain_name
#
#   enable_nginx_ingress                = var.enable_nginx_ingress
#   enable_cert_manager                 = var.enable_cert_manager
#   enable_metrics_server               = var.enable_metrics_server
#   enable_cluster_autoscaler           = var.enable_cluster_autoscaler
#   enable_aws_load_balancer_controller = var.enable_aws_load_balancer_controller
#   enable_external_dns                 = var.enable_external_dns
#   enable_ebs_csi_driver               = var.enable_ebs_csi_driver
#
#   load_balancer_controller_role_arn = module.iam.load_balancer_controller_role_arn
#   cluster_autoscaler_role_arn       = module.iam.cluster_autoscaler_role_arn
#   external_dns_role_arn             = module.iam.external_dns_role_arn
#   cert_manager_role_arn             = module.iam.cert_manager_role_arn
#   ebs_csi_driver_role_arn           = module.iam.ebs_csi_driver_role_arn
#
#   depends_on = [module.eks, module.iam]
# }

# RDS Module (Optional - for future use if migrating from Supabase)
# module "rds" {
#   source = "./modules/rds"
#
#   project_name = var.project_name
#   environment  = var.environment
#   
#   vpc_id             = module.vpc.vpc_id
#   private_subnet_ids = module.vpc.database_subnet_ids
#   
#   instance_class     = var.rds_instance_class
#   allocated_storage  = var.rds_allocated_storage
#   
#   tags = local.common_tags
#
#   depends_on = [module.vpc]
# }

# Outputs
output "cluster_name" {
  description = "EKS Cluster Name"
  value       = local.cluster_name
}

output "cluster_id" {
  description = "EKS Cluster ID"
  value       = module.eks.cluster_id
}

output "cluster_endpoint" {
  description = "EKS Cluster Endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "EKS Cluster Security Group ID"
  value       = module.eks.cluster_security_group_id
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "kubectl_config_command" {
  description = "Command to update kubeconfig"
  value       = "aws eks update-kubeconfig --name ${local.cluster_name} --region ${var.aws_region}"
}

output "load_balancer_dns" {
  description = "Load Balancer DNS (available after ingress deployment)"
  value       = "Run: kubectl get svc -n ingress-nginx ingress-nginx-controller"
}
