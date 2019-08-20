# android-stability-analysis
Analyses data from various sources including Android Vitals for crashes, ANRs and other stability concerns


## Running
```bash
# Find similar
npm run start:similar -- --data=./data/android-crash-clusters_1557226424411.json --traceLines=./data/sampleTraceLines.txt
cat ./out.csv
```
