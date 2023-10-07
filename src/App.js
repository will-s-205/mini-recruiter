import './App.scss'
import { useState, useEffect } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import ai from './assets/images/ai.png'
import loading from './assets/images/loading.svg'
import aiSmall from './assets/images/ai-small.png'
import sendBtn from './assets/images/send-btn-icon.png'
import toast, { Toaster } from 'react-hot-toast'
import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

function App() {
  const speachBubbleText = 'Hi, I am your new assistant. I will help you to understand what is in the document. Please upload your PDF document and ask your questions'
  const speachBubbleTextWait = 'Ok, just wait a second'
  const [speachBubble, setSpeachBubble] = useState(speachBubbleText)
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState('')
  const [pdfText, setPdfText] = useState('')

  // PRESS ENTER
  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit()
    }
  }

  function readAloud(speachBubble) {
    let utteranceInit = new SpeechSynthesisUtterance(speachBubble)
    utteranceInit.rate = 0.9
    utteranceInit.pitch = 0.9
    speechSynthesis.speak(utteranceInit)
  }

  // TRIGGERING READ ALOUD FUNCTION
  useEffect(() => {
    readAloud(speachBubble)
  }, [speachBubble])

  // TRIGGERS ON PDF UPLOADED
  useEffect(() => {
  }, [pdfText])

  // API BOT SETUP
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY
  })

  delete configuration.baseOptions.headers['User-Agent']

  const openai = new OpenAIApi(configuration)

  async function fetchBotReply(outline, question) {
    const response = await openai.createCompletion({
      // https://openai.com/pricing#language-models
      // https://platform.openai.com/account/rate-limits
      'model': 'text-davinci-003', // warning: "This model version is deprecated. Migrate before January 4, 2024 to avoid disruption of service. Learn more https://platform.openai.com/docs/deprecations"
      // 'model': 'text-ada-001', // MORE SIMPLE VERSION AND LESS EXPENSIVE
      prompt: `From now on, you are my agent that shortly answers my ${question} based on next information: ${outline}`,
      max_tokens: 60,
    }).catch(err => console.log(err))
    setSpeachBubble(response.data.choices[0].text.trim().replace(/^[.!]/, ''))
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
      setPdfText(allText.join(' '))
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
      fetchBotReply(pdfText)
    }
  }

  function handleSubmit(e) {
    setSpeachBubble(speachBubbleTextWait)
    fetchBotReply(pdfText, text)
    setIsLoading(true)
  }

  return (
    <div className="App">
      <Toaster />

      {/* HEADER */}
      <header>
        <img src={aiSmall} alt="dollar"></img>
        <span>Document Assistant</span>
      </header>
      <main>

        {/* SPEECH BUBBLE */}
        <section id="setup-container">
          <div className="setup-inner">
            <div className="speech-bubble-ai" id="speech-bubble-ai">
              <p id="recruiter-text">{speachBubble}</p>
            </div>
            <img src={ai} alt="recruiter"></img>
          </div>

          {/* FILE INPUT */}
          <div>
            <input type="file" accept=".pdf" onChange={onFileChange} className='input-file' />
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
                placeholder="Press ENTER"
              >
              </textarea>
            </form>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <a href="https://github.com/will-s-205/mini-recruiter/tree/Document-Assistant" target="_blank" rel="noreferrer">&copy; 2023 by William Step</a>
      </footer>
    </div>
  );
}

export default App
