
/******************************************** 
Assignment 2:    Thomas DeMasse
                 Professor Hendrickson
                 Due Date: 5/25/22
*///////////////////////////////////////////////                 


#include <iostream>
#include <stdio.h>
#include <string>
#include <cmath>
#include <bits/stdc++.h>

typedef union float_32{
        float   floating_value_in_32_bits;
        int     arg_32;
        struct  sign_exp_mantissa{
                unsigned  mantissa:23;
                unsigned  exponent:8;
                unsigned      sign:1;
        } f_bits;
	struct single_bits{
		unsigned  b0 :1;
		unsigned  b1 :1;
		unsigned  b2 :1;
		unsigned  b3 :1;
		unsigned  b4 :1;
		unsigned  b5 :1;
		unsigned  b6 :1;
		unsigned  b7 :1;
		unsigned  b8 :1;
		unsigned  b9 :1;
		unsigned  b10:1;
		unsigned  b11:1;
		unsigned  b12:1;
		unsigned  b13:1;
		unsigned  b14:1;
		unsigned  b15:1;
		unsigned  b16:1;
		unsigned  b17:1;
		unsigned  b18:1;
		unsigned  b19:1;
		unsigned  b20:1;
		unsigned  b21:1;
		unsigned  b22:1;
		unsigned  b23:1;
		unsigned  b24:1;
		unsigned  b25:1;
		unsigned  b26:1;
		unsigned  b27:1;
		unsigned  b28:1;
		unsigned  b29:1;
		unsigned  b30:1;
		unsigned  b31:1;
	}bit;
} FLOAT_UN;


//Created a simpler printBits function
void printBits(int n, int i)
{
 
    // Prints the binary representation
    // of a number n up to i-bits.
    int k;
    for (k = i - 1; k >= 0; k--) {
 
        if ((n >> k) & 1)
            std::cout << "1";
        else
            std::cout << "0";
    }
    std::cout << " ";
}

int main(int argc, char * argv[])
{

FLOAT_UN float_32_s1, float_32_s2;

/**local helper variables**/

int	mant_s1, mant_s2, exp_s1, exp_s2;
int bias = 127;
int sumOfMantissa; 


/* Request two FP numbers */
std::ifstream in("input.txt");
std::cin.rdbuf(in.rdbuf());

std::cin >> float_32_s1.floating_value_in_32_bits;

std::cin >> float_32_s2.floating_value_in_32_bits;

mant_s1 = float_32_s1.f_bits.mantissa;
mant_s2 = float_32_s2.f_bits.mantissa;
exp_s1  = float_32_s1.f_bits.exponent;
exp_s2  = float_32_s2.f_bits.exponent;

std::cout << "Original pattern of Float 1: ";
printBits(exp_s1, 8);
printBits(mant_s1,23);
std:: cout << std::endl;

std:: cout << "Original pattern of Float 2: ";
printBits(exp_s2, 8);
printBits(mant_s2, 23);
std:: cout << std::endl;

mant_s1 |= 1 << 23;
mant_s2 |= 1 << 23;

exp_s1 = exp_s1 - bias; 
exp_s2 = exp_s2 - bias;
int finalExp;

while(exp_s1 != exp_s2){
    int displacement; 
    if(exp_s1 > exp_s2){
        finalExp = exp_s1;
        displacement = exp_s1 - exp_s2;
        mant_s2 = mant_s2 >> displacement;
    }
    else if(exp_s2 > exp_s1){
        finalExp = exp_s2;
        displacement = exp_s2 - exp_s1;
        mant_s1 = mant_s1 >> displacement;
    }
    
    std::cout << "Post shift pattern of mant. 1:";
    printBits(mant_s1,24);
    std::cout<<std::endl;
    std::cout << "Post shift patter on mant. 2: ";
    printBits(mant_s2,24);
    std::cout<<std::endl;
    
    
    sumOfMantissa = mant_s2 + mant_s1;
    std::cout << "Result of adding mantissa: ";
    printBits(sumOfMantissa, 23);
    std::cout << std:: endl << "Final exponent: ";
    printBits(finalExp, 8);
    std::cout << std::endl;

    int finalResult = finalResult | (finalExp << 23);
    finalResult = finalResult | sumOfMantissa;
    std::cout << "Final Result: ";
    printBits(finalResult, 32);
    std::cout << std::endl;
    
    return 0;

    }

}
