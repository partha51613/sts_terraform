## TERRAFORM

This directory contains the Terraform code to deploy the **Simple Time Service** application on AWS.

### Prerequisites

1. **Terraform**: You must have Terraform installed. You can download and install it from https://www.terraform.io/downloads.html.
2. **AWS Account**: You should have an AWS account and access to an IAM user with the necessary permissions to create resources like ECS, IAM roles, VPC, and security groups.
3. **AWS CLI**: Install and configure the AWS CLI with your credentials. You can follow the installation guide here: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html.

### Steps to Deploy

1. **Clone the Repository**: Start by cloning this repository to your local machine.
2. **Navigate to the Terraform Directory**: Go to the /terraform folder where the Terraform code is located.
3. **Initialize Terraform**: Run the following command to initialize Terraform and download the necessary provider plugins:
```
terraform init
```
4. **Configure AWS Credentials**: Ensure your AWS credentials are configured using the AWS CLI or environment variables. 
- If you're using AWS CLI, run the following command to configure your credentials:
```
aws configure
```
- Alternatively, you can set the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

5. **Apply the Terraform Configuration**: Run the following command to deploy the resources to AWS:

```
terraform apply
```