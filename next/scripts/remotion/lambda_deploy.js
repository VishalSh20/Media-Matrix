import {deployFunction, getOrCreateBucket} from "@remotion/lambda"
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const deployToLambda = async () => {
  try {
    const bucket = await getOrCreateBucket({
      region: process.env.AWS_REGION || 'us-north-1',
    });

    const role = "arn:aws:iam::762233763132:role/RemotionLambdaFunctionRole";
    console.log('Role:', role);
    const deployed = await deployFunction({
      region: process.env.AWS_REGION || 'us-north-1',
      architecture: 'arm64',
      timeoutInSeconds: 240,
      memorySizeInMb: 2048,
      createCloudWatchLog: true,
      bucket: bucket,
      remotionRoot: path.join(process.cwd(),'remotion'),
      customRoleArn: role,
    });

    console.log('Successfully deployed Lambda function:', deployed.functionName);
    return deployed;
  } catch (err) {
    console.error('Error deploying Lambda:', err);
    throw err;
  }
};

deployToLambda();