console.log("LOADED content script for Satori Word Tracker")

// DATA ------------
let knownWords

async function loadStorage() {
  const storedKnownWords = await chrome.storage.sync.get({ knownWords: {} })
  knownWords = storedKnownWords.knownWords
}

// DISPLAY ------------
function getWordText(word) {
  return Array.from(word.getElementsByClassName("wpt"))
    .map((wpt) => wpt.textContent)
    .join("")
}

function setWordClasses() {
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

function calcPercent() {
  let known = 0
  let total = 0

  const tooltipWord = document.querySelector(".tooltip .word")
  for (let word of document.getElementsByClassName("word")) {
    // the tooltip word does not exist when the article loads
    // and also changes based on what is clicked
    // so we want to ignore it if it's there
    if (word === tooltipWord) continue

    const wordText = getWordText(word)

    if (knownWords[wordText]) known++
    total++
  }

  const displayPercent = Math.round(1000 * known / total) / 10
  const displayString = total === 0 ? '-%' : `${displayPercent}%`
  document.getElementsByClassName("word-tracker-percent")[0].textContent = displayString
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

    refreshDisplay()
  }

  async function markWordAsUnknown() {
    const wordText = getSelectedWordText()

    delete knownWords[wordText]
    await chrome.storage.sync.set({ knownWords })

    refreshDisplay()
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

function setupPercentDisplay() {
  const element = document.createElement("span")
  element.classList.add("word-tracker-percent")
  element.textContent = "...%"
  document.getElementsByClassName("article-title")[0].prepend(element)
}

function refreshDisplay() {
  setWordClasses()
  calcPercent()
}

function startDisplay() {
  setupWordManagementButtons()
  setupPercentDisplay()
  refreshDisplay()
}

// MAIN ------------
loadStorage()
  .then(() => startDisplay())
  .catch(console.error)
