CC = g++
WFLAG = -w
OFLAG = -o
DFLAG = -ggdb
VFLAG = -std=c++11


test: A4-tests-v3.cpp  tombstones.h
	${CC} ${VFLAG} ${WFLAG} tombstones.h A4-tests-v3.cpp  ${OFLAG} A4-tests-v3


.PHONY: clean

clean:
	rm A4-tests-v3
