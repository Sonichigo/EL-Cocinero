const {sdk, SpeakerEvent} = require("symbl-node");
const dotenv = require('dotenv');
sdk.init({
    appId: "617665513969566478576679497876636848475a7a5465503630575358414a37",
    appSecret: "7847634243506370373130777756745874437a636f37427164616b786734375a4b51344d556769494a4d684969424d723146496b75566c4b42753430707a754a"
}).then(async () => {
    console.log('SDK initialized.');
    try {
        const connection = await sdk.startEndpoint({
            endpoint: {
                type: 'pstn', 
                phoneNumber: "+12512801434"
            }
        });
        const {connectionId} = connection;
        console.log('Successfully connected. Connection Id: ', connectionId);

        sdk.subscribeToConnection(connectionId, (data) => {
            const {type} = data;
            if (type === 'transcript_response') {
                const {payload} = data;
                process.stdout.write('Live: ' + payload && payload.content + '\r');

            } else if (type === 'message_response') {
                const {messages} = data;
                messages.forEach(message => {
                    process.stdout.write('Message: ' + message.payload.content + '\n');
                });
            } else if (type === 'insight_response') {
                const {insights} = data;
                insights.forEach(insight => {
                    process.stdout.write(`Insight: ${insight.type} - ${insight.text} \n\n`);
                });
            }
        });
        setTimeout(async () => {
            await sdk.stopEndpoint({connectionId});
            console.log('Stopped the connection');
            console.log('Conversation ID:', connection.conversationId);
        }, 60000);
    } catch (e) {
        console.error(e);
    }
}).catch(err => console.error('Error in SDK initialization.', err));