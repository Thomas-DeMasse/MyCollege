const fs = require('fs');

const html = fs.readFileSync('index.html', { encoding: 'utf8' });

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
    console.log(event);
    
    if(event.queryStringParameters){
        const tablePut = await dynamo.put({
            TableName: "GameRecService_DB",
            Item: {
              PK: event.queryStringParameters.title,
              SK: event.queryStringParameters.genre,
            }
        }).promise();
    }
    
    let modifiedHTML = dynamicForm(html,event.queryStringParameters)
    
    const params = {
        TableName: "GameRecService_DB"
    };

    const tableScan = await dynamo.scan(params).promise();
    
    modifiedHTML = dynamictable(modifiedHTML, tableScan);
    
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
        },
        body: modifiedHTML,
    };
    
    return response;
};

function dynamicForm(html,queryStringParameters){
    let formres = ''
    if(queryStringParameters){
            Object.values(queryStringParameters).forEach(val => {
                  formres = val + ' ' + formres;
            });
    }
    return html.replace('{formResults}', formres)
}

function dynamictable(html,tableScan){
     let table=""
    if(tableScan.Items.length > 0){
        for (let i = 0; i < tableScan.Items.length; i++) {
            const itemString = JSON.stringify(tableScan.Items[i])
                                .replace(/"PK":|"SK":/g, "")
                                .replace(/[{}"]/g, "") // Replace brackets and quotation marks
                                .replace(/,/g, ": "); // Replace commas with colon and space
            table = table + "<li>" + itemString + "</li>";
        } 
        table = "<pre>" + table + "</pre>";
    }
    return html.replace("{table}", table);
}

module.exports.handler = handler;