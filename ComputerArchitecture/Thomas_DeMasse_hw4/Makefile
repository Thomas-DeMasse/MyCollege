
masm_mrd: NewMic1symasm.o lex.yy.o
	gcc -o NewMasm NewMic1symasm.o lex.yy.o
NewMic1symasm.o:  NewMic1symasm.c
	gcc -c -g NewMic1symasm.c
lex.yy.c: NewMic1symasm.ll
	flex NewMic1symasm.ll
lex.yy.o:  lex.yy.c
	gcc -c -g lex.yy.c
clean:
	rm lex.yy.o lex.yy.c NewMic1symasm.o NewMasm
