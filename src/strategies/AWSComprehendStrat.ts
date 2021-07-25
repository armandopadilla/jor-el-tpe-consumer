import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export default class AWSComprehendStrat {
    private constructor() {}

    /**
     * Send a message into the topic.
     *
     * @param id
     * @param message
     */
    static async sendMessage(id: string, message: string) {
        try {
            const client = new SNSClient({ region: 'us-west-2' });

            const newMessage = {
                type: 'text',
                input: message,
                rawDataId: id,
                date: new Date(),
            };

            const input = {
                Message: JSON.stringify(newMessage),
                TopicArn: process.env.AWS_COMPREHEND_TOPIC_ARN,
            };

            const command = new PublishCommand(input);
            await client.send(command);
        } catch (error) {
            throw error;
        }
    }
}
