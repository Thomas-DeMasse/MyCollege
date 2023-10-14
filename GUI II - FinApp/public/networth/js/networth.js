$(document).ready(function(){
  const currentYear = new Date().getFullYear();
  $( function() {
    $( "#datepicker" ).datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat: 'mm/yy',
      setDate: new Date(),
      minDate: new Date(2000, 0, 1),
      yearRange: '2000:' + currentYear
    });
  });
  $("#datepicker").datepicker("setDate", "+5d");
  /*$("#datepicker").datepicker({
    minDate: new Date(2022, 0, 1)
});*/

}) 

var networthglobalvar = null;

// Global variables to easily access the defined parameters
var realEstateButton = document.getElementById("realEstate");
var checkingAccountsButton = document.getElementById("checkingAccounts");
var savingsAccountsButton = document.getElementById("savingsAccounts");
var retirementAccountsButton = document.getElementById("retirementAccounts");
var carsButton = document.getElementById("cars");
var otherAssetsButton = document.getElementById("otherAssets");

var realEstateLoansButton = document.getElementById("realEstateLoans");
var creditCardDebtButton = document.getElementById("creditCardDebt");
var personalLoansButton = document.getElementById("personalLoans");
var carLoansButton = document.getElementById("carLoans");
var studentLoansButton = document.getElementById("StudentLoans");
var otherDebtButton = document.getElementById("otherDebt");

var totalAssetsValueButton = document.getElementById("totalAssetsValue");
var totalLiabilitiesButton = document.getElementById("totalLiabilities");

var netWorthButton = document.getElementById("netWorth");

var image

document.addEventListener("DOMContentLoaded", function () {
  const assetsForm = document.getElementById("assetsForm");
  const liabilitiesForm = document.getElementById("liabilitiesForm");
  const assetsList = document.getElementById("assetsList");
  const liabilitiesList = document.getElementById("liabilitiesList");
  const netWorthElement = document.getElementById("netWorth");

  const assets = [];
  const liabilities = [];

  assetsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const assetName = document.getElementById("assetName").value;
    const assetValue = parseFloat(document.getElementById("assetValue").value);

    if (!assetName || isNaN(assetValue)) {
      alert("Please enter valid asset information.");
      return;
    }

    assets.push({ name: assetName, value: assetValue });
    updateAssetsList();
    updateNetWorth();
    assetsForm.reset();
  });

  liabilitiesForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const liabilityName = document.getElementById("liabilityName").value;
    const liabilityValue = parseFloat(document.getElementById("liabilityValue").value);

    if (!liabilityName || isNaN(liabilityValue)) {
      alert("Please enter valid liability information.");
      return;
    }

    liabilities.push({ name: liabilityName, value: liabilityValue });
    updateLiabilitiesList();
    updateNetWorth();
    liabilitiesForm.reset();
  });

  function updateAssetsList() {
    assetsList.innerHTML = "";
    assets.forEach((asset, index) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.innerHTML = `${asset.name}: $${asset.value.toFixed(2)} <button class="btn btn-sm btn-danger delete-asset" data-index="${index}">Delete</button>`;
      assetsList.appendChild(listItem);
    });
  }

  function updateLiabilitiesList() {
    liabilitiesList.innerHTML = "";
    liabilities.forEach((liability, index) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.innerHTML = `${liability.name}: $${liability.value.toFixed(2)} <button class="btn btn-sm btn-danger delete-liability" data-index="${index}">Delete</button>`;
      liabilitiesList.appendChild(listItem);
    });
  }

  function updateNetWorth() {
    const totalAssets = assets.reduce((total, asset) => total + asset.value, 0);
    const totalLiabilities = liabilities.reduce((total, liability) => total + liability.value, 0);
    const netWorth = totalAssets - totalLiabilities;

    netWorthElement.textContent = `$${netWorth.toFixed(2)}`;
  }

  /*assetsList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-asset")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      assets.splice(index, 1);
      updateAssetsList();
      updateNetWorth();
    }
  });*/

  /*liabilitiesList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-liability")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      liabilities.splice(index, 1);
      updateLiabilitiesList();
      updateNetWorth();
    }
  });*/
});

function calculateNetWorth() {
  let realEstate = parseFloat(document.getElementById("realEstate").value) || 0;
  if (realEstate == 0){realEstateButton.value = "0.00"};
  let checkingAccounts = parseFloat(document.getElementById("checkingAccounts").value) || 0;
  if (checkingAccounts == 0){checkingAccountsButton.value = "0.00"};
  let savingsAccounts = parseFloat(document.getElementById("savingsAccounts").value) || 0;
  if (savingsAccounts == 0){savingsAccountsButton.value = "0.00"};
  let retirementAccounts = parseFloat(document.getElementById("retirementAccounts").value) || 0;
  if (retirementAccounts == 0){retirementAccountsButton.value = "0.00"};
  let cars = parseFloat(document.getElementById("cars").value) || 0;
  if (cars == 0){carsButton.value = "0.00"};
  let otherAssets = parseFloat(document.getElementById("otherAssets").value) || 0;  
  if (otherAssets == 0){otherAssetsButton.value = "0.00"};

  let totalAssets = realEstate + checkingAccounts + savingsAccounts + retirementAccounts + cars + otherAssets;

  let realEstateLoans = parseFloat(document.getElementById("realEstateLoans").value || 0);
  if (realEstateLoans == 0){realEstateLoansButton.value = "0.00"};
  let creditCardDebt = parseFloat(document.getElementById("creditCardDebt").value || 0);
  if (creditCardDebt == 0){creditCardDebtButton.value = "0.00"};
  let personalLoans = parseFloat(document.getElementById("personalLoans").value || 0);
  if (personalLoans == 0){personalLoansButton.value = "0.00"};
  let carLoans = parseFloat(document.getElementById("carLoans").value || 0);
  if (carLoans == 0){carLoansButton.value = "0.00"};
  let studentLoans = parseFloat(document.getElementById("StudentLoans").value || 0);
  if (studentLoans == 0){studentLoansButton.value = "0.00"};
  let otherDebt = parseFloat(document.getElementById("otherDebt").value || 0);
  if (otherDebt == 0){otherDebtButton.value = "0.00"};

  let totalLiabilities = realEstateLoans + creditCardDebt + personalLoans + carLoans + studentLoans + otherDebt;

  let netWorthValue = totalAssets - totalLiabilities;

  document.getElementById("totalAssetsValue").textContent = `$${totalAssets.toFixed(2)}`;
  document.getElementById("totalLiabilities").textContent = `$${totalLiabilities.toFixed(2)}`;
  document.getElementById("netWorth").textContent = `$${netWorthValue.toFixed(2)}`;

  let message = "<b><i>Great Progress!</i></b>";

  if (Math.abs(totalLiabilities / totalAssets) > 2) {
    message = message + "<br><span style='color:red;'>Your debt to asset ratio is above 2! Consider eliminating your high interest debt as fast as possible.</span></br>";
  }
  else if (Math.abs(totalLiabilities / totalAssets) > 1) {
    message = message + "<br>Try to keep your debt to asset ratio below 1 by eliminating some of your debt.</br>";
  }
  else {
    message = message + "<br>You're debt to asset ratio is below 1! Keep up the good work and make sure you do not have any high interst debt.</br>";
  }
  
  document.getElementById("message").innerHTML = message;

}
document.getElementById('CalculateNetworthButton').addEventListener('click', calculateNetWorth);





