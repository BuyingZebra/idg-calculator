/* Global State */
/* ---------------------------------------------------------------------------------------------------- */

let gradingData = null;

/* Calculation Synchronization */
/* ---------------------------------------------------------------------------------------------------- */

let section_a_state = "";
let section_b_synced_state = "";
let section_b_active = false;

/* Helper Windows (Modal) */
/* ---------------------------------------------------------------------------------------------------- */

function helper_enable(section, key) {

  const f = math[section]?.[key];

  if (!f) return;

  let html = `
    <strong>${f.title}</strong><br><br>
    ${f.formula}<br><br>
  `;

  for (let v in f.variables) {
    html += `${v} = ${f.variables[v]}<br>`;
  }

  html += `<br>${f.help}`;

  document.getElementById("formulaText").innerHTML = html;

  document.getElementById("formulaModal").style.display = "block";
}

function helper_disable() {
  document.getElementById("formulaModal").style.display = "none";
}

/* Section A Functions */
/* ---------------------------------------------------------------------------------------------------- */

function section_a_source_data() {

  const inputs = document.querySelectorAll(".cat");

  const data = {};

  inputs.forEach(i => {

    data[i.dataset.key] = parseFloat(i.value) || 0;

  });

  return data;
}

function section_a_process_data(data) {

  const formulas = math.section_a_math;

  const runtime_data = {

    premium:
      data.premium || 0,

    standard:
      data.standard || 0,

    critical_weak:
      data.critical_weak || 0,

    soft_shell:
      data.soft_shell || 0,

    dead:
      data.dead || 0,

    under_sized:
      data.under_sized || 0,

    barnacle_tubeworm:
      data.barnacle_tubeworm || 0,

    gross_lbs_graded:
      data.gross_lbs_graded || 0

  };

  const execution_order = [

    "total_net_lbs_graded",

    "total_reject",

    "percent_premium",
    "percent_standard",
    "percent_critical_weak",
    "percent_soft_shell",
    "percent_dead",
    "percent_under_sized",
    "percent_barnacle_tubeworm",

    "percent_size_premium",
    "percent_size_standard",

    "percent_reject",
    "percent_lbs_graded"

  ];

  run_formula_sequence(
    formulas,
    runtime_data,
    execution_order
  );

  return {

    total_net_lbs_graded:
      runtime_data.total_net_lbs_graded,

    rows: [

      [
        "Premium",
        runtime_data.premium,
        runtime_data.percent_premium,
        runtime_data.percent_size_premium,
        ["section_a_math", "percent_premium"],
        ["section_a_math", "percent_size_premium"]
      ],

      [
        "Standard",
        runtime_data.standard,
        runtime_data.percent_standard,
        runtime_data.percent_size_standard,
        ["section_a_math", "percent_standard"],
        ["section_a_math", "percent_size_standard"]
      ],

      [
        "Critical Weak",
        runtime_data.critical_weak,
        runtime_data.percent_critical_weak,
        null,
        ["section_a_math", "percent_critical_weak"]
      ],

      [
        "Soft Shell",
        runtime_data.soft_shell,
        runtime_data.percent_soft_shell,
        null,
        ["section_a_math", "percent_soft_shell"]
      ],

      [
        "Dead",
        runtime_data.dead,
        runtime_data.percent_dead,
        null,
        ["section_a_math", "percent_dead"]
      ],

      [
        "Less than 3.74\"",
        runtime_data.under_sized,
        runtime_data.percent_under_sized,
        null,
        ["section_a_math", "percent_under_sized"]
      ],

      [
        "Barn. / Tubeworm",
        runtime_data.barnacle_tubeworm,
        runtime_data.percent_barnacle_tubeworm,
        null,
        ["section_a_math", "percent_barnacle_tubeworm"]
      ]

    ],

    total_reject:
      runtime_data.total_reject,

    percent_reject:

      round_percent(
        runtime_data.percent_critical_weak
      ) +

      round_percent(
        runtime_data.percent_soft_shell
      ) +

      round_percent(
        runtime_data.percent_dead
      ) +

      round_percent(
        runtime_data.percent_under_sized
      ) +

      round_percent(
        runtime_data.percent_barnacle_tubeworm
      ),

    percent_lbs_graded:

      round_percent(
        runtime_data.percent_premium
      ) +

      round_percent(
        runtime_data.percent_standard
      ) +

      round_percent(
        runtime_data.percent_critical_weak
      ) +

      round_percent(
        runtime_data.percent_soft_shell
      ) +

      round_percent(
        runtime_data.percent_dead
      ) +

      round_percent(
        runtime_data.percent_under_sized
      ) +

      round_percent(
        runtime_data.percent_barnacle_tubeworm
      ),

    percent_size_total:

      round_percent(
        runtime_data.percent_size_premium
      ) +

      round_percent(
        runtime_data.percent_size_standard
      ),

    percent_barnacle_tubeworm:
      runtime_data.percent_barnacle_tubeworm,

    gross_lbs_graded:
      runtime_data.gross_lbs_graded

  };
}

function section_a_format_data(data) {

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

  data.rows.forEach(r => {

    html += `
      <tr>

        <td>${r[0]}</td>

        <td>${r[1].toFixed(1)}</td>

        <td
          onclick="helper_enable('${r[4][0]}', '${r[4][1]}')"
          class="info"
        >
          ${r[2].toFixed(2)}%
        </td>

        <td
          ${
            r[3] !== null
              ? `onclick="helper_enable('${r[5][0]}', '${r[5][1]}')" class="info"`
              : ""
          }
        >
          ${r[3] !== null ? r[3].toFixed(2) + "%" : "-"}
        </td>

      </tr>
    `;
  });

  html += `
    <tr class="total-row">

      <td
        onclick="helper_enable('section_a_math', 'total_reject')"
        class="info"
      >
        <strong>Total Reject</strong>
      </td>

      <td>${data.total_reject.toFixed(1)}</td>

      <td>${data.percent_reject.toFixed(2)}%</td>

      <td>-</td>

    </tr>

    <tr class="grand-total">

      <td
        onclick="helper_enable('section_a_math', 'total_net_lbs_graded')"
        class="info"
      >
        <strong>Total Net Lbs. Graded</strong>
      </td>

      <td>${data.total_net_lbs_graded.toFixed(1)}</td>

      <td>${data.percent_lbs_graded.toFixed(2)}%</td>

      <td>${data.percent_size_total.toFixed(2)}%</td>

    </tr>
  `;

  html += "</tbody></table>";

  document.getElementById("results").innerHTML = html;
}

function section_a_clear_data() {

  document
    .querySelectorAll(".cat")
    .forEach(input => {

      input.value = "";

    });

  initialize_results();

}

const section_a = {

  calculate() {

    const input =
      section_a_source_data();

    section_a_state =
      build_section_a_state(input);

    if (
      section_b_synced_state &&
      section_b_data_is_stale()
    ) {

      document.getElementById("formulaText").innerHTML = `

        <strong>Recalculation Recommended</strong><br><br>

        The Landed Pounds Summary uses values from the Dockside Grading Summary.<br><br>

        Dockside data has changed since the last Landed Pounds calculation.<br><br>

        Re-calculation is recommended to ensure accurate results.

      `;

      document.getElementById("formulaModal").style.display = "block";

    }

    const result =
      section_a_process_data(input);

    gradingData = result;

    section_a_format_data(result);

  }
};

/* Section B Functions */
/* ---------------------------------------------------------------------------------------------------- */

function section_b_source_data() {

  const inputs =
    document.querySelectorAll(".section-b-input");

  const data = {};

  inputs.forEach(input => {

    data[input.dataset.key] =
      parseFloat(input.value) || 0;

  });

  return data;
}

function build_section_a_state(data) {

  return JSON.stringify({

    premium:
      data.premium || 0,

    standard:
      data.standard || 0,

    critical_weak:
      data.critical_weak || 0,

    soft_shell:
      data.soft_shell || 0,

    dead:
      data.dead || 0,

    under_sized:
      data.under_sized || 0,

    barnacle_tubeworm:
      data.barnacle_tubeworm || 0

  });
}

function section_b_process_data(data) {

  const formulas = math.section_b_math;

  const execution_order = [

    "percent_crab",
    "net_pounds_landed",
    "barnacle_weight",
    "net_pounds_less_barnacles",
    "average_pan_weight"

  ];

  const runtime_data = {

    gross_pounds_landed:
      data.gross_pounds_landed || 0,

    total_number_of_pans:
      data.total_number_of_pans || 0,

    total_gross_lbs_graded:
      gradingData.gross_lbs_graded || 0,

    total_net_lbs_graded:
      gradingData.total_net_lbs_graded || 0,

    percent_barnacle_tubeworm:
      gradingData.percent_barnacle_tubeworm || 0

  };

  run_formula_sequence(
    formulas,
    runtime_data,
    execution_order
  );

  return {

    gross_pounds_landed:
      runtime_data.gross_pounds_landed,

    percent_crab:
      runtime_data.percent_crab,

    net_pounds_landed:
      runtime_data.net_pounds_landed,

    barnacle_weight:
      runtime_data.barnacle_weight,

    net_pounds_less_barnacles:
      runtime_data.net_pounds_less_barnacles,

    average_pan_weight:
      runtime_data.average_pan_weight
  };
}

function section_b_format_data(data) {

  if (data.error) {

    alert(data.error);

    return;
  }

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

          <td>${data.gross_pounds_landed}</td>

        </tr>

        <tr>

          <td
            onclick="helper_enable('section_b_math', 'percent_crab')"
            class="info"
          >
            % of Crab
          </td>

          <td>${data.percent_crab.toFixed(2)}%</td>

        </tr>

        <tr>

          <td
            onclick="helper_enable('section_b_math', 'net_pounds_landed')"
            class="info"
          >
            Net Pounds Landed
          </td>

          <td>${data.net_pounds_landed}</td>

        </tr>

        <tr>

          <td
            onclick="helper_enable('section_b_math', 'barnacle_weight')"
            class="info"
          >
            Barnacle Weight
          </td>

          <td>${data.barnacle_weight}</td>

        </tr>

        <tr class="total-row">

          <td
            onclick="helper_enable('section_b_math', 'net_pounds_less_barnacles')"
            class="info"
          >
            <strong>Net Pounds (Less Barnacles)</strong>
          </td>

          <td>
            <strong>${data.net_pounds_less_barnacles}</strong>
          </td>

        </tr>

        <tr class="grand-total">

          <td
            onclick="helper_enable('section_b_math', 'average_pan_weight')"
            class="info"
          >
            <strong>Average Weight / Pan</strong>
          </td>

          <td>
            <strong>${data.average_pan_weight.toFixed(1)}</strong>
          </td>

        </tr>

      </tbody>

    </table>
  `;
}

function section_b_clear_data() {

  document
    .querySelectorAll(".section-b-input")
    .forEach(input => {

      input.value = "";

    });

  initialize_results();

}

function section_b_data_is_stale() {

  return (
    section_a_state !==
    section_b_synced_state
  );

}

const section_b = {

  calculate() {

    const input =
      section_b_source_data();

    const result =
      section_b_process_data(input);

    section_b_format_data(result);

    section_b_synced_state =
      section_a_state;

    section_b_active = true;

  }
};

/* Formula Helper Functions */
/* ---------------------------------------------------------------------------------------------------- */

function run_formula(
  formula_key,
  formulas,
  runtime_data
) {

  const formula = formulas[formula_key];

  const dependencies = {};

  formula.depends_on.forEach(key => {

    dependencies[key] =
      runtime_data[key] || 0;

  });

  return formula.calculate(dependencies);
}

function run_formula_sequence(
  formulas,
  runtime_data,
  execution_order = []
) {

  execution_order.forEach(
    formula_key => {

      runtime_data[formula_key] =
        run_formula(
          formula_key,
          formulas,
          runtime_data
        );

    }
  );
}

function round_percent(value) {

  return parseFloat(
    value.toFixed(2)
  );

}

function toggle_results(contentId, iconId) {

  const content =
    document.getElementById(contentId);

  const icon =
    document.getElementById(iconId);

  const collapsing =
    !content.classList.contains("collapsed");

  content.classList.toggle("collapsed");

  if (collapsing) {

    icon.classList.add("collapsed");

  } else {

    icon.classList.remove("collapsed");

  }
}

function format_input_display(input, metadata) {

  if (!metadata?.unit) return;

  const raw =
    input.value.replace(/[^\d.]/g, "");

  if (!raw) {
    input.value = "";
    return;
  }

  input.value =
    `${raw} ${metadata.unit}`;
}

function unformat_input_display(input) {

  input.value =
    input.value.replace(/[^\d.]/g, "");

}

function initialize_inputs() {

  document
    .querySelectorAll(".cat")
    .forEach(input => {

      const key =
        input.dataset.key;

      const metadata =
        math_data.section_a_math_data[key];

      if (!metadata) return;

      input.placeholder = metadata.unit
        ? `${Number(metadata.default).toFixed(metadata.decimals)} ${metadata.unit}`
        : Number(metadata.default).toFixed(metadata.decimals);

      input.addEventListener("focus", () => {

        unformat_input_display(input);

      });

      input.addEventListener("blur", () => {

        format_input_display(input, metadata);

      });

    });

  document
    .querySelectorAll(".section-b-input")
    .forEach(input => {

      const key =
        input.dataset.key;

      const metadata =
        math_data.section_b_math_data[key];

      if (!metadata) return;

      input.placeholder = metadata.unit
        ? `${Number(metadata.default).toFixed(metadata.decimals)} ${metadata.unit}`
        : Number(metadata.default).toFixed(metadata.decimals);

      input.addEventListener("focus", () => {

        unformat_input_display(input);

      });

      input.addEventListener("blur", () => {

        format_input_display(input, metadata);

      });

    });
}

function initialize_results() {

  section_a.calculate();

  section_b.calculate();

}

/* Service Worker Content */
/* ---------------------------------------------------------------------------------------------------- */

initialize_inputs();
initialize_results();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").then(reg => {

    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          // optional early reload (can keep or remove)
          window.location.reload();
        }
      });
    });

    // 🔥 THIS is the important one
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });

  });
}