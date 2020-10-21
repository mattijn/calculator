import streamlit as st

def header():
    link = '[Numbers](https://homepages.cwi.nl/~steven/Talks/2019/11-21-dijkstra/Numbers.pdf)'
    st.markdown(
        f'Deze pagina implementeert de rekenmachine zoals beschreven in het boek {link}. Het boek _Numbers_ is geschreven door Steven Pemberton, docent CWI-Amsterdam.', 
        unsafe_allow_html=True
    )


def relations_power_root_log():
    st.markdown(f'The nice thing about the new notation is that it far more visually obviously expresses the relationships between power, root and log. So let us summarise the relationships, to more clearly show the patterns involved:')
    r0c0, r0c1, r0c2 = st.beta_columns(3)
    r0c0.success('Operator')
    r0c1.success('To get a')
    r0c2.success('To get b')

    r1c0, r1c1, r1c2 = st.beta_columns(3)
    r1c0.info('a+b  \n a-b')
    r1c1.info('(a+b)−b  \n (a−b)+b')
    r1c2.info('(a+b)−a  \n a−(a−b)')

    r2c0, r2c1, r2c2 = st.beta_columns(3)
    r2c0.info('a×b  \n a÷b')
    r2c1.info('(a×b)÷b  \n (a÷b)×b')
    r2c2.info('(a×b)÷a  \n a÷(a÷b)')

    r3c0, r3c1, r3c2 = st.beta_columns(3)
    r3c0.info('a↑b  \n a↓b  \n a⇓b')
    r3c1.info('(a↑b)↓b  \n (a↓b)↑b  \n b↑(a⇓b)')
    r3c2.info('(a↑b)⇓a  \n a⇓(a↓b)  \n a↓(a⇓b)')
 