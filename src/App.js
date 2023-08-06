import './App.scss';
import React, { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import movieboss from './assets/images/movieboss.png'
import loading from './assets/images/loading.svg'
import logoMovie from './assets/images/logo-movie.png'
import sendBtn from './assets/images/send-btn-icon.png'

function App() {
  const [showButton, setShowButton] = useState(true)

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY
  })

  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration)

  async function fetchBotReply() {
    const response = await openai.createCompletion({
      'model': 'text-davinci-003',
      'prompt': 'Sound enthusiastic in five words or less.',
    })
    console.log(response.data.choices[0].text)
  }
  // fetchBotReply()
  // OR
  ///////////////////////////////////////////////////////////////////////
  // const url = 'https://api.openai.com/v1/completions'
  // function fetchBotReply(){
  //   fetch(url,{
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
  //     },
  //     body: JSON.stringify({
  //       'model': 'text-davinci-003',
  //       'prompt': 'Sound enthusiastic in five words or less.'
  //     })
  //   }).then(response => response.json()).then(data => 
  //     console.log(data.choices[0].text)
  //   )
  // }
  // fetchBotReply()
  ///////////////////////////////////////////////////////////////////////

  // const setupTextarea = document.getElementById('setup-textarea')
  // const setupInputContainer = document.getElementById('setup-input-container')
  // const movieBossText = document.getElementById('movie-boss-text')

  // document.getElementById("send-btn").addEventListener("click", () => {
  //   if (setupTextarea.value) {
  //     setupInputContainer.innerHTML = `<img src="images/loading.svg" className="loading" id="loading">`
  //     movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
  //   }
  //   console.log("clicked")
  // })

  const handleClick = () => {
    // console.log('Button was clicked!')
    // fetchBotReply()
    return `<img src="images/loading.svg" className="loading" id="loading">`
  }

  function handleSubmit(e) {
    document.getElementById('movie-boss-text').innerText = `Ok, just wait a second while my digital brain digests that...`
    handleLoading()
  }

  function handleLoading() {
    const parent = document.getElementById('setup-input-container')
    const setupTextarea = document.getElementById('setup-textarea')
    const sendBtn = document.getElementById('send-btn')

    if (parent) {
      sendBtn.remove()
      setupTextarea.remove()
      parent.innerHTML = `<img src=${loading} className="loading" id="loading">`
    }
  }

  return (
    <div className="App">
      <header>
        <img src={logoMovie} alt="MoviePitch"></img>
        <a href="/"><span>Mini Recruiter</span></a>
      </header>
      <main>

        <section id="setup-container">
          <div className="setup-inner">
            <img src={movieboss}></img>
            <div className="speech-bubble-ai" id="speech-bubble-ai">
              <p id="movie-boss-text">
                Give me a one-sentence concept and I'll give you an eye-catching title, a synopsis the studios
                will love, a movie poster...
                AND choose the cast!
              </p>
            </div>
          </div>
          <div className="setup-inner setup-input-container" id="setup-input-container">
            <textarea id="setup-textarea"
              placeholder="An evil genius wants to take over the world using AI."></textarea>
            <button onClick={handleSubmit} className="send-btn" id="send-btn" aria-label="send">
              <img src={sendBtn} alt="send"></img>
            </button>
          </div>
        </section>

        <section className="output-container" id="output-container">
          <div id="output-img-container" className="output-img-container"></div>
          <h1 id="output-title"></h1>
          <h2 id="output-stars"></h2>
          <p id="output-text"></p>
        </section>
      </main>
      <footer>
        &copy; 2023 by William Step ?????????  {/* where is link to github? */}
      </footer>
    </div>
  );
}

export default App;
