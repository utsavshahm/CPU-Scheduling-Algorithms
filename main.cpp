#include <bits/stdc++.h>
using namespace std;
using ll = long long;

class Process{
    public:
        int pid;
        int arrivalTime;
        int burstTime;
        int completionTime;
        int turnaroundTime;
        int waitingTime;
        int remainingTime;
        // Default constructor
        Process() : pid(0), arrivalTime(0), burstTime(0), completionTime(0),
                    turnaroundTime(0), waitingTime(0), remainingTime(0) {}

        // Constructor
        Process(int pid, int at, int bt){
            this->pid = pid;
            this->arrivalTime = at;
            this->burstTime = bt;
            this->remainingTime = bt;
            this->completionTime = 0;
            this->turnaroundTime = 0;
            this->waitingTime = 0;
        }

        void updateVariables(int completionTime){
            this->completionTime = completionTime;
            this->turnaroundTime = completionTime - this->arrivalTime;
            this->waitingTime = this->turnaroundTime - this->burstTime;
            this->remainingTime = 0;

        }
};

class AlgoQueue{

    public:
        int qid;
        string algo;
        int timeQuantam;
        vector<Process> proc;

        AlgoQueue(int qid, string algo, int timeQuantam = 0){
            this->qid = qid;
            this->algo = algo;
            this->proc.resize(0);
            this->timeQuantam = timeQuantam;
        }

        void removeProcess(int range){
            this->proc.erase(this->proc.begin() + range); 
        }
        void insertProcess(int position, Process p){
            if(position==proc.size()){
                this->proc.push_back(p); 
            }
            else{
                this->proc.insert(this->proc.begin() + position, p); 
            }
        }
};

class Intervals{
    public:
        int pid;
        int start;
        int end;
        bool isIdle;

        Intervals(){
            this->pid = 0;
            this->start = 0;
            this->end = 0;
            this->isIdle = false; 
        }
        Intervals(int pid, int start, int end, bool isIdle = false){
            this->pid = pid;
            this->start = start;
            this->end = end;
            this->isIdle = isIdle;
        }
};

bool minArrival(Process p1, Process p2){
    return p1.arrivalTime < p2.arrivalTime;
}
bool minBurst(Process p1, Process p2){
    return p1.remainingTime < p2.remainingTime;
}

Process executeProcessQueue(AlgoQueue& q, int &time, vector<Process>& finished, int sliceTime, vector<Intervals>& ganttChart){

    string algo = q.algo;
    vector<Process> proc = q.proc;
    int timeQuantam = q.timeQuantam; 
    if (algo == "RR")
    {

        Process currentProcess = proc.front();
        
        int execTime = sliceTime;
        int start = time;
        int end = time + execTime;

        ganttChart.push_back(Intervals(currentProcess.pid, start, end));
        time += execTime;
        currentProcess.remainingTime -= execTime;

        if (currentProcess.remainingTime == 0){
            q.proc.front().updateVariables(time);
            currentProcess = q.proc.front(); 
            q.removeProcess(0);
            finished.push_back(currentProcess);
        }
        else{
            q.removeProcess(0);

            if(execTime < timeQuantam){
                // preempted
                q.insertProcess(0, currentProcess);
            }

        }

        return currentProcess;
    }
    else if(algo=="FCFS"){
        Process currentProcess = proc.front();
        int execTime = sliceTime;

        int start = time;
        int end = time + execTime;

        ganttChart.push_back(Intervals(currentProcess.pid, start, end));

        time += execTime;
        currentProcess.remainingTime -= execTime;

        if(currentProcess.remainingTime == 0){
            q.proc.front().updateVariables(time);
            currentProcess = q.proc.front();
            q.removeProcess(0);
            finished.push_back(currentProcess);
        }
        else{
            q.removeProcess(0);
            q.insertProcess(0, currentProcess);  // there is no demotion in case of Non preemptive algorithms
        }

        return currentProcess;
    }
    else if(algo=="SJF"){

        sort(q.proc.begin(), q.proc.end(), minBurst);
        Process currentProcess = q.proc.front();

        int execTime = sliceTime;

        int start = time;
        int end = time + execTime;

        ganttChart.push_back(Intervals(currentProcess.pid, start, end));
        time += execTime;
        currentProcess.remainingTime -= execTime;

        if(currentProcess.remainingTime==0){
            q.proc.front().updateVariables(time);
            currentProcess = q.proc.front();
            q.removeProcess(0);
            finished.push_back(currentProcess);
        }
        else{
            q.removeProcess(0);
            q.insertProcess(proc.size() , currentProcess); // There is no demotion in case of non preemptive algorithms
        }

        return currentProcess;
    }
    Process p;
    return p;
}

int expectedExecuteTime(Process p, AlgoQueue q){

    string algo = q.algo;
    int remTime = p.remainingTime;
    int exp = 0; 
    if (algo == "RR"){
        int tq = q.timeQuantam;
        exp = min(tq, remTime);
    }
    else{
        exp = remTime;
    }
    return exp;
}
vector<Process> multilevelFeedbackQueueAlgorithm(vector<Process> processes, vector<AlgoQueue> queues, vector<Intervals>& ganttChart){
    int n = processes.size(), q = queues.size();

    sort(begin(processes), end(processes), minArrival);

    int time = 0;
    vector<Process> finished; 

    int appendedProcesses  = 0;
    for (auto p : processes){

        if(time >= p.arrivalTime){
            queues[0].insertProcess(queues[0].proc.size(), p);
            appendedProcesses++;
        }
        else break;
    }

    processes.erase(processes.begin(), processes.begin() + appendedProcesses); // remove the processes from the processQueue

    while(finished.size() < n){
        bool executed = false;
        for (int i = 0; i < q; i++){
            if(!queues[i].proc.empty()){
                // i have to execute these processes
                Process currProcess = queues[i].proc.front();

                int expectedExecTime = expectedExecuteTime(currProcess, queues[i]);
                int queueIndex = i;

                appendedProcesses = 0;
                for (auto p : processes){

                    if (time + expectedExecTime >= p.arrivalTime){
                        queues[0].insertProcess(queues[0].proc.size(), p);
                        appendedProcesses++; 
                    }
                    else break;
                }

                if(appendedProcesses > 0){
                    processes.erase(processes.begin(), processes.begin() + appendedProcesses); // remove the processes from the processQueue

                    if(queueIndex > 0){
                        // we have to execute the currProcess until new Process arrives and then stop its execution and start for queue[0] processes

                        // execute currProcess upto arrival - time
                        // then preempt it and start execute queue[0] process

                        int sliceTime = queues[0].proc.front().arrivalTime - time;
                        Process updated = executeProcessQueue(queues[i], time, finished, sliceTime, ganttChart);

                    }

                    else{
                        // new processes have arrived in top most queue only
                        int sliceTime = expectedExecTime;
                        Process updated = executeProcessQueue(queues[i], time, finished, sliceTime, ganttChart);
                        ;

                        // now we have to demote the process here
                        if(updated.remainingTime > 0){
                            if(i < q - 1){
                                queues[i + 1].insertProcess(queues[i + 1].proc.size(), updated);
                            }
                        }
                    }
                }
                else{
                    // just execute the current process, no error in that.
                    int sliceTime = expectedExecTime;
                    Process updated = executeProcessQueue(queues[i], time, finished, sliceTime, ganttChart);

                    // now we have to demote the process here
                    if(updated.remainingTime > 0){
                        
                        if(i < q - 1){
                            queues[i + 1].insertProcess(queues[i + 1].proc.size(), updated);
                        }
                    }

                }

                executed = true;
                break;
            }

        }
        // add new processes to the queue if no queue holds any process

        if(!executed and finished.size() < n){

            Process nextProcess = processes.front();
            processes.erase(processes.begin());

            time = nextProcess.arrivalTime;
            queues[0].insertProcess(queues[0].proc.size(), nextProcess);
        }
    }

    return finished;
}

void analyse(vector<Process>& processes){

    cout << "PID | "<<"Arrival | " << "Burst | " << "Completion | " << "Turnaround | " << endl;
    for (auto p : processes){

        cout << p.pid << " | " << p.arrivalTime << " | " << p.burstTime << " | " << p.completionTime << " | " << p.turnaroundTime << endl;
    }
}

void printChart(vector<Intervals> ganttChart){
    // Print the Gantt chart header
    cout << "Gantt Chart:" << endl;

    // Print the process IDs in the Gantt chart
    for (const auto &interval : ganttChart)
    {
        cout << "| P" << interval.pid << " ";
    }
    cout << "|" << endl;

    // Print the timeline
    for (size_t i = 0; i < ganttChart.size(); ++i)
    {
        cout << ganttChart[i].start << setw(5); // Adjust spacing for alignment
    }
    cout << ganttChart.back().end << endl; // Print the end time of the last process
}
int main(){

    freopen("input.txt", "r", stdin); 

    int numberOfProcess;
    vector<Process> processes;

    // cout << "Welcome to Scheduling Algorithm Implementation!" << endl;

    // cout << "Enter number of processes (1 - 5) : ";
    cin >> numberOfProcess;

    while (numberOfProcess > 5 or numberOfProcess <= 0){
        // cout << "Invalid number of processes!" << endl;
        // cout << "Enter number of processes (1 - 5) : ";
        cin >> numberOfProcess;
    }

    // cout << "Okay, now you need to add some information about each process : " << endl;

    for (int i = 0; i < numberOfProcess; i++){
        int arrivalTime, burstTime;
        // cout << "Enter arrival time (>=0) for process " << i + 1 << " : ";
        cin >> arrivalTime;

        while (arrivalTime < 0){
            // cout << "Please enter a positive arrival time!" << endl;
            // cout << "Enter arrival time for process " << i + 1 << " : ";
            cin >> arrivalTime;
        }

        // cout << "Enter burst time (>0) for process " << i + 1 << " : ";
        cin >> burstTime;

        while (burstTime <= 0){
            // cout << "Please enter a positive burst time!" << endl;
            // cout << "Enter burst time for process " << i + 1 << " : ";
            cin >> burstTime;
        }

        processes.push_back(Process(i + 1, arrivalTime, burstTime));
    }

    cout << "\n\n";

    int numberOfQueues;
    vector<AlgoQueue> queues;
    // cout << "Enter number of Queues (>0) for MLFQ : ";
    cin >> numberOfQueues;

    while(numberOfQueues <= 0){
        // cout << "Please enter a valid number of Queues!" << endl;
        // cout << "Enter number of Queues for MLFQ : ";
        cin >> numberOfQueues;
    }

    // cout << "Okay, now you have to give scheduling algo for each queue : " << endl;

    for (int i = 0; i < numberOfQueues; i++){
        // cout << "Enter scheduling algorithm for queue " << i + 1 << " (RR / SJF / FCFS) : ";
        string algo;
        cin >> algo; 

        while(algo!="RR" and algo!="SJF" and algo!="FCFS"){
            // cout << "Please enter a valid algorithm!" << endl;
            // cout << "Enter scheduling algorithm for queue " << i + 1 << " (RR / SJF / FCFS) : ";
            cin >> algo; 
        }

        int tq = 0;
        if(algo=="RR"){
            // cout << "Enter the time quantam (>0) for Round robin algorithm : ";
            cin >> tq; 

            while(tq <= 0){
                // cout << "Please enter a valid time quantam!" << endl;
                cin >> tq;
            }
        }
        queues.push_back(AlgoQueue(i + 1, algo, tq));
    }

    vector<Intervals> ganttChart; 
    vector<Process> finished = multilevelFeedbackQueueAlgorithm(processes, queues, ganttChart);

    freopen("output.txt", "w", stdout); 

    cout << "\nAnalysis\n";
    analyse(finished);
    cout << "\n";
    printChart(ganttChart);

    return 0;
}
