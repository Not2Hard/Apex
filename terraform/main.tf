provider "aws" {
  region  = "us-west-2"
  # profile = "zebrometer"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

data "aws_region" "current" {}