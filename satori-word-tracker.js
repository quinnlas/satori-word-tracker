console.log("LOADED content script for Satori Word Tracker")

// DATA ------------
let knownWords

async function loadStorage() {
  const storedKnownWords = await chrome.storage.local.get({ knownWords: {} })
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

  const displayPercent = Math.round((1000 * known) / total) / 10
  const displayString = total === 0 ? "-%" : `${displayPercent}%`
  document.getElementsByClassName("word-tracker-percent")[0].textContent =
    displayString
}

function calcWordCount() {
  const wordCount = Object.keys(knownWords).length

  for (let element of document.getElementsByClassName(
    "word-tracker-word-count"
  )) {
    element.textContent = wordCount
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

    // refresh local cache of storage in case it was edited on another page
    await loadStorage()
    knownWords[wordText] = 1
    await chrome.storage.local.set({ knownWords })

    refreshDisplay()
  }

  async function markWordAsUnknown() {
    const wordText = getSelectedWordText()

    // refresh local cache of storage in case it was edited on another page
    await loadStorage()
    delete knownWords[wordText]
    await chrome.storage.local.set({ knownWords })

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

function setupWordCountDisplay() {
  // insert to the left of the audio slider
  // there are actually 2 of these depending on screen resolution

  const small = document.createElement("span")
  small.classList.add(
    "word-tracker-word-count",
    "word-tracker-word-count-small"
  )
  small.textContent = "..."

  const large = document.createElement("span")
  large.classList.add(
    "word-tracker-word-count",
    "word-tracker-word-count-large"
  )
  large.textContent = "..."

  document
    .querySelector("#audio-controls-mobile .primary-controls")
    .prepend(small)
  document
    .querySelector("#audio-controls-large .primary-controls")
    .prepend(large)
}

function refreshDisplay() {
  setWordClasses()
  calcPercent()
  calcWordCount()
}

function startDisplay() {
  setupWordManagementButtons()
  setupPercentDisplay()
  setupWordCountDisplay()
  refreshDisplay()
}

// MAIN ------------
loadStorage()
  .then(() => startDisplay())
  .catch(console.error)
