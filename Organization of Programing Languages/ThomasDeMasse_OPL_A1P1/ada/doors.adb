
  --Code (site):
  --https://rosettacode.org/wiki/100_doors
  --Compile with command gnatmake doors.adb

with Ada.Text_Io; use Ada.Text_Io; --The with and use is used to load packages which will be accessed by the program. the text_io is used to input and output text. 
 
 procedure Doors is --a procedure in Ada is a block of code that performs a specific task and may return a result of a calling code
    type Door_State is (Closed, Open); --type defines a set of values or a set of operations that can be performed on that value incase being Door_state. Here a type is being defined. There are two possible values" 'closed' and 'open'
    type Door_List is array(Positive range 1..100) of Door_State; --another type is being defined where "is" is used to show that there is a new entity. The type Door_list is to show that there is an array of possitive values that range from 1 to 100. Each element is of type 'Door_State'
    The_Doors : Door_List := (others => Closed); --here a variable of type door_list has be declared. It initialized all the elements of the door list array to 'closed' the 'others' keyword is used to specify the value for all the elements of the array, here being 'closed;
 begin -- begin is like "main" in c++. it marks the start of the main body of what is going on. The execution begins here
    for I in 1..100 loop --This key "for" shows that a for loop is about to occur. these two for loops iterate through all doors. The first loop iterates 100 times and the inner for loop iterates through all the doors
       for J in The_Doors'range loop
          if J mod I = 0 then --here we check if J is divisible by the current value of I ( =0 ). " = " is used to show equality. This is where we see in the problem given that id 'J' indeed is divisible by I, then the door is toggled.
             if The_Doors(J) = Closed then --Here is we check 'J' which shows us the state of the door. if the door is closed, we will set it to open, if the door is open we will set it closed.
                 The_Doors(J) := Open; --we use := symbol for assignment.
             else
                The_Doors(J) := Closed;
             end if; --ends the if statement
          end if; --ends the if statement
       end loop; --ends the inner for loop
    end loop; --ends the outter for loop
    --we start another for loop, where in this for loop, it will iterate through all the element of type "the_doors"
    for I in The_Doors'range loop 
    --Here prints the state of each foor in the form of I to show whether it is closed or open. Image is used to convert the int or enum to a string.
       Put_Line(Integer'Image(I) & " is " & Door_State'Image(The_Doors(I))); 
    end loop;
 end Doors;
