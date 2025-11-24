---
title: 'Testing Gemini 3 Pro''s OCR Capabilities on Tiny Images'
description: 'Gemini 3 Pro seemingly recognized text out of a blurry 114x64 screenshot that I couldn''t read myself. I ran a brief ablation study to understand how it arrived at its conclusions.'
pubDate: '2025-11-23'
tags: ['vlm']
---

Can Gemini 3 Pro recognize the text in this 114x64 screenshot? (Source: [Total War: THREE KINGDOMS - Liu Bei Launch Trailer](https://www.youtube.com/watch?v=4UhSsPhIpqM), licensed under CC BY)
![Screenshot in 114x64](/images/gemini3-ocr/frame_0071_64p.png)

For comparison, here is the original 1080p image:
![Screenshot in 1080p](/images/gemini3-ocr/frame_0071_1080p.png)

I fed the tiny image at the top into the recently released Gemini 3 Pro with a simple prompt: `transcribe the text in the image`. Here is the response I received:

```text
Center Text:
MAY 23RD 2019
PRE-ORDER NOW FOR THE
YELLOW TURBAN REBELLION
WARLORD PACK
```

Despite a few mistakes, isn't it amazing that Gemini 3 Pro can read the text content from such a tiny image?

Or can it?

## Background

I have been exploring Gemini 3 Pro's video understanding capabilities. Overall the model is quite good and capable of analyzing visual details in a video in a single pass. I passed the TW:3K trailer linked above to the model and asked it to detect text within the video by timestamp. For the original 1080p video, the model nailed it:

```text
01:06 - 01:11
TOTAL WAR
THREE KINGDOMS
MAY 23rd 2019
PRE-ORDER AND GET THE
YELLOW TURBAN REBELLION
FOR FREE
SUBSCRIBE NOW
BE THE FIRST TO KNOW
PRE-PURCHASE NOW
CREATIVE ASSEMBLY
SEGA
TOTAL WAR ACCESS
WWW.TOTALWAR.COM
```

Which was no surprise. I wanted to push the model to its limits, so I passed the downsampled 114x64 version of the video (the same size as the top image) to it. If we zoom in on the 114x64 image, this is what it looks like:
![Zoomed-in 114x64 image](/images/gemini3-ocr/frame_0071_64p_upsampled.png)

Gemini 3 Pro's response for the tiny video was:

```text
01:07 - 01:11
TOTAL WAR
THREE KINGDOMS
MAY 23RD 2019
PRE-ORDER NOW TO GET THE YELLOW TURBAN REBELLION WARLORD PACK FOR FREE
SUBSCRIBE NOW /TotalWar
TOTALWAR.COM
```

Hold on.

This seemed too good to be true.
If I'm familiar with the game, I could probably tell it's TW:3K from the title and Liu Bei. But there is no way I could read that "YELLOW TURBAN REBELLION" text. To understand how Gemini 3 Pro arrived at its answer, I ran a toy study.

## A Toy Ablation Study

I used the same prompt, `transcribe the text in the image`, across all experiments. I used Gemini 3 Pro Preview in Google AI Studio, and I kept all settings at default but disabled "Grounding with Google Search" to prevent any information leakage from web results.

### Experiment 1: Full Image Downsampled to 114x64

First I provided the 114x64 image (zoomed in):
![Zoomed-in 114x64 image](/images/gemini3-ocr/frame_0071_64p_upsampled.png)
The response was:

```text
Center Text:
MAY 23RD 2019
PRE-ORDER NOW FOR THE
YELLOW TURBAN REBELLION
WARLORD PACK
```

It should be "GET THE" instead of "FOR THE," and the last line should be "FOR FREE" instead of "WARLORD PACK." But other than that, Gemini 3 Pro got the date, the "PRE-ORDER" phrase, and the "YELLOW TURBAN REBELLION" part correct.

### Experiment 2: Keep Only Title and Center Text

I masked out the rest of the image, leaving only the title and the text in the center. I used a mask instead of cropping to keep the input size to the model's vision encoder consistent.
The zoomed-in image looked like this:
![Zoomed-in 114x64 image with only center title and text](/images/gemini3-ocr/frame_0071_64p_upsampled_cropped_x42_y0_w30_h30.png)
The size of the visible area is 30x30 pixels.
Gemini 3 Pro responded with:

```text
MAY 23RD 2019
PRE-ORDER NOW FOR
THE YELLOW TURBAN REBELLION
WARLORD PACK
```

Exactly the same answer as Experiment 1. So far the results seemed quite consistent.

### Experiment 3: Keep Only Liu Bei's Face and Center Text

Next, I removed the TW:3K title but included Liu Bei's face. The image looked like this:
![Zoomed-in 114x64 image with only Liu Bei's face and center text](/images/gemini3-ocr/frame_0071_64p_upsampled_cropped_x12_y14_w60_h15.png)
The size of the visible area is 60x15 pixels.
Gemini 3 Pro's response was:

```text
MAY 23rd 2019
THE NEXT GREAT ERA
OF TOTAL WAR
```

Now this is interesting. The model hallucinated "THE NEXT GREAT ERA OF TOTAL WAR," which does not exist in the image. But it seems that Liu Bei's face provided enough context for the model to guess that this is related to Total War. And the date "MAY 23rd 2019" remained correct.

### Experiment 4: Keep Only Center Text

Finally, I masked out everything except the center text area. The image looked like this:
![Zoomed-in 114x64 image with only center text area](/images/gemini3-ocr/frame_0071_64p_upsampled_cropped_x42_y14_w30_h15.png)
The size of the visible area is 30x15 pixels.
Gemini 3 Pro's response was:

```text
MAY 23RD 2019
THE NIGHT WE LET THE
SILVER LINING INTO OUR
WORLD
```

I expected that everything would be hallucinated at this point. But the date "MAY 23RD 2019" was still correct!

## Conclusion

This is by no means a rigorous experiment. It seems that Gemini 3 Pro's text recognition operates at the intersection of visual perception and parametric memory. Specific image patches, such as the Total War logo or Liu Bei's face, appear to serve as cues that allow the model to retrieve context from its training data. At the same time, even within a tiny 30x15 pixel patch, the date characters retain a visual signal strong enough for the model to decode them independently.
