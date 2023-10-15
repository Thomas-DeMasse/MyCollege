read n
cp := 2
while n > 0
	found := 0
	cf1 := 2
	cf1s := cf1 * cf1
	while cf1s <= cp
		cf2 := 2
		pr := cf1 * cf2
		while pr <= cp
			if pr = cp
				found := 1
			endif
			cf2 := cf2 + 1
			pr := cf1 * cf2
		endwhile
		cf1 := cf1 + 1
		cf1s := cf1 * cf1
	endwhile
	if found = 0
		write cp
		n := n - 1
	endif
	cp := cp + 1
endwhile
