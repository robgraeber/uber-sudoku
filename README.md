Uber-Sudoku
===============
Responsive sudoku game built with Underscore + Zepto.

Straight-forward app architecture with the main app.js handling all the events + board setup. A 3rd party generator library. And some random utility functions to help manipulate different matrix formats.

Core Technologies
---

**Gulp**: My favorite build system that manages all my watch tasks, and along with browserSync saves me a lot of headaches during development.  

**Stylus**: Pre-proccessor that greatly simplifies writing complex css, with it's friendly syntax and vendor prefix mixins via 'nib'.  

**Browserify**: Great way to manage dependencies on the frontend, and would have made it easier to write modular code as the project grew. 

**Zepto**: Standard library for DOM manipulation + events. Since the target was mainly newer browsers + mobile, I used Zepto for its lighter footprint.

**Underscore**: Standard library for utility functions and templating, nothing fancy here.

Going forward on this project, I would have liked to improve the sudoku generator library I used. The current library was good for easy sudoku boards, but it's difficulty level feature was broken and I didn't have time to resolve it. I also would have liked to improve the gameplay and potentially refactor my code into a more modular structure as I expanded the project.

![](https://dl.dropboxusercontent.com/u/6061717/Screenshot%202014-09-02%2007.29.25.png)

Demo: http://uber-doku.herokuapp.com/

To Run: npm/bower install, "gulp build", and start server.js. Please fork and improve :)
