import type { AWS } from "@serverless/typescript"
import { functions } from "./src/functions"

const serverlessConfiguration: AWS = {
  service: "wordle-tracker",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
    secrets: "${file(secrets.local.json)}",
  },
  plugins: ["serverless-webpack", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      WORD_HISTORY_TABLE_NAME: "${self:service.name}-history",
      TIMEZONE: "America/Toronto",
      // db config
      UB_NAME: "${self:custom.secrets.DB_NAME}",
      UB_USER: "${self:custom.secrets.DB_USER}",
      DB_PASSWORD: "${self:custom.secrets.DB_PASSWORD}",
      DB_HOST: "${self:custom.secrets.DB_HOST}",
      DB_PORT: "${self:custom.secrets.DB_PORT}",
    },
    lambdaHashingVersion: "20201221",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:GetItem", "dynamodb:PutItem"],
        Resource: [{ "Fn::GetAtt": ["WordHistoryTable", "Arn"] }],
      },
    ],
    vpc: {
      securityGroupIds: ["${self:custom.secrets.SECURITY_GROUP_ID}"],
      subnetIds: [
        "${self:custom.secrets.SUBNET1_ID}",
        "${self:custom.secrets.SUBNET2_ID}",
        "${self:custom.secrets.SUBNET3_ID}",
        "${self:custom.secrets.SUBNET4_ID}",
      ],
    },
  },

  functions,
  resources: {
    Resources: {
      WordHistoryTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.WORD_HISTORY_TABLE_NAME}",
          AttributeDefinitions: [{ AttributeName: "date", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "date", KeyType: "HASH" }],
          SSESpecification: { SSEEnabled: true },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
