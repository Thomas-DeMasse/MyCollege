/*SOURCES CITED:https://rosettacode.org/wiki/100_doors
                https://www.rust-lang.org/learn */

//Compile with command rustc doors.rs
//Main declared
fn main() {
    //Declare a mutable array of type boolean with 100 types
    let mut door_open = [false; 100]; 
    //Check all 100 doors
    for pass in 1..101 {
        let mut door = pass;  //door is assigned the current value of pass
        while door <= 100 {  //while there's less or equal to 100 doors
            door_open[door - 1] = !door_open[door - 1];  //If the door is open close it if it's closed open it
            door += pass; //increment 
        }
    }
    //create another for loop to print the results
    //iterate through the results of the 100 passes 
    //enumerating obtains the correct state of the door (either open or closed)
    for (i, &is_open) in door_open.iter().enumerate() {
        println!("Door {} is {}.", i + 1, if is_open {"open"} else {"closed"});
    }
}