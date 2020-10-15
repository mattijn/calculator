import streamlit as st

@st.cache()
def resolve_item(item):
    if not hasattr(st, '_store'):
        st._store = []    
    
    st._store.append(item)

    

output, ac = st.beta_columns((3,1))
with output:
    output_field = st.empty()
with ac:
    ac_button = st.button('AC')

seven, eight, nine, divi = st.beta_columns(4)
with seven:
    seven_button = st.button('7')
with eight:
    eight_button = st.button('8')
with nine:
    nine_button = st.button('9')
with divi:
    divi_button = st.button('÷')
    
four, five, six, multi = st.beta_columns(4)
with four:
    four_button = st.button('4')
with five:
    five_button = st.button('5')
with six:
    six_button = st.button('6')
with multi:
    multi_button = st.button('x')

one, two, three, minus = st.beta_columns(4)
with one:
    one_button = st.button('1')
with two:
    two_button = st.button('2')
with three:
    three_button = st.button('3')
with minus:
    minus_button = st.button('-')

zero, dot, equals, plus = st.beta_columns(4)
with zero:
    zero_button = st.button('0')
with dot:
    dot_button = st.button('.')
with equals:
    equals_button = st.button('=')
with plus:
    plus_button = st.button('+')

if ac_button:
    output_field.write('')
    st._store = []

if one_button:
    output_field.write('1')
    st._store.append('1')

if two_button:
    output_field.write('2')
    st._store.append('2')

if three_button:
    output_field.write('3')
    st._store.append('3')

if plus_button:
    output_field.write('+')
    st._store.append('+')

if equals_button:
    output_field.write(' '.join(st._store))
    
