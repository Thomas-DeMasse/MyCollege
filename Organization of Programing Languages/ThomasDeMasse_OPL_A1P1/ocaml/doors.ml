(** This is the code of the problem in OCaml *)
(**citation: http://rigaux.org/language-study/syntax-across-languages-per-language/OCaml.html *)
(** https://stackoverflow.com/questions/54267303/what-does-mean-in-ocaml*)
(** Where code was obtained: https://rosettacode.org/wiki/100_doors *)
(** Compile with command - ocaml doors.ml *)

 let max_doors = 100 (** this line declares a constant of "max_doors" to a value of 100. It represents the numbe of doors. *)

let show_doors =       (** There is a new function being defined here called "show_doors" *)
  Array.iteri (fun i x -> Printf.printf "Door %d is %s\n" (i+1)   (** this new function show_doors takes an array of boolean values and prints the status of each door. with the use of Array.iteri, the function can iterate over the array. with printf.printf, the function formats and prints the status of each door.*) 
                                        (if x then "open" else "closed"))(*Here, i is the index of the door and x is the state that is in, whether it is true for open or false for closed. *)

let flip_doors doors = (**Once again we are defining a new function. This function called flip_doors takes the array of booleans and returns a new arrray where the state of each door is toggled based on its 'i' (index). *)
  for i = 1 to max_doors do (** use a for loop inorder to iterate through all the doors and we left let rec to toggle the door state in increments of what our 'i' is*)
    let rec flip idx = (** let rec in OCaml is used to define a function that is recursive. having both let rec allows the programmer a tigher control of the scope. idc represents the index of the door in the array. *)
      if idx < max_doors then begin (**This if statement makes sure that the function keeps calling itself (recursion) only if idx (being the index of the door in the array) is less than max_doos (100). recursion will stop once al the doors have been gone through. *)
        doors.(idx) <- not doors.(idx); (**Here we toggle the state of the door. "not" in oCaml is a operator thats a logical not. the '<-' is used to modify the value of the array. There fore if the value is "false" the "not" operator returns "true" vise versa. *)
        flip (idx + i) (** here 'i' is the current iteration number of the outter for loop and idx is the index of the door in the array *)
      end
    in flip (i - 1) (** Sets up the recursion call*)
  done; (**Shows that this is the end of the for loop *)
  doors

let () =
  show_doors (flip_doors (Array.make max_doors false)) (**this creates a main function that creates an array of 100 closed doors. so the flip_doors is used to toggle the door states where as show_doors creates all 100 doors closed. *)