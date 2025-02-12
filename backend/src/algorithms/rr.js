import { Intervals } from "../utils/classes.js";
import { minArrival } from "./mlfq_utils/executeProcess.js";
import { convertData, initialise } from "../utils/extractData.js";

export default function roundRobinAlgorithm(pr, timeQuantum) {
    console.log((timeQuantum));
    
    const resp = initialise(pr);
    const processes = resp.proc;
    const ganttChart = resp.gc;
    const finished = [];
    const processQueue = [...processes];

    console.log(processQueue)
    processQueue.sort(minArrival);
    let currentTime = 0;

    while (processQueue.length > 0) {
        const currentProcess = processQueue.shift();
        // console.log("====================")
        if (currentTime < currentProcess.arrivalTime) {
            currentTime = currentProcess.arrivalTime;
        }

        const executionTime = Math.min(timeQuantum, currentProcess.burstTime);
        const startTime = currentTime;
        currentTime += executionTime;

        currentProcess.remainingTime -= executionTime;

        ganttChart.push(new Intervals(currentProcess.pid, startTime, currentTime));

        if (currentProcess.remainingTime <= 0) {
            currentProcess.completionTime = currentTime;
            currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
            finished.push(currentProcess);
        } else {
            processQueue.push(currentProcess);
        }
    }

    return convertData(finished, ganttChart);
}