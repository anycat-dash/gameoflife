# Conway's Game of Life

## How to run the game
The website is hosted on GitHub Pages at the following link-
https://anycatblank.github.io/gameoflife/

Note:
* The bundled source code that is deployed on the link above can be found in the "gh-pages" branch of this repository.
* The source code for the reactjs project resides on the master branch of this repository.

## System requirements
Any browser that runs javascript(ES2015). The input validation errors are presented as alert pop-ups. You might not see the input errors if your browser has pop-up blocker enabled.

The website has been tested with the latest version of chrome.

## Game Controls
There are 3 input sections in the page

1) Conway's world generated randomly -
Changing the width and height in the text boxes will reactively change the width and height of the game matrix.
Every time the matrix dimension changes, a random initial state for the cells is calculated, and the world starts animating itself by moving to the next generation.

2) Conway's world generated from seed -
You may provide a seed representing the initial state of the game's world. Please note that it expects the seed in the format presented in the example below. Click on the "Start with Seed" button to start animating the world.

```
Example of Seed -
1) A 5X5 matrix consisting of 0's and 1's, each row enclosed in square brackets.
[[00000][00100][00100][00100][00000]]
This input results in a pattern known as blinker.

```
Please refer to the end of this README for more interesting seed inputs for the game.

3) Test Game -
This section gives you a way to test out if the app follows the rules of the game correctly.
Please enter a "number of iterations" and an "expected state" in the same format as the seed entered above.
Click on the test_game button to see if the seed reaches the expected state in the number of iterations entered.
You will see the test result at the top of the animating grid as a text message with true or false.

### Game Testing
In addition to the above, the system was manually tested using the following test cases -
1) Positive Tests - By using several inputs that converge to static, oscillating or moving colonies.
2) Negative Tests - By entering deliberate wrong format inputs to check input validation.
3) Corner cases - By entering empty inputs and boundary conditions like matrices with all 1 or 0.
3) Scale Test - By increasing the width and height of the matrix. It was observed that the responsiveness of the animation decreases when dealing with matrices larger than 200X200 dimension.

## Technologies and Packages used
* [reactjs](https://reactjs.org/) - Web Framework
* HTML, CSS - UI
* [Webpack](https://webpack.js.org/) - Bundler
* [Babel](https://babeljs.io/) - Javascript Compiler
* [GIT](https://github.com/) - Version Controll
* [GitHub Pages](https://pages.github.com/) - Deployment

## Authors
* **Aniket Dash**

## Citations and helpful materials
[Wikipedia for interesting inputs for the game](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

[Reactjs docs](https://reactjs.org/docs/hello-world.html)

## Interesting inputs for the game
1) Glider
```
[[000000000000000000000000000000000000]
[000000000000100000000000000000000000]
[000000000000010000000000000000000000]
[000000000001110000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]]
```

2)Lightweight Spaceship
```
[[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000011110000000000000000000000000]
[000000100010000000000000000000000000]
[000000000010000000000000000000000000]
[000000100100000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]]
```

3) Pentadecathlon
```
[[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000011111111110000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]
[000000000000000000000000000000000000]]
```
