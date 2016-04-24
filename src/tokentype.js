/**
 * 
 * @type {{NUMBER: string, PLUS: string, MINUS: string, MULTIPLY: string, DIVIDE: string, OPEN_PAR: string,
 * CLOSE_PAR: string, END_STATEMENT: string, EOF: string, DECLARATION: string, ASSIGNMENT_BEGIN: string, 
 * IDENTIFIEFER: string, METHOD_CALL_BEGIN: string, ASSIGNMENT_AND_METHOD_CALL_END: string,
 * ARGUMENT_SEPARATOR: string}}
 */
var TokenType = {
    NUMBER: "Number",

    PLUS: "Plus",
    MINUS: "Minus",
    MULTIPLY: "Multiply",
    DIVIDE: "Divide",
    OPEN_PAR: "Open_Par",
    CLOSE_PAR: "Close_Par",

    END_STATEMENT: "End_Statement",
    EOF: "EOF",
    DECLARATION: "Declaration",
    ASSIGNMENT_BEGIN: "Assignment_Begin",
    IDENTIFIEFER: "Identifier",

    METHOD_CALL_BEGIN: "Method_Call_Begin",
    ASSIGNMENT_AND_METHOD_CALL_END: "Assignment_And_Method_Call_End",
    ARGUMENTS_END: "Arguments_End",
    ARGUMENT_SEPARATOR: "Argument_Separator",
    ACTION_CREATE_BEGIN: "Action_Create_Begin",
    ACTION_CREATE_END: "Action_Create_End",
    ACTION_ARGUMENTS: "Action_Arguments",
    ACTION_RETURN: "Action_Return"
};

module.exports = TokenType;