AddInput:   lodd on:                
            stod 4095              
            call xbsywt:            
            loco inputString:         
            call nextw:            
            call getInput:          
            lodd binum:         
            stod sum:               
            loco inputString:          
            call nextw:            
            call getInput:          
            lodd binum:        
            addd sum:              
            stod sum:               
            jneg overflow:          
            loco resultString:            
            call nextw:             
            call convert:           
            lodd zero:              
            halt                    


getInput:   lodd on:                
            stod 4093               
            call rbsywt:            
            lodd 4092               
            subd numoff:             
            push                    


nxtdig:     call rbsywt:            
            lodd 4092               
            stod nxtchr:          
            subd nl:                
            jzer endnum:           
            mult 10                 
            lodd nxtchr:          
            subd numoff:             
            addl 0                  
            stol 0                  
            jump nxtdig:          


endnum:     pop                     
            stod binum:         
            lodd 4092               
            loco 0
            retn                    


overflow:   loco errorString:          
            call nextw:             
            lodd neg1:              
            halt                    


convert:    lodd on:                
            stod 4095              
            lodd neg1:              
            push                    
            lodd mask:              
            push                   
            jump answer:            


answer:     lodd sum:               
            jzer start:          
            lodd mask:              
            push                   
            lodd sum:               
            push                    
            div                     
            pop                    
            stod sum:               
            pop                     
            insp 2                  
            addd numoff:            
            push                   
            jump answer:           


start:      pop                     
            jneg done:              
            stod 4094               
            call xbsywt:           
            jump start:          


nextw:      pshi                    
            addd one:
            stod str:
            pop
            jzer crnl:             
            stod 4094               
            push
            subd c255:
            jneg crnl:              
            call sb:                
            insp 1
            push
            call xbsywt:
            pop
            stod 4094               
            call xbsywt:
            lodd str:
            jump nextw:


crnl:       lodd cr:                
            stod 4094               
            call xbsywt:           
            lodd nl:                
            stod 4094               
            call xbsywt:            
            retn


xbsywt:     lodd 4095               
            subd mask:
            jneg xbsywt:
            retn

rbsywt:     lodd 4093               
            subd mask:
            jneg rbsywt:
            retn


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

finish:     lodl 1                  
            retn

done:       retn                    


inputString:  "Enter a 1-5 digit number followed by enter: "  
resultString:    "The sum of these numbers is:"
errorString:  "overflow, no sum possible!"
neg1:       -1        
zero:        0        
one:         1        
numoff:      48        
c255:        255        
nxtchr:      0        
binum:       0        
sum:         0       
lpcnt:       0        
str:         0        
on:          8        
mask:       10        
nl:         10        
cr:         13        