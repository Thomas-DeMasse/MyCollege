Group Members: Anson L., Daury A., Paschal O.

To compile this program simply run the makefile with the command: 

"make"

This will create an executable file named:

parse

Run the executable with the command: 

./parse

Output:

tdemasse@cs4:~/ThomasDeMasse_OPL_A2$ ./parse
read
predict program --> stmt_list eof
predict stmt_list --> stmt stmt_list
predict stmt --> read id
matched read
A
matched id: A
B
predict stmt_list --> stmt stmt_list
predict stmt --> id gets expr
matched id: B
:=
matched gets
A
predict expr --> term term_tail
predict term --> factor factor_tail
predict factor --> id
matched id: A
+
predict factor_tail --> epsilon
predict term_tail --> add_op term term_tail
predict add_op --> add
matched add
B
predict term --> factor factor_tail
predict factor --> id
matched id: B
write
predict factor_tail --> epsilon
predict term_tail --> epsilon
predict stmt_list --> stmt stmt_list
predict stmt --> write expr
matched write
sum
predict expr --> term term_tail
predict term --> factor factor_tail
predict factor --> id
matched id: sum
/
predict factor_tail --> mul_op factor factor_tail
predict mul_op --> div
matched div
2
predict factor --> literal
matched literal: 2
