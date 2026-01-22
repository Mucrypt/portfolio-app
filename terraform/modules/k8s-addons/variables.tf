variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "domain_name" {
  description = "Domain name for external DNS"
  type        = string
  default     = ""
}

variable "enable_nginx_ingress" {
  description = "Enable Nginx Ingress Controller"
  type        = bool
  default     = true
}

variable "enable_cert_manager" {
  description = "Enable Cert Manager"
  type        = bool
  default     = true
}

variable "enable_metrics_server" {
  description = "Enable Metrics Server"
  type        = bool
  default     = true
}

variable "enable_cluster_autoscaler" {
  description = "Enable Cluster Autoscaler"
  type        = bool
  default     = true
}

variable "enable_aws_load_balancer_controller" {
  description = "Enable AWS Load Balancer Controller"
  type        = bool
  default     = true
}

variable "enable_external_dns" {
  description = "Enable External DNS"
  type        = bool
  default     = true
}

variable "enable_ebs_csi_driver" {
  description = "Enable EBS CSI Driver"
  type        = bool
  default     = true
}

variable "load_balancer_controller_role_arn" {
  description = "IAM role ARN for AWS Load Balancer Controller"
  type        = string
}

variable "cluster_autoscaler_role_arn" {
  description = "IAM role ARN for Cluster Autoscaler"
  type        = string
}

variable "external_dns_role_arn" {
  description = "IAM role ARN for External DNS"
  type        = string
}

variable "cert_manager_role_arn" {
  description = "IAM role ARN for Cert Manager"
  type        = string
}

variable "ebs_csi_driver_role_arn" {
  description = "IAM role ARN for EBS CSI Driver"
  type        = string
}
