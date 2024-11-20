export default function analyse(processes) {
    console.log('PID | Arrival | Burst | Completion | Turnaround');
    for (const p of processes) {
        console.log(`${p.pid} | ${p.arrivalTime} | ${p.burstTime} | ${p.completionTime} | ${p.turnaroundTime}`);
    }
}
