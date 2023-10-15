To compile this program simply run the makefile with the command: 

"make"

This will create an executable file named:

parse

Run the executable with the command: 

./parse < primes.cl

Output:

tdemasse@cs5:~/ThomasDeMasse_OPL_A2$ ./parse < primes.cl
(program 
[predict program --> stmt_list eof
predict stmt_list --> stmt stmt_list
(read matched read
"n"matched id: n
)
predict stmt_list --> stmt stmt_list
(predict stmt --> id gets expr
cp :=  matched id: cp
matched gets
(num "2")matched literal: 2
)
predict stmt_list --> stmt stmt_list
(while
matched if
(id "n")matched id: n
 > matched >=
(num "0")matched literal: 0

[predict stmt_list --> stmt stmt_list
(predict stmt --> id gets expr
found :=  matched id: found
matched gets
(num "0")matched literal: 0
)
predict stmt_list --> stmt stmt_list
(predict stmt --> id gets expr
cf1 :=  matched id: cf1
matched gets
(num "2")matched literal: 2
)
predict stmt_list --> stmt stmt_list
(predict stmt --> id gets expr
cf1s :=  matched id: cf1s
matched gets
(id "cf1")matched id: cf1
 * matched mul
(id "cf1")matched id: cf1
)
predict stmt_list --> stmt stmt_list
(while
matched if
(id "cf1s")matched id: cf1s
 <= matched <
(id "cp")matched id: cp

[predict stmt_list --> stmt stmt_list
(predict stmt --> id gets expr
cf2 :=  matched id: cf2
matched gets
(num "2")matched literal: 2
)
predict stmt_list --> stmt stmt_list
(predict stmt --> id gets expr
pr :=  matched id: pr
matched gets
(id "cf1")matched id: cf1
 * matched mul
(id "cf2")matched id: cf2
)
predict stmt_list --> stmt stmt_list
(while
matched if
(id "pr")matched id: pr
 <= matched <
(id "cp")matched id: cp

[predict stmt_list --> stmt stmt_list
(if
matched endifendwhile
(id "pr")matched id: pr
error

Parses most tokens still working on the final product.