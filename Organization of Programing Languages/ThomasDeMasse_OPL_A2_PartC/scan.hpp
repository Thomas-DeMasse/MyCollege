/* Definitions the scanner shares with the parser
    Michael L. Scott, 2008-2020.
*/

typedef enum {t_read, t_write, t_id, t_literal, t_gets,
              t_add, t_sub, t_mul, t_div, t_lparen, t_rparen, t_eof, t_while, t_if, t_endif, t_endwhile, t_less, t_lesse, t_ne,
              t_e, t_large, t_largee} token;

#define MAX_TOKEN_LEN 128
extern char token_image[MAX_TOKEN_LEN];

extern token scan();
