import React from "react";
import "./SortingVisualizer.css";
import Slider from "react-input-slider";
import "./Header.css";
import { getMergeSortAnimations } from "./sortingAlgorithms";

const ANIMATION_SPEED_MS = 10;
const PRIMARY_COLOR = 'turquoise';
const SECONDARY_COLOR = 'red';
export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      screenWidth: window.innerWidth - 300,
      barWidth: 0,
      arrayLength: 15,
    };
    this.resetArray = this.resetArray.bind(this);
  }

  async componentDidMount() {
    await this.resetArray();
    this.setBarWidth();
  }

  setBarWidth() {
    const { array } = this.state;
    const screenWidth = window.innerWidth - 400;
    const barWidth = screenWidth / array.length;
    this.setState({ screenWidth, barWidth });
  }

  test() {
    console.log("yo baby");
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < this.state.arrayLength; i++) {
      array.push(randomIntFromInterval(5, 500));
    }
    this.setState({ array });
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
  }

  async setArrayLength(value) {
    const response = await this.setState(
      {
        arrayLength: value,
      },
      async () => {
        const response = await this.setBarWidth();
        this.resetArray();
      }
    );
  }

  render() {
    const { array, barWidth } = this.state;

    return (
      <>
        <header>
          <button onClick={() => this.resetArray()}>Reset Array</button>
          <button onClick={() => this.mergeSort()}>Merge Sort</button>
          <Slider
            axis="x"
            xmin={5}
            xmax={150}
            x={this.state.arrayLength}
            onChange={({ x }) => {
              this.setArrayLength(x);
            }}
          />
        </header>
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{ height: `${value}px`, width: `${barWidth}px` }}
            ></div>
          ))}
        </div>
      </>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
