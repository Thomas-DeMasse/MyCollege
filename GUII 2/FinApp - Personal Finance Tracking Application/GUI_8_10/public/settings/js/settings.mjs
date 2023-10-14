// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, set, get, update, remove, ref, child} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getStorage, ref as firestoreREF, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

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
const storage = getStorage();
const storageRef = firestoreREF(storage);

const loginlogoutreference = document.getElementById("LoginLogOut");
const navbaritemstoberemoveduponlogin = null;
var googleuniqueuserid = null;
var user = null;

onAuthStateChanged(auth, (user) => {
    // this function by firebase, allows us to place if statements
    loginlogoutreference.removeEventListener("click", userSignOut);
    loginlogoutreference.removeEventListener("click", userSignIn);
    
    if (user) {
        loginlogoutreference.innerHTML = "Logout";
        loginlogoutreference.addEventListener("click", userSignOut);
        // Upon login gather unique Google ID to access the database
        googleuniqueuserid = user.uid;
        console.log("user is signed in in settings: ", googleuniqueuserid);
        user = auth.currentUser;
        GatherAndDisplayCurrentData();
    } else {
        loginlogoutreference.innerHTML = "Login";
        loginlogoutreference.addEventListener("click", userSignIn);
        googleuniqueuserid = null;
        user = null;
        fullNameInputButton.value = '';
        emailInputButton.value = '';
        ageInputButton.value = '';
        incomeInputButton.value = '';
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

function InsertUserData () {
    // description: given name, category, day, create an entry in the database
    // note that the date is the one given by the datepicker
    // parameter: string name, string category and numerical cost and id (UnixTime)
    settingsglobalvar = googleuniqueuserid;
    var tempdatedata = "people/" + googleuniqueuserid;

    set(ref(db, tempdatedata), {
        fullName: fullNameInputButton.value,
        email: emailInputButton.value,
        age: ageInputButton.value,
        income: incomeInputButton.value
    }).then (()=> {
        console.log("Expenses Data added sucessfully!");
        // TODO upon success make a toast letting the user know its been successfully added
    }).catch ((error) => {
        console.log("Expenses Data added failed: ", error);
    })
};

async function FetchUserData() {
    // Description: Fetches all the users data

    // firestore database for image
    // https://www.youtube.com/watch?v=ll00ITa6r9s&ab_channel=NSCODE
    
    // realtime databse
    var tempdatedata = "people/" + googleuniqueuserid;
    const dbref = ref(db);
    try {
      let snapshot = await get(child(dbref, tempdatedata));
      
      if (snapshot.exists()) {
        console.log("Data found in FetchUserData: ", snapshot.val());
        return snapshot.val();
      } else {
        console.log("Data not found in FetchUserData");
        return null;
      }
    } catch (error) {
        console.error("Error found in FetchUserData: ", error);
        return undefined;
    }
  }

function GatherAndDisplayCurrentData() {
    // Description: Gather all data from the back-end from the current date.
    // The data is then display within accordion items.

    // fetch the data if they exist
    let gatheredData = FetchUserData();
    gatheredData.then(function(data){
        if (data == null) {
            console.log("Data was empty");
            return;
        }
        fullNameInputButton.value = data["fullName"];
        emailInputButton.value = data["email"];
        ageInputButton.value = data["age"];
        incomeInputButton.value = data["income"];

        console.log("Gathered UserData succesfully the data: ", data);
    }).catch(function(error){
        console.log("An error has occured with setting's FetchUserData: ", error);
    })
}

$("#save-changes").click(function(event){
    // Description: The addbutton will trigger the creation of a new accordion
    // object at the button of all the other accordion
    event.preventDefault();
    InsertUserData();
    GatherAndDisplayCurrentData();
  });

  