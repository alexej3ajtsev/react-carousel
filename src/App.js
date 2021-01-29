import React from 'react'
import './App.css';
import useInterval from './hooks/use-interval';

const INITIAL_DATA = [
  'red',
  'yellow',
  'orange',
  'purple',
  'blue',
  '#324f88'
]
function App() {
  const data = [...INITIAL_DATA]
  const last = data.pop()
  const [slides, setSlides] = React.useState([last, ...data]);
  const [active, setActive] = React.useState(1);
  const [delay, setDelay] = React.useState(1000);
  const [locked, setLocked] = React.useState(false);
  const sliderContainer = React.useRef(null)
  const lastIndex = slides.length - 1
  const firstIndex = 0
  const [animItem, setAnimItem] = React.useState(firstIndex)
  const VISIBLE_SLIDES = 3
  const slideNext = (callback = () => { }) => {
    sliderContainer.current.classList.add('anim')
    setLocked(true)
    setAnimItem(lastIndex)
    const t = setTimeout(() => {
      sliderContainer.current.classList.remove('anim')
      const first = slides.shift()
      setSlides([
        ...slides,
        first
      ])
      setLocked(false)
      callback()
      clearTimeout(t)
    }, 300)
    setActive(active + 1 === slides.length - 1 ? 0 : active + 1)
  }

  const slidePrev = (callback = () => { }) => {
    sliderContainer.current.classList.add('anim-prev')
    setLocked(true)
    setAnimItem(firstIndex)
    const t = setTimeout(() => {
      sliderContainer.current.classList.remove('anim-prev')
      const last = slides.pop()
      setSlides([
        last,
        ...slides,
      ])
      setLocked(false)
      callback()
      clearTimeout(t)
    }, 300)
    setActive(active - 1 === -1 ? slides.length - 1 : active - 1)
  }
  const handleRenewInterval = () => {
    const t = setTimeout(() => {
      setDelay(1000);
      clearTimeout(t)
    }, 1000)
  }
  const handlePrevClick = () => {
    if (locked) {
      return
    }
    setDelay(null)
    slidePrev(handleRenewInterval)
  }

  const handleNextClick = () => {
    if (locked) {
      return
    }
    setDelay(null)
    slideNext(handleRenewInterval)
  }

  useInterval(() => {
    slideNext();
  }, delay)

  const x = React.useRef(0)
  const unify = (e) => e.changedTouches ? e.changedTouches[0] : e

  const lock = (e) => {
    x.current = unify(e).clientX
  }

  const move = (e) => {
    const dx = unify(e).clientX - x.current
    const direction = Math.sign(dx) === 1 ? 'PREV' : Math.sign(dx) === -1 ? 'NEXT' : null

    if (direction === 'PREV') {
      handlePrevClick()
    }

    if (direction === "NEXT") {
      handleNextClick()
    }

    console.log('Direction: ', direction);

    x.current = 0
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="carousel__container">
          <button onClick={handlePrevClick} className={'carousel__prev'} />
          <button onClick={handleNextClick} className={'carousel__next'} />
          <div
            className="carousel__content-container"
            onTouchStart={lock}
            onTouchEnd={move}
          >
            <div ref={sliderContainer} className="carousel__slides-container">
              {slides.map((slide, ix) => {
                return (<div
                  style={{ background: slide, display: ix + 1 > VISIBLE_SLIDES ? "none" : 'block' }}
                  key={slide}
                  className={`carousel__slide ${ix === animItem ? 'carousel__slide--appereance' : ''}`}
                />)
              }
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
