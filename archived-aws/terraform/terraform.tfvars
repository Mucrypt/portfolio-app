# Portfolio Application - Terraform Variables Values
# Customize these values for your deployment

# General Configuration
project_name = "portfolio"
environment  = "production"
aws_region   = "us-east-1"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"

# EKS Cluster Configuration
cluster_version = "1.31"

# Node Groups Configuration
node_groups = {
  general = {
    desired_size   = 3
    min_size       = 2
    max_size       = 10
    instance_types = ["t3.medium"]
    capacity_type  = "ON_DEMAND"
    disk_size      = 50
    labels = {
      role        = "general"
      environment = "production"
    }
  }

  # Uncomment for spot instances (cost optimization)
  # spot = {
  #   desired_size   = 2
  #   min_size      = 1
  #   max_size      = 5
  #   instance_types = ["t3.medium", "t3a.medium"]
  #   capacity_type  = "SPOT"
  #   disk_size     = 50
  #   labels = {
  #     role        = "spot"
  #     environment = "production"
  #   }
  # }
}

# Kubernetes Addons
enable_nginx_ingress                = true
enable_cert_manager                 = true
enable_metrics_server               = true
enable_cluster_autoscaler           = true
enable_aws_load_balancer_controller = true
enable_external_dns                 = true
enable_ebs_csi_driver               = true

# Domain Configuration
domain_name = "romeomukulah.org"

# Additional Tags
additional_tags = {
  Owner      = "Romeo Mukula"
  Repository = "Mucrypt/portfolio-app"
  CostCenter = "Engineering"
}
