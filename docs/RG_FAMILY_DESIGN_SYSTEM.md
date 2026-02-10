# RG FAMILY Unified Design Package V3.0 (Final)

> **"Uncompromising Modern Luxury"**
> User feedback on visual inconsistency has been addressed. All pages now strictly adhere to a single **Unified Design Language**.

## 1. Unified Style Guide

모든 페이지는 아래의 디자인 원칙을 엄격하게 따릅니다.

## 1. Unified Brand Identity: "The RG Signature"

> Design centered around the unique duality of the RG Brand Logos.

### 🌗 Brand Modes

- **Mode A: 'Noir & Rose Gold' (Dark Identity)**:
  - **Anchor**: **3D Metallic Pink/Rose Gold RG Logo** (User Provided).
  - **Palette**: Matte Black (`#0F1115`), Rose Gold (`#E6B8B7`), Metallic Pink (`#FFC0CB` sheen).
  - **Vibe**: Automotive Luxury, High-End Jewelry, Exclusive Club.
- **Mode B: 'Studio Blanc' (Light Identity)**:
  - **Anchor**: **Black Calligraphic Sharp RG Logo** (User Provided).
  - **Palette**: Clean White (`#FFFFFF`), Sharp Black (`#000000`), Cool Gray.
  - **Vibe**: High-End Creative Studio, Vogue Editorial, Art Gallery.

---

## 2. "Digital Twin" UI Gallery (V6.0 Final)

> **Approved for Development**: These designs match the exact component structure of the current codebase (`Hero -> Grid -> Shorts -> VOD`).

### 🏠 A. Main Home (Layout Sync)

**Dark Mode (Noir & Rose Gold)**
![Main Home Dark Real](/Users/bagjaeseog/.gemini/antigravity/brain/cb4ec436-472a-4725-aeb8-e6e750135ebe/main_home_dark_real_layout_1767191537484.png)

> **Structure**: Hero Slider → Live (Grid) & Notice (List) Split → Shorts (Tabbed) → VOD (Tabbed).
> **Style**: 3D Metallic Logo, Dark Glass Cards, Rose Gold Highlights.

**Light Mode (Studio Blanc)**
![Main Home Light Real](/Users/bagjaeseog/.gemini/antigravity/brain/cb4ec436-472a-4725-aeb8-e6e750135ebe/main_home_light_real_layout_1767191513375.png)

> **Structure**: Identical 1:1 match to Dark Mode layout.
> **Style**: Black Calligraphy Logo, Clean Borders, Editorial Typography.

### 📅 B. Project Management Pages

_Same functionality, applied with the new Palette._

### 📅 B. Project Management & Info (New)

**Signature Gallery (Proposed Page)**
![Signature Gallery](/Users/bagjaeseog/.gemini/antigravity/brain/cb4ec436-472a-4725-aeb8-e6e750135ebe/signature_list_page_1767191116598.png)

> **New Feature**: A refined gallery to showcase member autographs, pulling data from `SignatureData` mock structure.

**Schedule & Calendar**
![Schedule Page](/Users/bagjaeseog/.gemini/antigravity/brain/cb4ec436-472a-4725-aeb8-e6e750135ebe/schedule_page_luxury_1767190848742.png)

> Clean, spacious calendar with gold accents for special events. Tooltips use a glassmorphic overlay.

**Organization Chart**
![Org Chart](/Users/bagjaeseog/.gemini/antigravity/brain/cb4ec436-472a-4725-aeb8-e6e750135ebe/org_chart_luxury_1767190871944.png)

> An interactive tree graph. Connecting lines are thin and metallic. Nodes are profile avatars with elegant rings.

### 🏆 C. Community & Ranking (Dark Mode)

**Ranking Podium**
![Ranking Lux](/Users/bagjaeseog/.gemini/antigravity/brain/cb4ec436-472a-4725-aeb8-e6e750135ebe/ranking_page_luxury_1767190576722.png)
\_page_luxury_1767190576722.png)

> **Refined Detail**: Instead of flashy colors, rank is denoted by architectural elevation (glass podiums) and subtle metallic badges.

### 💬 Community

_The "Private Club" Feed_
![Community Luxury UI](/Users/bagjaeseog/.gemini/antigravity/brain/cb4ec436-472a-4725-aeb8-e6e750135ebe/community_page_luxury_1767190596647.png)

> **Refined Detail**: Text-heavy but breathable. Images are presented like art pieces in a gallery. Sidebar is minimal and unobtrusive.

### 👑 VIP Lounge

_The "Golden Hour" Experience_
![VIP Luxury UI](/Users/bagjaeseog/.gemini/antigravity/brain/cb4ec436-472a-4725-aeb8-e6e750135ebe/vip_page_luxury_1767190619029.png)

> **Refined Detail**: Gold accents are used sparingly but effectively to denote exclusivity. The darker background makes the gold pop elegantly.

---

## 3. Implementation CSS Variables (Draft)

```css
:root {
  /* Backgrounds */
  --bg-main: #0a0a0a;
  --bg-card: #121212;
  --bg-overlay: rgba(255, 255, 255, 0.03);

  /* Text */
  --text-primary: #ededed;
  --text-secondary: #a1a1a1;
  --text-accent: #d4af37; /* Champagne Gold */

  /* Borders */
  --border-thin: 1px solid rgba(255, 255, 255, 0.08);

  /* Fonts */
  --font-serif: "Playfair Display", serif;
  --font-sans: "Inter", sans-serif;
}
```
