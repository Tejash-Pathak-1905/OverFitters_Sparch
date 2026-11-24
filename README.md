<div align="center">

# Sparsh

**A web navigator designed around a 32-cell braille line**

wHACKiest 2026 · Beyond the Browser · RV College of Engineering

⠎⠏⠁⠗⠎⠓

</div>

A flight search can bury one useful answer under filters, repeated cards and checkout prompts. Sparsh brings the page layout, the cheapest options and the exact checkout total into one navigator. Voice carries progress updates. The simulated braille line gives the user a place to review details at their own pace.

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
