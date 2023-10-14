// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, set, get, update, remove, ref, child} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAcuHnPgtP6CqShJT7lncoYOM_qii2tW4",
    authDomain: "financialappgui2.firebaseapp.com",
    projectId: "financialappgui2",
    storageBucket: "financialappgui2.appspot.com",
    messagingSenderId: "628533819433",
    appId: "1:628533819433:web:1746a184a788dbe2344438",
    measurementId: "G-RB5GYRE5J3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase();
const provider = new GoogleAuthProvider();

const loginlogoutreference = document.getElementById("LoginLogOut");
const navbaritemstoberemoveduponlogin = null;
var googleuniqueuserid = null;


onAuthStateChanged(auth, (user) => {
    
    loginlogoutreference.removeEventListener("click", userSignOut);
    loginlogoutreference.removeEventListener("click", userSignIn);
    // this function by firebase, allows us to place if statements
    if (user) {
        loginlogoutreference.innerHTML = "Logout";
        loginlogoutreference.addEventListener("click", userSignOut);
        // Upon login gather unique Google ID to access the database
        googleuniqueuserid = user.uid;
        GatherYearlyAndMonthlyExpenses(new Date().getFullYear(), parseInt(new Date().getMonth()) + 1);
        GatherYearlyNetWorthData(new Date().getFullYear());

    } else {
        loginlogoutreference.innerHTML = "Login";
        googleuniqueuserid = null;
        loginlogoutreference.addEventListener("click", userSignIn);
    }
});

const userSignIn = async() => {
    signInWithPopup(auth, provider)
    .then((result) => {
        // if suscessfull, "then", get the result
        // from google
        const user = result.user;
        //console.log(user);
    }).catch((error) => {
        // if un-sucessfull, "catch", the error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
    });
};

const userSignOut = async() => {
    signOut(auth).then(() => {
        console.log("user has sign out");
    }).catch((error) => {
        console.log("an signout error has occur: ", error);
    });
}


async function FetchTheData(path){
    // Description: Fetches all the data available of the given pth
    const dbref = ref(db);
    try {
      let snapshot = await get(child(dbref, path));
      
      if (snapshot.exists()) {
        //console.log("Data found in FetchDataOfSelectedDay: ", snapshot.val());
        return snapshot.val();
      } else {
        //console.log("Data not found in FetchDataOfSelectedDay");
        return null;
      }
    } catch (error) {
        //console.error("Error found in FetchDataOfSelectedDay: ", error);
        return undefined;
    }
}

function GatherYearlyAndMonthlyExpenses(year, month) {
    let p = "expenses/" + googleuniqueuserid + "/" + year.toString() + "/" + month.toString();
    let r = FetchTheData(p);
    var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let jsondata = {
        "housing": 0,
        "transportation" : 1,
        "food" : 2,
        "insurance" : 3,
        "shopping": 4,
        "medical": 5,
        "education": 6,
        "personal": 7,
        "other": 8
    };

    r.then(function(data){
        if (data == null) {
            customChart1.data.datasets[0].data = arr;
            customChart1.update();
            return null;
        }
        let monthkeys = Object.keys(data);
        for (let i = 0; i < monthkeys.length; i++) {
            let daykeys = Object.keys(data[monthkeys[i]]);
            for (let j = 0; j < daykeys.length; j++) {
                let currentItem = data[monthkeys[i]][daykeys[j]];
                arr[jsondata[currentItem["Category"]]] += parseInt(currentItem["Cost"]);

            }
        }
        console.log(arr, customChart1);
        customChart1.data.datasets[0].data = arr;
        customChart1.update();

    }).catch(function(error){
        console.log("An error has occured in GatherMonthlyData", error);
    })
}

ExpensesYearSelectInput.addEventListener("change", function(){
    console.log("dropdown YEAR changed: ", ExpensesYearSelectInput.value, parseInt(ExpensesMonthSelectInput.value)+1);
    GatherYearlyAndMonthlyExpenses( ExpensesYearSelectInput.value, parseInt(ExpensesMonthSelectInput.value)+1)
})

ExpensesMonthSelectInput.addEventListener("change", function(){
    console.log("dropdown MONTH changed", ExpensesYearSelectInput.value, parseInt(ExpensesMonthSelectInput.value)+1);
    GatherYearlyAndMonthlyExpenses( ExpensesYearSelectInput.value, parseInt(ExpensesMonthSelectInput.value)+1)
})

function GatherYearlyNetWorthData(year) {
    let p = "networth/" + googleuniqueuserid + "/" + year.toString();
    let r = FetchTheData(p);
    let numbertomonth = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    };

    r.then(function(data){
        console.log(year,"asd:", data);
        let montharr = [];
        let valuearr = [];
        console.log(data);
        console.log(montharr);
        console.log(valuearr);
        if (data == null) {
            customChart.data.labels = montharr;
            customChart.data.datasets[0].data = valuearr;
            customChart.update();
            return null;
        }
        let monthkeys = Object.keys(data);
        for (let i = 0; i < monthkeys.length; i++) {
            let net = data[monthkeys[i]]["netWorth"];
            if (net[0] == '$'){
                net = net.slice(1);
            }
            net = parseFloat(net);
            valuearr.push(net);
            montharr.push(numbertomonth[monthkeys[i]]);
            console.log(net)
        }
        customChart.data.labels = montharr;
        customChart.data.datasets[0].data = valuearr;
        customChart.update();
   
        console.log("updated");

    }).catch(function(error){
        console.log("An error has occured in GatherMonthlyData: ", error);
    })
}

NetworthYearSelectInput.addEventListener("change", function(){
    console.log("dropdown YEAR NETWORTH changed",  parseInt(NetworthYearSelectInput.value));
    GatherYearlyNetWorthData(parseInt(NetworthYearSelectInput.value));
})