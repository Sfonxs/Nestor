# Nestor
A sentence based programming language.
This project is not completely finished.

Some example code for the current version 0.0.1:
```
Create container aNumber.
Create container mySecondNumber.

Fill aNumber with 10.
Fill mySecondNumber with 90.

Create container result.
Fill result with first aNumber added to mySecondNumber then divided by 2.

Do action Show with result as items.

Start action creation of CustomSum with needed items nr1 and nr2.
    End action with nr1 added to nr2.
End action creation.

Start action creation of MultiplyTheSum with needed items number1 and number2.
    End action with
        Do action CustomSum with number1 and number2 as items
        multiplied by
        Do action CustomSum with number1 and number2 as items.
End action creation.

Create container customMultiplyResult.
Fill customMultiplyResult with Do action MultiplyTheSum with 5 and 5 as items.

Do action Show with customMultiplyResult as items.
```

