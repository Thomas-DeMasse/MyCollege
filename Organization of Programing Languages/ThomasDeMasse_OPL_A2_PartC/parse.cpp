
#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <string>

#include "scan.hpp"

const char* names[] = {"read", "write", "id",  "literal", "gets",   "add",
                       "sub",  "mul",   "div", "lparen",  "rparen", "eof", "if", "endif" "endwhile", "while", 
                       "==", "<>", "<", ">", "<=", ">="};

static token input_token;
class SyntaxError{
    public: 
        SyntaxError(){}
        ~SyntaxError(){}
    
    private:
};

void error() {
    std::cout << "syntax error\n";
    exit(1);
}

void match(token expected) {
    if (input_token == expected) {
        std::cout << "matched " << names[input_token];
        if (input_token == t_id || input_token == t_literal)
            std::cout << ": " << token_image;
        std::cout << std::endl;
        input_token = scan();
    } else {
        error();
        input_token = scan();
        throw SyntaxError();
    };
}

void program();
void stmt_list();
void stmt();
void expr();
void term();
void term_tail();
void factor();
void factor_tail();
void add_op();
void mul_op();
void relation();
void relation_tail();
void bool_op();

void program() {
    std::cout << "(program " << std::endl;
    std::cout << "[";
    try {
        switch (input_token) {
        case t_id:
        case t_read:
        case t_write:
        case t_eof:
        case t_while:
        case t_if:
            printf("predict program --> stmt_list eof\n");
            stmt_list();
            match(t_eof);
            break;
        default: error(); throw SyntaxError();
        }
}
catch (SyntaxError) {
    while(true)
    {
        switch(input_token)
        {
            case t_id:
            case t_read:
            case t_write:
            case t_eof:
            case t_if:
            case t_while:
                program();
                return;
            default:
                input_token = scan();
        }
    }
    
}
std::cout << "]" << std::endl;
    std::cout << ")" << std::endl; 
}

void stmt_list() {
    try {
    switch (input_token) {
        case t_id:
        case t_read:
        case t_write:
        case t_if:
        case t_while:
            std::cout << "predict stmt_list --> stmt stmt_list\n";
            stmt();
            stmt_list();
            break;
        case t_eof:
        case t_endif:
        case t_endwhile:
            std::cout << "predict stmt_list --> epsilon\n";
            break; /* epsilon production */
        default:
            error(); throw SyntaxError();
    }
}
 catch (SyntaxError) {
        while (true)
        {
            switch (input_token)
            {
            case t_id:
            case t_read:
            case t_write:
            case t_if:
            case t_while:
                stmt_list();
                return;
            case t_eof:
                return;
            default:
                break;
            }
        }
    }
    
    
}

void stmt () {
    try {
        std::cout << "(";
        switch (input_token) {
        case t_id:
            std::cout << "predict stmt --> id gets expr" << std::endl;
            std::cout << token_image << " := " << " ";
            match(t_id);
            match(t_gets);
            expr();
            break;
        case t_read:
            //cout << "predict stmt --> read id" << endl;
            std::cout << "read ";
            match(t_read);
            std::cout << "\"" << token_image << "\"";
            match(t_id);
            break;
        case t_if:
            //cout << "predict stmt --> if expr stmt fi" << endl;
            std::cout << "if" << std::endl;
            match(t_if);
            expr();
            std::cout << std::endl;
            std::cout << "[";
            stmt_list();
            std::cout << "]" << std::endl;
            match(t_endif);
            break;
        case t_while:
            //cout << "predict stmt --> do stmt od" << endl;
            std::cout << "while" << std::endl;
            match(t_while);
            expr();
            std::cout << std::endl;
            std:: cout << "[";
            stmt_list();
            std::cout << "]" << std::endl;
            match(t_endwhile);
            break;
        case t_write:
            //cout << "predict stmt --> write expr" << endl;
            std::cout << "write ";
            match(t_write);
            expr();
            break;
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true)
        {
            switch (input_token)
            {
            case t_id:
            case t_read:
            case t_if:
            case t_while:
            case t_write:
                stmt();
                return;
               
            default:
                input_token = scan();
            }
        }
    }
    std::cout << ")" << std::endl;
}

void expr () {
    try {
        switch (input_token) {
        case t_id:
        case t_literal:
        case t_lparen:
            //cout << "predict expr --> relation relation_tail" << endl;
            relation();
            relation_tail();
            break;
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true)
        {
            switch (input_token)
            {
            case t_id:
            case t_literal:
            case t_lparen:
                expr();
                return;
            case t_rparen:
            case t_read:
            case t_write:
            case t_if:
            case t_while:
            case t_endif:
            case t_endwhile:
            case t_eof:
                return;
            default:
                input_token = scan();
            }
        }
    }
}

void relation() {
    try {
        switch (input_token) {
        case t_id:
        case t_literal:
        case t_lparen:
            //cout << "predict term --> term term_tail" << endl;
            term();
            term_tail();
            break;
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true)
        {
            switch (input_token)
            {
            case t_id:
            case t_literal:
            case t_lparen:
                relation();
                return;
            case t_less:
            case t_lesse:
            case t_ne:
            case t_e:
            case t_large:
            case t_largee:
            case t_rparen:
            case t_read:
            case t_write:
            case t_if:
            case t_while:
            case t_endif:
            case t_endwhile:
            case t_eof:
                return;
            default:
                input_token = scan();
            }
        }
    }
}

void relation_tail() {
    try {
        switch (input_token) {
        case t_less:
        case t_lesse:
        case t_ne:
        case t_e:
        case t_large:
        case t_largee:
            //cout << "predict relation_tail --> relation_op relation" << endl;
            bool_op();
            relation();
            break;
        case t_id:
        case t_read:
        case t_write:
        case t_if:
        case t_while:
        case t_endif:
        case t_endwhile:
        case t_eof:
            //cout << "predict relation_tail --> epsilon" << endl;
            break;          /*  epsilon production */
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true)
        {
            switch (input_token)
            {
            case t_less:
            case t_lesse:
            case t_ne:
            case t_e:
            case t_large:
            case t_largee:
                relation_tail();
                return;
            case t_rparen:
            case t_id:
            case t_read:
            case t_write:
            case t_if:
            case t_while:
            case t_endif:
            case t_endwhile:
            case t_eof:
                return;
            default:
                input_token = scan();
            }
        }
    }
}

void term_tail () {
    try {
        switch (input_token) {
        case t_add:
        case t_sub:
            //cout << "predict term_tail --> add_op term term_tail" << endl;
            add_op();
            term();
            term_tail();
            break;
        case t_less:
        case t_lesse:
        case t_ne:
        case t_e:
        case t_large:
        case t_largee:
        case t_rparen:
        case t_id:
        case t_read:
        case t_write:
        case t_if:
        case t_while:
        case t_endif:
        case t_endwhile:
        case t_eof:
            //cout << "predict term_tail --> epsilon" << endl;
            break;          /*  epsilon production */
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true)
        {
            switch (input_token)
            {
            case t_add:
            case t_sub:
                term_tail();
                return;
            case t_less:
            case t_lesse:
            case t_ne:
            case t_e:
            case t_large:
            case t_largee:
            case t_rparen:
            case t_id:
            case t_read:
            case t_write:
            case t_if:
            case t_endif:
            case t_endwhile:
            case t_while:
            case t_eof:
                return;
            default:
                input_token = scan();
            }
        }
    }
    
}

void term () {
    try {
        switch (input_token) {
        case t_id:
        case t_literal:
        case t_lparen:
            //cout << "predict term --> factor factor_tail" << endl;
            factor();
            factor_tail();
            break;
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true)
        {
            switch (input_token)
            {
            case t_id:
            case t_literal:
            case t_lparen:
                term();
                return;
            case t_add:
            case t_sub:
            case t_less:
            case t_lesse:
            case t_ne:
            case t_e:
            case t_large:
            case t_largee:
            case t_rparen:
            case t_read:
            case t_write:
            case t_if:
            case t_while:
            case t_endif:
            case t_endwhile:
            case t_eof:
                return;
            default:
                input_token = scan();
            }
        }
    }
}

void factor_tail () {
    try {
        switch (input_token) {
        case t_mul:
        case t_div:
            //cout << "predict factor_tail --> mul_op factor factor_tail" << endl;
            mul_op();
            factor();
            factor_tail();
            break;
        case t_less:
        case t_lesse:
        case t_ne:
        case t_e:
        case t_large:
        case t_largee:
        case t_rparen:
        case t_id:
        case t_read:
        case t_write:
        case t_if:
        case t_while:
        case t_endif:
        case t_endwhile:
        case t_add:
        case t_sub:
        case t_eof:
            //cout << "predict factor_tail --> epsilon" << endl;
            break;          /*  epsilon production */
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true)
        {
            switch (input_token)
            {
            case t_mul:
            case t_div:
                factor_tail();
                return;
            case t_less:
            case t_lesse:
            case t_ne:
            case t_e:
            case t_large:
            case t_largee:
            case t_rparen:
            case t_id:
            case t_read:
            case t_write:
            case t_if:
            case t_while:
            case t_endif:
            case t_endwhile:
            case t_add:
            case t_sub:
            case t_eof:
                return;
            default:
                input_token = scan();
            }
        }
    }
}

void factor () {
    try {
        switch (input_token) {
        case t_id:
            //cout << "predict factor --> id" << endl;
            std::cout << "(id \"" << token_image << "\")";
            match(t_id);
            break;
        case t_literal:
            //cout << "predict factor --> literal" << endl;
            std::cout << "(num \"" << token_image << "\")";
            match(t_literal);
            break;
        case t_lparen:
            //cout << "predict factor --> lparen expr rparen" << endl;
            std::cout << "(";
            match(t_lparen);
            expr();
            std::cout << ")";
            match(t_rparen);
            break;
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError){
        while (true)
        {
            switch (input_token)
            {
            case t_lparen:
            case t_id:
            case t_literal:
                factor();
                return;
            case t_less:
            case t_lesse:
            case t_ne:
            case t_e:
            case t_large:
            case t_largee:
            case t_rparen:
            case t_read:
            case t_write:
            case t_if:
            case t_while:
            case t_endif:
            case t_endwhile:
            case t_add:
            case t_sub:
            case t_eof:
            case t_mul:
            case t_div:
                return;
            default:
                input_token = scan();
            }
        }
    }
}

void bool_op() {
    try {
        switch (input_token) {
        case t_less:
            //cout << "predict relation_op --> less" << endl;
            std::cout << " < ";
            match(t_less);
            break;
        case t_lesse:
            //cout << "predict relation_op --> less_or_equal" << endl;
            std::cout << " <= ";
            match(t_lesse);
            break;
        case t_large:
            //cout << "predict relation_op --> greater" << endl;
            std::cout << " > ";
            match(t_large);
            break;
        case t_largee:
            //cout << "predict relation_op --> greater_or_equal" << endl;
            std::cout << " >= ";
            match(t_largee);
            break;
        case t_ne:
            //cout << "predict relation_op --> not_equal" << endl;
            std::cout << " <> ";
            match(t_ne);
            break;
        case t_e:
            //cout << "predict relation_op --> equal" << endl;
            std::cout << " == ";
            match(t_e);
            break;
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true) {
            switch (input_token)
            {
            case t_less:
            case t_lesse:
            case t_large:
            case t_largee:
            case t_ne:
            case t_e:
                bool_op();
                return;
            case t_lparen:
            case t_id:
            case t_literal:
                return;
            default:
                input_token = scan();
            }
        }
    }
}

void add_op () {
    try {
        switch (input_token) {
        case t_add:
            //cout << "predict add_op --> add" << endl;
            std::cout << " + ";
            match(t_add);
            break;
        case t_sub:
            //cout << "predict add_op --> sub" << endl;
            std::cout << " - ";
            match(t_sub);
            break;
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true) {
            switch (input_token)
            {
            case t_add:
            case t_sub:
                add_op();
                return;
            case t_lparen:
            case t_id:
            case t_literal:
                return;
            default:
                input_token = scan();
            }
        }
    }
}

void mul_op () {
    try {
        switch (input_token) {
        case t_mul:
            //cout << "predict mul_op --> mul" << endl;

            std::cout << " * ";
            match(t_mul);
            break;
        case t_div:
            //cout << "predict mul_op --> div" << endl;
            std::cout << " / ";
            match(t_div);
            break;
        default: error(); throw SyntaxError();
        }
    }
    catch (SyntaxError) {
        while (true) {
            switch (input_token)
            {
            case t_mul:
            case t_div:
                mul_op();
                return;
            case t_lparen:
            case t_id:
            case t_literal:
                return;
            default:
                input_token = scan();
            }
        }
    }
}

int main () {
    input_token = scan ();
    program ();
    return 0;
}