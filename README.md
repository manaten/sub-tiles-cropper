# sub-tiles-cropper
An utility for crop sub-tiles from images.

---

# usage

```
node index.js input.png -s setting.json
```

## setting.json

```json
{
  "borderColor": 4278255615, // hex color code for border-color(RGBA)
  "names": [
    "subtile1",
    "subtile2"
  ] // names for sutile files
}
```