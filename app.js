/* ========================= */
/* SECTION A (Inspection Detail A) */
/* ========================= */

const SectionA = {

  /* ------------------------- */
  /* ROW MANAGEMENT */
  /* ------------------------- */
  addRow: function () {
    const tbody = document.getElementById("inspectionBody");

    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="number" step="0.1"></td>
      <td><input type="number" step="0.1"></td>
      <td><input type="number" step="0.1"></td>
      <td><input type="number" step="0.1"></td>
      <td><input type="number" step="0.1"></td>
      <td><input type="number" step="0.1"></td>
      <td><input type="number" step="0.1"></td>
      <td><input type="number" step="0.1"></td>
      <td><input type="number" step="0.1"></td>
    `;

    tbody.appendChild(row);
  },

  removeLastRow: function () {
    const tbody = document.getElementById("inspectionBody");

    if (tbody.rows.length === 0) return;

    const lastRow = tbody.rows[tbody.rows.length - 1];
    const inputs = lastRow.querySelectorAll("input");

    const hasData = Array.from(inputs).some(input => input.value !== "");

    if (hasData) {
      const confirmDelete = confirm("This row contains data. Are you sure you want to remove it?");
      if (!confirmDelete) return;
    }

    tbody.deleteRow(-1);
  },

  /* ------------------------- */
  /* DATA EXTRACTION */
  /* ------------------------- */
  getRowElements: function () {
    return Array.from(document.querySelectorAll("#inspectionBody tr"));
  },

  /* ------------------------- */
  /* CORE CALCULATIONS */
  /* ------------------------- */
  calculateTotals: function () {
    const rows = this.getRowElements();

    let totals = {
      Premium: 0,
      Standard: 0,
      "Critical Weak": 0,
      "Soft Shell": 0,
      Dead: 0,
      Undersize: 0,
      Barnacles: 0
    };

    let totalGross = 0;
    let tempCount = 0;
    let tempAbove4 = 0;

    rows.forEach(row => {
      const inputs = row.querySelectorAll("input");

      const gross = parseFloat(inputs[0].value) || 0;
      const rawTemp = inputs[1].value;
      const temp = parseFloat(rawTemp);

      totalGross += gross;

      totals.Premium += parseFloat(inputs[2].value) || 0;
      totals.Standard += parseFloat(inputs[3].value) || 0;
      totals["Critical Weak"] += parseFloat(inputs[4].value) || 0;
      totals["Soft Shell"] += parseFloat(inputs[5].value) || 0;
      totals.Dead += parseFloat(inputs[6].value) || 0;
      totals.Undersize += parseFloat(inputs[7].value) || 0;
      totals.Barnacles += parseFloat(inputs[8].value) || 0;

      /* Temperature logic (FIXED) */
      if (rawTemp !== "") {
        tempCount++;

        if (!isNaN(temp) && temp > 4) {
          tempAbove4++;
        }
      }
    });

    const totalNet =
      totals.Premium +
      totals.Standard +
      totals["Critical Weak"] +
      totals["Soft Shell"] +
      totals.Dead +
      totals.Undersize +
      totals.Barnacles;

    const premiumStandard = totals.Premium + totals.Standard;

    return {
      totals,
      totalGross,
      totalNet,
      premiumStandard,
      tempCount,
      tempAbove4
    };
  },

  /* ------------------------- */
  /* SAMPLING PLAN */
  /* ------------------------- */
  calculateSamplingPlan: function () {
    const weight = parseFloat(document.getElementById("hailedWeight").value) || 0;

    return weight > 0
      ? Math.round((weight / 45) * 0.05)
      : 0;
  },

  /* ------------------------- */
  /* RENDER RESULTS */
  /* ------------------------- */
  renderResults: function (data) {
    document.getElementById("samplingResults").innerHTML = `
      <table class="results-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Results</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span class="info" onclick="SectionB.showFormula('samplingplan')">
                # Samples from Sampling Plan
              </span>
            </td>
            <td>${data.samples}</td>
          </tr>
          <tr>
            <td># > 4°C</td>
            <td>${data.tempAbove4}</td>
          </tr>
          <tr>
            <td># Temp</td>
            <td>${data.tempCount}</td>
          </tr>
          <tr>
            <td>Total Gross Lbs. Graded</td>
            <td>${data.totalGross.toFixed(1)}</td>
          </tr>
          <tr class="total-row">
            <td><strong>Total Premium & Standard</strong></td>
            <td><strong>${data.premiumStandard.toFixed(1)}</strong></td>
          </tr>
          <tr class="grand-total">
            <td><strong>Total Net Lbs. Graded</strong></td>
            <td><strong>${data.totalNet.toFixed(1)}</strong></td>
          </tr>
        </tbody>
      </table>
    `;
  },

  /* ------------------------- */
  /* MAIN PROCESS */
  /* ------------------------- */
  process: function () {
    const calc = this.calculateTotals();
    const samples = this.calculateSamplingPlan();

    this.renderResults({
      samples,
      tempCount: calc.tempCount,
      tempAbove4: calc.tempAbove4,
      premiumStandard: calc.premiumStandard,
      totalNet: calc.totalNet,
      totalGross: calc.totalGross
    });

    return {
      totals: calc.totals,
      totalGross: calc.totalGross,
      samples: samples
    };
  }
};

/* ========================= */
/* SECTION B (Inspection Detail B) */
/* ========================= */

const SectionB = {

  /* ------------------------- */
  /* CATEGORY COLLECTION (UNCHANGED) */
  /* ------------------------- */
  getCategories: function () {
    return Array.from(document.querySelectorAll(".cat")).map(input => ({
      name: input.dataset.name,
      weight: parseFloat(input.value) || 0
    }));
  },

  /* ------------------------- */
  /* APPLY DATA FROM SECTION A */
  /* ------------------------- */
  applyTotals: function (totals) {
    document.querySelectorAll(".cat").forEach(input => {
      const key = input.dataset.name;
      if (totals[key] !== undefined) {
        input.value = totals[key].toFixed(1);
      }
    });
  },

  /* ------------------------- */
  /* CALCULATION (UNCHANGED LOGIC) */
  /* ------------------------- */
  calculate: function () {
    const categories = this.getCategories();

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

    this.displayResults(categories, total, marketable, reject, barnacles);
  },

  /* ------------------------- */
  /* DISPLAY RESULTS (UNCHANGED) */
  /* ------------------------- */
  displayResults: function (results, total, marketable, reject, barnacles) {
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

      let displayName = r.name;
      if (r.name === "Undersize") displayName = 'Less than 3.74"';
      if (r.name === "Barnacles") displayName = "Barn. / Tubeworm";

      rows += `
        <tr>
          <td><span class="info" onclick="SectionB.showFormula('${key}')">${displayName}</span></td>
          <td>${r.weight.toFixed(1)}</td>
          <td>${pct.toFixed(2)}%</td>
          <td>${sizeDisplay}</td>
        </tr>
      `;
    });

    const rejectPercent = total > 0 ? (reject / total) * 100 : 0;

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
            <td><strong><span class="info" onclick="SectionB.showFormula('totalreject')">Total Reject</span></strong></td>
            <td>${reject.toFixed(1)}</td>
            <td>${rejectPercent.toFixed(2)}%</td>
            <td>-</td>
          </tr>
          <tr class="grand-total">
            <td><strong><span class="info" onclick="SectionB.showFormula('grandtotal')">Grand Total (Less Total Reject)</span></strong></td>
            <td>${total.toFixed(1)}</td>
            <td>100.00%</td>
            <td>${sizeSum.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:10px; color:#22c55e; font-weight:bold;">
        ✔ Total % = ${percentSum.toFixed(2)}%
      </div>

      <div style="color:#22c55e; font-weight:bold;">
        ✔ Size % = ${sizeSum.toFixed(2)}%
      </div>
    `;
  },

  /* ------------------------- */
  /* FORMULAS (RESTORED + COMPLETE) */
  /* ------------------------- */
  formulas: {
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
      "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Net Lbs. Graded (Barn. / Tubeworm)\nB = Total Net Lbs. Graded (All Categories)"
    ],
    totalreject: [
      "% of Net Lbs.\n\nA ÷ B × 100\n\nA = Total Net Lbs. Graded (All Reject Categories)\nB = Total Net Lbs. Graded (All Categories)"
    ],
    grandtotal: [
      "% of Net Lbs.\n\nAlways 100%",
      "% by Size\n\nPremium + Standard = 100%"
    ],
    samplingplan: [
      "# Sample from Sampling Plan\n\nA ÷ 45 × 5%\n\nA = Hailed Weight (Lbs.)"
    ]
  },

  /* ------------------------- */
  /* FORMULA MODAL (UNCHANGED) */
  /* ------------------------- */
  showFormula: function (key) {
    const list = this.formulas[key] || ["No formula available"];

    document.getElementById("formulaText").innerHTML =
      list.map(f => {
        const lines = f.split("\n");

        return `
          <div style="margin-bottom:16px;">
            <strong>${lines[0]}</strong><br>
            ${lines.slice(1).join("<br>")}
          </div>
        `;
      }).join("");

    document.getElementById("formulaModal").style.display = "block";
  },

  closeModal: function () {
    document.getElementById("formulaModal").style.display = "none";
  }
};

/* ========================= */
/* SECTION C (Inspection Detail C) */
/* ========================= */

const SectionC = {

  /* ------------------------- */
  /* APPLY DATA FROM SECTION A */
  /* ------------------------- */
  setGrossSample: function (value) {
    document.getElementById("grossSample").value = value.toFixed(1);
  },

  /* ------------------------- */
  /* CALCULATION (UNCHANGED LOGIC) */
  /* ------------------------- */
  calculate: function () {
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

    this.renderResults({
      gross,
      percentCrab,
      net,
      barnacles,
      netLessBarnacles,
      avgPan
    });
  },

  /* ------------------------- */
  /* RENDER RESULTS (UNCHANGED) */
  /* ------------------------- */
  renderResults: function (data) {
    document.getElementById("landedResults").innerHTML = `
      <table class="results-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Results</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gross Pounds Landed</td>
            <td>${data.gross}</td>
          </tr>
          <tr>
            <td><span class="info" onclick="SectionB.showFormula('percentcrab')">Percentage of Crab</span></td>
            <td>${data.percentCrab.toFixed(2)}%</td>
          </tr>
          <tr>
            <td><span class="info" onclick="SectionB.showFormula('net')">Net Pounds Landed</span></td>
            <td>${data.net}</td>
          </tr>
          <tr>
            <td><span class="info" onclick="SectionB.showFormula('barnacleweight')">Barnacle Weight</span></td>
            <td>${data.barnacles}</td>
          </tr>
          <tr class="total-row">
            <td><strong><span class="info" onclick="SectionB.showFormula('netlessbarnacles')">Net Pounds (Less Barnacles)</span></strong></td>
            <td><strong>${data.netLessBarnacles}</strong></td>
          </tr>
          <tr class="grand-total">
            <td><strong><span class="info" onclick="SectionB.showFormula('avgpan')">Average Weight/Pan</span></strong></td>
            <td><strong>${data.avgPan.toFixed(1)}</strong></td>
          </tr>
        </tbody>
      </table>
    `;
  }
};

function populateAll() {
  const dataA = SectionA.process();

  // Populate Section B ONLY (no calculation)
  SectionB.applyTotals(dataA.totals);

  // Populate Section C ONLY (no calculation)
  SectionC.setGrossSample(dataA.totalGross);

  // NO automatic calculations
}

/* ========================= */
/* INIT */
/* ========================= */
window.onload = function () {

  // Default rows in Section A
  for (let i = 0; i < 3; i++) {
    SectionA.addRow();
  }

};