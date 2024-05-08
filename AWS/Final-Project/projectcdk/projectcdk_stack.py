from aws_cdk import Stack
import aws_cdk as cdk
import aws_cdk.aws_dynamodb as dynamodb
import aws_cdk.aws_iam as iam
import aws_cdk.aws_lambda as aws_lambda
import aws_cdk.aws_apigatewayv2 as apiv2 #--> for use with commented api code
import aws_cdk.aws_apigateway as apiv1 #--> for use with commented api code

from constructs import Construct

class GameRecServiceStack(Stack):
    def __init__(self, scope: cdk.App, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Create DynamoDB table
        table = dynamodb.Table(
            self, "GameRecServiceDB",
            table_name="GameRecService_DB",
            partition_key=dynamodb.Attribute(name="PK", type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(name="SK", type=dynamodb.AttributeType.STRING),
            removal_policy=cdk.RemovalPolicy.DESTROY)

        # Create IAM role for Lambda function
        role = iam.Role(
            self, "GameRecServiceRole",
            role_name="GameRecService_Role",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AWSLambdaBasicExecutionRole"), 
                              iam.ManagedPolicy.from_aws_managed_policy_name("AmazonDynamoDBFullAccess"),]
                              #iam.ManagedPolicy.from_aws_managed_policy_name("AmazonAPIGatewayInvokeFullAccess")]
        )
        role.apply_removal_policy(cdk.RemovalPolicy.DESTROY)

        # Attach policy to allow Lambda to interact with DynamoDB
        table.grant_read_write_data(role)

        # Create Lambda function
        handler = aws_lambda.Function(
            self, "GameRecServ_Lambda",
            function_name="GameRecService_Lambda",
            runtime= aws_lambda.Runtime.NODEJS_16_X,
            handler="index.handler",
            role=role,
            code=aws_lambda.Code.from_asset("lambda"), 
            environment={
                "TABLE_NAME": table.table_name 
            }
        )
        handler.add_function_url(auth_type=aws_lambda.FunctionUrlAuthType.NONE,
                                 invoke_mode=aws_lambda.InvokeMode.BUFFERED)
        handler.add_environment("CORS_ALLOW_ORIGIN", "*")
        handler.apply_removal_policy(cdk.RemovalPolicy.DESTROY)

        #The following commented lines are from a trial with API Gateway
        #We had a half working implementation with the API displaying the webpage that the lambda has
        #however when the user submits their entry it results in a forbidden error.
        #we could not troubleshoot the error and it could not get fixed.

        #api = apiv1.LambdaRestApi(self, "GameRecServiceAPI", handler=handler, proxy=True) #loads webpage but gives forbidden error when submitting to db
        #prod_resource = api.root.add_resource("prod")
        #prod_resource.add_method("GET")
        #cdk.CfnOutput(self, "API Gateway URL", value=api.url) 

        region = self.region
        lambda_function_url = f"https://{region}.console.aws.amazon.com/lambda/home?region={region}#/functions/{handler.function_arn}"
        cdk.CfnOutput(self, "Page to get lambda url", value=lambda_function_url)

        
