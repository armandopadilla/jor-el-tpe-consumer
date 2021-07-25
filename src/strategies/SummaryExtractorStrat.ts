import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export default class SummaryExtractorStrat {
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
                TopicArn: process.env.SUMMARY_EXTRACT_TOPIC_ARN,
            };

            const command = new PublishCommand(input);
            await client.send(command);
        } catch (error) {
            throw error;
        }
    }
}
