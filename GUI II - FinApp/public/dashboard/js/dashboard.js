/*document.addEventListener("DOMContentLoaded", function () {
  const goalCountElement = document.getElementById("goalCount");

  const savedGoals = JSON.parse(localStorage.getItem("goals")) || [];

  goalCountElement.textContent = savedGoals.length.toString();


});*/

const labelarray = ["housing", "transportation", "food", "insurance", "shopping", "medical", "education", "personal", "other "]

var dashboardglobalvar = null;

const monthlyData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
  datasets: [{
    label: 'Monthy Data',
    data: [24000, 23000, 55421, 47421, 59421, 61238, 71000, 74500]
  }]
}

var ExpensesYearSelectInput = document.getElementById('yearSelect');
var ExpensesMonthSelectInput = document.getElementById('dateSelect');
var NetworthYearSelectInput = document.getElementById('customYearSelect');

var myChart1 = document.getElementById('myChart1').getContext('2d');
var customChart1 = new Chart(myChart1, {
    type: 'pie',
    data: {
  
      labels: ["housing", "transportation", "food", "insurance", "shopping", "medical", "education", "personal", "other"],
      datasets: [{
        label: 'Expenses',
        data: [0,0,0,0,4,0,65,0,0]
      }]
    },
    options:{}
  });


  var myChart = document.getElementById('myChart').getContext('2d');
  var customChart = new Chart(myChart, {
    type: 'line',
    data: {
      labels: ["December", "January"],
      datasets: [{
        label: 'Net Worth',
        data: [123, 453],
      }]
    },
    options:{}
  });


/*let myChart = document.getElementById('myChart').getContext('2d');

let customChart = new Chart(myChart, {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'Net Worth',
      data: [
        10500,
        12000,
        9456,
        10400,
        15421,
        15000,
        14500,
        19000,
        20000,
        23500,
        21213,
        26400
      ],
      backgroundColor: 'orange'
      backgroundColor: [
        'pink',
        'lightblue',
        'orange',
        'yellow'
      ],
      borderWidth: 2,
      borderColor: 'grey',
      hoverBorderWidth:3,
      hoverBorderColor: 'black'
    }]
  },
  options:{}
});*/


//var globalarraydashboard = [0, 0, 0, 0, 0, 0, 0, 0];

//let myChart1 = document.getElementById('myChart1').getContext('2d');

/*let customChart1 = new Chart(myChart1, {
  type: 'pie',
  data: {

    labels: ["housing", "transportation", "food", "insurance", "shopping", "medical", "education", "personal", "other "],
    datasets: [{
      label: 'Expenses',
      data: globalarraydashboard
    }]
  },
  options:{}
});
*/