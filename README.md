# android-stability-analysis
Analyses data from various sources including Android Vitals for crashes, ANRs and other stability concerns.

The project contains a utility script to pattern match clusters of errors reported in Android Vitals. Android Vitals has not grouped clusters completely for several years (first observed in early 2019, still occuring June 2020). This leads to flaws in their rankings of the errors. 

This scripts helps teams identify common clusters, the totals for these clusters can then be recalculated. The recalculated totals then enable a corrected league table to be produced. Teams can then choose the order to address reported errors based on the corrected ranking rather than the flawed ranking Google generates.

## Installing TypeScript and the core packages needed for this project

Prerequisites: node and npm need to be already installed on your computer
```bash
# Install TypeScript and the core packages used
npm install -g typescript
npm install @types/node --save-dev
```

## Running
```bash
# Find similar
npm run start:similar -- --data=./data/android-crash-clusters_1557226424411.json --traceLines=./data/sampleTraceLines.txt
cat ./out.csv
```
