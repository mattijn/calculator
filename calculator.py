import streamlit as st
import sessionstore
from eval import evaluate

store = sessionstore.get(display=[], eval=[])

def reset_store():
    global store
    store.display = []
    store.eval = []

def pop_store():
    global store
    del store.display[-1]
    del store.eval[-1]

def append_store(item_disp, item_eval=None):
    global store
    store.display.append(item_disp)
    if item_eval:
        store.eval.append(item_eval)
    else:
        store.eval.append(item_disp)
    output_field.write(store.display)    


output, delete, ac = st.beta_columns((3,1,2))
output_field = output.empty()
del_buttion = delete.button('⌫')
ac_button = ac.button('AC')

seven, eight, nine, bracket_l, bracket_r, _ = st.beta_columns(6)
seven_button = seven.button('7')
eight_button = eight.button('8')
nine_button = nine.button('9') 
bracket_l_button = bracket_l.button('(')
bracket_r_button = bracket_r.button(')')    
    
four, five, six, pwr_up, pwr_down, pwr_db_down = st.beta_columns(6)
four_button = four.button('4')
five_button = five.button('5')
six_button = six.button('6')
pwr_up_button = pwr_up.button('↑') 
pwr_down_button = pwr_down.button('↓')
pwr_db_down_button = pwr_db_down.button('⇓')   

one, two, three, multi, divi, _ = st.beta_columns(6)
one_button = one.button('1')
two_button = two.button('2')
three_button = three.button('3')
multi_button = multi.button('x')   
divi_button = divi.button('÷')     


zero, dot, equals, plus, minus, _ = st.beta_columns(6)
zero_button = zero.button('0')
dot_button = dot.button('.')
equals_button = equals.button('=')
plus_button = plus.button('+')
minus_button = minus.button('-')    

if ac_button:
    output_field.write('')
    reset_store()

if del_buttion:
    pop_store()    
    output_field.write(store.display)

if one_button:
    append_store('1')

if two_button:
    append_store('2')

if three_button:
    append_store('3')

if four_button:
    append_store('4')

if five_button:
    append_store('5')

if six_button:
    append_store('6')

if seven_button:
    append_store('7')

if eight_button:
    append_store('8')

if nine_button:
    append_store('9')

if zero_button:
    append_store('0')

if dot_button:
    append_store('.') 

if plus_button:
    append_store('+')

if minus_button:
    append_store('-') 

if multi_button:
    append_store('x', '*') 

if divi_button:
    append_store('÷', '/')

if pwr_up_button:
    append_store('↑', '^')

if pwr_down_button:
    output_field.write('↓')
    store.input.append('wortel') 

if pwr_db_down_button:
    output_field.write('⇓')
    store.input.append('log') 

if bracket_l_button:
    output_field.write('(')
    store.input.append('(') 

if bracket_r_button:
    output_field.write(')')
    store.input.append(')')         

if equals_button:
    output_field.write(evaluate(''.join(store.input)))
    
