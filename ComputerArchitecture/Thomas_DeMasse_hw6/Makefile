
linker : linker.c
	gcc -ansi -o linker linker.c

run :
	./NewMasm -o < main.asm > main.obj
	./NewMasm -o < xbsywt.asm > xbsywt.obj
	./NewMasm -o < rbsywt.asm > rbsywt.obj
	./NewMasm -o < readint.asm > readint.obj
	./NewMasm -o < writeint.asm > writeint.obj
	./NewMasm -o < addints.asm > addints.obj
	./NewMasm -o < writestr.asm > writestr.obj
	./linker main.obj xbsywt.obj rbsywt.obj readint.obj writeint.obj addints.obj writestr.obj > main.exe
	./mic1 NewPromFile.dat main.exe 0 2048

dump :
	./NewMasm -o < main.asm > main.obj
	./NewMasm -o < xbsywt.asm > xbsywt.obj
	./NewMasm -o < rbsywt.asm > rbsywt.obj
	./NewMasm -o < readint.asm > readint.obj
	./NewMasm -o < writeint.asm > writeint.obj
	./NewMasm -o < addints.asm > addints.obj
	./NewMasm -o < writestr.asm > writestr.obj
	./linker -o main.obj xbsywt.obj rbsywt.obj readint.obj writeint.obj writestr.obj

clean :
	rm *.obj
	rm main.exe
	rm linker
