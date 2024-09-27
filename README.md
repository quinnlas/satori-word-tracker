# Intro
This Chrome extension allows you to track what words you know in Satori Reader.
- Only show furigana for words you don't know
- Highlight words you don't know
- Calculate the percent of known words for an article

# Instructions
1. [Install the extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
2. In Satori Reader, set Furigana display to `According to my knowledge`
3. Mark words as known by clicking on them, then clicking the `Add to Known Words` button.
4. Remove words from your list if needed with the `Remove from Known Words` button.

# TODO

## Mark as Known Keyboard Shortcut
Having a keyboard shortcut to (when the tooltip is open) mark the word as known and close the tooltip would be really nice.

## Smart Button Display
Right now, the extension shows the buttons to both add and remove the word in the tooltip. It is better to show the appropriate button based on whether the word is known.

## Button Display Styling
The buttons should be styled properly and injected into the correct place in the HTML.
