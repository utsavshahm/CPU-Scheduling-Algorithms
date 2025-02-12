import { Process, AlgoQueue } from "./classes.js";

function convertData(processes, ganttChart) {
    let pr = processes.map((process) => {
        return {
            "pid": process.pid,
            "arrivalTime": process.arrivalTime,
            "burstTime": process.burstTime,
            "completionTime": process.completionTime,
            "turnaroundTime": process.turnaroundTime,
            "waitingTime": process.waitingTime
        }
    })

    let gc = ganttChart.map((interval) => {
        return {
            "processId": interval.pid,
            "startTime": interval.start,
            "endTime": interval.end,
            "isCPUIdle": interval.isIdle
        }
    })

    return { proc: pr, gant: gc };
}

function initialise(processes, queues) {
    const pr = processes.map(process => {
        let pid = process.id;
        let arrivalTime = process.arrivalTime;
        let burstTime = process.burstTime;

        return new Process(pid, arrivalTime, burstTime);
    })


    let q;
    if (queues) {
        q = queues.map((queue, index) => {
            let qid = index;
            let algo = queue.algorithm;
            let tc = 0;
            if (queue.timeQuantum) {
                tc = queue.timeQuantum
            }

            return new AlgoQueue(qid, algo, tc);

        })

    }
    // console.log("helllll", pr, q)

    const ganttChart = [];
    return {
        proc: pr,
        q: q,
        gc: ganttChart
    }
}

export { initialise, convertData };