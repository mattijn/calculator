from spi import Lexer, Parser, SemanticAnalyzer, Interpreter
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
    parser = Parser(lexer)
    tree = parser.parse()

    semantic_analyzer = SemanticAnalyzer()
    semantic_analyzer.visit(tree)

    interpreter = Interpreter(tree)
    interpreter.call_stack = TestCallStack()
    return interpreter

def evaluate(expression):
    text = f"""PROGRAM CustomCalculator;
        VAR
            formula : REAL;
        BEGIN
            formula := {expression}
        END.
    """
    ipt = interpreter(text)
    ipt.interpret()
    value = ipt.call_stack.peek()['formula']
    return value