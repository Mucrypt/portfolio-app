output "nginx_ingress_release_name" {
  description = "Name of the Nginx Ingress Helm release"
  value       = var.enable_nginx_ingress ? helm_release.nginx_ingress[0].name : null
}

output "cert_manager_release_name" {
  description = "Name of the Cert Manager Helm release"
  value       = var.enable_cert_manager ? helm_release.cert_manager[0].name : null
}

output "metrics_server_release_name" {
  description = "Name of the Metrics Server Helm release"
  value       = var.enable_metrics_server ? helm_release.metrics_server[0].name : null
}

output "cluster_autoscaler_release_name" {
  description = "Name of the Cluster Autoscaler Helm release"
  value       = var.enable_cluster_autoscaler ? helm_release.cluster_autoscaler[0].name : null
}

output "aws_load_balancer_controller_release_name" {
  description = "Name of the AWS Load Balancer Controller Helm release"
  value       = var.enable_aws_load_balancer_controller ? helm_release.aws_load_balancer_controller[0].name : null
}

output "external_dns_release_name" {
  description = "Name of the External DNS Helm release"
  value       = var.enable_external_dns ? helm_release.external_dns[0].name : null
}

output "ebs_csi_driver_release_name" {
  description = "Name of the EBS CSI Driver Helm release"
  value       = var.enable_ebs_csi_driver ? helm_release.ebs_csi_driver[0].name : null
}
