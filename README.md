# Sparsh

**A general-purpose web navigator for blind and low-vision people**

wHACKiest 2026 · Beyond the Browser · RV College of Engineering, Bengaluru

Blind and low-vision people can use screen readers to access web pages and still spend time figuring out where the useful information is. A university portal can bury a deadline behind menus. A city website can put a form below announcements. On a busy page, finding your bearings can take longer than the task you came to do.

> **Find your place. Get the facts. Decide what happens next.**

Sparsh gives you a map of the page you can explore by keyboard or touch. Ask a question by voice or text, hear progress as it happens, and review details at your own pace on a **simulated 32-cell braille line**. The goal is to make the same navigator useful for reading, research, comparison, and everyday web tasks.

[Explore a real tab](#explore-a-real-tab) · [Run the MVP](#try-the-mvp) · [Try the sample workflow](#three-minutes-at-the-judging-table) · [Explore the architecture](#design)

## What you can try today

| What you want to do | What the MVP demonstrates |
| --- | --- |
| **Get oriented on a web page.** | Open Sparsh on a regular Chrome tab to map visible landmarks and jump to a region. Try a news article, a college website, or a public information page. The map depends on the page’s structure. |
| **Review details at your own pace.** | Use the region descriptions and paginated output. The travel sample shows how a ranked result can put an exact value first on the 32-cell line, with visible text alongside the braille. |
| **Choose when to act.** | The sample workflow shows six adaptive controls, a reusable shortcut, and a narrated action that pauses for explicit confirmation. |

## What ships for wHACKiest

A Chrome extension for real-tab landmark navigation, a browser-based navigator, and a modular FastAPI planner. **The travel workflow is the bundled end-to-end example.** Comparison and simulated checkout use sample flights and a rules-based planner with a bundled fallback. The demo runs without an API key or braille hardware.

## Try the MVP

Requires Python 3.10 or later. Chrome supports the extension and is recommended for the optional microphone demo.

```sh
python -m venv .venv
```

Activate with `.venv\Scripts\Activate.ps1` on Windows PowerShell, or `source .venv/bin/activate` on macOS/Linux. Then run:

```sh
python -m pip install -r requirements.txt
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Open [the navigator](http://127.0.0.1:8000/navigator/) or [the planner API docs](http://127.0.0.1:8000/docs). For a service-free demo, serve the same navigator with `python -m http.server 8000 --bind 127.0.0.1 --directory extension` and open [the local preview](http://127.0.0.1:8000/). The navigator will use its bundled planner. Use one server at a time.

### Three minutes at the judging table

Use the travel sample to see navigation, comparison, and confirmation in one flow.

| Try this | Look for this |
| --- | --- |
| Hover over, tap, or tab to **Results**. Press **Enter** or double-click. | The map describes the region and takes you to the ranked flight list. Arrow keys move between regions. |
| Type or say **Compare the three cheapest**. | IndiGo leads at ₹4,230. The six context buttons now let you browse the ranked options. |
| Run **Book the second one**. | The demo selects Air India Express at 11:05 for ₹4,580. The activity log records both steps and checkout pauses at **Confirm** or **Cancel**. **Next line** lets you review overflow. |
| Cancel, then say or type **Make a button that compares the cheapest flights**. | **My button** repeats the comparison and survives reload. |
| Enable **Speak updates** before repeating the demo. | Progress is spoken and the exact quote remains visible in text and simulated braille. |

### Explore a real tab

Open Chrome’s extension manager, enable **Developer mode**, choose **Load unpacked**, and select `extension/`. Open a regular web page, click the Sparsh toolbar icon, and choose **Read active tab**. Sparsh maps visible DOM landmarks and scrolls to the region you activate. The Chrome extension requires an explicit toolbar gesture to grant access to the current tab.

## Design

```mermaid
flowchart LR
    User["Keyboard · touch · voice"] <--> Panel["Navigator"]
    Panel --> Page["Travel fixture or Chrome DOM"]
    Panel --> Plan["FastAPI intent planner"]
    Panel --> Fallback["Bundled fallback planner"]
    Panel --> Braille["32-cell pagination"]
    Panel --> Checkout["Explicit confirmation state"]
    Panel --> Shortcut["Local shortcut storage"]
```

| Subsystem | Entry point | Contract |
| --- | --- | --- |
| Page source | [browser.js](extension/core/browser.js), [fixture.js](extension/core/fixture.js) | A page title plus labeled regions with text and normalized geometry |
| Planner | [planner.py](backend/planner.py), [planner.js](extension/core/planner.js) | A command and sample flights in, a typed intent or ranking out |
| Checkout | [checkout.js](extension/core/checkout.js) | Snapshot a quote, cancel it, or consume it once to return a demo receipt |
| Braille | [braille.js](extension/core/braille.js) | Text in, paginated text and Unicode cells out |
| Speech and shortcuts | [speech.js](extension/core/speech.js), [storage.js](extension/core/storage.js) | Browser speech events and a small local persistence adapter |
| Navigator | [app.js](extension/ui/app.js), [views.js](extension/ui/views.js) | Controller state, accessible HTML controls and a spatial map |

The prototype uses rules for planning and prioritizes the fare when writing a quote. The braille translator covers basic English letters, digits and selected punctuation. The prototype exercises a fictional checkout in memory. Real-tab support covers reading and scrolling by landmark. Page excerpts stay in the navigator, flight requests go to the local planner, and microphone processing depends on the browser. A screen reader can use the text equivalents, but assistive technology compatibility has yet to be tested with users.

The [project plan](Sparsh_Research_and_Project_Plan.md) describes the longer-term direction, including model-backed planning, standardized braille translation, additional languages and tactile hardware.

## Verify locally

Run `npm test` with Node.js 20 or later to check braille cell limits and checkout confirmation behavior.
