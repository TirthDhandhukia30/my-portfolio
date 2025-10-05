# Audio Files

## Instructions

To use your own hosted audio file:

1. **Add your audio file** (MP3 format recommended) to this directory
2. **Rename it to `song.mp3`** or update the `src` path in `index.html` (line with `<source src="audio/song.mp3"`)
3. **Update song info** in `index.html`:
   - Change the song title in `<h3 class="audio-song-title">`
   - Change the artist name in `<p class="audio-artist">`

## Supported Audio Formats

- **MP3** (most compatible, recommended)
- **OGG** (good for web)
- **WAV** (high quality, larger file size)

### Example with multiple formats for better browser support:

```html
<audio id="audioPlayer" preload="metadata">
  <source src="audio/song.mp3" type="audio/mpeg">
  <source src="audio/song.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>
```

## Legal Note

Make sure you have the rights to host and use the audio file. Options include:
- Music you created yourself
- Royalty-free music from sites like:
  - [Free Music Archive](https://freemusicarchive.org/)
  - [Incompetech](https://incompetech.com/)
  - [YouTube Audio Library](https://www.youtube.com/audiolibrary)
- Music with proper licensing

## File Size Recommendations

For web hosting, try to keep audio files under:
- **3-5 MB** for full songs
- Use MP3 with 128-192 kbps bitrate for good quality/size balance
