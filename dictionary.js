/* Section A Math (data) */
/* ---------------------------------------------------------------------------------------------------- */

const section_a_math_data = {

    premium: {},
    standard: {},
    critical_weak: {},
    soft_shell: {},
    dead: {},
    under_sized: {},
    barnacle_tubeworm: {},
    gross_pounds_graded: {}

};

const section_a_math = {

    percent_premium: {

      title: "% Premium",

      depends_on: [
        "premium",
        "total_net_lbs_graded"
      ],

      formula: "A ÷ B × 100",

      variables: {
        A: "Total Premium Weight",
        B: "Total Net Lbs. Graded"
      },

      help: "Calculates the percentage of premium crab from the total net pounds graded.",

      calculate: ({
        premium = 0,
        total_net_lbs_graded = 0
      }) =>
        total_net_lbs_graded > 0
          ? (premium / total_net_lbs_graded) * 100
          : 0
    },

    percent_standard: {

      title: "% Standard",

      depends_on: [
        "standard",
        "total_net_lbs_graded"
      ],

      formula: "A ÷ B × 100",

      variables: {
        A: "Total Standard Weight",
        B: "Total Net Lbs. Graded"
      },

      help: "Calculates the percentage of standard crab from the total net pounds graded.",

      calculate: ({
        standard = 0,
        total_net_lbs_graded = 0
      }) =>
        total_net_lbs_graded > 0
          ? (standard / total_net_lbs_graded) * 100
          : 0
    },

    percent_critical_weak: {

      title: "% Critical Weak",

      depends_on: [
        "critical_weak",
        "total_net_lbs_graded"
      ],

      formula: "A ÷ B × 100",

      variables: {
        A: "Total Critical Weak Weight",
        B: "Total Net Lbs. Graded"
      },

      help: "Calculates the percentage of critical weak crab from the total net pounds graded.",

      calculate: ({
        critical_weak = 0,
        total_net_lbs_graded = 0
      }) =>
        total_net_lbs_graded > 0
          ? (critical_weak / total_net_lbs_graded) * 100
          : 0
    },

    percent_soft_shell: {

      title: "% Soft Shell",

      depends_on: [
        "soft_shell",
        "total_net_lbs_graded"
      ],

      formula: "A ÷ B × 100",

      variables: {
        A: "Total Soft Shell Weight",
        B: "Total Net Lbs. Graded"
      },

      help: "Calculates the percentage of soft shell crab from the total net pounds graded.",

      calculate: ({
        soft_shell = 0,
        total_net_lbs_graded = 0
      }) =>
        total_net_lbs_graded > 0
          ? (soft_shell / total_net_lbs_graded) * 100
          : 0
    },

    percent_dead: {

      title: "% Dead",

      depends_on: [
        "dead",
        "total_net_lbs_graded"
      ],

      formula: "A ÷ B × 100",

      variables: {
        A: "Total Dead Weight",
        B: "Total Net Lbs. Graded"
      },

      help: "Calculates the percentage of dead crab from the total net pounds graded.",

      calculate: ({
        dead = 0,
        total_net_lbs_graded = 0
      }) =>
        total_net_lbs_graded > 0
          ? (dead / total_net_lbs_graded) * 100
          : 0
    },

    percent_under_sized: {

      title: "% Under Sized",

      depends_on: [
        "under_sized",
        "total_net_lbs_graded"
      ],

      formula: "A ÷ B × 100",

      variables: {
        A: "Total Under Sized Weight",
        B: "Total Net Lbs. Graded"
      },

      help: "Calculates the percentage of under sized crab from the total net pounds graded.",

      calculate: ({
        under_sized = 0,
        total_net_lbs_graded = 0
      }) =>
        total_net_lbs_graded > 0
          ? (under_sized / total_net_lbs_graded) * 100
          : 0
    },

    percent_barnacle_tubeworm: {

      title: "% Barnacle & Tubeworm",

      depends_on: [
        "barnacle_tubeworm",
        "total_net_lbs_graded"
      ],

      formula: "A ÷ B × 100",

      variables: {
        A: "Total Barnacle & Tubeworm Weight",
        B: "Total Net Lbs. Graded"
      },

      help: "Calculates the percentage of barnacle and tubeworm from the total net pounds graded.",

      calculate: ({
        barnacle_tubeworm = 0,
        total_net_lbs_graded = 0
      }) =>
        total_net_lbs_graded > 0
          ? (barnacle_tubeworm / total_net_lbs_graded) * 100
          : 0
    },

    percent_size_premium: {

      title: "% Premium (by Size)",

      depends_on: [
        "premium",
        "standard"
      ],

      formula: "A ÷ (Total Premium & Standard Weight) × 100",

      variables: {
        A: "Total Premium Weight"
      },

      help: "Calculates the percentage of premium crab by size (not including rejects).",

      calculate: ({
        premium = 0,
        standard = 0
      }) =>
        (premium + standard) > 0
          ? (premium / (premium + standard)) * 100
          : 0
    },

    percent_size_standard: {

      title: "% Standard (by Size)",

      depends_on: [
        "premium",
        "standard"
      ],

      formula: "A ÷ (Total Premium & Standard Weight) × 100",

      variables: {
        A: "Total Standard Weight"
      },

      help: "Calculates the percentage of standard crab by size (not including rejects).",

      calculate: ({
        premium = 0,
        standard = 0
      }) =>
        (premium + standard) > 0
          ? (standard / (premium + standard)) * 100
          : 0
    },

    percent_reject: {

      title: "% Reject",

      depends_on: [
        "percent_critical_weak",
        "percent_soft_shell",
        "percent_dead",
        "percent_under_sized",
        "percent_barnacle_tubeworm"
      ],

      formula: "Critical Weak % + Soft Shell % + Dead % + Under Sized % + Barnacle %",

      variables: {},

      help: "Calculates the sum of all graded crab reject percentages.",

      calculate: ({
        percent_critical_weak = 0,
        percent_soft_shell = 0,
        percent_dead = 0,
        percent_under_sized = 0,
        percent_barnacle_tubeworm = 0
      }) =>
        percent_critical_weak +
        percent_soft_shell +
        percent_dead +
        percent_under_sized +
        percent_barnacle_tubeworm
    },

    percent_lbs_graded: {

      title: "% Lbs. Graded",

      depends_on: [
        "percent_premium",
        "percent_standard",
        "percent_critical_weak",
        "percent_soft_shell",
        "percent_dead",
        "percent_under_sized",
        "percent_barnacle_tubeworm"
      ],

      formula: "Premium % + Standard % + Critical Weak % + Soft Shell % + Dead % + Under Sized % + Barnacle %",

      variables: {},

      help: "Calculates the sum of all graded crab percentages. (not including Total Rejects).",

      calculate: ({
        percent_premium = 0,
        percent_standard = 0,
        percent_critical_weak = 0,
        percent_soft_shell = 0,
        percent_dead = 0,
        percent_under_sized = 0,
        percent_barnacle_tubeworm = 0
      }) =>
        percent_premium +
        percent_standard +
        percent_critical_weak +
        percent_soft_shell +
        percent_dead +
        percent_under_sized +
        percent_barnacle_tubeworm
    },

    total_reject: {

      title: "Total Reject",

      depends_on: [
        "critical_weak",
        "soft_shell",
        "dead",
        "under_sized",
        "barnacle_tubeworm"
      ],

      formula: "Critical Weak + Soft Shell + Dead + Under Sized + Barnacle",

      variables: {},

      help: "Calculates the sum of all graded crab reject weights.",

      calculate: ({
        critical_weak = 0,
        soft_shell = 0,
        dead = 0,
        under_sized = 0,
        barnacle_tubeworm = 0
      }) =>
        critical_weak +
        soft_shell +
        dead +
        under_sized +
        barnacle_tubeworm
    },

    total_net_lbs_graded: {

      title: "Total Net Lbs. Graded",

      depends_on: [
        "premium",
        "standard",
        "critical_weak",
        "soft_shell",
        "dead",
        "under_sized",
        "barnacle_tubeworm"
      ],

      formula: "Premium + Standard + Critical Weak + Soft Shell + Dead + Under Sized + Barnacle",

      variables: {},

      help: "Calculates the sum of all graded crab weights. (not including Total Rejects).",

      calculate: ({
        premium = 0,
        standard = 0,
        critical_weak = 0,
        soft_shell = 0,
        dead = 0,
        under_sized = 0,
        barnacle_tubeworm = 0
      }) =>
        premium +
        standard +
        critical_weak +
        soft_shell +
        dead +
        under_sized +
        barnacle_tubeworm
    }

};

/* Section B Math (data) */
/* ---------------------------------------------------------------------------------------------------- */

const section_b_math_data = {

    gross_pounds_landed: {},
    total_number_of_pans: {},
    total_gross_lbs_graded: {}

};

const section_b_math = {

    percent_crab: {

      title: "% of Crab",

      depends_on: [
        "total_net_lbs_graded",
        "total_gross_lbs_graded"
      ],

      formula: "A ÷ B × 100",

      variables: {
        A: "Total Net Lbs. Graded",
        B: "Total Gross Lbs. Graded"
      },

      help: "Calculates the percentage of crab from the gross pounds graded.",

      calculate: ({
        total_net_lbs_graded = 0,
        total_gross_lbs_graded = 0
      }) =>
        total_gross_lbs_graded > 0
          ? (total_net_lbs_graded / total_gross_lbs_graded) * 100
          : 0
    },

    net_pounds_landed: {

      title: "Net Pounds Landed",

      depends_on: [
        "gross_pounds_landed",
        "percent_crab"
      ],

      formula: "A × (B ÷ 100)",

      variables: {
        A: "Gross Lbs. Landed",
        B: "% of Crab"
      },

      help: "Calculates the estimated weight of crab landed using the percentage of crab.",

      calculate: ({
        gross_pounds_landed = 0,
        percent_crab = 0
      }) =>
        Math.round(
          gross_pounds_landed *
          (percent_crab / 100)
        )
    },

    barnacle_weight: {

      title: "Barnacle Weight",

      depends_on: [
        "net_pounds_landed",
        "percent_barnacle_tubeworm"
      ],

      formula: "(A × 0.24 × B) ÷ 100",

      variables: {
        A: "Net Lbs. Landed",
        B: "Barnacle & Tubeworm %"
      },

      help: "Calculates the estimated weight of barnacles landed using the percentage of barnacles and tubeworm.",

      calculate: ({
        net_pounds_landed = 0,
        percent_barnacle_tubeworm = 0
      }) =>
        Math.round(
          net_pounds_landed *
          0.24 *
          (percent_barnacle_tubeworm / 100)
        )
    },

    net_pounds_less_barnacles: {

      title: "Net Pounds (Less Barnacles)",

      depends_on: [
        "net_pounds_landed",
        "barnacle_weight"
      ],

      formula: "A - B",

      variables: {
        A: "Net Lbs. Landed",
        B: "Barnacle Weight"
      },

      help: "Calculates the total net pounds landed less the barnacle and tubeworm weight.",

      calculate: ({
        net_pounds_landed = 0,
        barnacle_weight = 0
      }) =>
        net_pounds_landed - barnacle_weight
    },

    average_pan_weight: {

      title: "Average Weight / Pan",

      depends_on: [
        "gross_pounds_landed",
        "total_number_of_pans"
      ],

      formula: "A ÷ B",

      variables: {
        A: "Gross Lbs. Landed",
        B: "Total # of Pans"
      },

      help: "Calculates the average weight per pan (a weight greater than 50 lbs. is considered overfilled).",

      calculate: ({
        gross_pounds_landed = 0,
        total_number_of_pans = 0
      }) =>
        total_number_of_pans > 0
          ? gross_pounds_landed / total_number_of_pans
          : 0
    }

};

/* Math Data (for Reference) */
/* ---------------------------------------------------------------------------------------------------- */

const math = {

  section_a_math,
  section_b_math

};

const math_data = {

  section_a_math_data,
  section_b_math_data

};