import { join } from 'path';
import { writeFileSync, readFileSync, write } from 'fs';


const argv = require('minimist')(process.argv.slice(2));

if (!argv.data) {
    throw new Error(`No data argument set, this is required [--data=./file.json]`);
}
if (!argv.traceLines) {
    throw new Error(`No traceLines argument set, this is required [--traceLines=./file.txt]`);
}
const dataPath = join(process.cwd(), argv.data);
const traceLinesPath = join(process.cwd(), argv.traceLines);
console.info(`Reading data file from [${dataPath}]`);
const data = require(dataPath);
const rawTraceLines = readFileSync(traceLinesPath, 'utf8');
const traceLines = rawTraceLines.trim().split('\n').map(_line => {
    const line = _line.trim();
    const methodName = line.split('at ')[1].split(' ')[0]; // Hacky
    const lineNo = line.split(':').slice(-1)[0].split(')')[0];
    return {
        methodName,
        lineNo,
    };
});

const notedData = data.map((cluster) => {
    const similarity = compareSimilarity(traceLines, cluster);
    return {
        ...cluster,
        similarity,
    }
});

let csvData = `Cluster Name,Similarity,Reports,Reports Total,Impacted Users\n`
for (const d of notedData) {
    if (d.similarity) {
        const clusterName = d.exceptions[0].trace.split('\n').slice(0, 2).join('\\n').replace(/,/, '_');
        csvData += `${clusterName},${d.similarity},${d.Reports},${d['Reports Total']},${d['Impacted Users']}\n`
    }
}

writeFileSync(`out.csv`, csvData, 'utf8');
console.info(`Written output to [./out.csv]`);


function compareSimilarity(refTraceLines, cluster) {
    const similarityRatings = cluster.exceptions.map(exception => {
        let similarity = 0;

        const methodNamesMatch = refTraceLines.every(({ methodName }) => {
            return exception.trace.includes(methodName);
        });

        if (methodNamesMatch) {
            similarity += 50;

            const lineNumbersMatch = refTraceLines.every(({ lineNo, methodName }) => {
                const eTraceLines = exception.trace.split('\n');
                return eTraceLines.some(l => {
                    return l.includes(methodName) && l.includes(`:${lineNo}`);
                })
            });

            if (lineNumbersMatch) {
                similarity += 50;
            }
        }

        return similarity
    });

    const totalSimilarity = similarityRatings.reduce((acc, s) => acc + s);
    const avgSimilarity = totalSimilarity / similarityRatings.length;
    return avgSimilarity;
}











