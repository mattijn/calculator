from eval import evaluate    

def test_unary_divide():
    assert evaluate('//2') == 2

def test_pwr_up():
    assert evaluate('2↑3') == 8

def test_pwr_down():
    assert evaluate('8↓3') == 2

def test_pwr_db_down():
    assert evaluate('8⇓2') == 3