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
