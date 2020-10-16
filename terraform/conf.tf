terraform {
  backend "s3" {
    bucket = "tfstate.apexquest.cloud"
    key    = "terraform.tfstate"
    region = "us-west-2"
  }
}