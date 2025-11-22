terraform {
  required_version = ">= 1.4"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

##############################
# ECR Repository
##############################

resource "aws_ecr_repository" "portfolio" {
  name = "personal-portfolio"

  image_scanning_configuration {
    scan_on_push = true
  }
}

##############################
# S3 Bucket for Frontend Build
##############################

resource "aws_s3_bucket" "portfolio" {
  bucket = "jennifershi-portfolio"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "portfolio" {
  bucket                  = aws_s3_bucket.portfolio.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

##############################
# CloudFront Distribution
##############################

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "portfolio-oac"
  description                       = "OAC for S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "portfolio" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.portfolio.bucket_regional_domain_name
    origin_id   = "s3-origin"

    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  price_class = "PriceClass_100"

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

##############################
# ECS Cluster
##############################

resource "aws_ecs_cluster" "portfolio" {
  name = "portfolio-cluster"
}

##############################
# IAM Roles
##############################

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs-task-execution-role"
  assume_role_policy = jsonencode({
    Version : "2012-10-17",
    Statement : [{
      Effect : "Allow",
      Principal : { Service : "ecs-tasks.amazonaws.com" },
      Action : "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_attach" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

##############################
# ECS Task Definition
##############################

resource "aws_ecs_task_definition" "portfolio" {
  family                   = "portfolio-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "portfolio"
      image     = "${aws_ecr_repository.portfolio.repository_url}:latest"
      essential = true
      portMappings = [{
        containerPort = 3000
        hostPort      = 3000
      }]
    }
  ])
}

##############################
# ECS Service (Fargate)
##############################

resource "aws_ecs_service" "portfolio" {
  name            = "portfolio-service"
  cluster         = aws_ecs_cluster.portfolio.id
  task_definition = aws_ecs_task_definition.portfolio.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = ["subnet-0264c5a9b0d9f6176", "subnet-0000927f093904479", "subnet-0c3b09a8cfff04d7c"]
    assign_public_ip = true
    security_groups = ["sg-07c5ec9c7153dc72c"] 
  }

  lifecycle {
    ignore_changes = [
      task_definition # required so GitHub Actions can redeploy new images
    ]
  }
}

##############################
# Outputs for GitHub Actions
##############################

output "aws_region" {
  value = "us-east-2"
}

output "ecr_repository" {
  value = aws_ecr_repository.portfolio.name
}

output "s3_bucket" {
  value = aws_s3_bucket.portfolio.bucket
}

output "ecs_cluster" {
  value = aws_ecs_cluster.portfolio.name
}

output "ecs_service" {
  value = aws_ecs_service.portfolio.name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.portfolio.id
}
