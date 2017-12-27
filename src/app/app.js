import React from 'react';
import ReactDOM from 'react-dom';

/**
 * This component represents a Alive Cell
 */
class AliveCell extends React.Component{
  render(){
    return(
      <td class="cell" bgcolor="#000000"></td>
    );
  }
}

/**
 * This component represents a Dead Cell
 */
class DeadCell extends React.Component{
  render(){
    return(
      <td class="cell" bgcolor="#FFFFFF"></td>
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
    //console.log('y is' + this.props.y);
    while(i < this.props.cols){
      //console.log('state is ' + this.props.state[i] + " i is " + i);
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
 * This component represents the animating Grid of the game of Life.
 * It shows the state of each cell in the world.
 */
class Grid extends React.Component{
  constructor(props){
    super(props);
    this.animationTimer = false;
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

  //generate a random initial Game World Grid
  generateRandomGrid(width, height){
    var result = [];
    console.log('x is' + width);
    console.log('y is' + height);
    for(var i = 0; i < height; i++){
      result[i] = [];
      for(var j = 0; j < width; j++){
        result[i][j] = Math.floor(Math.random() * 2);
      }
    }
    console.log(result);
    this.setState({matrix: result, counter: 0});
  }

  isSafe(i,j){
    //console.log("isSafe: i: "+ i +" j: "+ j + " row is " +this.state.matrix.length+ " col is "+this.state.matrix[0].length);
    return (i >= 0 && i < this.state.matrix.length && j >= 0 && j < this.state.matrix[0].length);
  }

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
        if(this.isSafe(i+xDir[a], j+yDir[b]) && (this.state.matrix[i+xDir[a]][j+yDir[b]] == 1))
          numAlive++;
      }
    }
    return numAlive;
  }

  /* Modify the Game World grid according to the rules of the Game */
  moveToNextState(){

    /* ----Tracing---- */
    /*
    console.log("counter is "+ this.state.counter);
    */
    //If this was a test and we have moved to the next state for the
    //number of iterations provided, check if we have reached the expected state.
    if(this.state.test && this.state.counter == this.state.numIter){
      if(isMatch(this.state.matrix, this.state.expected)){
        //alert("True");
        this.setState({testResult : 'Test Result: True'});
      }
      else {
        //alert('False');
        this.setState({testResult : 'Test Result: False'});
      }
      clearInterval(this.animationTimer);
      this.animationTimer = false;
      return;
    }

    var result = [];
    var row = this.state.matrix.length;
    var col = this.state.matrix[0].length;
    for(var i=0; i < row; i++){
      result[i] = [];
      for(var j=0; j < col; j++){
        var numAliveNbrs = this.numAliveNeighbors(i,j);
        //console.log('numalive is '+numAliveNbrs);
        //console.log('matrix[i][j] is '+this.state.matrix[i][j]);
        switch(this.state.matrix[i][j]){
          case 0  :
            //reproduction of cells
            if(numAliveNbrs == 2 || numAliveNbrs == 3){
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
    /* ----Tracing---- */
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
      this.setState({test : this.props.test, numIter : this.props.numIter, counter : 0, expected: this.props.expected});
      this.state.testResult = 'Test Result:';
    }
    else{
      this.setState({test : false, numIter : 0, counter : 0, expected: null});
      this.state.testResult = ''
    }
  }

  componentDidMount(){
    if(this.animationTimer == false){
      this.animationTimer = setInterval(
       () => this.moveToNextState(),
       100
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.animationTimer);
  }

  componentWillReceiveProps(nextProps){
    /* ----Tracing---- */
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
      this.setState({test : nextProps.test, numIter : nextProps.numIter, counter : 0, expected: nextProps.expected});
      this.state.testResult = 'Test Result:';
    }
    else {
      this.setState({test : false, numIter : 0, counter : 0, expected: null});
      this.state.testResult = '';
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(this.animationTimer == false){
      this.animationTimer = setInterval(
       () => this.moveToNextState(),
       100
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
      //var mat = parseMatrix(event.target.value);
      //console.log("onchange: mat is "+ mat);
      this.setState({test: false, showGrid : false, showWithSeed: false, tainput : event.target.value});
    }

    //New input in the Expected State text area
    if(event.target.name == "expState"){
      //var mat = parseMatrix(event.target.value);
      //console.log("onchange: mat is "+ mat);
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
    //this.setState({test : true, showGrid : false, showWithSeed: false});
    var mat = parseMatrix(this.state.tainput, 'Seed');
    var mat2 = parseMatrix(this.state.esinput, 'Expected State');

    if(mat != null && mat2 != null){
      if(mat.length != mat2.length || mat[0].length != mat2[0].length){
        this.setState({test : false});
        alert("The seed's and expected state's dimensions don't match");
      }
      else
        this.setState({test : true, showGrid : false, showWithSeed: false, matrix : mat, expected : mat2});
    }
    else {
      this.setState({test : false, showGrid : false, showWithSeed: false, matrix : null, expected : null});
    }
    event.preventDefault();
  }

  render() {
      /* ----Tracing---- */
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

    /*return (
      <div align="center" id="innerDiv">
        <div align="center" id="formDiv">
          <h1 class="underline">Conway's Game of Life</h1>
          <form>
            <table>
              <caption><h3>Please use the following inputs to generate an initial Conway's world.
              Once generated, the world keeps animating to the next state every second.</h3></caption>
            <tbody>
                <tr>
                  <td class="input">
                    <h3 class="underline">Conway's world generated randomly</h3>
                    <h4>Please change the Width and Height below <br></br>to generate a grid with random cells.</h4>
                    <h4>Once generated, the world keeps animating to the next state every second.</h4>
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
                  </td>
                  <td class="input">
                    <h3 class="underline">Conway's world generated from seed</h3>
                    <h4>Please enter a seed matrix to specify the initial state of the cells.<br></br>
                    (in the form of a 2-D javascript array). For ex, a 3x3 matrix looks like [[1,1,1],[0,1,0],[1,1,1]]</h4>
                  <h4>Press "Start with Seed" to start animating the grid.</h4>
                    <p></p>
                    <label>
                      Seed:
                      <textarea rows="10" cols="20" value={this.state.tainput} name="seed" onChange={this.handleChange} />
                    </label>
                    <p></p>
                    <button onClick={this.handleSeedSubmit}>Start with Seed</button>
                  </td>
                  <td class="input">
                    <h3 class="underline">Test Game</h3>
                    <h4>Please enter an expected state and the number of iterations for the seed to reach to the expected state.</h4>
                  <h4>Pressing "test_game" returns true if the seed reaches the expected state in the entered number of iterations, False otherwise.</h4>
                    <label>
                      Number of Iterations:
                      <input width="3px" type="text" name="numIter" value={this.state.numIter} onChange={this.handleChange} />
                    </label>
                    <p></p>
                    <label>
                      Expected State:
                      <textarea rows="10" cols="20" value={this.state.esinput} name="expState" onChange={this.handleChange} />
                    </label>
                    <p></p>
                    <button onClick={this.handleTestSubmit}>test_game</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <div align="center" id="gridDiv">
          {grid}
        </div>
    </div>
    );*/

    return (
      <div align="center" id="innerDiv">
          <h1 class="underline">Conway's Game of Life</h1>
            <table>
              <caption><h3>Please use the following inputs to generate an initial Conway's world.
              Once generated, the world keeps animating to the next state every second.</h3></caption>
            <tbody>
                <tr>
                  <td class="input">
                    <h3 class="underline">Conway's world generated randomly</h3>
                    Please change the Width and Height below to generate a grid with random cells.
                    Once generated, the world keeps animating to the next state every second.
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
                  </td>
                  <td rowSpan = "3">
                    <div align="center" id="gridDiv">
                      {grid}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="input">
                    <h3 class="underline">Conway's world generated from seed</h3>
                    Please enter a seed matrix to specify the initial state of the cells.
                    (refer to the following example).
                    <br></br>
                    For ex, a 3x3 matrix looks like [[111][010][111]]
                    <br></br>
                    Press "Start with Seed" to start animating the grid.
                    <p></p>
                    <label>
                      Seed:
                      <textarea rows="5" cols="20" value={this.state.tainput} name="seed" onChange={this.handleChange} />
                    </label>
                    <br></br>
                    <button onClick={this.handleSeedSubmit}>Start with Seed</button>
                  </td>
                </tr>
                <tr>
                  <td class="input">
                    <h3 class="underline">Test Game</h3>
                    Please enter an expected state and the number of iterations for the seed to reach to the expected state.
                    Pressing "test_game" returns true if the seed reaches the expected state in the entered number of iterations, False otherwise.
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
                  </td>
                </tr>
              </tbody>
            </table>
    </div>
    );
  }
}

const mainElement = <ConwayGenerator />;

//Render the Entire Page
ReactDOM.render(
  mainElement,
  document.getElementById('rootDiv')
);

/**
 * Parse the string input provided in a text area
 * and return a 2-D array containing 1's and 0's out of it
 */
function parseMatrix(input, textAreaName){
  //[[1,1,1,0,1],[0,1,0,1,0],[1,1,0,0,1],[0,1,0,1,1],[1,0,1,0,1]]
  //[[111][000][010]]
  // [[111][010][010]]

  //regex matcher for proper format of the input
  if(!(/^\[(\s*\[(0|1|\s)+\]\s*)*\]$/.test(input.trim()))){
    alert('Provided input in the ' + textAreaName + ' text area is not in the correct format.');
    return null;
  }

  var rows = input.trim().split("[");
  var result = [];
  var j = 0;

  //go through each row and split the string at [, and fill up
  //the result matrix with each 0 or 1
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
      alert('Input given for Seed/Expected State could not be parsed into a valid matrix. Size of each row is not the same.');
      return null;
    }
  }

  //empty matrix. As far as our app is concerned, just return null
  if(result.length == 0)
    return null;

console.log("parseMatrix returned");
console.log(result);
  return result;
}

/**
 * This function check if 2 matrices are equal.
 * Returns true/false
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
