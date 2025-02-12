import analyse from "../utils/analyseData.js";
import printChart from "../utils/printChart.js";
import { Process, AlgoQueue, Intervals } from "../utils/classes.js";
import { executeProcessQueue, expectedExecuteTime, minArrival } from "./mlfq_utils/executeProcess.js";
import { convertData, initialise } from "../utils/extractData.js";

export default function multilevelFeedbackQueueAlgorithm(pr, Queues) {

    const resp = initialise(pr, Queues); 
    const processes = resp.proc; 
    const queues = resp.q; 
    const ganttChart = resp.gc; 

    // console.log(processes, queues, ganttChart)
    const n = processes.length;
    const q = queues.length;

    processes.sort(minArrival);

    let time = 0;
    const finished = [];

    let appendedProcesses = 0;
    for (const p of processes) {
        if (time >= p.arrivalTime) {
            queues[0].insertProcess(queues[0].proc.length, p);
            appendedProcesses++;
        } else {
            break;
        }
    }
    processes.splice(0, appendedProcesses);


    while (finished.length < n) {
        let executed = false;
        for (let i = 0; i < q; i++) {
            if (queues[i].proc.length > 0) {
                const currProcess = queues[i].proc[0];
                const expectedExecTime = expectedExecuteTime(currProcess, queues[i]);
                const queueIndex = i;

                appendedProcesses = 0;
                for (const p of processes) {
                    if (time + expectedExecTime >= p.arrivalTime) {
                        queues[0].insertProcess(queues[0].proc.length, p);
                        appendedProcesses++;
                    } else {
                        break;
                    }
                }

                if (appendedProcesses > 0) {
                    processes.splice(0, appendedProcesses);
                    if (queueIndex > 0) {
                        const sliceTime = queues[0].proc[0].arrivalTime - time;
                        // console.log("sldkfjs ", sliceTime)
                        const [updated, t] = executeProcessQueue(queues[i], time, finished, sliceTime, ganttChart);
                        time = t;
                    } else {
                        const sliceTime = expectedExecTime;
                        const [updated, t] = executeProcessQueue(queues[i], time, finished, sliceTime, ganttChart);
                        time = t;
                        if (updated.remainingTime > 0 && i < q - 1) {
                            queues[i + 1].insertProcess(queues[i + 1].proc.length, updated);
                        }
                    }
                } else {
                    const sliceTime = expectedExecTime;
                    const [updated, t] = executeProcessQueue(queues[i], time, finished, sliceTime, ganttChart);
                    time = t;
                    if (updated.remainingTime > 0 && i < q - 1) {
                        queues[i + 1].insertProcess(queues[i + 1].proc.length, updated);
                    }
                }
                
                // printChart(ganttChart)
                executed = true;
                break;
            }
        }

        if (!executed && finished.length < n) {
            const nextProcess = processes.shift();
            time = nextProcess.arrivalTime;
            queues[0].insertProcess(queues[0].proc.length, nextProcess);
        }
    }

    const data = convertData(finished, ganttChart); 
    // console.log(data)

    return data;
}




// Example usage
// const processes = [
//     new Process(1, 0, 36),
//     new Process(2, 16, 20),
//     new Process(3, 20, 12),
// ];

// const queues = [
//     new AlgoQueue(1, 'rr', 8),
//     new AlgoQueue(2, 'rr', 16),
//     new AlgoQueue(3, 'fcfs'),
// ];

// const ganttChart = [];
// const finished = multilevelFeedbackQueueAlgorithm(processes, queues);

// console.log('\nAnalysis');
// analyse(finished);

// console.log('\nGantt Chart:');
// printChart(ganttChart);