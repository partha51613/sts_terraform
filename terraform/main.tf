provider "aws" {
  region = "us-east-1"
}

# VPC with 2 public and 2 private subnets
module "tf_vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "tf-ecs-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Terraform   = "true"
    Environment = "dev"
  }
}

# Security Group for ALB
resource "aws_security_group" "tf_alb_sg" {
  name   = "tf-alb-sg"
  vpc_id = module.tf_vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security Group for ECS Tasks
resource "aws_security_group" "tf_ecs_sg" {
  name   = "tf-ecs-sg"
  vpc_id = module.tf_vpc.vpc_id

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.tf_alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "tf_main" {
  name = "tf-my-ecs-cluster"
}

# Task Definition with your Docker image
resource "aws_ecs_task_definition" "tf_web" {
  family                   = "tf-simple-time-service-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name      = "simple-time-service"
    image     = "partha51613/simple-time-service:latest"
    cpu       = 0
    memory    = 512
    essential = true
    portMappings = [
      {
        containerPort = 3001
        hostPort      = 3001 # Match host port to container port
      }
    ]
  }])
}

# Load Balancer
resource "aws_lb" "tf_app" {
  name               = "tf-app-lb"
  internal           = false
  load_balancer_type = "application"
  subnets            = module.tf_vpc.public_subnets
  security_groups    = [aws_security_group.tf_alb_sg.id]
}

resource "aws_lb_target_group" "tf_tg" {
  name        = "tf-app-tg"
  port        = 3001 # Update port to match container's port
  protocol    = "HTTP"
  vpc_id      = module.tf_vpc.vpc_id
  target_type = "ip"
}

resource "aws_lb_listener" "tf_http" {
  load_balancer_arn = aws_lb.tf_app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tf_tg.arn
  }
}

# ECS Service
resource "aws_ecs_service" "tf_web" {
  name            = "tf-simple-time-service"
  cluster         = aws_ecs_cluster.tf_main.id
  task_definition = aws_ecs_task_definition.tf_web.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = module.tf_vpc.private_subnets
    security_groups  = [aws_security_group.tf_ecs_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.tf_tg.arn
    container_name   = "simple-time-service"
    container_port   = 3001 # Ensure container port is correct
  }

  depends_on = [aws_lb_listener.tf_http]
}

output "alb_web_url" {
  value = "http://${aws_lb.tf_app.dns_name}"
  description = "The public URL of the Application Load Balancer"
}