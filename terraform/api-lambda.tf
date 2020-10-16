data "archive_file" "lambda-runner-zip" {
  type        = "zip"  
  source_dir  = "../lambda/api-lambda"
  output_path = "../out/api-lambda.zip"  
}

resource "aws_lambda_function" "api_lambda" {
  function_name    = "AlexQuest"
  filename         = "${data.archive_file.lambda-runner-zip.output_path}"
  source_code_hash = "${data.archive_file.lambda-runner-zip.output_md5}"
  handler          = "index.handler"
  runtime          = "nodejs8.10"
  role             = "${aws_iam_role.lambda_exec.arn}"
  timeout          = 25
  memory_size      = 128

  environment {
    variables = {
      REGION = "${data.aws_region.current.name}"
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "ApexQuest"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "api-AWSLambdaBasicExecutionRole" {
  role       = "${aws_iam_role.lambda_exec.id}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda-api-role-policy" {
  policy = "${data.aws_iam_policy_document.snitch-api-policy-document.json}"
  role   = "${aws_iam_role.lambda_exec.id}"
}

data "aws_iam_policy_document" "snitch-api-policy-document" {
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    # resources = ["${aws_s3_bucket.report_bucket.arn}"]
    resources = ["*"]
  }

  statement {
    effect    = "Allow"
    actions   = ["*"]
    resources = ["*"]
  }
}
