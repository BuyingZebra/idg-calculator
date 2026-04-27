function getCategories() {
  return Array.from(document.querySelectorAll(".cat")).map(input => ({
    name: input.dataset.name,
    weight: parseFloat(input.value) || 0
  }));
}

function calculate() {
  const categories = getCategories();

  let total = 0;
  let marketable = 0;
  let reject = 0;
  let barnacles = 0;

  categories.forEach(cat => {
    total += cat.weight;

    if (cat.name === "Premium" || cat.name === "Standard") {
      marketable += cat.weight;
    } else {
      reject += cat.weight;
    }

    if (cat.name === "Barnacles") {
      barnacles = cat.weight;
    }
  });

  window.totalSample = total;
  window.barnaclePercent = total > 0 ? (barnacles / total) * 100 : 0;

  displayResults(categories, total, marketable, reject, barnacles);
}

function displayResults(results, total, marketable, reject, barnacles) {
  const container = document.getElementById("results");

  let rows = "";
  let percentSum = 0;

  let premium = 0;
  let standard = 0;

  results.forEach(r => {
    if (r.name === "Premium") premium = r.weight;
    if (r.name === "Standard") standard = r.weight;
  });

  const sizeTotal = premium + standard;
  let sizeSum = 0;

  results.forEach(r => {
    const pct = total > 0 ? (r.weight / total) * 100 : 0;
    percentSum += pct;

    let sizeDisplay = "-";

    if (r.name === "Premium" || r.name === "Standard") {
      const sizePct = sizeTotal > 0 ? (r.weight / sizeTotal) * 100 : 0;
      sizeSum += sizePct;
      sizeDisplay = `${sizePct.toFixed(2)}%`;
    }

    let key = "";
    if (r.name === "Premium") key = "premium";
    else if (r.name === "Standard") key = "standard";
    else if (r.name === "Critical Weak") key = "criticalweak";
    else if (r.name === "Soft Shell") key = "softshell";
    else if (r.name === "Dead") key = "dead";
    else if (r.name === "Undersize") key = "undersize";
    else if (r.name === "Barnacles") key = "barnacles";

    // ✅ DISPLAY NAME FIXES
    let displayName = r.name;
    if (r.name === "Undersize") displayName = 'Less than 3.74"';
    if (r.name === "Barnacles") displayName = "Barn./Tubeworm";

    rows += `
      <tr>
        <td><span class="info" onclick="showFormula('${key}')">${displayName}</span></td>
        <td>${r.weight.toFixed(1)}</td>
        <td>${pct.toFixed(2)}%</td>
        <td>${sizeDisplay}</td>
      </tr>
    `;
  });

  const rejectPercent = total > 0 ? (reject / total) * 100 : 0;

  const totalValid = Math.abs(percentSum - 100) < 0.01;
  const sizeValid = Math.abs(sizeSum - 100) < 0.01;

  const totalColor = totalValid ? "#22c55e" : "#ef4444";
  const sizeColor = sizeValid ? "#22c55e" : "#ef4444";

  container.innerHTML = `
    <table class="results-table">
      <thead>
        <tr>
          <th>Grade</th>
          <th>Net Lbs. Graded</th>
          <th>% of Net Lbs.</th>
          <th>% by Size</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td><strong><span class="info" onclick="showFormula('totalreject')">Total Reject</span></strong></td>
          <td>${reject.toFixed(1)}</td>
          <td>${rejectPercent.toFixed(2)}%</td>
          <td>-</td>
        </tr>
        <tr class="grand-total">
          <td><strong><span class="info" onclick="showFormula('grandtotal')">Grand Total (Less Total Reject)</span></strong></td>
          <td>${(total - reject).toFixed(1)}</td>
          <td>100.00%</td>
          <td>${sizeSum.toFixed(2)}%</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top:10px; color:${totalColor}; font-weight:bold;">
      ✔ Total % = ${percentSum.toFixed(2)}%
    </div>

    <div style="color:${sizeColor}; font-weight:bold;">
      ✔ Size % = ${sizeSum.toFixed(2)}%
    </div>
  `;
}

function calculateLanded() {
  const gross = Math.round(parseFloat(document.getElementById("grossWeight").value) || 0);
  const pans = parseFloat(document.getElementById("pans").value) || 0;
  const grossSample = parseFloat(document.getElementById("grossSample").value) || 0;

  const netSample = window.totalSample || 0;

  if (gross === 0) return;

  const percentCrab = grossSample > 0
    ? (netSample / grossSample) * 100
    : 0;

  const net = Math.round(gross * (percentCrab / 100));

  const barnPercent = window.barnaclePercent || 0;

  const barnacles = Math.round(net * 0.24 * (barnPercent / 100));

  const netLessBarnacles = net - barnacles;

  const avgPan = pans > 0 ? (net / pans) : 0;

  document.getElementById("landedResults").innerHTML = `
    <table class="results-table">
      <tbody>
        <tr><td>Gross Pounds Landed</td><td>${gross}</td></tr>
        <tr><td><span class="info" onclick="showFormula('percentcrab')">Percentage of Crab</span></td><td>${percentCrab.toFixed(2)}%</td></tr>
        <tr><td><span class="info" onclick="showFormula('net')">Net Pounds Landed</span></td><td>${net}</td></tr>
        <tr><td><span class="info" onclick="showFormula('barnacleweight')">Barnacle Weight</span></td><td>${barnacles}</td></tr>
        <tr class="total-row">
          <td><strong><span class="info" onclick="showFormula('netlessbarnacles')">Net Pounds (Less Barnacles)</span></strong></td>
          <td><strong>${netLessBarnacles}</strong></td>
        </tr>
        <tr class="grand-total">
          <td><strong><span class="info" onclick="showFormula('avgpan')">Average Weight/Pan</span></strong></td>
          <td><strong>${avgPan.toFixed(1)}</strong></td>
        </tr>
      </tbody>
    </table>
  `;
}

/* FORMULAS (unchanged) */
const formulas = {
  premium: [
    "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Premium)\nB = Total Net Lbs. Graded (All Categories)",
    "% by Size\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Premium)\nB = Total Net Lbs. Graded (Premium + Standard)"
  ],
  standard: [
    "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Standard)\nB = Total Net Lbs. Graded (All Categories)",
    "% by Size\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Standard)\nB = Total Net Lbs. Graded (Premium + Standard)"
  ],
  criticalweak: [
    "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Critical Weak)\nB = Total Net Lbs. Graded (All Categories)"
  ],
  softshell: [
    "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Soft Shell)\nB = Total Net Lbs. Graded (All Categories)"
  ],
  dead: [
    "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Dead)\nB = Total Net Lbs. Graded (All Categories)"
  ],
  undersize: [
    "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Less than 3.74\")\nB = Total Net Lbs. Graded (All Categories)"
  ],
  barnacles: [
    "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Barn./Tubeworm)\nB = Total Net Lbs. Graded (All Categories)"
  ],
  totalreject: [
    "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Total Net Lbs. Graded (All Reject Categories)\nB = Total Net Lbs. Graded (All Categories)"
  ],
  grandtotal: [
    "% of Net Lbs.\n\nAlways 100%",
    "% by Size\n\nPremium + Standard = 100%"
  ],

  percentcrab: [
    "% Crab\n\nA ÷ B × 100\n\nA = Total Net Lbs. Graded (Sample)\nB = Gross Lbs. Graded (Sample)"
  ],
  net: [
    "Net Pounds Landed\n\nA × (B ÷ 100)\n\nA = Gross Pounds Landed\nB = Percentage of Crab"
  ],
  barnacleweight: [
    "Barnacle Weight\n\nA × 0.24 × (B ÷ 100)\n\nA = Net Pounds Landed\nB = Barn./Tubeworm % (from sample)"
  ],
  netlessbarnacles: [
    "Net Pounds (Less Barnacles)\n\nA − B\n\nA = Net Pounds Landed\nB = Barnacle Weight"
  ],
  avgpan: [
    "Average Weight/Pan\n\nA ÷ B\n\nA = Net Pounds Landed\nB = Total # of Pans"
  ]
};

function showFormula(key) {
  const list = formulas[key] || ["No formula available"];

  document.getElementById("formulaText").innerHTML =
    list.map(f => {
    const lines = f.split("\n");

    return `
        <div style="margin-bottom:16px;">
        <strong>${lines[0]}</strong><br>
        ${lines.slice(1).join("<br>")}
        </div>
    `;
    })

  document.getElementById("formulaModal").style.display = "block";
}

function closeModal() {
  document.getElementById("formulaModal").style.display = "none";
}