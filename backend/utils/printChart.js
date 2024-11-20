// Took help of AI to create this : Used to print the Gantt Chart in terminal

export default function printChart(ganttChart) {
    if (ganttChart.length === 0) return;

    // Create the top border
    let chart = "\nGantt Chart:\n";
    let topBorder = "┌";
    let middleBorder = "├";
    let bottomBorder = "└";
    let processes = "│";
    let timeline = " ";  // Space for alignment with the borders

    ganttChart.forEach((interval, index) => {
        const duration = interval.end - interval.start;
        const blockSize = duration * 1.5;  // Adjust this multiplier to change width

        // Create borders
        topBorder += "─".repeat(blockSize) + (index < ganttChart.length - 1 ? "┬" : "┐");
        middleBorder += "─".repeat(blockSize) + (index < ganttChart.length - 1 ? "┼" : "┤");
        bottomBorder += "─".repeat(blockSize) + (index < ganttChart.length - 1 ? "┴" : "┘");

        // Create process row
        const pid = `P${interval.pid}`;
        const padding = " ".repeat(Math.floor((blockSize - pid.length) / 2));
        const extraPad = " ".repeat(blockSize - pid.length - padding.length);
        processes += padding + pid + extraPad + "│";

        // Create timeline
        const timeStr = `${interval.start}`;
        timeline += " ".repeat(Math.floor((blockSize - timeStr.length) / 2)) + timeStr +
            " ".repeat(blockSize - Math.floor((blockSize - timeStr.length) / 2) - timeStr.length);

        if (index === ganttChart.length - 1) {
            timeline += " ".repeat(Math.floor(timeStr.length / 2)) + interval.end;
        }
    });

    chart += topBorder + "\n" +
        processes + "\n" +
        middleBorder + "\n" +
        timeline;

    console.log(chart);
}

