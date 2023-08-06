import './App.scss'
import { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import recruiterImg from './assets/images/boss.png'
import loading from './assets/images/loading.svg'
import dollar from './assets/images/dollar.png'
import sendBtn from './assets/images/send-btn-icon.png'

function App() {
  const speachBubbleText = 'Give me a one-sentence concept and I\'ll give you an eye-catching title, a synopsis the studios will love, a movie poster... AND choose the cast!'
  const speachBubbleTextWait = 'Ok, just wait a second while my digital brain digests that...'
  const [speachBubble, setSpeachBubble] = useState(speachBubbleText)
  const [synopsis, setSynopsis] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisble] = useState(false);
  const [text, setText] = useState('');

  // API BOT SETUP
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY
  })

  delete configuration.baseOptions.headers['User-Agent']

  const openai = new OpenAIApi(configuration)

  async function fetchBotReply(outline) {
    const response = await openai.createCompletion({
      // https://openai.com/pricing#language-models
      // https://platform.openai.com/account/rate-limits
      'model': 'text-davinci-003',
      // 'model': 'text-ada-001', // MORE SIMPLE VERSION AND LESS EXPENSIVE
      prompt: `Generate a short message to enthusiastically say "${outline}" sounds interesting and that you need some minutes to think about it. Mention one aspect of the sentence.`,
      max_tokens: 60,
    })
    setSpeachBubble(response.data.choices[0].text.trim())
    setIsLoading(false)
  }

  async function fetchSynopsis(outline) {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      // 'model': 'text-ada-001', // MORE SIMPLE VERSION AND LESS EXPENSIVE
      prompt: `Generate an engaging, professional and marketable movie synopsis based on the following idea: ${outline}`,
      max_tokens: 60
    })
    setSynopsis(response.data.choices[0].text.trim())
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSpeachBubble(speachBubbleTextWait)
    fetchBotReply(text)
    fetchSynopsis(text)
    setIsLoading(true)
    setIsVisble(true)
    // console.log(text)
  }

  return (
    <div className="App">

      {/* HEADER */}
      <header>
        <img src={dollar} alt="MoviePitch"></img>
        <a href="/"><span>Mini Recruiter</span></a>
      </header>
      <main>

        {/* SPEECH BUBBLE */}
        <section id="setup-container">
          <div className="setup-inner">
            <div className="speech-bubble-ai" id="speech-bubble-ai">
              <p id="recruiter-text">{speachBubble}</p>
            </div>
            <img src={recruiterImg} alt="recruiter"></img>
          </div>

          {/* INPUT AND LOADING */}
          {isLoading ? (
            <div className="setup-inner setup-input-container" id="setup-input-container">
              <img src={loading} className="loading" alt="Loading..."></img>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="setup-inner setup-input-container" id="setup-input-container">
              <button className="send-btn" id="send-btn" aria-label="send">
                <img src={sendBtn} alt="send"></img>
              </button>
              <textarea
                name="text"
                value={text.text}
                onChange={e => setText(e.target.value)}
                className="setup-textarea"
                placeholder="An evil genius wants to take over the world using AI.">
              </textarea>
            </form>
          )}
        </section>

        {/* SYNOPSIS OUTPUT */}
        {isVisible ? (
          <section className="output-container" id="output-container">
            <div id="output-img-container" className="output-img-container"></div>
            <h1 id="output-title"></h1>
            <h2 id="output-stars"></h2>
            <p
              name="synopsis"
              value={synopsis.text}
              onChange={e => setSynopsis(e.target.value)}
              id="output-text"
            >
              {synopsis}
            </p>
          </section>
        ) : (
          <></>
        )}
      </main>

      {/* FOOTER */}
      <footer>
        &copy; 2023 by William Step ?????????  {/* where is link to github? */}
      </footer>
    </div>
  );
}

export default App
