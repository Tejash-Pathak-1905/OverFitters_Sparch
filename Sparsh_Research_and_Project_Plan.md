# Sparsh: AI Web Agent + Braille Navigator for Blind Users
**Research notes and project plan for wHACKiest 2026 (Online Ideathon, 26–27 Nov 2026)**
**Track:** Beyond the Browser: Reimagine How We Use the Web
**College:** RV College of Engineering, Bengaluru

---

## 1. What we are building (summary)

**Sparsh** (स्पर्श, "touch") is a **browser-based AI agent** for blind and low-vision users, paired with a **simulated braille navigator device** we design ourselves.

- The **agent** (a Chrome extension plus a backend) reads any website, understands its layout, answers questions and completes tasks such as searching, comparing and filling forms. It announces every step and stops for confirmation before anything irreversible, like a payment.
- The **navigator** is a software simulation of a braille reading device:
  - a **tactile graphics area** that shows the page layout as raised blocks, plus charts and seat maps. The user touches it to explore and double-taps to jump.
  - a **braille line** showing AI-condensed text, with the key fact first.
  - **6 buttons with braille labels** that **change with context**. The user can also create their own buttons by voice.
- **Decisions taken:**
  - **No hardware build.** The device is designed and shown as a simulation.
  - **Standalone, not integrated** with NVDA, JAWS or TalkBack, so the project stands on its own idea. It should still not *break* screen readers if one is running.

### One-line pitch
> Screen readers read the web *to* blind users. Sparsh understands it *for* them, then gives back only what matters, through voice, touch and braille buttons that change with the page.

---

## 2. What a "browser-based agent" is

An AI that can **see a web page and act on it** (read, click, type, scroll, switch tabs) to reach a goal the user gives it. It can be packaged in three ways:

| Form | How it works | Examples | Pros / cons |
|---|---|---|---|
| **Browser extension** | Installed into Chrome. Content scripts read and change pages; a side panel or popup is the interface | Rayo, Accessibility Assistant, Claude in Chrome | Works in the user's real browser with their logins. Limited by what Chrome allows extensions to do |
| **App that controls a browser** | A separate program drives Chrome through Playwright or the Chrome DevTools Protocol | Browser Use, Guide, OpenAI Operator | Full control and its own interface. Feels separate from normal browsing |
| **AI-native browser** | The browser itself is the agent | Perplexity Comet, ChatGPT Atlas, Gemini in Chrome | Most seamless. Far too much work for a hackathon |

**Our choice:** Chrome extension (Manifest V3) + FastAPI backend + the navigator simulator as an extension page or side panel. This lets us demo on real sites with real logins.

---

## 3. The problem: data

| Stat | Figure | Source |
|---|---|---|
| Blind people worldwide (2020) | **43.3 million**, plus **295 million** with moderate–severe vision impairment | Lancet Global Health / Vision Loss Expert Group (GBD 2020) |
| Projected blind people by 2050 | ~61 million | IAPB Vision Atlas |
| Blind people in India | **4.95 million** (0.36%), **~35 million** visually impaired (2.55%), 0.24 million blind children | National Blindness & Visual Impairment Survey 2015–19 (NPCB&VI / AIIMS) |
| Alternative India estimate | 9.2 million blind, 270 million with any vision loss (2020) | IAPB Vision Atlas |
| Websites failing accessibility | **95.9%** of the top 1M home pages have detectable WCAG 2 failures (up from 94.8% in 2025, the first regression in years) | WebAIM Million 2026 |
| Errors per page | **56.1** on average (up 10.1% from 51) | WebAIM Million 2026 |
| Page complexity | 1,437 elements per page on average, +22.5% in one year | WebAIM Million 2026 |
| Common failures | Low contrast text 83.9%, missing alt text 53.1%, missing form labels 51% | WebAIM Million 2026 |

**Problem statement:** Blind users can technically reach the web, but reading, comparing and completing tasks on cluttered, inaccessible pages is slow, exhausting and error-prone.

---

## 4. Existing tools for blind users (research)

### 4.1 Screen readers (what blind users already rely on)

| Tool | Platform / cost | AI features | Notes |
|---|---|---|---|
| **JAWS** (Vispero / Freedom Scientific) | Windows; ~$95/yr home, ~$1,200 professional | Picture Smart AI (image/screen descriptions using ChatGPT and Claude), FSCompanion (how-to help), **JAWS AI Agent (2026)** that uses screen capture and clicks by coordinates to navigate inaccessible software | Most popular: 55.0% primary / 69.2% common use (WebAIM 2026 survey) |
| **NVDA** (NV Access) | Windows; free, open source | On-device AI image descriptions tested in 2026.1 alpha, reportedly withdrawn or postponed over performance and model size; community add-ons such as Vision Assistant Pro (Gemini) | 2nd most popular: 32.9% / 59.3% |
| **VoiceOver** | Apple; built in | Image and screen descriptions | |
| **TalkBack** | Android; built in | Gemini image and whole-screen descriptions and Q&A | Reported as slow and sometimes hanging in Indian use; web navigation issues |
| **Chrome image descriptions** | Chrome + any screen reader | Describes unlabeled images; supports Hindi | |

**In India:** JAWS is too expensive for most users, so NVDA and TalkBack dominate.

### 4.2 AI vision assistants

| App | What it does | Cost |
|---|---|---|
| **Be My Eyes / Be My AI** | AI descriptions of the screen, files, clipboard or webcam, with follow-up chat; volunteer video calls on phone. Desktop on Windows and Mac (Mac launched July 2026); Workplace edition for businesses | Free (Workplace is paid) |
| **Seeing AI** (Microsoft) | Camera-based: reads text, identifies products and currency, describes scenes | Free |
| **Envision** | Camera app + optional smart glasses | Paid |
| **Lookout** (Google) | Camera-based assistant, Android only | Free |
| **Aira** | Human visual interpreters | Paid |

**Gap:** these describe what is visible; none of them complete tasks on websites.

### 4.3 AI browser extensions for blind users

| Extension | Features | Limits |
|---|---|---|
| **Rayo** | Describes page layout, summarises, skips to main content (ChatGPT) | Speech only, no tasks |
| **Accessibility Assistant** (Firefox) | Voice commands, spoken summary, AI-picked important links, image descriptions, page Q&A (needs your own Mistral key) | ~1 user |
| **AccessPlus+**, **"NVDA-style" Chrome extension** | AI summaries and smarter navigation using your own Gemini key | <20 users each |
| **Screen Agent** (CUNY, 2026, research) | Voice-first Chrome extension; conversational search; built with a visually impaired person | Prototype |
| **Screen Reader AI** (research) | Builds a live page map combining code structure, accessibility roles and visual layout | Prototype |

**Lesson:** "AI summarises the page" already exists and won't impress judges on its own.

### 4.4 AI agents that act on websites (newest category)

| Agent | Notes |
|---|---|
| **Gemini Auto Browse in Chrome** (Jan 2026) | Built for general users. Blind reviewers found it can fill forms, but unannounced focus jumps and content changes are deeply disorienting |
| **Microsoft Copilot Actions in Edge** | Similar issues |
| **JAWS AI Agent** (2026) | Inside JAWS; coordinate-based clicking |
| **Guide** | Windows desktop app built specifically for blind and low-vision users |
| **OLLA** (research, 2026) | 3-week diary study, 8 blind users, 1,258 commands across 12 apps. Title: *"Are We There Yet?"* Agents still fail often |

**Lesson for our design:** be predictable. Announce every action, never move the user's place silently, allow pause and undo.

### 4.5 Accessibility overlays (avoid this positioning)

- Widgets websites add to "fix" accessibility, such as **accessiBe** and **UserWay**.
- They can stop screen readers from reading pages correctly.
- The US FTC fined **accessiBe $1M** (2025) for misrepresenting what its tool could do.
- The National Federation of the Blind banned accessiBe from its 2021 convention, and 700+ professionals signed the Overlay Fact Sheet.
- **Our tool must be user-installed and user-controlled, never a site-side overlay.**

---

## 5. Braille hardware and the low-cost braille industry

### 5.1 Price tiers (2026)

| Device | Type | Price |
|---|---|---|
| **Orbit Reader 20 Plus** | 20-cell; stepper motors instead of piezo | $899 |
| **APH Chameleon 20** | 20-cell | $1,715 |
| **APH Mantis Q40** | 40-cell + QWERTY keyboard | $2,682 |
| **Canute 360** (Bristol Braille) | 9 lines × 40 cells; mechanical, non-piezo | ~$2,500 |
| **Monarch** (APH + HumanWare + NFB) | 10 lines × 32 cells, 3,840 pins, tactile graphics, touch gestures, HDMI | ~$15,500–$17,995 (CAD 19,335) |
| **Dot Pad X** (Dot Inc., Korea) | Multi-line, 10 lines × 20 cells, tactile graphics | Premium |
| 80-cell single-line displays | — | $9,000+ |

- **Trend:** the low-cost end is moving away from expensive piezo pins to **stepper motors, shape-memory alloy (SMA), magnets and mechanical** designs.
- **Key point for us:** cheap displays save money by having **fewer cells**. With only 20 cells, raw screen reader text is painful, which makes **AI condensing more valuable** on cheaper devices.

### 5.2 India

- **IIT Delhi Assistech: DotBook.** India's first braille laptop (20-cell and 40-cell variants). Built on patented **SMA technology** that cuts cost by ~60%.
- **Government-funded SMA braille cell research.** Similar performance at an expected **one-eighth** the cost of standard piezo (PZT) cells.
- **Thinkerbell Labs (Bengaluru): Annie.** Self-learning braille literacy device for children aged 4–15. $625 in developing countries; in 80+ centres across 16 states. Backed by Anand Mahindra and the Indian Angel Network.
- **Drishti Library** (IIIT Hyderabad, part of Bhashini). Educational content for visually impaired learners in 12 Indian languages.

### 5.3 Open-source and DIY displays

- **Brindle:** micro-servo single cell, **$12**, 0.3 s refresh.
- **MagnePins** (Monash): modular DIY braille and tactile display made from cheap parts such as fabric pins.
- **MOLBED:** open-source modular low-cost braille display.
- **ESP32-based open projects** on Hackaday.
- **Canute Scientific** (Bristol Braille): Raspberry Pi 5 based; design files and firmware promised as open source.
- **Patent note:** an Indian patent application covers some micro-motor pin designs. Check before commercialising any hardware; it doesn't matter for a hackathon prototype.

### 5.4 Research on summarising for braille

- **BrailleSUM** (ACL 2015) summarises news while accounting for each sentence's braille length, producing shorter braille summaries. This is the closest prior work to our "braille-fit" idea, but it covers news only, not live websites or agents.

---

## 6. Features: what exists vs. what is new

### 6.1 Already exists (needed, but not our selling point)
| Feature | Where it exists |
|---|---|
| Reading the page aloud | Every screen reader, Read Aloud extensions |
| One-click page summary | Rayo, Accessibility Assistant, AccessPlus+ |
| Chat about the page | Accessibility Assistant, Be My AI desktop |
| AI image descriptions | Chrome, JAWS Picture Smart, Be My AI |
| Voice commands | Accessibility Assistant |
| Agent completes tasks | Gemini Auto Browse, Copilot Actions, JAWS AI Agent, Guide |
| Text to braille (Grade 1/2) | liblouis (used by all screen readers) |
| Showing text on a braille line | Every refreshable display |
| Showing tactile graphics | Monarch, Dot Pad (expensive) |

### 6.2 Exists, but we do it better
| Feature | Our difference |
|---|---|
| **Task agent built for blind users** | Every step announced ("Step 3/5: selecting seat 12A"); never moves the user silently; pause or undo from a button |
| **Page structure map** | Shown as touchable blocks on the tactile area, not just a summary |
| **Confirmation before irreversible actions** | Exact amount, recipient and item shown in braille with Confirm/Cancel buttons; speech alone is easy to mishear |
| **Image descriptions** | In the context of the task ("size chart; your size M is 38-inch chest") |

### 6.3 New (as far as our research found)
| # | Feature | What it does |
|---|---|---|
| 1 | **Braille-fit writing** | AI rewrites answers to fit the braille line, most important fact first ("3 under ₹5k · cheapest IndiGo 6:10 ₹4,230"); a button expands it |
| 2 | **Context-aware braille buttons** | The AI picks the 5–6 most likely actions per page and labels the buttons in braille; labels change with the page |
| 3 | **My Buttons** | User creates shortcuts by voice ("make a button that checks my PNR"); the agent records the steps and saves them under a braille label |
| 4 | **Generated tactile graphics** | AI-simplified price charts, product shapes, map routes, seat maps with free seats raised |
| 5 | **Comparison grid** | "Compare these 3 phones" gives one braille row per product, with buttons to switch attributes |
| 6 | **Voice and braille split by design** | Voice for conversation and direction; braille for exact data (prices, OTPs, PNRs, spellings) |
| 7 | **Fair-play alerts** | Flags pre-ticked add-ons, hidden convenience fees, fake countdown timers, cheaper options hidden lower down |
| 8 | **Indian languages** | Kannada/Hindi voice + Bharati Braille output |
| 9 | **"Where was I?"** | Per-tab task memory: "You were comparing 3 flights; the IndiGo one was cheapest" |

### 6.4 Competitive comparison
✔ yes · ◐ partial · ✘ no

| Capability | Screen readers | AI summary extensions | AI browser agents | Braille displays | **Sparsh** |
|---|---|---|---|---|---|
| Completes tasks for you | ◐ | ✘ | ✔ | ✘ | ✔ |
| Designed for blind users; narrates every step | ✔ | ✔ | ✘ | ✔ | ✔ |
| Condenses content to fit braille | ✘ | ✘ | ✘ | ✘ | ✔ |
| Touchable spatial page map | ✘ | ✘ | ✘ | ◐ | ✔ |
| Context-aware braille buttons | ✘ | ✘ | ✘ | ✘ | ✔ |
| User-made one-press shortcuts (by voice) | ◐ | ✘ | ✘ | ✘ | ✔ |
| Braille confirmation before payments | ✘ | ✘ | ◐ | ✘ | ✔ |
| Flags hidden fees and dark patterns | ✘ | ✘ | ✘ | ✘ | ✔ |
| Kannada/Hindi voice + Bharati Braille | ◐ | ✘ | ◐ | ◐ | ✔ |
| Cost to user | Free–$95/yr | Free (own API key) | Bundled/subscription | $899–$15,500 | Free software |

**USP:** A web agent that writes for the fingertips, not just the ears. The parts exist separately; nothing we found combines agentic AI, braille-aware writing, and a navigator designed for low cell counts.

---

## 7. The simulated device design

```
┌─────────────────────────────────────────────┐
│  TACTILE GRAPHICS AREA                       │
│  (page map, charts, seat maps, shapes)       │
├─────────────────────────────────────────────┤
│  ⠃⠗⠁⠊⠇⠇⠑ ⠇⠊⠝⠑  (braille line, 32–40 cells)      │
├───────┬───────┬───────┬───────┬───────┬─────┤
│ ⠃⠥⠽  │ ⠝⠑⠭⠞ │ ⠉⠍⠏ │ ⠃⠁⠉⠅ │ ⠍⠽ ⠁ │ ⠓⠑⠇⠏│ ← braille label per button
│  [1]  │  [2]  │  [3]  │  [4]  │  [5]  │ [6] │ ← buttons
└───────┴───────┴───────┴───────┴───────┴─────┘
```

### 7.1 How the touchable page map works
- The page is drawn as raised outlines, each with a braille letter inside (H header, F filters, R results, C cart).
- Size and position match the real page, so the user learns the layout spatially.
- The braille line can act as a key: `H header · F filters · R results 24 · C cart 2`.

**Gestures (touch explores, double-tap activates):**
| Gesture | Result |
|---|---|
| Finger rests on a region | Short voice cue or braille details ("Results, 24 items") |
| Double-tap | Agent jumps there; braille line shows the first item; buttons change (*Next · Prev · Open · Compare…*) |
| Long-press | "What's in here?" summary of that region |
| Two-finger swipe | Scroll the map |

**How real hardware could sense touch:** an infrared frame (beams above the pins; the Monarch already supports touch gestures), a capacitive film over the pins, or pins acting as push buttons.

**In the simulation:** mouse hover = finger resting, double-click = double-tap, real taps on a touchscreen (judges can try it with eyes closed), and arrow keys + Enter as a keyboard alternative.
**Under the hood:** the agent splits the page into regions and records each one's position and size; these are scaled to the grid, and each grid cell knows its region.

### 7.2 Example button sets by context
- Product page: *Buy · Reviews · Compare · Back · My shortcut · Help*
- Checkout: *Confirm · Edit · Cancel · …*
- Results list: *Next · Prev · Open · Compare · …*

---

## 8. Architecture and tech stack

### 8.1 Process flow
**Input** (voice goal / button / tap) → **Capture** (extension reads accessibility tree + DOM) → **Understand** (LLM builds page map + step plan) → **Act** (extension clicks/types; safety gate before payments) → **Output** (braille line + tactile map + speech + new button labels)

### 8.2 Architecture
```
User (voice · touch · 6 buttons)
      ⇅ speech, touch
Sparsh Navigator (React + SVG simulator)
      ⇅ chrome messaging
Chrome Extension (MV3: page reader + action executor) ⇅ read/act ⇄ Any website (DOM + accessibility tree)
      ⇅ WebSocket
FastAPI Backend (Planner · Page Mapper · Braille Condenser · Safety Gate · Session memory)
      → LLM API (Gemini / Claude)
      → liblouis (braille translation)
      → Speech (Web Speech API · Bhashini)
      → SQLite (My Buttons, preferences)
```

### 8.3 Tech stack
| Layer | Tool | Why |
|---|---|---|
| Frontend | Chrome Extension (Manifest V3) | Runs in the user's real browser with their logins; content scripts read and act on any site |
| Navigator UI | React + SVG | Interactive tactile area, braille line and buttons; touch, mouse and keyboard input |
| Backend | Python FastAPI + WebSockets | Async; streams each agent step to the navigator in real time |
| AI | Multimodal LLM API (Gemini / Claude) | Plans actions, builds the page map, condenses text; vision for unlabeled UI |
| Page understanding | Accessibility tree + DOM + screenshot | Real roles and labels first; pixels only when markup fails |
| Braille | liblouis | Open-source standard: UEB Grade 1/2 and Bharati Braille |
| Speech | Web Speech API + Bhashini | Free English in-browser; Kannada/Hindi via India's Bhashini language APIs |
| Database | SQLite (local) | My Buttons, preferences, task memory kept private on the device |

---

## 9. Hackathon scope (24-hour MVP)

- **Must build:**
  - Chrome extension + FastAPI agent + interactive navigator simulator
  - Braille-fit writing (#1) and context buttons (#2)
  - Voice/braille split (#6)
  - Narrating task agent + confirmation gate
- **Signature features:** My Buttons (#3), tactile graphics (#4)
- **If time allows:** comparison grid (#5), fair-play alerts (#7), Kannada/Hindi (#8), "Where was I?" (#9)

### Demo script (~3 minutes)
1. Show how slow a normal linear read of a cluttered shopping or travel page is.
2. Open Sparsh: the page map appears on the tactile area in ~2 seconds; touch to explore.
3. "Compare the 3 cheapest": braille rows plus context buttons.
4. "Buy the second one": steps are narrated, then everything stops at the braille confirmation gate.
5. Create a "My Button" by voice and run it.

---

## 10. Impact and feasibility

**Impact**
- **Who:** 4.95M blind and ~35M visually impaired Indians; 43.3M blind people worldwide; elderly and low-vision users.
- **Measurable outcomes:** task time vs. a screen reader alone, keypresses per task, checkout errors, braille cells read per task.
- **Scale:** works on any website with no site changes; languages via Bhashini; the same engine fits 20-, 40-cell or multi-line displays.

**Feasibility**
- **Technical:** only proven tools (Chrome extension APIs, LLM APIs, liblouis, Web Speech).
- **Time:** the MVP is one end-to-end journey + simulator; other features are modular.
- **Cost:** open-source stack, no hardware; the main running cost is LLM calls per task, which can be cut later with small or on-device models.

**Risks and mitigations**
| Risk | Mitigation |
|---|---|
| AI clicks the wrong element | Acts only on real page elements; every step announced; undo |
| Unwanted payment or submission | Hard confirmation gate in braille + voice; never pays on its own |
| Privacy of personal data | Page sent only on user command; passwords and OTPs never stored or sent to AI |
| Inaccessible or canvas-heavy sites | Screenshot + vision-model fallback |
| Logins and CAPTCHAs | Handed back to the user; the agent never solves them |
| Slow responses | Stream speech first; cache the page map |

---

## 11. Business model (proposed, for the team to confirm)

- **Target customers and market:**
  - individuals: 4.95M blind + ~35M visually impaired in India; 43.3M blind worldwide
  - institutions: blind schools, NGOs, college accessibility cells
  - businesses serving disabled customers: banks, e-commerce, government portals
- **Revenue:**
  - free core for individuals
  - B2B "Sparsh Insights": anonymised, opt-in reports on where blind users get stuck on a site
  - licensing the braille-condensing engine to braille device makers
  - CSR funding and grants for schools
- **Go-to-market:**
  - pilot with Bengaluru NGOs (NAB Karnataka, Mitra Jyothi) and blind testers
  - free listing on the Chrome Web Store
  - demos in accessibility communities and special-education schools
- **Key costs:** LLM and speech API usage, development and paid user testing, light hosting.
- **Target partners:**
  - Bhashini (Indian-language speech)
  - Thinkerbell Labs (Bengaluru) and IIT Delhi Assistech (DotBook)
  - NGOs and CSR programmes
- **Growth:**
  - move to small or on-device models to cut per-task cost
  - a community library of shared My Buttons for IRCTC, banks and other common sites
  - an Android version
  - power real low-cost braille hardware with partners

---

## 12. Earlier options considered (for reference)

- **Integrating with NVDA:** an NVDA add-on (Python global plugin) could add hotkeys, speak and braille output through `ui.message`, and include a braille display driver (subclass `braille.BrailleDisplayDriver`). NVDA's built-in Braille Viewer shows braille output on screen. *Dropped in favour of a standalone design.*
- **TalkBack:** no plugin system, so integration would need a separate accessible Android app. Chrome on Android doesn't run extensions.
- **Physical prototype:** 4–8 cells on an ESP32 with micro-servos or solenoids (reference: Brindle, $12 per cell). *Dropped; simulation only.*
- **If judges ask "why not just an NVDA add-on?"** Screen readers turn the page into speech and braille line by line. Sparsh changes what the user receives in the first place: a structured, condensed, actionable version of the page, on a device designed for it.

---

## 13. Sources

**Blindness statistics**
- Lancet Global Health / VLEG, global vision loss 2020: https://pubmed.ncbi.nlm.nih.gov/33275950/
- 43.3M blind / 295M MSVI summary: https://theophthalmologist.com/subspecialties/a-way-out-of-the-dark
- IAPB Vision Atlas, global projections: https://www.iapb.org/wp-content/uploads/2021/02/Vision-Atlas_Evidence-Series_Magnitude-of-VIsion-Loss_24022021.pdf
- IAPB Vision Atlas, India: https://iapb.org/learn/vision-atlas/magnitude-and-projections/countries/india
- India blind population (4.95M), economic burden study: https://pmc.ncbi.nlm.nih.gov/articles/PMC9359234
- National survey 2015–19 (AIIMS / NPCB&VI): https://pmc.ncbi.nlm.nih.gov/articles/PMC9302795 · https://indiavisionatlasnpcb.aiims.edu/?p=688

**Web accessibility**
- WebAIM Million: https://webaim.org/projects/million/
- 2026 findings summary: https://www.nexerdigital.com/news-and-thoughts/the-webaim-million-report-2026-what-it-tells-us
- 2026 failure breakdown: https://prioritypixels.co.uk/insights/web-accessibility-is-getting-worse-according-to-the-2026-webaim-million-report/

**Screen readers and AI features**
- JAWS (Wikipedia, WebAIM survey share): https://en.wikipedia.org/wiki/JAWS_(screen_reader)
- NVDA (Wikipedia): https://en.wikipedia.org/wiki/NonVisual_Desktop_Access
- JAWS Picture Smart AI: https://www.freedomscientific.com/training/jaws/new-and-improved-features/
- FSCompanion / Fusion 2025 update: https://blog.freedomscientific.com/download-the-december-update-of-fusion-suite-2025
- JAWS AI Agent: https://aryaniraula.com.np/jaws-ai-agent-vispero-2026/
- NVDA on-device image description status: https://groups.google.com/a/nvaccess.org/g/nvda-users/c/JxrfMkAjzHU
- Vision Assistant Pro (NVDA add-on): https://applevis.com/comment/210243
- Google TalkBack/Chrome Gemini updates: https://blog.google/outreach-initiatives/accessibility/android-gemini-ai-gaad-2025/
- Chrome image descriptions: https://support.google.com/chrome/answer/9311597
- India accessibility gap and costs: https://www.newslaundry.com/2025/03/04/available-tech-affordability-drawbacks-all-you-need-to-know-about-indias-accessibility-gap

**AI vision apps**
- Be My Eyes for Mac: https://www.bemyeyes.com/?p=21194297
- Be My Eyes desktop app: https://support.bemyeyes.com/hc/en-us/articles/48284640206353
- Seeing AI vs Lookout: https://houstonlighthouse.org/?p=24718

**AI extensions and agents**
- Rayo: https://chrome.google.com/webstore/detail/the-rayo-assistant/bcklgjhgkajacjojgblclcagabknpggp
- Accessibility Assistant: https://addons.mozilla.org/firefox/addon/accessibility-assistant/
- AccessPlus+: https://chromewebstore.google.com/detail/accessplus+/ghcoaiokhlfbiegjejolkjjiaagheblk
- Screen Agent (CUNY): https://openlab.bmcc.cuny.edu/research-and-scholarship/2026/05/14/screen-agent-a-voice-first-browser-extension-for-accessible-web-navigation-using-local-ai/
- Screen Reader AI paper: https://www.researchgate.net/publication/396362763_Screen_Reader_AI_A_Conversational_Web-Accessibility_Assistant_for_Blind_and_Low-Vision_Users
- OLLA / "Are We There Yet?": https://arxiv.org/abs/2609.00524v1
- Gemini Auto Browse review (Blind Access Journal): https://blindaccessjournal.com/2026/03/beyond-the-screen-reader-can-geminis-ai-agent-accessify-the-web/
- "Not a Panacea" (agents + Guide): https://blindaccessjournal.com/2026/03/not-a-panacea-why-ai-browser-agents-havent-solved-the-inaccessible-web-and-what-comes-next/

**Overlays**
- FTC fines accessiBe: https://techcrunch.com/2025/01/03/ftc-orders-ai-accessibility-startup-accessibe-to-pay-1m-for-misleading-advertising
- Adrian Roselli on the FTC action: https://adrianroselli.com/2025/01/ftc-catches-up-to-accessibe.html

**Braille hardware**
- Monarch (APH): https://aph.org/product/monarch
- Monarch vs Dot Pad X (NFB Braille Monitor): https://nfb.org/images/nfb/publications/bm/bm26/bm2605/bm260506.htm
- Monarch price (CNIB): https://cnibsmartlife.ca/products/monarch-dynamic-tactile-graphic-display
- Multi-line displays overview (AFB): https://www.afb.org/blog/entry/spotlighting-multi-line-displays
- 2026 buyer's guide (price tiers): https://www.disabilityworld.org/articles/refreshable-braille-displays-buyers-guide/
- Prices checked Oct 2026: https://braillito.com/en/blog/refreshable-braille-display/
- MagnePins (Canute 360 price): https://dl.acm.org/doi/10.1145/3746059.3747692
- Brindle ($12 cell): https://ieeexplore.ieee.org/document/10456453/
- MOLBED: https://hackaday.io/project/12442-molbed-modular-low-cost-braille-electronic-display
- Canute Scientific: https://www.crowdsupply.com/bristol-braille-technology/canute-scientific
- DotBook (IIT Delhi): https://news.careers360.com/iit-delhi-launches-indias-first-braille-laptop-dotbook/amp
- Assistech (CACM): https://cacm.acm.org/research/computing-and-assistive-technology-solutions-for-the-visually-impaired
- SMA braille cells (1/8 cost): https://www.indiascienceandtechnology.gov.in/research/development-refreshable-braille-cells
- Thinkerbell Annie: https://www.outlookbusiness.com/enterprise-3/big-idea-14/hello-annie-5059 · https://frontiertech.niti.gov.in/story/reimagining-braille-education-a-self-learning-braille-tutor-empowers-visually-impaired-learners-through-ai-and-gamification/
- Patent note (Hackaday): https://hackaday.com/2016/04/28/refreshable-braille-display-and-braille-keyboard
- BrailleSUM: https://preview.aclanthology.org/fix_video/P15-2095.pdf
- Drishti Library (IIIT-H / Bhashini): https://blogs.iiit.ac.in/?p=29697

**NVDA development (if ever needed)**
- NVDA add-ons overview: https://www.mintlify.com/nvaccess/nvda/development/addons
- NVDA braille drivers: https://www.mintlify.com/nvaccess/nvda/development/advanced/braille-drivers
