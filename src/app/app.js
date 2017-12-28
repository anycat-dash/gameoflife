import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Parse the string input provided in a text area
 * and return a 2-D array containing 1's and 0's out of it
 */
function parseMatrix(input, textAreaName){
  //regex matcher for checking proper format of the input
  if(!(/^\[(\s*\[(0|1|\s)+\]\s*)*\]$/.test(input.trim()))){
    alert('Provided input in the ' + textAreaName + ' text area is not in the correct format.');
    return null;
  }

  var rows = input.trim().split("[");
  var result = [];
  var j = 0;

  //go through each character of the string and fill the result matrix with 0's and 1's
  for(var i=2; i < rows.length; i++){
    result[i-2] = [];
    j = 0;
    for (var c of rows[i]) {
      if(parseInt(c) == 0 || parseInt(c) == 1){
        result[i-2][j++] = parseInt(c);
      }
    }
  }

  //Size of each row should be the same
  for (var i = 1; i < result.length; i++) {
    if(result[i].length != result[0].length){
      alert('Input given for ' + textAreaName + ' could not be parsed into a valid matrix. Size of each row is not the same.');
      return null;
    }
  }

  //empty matrix. As far as our app is concerned, just return null
  if(result.length == 0)
    return null;

  /* ----Tracing -> uncomment for debugging---- */
  /*
  console.log("parseMatrix returned");
  console.log(result);
  */
  return result;
}

/**
 * Check if 2 matrices are equal and returns true/false
 */
function isMatch(matrix, expected){
  //return false if rows and cols of matrices dont match
  if(matrix.length != expected.length || matrix[0].length != expected[0].length)
    return false;

  for(var x = 0; x < matrix.length; x++){
    for(var y = 0; y < matrix[0].length; y++){
      if(matrix[x][y] != expected[x][y])
        return false;
    }
  }

  return true;
}

/**
 * This component represents an Alive Cell
 */
class AliveCell extends React.Component{
  render(){
    return(
      <td className="cell" bgcolor="#000000"></td>
    );
  }
}

/**
 * This component represents a Dead Cell
 */
class DeadCell extends React.Component{
  render(){
    return(
      <td className="cell" bgcolor="#FFFFFF"></td>
    );
  }
}

/**
 * This component represents an individual row from
    the Game of life World Grid
 */
class Myrow extends React.Component{
  render(){
    var columns = [];
    var i=0;
    while(i < this.props.cols){
      if(this.props.rowVal[i] == 1){
        columns.push(<AliveCell key={i}></AliveCell>);
      }
      else{
        columns.push(<DeadCell key={i}></DeadCell>);
      }
      i++;
    }
    return(
      <tr>{columns}</tr>
    );
  }
}

/**
 * This component represents the animating Grid of the Game of Life.
 * It shows the state of each cell in the world.
 */
class Grid extends React.Component{
  constructor(props){
    super(props);
    //handle to the timer that keeps animating the game
    this.animationTimer = false;
    //the animation interval in milliseconds
    this.animationInterval = 100;
    this.state = {
      //this matrix holds the current state of Conway's Game of Life World
      matrix : this.props.matrix,
      expected: this.props.expected,
      numIter: this.props.numIter,
      counter: 0,
      test: false,
      testResult: ''
    };
  }

  /**
   * Generate a random initial Game's World Grid
   */
  generateRandomGrid(width, height){
    var result = [];
    //store the randomly generated matrix in result.
    for(var i = 0; i < height; i++){
      result[i] = [];
      for(var j = 0; j < width; j++){
        result[i][j] = Math.floor(Math.random() * 2);
      }
    }
    //set the world state matrix to result
    this.setState({matrix: result, counter: 0});
  }

  /**
   * Check if a particular coordinate lies inside the matrix
   */
  isSafe(i,j){
    return (i >= 0 && i < this.state.matrix.length && j >= 0 && j < this.state.matrix[0].length);
  }

  /**
   * Return the number of alive neighbors of a particular cell
   */
  numAliveNeighbors(i,j){
    var xDir = [-1,0,1];
    var yDir = [-1,0,1];
    var numAlive = 0;

    //iterate through all neighors
    for (var a = 0; a < xDir.length; a++) {
      for (var b = 0; b < yDir.length; b++) {
        //ignore the cell itself
        if(a == 1 && b == 1)
          continue;
        //increment the number of alive neighbors
        if(this.isSafe(i+xDir[a], j+yDir[b]) &&           //coordinate lies within matrix boundary
          (this.state.matrix[i+xDir[a]][j+yDir[b]] == 1)) //neighbor is alive
          numAlive++;
      }
    }
    return numAlive;
  }

  /* Modify the Game World grid according to the rules of the Game */
  moveToNextState(){

    /* ----Tracing -> uncomment for debugging---- */
    /*
    console.log("counter is "+ this.state.counter);
    */
    //If this is a test and we have moved to the next state for the
    //number of iterations provided, check if we have reached the expected state.
    if(this.state.test){
      this.setState({testResult : 'Running Test ... ('+this.state.counter+')'});
      if(this.state.counter == this.state.numIter){
        this.setState({testResult : 'Test Result: ' + isMatch(this.state.matrix, this.state.expected)});
        clearInterval(this.animationTimer);
        //the test ran for the number of iterations provided
        //Stop animating the grid
        this.animationTimer = false;
        return;
      }
    }

    var result = [];
    var row = this.state.matrix.length;
    var col = this.state.matrix[0].length;

    //iterate through the entire matrix, Calculate the number of Alive
    //neighbors for each cell and decide the cell's fate in the next state.
    for(var i=0; i < row; i++){
      result[i] = [];
      for(var j=0; j < col; j++){
        var numAliveNbrs = this.numAliveNeighbors(i,j);
        switch(this.state.matrix[i][j]){
          case 0  :
            //reproduction of cells
            if(numAliveNbrs == 3){
              result[i][j] = 1;
            }
            //cell stays dead
            else {
              result[i][j] = 0;
            }
            break;

          case 1:
            //cell stays alive
            if(numAliveNbrs == 2 || numAliveNbrs == 3){
              result[i][j] = 1;
            }
            //under-population / over-population
            else {
              result[i][j] = 0;
            }
            break;
        }
      }
    }
    var c = this.state.counter;
    this.setState({matrix: result, counter: c+1});
  }

  /*
  * Below are the lifecycle methods of the Grid Component
  */
  componentWillMount(){
    /* ----Tracing -> uncomment for debugging---- */
    /*
    console.log("componentWillMount is called");
    console.log("pros x: "+ this.props.x + " prop y: "+ this.props.y +" matrix is ");
    console.log(this.state.matrix);
    console.log("test: "+ this.props.test +" numIter: "+ this.props.numIter +" expected is ");
    console.log(this.state.expected);
    */
    if(this.state.matrix == null)
      this.generateRandomGrid(this.props.x, this.props.y);

    if(this.props.test){
      this.setState({test : this.props.test, numIter : this.props.numIter, counter : 0, expected: this.props.expected, testResult: 'Running Test...'});
    }
    else{
      this.setState({test : false, numIter : 0, counter : 0, expected: null, testResult: ''});
    }
  }

  componentDidMount(){
    if(this.animationTimer == false){
      this.animationTimer = setInterval(
       () => this.moveToNextState(),
       this.animationInterval
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.animationTimer);
  }

  componentWillReceiveProps(nextProps){
    /* ----Tracing -> uncomment for debugging---- */
    /*
    console.log("componentWillReceiveProps is called");
    console.log("pros x: "+ nextProps.x +"prop y: "+ nextProps.y +" matrix is ");
    console.log(nextProps.matrix);
    console.log(" test: "+ this.props.test +" numIter: "+ this.props.numIter +" expected is ");
    console.log(this.state.expected);
    */

    if(nextProps.matrix != null)
      this.setState({matrix: nextProps.matrix});
    else
      this.generateRandomGrid(nextProps.x, nextProps.y);

    if(nextProps.test){
      this.setState({test : nextProps.test, numIter : nextProps.numIter, counter : 0, expected: nextProps.expected, testResult: 'Running Test...'});
    }
    else {
      this.setState({test : false, numIter : 0, counter : 0, expected: null, testResult: ''});
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(this.animationTimer == false){
      this.animationTimer = setInterval(
       () => this.moveToNextState(),
       this.animationInterval
      );
    }
  }

  render(){
    var rows = [];
    for(var i=0; i < this.state.matrix.length; i++){
      rows.push(<Myrow key={i} rowVal={this.state.matrix[i]} cols={this.state.matrix[0].length} />);
    }
    return (
      <div>
        <label id="testResult">
          {this.state.testResult}
        </label>
        <p></p>
      <table>
          <tbody>{rows}</tbody>
      </table>
      </div>
    );
  }
}

/**
 * This component is for reading user input and generating the grid.
 */
class ConwayGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width:        20,
      height:       20,
      tainput:      '',
      matrix:       [[]],
      expected:     [[]],
      showWithSeed: false,
      showGrid:     true,
      test:         false,
      numIter:      0,
      esinput:      ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSeedSubmit = this.handleSeedSubmit.bind(this);
    this.handleTestSubmit = this.handleTestSubmit.bind(this)
  }

  /* Event listeners for all the inputs */
  handleChange(event) {
    //New input in the width textbox
    if(event.target.name == "width"){
      //check if the input is invalid
      if(/\D/.test(event.target.value)){
        alert("Please enter a valid number in the Width field");
      }
      else {
          this.setState({test: false, showGrid : true, showWithSeed: false,  width : event.target.value});
      }
    }

    //New input in the Height textbox
    if(event.target.name == "height"){
      //check if the input is invalid
      if(/\D/.test(event.target.value)){
        alert("Please enter a valid number in the Height field");
      }
      else {
        this.setState({test: false, showGrid : true, showWithSeed: false, height : event.target.value});
      }
    }

    //New input in the Number of Iterations textbox
    if(event.target.name == "numIter"){
      //check if the input is invalid
      if(/\D/.test(event.target.value)){
        alert("Please enter a valid number in the Number of Iterations field");
      }
      else {
        this.setState({test: false, showGrid : false, showWithSeed: false, numIter : event.target.value});
      }
    }

    //New input in the Seed text area
    if(event.target.name == "seed"){
      this.setState({test: false, showGrid : false, showWithSeed: false, tainput : event.target.value});
    }

    //New input in the Expected State text area
    if(event.target.name == "expState"){
      this.setState({test: false, showGrid : false, showWithSeed: false, esinput : event.target.value});
    }
  }

  /* Event listener for submitting the seed matrix */
  handleSeedSubmit(event) {
    /* Parse and save the seed input */
    var mat = parseMatrix(this.state.tainput, 'Seed');
    if(mat != null)
      this.setState({test: false, showGrid : true, showWithSeed: true, matrix: mat});
    else {
      this.setState({test: false, showGrid : false, showWithSeed: false, matrix: null});
    }
    event.preventDefault();
  }

  /* Event listener for submitting the expected state matrix */
  handleTestSubmit(event){
    var mat = parseMatrix(this.state.tainput, 'Seed');
    var expectedMat = parseMatrix(this.state.esinput, 'Expected State');

    if(mat != null && expectedMat != null){
      if(mat.length != expectedMat.length || mat[0].length != expectedMat[0].length){
        this.setState({test : false});
        alert("The seed's and expected state's dimensions don't match");
      }
      else
        this.setState({test : true, showGrid : false, showWithSeed: false, matrix : mat, expected : expectedMat});
    }
    else {
      this.setState({test : false, showGrid : false, showWithSeed: false, matrix : null, expected : null});
    }
    event.preventDefault();
  }

  render() {
      /* ----Tracing -> uncomment for debugging---- */
      /*
    console.log("conway render: showgrid: " + this.state.showGrid +" showWithSeed:" +this.state.showWithSeed);
    console.log("conway render: rows is "+this.state.matrix.length+" columns is "+this.state.matrix[0].length+ " matrix is "+this.state.matrix);
    */
    var grid = this.state.test?
               <Grid test={this.state.test} numIter={this.state.numIter} expected={this.state.expected} ex matrix={this.state.matrix}
                 x={this.state.matrix.length} y={this.state.matrix[0].length}/>:
              this.state.showGrid ?
               (this.state.showWithSeed ?
                <Grid test={this.state.test} matrix={this.state.matrix} x={this.state.matrix.length} y={this.state.matrix[0].length}/>:
                <Grid test={this.state.test} matrix={null} x={this.state.width} y={this.state.height} /> ) :
               null;

    return (
      <div align="center" id="innerDiv">
          <h1 className="underline">Conway's Game of Life</h1>
            <table>
              <tbody>
                <tr>
                  <td className="input">
                    <h3 className="underline">Conway's world generated randomly</h3>
                    Please change the Width and Height below to generate a grid with random cells.
                    <p></p>
                    <label>
                      Width:
                      <input type="text" name="width" value={this.state.width} onChange={this.handleChange} />
                    </label>
                    <p></p>
                    <label>
                      Height:
                      <input type="text" name="height" value={this.state.height} onChange={this.handleChange} />
                    </label>
                    <p></p>
                  </td>
                  <td rowSpan = "3">
                    <div align="center" id="gridDiv">
                      {grid}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="input">
                    <h3 className="underline">Conway's world generated from seed</h3>
                    Please enter a seed matrix to specify the initial state of the cells.
                    (refer to the following example).
                    <br></br>
                    For ex, a 5X5 matrix looks like [[00000][00100][00100][00100][00000]]
                    <br></br>
                    Press "Start with Seed" to start animating the grid.
                    <p></p>
                    <label>
                      Seed:
                      <textarea rows="5" cols="20" value={this.state.tainput} name="seed" onChange={this.handleChange} />
                    </label>
                    <br></br>
                    <button onClick={this.handleSeedSubmit}>Start with Seed</button>
                    <p></p>
                  </td>
                </tr>
                <tr>
                  <td className="input">
                    <h3 className="underline">Test Game</h3>
                    Please enter an expected state and the number of iterations for the seed to reach to the expected state.
                    Pressing "test_game" returns true if the seed reaches the expected state in the given number of iterations, False otherwise.
                    <p></p>
                    <label>
                      Number of Iterations:
                      <input width="3px" type="text" name="numIter" value={this.state.numIter} onChange={this.handleChange} />
                    </label>
                    <p></p>
                    <label>
                      Expected State:
                      <textarea rows="5" cols="20" value={this.state.esinput} name="expState" onChange={this.handleChange} />
                    </label>
                    <p></p>
                    <button onClick={this.handleTestSubmit}>test_game</button>
                    <p></p>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
    );
  }
}

/**
 * The main renderable element in the HTML page
 */
const mainElement = <ConwayGenerator />;

/**
 * Render the mainElement
 */
ReactDOM.render(
  mainElement,
  document.getElementById('rootDiv')
);
