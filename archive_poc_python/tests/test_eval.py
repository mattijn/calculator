from evaluate import eval

def test_unary_divide():
    assert eval('//2') == 2

def test_pwr_up():
    assert eval('2↑3') == 8

def test_pwr_down():
    assert eval('8↓3') == 2

def test_pwr_db_down():
    assert eval('8⇓2') == 3