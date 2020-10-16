# variable "api_gateway_name" { }

variable "static_ui_bucket_arn" {
  default = "arn:aws:s3:::apexquest.cloud"
}

variable "static_ui_bucket" {
  default = "apexquest.cloud"
}

variable "site_domain_name" {
  default = "www.apexquest.cloud"  
}

variable "site_naked_domain_name" {
  default = "apexquest.cloud"  
}
