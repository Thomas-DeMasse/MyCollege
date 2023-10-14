	.data
inBuf:	
	.byte	0:80
tabToken:
	.word	0:60		# 20-entry token table
tableHead: 
	.asciiz "TOKEN TYPE/N"
prToken:
	.word 0:3

prompt: .asciiz         "Enter a new input string: "
	
	
	.text
nextLine:
	jal	getline
	la	$s1, Q0
	li	$s0, 1

nextState:
	lw	$s2, 0($s1)
	jalr	$v1, $s2	# Save return addr in $v0

	sll	$t9, $s0, 2	# Multiply by 4 for word boundary
	add	$s1, $s1, $t9
	lw	$s1, 0($s1)

	b	nextState

dump:	
	jal	printToken
	jal	clrToken
	jal	clrInBuf
	
	b 	nextLine

quit:	li	$v0, 10
	syscall
	

ACT1:	
	li $t1, 0   			#T = 0
	sll  $t9, $t1, 3
	lb   $s1, tabChar($t9)
	beq $s1, $t9, printToken
	jr $ra
	
	
	
ACT2:

	jr	$v1
	
ACT3:

	jr	$v1
	
ACT4:

	jr	$v1
	
RETURN:
	b 	dump
	
	
ERROR:
	b 	dump
	
getline:
	la	$a0, prompt		# Prompt to enter a new line
	li	$v0, 4
	syscall

	la	$a0, inBuf		# read a new line
	li	$a1, 80	
	li	$v0, 8
	syscall
	b ACT1
	
printToken:
	
	la $a0, tableHead
	li $v0, 4
	syscall
	
	
loopTok:	
	li	$t0, 0
	bge	$t0, $a3, donePrTok	# if ($t0 <= $a3)
	
	lw	$t1, tabToken($t0)	#   copy tabTok[] into prTok
	sw	$t1, prToken
	lw	$t1, tabToken+4($t0)
	sw	$t1, prToken+4
	
		
loopChar:	
	li	$t7, 0x20		# blank in $t7
	li	$t9, -1			# for each char in prTok
	addi	$t9, $t9, 1
	bge	$t9, 8, tokType		
	lb	$t8, prToken($t9)		#   if char == Null
	bne	$t8, $zero, loopChar	
	sb	$t7, prToken($t9)		#       replace it by ' ' (0x20)
	b	loopChar

		# to print type, use four bytes: ' ', char(type), '\n', and Null
		#  in order to print the ASCII type and newline
tokType:
	li	$t6, '\n'			# newline in $t6
	sb	$t7, prToken+8
	#sb	$t7, prToken+9
	lb	$t1, tabToken+8($t0)
	addi	$t1, $t1, 0x30		# ASCII(token type)
	sb	$t1, prToken+9
	sb	$t6, prToken+10		# terminate with '\n'
	sb	$0, prToken+11
		
	la	$a0, prToken		# print token and its type
	li	$v0, 4
	syscall
	
	addi	$t0, $t0, 12
	sw	$0, prToken		# clear prToken
	sw	$0, prToken+4
	b	loopTok

donePrTok:
	jr	$ra


clrToken:

	jr	$ra
clrInBuf:

	jr	$ra

	.data

tabState:

Q0:     .word  ACT1

        .word  Q1   # T1

        .word  Q1   # T2

        .word  Q1   # T3

        .word  Q1   # T4

        .word  Q1   # T5

        .word  Q1   # T6

        .word  Q11  # T7



Q1:     .word  ACT2

        .word  Q2   # T1

        .word  Q5   # T2

        .word  Q3   # T3

        .word  Q3   # T4

        .word  Q4   # T5

        .word  Q0   # T6

        .word  Q11  # T7



Q2:     .word  ACT1

        .word  Q6   # T1

        .word  Q7   # T2

        .word  Q7   # T3

        .word  Q7   # T4

        .word  Q7   # T5

        .word  Q7   # T6

        .word  Q11  # T7



Q3:     .word  ACT4

        .word  Q0   # T1

        .word  Q0   # T2

        .word  Q0   # T3

        .word  Q0   # T4

        .word  Q0   # T5

        .word  Q0   # T6

        .word  Q11  # T7



Q4:     .word  ACT4

        .word  Q10  # T1

        .word  Q10  # T2

        .word  Q10  # T3

        .word  Q10  # T4

        .word  Q10  # T5

        .word  Q10  # T6

        .word  Q11  # T7



Q5:     .word  ACT1

        .word  Q8   # T1

        .word  Q8   # T2

        .word  Q9   # T3

        .word  Q9   # T4

        .word  Q9   # T5

        .word  Q9   # T6

        .word  Q11  # T7



Q6:     .word  ACT3

        .word  Q2   # T1

        .word  Q2   # T2

        .word  Q2   # T3

        .word  Q2   # T4

        .word  Q2   # T5

        .word  Q2   # T6

        .word  Q11  # T7



Q7:     .word  ACT4

        .word  Q1   # T1

        .word  Q1   # T2

        .word  Q1   # T3

        .word  Q1   # T4

        .word  Q1   # T5

        .word  Q1   # T6

        .word  Q11  # T7



Q8:     .word  ACT3

        .word  Q5   # T1

        .word  Q5   # T2

        .word  Q5   # T3

        .word  Q5   # T4

        .word  Q5   # T5

        .word  Q5   # T6

        .word  Q11  # T7



Q9:     .word  ACT4

        .word  Q1  # T1

        .word  Q1  # T2

        .word  Q1  # T3

        .word  Q1  # T4

        .word  Q1  # T5

        .word  Q1  # T6

        .word  Q11 # T7



Q10:	.word	RETURN

        .word  Q10  # T1

        .word  Q10  # T2

        .word  Q10  # T3

        .word  Q10  # T4

        .word  Q10  # T5

        .word  Q10  # T6

        .word  Q11  # T7



Q11:    .word  ERROR 

	.word  Q4  # T1

	.word  Q4  # T2

	.word  Q4  # T3

	.word  Q4  # T4

	.word  Q4  # T5

	.word  Q4  # T6

	.word  Q4  # T7


	
tabChar:
	.word	0x09, 6		# tab

	.word 	0x0a, 6		# LF

 	.word ' ', 5
 	.word '#', 6
	.word '$',4
	.word '(', 4 
	.word ')', 4 
	.word '*', 3 
	.word '+', 3 
	.word ',', 4 
	.word '-', 3 
	.word '.', 4 
	.word '/', 3 

	.word '0', 1
	.word '1', 1 
	.word '2', 1 
	.word '3', 1 
	.word '4', 1 
	.word '5', 1 
	.word '6', 1 
	.word '7', 1 
	.word '8', 1 
	.word '9', 1 

	.word ':', 4 

	.word 'A', 2
	.word 'B', 2 
	.word 'C', 2 
	.word 'D', 2 
	.word 'E', 2 
	.word 'F', 2 
	.word 'G', 2 
	.word 'H', 2 
	.word 'I', 2 
	.word 'J', 2 
	.word 'K', 2
	.word 'L', 2 
	.word 'M', 2 
	.word 'N', 2 
	.word 'O', 2 
	.word 'P', 2 
	.word 'Q', 2 
	.word 'R', 2 
	.word 'S', 2 
	.word 'T', 2 
	.word 'U', 2
	.word 'V', 2 
	.word 'W', 2 
	.word 'X', 2 
	.word 'Y', 2
	.word 'Z', 2

	.word 'a', 2 
	.word 'b', 2 
	.word 'c', 2 
	.word 'd', 2 
	.word 'e', 2 
	.word 'f', 2 
	.word 'g', 2 
	.word 'h', 2 
	.word 'i', 2 
	.word 'j', 2 
	.word 'k', 2
	.word 'l', 2 
	.word 'm', 2 
	.word 'n', 2 
	.word 'o', 2 
	.word 'p', 2 
	.word 'q', 2 
	.word 'r', 2 
	.word 's', 2 
	.word 't', 2 
	.word 'u', 2
	.word 'v', 2 
	.word 'w', 2 
	.word 'x', 2 
	.word 'y', 2
	.word 'z', 2


	.word	0x5c, -1		# if you ‘\’ as the end-of-table symbol



