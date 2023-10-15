CC = g++
CFLAGS = -g --std=c++17 -Wall -Werror -pedantic

all: parse

parse: parse.o scan.o
	$(CC) $(CFLAGS) -o $@ $^


parse.o: parse.cpp scan.hpp
	$(CC) $(CFLAGS) -c parse.cpp

scan.o: scan.cpp scan.hpp
	$(CC) $(CFLAGS) -c scan.cpp

clean:
	rm *.o parse
