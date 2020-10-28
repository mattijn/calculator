from spi import Lexer, Parser, SemanticAnalyzer, Interpreter, LexerError, ParserError, SemanticError

class TestCallStack:
    def __init__(self):
        self._records = []

    def push(self, ar):
        self._records.append(ar)

    def pop(self):
        # do nothing
        pass

    def peek(self):
        return self._records[-1]

def interpreter(text):
    
    lexer = Lexer(text)
    try:
        parser = Parser(lexer)
        tree = parser.parse()
    except (LexerError, ParserError) as e:
        return (None, e.message)

    semantic_analyzer = SemanticAnalyzer()
    try:
        semantic_analyzer.visit(tree)
    except SemanticError as e:
        return (None, e.message)


    interpreter = Interpreter(tree)
    interpreter.call_stack = TestCallStack()
    return interpreter

def eval(expression):
    text = f"""PROGRAM CustomCalculator;
        VAR
            formula : REAL;
        BEGIN
            formula := {expression}
        END.
    """
    
    ipt = interpreter(text)
    if not isinstance(ipt, tuple):
        ipt.interpret()
        value = ipt.call_stack.peek()['formula']
        return value
    else:
        return ipt[1]