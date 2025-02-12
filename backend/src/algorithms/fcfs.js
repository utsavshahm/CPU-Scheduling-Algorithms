import { Intervals } from "../utils/classes.js";
import { minArrival } from "./mlfq_utils/executeProcess.js";
import { convertData, initialise } from "../utils/extractData.js";

export default function firstComeFirstServeAlgorithm(pr) {
    const resp = initialise(pr);
    const processes = resp.proc;
    const ganttChart = resp.gc;
    const finished = [];

    processes.sort(minArrival);
    let currentTime = 0;

    for (const p of processes) {
        if (currentTime < p.arrivalTime) {
            currentTime = p.arrivalTime;
        }

        p.startTime = currentTime;
        currentTime += p.burstTime;
        p.completionTime = currentTime;
        p.turnaroundTime = p.completionTime - p.arrivalTime;
        // console.log(p.turnaroundTime)
        p.waitingTime = p.startTime - p.arrivalTime;

        ganttChart.push(new Intervals(p.pid, p.startTime, p.completionTime));
        finished.push(p);
    }

    return convertData(finished, ganttChart);
}