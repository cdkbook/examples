import * as https from 'https';
import * as url from 'url';

export const SUCCESS = 'SUCCESS';
export const FAILED = 'FAILED';

export interface CfnCustomResourceInfo {
  StackId: string;
  RequestId: string;
  LogicalResourceId: string;
  ResponseURL: string;
  PhysicalResourceId: string;
}

export const send = function (event: CfnCustomResourceInfo, responseStatus: string, responseData = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const { PhysicalResourceId, StackId, RequestId, LogicalResourceId, ResponseURL } = event;
    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: 'See the details in CloudWatch Log Stream: ' + PhysicalResourceId,
      PhysicalResourceId: PhysicalResourceId,
      StackId: StackId,
      RequestId: RequestId,
      LogicalResourceId: LogicalResourceId,
      NoEcho: false,
      Data: responseData,
    });

    console.log('Response body:\n', responseBody);


    const parsedUrl = url.parse(ResponseURL);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        'content-type': '',
        'content-length': responseBody.length,
      },
    };

    const request = https.request(options, function (response) {
      console.log('Status code: ' + response.statusCode);
      console.log('Status message: ' + response.statusMessage);
      resolve();
    });

    request.on('error', function (error) {
      console.log('send(..) failed executing https.request(..): ' + error);
      reject(error);
    });

    request.write(responseBody);
    request.end();
  });

};