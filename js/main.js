const mindReader = {
    // The page currently displayed, indexed at 0
    currentPage: -1,

    // An array of symbols to map numbers onto, length of 9
    // Index 0 will be the symbol used to 'guess' the users number
    symbols: ['#', 'V', '%', '+', 'X', '@', '/', '$', '?'],

    // References to document elements to modify to display the application
    header: document.getElementById('instructions'),
    advanceButton: document.getElementById('advance'),
    subtext: document.getElementById('subtext'),
    startButton: document.getElementById('start'),

    // An array of the individual pages of the application, represented 
    // as an object
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

    // A method called internally to set the value of pages[4].instructions
    // It expands out the symbols array to cover all two-digit integers from
    // 0-99, converts that to an array with strings pairing the index and the
    // character in the previous array, and then converts that into a string
    // with all of the values joined together by a linebreak character
    assignSymbols: function () {
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

    // // A callback function used in assignSymbols for an Array.map() call
    // //   Combines the index and value of the called array into a string
    // expand: function (value, index) {
    //     return index + " - " + value;
    // },

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
            this.pages[5].sub.text = '<p>Your symbol is:</p><p>' + this.symbols[0] + '</p>';
        }

        // Set the current page to the passed value
        this.currentPage = newPage;

        // Get an event handler function with a copy of this function
        const advanceHandler = this.advance.bind(this);
        const resetHandler = this.reset.bind(this);

        // Display the current page's layout
        this.header.innerHTML = this.pages[this.currentPage].instructions;
        if (this.pages[this.currentPage].advbtn.visible) {
            this.advanceButton.className = "d-block";
            this.advanceButton.removeEventListener('click', advanceHandler);
            this.advanceButton.addEventListener('click', advanceHandler);
        } else {
            this.advanceButton.className = "d-none";
            this.advanceButton.removeEventListener('click', advanceHandler);
        }
        this.advanceButton.textContent = this.pages[this.currentPage].advbtn.text;
        if (this.pages[this.currentPage].sub.visible) {
            this.subtext.className = "d-block";
        }
        else {
            this.subtext.className = "d-none";
        }
        this.subtext.innerHTML = this.pages[this.currentPage].sub.text;
        if (this.pages[this.currentPage].startbtnIsIcon) {
            this.startButton.innerHTML = "<img src='./img/arrow-counterclockwise.svg'>";
            this.startButton.removeEventListener('click', advanceHandler);
            this.startButton.removeEventListener('click', resetHandler);
            this.startButton.addEventListener('click', resetHandler);
        }
        else {
            this.startButton.innerHTML = "GO";
            this.startButton.removeEventListener('click', resetHandler);
            this.startButton.addEventListener('click', advanceHandler);
        }

        // // A callback function that (hopefully) calls a function to increment the page
        // function advance () {
        //     this.setPage(this.currentPage++);
        // }
        // // A callback function that (hopefully) calls a function to return to the first page
        // function reset () {
        //     this.setPage(0);
        // }
    }
    ,
    // A callback function that (hopefully) calls a function to increment the page
    advance: function () {
        this.setPage(this.currentPage + 1);
    },
    // A callback function that (hopefully) calls a function to return to the first page
    reset: function () {
        this.setPage(0);
    }
}

mindReader.setPage(0);