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
        GatherAndDisplayCurrentDate();

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

function InsertGivenDateExpenses (name = "foo-company-name", category = "foo-category-type", cost = "0.0", id = null) {
    // description: given name, category, day, create an entry in the database
    // note that the date is the one given by the datepicker
    // parameter: string name, string category and numerical cost and id (UnixTime)
    if (id == null) {
        id = Date.now();
    }
    var tempdatedataparsed = $("#datepicker").val().split("/");
    if (tempdatedataparsed.length <= 1) {
        // if user has not enter a date... s/he cant add
        // TODO() toast saying to please select a data
        return;
    }
    var temppyear = tempdatedataparsed[2];
    var tempmonth = Number(tempdatedataparsed[0]).toString();
    var tempday = Number(tempdatedataparsed[1]).toString();

    var tempdatedata = "expenses/" + googleuniqueuserid.toString() + "/" + temppyear.toString() + "/" + tempmonth.toString() + "/" + tempday.toString() + "/" + id;

    set(ref(db, tempdatedata), {
        Name: name,
        Category: category,
        Cost: cost
    }).then (()=> {
        console.log("Expenses Data added sucessfully!");
        // TODO upon success make a toast letting the user know its been successfully added
       
        //return;
        
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
    var category = $("#" + event.data.param1)[0].fcategory.value;
    var cost = $("#" + event.data.param1)[0].fcost.value;
    InsertGivenDateExpenses(name, category, cost, event.data.param2);
    $("#summary" + event.data.param2).html( name + "-" + category);

        
       
}



function CreateANewAccordion(name = "Unsave", category = "Select a Category", cost = 0.0, id = null, fromdb = 0) {
 
    var tempdatedataparsed = $("#datepicker").val().split("/");
    if (tempdatedataparsed.length <= 1) {
        // TODO() toast saying to please select a data
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
                    '<label class="form-check-label" for="flexCheckDefault'+id+'"></label></div><div id="summary'+ id +'">' +name +'-'+category+'</div></button></h2>'
                    + '<div id="collapseOne' + id + '" class="accordion-collapse collapse" aria-labelledby="headingOne' + id +
                    '" data-bs-parent="#accordionExample">' 
                    + '<div class="accordion-body">' +
                   '<form id="'+ 'form' + id + '"><label for="fname">Name:</label><br>' +
                   '<input type="text" id="fname" name="fname" value="'+ name +'"><br>' +
                   '<br><label for="lname">Category:</label><br>'+
                   '<select id="fcategory" name="fcategory"> <option value="Select a Category" disabled selected>Select a Category</option> <option value="housing">Housing</option> <option value="transportation">Transportation</option> <option value="food">Food</option><option value="insurance">Insurance</option><option value="shopping">Shopping/Entertainment</option><option value="medical">Medical/HealthCare</option><option value="education">Education</option><option value="personal">Personal</option><option value="other">Other</option></select><br><br>'+
                   '<label for="lname">Cost:</label><br>' + 
                   '<input type="number" placeholder="0" id="fcost" name="fcost" value="'+ cost +'"><br><br>' + 
                   '<input type="submit" value="Save" id="submitbutton'+ id+'"></form>';

                   
                   /*
                   let parser = new DOMParser();
                   let accordionFragment = parser.parseFromString(newAccordian, 'text/html');

        let toast = '<div class="toast-container position-fixed top-0 end-0 p-3" id="saveChangesToastContainer">'+
                    '<div id="successToast" class="toast bg-success text-white" role="alert" aria-live="assertive" aria-atomic="true">'+
                    '<div class="toast-header">  <strong class="me-auto">Success</strong> <small>Just now</small><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div>'+
                    '<div class="toast-body">Expense has been saved!</div></div></div>';

                    let parserTwo = new DOMParser();
                    let toastFragment = parserTwo.parseFromString(toast, 'text/html');

                   var toastItem = toastFragment.querySelector('.successToast');

                   accordionFragment.getElementById('submitbutton').addEventListener("click", function(event) {
                    var saveChangesSuccessToast = new bootstrap.Toast(toastItem, {
                      animation: true,
                      delay: 2000
                    });
                    saveChangesSuccessToast.show();
                  });
                   */



    // add the newly created accordion into 
    $('#accordionExample').append(newAccordian);
    // https://stackoverflow.com/questions/3273350/jquerys-click-pass-parameters-to-user-function
    $("#" + "submitbutton" + id.toString()).click({param1: "form" + id.toString(), param2: id}, submitbuttonfunction);
    //$("#" + "submitbutton" + id).value(category);
    //$('#accordionExample').la
    // TODO() select the right one
    $($($($(".accordion-body:last")).find("#fcategory")[0])[0]).val(category)
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
            'Expense Saved Successfully!' +
            '</div>' +
            '</div>' +
            '</div>';
    
       
        $('body').append(toastContainer);
    
        
        var toast = new bootstrap.Toast(document.getElementById('successToast'));
        toast.show();
    });
    
}

$("#addbutton").click(function(){
    // Description: The addbutton will trigger the creation of a new accordion
    // object at the button of all the other accordion
    CreateANewAccordion();
    var toastContainer = '<div class="toast-container position-fixed top-0 end-0 p-3" id="addAccordionToastContainer">' +
    '<div id="addAccordionToast" class="toast bg-primary text-white" role="alert" aria-live="assertive" aria-atomic="true">' +
    '<div class="toast-header">' +
    '<strong class="me-auto">Sucess</strong>' +
    '<small>Just now</small>' +
    '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
    '</div>' +
    '<div class="toast-body">' +
    'New Expense Added Successfully!' +
    '</div>' +
    '</div>' +
    '</div>';

// Append the toast container to the body
$('body').append(toastContainer);

// Show the Bootstrap toast
var toast = new bootstrap.Toast(document.getElementById('addAccordionToast'));
toast.show();
});

function RemoveDate (path) {

    remove(ref(db, path)).then(() => {
        var toastContainer = '<div class="toast-container position-fixed top-0 end-0 p-3" id="deleteToastContainer">' +
        '<div id="deleteToast" class="toast bg-danger text-white" role="alert" aria-live="assertive" aria-atomic="true">' +
        '<div class="toast-header">' +
        '<strong class="me-auto">Deleted</strong>' +
        '<small>Just now</small>' +
        '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
        '</div>' +
        '<div class="toast-body">' +
        'Selected Expense(s) Deleted Successfully!' +
        '</div>' +
        '</div>' +
        '</div>';

   
    $('body').append(toastContainer);

   
    var toast = new bootstrap.Toast(document.getElementById('deleteToast'));
    toast.show();
        console.log("Data removed succesfully");
    }).catch((error) => {
        console.log("Error found: ", error);
    })
};

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

async function FetchDataOfSelectedDay() {
    // Description: Fetches all the data available of the given day (selected from datepicker)
    var tempdatedataparsed = $("#datepicker").val().split("/");
    var year = tempdatedataparsed[2];
    var month = Number(tempdatedataparsed[0]).toString();
    var day = Number(tempdatedataparsed[1]).toString();
    const dbref = ref(db);
    var tempdatedata = "expenses/" + googleuniqueuserid.toString() + "/" + year + "/" + month + "/" + day;
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

function GatherAndDisplayCurrentDate() {
    // Description: Gather all data from the back-end from the current date.
    // The data is then display within accordion items.

    // remove all current items
    removeallaccordiotitems();
    // fetch the data if they exist
    let gatheredData = FetchDataOfSelectedDay();
    gatheredData.then(function(data){
        console.log("Gathered succesfully the data: ", data);
        let arrofkeys = Object.keys(data);
        // loop through all the data
        for (let i = 0; i < arrofkeys.length; i++) {
            let k = arrofkeys[i];
            let n = data[k]["Name"];
            let cat = data[k]["Category"];
            console.log("TODO select on dropdown: ",cat);
            let c = data[k]["Cost"];
            // create a button object for every daya inputed.
            CreateANewAccordion(n, cat, c, k, 1)
        }
    }).catch(function(error){
        console.log("An error has occured with FetchDataOfSelectedDay inside datapicker.onchange: ", error);
    })
}

$("#datepicker").on("change", function() {
    // Description: Upon the value of datepicker chaging, we update the info being display
    GatherAndDisplayCurrentDate();
});
