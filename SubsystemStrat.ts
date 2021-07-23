enum SUBSYSTEM {
    SUMMARY_EXTRACT,
    AWS_COMPREHEND
}

class SubsystemStrategy {
    private constructor() {}

    /**
     * Strategy to take with text.
     *
     * @param type
     * @param id
     * @param message
     */
    static strategy(type: SUBSYSTEM, id: string, message: string) {
        // if (type === 'SummaryExtract') SummaryExtractStrat.message();
        // if (type === 'AWSComprehend') AWSComprehendStrat.message();
    }
}
