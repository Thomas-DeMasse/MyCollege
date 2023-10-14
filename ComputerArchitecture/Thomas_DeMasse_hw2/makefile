CC = g++
CFLAGS = -std=c++11 -c -g -Og -Wall -pedantic
OBJ = AddFloat.o  
EXE = AddFloat

all: $(OBJ)
	$(CC) $(OBJ) -o $(EXE)

AddFloat.o: AddFloat.cpp $(DEPS)
	$(CC) $(CFLAGS) -o $@ $<

clean:
	\rm $(OBJ) $(EXE)
