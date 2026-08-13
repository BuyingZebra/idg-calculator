const gradingFormulaDefinitions = {
    totalNetLbsGraded: {
        title: "Total Net Lbs. Graded",
        formula: "Premium + Standard + Critical Weak + Soft Shell + Dead + Undersize + Barnacle/Tubeworm",
        note: "Automatically adds all individual graded crab weights. Gross Lbs. Graded is recorded separately."
    },
    totalReject: {
        title: "Total Reject",
        formula: "Critical Weak + Soft Shell + Dead + Undersize + Barnacle/Tubeworm",
        note: "Adds all reject categories."
    },
    premiumPercent: {
        title: "% Premium",
        formula: "Premium ÷ Total Net Lbs. Graded × 100"
    },
    standardPercent: {
        title: "% Standard",
        formula: "Standard ÷ Total Net Lbs. Graded × 100"
    },
    criticalWeakPercent: {
        title: "% Critical Weak",
        formula: "Critical Weak ÷ Total Net Lbs. Graded × 100"
    },
    softShellPercent: {
        title: "% Soft Shell",
        formula: "Soft Shell ÷ Total Net Lbs. Graded × 100"
    },
    deadPercent: {
        title: "% Dead",
        formula: "Dead ÷ Total Net Lbs. Graded × 100"
    },
    undersizePercent: {
        title: "% Undersize",
        formula: "Undersize ÷ Total Net Lbs. Graded × 100"
    },
    barnacleTubewormPercent: {
        title: "% Barnacle / Tubeworm",
        formula: "Barnacle/Tubeworm ÷ Total Net Lbs. Graded × 100"
    },
    premiumBySize: {
        title: "% Premium by Size",
        formula: "Premium ÷ (Premium + Standard) × 100",
        note: "Reject categories are not included in the by-size calculation."
    },
    standardBySize: {
        title: "% Standard by Size",
        formula: "Standard ÷ (Premium + Standard) × 100",
        note: "Reject categories are not included in the by-size calculation."
    },
    rejectPercent: {
        title: "% Reject",
        formula: "Critical Weak % + Soft Shell % + Dead % + Undersize % + Barnacle/Tubeworm %"
    }
};

function safePercent(part, whole) {
    return whole > 0 ? (part / whole) * 100 : 0;
}

function round2(value) {
    return Number(value.toFixed(2));
}

function calculateGradingSummary(inputs) {
    const totalNetLbsGraded =
        inputs.premium +
        inputs.standard +
        inputs.criticalWeak +
        inputs.softShell +
        inputs.dead +
        inputs.undersize +
        inputs.barnacleTubeworm;

    const totalReject =
        inputs.criticalWeak +
        inputs.softShell +
        inputs.dead +
        inputs.undersize +
        inputs.barnacleTubeworm;

    const premiumPercent = safePercent(inputs.premium, totalNetLbsGraded);
    const standardPercent = safePercent(inputs.standard, totalNetLbsGraded);
    const criticalWeakPercent = safePercent(inputs.criticalWeak, totalNetLbsGraded);
    const softShellPercent = safePercent(inputs.softShell, totalNetLbsGraded);
    const deadPercent = safePercent(inputs.dead, totalNetLbsGraded);
    const undersizePercent = safePercent(inputs.undersize, totalNetLbsGraded);
    const barnacleTubewormPercent = safePercent(inputs.barnacleTubeworm, totalNetLbsGraded);

    const sizeTotal = inputs.premium + inputs.standard;
    const premiumBySize = safePercent(inputs.premium, sizeTotal);
    const standardBySize = safePercent(inputs.standard, sizeTotal);

    const rejectPercent =
        round2(criticalWeakPercent) +
        round2(softShellPercent) +
        round2(deadPercent) +
        round2(undersizePercent) +
        round2(barnacleTubewormPercent);

    const percentLbsGraded =
        round2(premiumPercent) +
        round2(standardPercent) +
        round2(criticalWeakPercent) +
        round2(softShellPercent) +
        round2(deadPercent) +
        round2(undersizePercent) +
        round2(barnacleTubewormPercent);

    const percentBySizeTotal = round2(premiumBySize) + round2(standardBySize);

    return {
        totalNetLbsGraded,
        totalReject,
        premiumPercent,
        standardPercent,
        criticalWeakPercent,
        softShellPercent,
        deadPercent,
        undersizePercent,
        barnacleTubewormPercent,
        premiumBySize,
        standardBySize,
        rejectPercent,
        percentLbsGraded,
        percentBySizeTotal
    };
}
