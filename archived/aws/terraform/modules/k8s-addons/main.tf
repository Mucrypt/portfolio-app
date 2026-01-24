# Kubernetes Addons Module
# Deploys essential cluster addons using Helm

locals {
  name = "${var.project_name}-${var.environment}"
}

# Nginx Ingress Controller
resource "helm_release" "nginx_ingress" {
  count = var.enable_nginx_ingress ? 1 : 0

  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  version          = "4.10.0"
  namespace        = "ingress-nginx"
  create_namespace = true

  values = [
    yamlencode({
      controller = {
        service = {
          annotations = {
            "service.beta.kubernetes.io/aws-load-balancer-type"                              = "nlb"
            "service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled" = "true"
            "service.beta.kubernetes.io/aws-load-balancer-backend-protocol"                  = "tcp"
          }
        }
        metrics = {
          enabled = true
          serviceMonitor = {
            enabled = false
          }
        }
        resources = {
          requests = {
            cpu    = "100m"
            memory = "128Mi"
          }
          limits = {
            cpu    = "500m"
            memory = "512Mi"
          }
        }
      }
    })
  ]
}

# Cert Manager
resource "helm_release" "cert_manager" {
  count = var.enable_cert_manager ? 1 : 0

  name             = "cert-manager"
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  version          = "1.14.4"
  namespace        = "cert-manager"
  create_namespace = true

  values = [
    yamlencode({
      installCRDs = true
      serviceAccount = {
        annotations = {
          "eks.amazonaws.com/role-arn" = var.cert_manager_role_arn
        }
      }
      resources = {
        requests = {
          cpu    = "10m"
          memory = "32Mi"
        }
        limits = {
          cpu    = "100m"
          memory = "128Mi"
        }
      }
      webhook = {
        resources = {
          requests = {
            cpu    = "10m"
            memory = "32Mi"
          }
          limits = {
            cpu    = "100m"
            memory = "128Mi"
          }
        }
      }
      cainjector = {
        resources = {
          requests = {
            cpu    = "10m"
            memory = "32Mi"
          }
          limits = {
            cpu    = "100m"
            memory = "128Mi"
          }
        }
      }
    })
  ]
}

# Metrics Server
resource "helm_release" "metrics_server" {
  count = var.enable_metrics_server ? 1 : 0

  name       = "metrics-server"
  repository = "https://kubernetes-sigs.github.io/metrics-server/"
  chart      = "metrics-server"
  version    = "3.12.0"
  namespace  = "kube-system"

  values = [
    yamlencode({
      resources = {
        requests = {
          cpu    = "10m"
          memory = "32Mi"
        }
        limits = {
          cpu    = "100m"
          memory = "128Mi"
        }
      }
    })
  ]
}

# Cluster Autoscaler
resource "helm_release" "cluster_autoscaler" {
  count = var.enable_cluster_autoscaler ? 1 : 0

  name       = "cluster-autoscaler"
  repository = "https://kubernetes.github.io/autoscaler"
  chart      = "cluster-autoscaler"
  version    = "9.35.0"
  namespace  = "kube-system"

  values = [
    yamlencode({
      autoDiscovery = {
        clusterName = var.cluster_name
      }
      awsRegion = var.aws_region
      rbac = {
        serviceAccount = {
          annotations = {
            "eks.amazonaws.com/role-arn" = var.cluster_autoscaler_role_arn
          }
        }
      }
      resources = {
        requests = {
          cpu    = "100m"
          memory = "300Mi"
        }
        limits = {
          cpu    = "500m"
          memory = "600Mi"
        }
      }
      extraArgs = {
        "balance-similar-node-groups" = true
        "skip-nodes-with-system-pods" = false
        "scale-down-enabled"          = true
        "scale-down-delay-after-add"  = "10m"
        "scale-down-unneeded-time"    = "10m"
      }
    })
  ]
}

# AWS Load Balancer Controller
resource "helm_release" "aws_load_balancer_controller" {
  count = var.enable_aws_load_balancer_controller ? 1 : 0

  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  version    = "1.7.1"
  namespace  = "kube-system"

  values = [
    yamlencode({
      clusterName = var.cluster_name
      region      = var.aws_region
      vpcId       = var.vpc_id
      serviceAccount = {
        annotations = {
          "eks.amazonaws.com/role-arn" = var.load_balancer_controller_role_arn
        }
      }
      resources = {
        requests = {
          cpu    = "100m"
          memory = "128Mi"
        }
        limits = {
          cpu    = "500m"
          memory = "512Mi"
        }
      }
    })
  ]
}

# External DNS
resource "helm_release" "external_dns" {
  count = var.enable_external_dns ? 1 : 0

  name       = "external-dns"
  repository = "https://kubernetes-sigs.github.io/external-dns/"
  chart      = "external-dns"
  version    = "1.14.3"
  namespace  = "kube-system"

  values = [
    yamlencode({
      provider      = "aws"
      sources       = ["ingress", "service"]
      domainFilters = var.domain_name != "" ? [var.domain_name] : []
      policy        = "sync"
      serviceAccount = {
        annotations = {
          "eks.amazonaws.com/role-arn" = var.external_dns_role_arn
        }
      }
      resources = {
        requests = {
          cpu    = "10m"
          memory = "32Mi"
        }
        limits = {
          cpu    = "100m"
          memory = "128Mi"
        }
      }
    })
  ]
}

# EBS CSI Driver
resource "helm_release" "ebs_csi_driver" {
  count = var.enable_ebs_csi_driver ? 1 : 0

  name       = "aws-ebs-csi-driver"
  repository = "https://kubernetes-sigs.github.io/aws-ebs-csi-driver"
  chart      = "aws-ebs-csi-driver"
  version    = "2.28.0"
  namespace  = "kube-system"

  values = [
    yamlencode({
      controller = {
        serviceAccount = {
          annotations = {
            "eks.amazonaws.com/role-arn" = var.ebs_csi_driver_role_arn
          }
        }
        resources = {
          requests = {
            cpu    = "10m"
            memory = "40Mi"
          }
          limits = {
            cpu    = "100m"
            memory = "256Mi"
          }
        }
      }
    })
  ]
}
