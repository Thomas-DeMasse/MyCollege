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
    // this function by firebase, allows us to place if statements
    loginlogoutreference.removeEventListener("click", userSignOut);
    loginlogoutreference.removeEventListener("click", userSignIn);
    
    if (user) {
        loginlogoutreference.innerHTML = "Logout";
        loginlogoutreference.addEventListener("click", userSignOut);
        // Upon login gather unique Google ID to access the database
        googleuniqueuserid = user.uid;
    } else {
        loginlogoutreference.innerHTML = "Login";
        loginlogoutreference.addEventListener("click", userSignIn);
        googleuniqueuserid = null;
    }
});

const userSignIn = async() => {
    signInWithPopup(auth, provider)
    .then((result) => {
        // if suscessfull, "then", get the result
        // from google
        const user = result.user;
        console.log(user);
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

async function FetchDataOfSelectedDay() {
    // Description: Fetches all the data available of the given day (selected from datepicker)
    var tempdatedataparsed = $("#datepicker").val().split("/");
    var year = tempdatedataparsed[1];
    var month = Number(tempdatedataparsed[0]).toString();
    const dbref = ref(db);
    var tempdatedata = "networth/" + googleuniqueuserid.toString() + "/" + year + "/" + month;
    console.log(tempdatedata);
    try {
      let snapshot = await get(child(dbref, tempdatedata));
      if (snapshot.exists()) {
        console.log("Data found in FetchDataOfSelectedDay: ", snapshot.val());
        return snapshot.val();
      } else {
        console.log("Data not found in FetchDataOfSelectedDay");
        return null;
      }
    } catch (error) {
        console.error("Error found in FetchDataOfSelectedDay: ", error);
        return undefined;
    }
}

function GatherAndDisplayCurrentDate(event) {
    event.preventDefault();

    let gatheredData = FetchDataOfSelectedDay();
    gatheredData.then(function(data){
        networthglobalvar = data;
        if (data == null) {
            console.log("data is empty");
            realEstateButton.value = '';
            checkingAccountsButton.value = '';
            savingsAccountsButton.value = '';
            retirementAccountsButton.value = ''
            carsButton.value = '';
            otherAssetsButton.value = '';
            realEstateLoansButton.value = '';
            creditCardDebtButton.value = '';
            personalLoansButton.value = '';
            carLoansButton.value = '';
            studentLoansButton.value = '';
            otherDebtButton.value = '';
            totalAssetsValueButton.innerHTML = '';
            totalLiabilitiesButton.innerHTML = '';
            netWorthButton.innerHTML = '';
            return;
        }
        console.log("Gathered succesfully the data: ", data);
        realEstateButton.value = data["realEstate"]
        checkingAccountsButton.value = data["checkingAccounts"]
        savingsAccountsButton.value = data["savingsAccounts"]
        retirementAccountsButton.value = data["retirementAccounts"];
        carsButton.value = data["cars"]
        otherAssetsButton.value = data["otherAssets"];
        realEstateLoansButton.value = data["realEstateLoans"];
        creditCardDebtButton.value = data["creditCardDebt"];
        personalLoansButton.value = data["personalLoans"];
        carLoansButton.value = data["carLoans"];
        studentLoansButton.value = data["studentLoans"];
        otherDebtButton.value = data["otherDebt"];
        totalAssetsValueButton.innerHTML = data["totalAssetsValue"];
        totalLiabilitiesButton.innerHTML = data["totalLiabilities"];
        netWorthButton.innerHTML = data["netWorth"];

    }).catch(function(error){
        console.log(error);
    });
    
    // save to the backend
    console.log("Updated");
}

$("#datepicker").on("change", function(event) {
    // Description: Upon the value of datepicker chaging, we update the info being display
    console.log("date has changed on networth");
    GatherAndDisplayCurrentDate(event);
});

function SaveNetWorthOfCurrentDate(event) {
    console.log("Saved");
    event.preventDefault();
    var tempdatedataparsed = $("#datepicker").val().split("/");
    if (tempdatedataparsed.length <= 1) {
        // if user has not enter a date... s/he cant add
        // TODO() toast saying to please select a data
        console.log("Please select a date");
        return;
    }
    var temppyear = tempdatedataparsed[1];
    var tempmonth = Number(tempdatedataparsed[0]).toString();

    var tempdatedata = "networth/" + googleuniqueuserid.toString() + "/" + temppyear.toString() + "/" + tempmonth.toString();

    set(ref(db, tempdatedata), {
        realEstate: realEstateButton.value || 0,
        checkingAccounts: checkingAccountsButton.value || 0,
        savingsAccounts: savingsAccountsButton.value || 0,
        retirementAccounts: retirementAccountsButton.value || 0,
        cars: carsButton.value || 0,
        otherAssets: otherAssetsButton.value || 0,
        realEstateLoans: realEstateLoansButton.value || 0,
        creditCardDebt: creditCardDebtButton.value || 0,
        personalLoans: personalLoansButton.value || 0,
        carLoans: carLoansButton.value || 0,
        studentLoans: studentLoansButton.value || 0,
        otherDebt: otherDebtButton.value || 0,
        totalAssetsValue: totalAssetsValueButton.innerHTML || 0,
        totalLiabilities: totalLiabilitiesButton.innerHTML || 0,
        netWorth: netWorthButton.innerHTML || 0
    }).then (()=> {
        console.log("Networth Data added sucessfully!");
    }).catch ((error) => {
        console.log("Networth Data added failed: ", error);
    })

}

$("#SaveNetWorthToCurrentDay").click(SaveNetWorthOfCurrentDate);
