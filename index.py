import streamlit as st
from info import header
from info import relations_power_root_log
from info import usage_example
from calculator import calc

page_header = st.beta_expander("Calculator", expanded=False)
with page_header:
    header()

calc = calc()

page_rel_prl = st.beta_expander("Overview relations power, root and log", expanded=False)
with page_rel_prl:
    relations_power_root_log()

examples = st.beta_expander("Example on usage", expanded=False)
with examples:
    usage_example()