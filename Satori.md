# HTML

Satori Reader uses html like this for words that can have furigana:

```html
<span class="wp hf">
  <span class="fg">ご</span>
  <span class="wpt">５</span>
  <span class="wpr">ご</span>
</span>
```
- wp = word part
- hf = has furigana
- fg = furigana
- wpt = word (wp text)
- wpr = reading (wp reading)

.wpr spans are always hidden and also included on .nf (no furigana) words. So these are guaranteed to have the reading for a word if you need that.

When you have the Furigana modes on All or None, the behavior is obvious.

When the Furigana mode is set to "According to my Knowledge", SR determines whether you know it with some magic algorithm which is not what I want and that's the reason I'm making this extension.

But once it's determined that, it uses the following classes on the top .wp element:

- .kanji-knowledge-none
- .kanji-knowledge-some
- .kanji-knowledge-all
- .kanji-knowledge-na

So I can leverage these classes to hide the furigana I want to.