import firstComeFirstServeAlgorithm  from './fcfs.js';
import multilevelFeedbackQueueAlgorithm from './mlfq.js'
import roundRobinAlgorithm from './rr.js';
import shortestJobFirstAlgorithm from './sjf.js';

export default {
    mlfq: multilevelFeedbackQueueAlgorithm,
    fcfs: firstComeFirstServeAlgorithm, 
    sjf: shortestJobFirstAlgorithm, 
    rr : roundRobinAlgorithm
};