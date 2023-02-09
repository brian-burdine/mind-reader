# MIND READER
## Goals

Display a simple mindgame in a single html page using text for instructions and buttons to cycle through various display states. At load the page should display the first 'page'. When the user clicks on a button, the display should either advance to the next 'page' or reset to the first one. The pages will ask the user to select a number between 1-99, and on the fifth page assigns a symbol value to each number; the application must assign the same symbol to 0 and all multiples of 9 in range for the game to work.

## Variables

The entire application will be represented by a mindReader object, which will have the following properties:
- **header**: a reference to a h2 element in the html document
- **advanceButton**: a reference to a button element beneath the h2 element in the html document
- **subtext**: a reference to a div element beneath the first button element in the html document
- **startButton**: a reference to a button element in the bottom-right corner of the html document
- **currentPage**: an integer from 0 to 5, representing the six pages of the game
- **pages**: an array of page objects, with the first page at index 0 and the last at index 5. the page objects have these properties:
  - *instructions*: a string containing instructions for the game, to be written to the header. On page 5, behavior is a little more complicated; the header needs to contain a list of numbers from 0-81 with corresponding characters, displayed one number-character pair per line, that is scrollable. I'm not sure how I will make it scrollable yet, but the string will be made by calling the *assignSymbols* method to get an array and then combining the values of the array together with a linebreak `<br>` element
  - *advbtn*: an object containing properties describing the behavior of the advance button on that page, including:
    - *visible*: Boolean indicating if the button is visible (`true` on pages 2-5, `false` on pages 1 and 6)
    - *text*: string of displayed text (NEXT on pages 2-4, REVEAL on page 5, an empty string on pages 1 and 6)
  - *sub*: an object containing properties describing the subtext on that page, including:
    - *visible*: Boolean indicating if there is visible subtext on that page (`true` on pages 2-6, `false` on page 1)
    - *text*: a string containing things like examples of 'input', instructions on how to use the advance button, or results, wrapped in html tags, or an empty string on page 1
  - *startbtnIsIcon*: Boolean indicating if the content of the start button should be an icon or text. On pages 2-6 this will be `true`, and indicate that a return arrow icon (from Bootstrap Icons, probably) will be used for the button. On page 1, this is `false`, and the button will have the text 'GO'.
- **symbols**: an array of 9 random non-numeric characters to assign to the numbers 01-99

## Functions

The mindReader object has these methods:
- **setPage** (*pageIndex*)
  - When this is called, it sets the currentPage property to the passed index, then changes the page display to the appropriate member of pages. When called by a 'next' button, it should set the page to the current page index plus one. When called by 'reset' button, the page is instead set to 0.
  - Procedure:
    1. START **setPage**
    2. READ *pageIndex*
    3. SET *currentPage* = *pageIndex*
    4. SET the text content of *header* to the *instructions* property of *pages* at *currentPage*
    5. IF the *visible* property of the *advbtn* property of *pages* at *currentPage* is true
       - SET the visibility of *advanceButton* to visible
       - SET the text of *advanceButton* to the *text* property of the *advbtn* property of *pages* at *currentPage*
    6. ELSE
       - SET the visibility of *advanceButton* to not visible
       - SET the text of *advanceButton* to the *text* property of the *advbtn* property of *pages* at *currentPage* (not strictly necessary, but I don't like leaving garbage content behind)
    7. ENDIF
    8. IF the *visible* property of the *sub* property of *pages* at *currentPage* is true
       - SET the visibility of *subtext* to visible
       - SET the text of *subtext* to the *text* property of the *sub* property of *pages* at *currentPage*
    9. ELSE
       - SET the visibility of *subtext* to not visible
       - SET the text of *subtext* to the *text* property of the *sub* property of *pages* at *currentPage* (again, not strictly necessary)
    10. ENDIF
    11. IF the *startBtnIsIcon* property of *pages* at *currentPage* is true
        - SET the inner HTML of *startButton* to the address of the counterclockwise arrow icon 
    12. ELSE
        - SET the inner HTML of *startButton* to the word 'GO'
    13. ENDIF
    14. END **setPage**
- **assignSymbols**
  - When called, assigns a symbol from the *symbols* array to the numbers displayed on page 5, which I believe range from 0-81. All multiples of 9 need to share the same value; the simplest way to ensure this is to repeatedly duplicate the contents of the *symbols* array until it has entries up to 81 (82 total). This will be called when the mindReader object is initialized.
  - Procedure:
    1. START **assignSymbols**
    2. INIT *expandedSymbols* array
    3. SET *expandedSymbols* to the *symbols* array, duplicated 9 times
    4. ADD an additional copy of the character at index 0 of the *symbols* array to *expandedSymbols*, to get to an index of 81 (do a console.log here to check length, maybe)
    5. CALL a function *expand* to transform the values in *expandedSymbols* to a string with the format '(index of value) - (value)'
    6. PASS OUT *expandedSymbols*
    7. END **assignSymbols**

## Procedure
1. START
2. INIT mindReader
3. CALL mindReader.setPage(0)
4. INPUT a 'click' event on a button, I guess
TO-DO: figure out where the click event handlers should go