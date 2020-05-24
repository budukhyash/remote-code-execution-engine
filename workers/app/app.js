const fs  = require('fs');
const amqp = require('amqp-connection-manager');
const redis = require('redis');
const bail = require('bail');
const rimraf=require("rimraf");

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});

client.on('error', (err) => {
    console.log("Error " + err)
}); 

const extensions = {
    "cpp":"cpp",
    "c": "c",
    "java":"java",
    "python3":"py"
};

function runCode(apiBody,ch,msg)
{   

    client.set(apiBody.folder.toString(),'{"status":"Processing"}');
    const { exec } = require('child_process');   
    var output;
    var command = 'python3 run.py ../temp/' + apiBody.folder +'/source.' + extensions[apiBody.lang] + ' ' + apiBody.lang + ' '  + apiBody.timeOut;  

    fs.writeFile('/temp/' + apiBody.folder+  '/output.txt','',function(err){
        if(err)
        console.log(err);
        else
        console.log("Output.txt created");
    });

    exec(command, (err, stdout, stderr) => 
    {
        if (err) {
            ch.ack(msg);   
            console.log(err);
        }else
        {   
            fs.readFile('/temp/' + apiBody.folder+  '/output.txt', 'utf8', function(err, contents) {
                
                if(err)
                console.log(err);
                output=contents;

                let result =
                {
                    'output':output,
                    'stderr':`${stderr}`,
                    'status':`${stdout}`,
                    'submission_id':apiBody.folder
                }
                
                console.log(result);
                console.log(apiBody);
                rimraf("../temp/"+apiBody.folder,function(err){
                    if(err)
                    console.log(err);
                     else
                    console.log("DELETED TEMP FOLDER");
                });

                client.setex(apiBody.folder.toString(), 3600, JSON.stringify(result));
                ch.ack(msg);

            });
        }
    });
}


function createFiles(apiBody,ch,msg)
{

    fs.mkdir('/temp/'+ apiBody.folder,function(err)
    {   
        if(err)
        {
            console.log(err);
        }
        else
        {
            fs.writeFile('/temp/'+ apiBody.folder +'/input.txt', apiBody.input, function (err) {
                if (err) 
                    return console.log(err);
                else
                {
                    fs.writeFile("/temp/" + apiBody.folder + "/source." + extensions[apiBody.lang], apiBody.src, function (err) {
                        if (err) 
                            console.log(err);
                        else    
                        {
                            runCode(apiBody,ch,msg);
                        }       
                });
                }
            });

        }
    });

}

const QUEUE_NAME = 'judge'
var onMessage = function(data) {

    let message = JSON.parse(data.content.toString());
    console.log(message);
    createFiles(message,channelWrapper,data);    
}

// Create a connetion manager
var connection = amqp.connect(['amqp://rabbitmq:5672']);

connection.on('connect', function() {
    console.log('Connected!');
});
connection.on('disconnect', function(err) {
    console.log('Disconnected.', err.stack);
});

// Set up a channel listening for messages in the queue.
var channelWrapper = connection.createChannel({
    setup: function(channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        return Promise.all([
            channel.assertQueue(QUEUE_NAME, {durable: true}),
            channel.prefetch(1),
            channel.consume(QUEUE_NAME, onMessage)
        ]);
    }
});

channelWrapper.waitForConnect()
.then(function() {
    console.log("Listening for messages");
});