# Intro
This Chrome extension allows you to track what words you know in Satori Reader and it will only show furigana for words you don't know.

# Instructions
1. Install the extension.
2. In Satori Reader, set Furigana display to `According to my knowledge`
3. Mark words as known by clicking on them, then clicking the `Add to Known Words` button.
4. Remove words from your list if needed with the `Remove from Known Words` button.

# TODO

## Support words with multiple readings
Right now, the extension assumes each word has only one reading and just tracks the words you know, and doesn't show their furigana. Some words have multiple readings so it might be nice if it tracked those and displayed furigana for readings you don't know, even if the word itself is marked as known.

## Smart Button Display
Right now, the extension shows the buttons to both add and remove the word in the tooltip. It is better to show the appropriate button based on whether the word is known.

## Button Display Styling
The buttons should be styled properly and injected into the correct place in the HTML.

## Difficulty Calculator
The extension could use the known words list to determine the number of lookups you would need to do for the current article and show the percentage.