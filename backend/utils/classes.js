class Process {
    constructor(pid, arrivalTime, burstTime) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.completionTime = 0;
        this.turnaroundTime = 0;
        this.waitingTime = 0;
    }

    updateVariables(completionTime) {
        this.completionTime = completionTime;
        this.turnaroundTime = completionTime - this.arrivalTime;
        this.waitingTime = this.turnaroundTime - this.burstTime;
        this.remainingTime = 0;
    }
}

class AlgoQueue {
    constructor(qid, algo, timeQuantam = 0) {
        this.qid = qid;
        this.algo = algo;
        this.proc = [];
        this.timeQuantam = timeQuantam;
    }

    removeProcess(range) {
        this.proc.splice(range, 1);
    }

    insertProcess(position, p) {
        if (position === this.proc.length) {
            this.proc.push(p);
        } else {
            this.proc.splice(position, 0, p);
        }
    }
}

class Intervals {
    constructor(pid, start, end, isIdle = false) {
        this.pid = pid;
        this.start = start;
        this.end = end;
        this.isIdle = isIdle;
    }
}

export { Process, AlgoQueue, Intervals };