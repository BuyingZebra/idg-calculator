/* ========================= */
/* FORMULA LIBRARY (EXPLICIT) */
/* ========================= */

const FormulaLibrary = {

  percentPremium: {
    calc: (p, total) => total > 0 ? (p / total) * 100 : 0,
    display: {
      title: "% Premium",
      formula: "A ÷ B × 100",
      variables: {
        A: "Premium Weight",
        B: "Total Net Lbs. Graded"
      }
    }
  },

  percentStandard: {
    calc: (s, total) => total > 0 ? (s / total) * 100 : 0,
    display: {
      title: "% Standard",
      formula: "A ÷ B × 100",
      variables: {
        A: "Standard Weight",
        B: "Total Net Lbs. Graded"
      }
    }
  },

  percentOther: {
    calc: (v, total) => total > 0 ? (v / total) * 100 : 0,
    display: {
      title: "% of Net Lbs.",
      formula: "A ÷ B × 100",
      variables: {
        A: "Category Weight",
        B: "Total Net Lbs. Graded"
      }
    }
  },

  sizePremium: {
    calc: (p, s) => (p + s) > 0 ? (p / (p + s)) * 100 : 0,
    display: {
      title: "% Premium by Size",
      formula: "A ÷ (Premium + Standard) × 100",
      variables: {
        A: "Premium Weight"
      }
    }
  },

  sizeStandard: {
    calc: (p, s) => (p + s) > 0 ? (s / (p + s)) * 100 : 0,
    display: {
      title: "% Standard by Size",
      formula: "A ÷ (Premium + Standard) × 100",
      variables: {
        A: "Standard Weight"
      }
    }
  },

  totalNet: {
    calc: (p, s, cw, ss, d, u, b) => p + s + cw + ss + d + u + b,
    display: {
      title: "Total Net Lbs. Graded",
      formula: "Sum of all category weights",
      variables: {}
    }
  },

  totalReject: {
    calc: (total, ps) => total - ps,
    display: {
      title: "Total Reject",
      formula: "Total Net - (Premium + Standard)",
      variables: {}
    }
  },

  percentCrab: {
    calc: (totalNet, grossGraded) =>
      grossGraded > 0 ? (totalNet / grossGraded) * 100 : 0,
    display: {
      title: "Percentage of Crab",
      formula: "A ÷ B × 100",
      variables: {
        A: "Net Lbs. Graded",
        B: "Gross Lbs. Graded"
      }
    }
  },

  netLanded: {
    calc: (gross, percent) => Math.round(gross * (percent / 100)),
    display: {
      title: "Net Pounds Landed",
      formula: "A × (B ÷ 100)",
      variables: {
        A: "Gross Pounds Landed",
        B: "% Crab"
      }
    }
  },

  barnacleWeight: {
    calc: (net, barnPercent) =>
      Math.round(net * 0.24 * (barnPercent / 100)),
    display: {
      title: "Barnacle Weight",
      formula: "(A × 0.24 × B) ÷ 100",
      variables: {
        A: "Net Pounds Landed",
        B: "Barnacle %"
      }
    }
  },

  netLess: {
    calc: (net, barn) => net - barn,
    display: {
      title: "Net Pounds (Less Barnacles)",
      formula: "A - B",
      variables: {
        A: "Net Pounds Landed",
        B: "Barnacle Weight"
      }
    }
  },

  avgPan: {
    calc: (gross, pans) => pans > 0 ? (gross / pans) : 0,
    display: {
      title: "Average Weight per Pan",
      formula: "A ÷ B",
      variables: {
        A: "Gross Pounds Landed",
        B: "Total # of Pans"
      }
    }
  }

};


/* ========================= */
/* GLOBAL STATE */
/* ========================= */

let gradingData = null;


/* ========================= */
/* MODAL SYSTEM */
/* ========================= */

function showFormula(key) {
  const f = FormulaLibrary[key]?.display;
  if (!f) return;

  let html = `<strong>${f.title}</strong><br><br>${f.formula}<br><br>`;

  for (let v in f.variables) {
    html += `${v} = ${f.variables[v]}<br>`;
  }

  document.getElementById("formulaText").innerHTML = html;
  document.getElementById("formulaModal").style.display = "block";
}

function closeFormula() {
  document.getElementById("formulaModal").style.display = "none";
}


/* ========================= */
/* SECTION A */
/* ========================= */

const SectionA = {

  getCategories() {
    const inputs = document.querySelectorAll(".cat");
    let data = {};
    inputs.forEach(i => data[i.dataset.name] = parseFloat(i.value) || 0);
    return data;
  },

  calculate() {

    const c = this.getCategories();

    const p = c["Premium"] || 0;
    const s = c["Standard"] || 0;
    const cw = c["Critical Weak"] || 0;
    const ss = c["Soft Shell"] || 0;
    const d = c["Dead"] || 0;
    const u = c["Undersize"] || 0;
    const b = c["Barnacles"] || 0;

    const total = FormulaLibrary.totalNet.calc(p, s, cw, ss, d, u, b);

    // Individual percentages
    const pctP = FormulaLibrary.percentPremium.calc(p, total);
    const pctS = FormulaLibrary.percentStandard.calc(s, total);
    const pctCW = FormulaLibrary.percentOther.calc(cw, total);
    const pctSS = FormulaLibrary.percentOther.calc(ss, total);
    const pctD = FormulaLibrary.percentOther.calc(d, total);
    const pctU = FormulaLibrary.percentOther.calc(u, total);
    const pctB = FormulaLibrary.percentOther.calc(b, total);

    // Size %
    const sizeP = FormulaLibrary.sizePremium.calc(p, s);
    const sizeS = FormulaLibrary.sizeStandard.calc(p, s);

    // 🔹 SUMS
    const percentSum = pctP + pctS + pctCW + pctSS + pctD + pctU + pctB;

    const rejectWeight = cw + ss + d + u + b;
    const rejectPercent = pctCW + pctSS + pctD + pctU + pctB;

    const sizeSum = sizeP + sizeS;

    const rows = [
      ["Premium", p, pctP, sizeP, "percentPremium", "sizePremium"],
      ["Standard", s, pctS, sizeS, "percentStandard", "sizeStandard"],
      ["Critical Weak", cw, pctCW, null, "percentOther"],
      ["Soft Shell", ss, pctSS, null, "percentOther"],
      ["Dead", d, pctD, null, "percentOther"],
      ["Less than 3.74\"", u, pctU, null, "percentOther"],
      ["Barn. / Tubeworm", b, pctB, null, "percentOther"]
    ];

    let html = `
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
    `;

    rows.forEach(r => {
      html += `
        <tr>
          <td>${r[0]}</td>
          <td>${r[1].toFixed(1)}</td>
          <td onclick="showFormula('${r[4]}')" class="info">${r[2].toFixed(2)}%</td>
          <td ${r[3] !== null ? `onclick="showFormula('${r[5]}')" class="info"` : ""}>
            ${r[3] !== null ? r[3].toFixed(2) + "%" : "-"}
          </td>
        </tr>
      `;
    });

    html += `
      <tr class="total-row">
        <td onclick="showFormula('totalReject')" class="info"><strong>Total Reject</strong></td>
        <td>${rejectWeight.toFixed(1)}</td>
        <td>${rejectPercent.toFixed(2)}%</td>
        <td>-</td>
      </tr>

      <tr class="grand-total">
        <td onclick="showFormula('totalNet')" class="info"><strong>Total Net Lbs. Graded</strong></td>
        <td>${total.toFixed(1)}</td>
        <td>${percentSum.toFixed(2)}%</td>
        <td>${sizeSum.toFixed(2)}%</td>
      </tr>
    `;

    html += `
        </tbody>
        </table>
    `;

    document.getElementById("results").innerHTML = html;

    return {
      totalNet: total,
      barnaclePercent: pctB
    };
  }
};


/* ========================= */
/* SECTION B */
/* ========================= */

const SectionB = {

  calculate() {

    if (!gradingData) {
      alert("Complete Dockside Grading first.");
      return;
    }

    const gross = +document.getElementById("grossWeight").value || 0;
    const pans = +document.getElementById("pans").value || 0;
    const graded = +document.getElementById("grossSample").value || 0;

    const total = gradingData.totalNet;
    const barnP = gradingData.barnaclePercent;

    const pct = FormulaLibrary.percentCrab.calc(total, graded);
    const net = FormulaLibrary.netLanded.calc(gross, pct);
    const barn = FormulaLibrary.barnacleWeight.calc(net, barnP);
    const netLess = FormulaLibrary.netLess.calc(net, barn);
    const avg = FormulaLibrary.avgPan.calc(gross, pans);

    document.getElementById("landedResults").innerHTML = `
      <table class="results-table">
        <tbody>
          <tr><td>Gross Pounds Landed</td><td>${gross}</td></tr>

          <tr>
            <td onclick="showFormula('percentCrab')" style="cursor:pointer;">Percentage of Crab</td>
            <td>${pct.toFixed(2)}%</td>
          </tr>

          <tr>
            <td onclick="showFormula('netLanded')" style="cursor:pointer;">Net Pounds Landed</td>
            <td>${net}</td>
          </tr>

          <tr>
            <td onclick="showFormula('barnacleWeight')" style="cursor:pointer;">Barnacle Weight</td>
            <td>${barn}</td>
          </tr>

          <tr>
            <td onclick="showFormula('netLess')" style="cursor:pointer;">Net Pounds (Less Barnacles)</td>
            <td>${netLess}</td>
          </tr>

          <tr>
            <td onclick="showFormula('avgPan')" style="cursor:pointer;">Average Weight/Pan</td>
            <td>${avg.toFixed(1)}</td>
          </tr>
        </tbody>
      </table>
    `;
  }
};


/* ========================= */
/* CONTROLLER */
/* ========================= */

function runGrading() {
  gradingData = SectionA.calculate();
}


/* ========================= */
/* CLEAR */
/* ========================= */

function clearForm() {
  document.querySelectorAll(".cat").forEach(i => i.value = "");
  document.getElementById("results").innerHTML = "";
  gradingData = null;
}

function clearLanded() {
  document.getElementById("grossWeight").value = "";
  document.getElementById("pans").value = "";
  document.getElementById("grossSample").value = "";
  document.getElementById("landedResults").innerHTML = "";
}


/* ========================= */
/* SERVICE WORKER */
/* ========================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").then(reg => {

    reg.onupdatefound = () => {
      const newWorker = reg.installing;

      newWorker.onstatechange = () => {
        if (newWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            // new version available → reload automatically
            window.location.reload();
          }
        }
      };
    };

  });
}