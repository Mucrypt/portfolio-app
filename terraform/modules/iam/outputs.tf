output "load_balancer_controller_role_arn" {
  description = "ARN of the IAM role for AWS Load Balancer Controller"
  value       = aws_iam_role.load_balancer_controller.arn
}

output "cluster_autoscaler_role_arn" {
  description = "ARN of the IAM role for Cluster Autoscaler"
  value       = aws_iam_role.cluster_autoscaler.arn
}

output "ebs_csi_driver_role_arn" {
  description = "ARN of the IAM role for EBS CSI Driver"
  value       = aws_iam_role.ebs_csi_driver.arn
}

output "external_dns_role_arn" {
  description = "ARN of the IAM role for External DNS"
  value       = aws_iam_role.external_dns.arn
}

output "cert_manager_role_arn" {
  description = "ARN of the IAM role for Cert Manager"
  value       = aws_iam_role.cert_manager.arn
}
