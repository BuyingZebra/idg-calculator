const completedSteps = new Set();

function isStepComplete(step){
    return completedSteps.has(Number(step));
}

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
            boatName: "",
            cfv: "",
            fishReceiptNumber: "",
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

    const inspectionDetailApproved=isStepComplete(0);
    const approvedGradingInputs=inspectionDetailApproved
        ? appState.inspectionDetail.inputs
        : {
            grossGraded:0,
            premium:0,
            standard:0,
            criticalWeak:0,
            softShell:0,
            dead:0,
            undersize:0,
            barnacleTubeworm:0
        };
    const approvedGradingResults=inspectionDetailApproved
        ? appState.inspectionDetail.results
        : calculateGradingSummary(approvedGradingInputs);

    appState.inspectionSummary.results = calculateInspectionSummary(
        appState.inspectionSummary.inputs,
        approvedGradingInputs,
        approvedGradingResults
    );
}

function setAppNumber(section, key, rawValue){
    const value = Number.parseFloat(rawValue);
    appState[section].inputs[key] = Number.isFinite(value) ? value : 0;
    recalculateAll();
}

function commitAppStateChange(mutator){
    if(typeof mutator==="function"){
        mutator();
    }
    recalculateAll();
    if(typeof refreshHomePreview==="function"){
        refreshHomePreview();
    }
}

function setAppNumberAndRefresh(section,key,rawValue){
    const value=Number.parseFloat(rawValue);
    commitAppStateChange(()=>{
        appState[section].inputs[key]=Number.isFinite(value) ? value : 0;
    });
}

recalculateAll();
