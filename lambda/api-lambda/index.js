const AWS = require('aws-sdk')

AWS.config.update({ region: process.env.REGION })

function isStringEmpty(s) {
  return !s || s.trim().length === 0
}

const callback200 = (result = {}) => ({
  statusCode: 200,
  body:       JSON.stringify({ ...result, success: true }),
  headers: {
    "Access-Control-Allow-Origin" : "*",      // Required for CORS support to work
    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
  },
})

const callbackError = (message) => ({
  statusCode: 400,
  body:       JSON.stringify({ success: false, error: message }),
  headers: {
    "Access-Control-Allow-Origin" : "*",      // Required for CORS support to work
    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
  },
})


async function processEmail(event) {  
  const { name, phone, email, message } = JSON.parse(event.body)  

  if (isStringEmpty(name) || isStringEmpty(phone) || isStringEmpty(email) || isStringEmpty(message)) {
    return callbackError('Invalid requiest parameter')  
  } else {
    const params = {
      Destination: {
        ToAddresses: [
          'info@apexquest.cloud',
          'igor.v.sergeev@gmail.com',
          'natalia_p_sergeeva@yahoo.com',
        ]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data:    message,
          },
          Text: {
            Charset: 'UTF-8',
            Data:    message,
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data:    `ApexQuest from ${name}`,
        }
      },
      Source: 'info@apexquest.cloud',
    }
    await new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise()
    return callback200()
  }  
}

exports.handler = async (event, context, callback) => {
  const { httpMethod, path, resource } = event

  if(httpMethod === 'POST' && path === "/info"){
    return await processEmail(event)
  }
}
