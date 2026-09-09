# Design System & Animation Guide — Ferry Febriansyah Portfolio

Dokumen ini adalah panduan resmi desain, tipografi, warna, layout, dan spesifikasi animasi untuk portfolio pribadi ini. AI coding agent WAJIB mengikuti panduan ini persis saat membangun/mengubah UI dan animasi di project ini.

---

## 1. Tech Stack

**Rekomendasi: HTML + CSS + Vanilla JS, dengan library GSAP (+ ScrollTrigger plugin)**

Alasan:
- Sebagian besar animasi di project ini adalah **scroll-driven / scroll-scrubbed** (typewriter berdasarkan scroll, pinned card stack, dsb). GSAP ScrollTrigger adalah standar industri untuk kasus ini dan jauh lebih stabil dibanding bikin sendiri dengan `IntersectionObserver` manual.
- User (owner project) sudah terbiasa dengan HTML/CSS/JS murni — tidak perlu overhead build tool/framework (React/Next.js) untuk single-page portfolio seperti ini.
- Kalau ke depan project berkembang jadi multi-page atau butuh CMS/blog, migrasi ke Next.js bisa dipertimbangkan ulang. Untuk saat ini, **tidak direkomendasikan** karena menambah kompleksitas tanpa benefit signifikan.

**Library yang dipakai:**
- [GSAP](https://gsap.com/) core + `ScrollTrigger` plugin — untuk semua animasi scroll-linked, pinning section, dan stacking card
- Vanilla JS untuk interaksi sederhana (hover state, flip card, drawer toggle, word rotator)
- Tidak perlu CSS framework (Tailwind opsional kalau agent lebih familiar, tapi custom CSS dengan CSS variables sudah cukup)

---

## 2. Typography

**Font: Space Grotesk** (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

Hanya ada 2 ketebalan yang dipakai di seluruh project:
- **Medium (500)** — untuk body text, deskripsi, label
- **Bold (700)** — untuk headline, judul section, button, angka index

### Font size scale

| Elemen | Ukuran (px) | Weight |
|---|---|---|
| Headline utama hero ("Hi there, I'm Ferry") | 100px | Bold (700) |
| Sub-headline ("Let's create something great together", "Let's collaborate!") | 40px | Bold (700) |
| Teks dalam chat bubble ("UI/UX Designer", "Web Developer") | 30px | Bold (700) |
| Navbar item, paragraf kecil/body text, label | 20px | Medium (500) |

> Catatan untuk agent: gunakan `clamp()` untuk responsive scaling di mobile, misal:
> `font-size: clamp(2.5rem, 8vw, 6.25rem);` untuk headline 100px, supaya tidak overflow di layar kecil. Rasio antar breakpoint tetap mengikuti scale di atas.

### CSS Variables

```css
:root {
  --font-primary: 'Space Grotesk', sans-serif;
  --fw-medium: 500;
  --fw-bold: 700;

  --fs-hero: 100px;
  --fs-subheadline: 40px;
  --fs-bubble: 30px;
  --fs-body: 20px;
}
```

---

## 3. Colors

```css
:root {
  --color-bg: #0D0D0D;              /* background utama, dark */
  --color-accent-green: #22C55E;    /* signature color, dipakai di CTA, badge, highlight teks */
  --color-white: #FFFFFF;           /* teks utama */
  --color-text-secondary: rgba(255, 255, 255, 0.5); /* teks sekunder/deskripsi/placeholder = putih opacity 50% */
  --color-card-bg: #1A1A1A;         /* background card/pill sekunder (bubble kontak, dsb) — estimasi, sesuaikan dengan asset */
  --color-border-subtle: rgba(255, 255, 255, 0.1); /* divider garis tipis antar section/accordion */
}
```

> **Catatan:** `--color-bg` (`#0D0D0D`) adalah estimasi karena background sebenarnya memakai **asset gambar/texture** (lihat poin 4). Jika ada bagian tanpa gambar background, pakai hex ini sebagai fallback solid color.

**Aturan pemakaian warna:**
- Hijau (`--color-accent-green`) dipakai **terbatas**: dot status "Available", kata kunci di headline ("Ferry", "designing and building things on the web"), tombol CTA solid, underline "GET-IN TOUCH", border modal/drawer.
- Jangan pakai hijau di lebih dari 2 titik fokus per section, supaya tetap ada hierarki visual.

---

## 4. Background Asset

- Background utama menggunakan **gambar/texture asset** (dark gradient/noise), **bukan warna solid biasa**.
- Asset ini **fixed/stay** — tidak ikut bergerak saat scroll (gunakan `background-attachment: fixed;` untuk pendekatan CSS sederhana, atau posisikan sebagai elemen `position: fixed` di belakang seluruh konten dengan `z-index: -1` untuk kontrol lebih baik termasuk di mobile, karena `background-attachment: fixed` punya bug di beberapa mobile browser).

```css
.bg-fixed {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: url('/assets/bg-texture.jpg');
  background-size: cover;
  background-position: center;
}
```

---

## 5. Border Radius

```css
:root {
  --radius-navbar: 50px;   /* navbar pill, badge status, contact pill */
  --radius-button: 10px;   /* semua button hijau solid (CTA) */
}
```

- Navbar items, badge "Available for New Project", pill kontak (email/IG/WA) → `border-radius: var(--radius-navbar)`
- Button hijau ("Let's Talk", "See The Work", "Let's Talk" di drawer) → `border-radius: var(--radius-button)`

---

## 6. Component & Animation Specifications

### 6.1 Hero Heading — Word Rotator + Hover Lift/Invert

**Bagian kata "Ferry"** berganti otomatis tiap 5 detik, loop terus:
`Ferry` → `WebDev` → `UI/UX` → kembali ke `Ferry` → ulang

- Nama: **Text Swap / Word Cycle**
- Transisi antar kata: fade + slight translateY (crossfade), durasi ~0.4s
- Interval: `setInterval` 5000ms, ganti `textContent` + retrigger CSS animation class

```js
const words = ["Ferry", "WebDev", "UI/UX"];
let i = 0;
setInterval(() => {
  i = (i + 1) % words.length;
  el.classList.remove('text-swap-in');
  void el.offsetWidth; // reflow trick untuk retrigger animasi
  el.textContent = words[i];
  el.classList.add('text-swap-in');
}, 5000);
```

**Seluruh heading**, saat di-hover (per huruf, split dengan `<span class="h-letter">`):
- Nama: **Hover Lift & Color Invert**
- Efek: huruf naik sedikit (`translateY(-6px)`) + warna invert (putih → hijau, hijau → putih)
- Transition: `transform 0.2s ease, color 0.2s ease`

```css
.h-letter {
  display: inline-block;
  transition: transform 0.2s ease, color 0.2s ease;
}
.h-letter:hover {
  transform: translateY(-6px);
}
.h-letter.is-white:hover { color: var(--color-accent-green); }
.h-letter.is-green:hover { color: var(--color-white); }
```

### 6.2 Sub-headline ("Designing and building products, end-to-end.") — Scroll-Scrubbed Typewriter

- Nama: **Scroll-Scrubbed Typewriter**
- Progress kemunculan karakter **terikat langsung ke posisi scroll**, bukan berjalan otomatis berdasarkan waktu
- Scroll ke bawah → teks makin lengkap muncul; scroll ke atas → teks perlahan hilang seperti backspace (reversible penuh)
- Implementasi: GSAP ScrollTrigger dengan `scrub: true`, target `stagger` per karakter (split teks pakai helper seperti SplitText plugin atau split manual per `<span>`)

```js
gsap.from(".char", {
  opacity: 0.15,
  stagger: 0.05,
  scrollTrigger: {
    trigger: ".subheadline",
    start: "top 80%",
    end: "bottom 50%",
    scrub: true
  }
});
```

> Digunakan juga untuk: paragraf "2+ years designing and building things..." (section Skills), dan paragraf "From early concepts to refined experiences..." (section footer/contact).

### 6.3 Chat Bubble ("UI/UX Designer", "Web Developer") — Notification Bounce Loop

- Nama: **Chat Bubble Pop / Notification Bounce**
- Efek: scale dari 0 → overshoot 1.1 → settle ke 1 (elastic), loop terus menerus dengan jeda
- Kedua bubble muncul **bergantian** (bubble 1 pop → hold → hilang, lalu bubble 2 pop → hold → hilang, ulang) — perlu dikonfirmasi timing pastinya saat implementasi, default sarankan: muncul 3s, jeda 1s sebelum bubble berikutnya.

```css
@keyframes bubblePop {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.1); opacity: 1; }
  80%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
```

### 6.4 Skills & Tools Icons — Flip Card

- Nama: **3D Flip Card**
- Trigger: **klik** (bukan hover) — setiap icon adalah card dengan 2 sisi (depan = icon, belakang = nama tool teks, misal "Figma")
- Toggle class `.flipped` via JS pada klik

```css
.flip-card { perspective: 1000px; }
.flip-card-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
}
.flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
.flip-front, .flip-back {
  backface-visibility: hidden;
  position: absolute;
  inset: 0;
}
.flip-back { transform: rotateY(180deg); }
```

### 6.5 Services List ([1] Website Development, dst.) — Hover Accordion (Exclusive)

- Nama: **Exclusive Hover Accordion**
- Default: item [1] "Website Development" terbuka (expanded) saat halaman pertama kali load / tidak ada hover
- Saat hover ke item lain → item itu terbuka, semua item lain otomatis tertutup
- Saat mouse keluar dari semua item → kembali ke default (item [1] terbuka)
- Gunakan sedikit delay (~150ms) sebelum expand untuk menghindari flicker saat mouse cuma lewat (hover intent delay)

```css
.accordion-item {
  max-height: 60px;
  overflow: hidden;
  transition: max-height 0.4s ease;
}
.accordion-item.active { max-height: 320px; }
```

### 6.6 Work Section (10 project cards) — Scroll-Pinned Card Stack

- Nama: **Scroll-Pinned Card Stack** dengan exit animation **Fly-up Tilt Exit**
- Section ini **di-pin** (dikunci di layar) selama animasi berjalan — user tidak bisa scroll ke section berikutnya sampai semua 10 card selesai "dimainkan"
- Progress animasi terikat scroll (scrubbed), bukan otomatis
- Tiap card keluar dengan arah: **ke atas + rotasi miring ke kiri** (konsisten untuk semua card, bukan acak)
- Reversible: scroll ke atas mengembalikan card sebelumnya turun kembali ke posisi semula

```js
const cards = gsap.utils.toArray(".work-card");

ScrollTrigger.create({
  trigger: ".work-stack-section",
  start: "top top",
  end: () => "+=" + (cards.length * window.innerHeight),
  pin: true,
  scrub: true,
});

cards.forEach((card, i) => {
  if (i === cards.length - 1) return; // card terakhir tidak perlu exit
  gsap.to(card, {
    y: "-120%",
    rotate: -8,
    ease: "none",
    scrollTrigger: {
      trigger: ".work-stack-section",
      start: `top+=${i * window.innerHeight} top`,
      end: `top+=${(i + 1) * window.innerHeight} top`,
      scrub: true,
    }
  });
});
```

**Warna background tiap card** — sarankan variasi tone dari 2 warna brand (hijau `--color-accent-green` dan dark `--color-bg`/`--color-card-bg`) secara **alternating** (selang-seling), untuk konsistensi brand. Contoh urutan:
`Card 1: dark → Card 2: hijau → Card 3: dark → Card 4: hijau ... dst`

> Catatan: warna biru/coklat pada referensi visual (Jack3d, Almore Capital) adalah contoh dari website lain untuk menunjukkan gerakan animasi saja — **bukan** palet warna yang dipakai di project ini.

### 6.7 Button "GET-IN TOUCH" — Hover Lift

- Nama: **Hover Lift Button**
- Efek: teks + underline naik sedikit (`translateY(-4px)`) saat hover, transisi smooth
- Klik button ini men-trigger **Drawer** (lihat 6.9)

```css
.get-in-touch-btn {
  display: inline-block;
  transition: transform 0.25s ease;
}
.get-in-touch-btn:hover { transform: translateY(-4px); }
```

### 6.8 Contact Pills (Email, Instagram, WhatsApp) — Hover Color Fill

- Nama: **Hover Color Fill**
- Efek sederhana: background berubah dari `--color-card-bg` ke `--color-accent-green` saat hover, transisi 0.3s

```css
.contact-pill {
  background-color: var(--color-card-bg);
  transition: background-color 0.3s ease;
}
.contact-pill:hover {
  background-color: var(--color-accent-green);
}
```

### 6.9 Contact Drawer — Slide-in Panel (Right Drawer)

- Nama: **Drawer / Slide-in Panel** (bukan modal center-screen)
- Trigger: klik button "GET-IN TOUCH"
- Posisi: menempel di tepi kanan layar, full height, lebar sebagian (misal 400-450px di desktop, full-width di mobile)
- Animasi masuk: `translateX(100%)` → `translateX(0)`, easing smooth (`cubic-bezier(0.25, 1, 0.5, 1)` atau `ease-out`), durasi ~0.4s
- Area di luar drawer (kiri) tetap normal terang, **tidak ada backdrop dim**

```css
.drawer {
  position: fixed;
  top: 0; right: 0;
  height: 100vh;
  width: 420px;
  background-color: var(--color-bg);
  border: 1px solid var(--color-accent-green); /* sesuai referensi frame biru di gambar, ganti ke hijau brand */
  border-radius: var(--radius-button);
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 100;
}
.drawer.open { transform: translateX(0); }
```

**Isi drawer:**
- Badge: `AVAILABLE FOR NEW PROJECT` (dot hijau, style sama seperti navbar badge)
- Headline: `Let's collaborate!` (hijau, bold, 40px sesuai scale sub-headline)
- Deskripsi: "Tell me what you're working on — a website, a product, or just an idea you're still shaping. I'll get back to you within 2 days."
- Input: `YOUR NAME`, `EMAIL`, `WHAT ARE WE BUILDING?` (textarea)
- Button submit: `Let's Talk` + ikon amplop, hijau solid, border-radius 10px

---

## 7. Naming Convention Reference (untuk class/file/function di kode)

| Fitur | Nama Class/Function yang Disarankan |
|---|---|
| Word rotator hero | `.text-swap`, `wordCycler()` |
| Hover lift + invert heading | `.h-letter`, `hoverLiftInvert` |
| Scroll-scrubbed typewriter | `.char`, `scrollTypewriter()` |
| Chat bubble bounce | `.chat-bubble-pop`, `bubblePop` keyframe |
| Flip card skill icons | `.flip-card`, `.flip-card-inner`, `flipCard()` |
| Accordion services | `.accordion-item`, `accordionHover()` |
| Work card stack | `.work-card`, `.work-stack-section`, `pinnedCardStack()` |
| Fly-up exit tiap card | `flyUpTiltExit` |
| Button hover lift | `.get-in-touch-btn` |
| Contact pill hover | `.contact-pill` |
| Drawer kontak | `.drawer`, `.drawer.open`, `toggleDrawer()` |

---

## 8. Instruksi Umum untuk AI Agent

1. Selalu gunakan CSS variables yang didefinisikan di bagian 2, 3, dan 5 — jangan hardcode hex/px baru tanpa alasan kuat.
2. Semua animasi scroll-linked (typewriter, card stack) **wajib** pakai GSAP ScrollTrigger dengan `scrub: true` supaya reversible mengikuti arah scroll, bukan animasi one-shot yang trigger sekali lalu selesai.
3. Font hanya Space Grotesk dengan 2 weight (500, 700) — jangan tambah weight lain.
4. Warna hijau (`--color-accent-green`) dipakai secukupnya sebagai aksen, bukan warna dominan.
5. Background image bersifat fixed — pastikan tidak ikut ter-transform/scroll saat animasi lain berjalan.
6. Jika ada detail yang belum jelas dari dokumen ini (misal warna card work project yang belum final, timing pasti bubble bounce), agent boleh membuat estimasi masuk akal namun harus konsisten dengan skema warna dan tipografi yang sudah ditetapkan.
