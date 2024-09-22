console.log("LOADED content script for Satori Word Tracker")

let knownWords

async function loadStorage() {
  const storedKnownWords = await chrome.storage.sync.get({ knownWords: {} })
  knownWords = storedKnownWords.knownWords
}

function getWordText(word) {
  return Array.from(word.getElementsByClassName("wpr"))
    .map((wpr) => wpr.textContent)
    .join("")
}

function setKanjiClasses() {
  for (let word of document.getElementsByClassName("word")) {
    // clear existing kanji knowledge classes from the word element
    word.classList.remove(
      "kanji-knowledge-all",
      "kanji-knowledge-some",
      "kanji-knowledge-none",
      "kanji-knowledge-all"
    )

    // determine whether it's known and update
    const wordText = getWordText(word)

    if (knownWords[wordText]) {
      word.classList.add("kanji-knowledge-all")
    } else {
      word.classList.add("kanji-knowledge-none")
    }
  }
}

function getSelectedWordText() {
  const selectedWord = document.getElementsByClassName("word-selected")[0]
  return getWordText(selectedWord)
}

function setupWordManagementButtons() {
  const tooltipElem = document.getElementsByClassName("tooltip")[0]

  async function markWordAsKnown() {
    const wordText = getSelectedWordText()

    knownWords[wordText] = true
    await chrome.storage.sync.set({ knownWords })

    setKanjiClasses()
  }

  async function markWordAsUnknown() {
    const wordText = getSelectedWordText()

    delete knownWords[wordText]
    await chrome.storage.sync.set({ knownWords })

    setKanjiClasses()
  }

  const addButton = document.createElement("button")
  addButton.textContent = "Add to Known Words"
  addButton.classList.add("tooltip-button", "tooltip-button-active")
  addButton.onclick = markWordAsKnown

  const deleteButton = document.createElement("button")
  deleteButton.textContent = "Remove from Known Words"
  deleteButton.classList.add("tooltip-button", "tooltip-button-active")
  deleteButton.onclick = markWordAsUnknown

  tooltipElem.prepend(deleteButton)
  tooltipElem.prepend(addButton)
}

loadStorage()
  .then(() => setKanjiClasses())
  .catch(console.error)
setupWordManagementButtons()
