import { Intervals } from "../utils/classes.js";
import { minArrival } from "./mlfq_utils/executeProcess.js";
import { convertData, initialise } from "../utils/extractData.js";


export default function shortestJobFirstAlgorithm(pr) {
    const resp = initialise(pr);
    const processes = resp.proc;
    const ganttChart = resp.gc;
    const finished = [];

    processes.sort(minArrival);
    let currentTime = 0;
    const remainingProcesses = [...processes];

    while (remainingProcesses.length > 0) {
        const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);

        if (availableProcesses.length === 0) {
            currentTime = remainingProcesses[0].arrivalTime;
            continue;
        }

        const selectedProcess = availableProcesses.reduce((shortest, current) =>
            current.burstTime < shortest.burstTime ? current : shortest
        );

        selectedProcess.startTime = currentTime;
        currentTime += selectedProcess.burstTime;
        selectedProcess.completionTime = currentTime;
        selectedProcess.turnaroundTime = selectedProcess.completionTime - selectedProcess.arrivalTime;
        selectedProcess.waitingTime = selectedProcess.startTime - selectedProcess.arrivalTime;

        ganttChart.push(new Intervals(selectedProcess.pid, selectedProcess.startTime, selectedProcess.completionTime));
        finished.push(selectedProcess);

        const index = remainingProcesses.findIndex(p => p.pid === selectedProcess.pid);
        remainingProcesses.splice(index, 1);
    }

    return convertData(finished, ganttChart);
}