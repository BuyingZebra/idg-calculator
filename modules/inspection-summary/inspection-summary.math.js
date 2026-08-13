const inspectionFormulaDefinitions = {
    numberOfSamples: {
        title: "Number of Samples",
        formula: "Hailed Weight ÷ 45 × 5%",
        note: "This simplifies to Hailed Weight ÷ 900. Under 2,000 lbs automatically requires 2 samples. At 2,000 lbs and above, the result is rounded to the nearest whole sample."
    },
    percentCrab: {
        title: "% of Crab",
        formula: "Total Net Lbs. Graded ÷ Gross Lbs. Graded × 100",
        note: "Total Net Lbs. Graded is automatically summed from the Inspection Detail grade-category inputs. Gross Lbs. Graded is the first Inspection Detail input."
    },
    netPoundsLanded: {
        title: "Net Pounds Landed",
        formula: "Gross Pounds Landed × (% of Crab ÷ 100)"
    },
    barnacleWeight: {
        title: "Barnacle Weight",
        formula: "(Net Pounds Landed × 0.24 × Barnacle/Tubeworm %) ÷ 100"
    },
    netPoundsLessBarnacles: {
        title: "Net Pounds Less Barnacles",
        formula: "Net Pounds Landed − Barnacle Weight"
    },
    averagePanWeight: {
        title: "Average Weight / Pan",
        formula: "Gross Pounds Landed ÷ Total Number of Pans",
        note: "The original training calculator notes that an average greater than 50 lbs per pan is considered overfilled."
    }
};

function calculateNumberOfSamples(hailedWeight) {
    if (hailedWeight < 2000) return 2;
    return Math.round(hailedWeight / 900);
}

function calculateInspectionSummary(inputs, gradingInputs, gradingResults) {
    const percentCrab = gradingInputs.grossGraded > 0
        ? (gradingResults.totalNetLbsGraded / gradingInputs.grossGraded) * 100
        : 0;

    const netPoundsLanded = Math.round(inputs.grossLanded * (percentCrab / 100));
    const landedDifference = Math.max(0, inputs.grossLanded - netPoundsLanded);
    const iceWaterPercent = Math.max(0, 100 - percentCrab);

    const barnacleWeight = Math.round(
        netPoundsLanded * 0.24 * (gradingResults.barnacleTubewormPercent / 100)
    );

    const netPoundsLessBarnacles = netPoundsLanded - barnacleWeight;

    const averagePanWeight = inputs.totalPans > 0
        ? inputs.grossLanded / inputs.totalPans
        : 0;

    return {
        numberOfSamples: calculateNumberOfSamples(inputs.hailedWeight),
        percentCrab,
        netPoundsLanded,
        landedDifference,
        iceWaterPercent,
        barnacleWeight,
        netPoundsLessBarnacles,
        averagePanWeight
    };
}
