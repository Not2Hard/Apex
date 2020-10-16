locals {
  s3_origin_id = "ApexS3Origin"
}

data "aws_s3_bucket" "ui_bucket" {
  bucket = "${var.static_ui_bucket}"
}

# output "bucket" {
#   value = "${data.aws_s3_bucket.ui_bucket.id}"
# }


data "aws_acm_certificate" "ui-ssl-cert" { 
  provider    = "aws.us-east-1"  
  domain      = "*.apexquest.cloud"
  statuses    = ["ISSUED"]
  most_recent = true
}

resource "aws_cloudfront_origin_access_identity" "oai" {}

# resource "aws_s3_bucket" "static_ui_bucket" {
#   bucket        = "${data.aws_s3_bucket.ui_bucket.id}"
#   force_destroy = true

#   website {
#     index_document = "index.html"
#     error_document = "error.html"
#   }
# }



data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]    
    resources = ["${data.aws_s3_bucket.ui_bucket.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.oai.iam_arn}"]
    }
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = ["${data.aws_s3_bucket.ui_bucket.arn}"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.oai.iam_arn}"]
    }
  }
}

resource "aws_s3_bucket_policy" "example" {
  bucket = "${data.aws_s3_bucket.ui_bucket.id}"
  policy = "${data.aws_iam_policy_document.s3_policy.json}"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    origin_id   = "${local.s3_origin_id}"
    domain_name = "${data.aws_s3_bucket.ui_bucket.bucket_domain_name}"    

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path}"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "ApexQuest"
  default_root_object = "index.html"

  aliases = [
    "${var.site_domain_name}",
    "${var.site_naked_domain_name}",
  ]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${local.s3_origin_id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "none"
      # restriction_type = "whitelist"
      # locations        = ["US", "CA", "GB", "DE"]      
    }
  }

  viewer_certificate {
    # acm_certificate_arn      = "${data.aws_acm_certificate.ui-ssl-cert.arn}"
    acm_certificate_arn      = "arn:aws:acm:us-east-1:890018892817:certificate/59c8c1a5-9dc7-4429-b7ff-4406597d40f4"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"

    # cloudfront_default_certificate = true
  }
}

# resource "aws_route53_zone" "main" {
#   name = "${var.site_domain_name}"
# }

# resource "aws_route53_record" "root_domain" {
#   zone_id = "${aws_route53_zone.main.zone_id}"
#   name    = "${var.site_domain_name}"
#   type    = "A"

#   alias {
#     name                   = "${aws_cloudfront_distribution.s3_distribution.domain_name}"
#     zone_id                = "${aws_cloudfront_distribution.s3_distribution.hosted_zone_id}"
#     evaluate_target_health = false
#   }
# }

