function calculateTax() {
  const year = document.getElementById("year").value;
  const rentIncomePerMonth = parseFloat(
    document.getElementById("rentIncome").value,
  );

  if (isNaN(rentIncomePerMonth) || rentIncomePerMonth <= 0) {
    document.getElementById("taxResult").innerHTML =
      `<span style="color: red;">Please enter a valid income amount!</span>`;
    showResult();
    return;
  }

  let taxRate = 0;
  let deductionPercentage = 0;
  let minimumBrutoSalary = 0;
  let healthTax = 0;

  // Define tax rates, deductions, and minimum salary per year
  const taxSettings = {
    2025: { taxRate: 10, deductionPercentage: 0.2, minimumBrutoSalary: 4050 },
    2024: { taxRate: 10, deductionPercentage: 0.2, minimumBrutoSalary: 3300 },
    2023: { taxRate: 10, deductionPercentage: 0, minimumBrutoSalary: 3000 },
    2022: { taxRate: 6, deductionPercentage: 0, minimumBrutoSalary: 3060 },
    2021: { taxRate: 6, deductionPercentage: 0, minimumBrutoSalary: 2760 },
    2020: { taxRate: 6, deductionPercentage: 0, minimumBrutoSalary: 2676 },
  };

  if (taxSettings[year]) {
    taxRate = taxSettings[year].taxRate;
    deductionPercentage = taxSettings[year].deductionPercentage;
    minimumBrutoSalary = taxSettings[year].minimumBrutoSalary;
  }

  // Calculate gross yearly income (before deductions)
  let grossYearlyIncome = rentIncomePerMonth * 12;

  // Calculate deduction amount
  let deductionAmountPerMonth = rentIncomePerMonth * deductionPercentage;
  let deductionAmountPerYear = deductionAmountPerMonth * 12;

  // Calculate taxable yearly income (after deductions)
  let taxableIncomePerYear = grossYearlyIncome - deductionAmountPerYear;
  let taxAmountPerYear = (taxableIncomePerYear * taxRate) / 100;
  let taxAmountPerMonth = taxAmountPerYear / 12;

  // Health tax calculation: Apply only if annual income exceeds minimum thresholds
  if (year >= 2023) {
    let healthTaxComparisonMin = minimumBrutoSalary * 6;
    let healthTaxComparisonMed = minimumBrutoSalary * 12;
    let healthTaxComparisonMax = minimumBrutoSalary * 24;

    if (
      taxableIncomePerYear >= healthTaxComparisonMin &&
      taxableIncomePerYear < healthTaxComparisonMed
    ) {
      healthTax = (minimumBrutoSalary * 6 * 10) / 100;
    } else if (
      taxableIncomePerYear >= healthTaxComparisonMed &&
      taxableIncomePerYear < healthTaxComparisonMax
    ) {
      healthTax = (minimumBrutoSalary * 12 * 10) / 100;
    } else if (taxableIncomePerYear >= healthTaxComparisonMax) {
      healthTax = (minimumBrutoSalary * 24 * 10) / 100;
    }
  } else {
    let healthTaxComparisonValue = minimumBrutoSalary * 12;
    if (taxableIncomePerYear > healthTaxComparisonValue) {
      healthTax = (minimumBrutoSalary * 12 * 10) / 100;
    }
  }

  let healthTaxPerMonth = healthTax / 12;

  // ✅ Fix Net Income Calculation
  let netAmountPerYear = grossYearlyIncome - taxAmountPerYear - healthTax;
  let netAmountPerMonth = netAmountPerYear / 12;

  // Display results
  document.getElementById("taxResult").innerHTML = `
        <div>Gross Yearly Income: <span class="amount-box">${grossYearlyIncome.toFixed(2)}</span> Lei</div>
        <div>Yearly Deduction: <span class="amount-box">${deductionAmountPerYear.toFixed(2)}</span> Lei</div>
        <div>Yearly Taxable Income: <span class="amount-box">${taxableIncomePerYear.toFixed(2)}</span> Lei</div>
        <div>Yearly Tax Amount: <span class="amount-box">${taxAmountPerYear.toFixed(2)}</span> Lei</div>
        <div>Monthly Tax Amount: <span class="amount-box">${taxAmountPerMonth.toFixed(2)}</span> Lei</div>
        <div>Yearly CASS Contributions (Health Tax): <span class="amount-box">${healthTax.toFixed(2)}</span> Lei</div>
        <div>Monthly CASS Contributions (Health Tax): <span class="amount-box">${healthTaxPerMonth.toFixed(2)}</span> Lei</div>
        <div>Net Yearly Income: <span class="amount-box">${netAmountPerYear.toFixed(2)}</span> Lei</div>
        <div>Net Monthly Income: <span class="amount-box">${netAmountPerMonth.toFixed(2)}</span> Lei</div>
    `;
  showResult();
}

// Function to display result box
function showResult() {
  var resultBox = document.querySelector(".result");
  resultBox.classList.add("show");
}

// Add Contact Form Handling
document
  .getElementById("contactForm")
  ?.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const formData = {
      name,
      email,
      message,
    };

    // Send the data using Formspree
    fetch("https://formspree.io/f/mwpoknvb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          alert(
            `Thank you for your message, ${name}! We'll get back to you soon.`,
          );
          document.getElementById("contactForm").reset();
        } else {
          alert("Oops! Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("Error sending message. Please try again.");
      });
  });
