(* Start utop
   #use parser.ml
   #use interpreter.ml*)

   #load "str.cma";;

   #use "parser.ml";;
   
   
   type ast_sl = ast_s list
   and ast_s =
   | AST_error
   | AST_assign of (string * ast_e)
   | AST_read of string
   | AST_write of ast_e
   | AST_if of (ast_c * ast_sl)
   | AST_while of (ast_c * ast_sl)
   and ast_e =
   | AST_binop of (string * ast_e * ast_e)
   | AST_id of string
   | AST_num of string
   and ast_c = (string * ast_e * ast_e);;
   
   
   let rec ast_ize_P (p:parse_tree) : ast_sl =
     match p with
     | PT_nt ("P", slist)    (* P -> SL $$ *)
       -> ast_ize_SL (hd slist)
       
     | _ -> raise (Failure "malformed parse tree in ast_ize_P")
   
   and ast_ize_SL (sl:parse_tree) : ast_sl =
     match sl with
     | PT_nt ("SL", []) -> []
     
     | PT_nt ("SL", head::tail) (* SL -> S SL *)
         -> [ast_ize_S head] @ (ast_ize_SL (hd tail))
         
     | _ -> raise (Failure "malformed parse tree in ast_ize_SL")
   
   and ast_ize_S (s:parse_tree) : ast_s =
     match s with
     | PT_nt ("S", [PT_id lhs; PT_term ":="; expr])
           -> AST_assign (lhs, (ast_ize_expr expr))
     | PT_nt ("S", [PT_term "read"; PT_id id])
       -> AST_read (id)
   
     | PT_nt ("S", [PT_term "write"; expr])	
         -> AST_write (ast_ize_expr expr)
   
     | PT_nt ("S", [PT_term "if"; c; sl; PT_term "end"])	
         -> AST_if ((ast_ize_C c), (ast_ize_SL sl))
   
     | PT_nt ("S", [PT_term "while"; c; sl; PT_term "end"])	
         -> AST_while((ast_ize_C c), (ast_ize_SL sl))
   
     | _ -> raise (Failure "malformed parse tree in ast_ize_S")
   
   and ast_ize_expr (e:parse_tree) : ast_e =
     
     match e with
     
     | PT_nt ("E", [term; termtail])        
     -> ast_ize_expr_tail (ast_ize_expr (term)) termtail
   
     | PT_nt ("T", [factor; factortail])        
     -> ast_ize_expr_tail (ast_ize_expr (factor)) factortail 
    
     | PT_nt ("F", p)            
       -> ( match p with
            | [PT_term "("; expr; PT_term ")"] -> ast_ize_expr(expr)
      | [PT_id (id)] -> AST_id (id)
            | [PT_num (num)] -> AST_num (num) 
            | _ -> raise (Failure "malformed parse tree in ast_ize_expr")
          )
   
     | _ -> raise (Failure "malformed parse tree in ast_ize_expr")
   
   and ast_ize_expr_tail (lhs:ast_e) (tail:parse_tree) :ast_e =
     
     match tail with
    
     | PT_nt ("TT", []) -> lhs	
     
     | PT_nt ("TT", [PT_nt ("ao", [PT_term "+"]); t; tt])                 
       -> ast_ize_expr_tail (AST_binop("+", lhs, ast_ize_expr t)) tt
     
     | PT_nt ("TT", [PT_nt ("ao", [PT_term "-"]); t; tt])	                  
       -> ast_ize_expr_tail (AST_binop("-", lhs, ast_ize_expr t)) tt
     
     | PT_nt ("FT", []) -> lhs
   
     | PT_nt ("FT", [PT_nt ("mo", [PT_term "*"]); f; ft])
     -> ast_ize_expr_tail (AST_binop("*", lhs, ast_ize_expr f)) ft
     
     | PT_nt ("FT", [PT_nt ("mo", [PT_term "/"]); f; ft])
     -> ast_ize_expr_tail (AST_binop("/", lhs, ast_ize_expr f)) ft
   
     | _ -> raise (Failure "malformed parse tree in ast_ize_expr_tail")
   
   and ast_ize_C (c:parse_tree) : ast_c =
     match c with
   
     | PT_nt ("C", [lhs; PT_nt ("ro", [PT_term "<="]); rhs])
       -> ("<=", ast_ize_expr lhs, ast_ize_expr rhs)
   
     | PT_nt ("C", [lhs; PT_nt ("ro", [PT_term "=>"]); rhs])
       -> ("=>", ast_ize_expr lhs, ast_ize_expr rhs)
   
     | PT_nt ("C", [lhs; PT_nt ("ro", [PT_term ">"]); rhs])
       -> (">", ast_ize_expr lhs, ast_ize_expr rhs)
   
     | PT_nt ("C", [lhs; PT_nt ("ro", [PT_term "<"]); rhs])
       -> ("<", ast_ize_expr lhs, ast_ize_expr rhs)
   
     | PT_nt ("C", [lhs; PT_nt ("ro", [PT_term "<>"]); rhs])
       -> ("<>", ast_ize_expr lhs, ast_ize_expr rhs)
   
     | PT_nt ("C", [lhs; PT_nt ("ro", [PT_term "="]); rhs])
       -> ("=", ast_ize_expr lhs, ast_ize_expr rhs)
   
     | _ -> raise (Failure "malformed parse tree in ast_ize_C")
   ;;
   
(*******************************************************************
    Interpreter
 *******************************************************************)

 type memory = (string * int) list;;

type value = 
| Value of int
| Error of string;;

let str_cat sep a b =
  match (a, b) with
  | (a, "") -> a
  | ("", b) -> b
  | (_, _) -> a ^ sep ^ b;;

let rec interpret (ast:ast_sl) (full_input:string) : string =
  let inp = split (regexp "[ \t\n\r]+") full_input in
  let (_, _, _, outp) = interpret_sl ast [] inp [] in
    (fold_left (str_cat " ") "" outp) ^ "\n"

and interpret_sl (sl:ast_sl) (mem:memory)
                 (inp:string list) (outp:string list)
    : bool * memory * string list * string list =
    
   match sl with
   | [] -> (true, mem, inp, outp)
   | head :: rest
     -> let (_, mem2, in2, out2) = interpret_s head mem inp outp in
     interpret_sl rest mem2 in2 out2
     
and interpret_s (s:ast_s) (mem:memory)
                (inp:string list) (outp:string list)
    : bool * memory * string list * string list =
  match s with
  | AST_assign(id, expr) -> interpret_assign id expr mem inp outp
  | AST_read(id)         -> interpret_read id mem inp outp
  | AST_write(expr)      -> interpret_write expr mem inp outp
  | AST_if(cond, sl)     -> interpret_if cond sl mem inp outp
  | AST_while(cond, sl)  -> interpret_while cond sl mem inp outp
  | AST_error            -> raise (Failure "cannot interpret erroneous tree")

and interpret_assign (lhs:string) (rhs:ast_e) (mem:memory)
                     (inp:string list) (outp:string list)
    : bool * memory * string list * string list =
  let (rhsv, mem2) = interpret_expr rhs mem in
  match rhsv with
  | Error (msg) -> (false, mem2, inp, outp @ [msg])
  | Value (rhs_val)
    -> let mem3 = List.remove_assoc lhs mem2 in
       (true, (lhs, rhs_val) :: mem3, inp, outp)

and interpret_read (id:string) (mem:memory)
                   (inp:string list) (outp:string list)
    : bool * memory * string list * string list =
   match inp with  
  | [] -> (false, mem, inp, outp @ ["Unexpected end of input"])
    | head :: rest
      -> try let num = int_of_string head in
             let mem2 = List.remove_assoc id mem in
               (true, (id, num) :: mem2, rest, outp)
       with
      | Failure ("int_of_string") -> (false, mem, inp, outp @ ["Non-numeric input"])

and interpret_write (expr:ast_e) (mem:memory)
                    (inp:string list) (outp:string list)
    : bool * memory * string list * string list =
   let (expr_val, mem2) = interpret_expr expr mem in
   match expr_val with
   | Error (msg) -> (false, mem2, inp, outp @ [msg])
   | Value (num) -> (true, mem2, inp, outp @ [string_of_int num])

and interpret_if (cond:ast_c) (sl:ast_sl) (mem:memory)
                 (inp:string list) (outp:string list)
    : bool * memory * string list * string list =
  let (op, lo, ro) = cond in
  let (cond_val, mem2) = interpret_cond (op, lo, ro) mem in
  match cond_val with
  | Error (msg) -> (false, mem2, inp, outp @ [msg])
  | Value (continue)
        -> if continue = 0 then (true, mem2, inp, outp)
           else interpret_sl sl mem2 inp outp

and interpret_while (cond:ast_c) (sl:ast_sl) (mem:memory)
                    (inp:string list) (outp:string list)
    : bool * memory * string list * string list =
  let (op, lo, ro) = cond in
  let (cond_val, mem2) = interpret_cond (op, lo, ro) mem in
  match cond_val with
  | Error (msg) -> (false, mem2, inp, outp @ [msg])
  | Value (continue)
    -> if continue = 0 then (true, mem2, inp, outp)
       else let (ok, new_mem, new_input, new_output) = interpret_sl sl mem2 inp outp in
            interpret_while cond sl new_mem new_input new_output

and interpret_expr (expr:ast_e) (mem:memory) : value * memory =
  match expr with
  | AST_num num
    -> ( try (Value (int_of_string num), mem)
         with Failure ("int_of_string") -> (Error ("Non-numeric literal: " ^ num), mem) )
         
  | AST_id id
    -> (try (Value (List.assoc id mem), mem)
        with Not_found -> (Error ("id not found within memory"), mem) )
    
  | AST_binop (op, lo, ro) ->
    let (lov, mem1) = interpret_expr lo mem in
    let (rov, mem2) = interpret_expr ro mem1 in
    match lov with
    | Error (msg) -> (Error (msg), mem)
    | Value (lovi)
      -> ( match rov with
           | Error (msg) -> (Error (msg), mem)
           | Value (rovi)
             -> ( match op with
                  | "+" -> (Value (lovi + rovi), mem2)
                  | "-" -> (Value (lovi - rovi), mem2)
                  | "*" -> (Value (lovi * rovi), mem2)
                  | "/"
                     -> if rovi = 0 then (Error ("Division by 0"), mem2)
                       else (Value (lovi / rovi), mem2)
                  | _ -> (Error ("Ivalid binary operator: " ^ op), mem2)
                )
         )

and interpret_cond ((op:string), (lo:ast_e), (ro:ast_e)) (mem:memory)
    : value * memory =
  let int_of_bool b = if b then 1 else 0 in
  let (lov, mem1) = interpret_expr lo mem in
  let (rov, mem2) = interpret_expr ro mem1 in
  match lov with
  | Error (msg) -> (Error (msg), mem)
  | Value (lovi)
    -> ( match rov with
         | Error (msg) -> (Error (msg), mem)
         | Value (rovi)
           -> ( match op with
                | "="  -> (Value (int_of_bool (lovi =  rovi)), mem2)
                | "<>" -> (Value (int_of_bool (lovi <> rovi)), mem2)
                | "<"  -> (Value (int_of_bool (lovi <  rovi)), mem2)
                | ">"  -> (Value (int_of_bool (lovi >  rovi)), mem2)
                | "<=" -> (Value (int_of_bool (lovi <= rovi)), mem2)
                | ">=" -> (Value (int_of_bool (lovi >= rovi)), mem2)
                | _ -> (Error ("Invalid relational operator: " ^ op), mem2)
              )
       )
;;

let sum_ave_parse_tree = parse ecg_parse_table sum_ave_prog;;
let sum_ave_syntax_tree = ast_ize_P sum_ave_parse_tree;;

let primes_parse_tree = parse ecg_parse_table primes_prog;;
let primes_syntax_tree = ast_ize_P primes_parse_tree;;

let ecg_run prog inp =
  interpret (ast_ize_P (parse ecg_parse_table prog)) inp;;