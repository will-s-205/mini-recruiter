import './App.scss'
import { useState, useEffect } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import recruiterImg from './assets/images/boss.png'
import loading from './assets/images/loading.svg'
import dollar from './assets/images/dollar.png'
import sendBtn from './assets/images/send-btn-icon.png'
import toast, { Toaster } from 'react-hot-toast'
import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

function App() {
  const speachBubbleText = 'Hi, I am your new assistant. I will help you to understand what is in the document. Please ask your questions'
  const speachBubbleTextWait = 'Ok, just wait a second while my digital brain digests that...'
  const [speachBubble, setSpeachBubble] = useState(speachBubbleText)
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState('')

  // PRESS SHIFT+ENTER TO SUBMIT AN ANSWER
  const handleKeyDown = (event) => {
    if (event.shiftKey && event.keyCode === 13) { // Check for SHIFT + ENTER combination
      handleSubmit();
    }
  }

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
      prompt: `From now on, you are my agent that shortly answers my questions based on next information: ${outline}`,
      max_tokens: 60,
    }).catch(err => console.log(err))
    setSpeachBubble(response.data.choices[0].text.replace(/^[.!]/, ''))
    setIsLoading(false)
  }

  const convertPdfToText = async (file) => {
    try {
      // GET PDF TOTAL PAGES
      const pdf = await pdfjs.getDocument({ url: URL.createObjectURL(file) }).promise
      const totalPages = pdf.numPages
      const pageTextPromises = []

      // GET TEXT FROM EACH PAGE
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map(item => item.str).join(' ')
        pageTextPromises.push(textItems)
      }

      // JOIN ALL PAGES TEXT
      const allText = await Promise.all(pageTextPromises)
      setText(allText.join(' '))
      toast.success("PDF successfully processed")
    } catch (error) {
      console.error("Error processing PDF:", error)
      toast.error("Invalid PDF structure")
    }
  }

  // CONVERT PDF TO TEXT
  const onFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      convertPdfToText(selectedFile)
      console.log(selectedFile)
      fetchBotReply(selectedFile)
    }
  }

  function handleSubmit(e) {
    setSpeachBubble(speachBubbleTextWait)
    fetchBotReply(text)
    setIsLoading(true)
  }

  return (
    <div className="App">
      <Toaster />

      {/* HEADER */}
      <header>
        <img src={dollar} alt="dollar"></img>
        <span>Mini Recruiter</span>
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

          <div>
            <input type="file" accept=".pdf" onChange={onFileChange} />
            {/* <div>
              <strong>Extracted Text:</strong>
              <p>{text}</p>
            </div> */}
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
                placeholder="Press SHIFT+ENTER"
              >
              </textarea>
            </form>
          )}
        </section>

        {/* MIDDLE BAR */}
        <div className='middleBar'></div>

        {/* ADVICE OUTPUT */}
        {/* {!isLoading ? (
          <section className="output-container" id="output-container">
            <div id="output-img-container" className="output-img-container"></div>
            <h1 id="output-title">Piece of advice</h1>
            <p
              name="synopsis"
              value={advice.text}
              onChange={e => setAdvice(e.target.value)}
              id="output-text"
              area-lebel="advice-text"
            >
              {advice}
            </p>
          </section>
        ) : (
          <section className="output-container" id="output-container">
            <img src={loading} className="loading2" alt="Loading..."></img>
          </section>
        )} */}
      </main>

      {/* FOOTER */}
      <footer>
        <a href="https://github.com/will-s-205/mini-recruiter" target="_blank" rel="noreferrer">&copy; 2023 by ????????</a>
      </footer>
    </div>
  );
}

export default App
