.data
	A: .word 1, 10, 20
	
	.text
		lw $t0, A
		lw $t1, A+4
		lw $t2, A+8
		
		la $a0, A
		lw $t5, ($a0)
		lw $t4, 4($a0)
		lw $t3, 8($a0)
		
