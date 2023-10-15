/**********************************************************************************************************
   TO WHOME IT MAY CONCERN THIS PROGRAM COMPILES RUNNING PROLOG at USERNNAME@CS.UML.EDU
     1.) Login to your host or install your own host running prolog
     2.) To run prolog simply type prolog or swipl.
     2.) Run the following code using [doorsprolog].
            NOTE: Filenames are case sensitive! 
     3.) You should recieve a response "true." indicating the program compiled successfully
***********************************************************************************************************/
/* Works cited:  https://www.tutorialspoint.com/prolog/index.htm
                 https://rosettacode.org/wiki/100_doors
                 https://www.swi-prolog.org */

/* Lists all of the open doors between 1 and 100 
As long as the program compiles succesfully
We can type main. or (main). to display the status of every door
Only doors that are perfect squares will remain open */
main :-
    forall(between(1,100,Door), ignore(display(Door))).

 
 
    
/* Show output if door is open after the 100th pass. 
Displays the status of the door based on the query.
When we run "display(100)" - door 100 is open the 100th pass
If we run "display(99)" - door 99 is not open after the 100th pass because 99 is not a perfect square
status() displays the status of the door whether its open or closed
format() just displays the the status of the door passed as a parameter by the user */

display(Door) :- 
    status(Door, 100, open),
    format("Door ~d is open~n", [Door]).

/* True if Door has Status after Pass is done
The format for the query is listed first: status(Door,Pass,Status).
if the pass is a positive number, the remainder is the door modular pass
if we run "status(100,100,open)" it will return true because door 100 is open after the 100th pass
if we run "status(99,100, open)" it will return false because door 99 is closed after the 100th pass
if we run "status(99,100, closed)" it will return true however because door 99 is closed after the 100th pass */

status(Door, Pass, Status) :-
    Pass > 0,
    Remainder is Door mod Pass,
    toggle(Remainder, OldStatus, Status),
    OldPass is Pass - 1,
    status(Door, OldPass, OldStatus).
status(_Door, 0, closed).

/* Says if the the door is open close it, if the door is closed then open it
 as long as the remainder is a positive number */

toggle(Remainder, Status, Status) :-
    Remainder > 0.
toggle(0, open, closed).
toggle(0, closed, open).