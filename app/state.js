const appState = {
    inspectionDetail: {
        inputs: {
            grossGraded: 0,
            premium: 0,
            standard: 0,
            criticalWeak: 0,
            softShell: 0,
            dead: 0,
            undersize: 0,
            barnacleTubeworm: 0
        },
        results: {}
    },
    inspectionSummary: {
        inputs: {
            totalPans: 0,
            hailedWeight: 0,
            grossLanded: 0
        },
        results: {}
    }
,
    activitySlip: {
        current: null
    },
    profile: {
        graderName: "",
        homePort: ""
    }
};

function recalculateAll(){
    appState.inspectionDetail.results = calculateGradingSummary(appState.inspectionDetail.inputs);
    appState.inspectionSummary.results = calculateInspectionSummary(
        appState.inspectionSummary.inputs,
        appState.inspectionDetail.inputs,
        appState.inspectionDetail.results
    );
}

function setAppNumber(section, key, rawValue){
    const value = Number.parseFloat(rawValue);
    appState[section].inputs[key] = Number.isFinite(value) ? value : 0;
    recalculateAll();
}

recalculateAll();
