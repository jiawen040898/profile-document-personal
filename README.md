# profile-document-fn

A lambda function for handling uploading item to bucket while providing a temp bucket buffer before user confirming the upload.

## Prerequisite

-   NodeJS 12+
-   Serverless 2.18+

## Installation

Install the require node_modules after cloning the repository.

```bash
npm i
```

## Local Development

Run serverless offline command to run the lambda function on local.

```bash
serverless offline
```

Note that current version of serverless offline having a bug that does not accept any payload more than 1mb. So the attachment test should not be more than 1mb for serverless-offline.

## Usage

This API allow temporary upload to happen. The document will be kept for the lifecycle of the bucket (which is currently 2 days based on setup bucket).

POST `/document/v1.0/file_upload`
Content-Type: `multipart/form-data`
Body:

```json
{
    "file": "file",
    "file_purpose": "resume|attachment"
}
```

## Test

Run `yarn test`

## To deploy to AWS

1. Run `yarn install`
2. Run the following command:

```bash
TAG_VERSION=local-$(date -u +%Y%m%d-%H%M%S) yarn sls deploy --stage {{ ENVIRONMENT }} --region {{ REGION }}
```

For Window Powershell:

```shell
$Env:TAG_VERSION="0."+$(Get-Date -UFormat +%Y%m%d.%H%M%S)
yarn sls deploy --stage {{ ENVIRONMENT }} --region {{ REGION }}
```

**Note**: Replace `{{ ENVIRONMENT }}` and `{{ REGION }}` with the environment and region that you are intended to deploy
