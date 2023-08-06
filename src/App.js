import logo from './logo.svg';
import './App.scss';
import { Configuration, OpenAIApi } from 'openai'

function App() {

  const setupTextarea = document.getElementById('setup-textarea')
  const setupInputContainer = document.getElementById('setup-input-container')
  const movieBossText = document.getElementById('movie-boss-text')

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })

  const openai = new OpenAIApi(configuration)

  document.getElementById("send-btn").addEventListener("click", () => {
    if (setupTextarea.value) {
      setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
      movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
    }
    console.log("clicked")
  })
  
  async function fetchBotReply() {
    const response = await openai.createCompletion({
      'model': 'text-davinci-003',
      'prompt': 'Sound enthusiastic in five words or less.'
    })
    console.log(response)
  }
  fetchBotReply()
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
