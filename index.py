import streamlit as st
from info import header
from info import relations_power_root_log
from calculator import calc

page_header = st.beta_expander("Rekenmachine", expanded=False)
with page_header:
    header()

calc = calc()

page_rel_prl = st.beta_expander("Overzicht relaties macht, wortel en log", expanded=False)
with page_rel_prl:
    relations_power_root_log()