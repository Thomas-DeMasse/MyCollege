#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cctype>

#include "scan.hpp"

char token_image[MAX_TOKEN_LEN];

token scan() {
    static int c = ' ';
        /* next available char; extra (int) width accommodates EOF */
    int i = 0;              /* index into token_image */

    /* skip white space */
    while (std::isspace(c)) {
        c = std::getchar();
    }
    if (c == EOF)
        return t_eof;
    if (std::isalpha(c)) {
        do {
            token_image[i++] = c;
            if (i >= MAX_TOKEN_LEN) {
                std::cout << "max token length exceeded" << std::endl;
                std::exit(1);
            }
            c = std::getchar();
        } while (std::isalpha(c) || std::isdigit(c) || c == '_');
        token_image[i] = '\0';
        if (!std::strcmp(token_image, "read")) return t_read;
        else if (!std::strcmp(token_image, "write")) return t_write;
        else return t_id;
    }
    else if (std::isdigit(c)) {
        do {
            token_image[i++] = c;
            c = std::getchar();
        } while (std::isdigit(c));
        token_image[i] = '\0';
        return t_literal;
    } else switch (c) {
        case ':':
            if ((c = std::getchar()) != '=') {
                std::cerr << "error" << std::endl;
                std::exit(1);
            } else {
                c = std::getchar();
                return t_gets;
            }
            break;
        case '(': c = std::getchar(); return t_lparen;
        case ')': c = std::getchar(); return t_rparen;
        case '+': c = std::getchar(); return t_add;
        case '-': c = std::getchar(); return t_sub;
        case '*': c = std::getchar(); return t_mul;
        case '/': c = std::getchar(); return t_div;
        default:
            std::cout << "error" << std::endl;
            std::exit(1);
    }
}