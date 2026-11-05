// Initial sample data for SpinCycle Laundry Booking

export const INITIAL_ROOM_SETTINGS = {
  roomName: "Pinecrest Hall Laundry Lounge (Building B)",
  operatingHours: {
    open: "06:00",
    close: "23:30",
    is24Hours: false,
  },
  slotLengthMinutes: 45, // 30, 45, or 60
  gracePeriodMinutes: 10, // 5, 10, or 15
  maxActiveBookingsPerUser: 2,
  advanceBookingDays: 3,
  autoReleaseOnNoShow: true,
  communityGoalTarget: 100,
  communityGoalCurrent: 82,
};

export const RESIDENT_PROFILES = [
  {
    id: "user-1",
    name: "Alex Rivera",
    room: "Apt 304",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    recentBookingsThisWeek: 0, // High priority for fair-share slots
    streakWeeks: 4,
    kudosReceived: 12,
    badge: "Eco Rinser",
  },
  {
    id: "user-2",
    name: "Maya Sharma",
    room: "Apt 412",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    recentBookingsThisWeek: 1,
    streakWeeks: 2,
    kudosReceived: 8,
    badge: "Prompt Picker",
  },
  {
    id: "user-3",
    name: "Liam O'Connor",
    room: "Apt 208",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    recentBookingsThisWeek: 3, // At weekly soft limit
    streakWeeks: 5,
    kudosReceived: 19,
    badge: "Lint Trap Legend",
  },
];

export const INITIAL_MACHINES = [
  {
    id: "wm-1",
    name: "Washer 1 • Whirlpool Eco",
    code: "SPIN-W01",
    type: "Front Load (7.5 kg)",
    features: ["Quick Wash", "Cold Clean", "Quiet Spin"],
    status: "Ready", // 'Ready' | 'Reserved' | 'In Use' | 'Needs Repair'
    location: "Left Wall, Bay A",
    qrCodeString: "SPINCYCLE://ROOM-B/WASHER-1",
    currentBooking: null,
    maintenanceReason: null,
  },
  {
    id: "wm-2",
    name: "Washer 2 • SpeedQueen Heavy",
    code: "SPIN-W02",
    type: "Front Load (9.0 kg Large)",
    features: ["Bedding/Towels", "High Temp", "Heavy Soil"],
    status: "In Use",
    location: "Left Wall, Bay B",
    qrCodeString: "SPINCYCLE://ROOM-B/WASHER-2",
    currentBooking: {
      id: "bk-201",
      userId: "user-2",
      userName: "Maya Sharma (Apt 412)",
      startTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      cycleType: "Normal Cotton (45 min)",
      isCheckedIn: true,
      remainingMinutes: 20,
    },
    maintenanceReason: null,
  },
  {
    id: "wm-3",
    name: "Washer 3 • Electrolux Gentle",
    code: "SPIN-W03",
    type: "Front Load (7.0 kg)",
    features: ["Delicates", "Steam Refresh", "Wool Care"],
    status: "Reserved",
    location: "Center Island, Bay C",
    qrCodeString: "SPINCYCLE://ROOM-B/WASHER-3",
    currentBooking: {
      id: "bk-202",
      userId: "user-1", // Active user starts with this reservation to test check-in!
      userName: "Alex Rivera (Apt 304)",
      startTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // started 3 mins ago
      endTime: new Date(Date.now() + 42 * 60 * 1000).toISOString(),
      cycleType: "Eco Express (45 min)",
      isCheckedIn: false,
      gracePeriodEndsAt: new Date(Date.now() + 7 * 60 * 1000).toISOString(), // 7 mins left to check-in
      remainingMinutes: 42,
    },
    maintenanceReason: null,
  },
  {
    id: "wm-4",
    name: "Washer 4 • Samsung SmartWash",
    code: "SPIN-W04",
    type: "Front Load (8.0 kg)",
    features: ["Super Speed 30", "Active Foam"],
    status: "Ready",
    location: "Center Island, Bay D",
    qrCodeString: "SPINCYCLE://ROOM-B/WASHER-4",
    currentBooking: null,
    maintenanceReason: null,
  },
  {
    id: "wm-5",
    name: "Washer 5 • LG TurboWash",
    code: "SPIN-W05",
    type: "Front Load (8.5 kg)",
    features: ["TurboWash 360", "Allergiene"],
    status: "Needs Repair",
    location: "Right Wall, Bay E",
    qrCodeString: "SPINCYCLE://ROOM-B/WASHER-5",
    currentBooking: null,
    maintenanceReason: "Technician replacing door latch sensor. Expected back online Friday 2:00 PM.",
    reportedBy: "Liam O. (Apt 208)",
    reportDate: "Today, 8:15 AM",
  },
  {
    id: "wm-6",
    name: "Washer 6 • Bosch Serie 6",
    code: "SPIN-W06",
    type: "Front Load (8.0 kg)",
    features: ["SpeedPerfect", "EcoSilence"],
    status: "Ready",
    location: "Right Wall, Bay F",
    qrCodeString: "SPINCYCLE://ROOM-B/WASHER-6",
    currentBooking: null,
    maintenanceReason: null,
  },
];

export const INITIAL_REPORTS = [
  {
    id: "rep-101",
    machineId: "wm-5",
    machineName: "Washer 5 • LG TurboWash",
    issueType: "Door Lock Fault",
    severity: "High",
    description: "Door handle clicked but display threw 'dE' error and would not begin cycle.",
    reportedBy: "Liam O'Connor (Apt 208)",
    timestamp: "2 hours ago",
    status: "In Progress", // 'Open' | 'In Progress' | 'Resolved'
    technicianAssigned: "Dave (Campus Facilities)",
  },
  {
    id: "rep-102",
    machineId: "wm-1",
    machineName: "Washer 1 • Whirlpool Eco",
    issueType: "Low Detergent Pods",
    severity: "Low",
    description: "Community emergency detergent bottle on shelf is almost empty.",
    reportedBy: "Maya Sharma (Apt 412)",
    timestamp: "Yesterday",
    status: "Open",
    technicianAssigned: null,
  },
  {
    id: "rep-103",
    machineId: "wm-3",
    machineName: "Washer 3 • Electrolux Gentle",
    issueType: "Vibration / Balancing",
    severity: "Low",
    description: "Rumble sound during 1200 RPM spin. Leveling foot might need tightening.",
    reportedBy: "Elena Rostova (Apt 105)",
    timestamp: "2 days ago",
    status: "Resolved",
    technicianAssigned: "Self-balanced by user",
  },
];

export const INITIAL_WAITLIST = [
  {
    id: "wt-1",
    userId: "user-4",
    userName: "Jordan Reed (Apt 501)",
    joinedAt: "10:12 AM",
    preferredMachineType: "Any Washer",
    notified: false,
  },
  {
    id: "wt-2",
    userId: "user-5",
    userName: "Chloe Bennet (Apt 310)",
    joinedAt: "10:25 AM",
    preferredMachineType: "Large Capacity (9kg)",
    notified: false,
  },
];

export const SPINS_OF_THE_DAY = [
  {
    id: 1,
    type: "tip",
    title: "Cold Water Wins",
    content: "Washing on cold cleans 90% of regular daily loads just as effectively while saving up to 75% electricity and keeping your colors vibrant!",
  },
  {
    id: 2,
    type: "joke",
    title: "Sock Philosophy",
    content: "Why did the sock cross the washing machine drum? To get away from its match and start a new life inside the dryer lint trap!",
  },
  {
    id: 3,
    type: "tip",
    title: "The Vinegar Trick",
    content: "Half a cup of white distilled vinegar in the rinse compartment softens towels naturally and removes musty odors without synthetic waxes.",
  },
  {
    id: 4,
    type: "joke",
    title: "Laundry Forecast",
    content: "Today's forecast: 100% chance of clean clothes, with a slight possibility of finding \$5 in your front pocket!",
  },
  {
    id: 5,
    type: "tip",
    title: "Don't Overload the Drum",
    content: "Leave about a hand's width of space at the top of the drum. Clothes need room to tumble and water to flow to get thoroughly rinsed.",
  },
];

export const KUDOS_PRESETS = [
  "✨ Left the washer drum spotless!",
  "⏰ Prompt pickup right on time!",
  "🧼 Cleaned the lint & detergent drawer!",
  "🤝 Swapped slots gracefully!",
  "🧺 Left a spare dryer sheet for the next person!",
];

export const HOURLY_USAGE_DATA = [
  { hour: "6 AM", count: 1, busy: false },
  { hour: "7 AM", count: 2, busy: false },
  { hour: "8 AM", count: 4, busy: false },
  { hour: "9 AM", count: 5, busy: true },
  { hour: "10 AM", count: 6, busy: true },
  { hour: "11 AM", count: 4, busy: false },
  { hour: "12 PM", count: 3, busy: false },
  { hour: "1 PM", count: 3, busy: false },
  { hour: "2 PM", count: 2, busy: false },
  { hour: "3 PM", count: 4, busy: false },
  { hour: "4 PM", count: 5, busy: true },
  { hour: "5 PM", count: 6, busy: true },
  { hour: "6 PM", count: 6, busy: true },
  { hour: "7 PM", count: 6, busy: true, peak: true },
  { hour: "8 PM", count: 6, busy: true, peak: true },
  { hour: "9 PM", count: 5, busy: true },
  { hour: "10 PM", count: 3, busy: false },
];

