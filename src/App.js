import './App.scss'
import { useState, useEffect } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import recruiterImg from './assets/images/boss.png'
import loading from './assets/images/loading.svg'
import dollar from './assets/images/dollar.png'
import sendBtn from './assets/images/send-btn-icon.png'

function App() {
  const speachBubbleText = 'Hi there, I am your new recruiter. I am here to help you find a job. I will ask some questions. Consider it as a phone screen call. What kind of role do you think fits you well? Say JavaScript Engineer, or Python Backend Developer, or something else?'
  const speachBubbleTextWait = 'Ok, just wait a second while my digital brain digests that...'
  const [speachBubble, setSpeachBubble] = useState(speachBubbleText)
  const [advice, setAdvice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisble] = useState(true)
  const [text, setText] = useState('')

  // PRESS SHIFT+ENTER TO SUBMIT AN ANSWER
  const handleKeyDown = (event) => {
    if (event.shiftKey && event.keyCode === 13) { // Check for SHIFT + ENTER combination
      handleSubmit();
    }
  }

  // // TRIGGERING ADVICES ONCE SPEACH BUBBLE IS FILLED 
  useEffect(() => {
    fetchAdvice(speachBubble)
  }, [speachBubble])

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
      // prompt: `Generate a short message to enthusiastically say "${outline}" sounds interesting and that you need some minutes to think about it. Mention one aspect of the sentence.`,
      prompt: `From now on, you are my interviewer for a ${outline} role. Ask me my first question`,
      max_tokens: 60,
    })
    setSpeachBubble(response.data.choices[0].text.replace(/^[.!]/, ''))
    setIsLoading(false)
  }

  async function fetchAdvice(outline) {
    const modifiedData = outline.replace(/you.{1,2}?/gi, 'I')
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      // 'model': 'text-ada-001', // MORE SIMPLE VERSION AND LESS EXPENSIVE
      prompt: `${modifiedData}`,
      max_tokens: 120,
    })
    setAdvice(response.data.choices[0].text.trim())
    console.log(modifiedData)
  }

  function handleSubmit(e) {
    // e.preventDefault()
    setSpeachBubble(speachBubbleTextWait)
    fetchBotReply(text)

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
                onKeyDown={handleKeyDown}
                className="setup-textarea"
                placeholder="Press SHIFT+ENTER to submit"
              >
              </textarea>
            </form>
          )}
        </section>

        {/* MIDDLE BAR */}
        <div className='middleBar'></div>

        {/* ADVICE OUTPUT */}
        {!isLoading ? (

          <section className="output-container" id="output-container">
            <div id="output-img-container" className="output-img-container"></div>
            <h1 id="output-title">Piece of advice</h1>
            <h2 id="output-stars"></h2>
            <p
              name="synopsis"
              value={advice.text}
              onChange={e => setAdvice(e.target.value)}
              id="output-text"
            >
              {advice}
            </p>
          </section>
        ) : (
          <section className="output-container" id="output-container">
            <img src={loading} className="loading2" alt="Loading..."></img>
          </section>
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
