/**
 * Consume messages into the TPE and deligate out to sub systems within the
 * TPE
 */
import * as mysql from 'mysql2/promise';
import { SNSHandler } from 'aws-lambda';

import SubsystemStrat, { SUBSYSTEM } from './strategies/SubsystemStrat';

// ENV
const DB_HOST = process.env.DB_HOST;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;

const handler: SNSHandler = async (event, context, cb) => {
    try {
        // Check if we have a message
        if (!event) return cb(new Error('No even found.'));
        if (event.Records[0].Sns.Message === '') return cb(new Error('No raw data to process.'));

        // Get the data
        const { rawInput, type } = JSON.parse(event.Records[0].Sns.Message);

        // Check if the message is for "Text" processing and if it has data to process.
        if (!rawInput || rawInput === '') return cb(new Error('No raw data to process.'));
        if (type === 'text') return cb(new Error('Type not valid.'));

        // Save Raw into the DB.
        const dbConn = await mysql.createConnection({
            host: DB_HOST,
            user: DB_PASSWORD,
            password: DB_PASSWORD,
            database: DB_DATABASE,
        });
        const results = await dbConn.execute(
            "INSERT INTO data (id, type, rawData, createdDate) VALUES (UUID(), 'TEXT', ?, NOW())",
            [rawInput],
        );
        console.log('successfully inserted raw data into db....');

        // Send out messages into the subsystem
        // 1. Summary Extractor
        await SubsystemStrat.strategy(SUBSYSTEM.SUMMARY_EXTRACT, '1', rawInput);
        console.log('successfully triggered SUMMARY EXTRACT strategy....');
        // 2. AWS Comprehend
        await SubsystemStrat.strategy(SUBSYSTEM.AWS_COMPREHEND, '1', rawInput);
        console.log('successfully triggered AWS COMPREHEND strategy....');

        // Done
        return cb(null);
    } catch (error) {
        return cb(error.message);
    }
};

export default handler;
