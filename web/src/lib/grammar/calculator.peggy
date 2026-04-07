{
  const binaryNode = (operator, left, right) => ({ type: "binary", operator, left, right });
  const unaryNode = (operator, argument) => ({ type: "unary", operator, argument });
}

expression
  = head:additive tail:(_ op:("+" / "-" / "*" / "x" / "×" / "/" / "÷") _ rhs:additive { return { op, rhs }; })* {
      return tail.reduce((acc, item) => binaryNode(item.op, acc, item.rhs), head);
    }

additive
  = head:power tail:(_ op:("↑" / "↓" / "⇓") _ rhs:power { return { op, rhs }; })* {
      return tail.reduce((acc, item) => binaryNode(item.op, acc, item.rhs), head);
    }

power
  = sign:("+" / "-" / "/" / "÷") _ value:power {
      return unaryNode(sign, value);
    }
  / primary

primary
  = number
  / "(" _ inner:expression _ ")" { return inner; }

number
  = n:$([0-9]+ ("." [0-9]+)?) { return { type: "number", value: Number(n) }; }

_ "whitespace"
  = [ \t\n\r]*
