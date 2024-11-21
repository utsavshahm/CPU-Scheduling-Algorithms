import algorithms from '../algorithms/index.js';

export const simulateScheduling = async (req, res) => {

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Frontend origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');    // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');       // Allowed headers

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(204).end(); // End preflight response
        return;
    }

    try {
        // console.log("alkdflksdjflksdf")
        // console.log(req.body)
        const { algorithm, processes, queues, timeQuantum } = req.body;

        // Validation
        if (!algorithm || !processes || !Array.isArray(processes)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input data'
            });
        }

        if (algorithm == 'mlfq' && !queues) {
            return res.status(400).json({
                status: 'error', 
                message : 'MLFQ Queues not available'
            })
        }

        // Get scheduling function
        const schedulingFunction = algorithms[algorithm];
        if (!schedulingFunction) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid algorithm selected'
            });
        }
        // console.log("alkdflksdjflksdf", schedulingFunction)

        // Run scheduling algorithm
        let data; 
        if (algorithm == 'rr') {
            data = schedulingFunction(processes, parseInt(timeQuantum));
        }
        else if (algorithm == 'fcfc' || algorithm=='sjf') {
            data = schedulingFunction(processes); 
        }
        else {
            data = schedulingFunction(processes, queues);
        }
        
        // console.log("kdhfsf",data)

        res.status(200).json({
            status: 'success',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};