const mindReader = {
    // The page currently displayed, indexed at 0 (-1 indicates uninitialized)
    currentPage: -1,

    // An array of symbols to map numbers onto, length of 9
    // Index 0 will be the symbol used to 'guess' the users number
    symbols: ['#', 'V', '%', '+', 'X', '@', '/', '$', '?'],

    // An array of the individual pages of the application, represented 
    //   as objects
    //   Their properties represent:
    //      instructions: the content of the header
    //      advbth: the button in the center of the screen that advances the
    //          application, with a flag to indicate if it is visible on that
    //          screen and a string of its text content
    //      sub: the subtitle undernearth the center button with additional
    //          information for the user, with a flag to indicate if any text
    //          is visible and a string of that text if so (otherwise empty)
    //      startbtnIsIcon: an indicator of whether the start button has an
    //          icon for its content (true on pages 2-5), or has a text message
    //          (true on the 1st page)  
    pages: [
        {
            // Page 1
            instructions: 'I can read your mind',
            advbtn: {
                visible: false,
                text: ''
            },
            sub: {
                visible: false,
                text: ''
            },
            startbtnIsIcon: false
        }, 
        {
            // Page 2
            instructions: 'Pick a number from 01 - 99',
            advbtn: {
                visible: true,
                text: 'NEXT'
            },
            sub: {
                visible: true,
                text: '<p>when you have your number click next</p>'
            },
            startbtnIsIcon: true
        }, 
        {
            // Page 3
            instructions: 'Add both digits together to get a new number',
            advbtn: {
                visible: true,
                text: 'NEXT'
            },
            sub: {
                visible: true,
                text: '<p>Ex: 14 is 1 + 4 = 5</p><p>click next to proceed</p>'
            },
            startbtnIsIcon: true
        }, 
        {
            // Page 4
            instructions: 'Subtract your new number from the original number',
            advbtn: {
                visible: true,
                text: 'NEXT'
            },
            sub: {
                visible: true,
                text: '<p>Ex: 14 - 5 = 9</p><p>click next to proceed</p>'
            },
            startbtnIsIcon: true
        }, 
        {
            // Page 5
            instructions: 'assignSymbols()',
            advbtn: {
                visible: true,
                text: 'REVEAL'
            },
            sub: {
                visible: true,
                text: '<p>Find your new number</p><p>Note the symbol beside the number</p>'
            },
            startbtnIsIcon: true
        }, 
        {
            // Page 6
            instructions: 'symbols[0]',
            advbtn: {
                visible: false,
                text: ''
            },
            sub: {
                visible: true,
                text: '<p>Your symbol is:</p><p>' + 'symbols[0]' + '</p>'
            },
            startbtnIsIcon: true
        }
    ],

    // A method called internally to set the value of pages[4].instructions.
    //   It expands out the symbols array to cover all two-digit integers from
    //   0-99, converts that to an array with strings pairing the index and the
    //   character in the previous array, and then converts that into a string
    //   with all of the values joined together by a linebreak character
    assignSymbols: function () {
        // Copy the symbols array 10 times, then add one more to cover 0-99
        const longSymbols = this.symbols.concat(this.symbols, this.symbols,
            this.symbols, this.symbols, this.symbols, this.symbols,
            this.symbols, this.symbols, this.symbols, this.symbols);
        longSymbols.push(this.symbols[0]);
        // console.log(longSymbols.length);    //Should be 100
        expandedSymbols = longSymbols.map(expand);
        return expandedSymbols.join("<br>");

        // A callback function used in assignSymbols for an Array.map() call
        //   Combines the index and value of the called array into a string
        function expand (value, index) {
            return index + " - " + value;
        }
    },

    // A method used to change the state of the application by changing the
    //   currentPage property to the passed page value. This is called once
    //   when the page loads to set the display to the starting page; 
    //   subsequent calls are made when a button in the application is clicked.
    setPage: function (newPage) {
        // Check to see if setPage has been called before; if not, finish
        //   initializing mindReader
        if (this.currentPage === -1) {
            this.pages[4].instructions = this.assignSymbols();
            this.pages[5].instructions = this.symbols[0];
            this.pages[5].sub.text = '<p>Your symbol is:</p><p>' + 
                this.symbols[0] + '</p>';
        }

        // Set the current page to the passed value
        this.currentPage = newPage;

        // Display the current page's layout

        this.displayPage();
        console.log(this.currentPage);
    },

    // This function writes the HTML of the current page, and creates event
    //   handlers to change the page when navigation buttons are clicked
    displayPage: function () {
        // Get a reference to target html element to modify
        const appAnchor = document.getElementById('mind-reader');
        // Get a reference to its parent
        const appParent = appAnchor.parentNode;

        // Create an element to replace it
        const newPage = document.createElement('div');
        newPage.id = 'mind-reader';

        // Set up event handlers
        //  Option to perform each once
        const doOnce = {
            once: true
        }
        
        // Pass on the object context so I can use setPage and currentPage
        const advanceHandler = this.advance.bind(this);
        const resetHandler = this.reset.bind(this);
        
        // Create html content based on the current page to place inside
        const fragment = new DocumentFragment();

        // Create the header
        const header = document.createElement('h6');
        header.id = 'instructions';
        header.innerHTML = this.pages[this.currentPage].instructions;
        header.classList.add('display-6');
        fragment.append(header);

        // Create the center button
        const advanceButton = document.createElement('button');
        advanceButton.id = 'advance';
        if (this.pages[this.currentPage]?.advbtn.visible) {
            advanceButton.className = "d-block";
            advanceButton.addEventListener('click', advanceHandler, doOnce);
        } else {
            advanceButton.className = "d-none";
        }
        advanceButton.textContent = this.pages[this.currentPage]?.advbtn.text;
        fragment.append(advanceButton);

        // Create the sub-header
        const subtext = document.createElement('div');
        subtext.id = "subtext";
        if (this.pages[this.currentPage]?.sub.visible) {
            subtext.className = "d-block";
        }
        else {
            subtext.className = "d-none";
        }
        subtext.innerHTML = this.pages[this.currentPage]?.sub.text;
        fragment.append(subtext);

        // Create the start button
        const startButton = document.createElement('button');
        startButton.id = "start";
        if (this.pages[this.currentPage]?.startbtnIsIcon) {
            startButton.innerHTML = "<img src='./img/arrow-counterclockwise.svg'>";
            startButton.addEventListener('click', resetHandler, doOnce);    
        }
        else  {
            startButton.innerHTML = "GO";
            startButton.addEventListener('click', advanceHandler, doOnce);
        }
        fragment.append(startButton);

        // Store the created fragment within the replacement div, then do the 
        //   replacement
        newPage.appendChild(fragment);
        appParent.replaceChild(newPage, appAnchor);
    }
    ,
    // A callback function that calls a function to increment the page
    advance: function () {
        this.setPage(this.currentPage + 1);
    },
    // A callback function that calls a function to return to the first page
    reset: function () {
        this.setPage(0);
    }
}

mindReader.setPage(0);