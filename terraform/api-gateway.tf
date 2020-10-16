module "proxy_cors" {
  source = "./modules/options-module"
  resource_name = "cors"
  resource_id = "${aws_api_gateway_resource.proxy.id}"
  rest_api_id = "${aws_api_gateway_rest_api.example.id}"
}

resource "aws_api_gateway_rest_api" "example" {
  name        = "ApexQuestAPI"
  description = "ApexQuest API"
}

# module "proxy_cors" {
#   source = "../modules/options-module"
#   resource_name = "cors"
#   resource_id = "${aws_api_gateway_resource.proxy.id}"
#   rest_api_id = "${aws_api_gateway_rest_api.example.id}"
# }

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.example.id}"
  parent_id   = "${aws_api_gateway_rest_api.example.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = "${aws_api_gateway_rest_api.example.id}"
  resource_id   = "${aws_api_gateway_resource.proxy.id}"
  http_method   = "ANY"
  authorization = "NONE"
  # authorization = "COGNITO_USER_POOLS"
  # authorizer_id = "${aws_api_gateway_authorizer.snitch_api_authorizer.id}"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.example.id}"
  resource_id = "${aws_api_gateway_method.proxy.resource_id}"
  http_method = "${aws_api_gateway_method.proxy.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.api_lambda.invoke_arn}"
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = "${aws_api_gateway_rest_api.example.id}"
  resource_id   = "${aws_api_gateway_rest_api.example.root_resource_id}"
  http_method   = "ANY"
  authorization = "NONE"
  # authorization = "COGNITO_USER_POOLS"
  # authorizer_id = "${aws_api_gateway_authorizer.snitch_api_authorizer.id}"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id = "${aws_api_gateway_rest_api.example.id}"
  resource_id = "${aws_api_gateway_method.proxy_root.resource_id}"
  http_method = "${aws_api_gateway_method.proxy_root.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.api_lambda.invoke_arn}"
}

resource "aws_api_gateway_deployment" "example" {
  depends_on = [
    "aws_api_gateway_integration.lambda",
    "aws_api_gateway_integration.lambda_root",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.example.id}"
  stage_name  = "test"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.api_lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.example.execution_arn}/*/*"
}

# resource "aws_api_gateway_authorizer" "snitch_api_authorizer" {
#   name          = "snitch_api_authorizer"
#   rest_api_id   = "${aws_api_gateway_rest_api.example.id}"
#   type          = "COGNITO_USER_POOLS"
#   provider_arns = ["${aws_cognito_user_pool.main.arn}"]  
# }
