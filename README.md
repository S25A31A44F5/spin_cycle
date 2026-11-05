# 🧺 SpinCycle — Smart Laundry Room Booking App

**SpinCycle** is a polished, mobile-first web app designed for shared laundry rooms in hostels, university dormitories, and apartment complexes. It eliminates laundry room friction with live machine tracking, fair-share scheduling, QR-code check-ins, automated grace-period releases, and wholesome community incentives.

---

## ✨ Features Overview

### 1. 🧼 Resident Experience
- **Live Room Overview**: Visual status badges and animated washing machines for 4 distinct states:
  - **Ready** (empty drum, instant booking available)
  - **Reserved** (booked by a resident, grace-period countdown active)
  - **In Use** (spinning drum animation, bubbles, remaining minutes, estimated finish time)
  - **Needs Repair** (out-of-order plaque with technician ETA and safety lock)
- **Fast Slot Booking**: Select a washer and time slot across an advance booking window (e.g., up to 3 days), choose wash cycle types (Eco 30m, Normal 45m, Heavy 60m).
- **"I'm Here" & QR Code Check-In**:
  - Clear, one-tap **"I'm Here"** check-in button with celebratory confetti.
  - Interactive **Simulated QR Scanner** with camera crosshairs that scans physical washer stickers.
  - Clickable **"View Machine QR"** button on every machine card to inspect or test scan the physical sticker plaque.
- **Grace-Period Auto-Release**: If a resident does not check in within the configured grace period (e.g., 10 minutes), the reservation is automatically cancelled and the slot is immediately offered to the room waitlist. Includes a **"Fast-forward grace timer"** test button for instant evaluation.
- **Smart Extensions**: Residents can extend their wash by 15 minutes **only if the subsequent slot is vacant**. If another resident is scheduled, extension is politely blocked with clear explanation.
- **Finish Early**: Residents who unload early can tap **"Finished Early • Free Up Washer"**, returning the machine to `Ready`, notifying the waitlist, and earning community karma.
- **Room Waitlist**: Residents can join the queue when machines are busy. As soon as a machine frees up, an interactive alert banner prompts the waitlisted resident with an **"Accept Slot"** action.
- **Machine Fault & Supply Reports**: Simple reporting modal for clogged dispensers, door locks, leaks, loud vibrations, or missing detergent/baskets. Urgent reports automatically mark the machine for repairs.

### 2. 🤝 Fairness & Community
- **Configurable Booking Limits**: Residents are capped at active concurrent bookings (e.g., max 2 slots) to prevent hoarding.
- **Fair-Share Recommendation**: Residents with fewer recent bookings (e.g. Alex Rivera with 0 washes this week) receive priority suggestions highlighted with **`★ Fair Pick`** during peak hours.
- **Resident Identity Switcher**: Dropdown in the header allows testing different resident profiles:
  - *Alex Rivera* (0 washes this week — Fair Share Priority)
  - *Maya Sharma* (1 wash this week — Active user with machine in use)
  - *Liam O'Connor* (3 washes this week — At booking cap)
- **Low-Pressure Laundry Streaks**: Wholesome "On-Time Pickups" streaks (no stress, no punishment).
- **Friendly Neighbor Kudos**: Send pre-written compliments (*"✨ Left the washer drum spotless!"*, *"⏰ Prompt pickup right on time!"*).
- **Cooperative Community Challenge**: 100% cooperative shared goal (*"Reach 100 on-time pickups this week to earn free eco-detergent restocked for all"*). **Zero competitive leaderboards or public shaming.**
- **Spin of the Day**: Dismissible card featuring fabric care tips and lighthearted laundry puns.

### 3. 🛠️ Manager Dashboard
- **Room Operating Policies**:
  - Operating hours (custom open/close or 24/7 toggle)
  - Slot duration (30 min, 45 min, 60 min)
  - Check-in grace period (5 min, 10 min, 15 min)
  - Max active bookings per resident (1, 2, or 3)
  - Advance booking window (1, 2, 3, or 7 days)
- **Machine Fleet Maintenance**:
  - One-click machine blocking with custom reason notes
  - Instant online restoration
- **Resident Reports Triage**:
  - Filter reports by `Open`, `In Progress`, and `Resolved`
  - "Resolve & Restore Washer" action that clears tickets and unblocks machines
- **Usage Trends & Peak Times**:
  - Hourly room demand visualization (identifying peak 7:00 PM – 9:30 PM rush hours)
  - Key performance metrics: 4.2% missed check-in rate, 38% early unload rate, <8 min waitlist match speed

### 4. 🎨 Design & Mobile-First Experience
- Accessible status indicators pairing color with bold text labels and distinct icons (WCAG compliant; never relies on color alone).
- Responsive layout with an optional **Mobile Phone Bezel Preview Toggle** (iPhone frame with speaker notch and status bar) to showcase the native mobile feel.
- Custom SVG animated washing machine illustrations featuring spinning drums, water bubbles, door reflections, and glowing LED indicators.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# 1. Install dependencies
npm.cmd install

# 2. Start development server
npm.cmd run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Quick Test Scenarios for Evaluators

1. **Test "I'm Here" Check-In**:
   - The app loads with resident *Alex Rivera*, who has an active reservation on **Washer 3**.
   - Notice the amber countdown badge indicating the remaining grace period.
   - Click **"I'm Here! Check In"** or click **"Scan Washer QR"** to check in.
   - The status transitions to `Cycle Running • In Progress` and the machine drum begins spinning!

2. **Test Grace Period Auto-Release**:
   - In Alex Rivera's active reservation card, click **"Fast-forward grace timer (simulate auto-release)"**.
   - The slot is instantly cancelled, Washer 3 reverts to `Ready`, and the slot is offered to the waiting resident on the waitlist.

3. **Test Extension Rule**:
   - Switch resident to *Maya Sharma* (who is currently running **Washer 2**).
   - Click **"+15m Extension"**.
   - Observe the validation notice: extension is politely rejected because another resident is already booked for the subsequent slot.

4. **Test Fair Share Booking**:
   - Switch to *Alex Rivera* (0 bookings this week). Click **"Book Washer"** or any ready machine.
   - Notice the green **"Fair Share Priority"** badge and slots tagged with **`★ Fair Pick`**.

5. **Test Manager Dashboard**:
   - Click **"Manager"** in the top navigation.
   - Modify the grace period to 5 minutes, block/unblock a machine for repair, or review the resident fault reports.
