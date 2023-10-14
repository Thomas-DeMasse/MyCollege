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
        // TODO() unhighlight after implemented
        removeallaccordiotitems();
        GatherAndDisplayGoalData();

    } else {
        loginlogoutreference.innerHTML = "Login";
        googleuniqueuserid = null;
        removeallaccordiotitems()
        loginlogoutreference.addEventListener("click", userSignIn);
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


async function FetchUserData() {
    // Description: Fetches all the data available of the given day (selected from datepicker)
    const dbref = ref(db);
    var tempdatedata = "goals/" + googleuniqueuserid.toString();
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

function GatherAndDisplayGoalData() {
    // Description: Gather all data from the back-end from the current date.
    // The data is then display within accordion items.
    console.log("Gather gosl data");

    // fetch the data if they exist
    let gatheredData = FetchUserData();
    gatheredData.then(function(data){
        if (data == null) {
            console.log("Data was empty");
            return;
        }
        let arrofkeys = Object.keys(data);
        // loop through all the data
        for (let i = 0; i < arrofkeys.length; i++) {
            let k = arrofkeys[i];
            let n = data[k]["Name"];
            let d = data[k]["Date"];
            let a = data[k]["Amount"];
            //console.log(n, a, d, k);
            // create a button object for every daya inputed.
            CreateANewAccordion(n, a, d, k, 0);
        }

        /*fullNameInputButton.value = data["fullName"];
        emailInputButton.value = data["email"];
        ageInputButton.value = data["age"];
        incomeInputButton.value = data["income"];*/

        console.log("Gathered UserData succesfully the data: ", data);
    }).catch(function(error){
        console.log("An error has occured with setting's FetchUserData: ", error);
    })
}

function InsertGivenDataGoals (name_, goalAmount_, givendate_, id) {
    // description: given name, category, day, create an entry in the database
    // note that the date is the one given by the datepicker
    // parameter: string name, string category and numerical cost and id (UnixTime)
    console.log("Within InsertGivenDataGoals:", name_, goalAmount_, givendate_, id)
    if (id == null) {
        id = Date.now();
    }

    var tempdatedata = "goals/" + googleuniqueuserid.toString() + "/" + id;

    set(ref(db, tempdatedata), {
        Name: name_,
        Amount: goalAmount_,
        Date: givendate_
    }).then (()=> {
        console.log("Expenses Data added sucessfully!");
    }).catch ((error) => {
        console.log("Expenses Data added failed: ", error);
    })
};

function submitbuttonfunction(event) {
    // helper function to submit
    // Description: Each accordion submit/update button will trigger this fucntion
    // causing it to submit/update data in the database
    // it will also update the name of the accordion button to reflect change
    // in value
    event.preventDefault();
    console.log(event.data.param1);
    var name = $("#" + event.data.param1)[0].fname.value;
    var cost = $("#" + event.data.param1)[0].fgoalAmount.value;
    var givendate = $("#" + event.data.param1)[0].goalDate.value;
    console.log("TODO() submitbuttonfunction", name, cost, givendate, event.data.param2);
    InsertGivenDataGoals(name, cost, givendate, event.data.param2);
    // update the title onced saved
    $("#summary" + event.data.param2).html(name);
}





function CreateANewAccordion(name_ = "Un", goalAmount_ = "0.0", dategiven_ = null, id = null, saveornot = 1) {
    console.log("CreateANewAccordion requested", name_, goalAmount_, dategiven_, id, saveornot);
    var tempdatedataparsed = $("#goalDate")[0].value.split('-');
    if (dategiven_ == null) {
        if (tempdatedataparsed.length <= 1) {
            // TODO() toast saying to please select a data
        
        
            return
        }
        return;
    }
    if (id == null) {
        id = Date.now().toString();
    }

    
    // define the accordion item
    var newAccordian = '<div class="accordion-item" data-internalid = "'+ id +'" id="'+ id +'">' +
                    '<h2 class="accordion-header" id="headingOne' + id +'"><button id="accordiontitlebutton'+id +
                    '"class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne'+ id+
                    '" aria-expanded="true" aria-controls="collapseOne' + id+'">'+ '<div class="form-check">'+
                    '<input class="form-check-input tocloseaccordionitems" data-internalid = "'+ id + '"type="checkbox" value="" id="flexCheckDefault'+id+'">'+
                    '<label class="form-check-label" for="flexCheckDefault'+id+'"></label></div><div id="summary'+ id +'">' + name_ +'</div></button></h2>'
                    + '<div id="collapseOne' + id + '" class="accordion-collapse collapse" aria-labelledby="headingOne' + id +
                    '" data-bs-parent="#accordionExample">' 
                    + '<div class="accordion-body">' +

                   '<form id="'+ 'form' + id + '"><label for="fname">Goal Name:</label><br>' +
                   '<input type="text" id="fname" name="fname" value="'+ name_ +'"><br>' +


                   '<br><label for="lname">Goal Amount:</label><br>' + 
                   '<input type="number" placeholder="0" id="fgoalAmount" name="fgoalAmount" value="'+ goalAmount_ +'"><br><br>' + 
                   
                   // TODO() insert date
                   '<small class="form-text text-muted"> When the Goal is added</small>' +
                   '<input type="date" class="form-control" id="goalDate" value = "' + dategiven_ + '"required>' +

                   '<br><input type="submit" value="Save" id="submitbutton'+ id+'"></form>'

                   ;

    // add the newly created accordion into 
    $('#accordionExample').append(newAccordian);
    // TODO automatically update the database for the user
    if (saveornot == 1) {
        InsertGivenDataGoals(name_, goalAmount_, dategiven_ , id);
    }

    // TODO() bind update/save function inside each accordion items
    // https://stackoverflow.com/questions/3273350/jquerys-click-pass-parameters-to-user-function
    $("#" + "submitbutton" + id.toString()).click({param1: "form" + id.toString(), param2: id}, submitbuttonfunction);
    $("#" + "submitbutton" + id.toString()).click(function() {
        var toastContainer = '<div class="toast-container position-fixed top-0 end-0 p-3" id="saveChangesToastContainer">' +
            '<div id="successToast" class="toast bg-success text-white" role="alert" aria-live="assertive" aria-atomic="true">' +
            '<div class="toast-header">' +
            '<strong class="me-auto">Success</strong>' +
            '<small>Just now</small>' +
            '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
            '</div>' +
            '<div class="toast-body">' +
            'Goal Saved Successfully!' +
            '</div>' +
            '</div>' +
            '</div>';
    
       
        $('body').append(toastContainer);
    
        
        var toast = new bootstrap.Toast(document.getElementById('successToast'));
        toast.show();
    });

}

$("#addbutton").click(function() {
    var goalName = goalNameInput.value.trim();
    var goalAmount = goalAmountInput.value.trim();
    var goalDate = goalDateInput.value.trim();
    
    if (goalName && goalAmount && goalDate) {
        CreateANewAccordion(goalName, goalAmount, goalDate);
        $("#goalForm")[0].reset();

        var successToastContainer = '<div class="toast-container position-fixed top-0 end-0 p-3" id="addSuccessToastContainer">' +
            '<div id="addSuccessToast" class="toast bg-primary text-white" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true">' +
            '<div class="toast-header">' +
            '<strong class="me-auto">Success</strong>' +
            '<small>Just now</small>' +
            '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
            '</div>' +
            '<div class="toast-body">' +
            'New Goal Added Successfully!' +
            '</div>' +
            '</div>' +
            '</div>';

        $('body').append(successToastContainer);

        var successToast = new bootstrap.Toast(document.getElementById('addSuccessToast'));
        successToast.show();
    } else {
        var reminderToastContainer = '<div class="toast-container position-fixed top-0 end-0 p-3" id="fillFormToastContainer">' +
            '<div id="fillFormToast" class="toast bg-warning text-white" role="alert" aria-live="assertive" aria-atomic="true">' +
            '<div class="toast-header">' +
            '<strong class="me-auto">Reminder</strong>' +
            '<small>Just now</small>' +
            '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
            '</div>' +
            '<div class="toast-body">' +
            'Please fill out all form fields before adding.' +
            '</div>' +
            '</div>' +
            '</div>';

        $('body').append(reminderToastContainer);

        var reminderToast = new bootstrap.Toast(document.getElementById('fillFormToast'));
        reminderToast.show();
    }
});


async function RemoveDate(path) {
    return new Promise((resolve, reject) => {
        remove(ref(db, path))
        .then(() => {
            var deleteToastContainer = '<div class="toast-container position-fixed top-0 end-0 p-3" id="deleteSuccessToastContainer">' +
                '<div id="deleteSuccessToast" class="toast bg-success text-white" role="alert" aria-live="assertive" aria-atomic="true">' +
                '<div class="toast-header">' +
                '<strong class="me-auto">Success</strong>' +
                '<small>Just now</small>' +
                '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
                '</div>' +
                '<div class="toast-body">' +
                'Item Deleted Successfully!' +
                '</div>' +
                '</div>' +
                '</div>';
        
            $('body').append(deleteToastContainer);
        
            var deleteToast = new bootstrap.Toast(document.getElementById('deleteSuccessToast'));
            deleteToast.show();
            
            console.log("Data removed successfully");
            resolve("Data removed successfully");
        })
        .catch((error) => {
            console.log("Error found: ", error);
            reject(error);
        });
    });
}


function DeleteSelectedAccordionItems() {
    // Description: Remove all the selected accordion items widget and
    // delete all the entries on the database
    // loop through all the accordion tab and check which ones are checked
    //var allAccordionItems = $('.tocloseaccordionitems');
    let allCheckboxes = $(".tocloseaccordionitems:checked");
    if (allCheckboxes.length < 1) {
        // Show a warning toast if no items are selected
        var warningToastContainer = '<div class="toast-container position-fixed top-0 end-0 p-3" id="warningToastContainer">' +
            '<div id="warningToast" class="toast bg-warning text-dark" role="alert" aria-live="assertive" aria-atomic="true">' +
            '<div class="toast-header">' +
            '<strong class="me-auto">Warning</strong>' +
            '<small>Just now</small>' +
            '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
            '</div>' +
            '<div class="toast-body">' +
            'Please select the items to delete.' +
            '</div>' +
            '</div>' +
            '</div>';

        $('body').append(warningToastContainer);

        var warningToast = new bootstrap.Toast(document.getElementById('warningToast'));
        warningToast.show();

        console.log("No items selected for deletion");
        return; // Exit the function
    }

    for (let i = 0; i < allCheckboxes.length; i++) {
        let id = allCheckboxes[i].id.split("flexCheckDefault")[1];
        // define the wanted path
        let path = "goals/" + googleuniqueuserid.toString() + "/" + id;
        console.log("The path: ", path);
        // send a delete message to the database telling to delete this specific date and specific id
        let rmv = RemoveDate(path).then();
        rmv.then(function(message) {
            console.log("Successfully removed goal:", message);
        }).catch(function(error) {
            console.log("Could not remove goal: ", error);
        });
    }

    // remove accordion items
    removeallaccordiotitems()

    // gather and display current data
    GatherAndDisplayGoalData();
}


$("#removebutton").click(function(){
    // Description: The removebutton will trigger the deletion of all selected
    // accordion object and triger deletion on the database
    console.log("removebutton has been clicked");
    DeleteSelectedAccordionItems();
});