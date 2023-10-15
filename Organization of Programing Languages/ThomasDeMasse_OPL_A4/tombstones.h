#ifndef TOMBSTONES_H
#define TOMBSTONES_H

#include <iostream>

template<class T>
class MyPointer {
private:
    int *refCount;
    T *ptr;

    void releaseCount() {
        if (ptr != nullptr) {
            --(*refCount);
            if ((*refCount) == 0) {
                delete ptr;
                ptr = nullptr;
                delete refCount;
                refCount = nullptr;
            }
        }
    }

public:
    MyPointer<T>() {// default constructor
        ptr = new T;
        refCount = new int;
        *refCount = 1;
    }

    MyPointer<T>(MyPointer<T> &pointer) {// copy constructor
        if (*this != pointer) {
            ptr = pointer.ptr;
            refCount = pointer.refCount;
            if (ptr != nullptr) {
                ++(*refCount);
            }
        }
    }

    explicit MyPointer<T>(T *_ptr) { // bootstrapping constructor
        //The parameter for the bootstrapping constructor should always be 
        //a call to operator new
        ptr = _ptr;
        refCount = new int;
        if (ptr != nullptr) {
            *refCount = 1;
        } else {
            *refCount = 0;
        }

    }

    ~MyPointer<T>() {// destructor
        if (refCount != nullptr) {
            --(*refCount);
            if (*refCount == 0) {
                if (ptr != nullptr) {
                    delete ptr;
                    ptr = nullptr;
                }
                delete refCount;
                refCount = nullptr;
            }
        }
    }


    T &operator*() const {// dereferencing
        if (ptr != nullptr) {
            return *ptr;
        } else {
            std::cout << "Dangling Reference Exception!\n";
            exit(0);
        }
    }

    T *operator->() const {// field dereferencing
        if (ptr != nullptr) {
            return ptr;
        } else {
            std::cout << "Dangling pointer dereferenced!\nExit!\n";
            exit(0);
        }
    }

    MyPointer<T> &operator=(const MyPointer<T> &pointer) {// assignment
        if (ptr == pointer.ptr) {
            return *this;
        }
        releaseCount();
        ptr = pointer.ptr;
        refCount = pointer.refCount;
        if (ptr != nullptr) {
            ++(*refCount);
        }
        return *this;
    }

    MyPointer<T> &operator=(T *_ptr) {// assignment
        if (ptr == _ptr) {
            return *this;
        }
        releaseCount();
        ptr = _ptr;
        refCount = new int;
        if (ptr != nullptr) {
            *(refCount) = 1;
        } else {
            *(refCount) = 0;
        }
        return *this;
    }

    friend void free(MyPointer<T> &pointer) {// delete pointed-at object
        if (pointer.refCount !=nullptr) {
            --(*pointer.refCount);
            if (*pointer.refCount == 0) {
                if (pointer.ptr != nullptr) {
                    delete pointer.ptr;
                    pointer.ptr = nullptr;
                }
                delete pointer.refCount;
                pointer.refCount = nullptr;
            }
        }
    }

// This is essentially the inverse of the new inside the call to
// the bootstrapping constructor. It should delete the pointed-to
// object (which should in turn call its destructor).
// equality comparisons:
    bool operator==(const MyPointer<T> &pointer) const {
        return ptr == pointer.ptr;
    }

    bool operator!=(const MyPointer<T> &pointer) const {
        return ptr != pointer.ptr;
    }

    bool operator==(const int n) const {
        return ptr == nullptr && n == 0;
    }

// true iff MyPointer is null and int is zero
    bool operator!=(const int n) const {
        return !(ptr == nullptr && n == 0);
    }
// false iff Pointer is null and int is zero
};


#endif 
