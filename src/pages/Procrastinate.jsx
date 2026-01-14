import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Snake from "../components/Snake";
import Food from "../components/Food";
import Button from "../components/Button";
import Menu from "../components/Menu";
import "../styles.css/App.css";

const getRandomFood = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const initialState = {
  food: getRandomFood(),
  direction: "RIGHT",
  speed: 100,
  route: "menu",
  showModal: false,
  snakeDots: [
    [0, 0],
    [0, 2],
  ],
  score: 0,
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    this.startGameInterval();
    document.onkeydown = this.onKeyDown;
  }

  componentWillUnmount() {
    clearInterval(this.gameInterval);
  }

  startGameInterval = () => {
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(this.moveSnake, this.state.speed);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.speed !== prevState.speed) {
      this.startGameInterval();
    }

    // Only check collisions if game is running and modal is NOT visible
    if (this.state.route === "game" && !this.state.showModal) {
      this.onSnakeOutOfBounds();
      this.onSnakeCollapsed();
      this.onSnakeEats();
    }
    // Check if game just ended
    if (this.state.gameOver && !prevState.gameOver) {
      clearInterval(this.gameInterval);
    }
  }

  onKeyDown = (e) => {
    e.preventDefault();
    switch (e.keyCode) {
      case 37:
        this.setState({ direction: "LEFT" });
        break;
      case 38:
        this.setState({ direction: "UP" });
        break;
      case 39:
        this.setState({ direction: "RIGHT" });
        break;
      case 40:
        this.setState({ direction: "DOWN" });
        break;
      default:
        break;
    }
  };

  moveSnake = () => {
    if (this.state.route !== "game") return;

    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
      default:
        break;
    }

    dots.push(head);
    dots.shift();

    this.setState({ snakeDots: dots });
  };

  onSnakeOutOfBounds = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.gameOver();
    }
  };

  onSnakeCollapsed = () => {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        this.gameOver();
      }
    });
  };

  onSnakeEats = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      this.setState({ food: getRandomFood() });
      this.increaseSnake();
      this.increaseSpeed();
    }
  };

  increaseSnake = () => {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([]);
    this.setState({ snakeDots: newSnake });
  };

  increaseSpeed = () => {
    if (this.state.speed > 10) {
      this.setState({ speed: this.state.speed - 20 });
    }
  };

  onRouteChange = () => {
    this.setState({ route: "game" });
  };

  gameOver = () => {
    if (this.state.showModal) return;
    const currentScore = this.state.snakeDots.length - 2;
    clearInterval(this.gameInterval);
    this.setState({
      score: currentScore,
      gameOver: true,
      showModal: true, // show modal
    });
  };

  handleCloseModal = () => {
    this.setState({ ...initialState, route: "menu", showModal: false }, () => {
      this.startGameInterval(); // restart interval after reset
    });
  };

  // Direction controls
  onDown = () => this.manualMove("DOWN");
  onUp = () => this.manualMove("UP");
  onRight = () => this.manualMove("RIGHT");
  onLeft = () => this.manualMove("LEFT");

  manualMove = (direction) => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    switch (direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
      default:
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({ snakeDots: dots, direction });
  };

  render() {
    const { route, snakeDots, food, showModal, score } = this.state;

    return (
      <div>
        {route === "menu" ? (
          <Menu onRouteChange={this.onRouteChange} />
        ) : (
          <div>
            <div className="game-area">
              <Snake snakeDots={snakeDots} />
              <Food dot={food} />
            </div>

            <Button
              onDown={this.onDown}
              onLeft={this.onLeft}
              onRight={this.onRight}
              onUp={this.onUp}
            />

            <div
  className={`modal fade ${showModal ? "show d-block" : ""}`}
  tabIndex="-1"
  role="dialog"
>
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Game Over!</h5>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={this.handleCloseModal}
        ></button>
      </div>
      <div className="modal-body text-center">
        <p className="mb-0 fs-5">Your score: {score}</p>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn-restart"
          onClick={this.handleCloseModal}
        >
          Restart Game
        </button>
      </div>
    </div>
  </div>
</div>

          </div>
        )}
      </div>
    );
  }
}

export default App;
