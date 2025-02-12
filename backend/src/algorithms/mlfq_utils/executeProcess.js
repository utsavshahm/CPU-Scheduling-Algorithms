import { Process, Intervals } from "../../utils/classes.js";

function minArrival(p1, p2) {
    return p1.arrivalTime < p2.arrivalTime;
}

function minBurst(p1, p2) {
    return p1.remainingTime < p2.remainingTime;
}

function executeProcessQueue(q, time, finished, sliceTime, ganttChart) {
    const { algo, proc, timeQuantam } = q;

    if (algo === 'rr') {
        const currentProcess = proc.shift();
        const execTime = Math.min(sliceTime, currentProcess.remainingTime);
        const start = time;
        const end = time + execTime;

        ganttChart.push(new Intervals(currentProcess.pid, start, end));
        time += execTime;
        currentProcess.remainingTime -= execTime;

        if (currentProcess.remainingTime === 0) {
            currentProcess.updateVariables(time);
            finished.push(currentProcess);
        } else {

            if (execTime < timeQuantam) {
                q.insertProcess(proc.length, currentProcess);
            }
        }

        return [currentProcess, time];
    } else if (algo === 'fcfs') {
        const currentProcess = proc.shift();
        const execTime = sliceTime;
        const start = time;
        const end = time + execTime;

        ganttChart.push(new Intervals(currentProcess.pid, start, end));
        time += execTime;
        currentProcess.remainingTime -= execTime;

        if (currentProcess.remainingTime === 0) {
            currentProcess.updateVariables(time);
            finished.push(currentProcess);
        } else {
            q.insertProcess(0, currentProcess);
        }

        return [currentProcess, time];
    } else if (algo === 'sjf') {
        proc.sort(minBurst);
        const currentProcess = proc.shift();
        const execTime = sliceTime;
        const start = time;
        const end = time + execTime;

        ganttChart.push(new Intervals(currentProcess.pid, start, end));
        time += execTime;
        currentProcess.remainingTime -= execTime;

        if (currentProcess.remainingTime === 0) {
            currentProcess.updateVariables(time);
            finished.push(currentProcess);
        } else {
            q.insertProcess(proc.length, currentProcess);
        }

        return [currentProcess, time];
    }
    return new Process();
}

function expectedExecuteTime(p, q) {
    const { algo, timeQuantam } = q;
    const remTime = p.remainingTime;
    if (algo === 'rr') {
        return Math.min(timeQuantam, remTime);
    } else {
        return remTime;
    }
}

export { expectedExecuteTime, executeProcessQueue, minArrival, minBurst }; 