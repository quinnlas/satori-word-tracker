console.log("LOADED content script for Satori Word Tracker")

let knownWords

async function loadStorage() {
  const storedKnownWords = await chrome.storage.sync.get({ knownWords: {} })
  knownWords = storedKnownWords.knownWords
}

function setKanjiClasses() {
  for (let wp of document.getElementsByClassName("wp hf")) {
    // clear existing kanji knowledge classes from the parent element
    wp.parentElement.classList.remove(
      "kanji-knowledge-all",
      "kanji-knowledge-some",
      "kanji-knowledge-none",
      "kanji-knowledge-all"
    )

    // determine whether it's known and update
    const wordText = wp.children[1].textContent

    if (knownWords[wordText]) {
      wp.parentElement.classList.add("kanji-knowledge-all")
    } else {
      wp.parentElement.classList.add("kanji-knowledge-none")
    }
  }
}

function setupWordManagementButtons() {
  const tooltipElem = document.getElementsByClassName("tooltip")[0]

  async function markWordAsKnown() {
    const word = document.querySelector(".tooltip .wpt").textContent

    knownWords[word] = true
    await chrome.storage.sync.set({ knownWords })

    setKanjiClasses()
  }

  async function markWordAsUnknown() {
    const word = document.querySelector(".tooltip .wpt").textContent

    delete knownWords[word]
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
