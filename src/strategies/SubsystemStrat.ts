import SummaryExtractorStrat from './SummaryExtractorStrat';
import AWSComprehendStrat from './AWSComprehendStrat';

export enum SUBSYSTEM {
    SUMMARY_EXTRACT,
    AWS_COMPREHEND,
}

export default class SubsystemStrategy {
    private constructor() {}

    /**
     * Strategy to take with text.
     *
     * @param type
     * @param id
     * @param message
     */
    static strategy(type: SUBSYSTEM, id: string, message: string) {
        if (type === SUBSYSTEM.SUMMARY_EXTRACT) SummaryExtractorStrat.sendMessage(id, message);
        if (type === SUBSYSTEM.AWS_COMPREHEND) AWSComprehendStrat.sendMessage(id, message);
    }
}
