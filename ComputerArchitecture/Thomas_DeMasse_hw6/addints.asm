sb:         loco 8                  

loop1:      jzer finish:            
            subd one:
            stod lpcnt:
            lodl 1
            jneg add1:
            addl 1
            stol 1
            lodd lpcnt:
            jump loop1:

add1:       addl 1
            addd one:
            stol 1
            lodd lpcnt:
            jump loop1:
