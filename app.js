const canvas = document.querySelector("#simCanvas");
const ctx = canvas.getContext("2d");
const codeEditor = document.querySelector("#codeEditor");
const runButton = document.querySelector("#runButton");
const resetButton = document.querySelector("#resetButton");
const exampleButton = document.querySelector("#exampleButton");
const prevMissionButton = document.querySelector("#prevMissionButton");
const nextMissionButton = document.querySelector("#nextMissionButton");
const pathButtons = [...document.querySelectorAll(".path-button")];
const feedbackText = document.querySelector("#feedbackText");
const feedbackBadge = document.querySelector("#feedbackBadge");
const commandCount = document.querySelector("#commandCount");
const commandPreview = document.querySelector("#commandPreview");
const positionReadout = document.querySelector("#positionReadout");
const altitudeReadout = document.querySelector("#altitudeReadout");
const headingReadout = document.querySelector("#headingReadout");
const checkpointList = document.querySelector("#checkpointList");
const missionText = document.querySelector("#missionText");
const missionState = document.querySelector("#missionState");
const storyText = document.querySelector("#storyText");
const themeBadge = document.querySelector("#themeBadge");
const missionIndexBadge = document.querySelector("#missionIndexBadge");
const missionGoalBadge = document.querySelector("#missionGoalBadge");
const hudThemeReadout = document.querySelector("#hudThemeReadout");
const syntaxNote = document.querySelector("#syntaxNote");
const rankRequirementNote = document.querySelector("#rankRequirementNote");
const appShell = document.querySelector("#appShell");
const missionPanel = document.querySelector("#missionPanel");
const commandsPanel = document.querySelector("#commandsPanel");
const tipsPanel = document.querySelector("#tipsPanel");
const entryOverlay = document.querySelector("#entryOverlay");
const mainColumn = document.querySelector("#mainColumn");
const accountRoleBadge = document.querySelector("#accountRoleBadge");
const accountStatusText = document.querySelector("#accountStatusText");
const teacherAccountPanel = document.querySelector("#teacherAccountPanel");
const teacherPasswordInput = document.querySelector("#teacherPasswordInput");
const teacherPasswordButton = document.querySelector("#teacherPasswordButton");
const studentNameInput = document.querySelector("#studentNameInput");
const studentNameLabel = document.querySelector("#studentNameLabel");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const authSubmitButton = document.querySelector("#authSubmitButton");
const showLoginButton = document.querySelector("#showLoginButton");
const showRegisterButton = document.querySelector("#showRegisterButton");
const selectStudentButton = document.querySelector("#selectStudentButton");
const selectTeacherButton = document.querySelector("#selectTeacherButton");
const logoutButton = document.querySelector("#logoutButton");
const authFeedbackText = document.querySelector("#authFeedbackText");
const studentProgressPanel = document.querySelector("#studentProgressPanel");
const studentProgressBadge = document.querySelector("#studentProgressBadge");
const studentMissionSelect = document.querySelector("#studentMissionSelect");
const studentProgressList = document.querySelector("#studentProgressList");
const certificatePanel = document.querySelector("#certificatePanel");
const certificateStudentName = document.querySelector("#certificateStudentName");
const certificateDateText = document.querySelector("#certificateDateText");
const printCertificateButton = document.querySelector("#printCertificateButton");
const teacherPanel = document.querySelector("#teacherPanel");
const teacherSummaryBadge = document.querySelector("#teacherSummaryBadge");
const teacherStudentSelect = document.querySelector("#teacherStudentSelect");
const teacherDashboard = document.querySelector("#teacherDashboard");
const accessibleMissionBadge = document.querySelector("#accessibleMissionBadge");
const accessibleMissionSummary = document.querySelector("#accessibleMissionSummary");
const accessibleStatusBadge = document.querySelector("#accessibleStatusBadge");
const accessibleStatusText = document.querySelector("#accessibleStatusText");
const accessibleFlightLog = document.querySelector("#accessibleFlightLog");
const accessibleLogBadge = document.querySelector("#accessibleLogBadge");
const simulatorAnnouncements = document.querySelector("#simulatorAnnouncements");
const voiceToggleButton = document.querySelector("#voiceToggleButton");
const soundToggleButton = document.querySelector("#soundToggleButton");
const speakMissionDescriptionButton = document.querySelector("#speakMissionDescriptionButton");
const speakCommandGuideButton = document.querySelector("#speakCommandGuideButton");
const speakPositionButton = document.querySelector("#speakPositionButton");
const speakMissionMapButton = document.querySelector("#speakMissionMapButton");
const audioStatusText = document.querySelector("#audioStatusText");

canvas.setAttribute("aria-describedby", "accessibleStatusText accessibleMissionSummary");

const ACCOUNT_STORAGE_KEY = "drone-code-lab-accounts";
const SESSION_STORAGE_KEY = "drone-code-lab-session";
const ACCESSIBILITY_STORAGE_KEY = "drone-code-lab-accessibility";
const SINGLE_STUDENT_KEY = "single-student";
const DEFAULT_TEACHER_EMAIL = "mg@buckleyparkco.vic.edu.au";
const DEFAULT_TEACHER_PASSWORD = "password123";

const COMMANDS = new Set([
  "takeOff", "land", "moveUp", "moveDown", "moveLeft", "moveRight", "rotateLeft", "rotateRight", "wait", "takeSample", "takeLandSample", "takePhoto",
]);

const CAMPAIGNS = {
  cadet: {
    label: "Cadet",
    title: "Harbour Training Wing",
    droneColor: "#59d7ff",
    rotorColor: "#adf76f",
    sky: ["#153953", "#1d4d6e", "#163448", "#10263a"],
    missions: [
      {
        title: "Mission 1: First Lift",
        objective: "Take off, reach the first two beacons, then land back on the pad.",
        story: "Instructor Vega opens the hangar doors and asks you to prove the drone can follow a basic route.",
        goalLabel: "Beacon Warmup",
        launchPad: { x: 90, y: 458, width: 132, height: 58 },
        checkpoints: [
          { id: "n1-a", name: "Blue Beacon", x: 320, y: 355, radius: 22 },
          { id: "n1-b", name: "Bridge Beacon", x: 500, y: 265, radius: 22 },
        ],
        noFlyZones: [{ x: 620, y: 200, width: 120, height: 220, label: "Crane" }],
        decorations: [
          { type: "cloud", x: 170, y: 100, size: 0.9 },
          { type: "cloud", x: 710, y: 120, size: 1.1 },
          { type: "hangar", x: 745, y: 414, width: 145, height: 92 },
        ],
        example: `takeOff();
moveRight(140);
moveUp(110);
takePhoto();
moveRight(180);
moveUp(90);
takePhoto();
moveDown(180);
moveLeft(320);
land();
takeLandSample();`,
      },
      {
        title: "Mission 2: Dock Sweep",
        objective: "Sweep across three markers while steering around the stacked cargo zone.",
        story: "A delivery barge is arriving, so the drone must scan the harbour path without crossing the cargo stack.",
        goalLabel: "Dock Scan",
        launchPad: { x: 110, y: 430, width: 120, height: 54 },
        checkpoints: [
          { id: "n2-a", name: "Dock North", x: 250, y: 210, radius: 22 },
          { id: "n2-b", name: "Dock East", x: 520, y: 185, radius: 22 },
          { id: "n2-c", name: "Dock South", x: 640, y: 400, radius: 22 },
        ],
        noFlyZones: [
          { x: 320, y: 250, width: 150, height: 210, label: "Cargo" },
          { x: 720, y: 125, width: 110, height: 150, label: "Tower" },
        ],
        decorations: [
          { type: "cloud", x: 140, y: 126, size: 0.8 },
          { type: "cloud", x: 835, y: 90, size: 0.9 },
          { type: "ship", x: 720, y: 465, width: 150, height: 34 },
        ],
        example: `takeOff();
moveUp(210);
moveRight(140);
moveRight(240);
moveDown(210);
moveRight(120);
wait(1);
moveLeft(500);
land();`,
      },
      {
        title: "Mission 3: Signal Run",
        objective: "Collect four harbour signal points before returning to base.",
        story: "The lighthouse relay is being calibrated and the cadet drone must touch each signal buoy.",
        goalLabel: "Signal Net",
        launchPad: { x: 92, y: 444, width: 126, height: 56 },
        checkpoints: [
          { id: "n3-a", name: "Signal West", x: 230, y: 390, radius: 22 },
          { id: "n3-b", name: "Signal North", x: 360, y: 210, radius: 22 },
          { id: "n3-c", name: "Signal East", x: 680, y: 210, radius: 22 },
          { id: "n3-d", name: "Signal South", x: 770, y: 380, radius: 22 },
        ],
        noFlyZones: [
          { x: 300, y: 275, width: 120, height: 165, label: "Dock Crane" },
          { x: 545, y: 110, width: 105, height: 155, label: "Mast" },
        ],
        decorations: [
          { type: "cloud", x: 170, y: 90, size: 0.9 },
          { type: "ship", x: 700, y: 470, width: 160, height: 30 },
        ],
        example: `takeOff();
moveRight(138);
moveUp(54);
moveRight(130);
moveUp(180);
moveRight(250);
moveRight(160);
moveDown(170);
moveLeft(678);
moveDown(54);
land();`,
      },
      {
        title: "Mission 4: Graduation Run",
        objective: "Finish the full harbour route, hit every beacon, and return for a clean landing.",
        story: "The cadet badge is one flight away. Vega wants a full mission flown without drifting into restricted airspace.",
        goalLabel: "Final Circuit",
        launchPad: { x: 90, y: 445, width: 130, height: 58 },
        checkpoints: [
          { id: "n3-a", name: "Beacon One", x: 250, y: 360, radius: 22 },
          { id: "n3-b", name: "Beacon Two", x: 450, y: 170, radius: 22 },
          { id: "n3-c", name: "Beacon Three", x: 690, y: 260, radius: 22 },
          { id: "n3-d", name: "Beacon Four", x: 760, y: 430, radius: 22 },
        ],
        noFlyZones: [
          { x: 325, y: 235, width: 110, height: 210, label: "Crane" },
          { x: 560, y: 115, width: 110, height: 170, label: "Signal Mast" },
          { x: 820, y: 315, width: 90, height: 170, label: "Fuel Stack" },
        ],
        decorations: [
          { type: "cloud", x: 190, y: 100, size: 0.9 },
          { type: "cloud", x: 560, y: 78, size: 0.7 },
          { type: "cloud", x: 800, y: 126, size: 1.05 },
        ],
        example: `takeOff();
moveRight(160);
moveUp(95);
moveRight(200);
moveUp(190);
moveRight(240);
moveDown(90);
moveDown(170);
moveLeft(670);
land();`,
      },
    ],
  },
  second_officer: {
    label: "Second Officer",
    title: "Canyon Rescue Unit",
    droneColor: "#9fe7ff",
    rotorColor: "#e0ff7d",
    sky: ["#24384d", "#37556d", "#2c3f43", "#1b2c34"],
    missions: [
      {
        title: "Mission 1: Ridge Supply Drop",
        objective: "Fly from the canyon entrance to the field clinic, land on the grey rock patch to take a sample, then continue safely.",
        story: "Medic drones are needed at the ridge clinic before sunset, and command also wants a sample from the grey rock shelf.",
        goalLabel: "Clinic Route",
        sampleRequirements: [{ color: "grey", label: "Grey Rock Sample" }],
        launchPad: { x: 70, y: 420, width: 120, height: 54 },
        checkpoints: [
          { id: "c1-a", name: "Scout Post", x: 220, y: 305, radius: 22 },
          { id: "c1-b", name: "Clinic Roof", x: 610, y: 185, radius: 22 },
          { id: "c1-c", name: "Landing Marker", x: 810, y: 330, radius: 22 },
        ],
        noFlyZones: [
          { x: 250, y: 85, width: 120, height: 250, label: "Cliff A" },
          { x: 470, y: 250, width: 145, height: 220, label: "Cliff B" },
          { x: 710, y: 90, width: 110, height: 150, label: "Cliff C" },
        ],
        decorations: [
          { type: "mountain", x: 160, y: 470, width: 210, height: 120 },
          { type: "mountain", x: 625, y: 495, width: 250, height: 145 },
        ],
        example: `takeOff();
moveRight(145);
moveUp(75);
if (sensingColor("grey")) {
land();
takeSample();
takeOff();
}
moveLeft(55);
moveUp(67);
takePhoto();
moveUp(255);
moveRight(390);
moveDown(135);
takePhoto();
moveUp(135);
moveRight(240);
moveDown(280);
moveLeft(40);
takePhoto();
moveRight(50);
moveDown(170);
moveLeft(730);
moveUp(53);
land();
takeLandSample();`,
      },
      {
        title: "Mission 2: Flood Survey",
        objective: "Map four flood markers, land on the blue patch to take a water sample, then lift off and finish the route.",
        story: "Storm water is rising through the lower canyon, and the rescue team needs a blue-channel water sample before the drone returns.",
        goalLabel: "Survey Sweep",
        sampleRequirements: [{ color: "blue", label: "Blue Water Sample" }],
        launchPad: { x: 130, y: 455, width: 126, height: 56 },
        checkpoints: [
          { id: "c2-a", name: "Marker A", x: 300, y: 390, radius: 22 },
          { id: "c2-b", name: "Marker B", x: 460, y: 220, radius: 22 },
          { id: "c2-c", name: "Marker C", x: 690, y: 210, radius: 22 },
          { id: "c2-d", name: "Marker D", x: 800, y: 390, radius: 22 },
        ],
        noFlyZones: [
          { x: 355, y: 265, width: 95, height: 205, label: "Rock Spire" },
          { x: 565, y: 115, width: 105, height: 210, label: "Rock Spire" },
        ],
        decorations: [
          { type: "river", x: 0, y: 470, width: 960, height: 90 },
          { type: "mountain", x: 90, y: 470, width: 160, height: 100 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
moveRight(170);
moveUp(65);
moveRight(160);
moveUp(170);
moveRight(230);
moveRight(110);
moveDown(180);
wait(1);
moveLeft(670);
moveDown(65);
}
land();`,
      },
      {
        title: "Mission 3: Rope Bridge Search",
        objective: "Scan the bridge route, land on the gold patch for a dust sample, then keep flying to the last checkpoint.",
        story: "A search team is moving below the canyon rim and wants both images and a gold dust sample from the bridge shelf.",
        goalLabel: "Bridge Search",
        sampleRequirements: [{ color: "gold", label: "Gold Dust Sample" }],
        launchPad: { x: 90, y: 430, width: 120, height: 54 },
        checkpoints: [
          { id: "c3-a", name: "West Ridge", x: 220, y: 350, radius: 22 },
          { id: "c3-b", name: "Bridge Span", x: 410, y: 205, radius: 22 },
          { id: "c3-c", name: "East Ridge", x: 640, y: 195, radius: 22 },
          { id: "c3-d", name: "Supply Camp", x: 790, y: 350, radius: 22 },
        ],
        noFlyZones: [
          { x: 280, y: 160, width: 95, height: 205, label: "Stone Pillar" },
          { x: 520, y: 250, width: 105, height: 180, label: "Ridge Wall" },
          { x: 720, y: 120, width: 100, height: 145, label: "Watch Cliff" },
        ],
        decorations: [
          { type: "mountain", x: 120, y: 500, width: 210, height: 130 },
          { type: "mountain", x: 650, y: 500, width: 210, height: 130 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
moveRight(130);
moveUp(80);
moveRight(190);
moveUp(145);
moveRight(230);
moveRight(150);
moveDown(155);
moveLeft(700);
moveDown(70);
}
land();`,
      },
      {
        title: "Mission 4: Night Rescue",
        objective: "Complete the canyon route in the dark, land on the grey patch for a rescue-site sample, and bring the drone home.",
        story: "A hiker beacon has started flashing after dark, and the team needs a grey rock sample from the rescue site too.",
        goalLabel: "Rescue Corridor",
        sampleRequirements: [{ color: "grey", label: "Rescue Site Sample" }],
        launchPad: { x: 90, y: 430, width: 120, height: 54 },
        checkpoints: [
          { id: "c3-a", name: "Beacon West", x: 245, y: 330, radius: 22 },
          { id: "c3-b", name: "Beacon North", x: 390, y: 165, radius: 22 },
          { id: "c3-c", name: "Beacon East", x: 640, y: 160, radius: 22 },
          { id: "c3-d", name: "Beacon South", x: 770, y: 345, radius: 22 },
        ],
        noFlyZones: [
          { x: 250, y: 105, width: 82, height: 170, label: "Pillar" },
          { x: 465, y: 205, width: 105, height: 215, label: "Rock Wall" },
          { x: 725, y: 125, width: 100, height: 150, label: "Cliff Edge" },
        ],
        decorations: [
          { type: "stars", density: 16 },
          { type: "mountain", x: 150, y: 500, width: 240, height: 130 },
          { type: "mountain", x: 660, y: 500, width: 240, height: 130 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
moveRight(155);
moveUp(100);
moveRight(145);
moveUp(165);
moveRight(250);
moveRight(130);
moveDown(185);
moveLeft(680);
moveDown(100);
}
land();`,
      },
    ],
  },
  first_officer: {
    label: "First Officer",
    title: "Skyport Relay Division",
    droneColor: "#b8efff",
    rotorColor: "#ffe880",
    sky: ["#2d3950", "#4b5f7f", "#544231", "#2b2731"],
    missions: [
      {
        title: "Mission 1: Relay Alignment",
        objective: "Touch three relay beacons, land on the blue patch for a relay sample, then return before the runway window closes.",
        story: "Skyport control needs a relay alignment check before the commuter drones launch, plus a blue relay sample from the runway edge.",
        goalLabel: "Relay Check",
        sampleRequirements: [{ color: "blue", label: "Blue Relay Sample" }],
        launchPad: { x: 90, y: 446, width: 124, height: 54 },
        checkpoints: [
          { id: "f1-a", name: "West Relay", x: 235, y: 330, radius: 22 },
          { id: "f1-b", name: "North Relay", x: 470, y: 160, radius: 22 },
          { id: "f1-c", name: "East Relay", x: 760, y: 315, radius: 22 },
        ],
        noFlyZones: [
          { x: 300, y: 220, width: 115, height: 200, label: "Tower Array" },
          { x: 610, y: 110, width: 105, height: 165, label: "Runway Mast" },
        ],
        decorations: [
          { type: "cloud", x: 200, y: 95, size: 0.85 },
          { type: "platform", x: 760, y: 468, width: 130, height: 26 },
        ],
        example: `takeOff();
moveRight(83);
moveUp(143);
takePhoto();
moveUp(133);
moveRight(310);
land();
takeSample();
takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveLeft(75);
moveUp(37);
takePhoto();
moveUp(80);
moveRight(290);
moveDown(235);
takePhoto();
moveRight(80);
moveDown(158);
moveLeft(688);
land();
takeLandSample();`,
      },
      {
        title: "Mission 2: Runway Window",
        objective: "Visit four runway sensors, land on the grey patch for a surface sample, then keep the route moving.",
        story: "The runway sensors are drifting and first officers must clear the route in sequence while collecting a grey surface sample.",
        goalLabel: "Sensor Weave",
        sampleRequirements: [{ color: "grey", label: "Grey Surface Sample" }],
        launchPad: { x: 110, y: 445, width: 124, height: 56 },
        checkpoints: [
          { id: "f2-a", name: "Sensor A", x: 250, y: 390, radius: 22 },
          { id: "f2-b", name: "Sensor B", x: 390, y: 205, radius: 22 },
          { id: "f2-c", name: "Sensor C", x: 620, y: 205, radius: 22 },
          { id: "f2-d", name: "Sensor D", x: 820, y: 360, radius: 22 },
        ],
        noFlyZones: [
          { x: 280, y: 250, width: 90, height: 170, label: "Tower Shadow" },
          { x: 500, y: 120, width: 100, height: 180, label: "Tower Shadow" },
          { x: 710, y: 250, width: 95, height: 150, label: "Radar Column" },
        ],
        decorations: [
          { type: "cloud", x: 760, y: 110, size: 0.9 },
          { type: "hangar", x: 760, y: 420, width: 120, height: 86 },
        ],
        example: `takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(140);
moveUp(55);
moveRight(140);
moveUp(185);
moveRight(230);
moveRight(200);
moveDown(155);
moveLeft(710);
moveDown(70);
land();`,
      },
      {
        title: "Mission 3: Thermal Climb",
        objective: "Climb through the thermal corridor, land on the gold patch for a heat sample, then return.",
        story: "Hot air over the tarmac is distorting readings and the route must be checked mid-climb, including a gold thermal sample.",
        goalLabel: "Thermal Corridor",
        sampleRequirements: [{ color: "gold", label: "Gold Heat Sample" }],
        launchPad: { x: 85, y: 440, width: 125, height: 55 },
        checkpoints: [
          { id: "f3-a", name: "Node West", x: 240, y: 300, radius: 22 },
          { id: "f3-b", name: "Node Mid", x: 430, y: 145, radius: 22 },
          { id: "f3-c", name: "Node East", x: 675, y: 165, radius: 22 },
          { id: "f3-d", name: "Node South", x: 815, y: 345, radius: 22 },
        ],
        noFlyZones: [
          { x: 315, y: 170, width: 85, height: 205, label: "Hot Column" },
          { x: 540, y: 255, width: 115, height: 175, label: "Fuel Tower" },
          { x: 760, y: 125, width: 90, height: 145, label: "Signal Frame" },
        ],
        decorations: [
          { type: "cloud", x: 155, y: 85, size: 0.8 },
          { type: "cloud", x: 540, y: 78, size: 0.75 },
          { type: "platform", x: 735, y: 470, width: 145, height: 26 },
        ],
        example: `takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(155);
moveUp(140);
moveRight(190);
moveUp(155);
moveRight(245);
moveDown(20);
moveRight(140);
moveDown(180);
moveLeft(730);
moveDown(95);
land();`,
      },
      {
        title: "Mission 4: First Officer Trial",
        objective: "Complete the full skyport route, collect a blue sample mid-mission, and prove you are ready for command.",
        story: "Skyport control gives one final relay mission before promoting the student to captain training, and it includes a blue sample pickup.",
        goalLabel: "Trial Flight",
        sampleRequirements: [{ color: "blue", label: "Blue Trial Sample" }],
        launchPad: { x: 92, y: 438, width: 126, height: 56 },
        checkpoints: [
          { id: "f4-a", name: "Point One", x: 210, y: 370, radius: 22 },
          { id: "f4-b", name: "Point Two", x: 365, y: 210, radius: 22 },
          { id: "f4-c", name: "Point Three", x: 560, y: 145, radius: 22 },
          { id: "f4-d", name: "Point Four", x: 740, y: 235, radius: 22 },
          { id: "f4-e", name: "Point Five", x: 835, y: 390, radius: 22 },
        ],
        noFlyZones: [
          { x: 250, y: 250, width: 85, height: 160, label: "Dock Tower" },
          { x: 455, y: 120, width: 90, height: 170, label: "Relay Pillar" },
          { x: 650, y: 210, width: 95, height: 160, label: "Radar Core" },
        ],
        decorations: [
          { type: "cloud", x: 205, y: 90, size: 0.85 },
          { type: "hangar", x: 760, y: 416, width: 130, height: 88 },
        ],
        example: `takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(118);
moveUp(68);
moveRight(155);
moveUp(160);
moveRight(195);
moveUp(65);
moveRight(180);
moveDown(90);
moveRight(95);
moveDown(155);
moveLeft(743);
moveDown(48);
land();`,
      },
    ],
  },
  captain: {
    label: "Captain",
    title: "Storm Frontier Command",
    droneColor: "#ffd7a8",
    rotorColor: "#ffef7b",
    sky: ["#311f43", "#56305e", "#442335", "#251628"],
    missions: [
      {
        title: "Mission 1: Storm Wall Entry",
        objective: "Cross the frontier gates, land on the grey patch for a storm dust sample, then finish the tracker run and land at command.",
        story: "Lightning cells are moving in, and command needs both live readings and a grey storm dust sample before the route closes.",
        goalLabel: "Storm Trackers",
        sampleRequirements: [{ color: "grey", label: "Grey Storm Sample" }],
        launchPad: { x: 80, y: 445, width: 122, height: 56 },
        checkpoints: [
          { id: "e1-a", name: "Tracker One", x: 245, y: 230, radius: 22 },
          { id: "e1-b", name: "Tracker Two", x: 520, y: 180, radius: 22 },
          { id: "e1-c", name: "Tracker Three", x: 780, y: 320, radius: 22 },
        ],
        noFlyZones: [
          { x: 230, y: 300, width: 105, height: 180, label: "Storm Core" },
          { x: 470, y: 255, width: 135, height: 220, label: "Tower Field" },
          { x: 700, y: 95, width: 95, height: 150, label: "Lightning Mast" },
        ],
        colorZones: [
          { color: "grey", label: "Grey Storm Patch", x: 130, y: 335, width: 120, height: 85, fill: "rgba(170, 180, 191, 0.32)", stroke: "#b8c1ca" },
          { color: "blue", label: "Blue Tile", x: 485, y: 155, width: 120, height: 85, fill: "rgba(89, 215, 255, 0.24)", stroke: "#72dfff" },
          { color: "gold", label: "Gold Tile", x: 735, y: 345, width: 120, height: 85, fill: "rgba(255, 215, 140, 0.24)", stroke: "#ffd78c" },
        ],
        decorations: [
          { type: "lightning", x: 180, y: 120 },
          { type: "lightning", x: 760, y: 100 },
          { type: "platform", x: 760, y: 455, width: 120, height: 28 },
        ],
        example: `takeOff();
moveRight(50);
moveUp(90);
if (sensingColor("grey")) {
land();
takeSample();
takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
}
moveUp(153);
moveRight(54);
takePhoto();
moveUp(50);
moveRight(275);
takePhoto();
moveUp(100);
moveRight(310);
moveDown(240);
moveLeft(50);
takePhoto();
moveRight(80);
moveDown(190);
moveLeft(719);
moveUp(37);
land();
takeLandSample();`,
      },
      {
        title: "Mission 2: Radio Maze",
        objective: "Navigate through a dense radio corridor, land on the blue patch for a relay sample, then keep flying through the maze.",
        story: "A broken relay node is bouncing distress packets, and command wants a blue relay sample while the drone is inside the maze.",
        goalLabel: "Relay Hover",
        sampleRequirements: [{ color: "blue", label: "Blue Relay Sample" }],
        launchPad: { x: 115, y: 440, width: 125, height: 56 },
        checkpoints: [
          { id: "e2-a", name: "Relay West", x: 270, y: 365, radius: 22 },
          { id: "e2-b", name: "Relay North", x: 420, y: 165, radius: 22 },
          { id: "e2-c", name: "Relay Core", x: 630, y: 165, radius: 22 },
          { id: "e2-d", name: "Relay East", x: 825, y: 300, radius: 22 },
        ],
        noFlyZones: [
          { x: 305, y: 235, width: 90, height: 205, label: "Array A" },
          { x: 510, y: 95, width: 90, height: 215, label: "Array B" },
          { x: 695, y: 255, width: 95, height: 185, label: "Array C" },
        ],
        decorations: [
          { type: "stars", density: 22 },
          { type: "lightning", x: 560, y: 90 },
        ],
        example: `takeOff();
moveRight(430);
moveUp(200);
if (sensingColor("blue")) {
land();
takeSample();
takeOff();
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(210);
wait(1);
moveRight(195);
moveDown(135);
moveLeft(710);
moveDown(140);
}
land();`,
      },
      {
        title: "Mission 3: Thunder Corridor",
        objective: "Cross five command nodes, land on the gold patch to collect charged dust, then return alive.",
        story: "The weather wall is shifting and the captain must stitch together a route through the safest gap while collecting a gold storm sample.",
        goalLabel: "Thunder Route",
        sampleRequirements: [{ color: "gold", label: "Gold Storm Sample" }],
        launchPad: { x: 82, y: 440, width: 124, height: 56 },
        checkpoints: [
          { id: "e3-a", name: "Node West", x: 205, y: 350, radius: 22 },
          { id: "e3-b", name: "Node North", x: 360, y: 160, radius: 22 },
          { id: "e3-c", name: "Node Mid", x: 560, y: 140, radius: 22 },
          { id: "e3-d", name: "Node East", x: 740, y: 240, radius: 22 },
          { id: "e3-e", name: "Node South", x: 860, y: 390, radius: 22 },
        ],
        noFlyZones: [
          { x: 245, y: 200, width: 85, height: 205, label: "Cell A" },
          { x: 445, y: 100, width: 90, height: 175, label: "Cell B" },
          { x: 640, y: 225, width: 90, height: 160, label: "Cell C" },
          { x: 810, y: 145, width: 70, height: 140, label: "Cell D" },
        ],
        decorations: [
          { type: "stars", density: 28 },
          { type: "lightning", x: 220, y: 95 },
          { type: "lightning", x: 590, y: 100 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(123);
moveUp(90);
moveRight(155);
moveUp(190);
moveRight(200);
moveRight(180);
moveDown(100);
moveRight(120);
moveDown(150);
moveLeft(778);
moveDown(50);
}
land();`,
      },
      {
        title: "Mission 4: Command Finale",
        objective: "Complete the full captain route, collect a blue sample mid-mission, scan all frontier nodes, and finish with a precise landing.",
        story: "This is the final frontier exam. The storm front is closing and command only gets one clean run, including a blue sample pickup.",
        goalLabel: "Frontier Final",
        sampleRequirements: [{ color: "blue", label: "Blue Frontier Sample" }],
        launchPad: { x: 80, y: 438, width: 122, height: 56 },
        checkpoints: [
          { id: "e3-a", name: "Node One", x: 220, y: 330, radius: 22 },
          { id: "e3-b", name: "Node Two", x: 405, y: 150, radius: 22 },
          { id: "e3-c", name: "Node Three", x: 610, y: 150, radius: 22 },
          { id: "e3-d", name: "Node Four", x: 760, y: 255, radius: 22 },
          { id: "e3-e", name: "Node Five", x: 850, y: 395, radius: 22 },
        ],
        noFlyZones: [
          { x: 240, y: 195, width: 90, height: 220, label: "Core A" },
          { x: 445, y: 85, width: 85, height: 180, label: "Core B" },
          { x: 635, y: 220, width: 90, height: 165, label: "Core C" },
          { x: 805, y: 170, width: 80, height: 130, label: "Core D" },
        ],
        decorations: [
          { type: "stars", density: 30 },
          { type: "lightning", x: 175, y: 90 },
          { type: "lightning", x: 470, y: 125 },
          { type: "lightning", x: 820, y: 85 },
        ],
        example: `takeOff();
if (droneIsAirborne) {
for (let i = 0; i < 1; i++) {
wait(1);
}
moveRight(140);
moveUp(108);
moveRight(185);
moveUp(180);
moveRight(205);
moveRight(150);
moveDown(105);
moveRight(90);
moveDown(140);
moveLeft(770);
moveDown(108);
}
land();`,
      },
    ],
  },
};

const state = {
  levelKey: "cadet",
  missionIndex: 0,
  drone: null,
  animationQueue: [],
  currentStep: null,
  lastTime: 0,
  playing: false,
  visitedCheckpoints: new Set(),
  collectedSamples: new Set(),
  collectedLandSamples: new Set(),
  capturedPhotos: new Set(),
  trail: [],
  currentMissionSuccess: false,
  accounts: {},
  currentUserEmail: "",
  authMode: "login",
  authKind: "student",
  selectedTeacherStudentEmail: "",
  selectedStudentMissionKey: "",
  flightLog: [],
  lastAnnouncement: "",
  voiceGuidanceEnabled: true,
  soundEffectsEnabled: true,
  audioContext: null,
  lastSpokenProgressAt: 0,
  lastSpokenProgressMessage: "",
};

function getCampaign() {
  return CAMPAIGNS[state.levelKey];
}

function getCurrentAccount() {
  return state.currentUserEmail ? state.accounts[state.currentUserEmail] ?? null : null;
}

function isStudentUser() {
  return getCurrentAccount()?.role === "student";
}

function isTeacherUser() {
  return getCurrentAccount()?.role === "teacher";
}

function getMissionKey(levelKey = state.levelKey, missionIndex = state.missionIndex) {
  return `${levelKey}:${missionIndex}`;
}

function getAllMissionEntries() {
  return Object.entries(CAMPAIGNS).flatMap(([levelKey, campaign]) =>
    campaign.missions.map((mission, missionIndex) => ({
      missionKey: getMissionKey(levelKey, missionIndex),
      levelKey,
      levelLabel: campaign.label,
      missionIndex,
      missionTitle: mission.title,
    }))
  );
}

function findNextIncompleteMissionForCurrentStudent() {
  const account = getCurrentAccount();
  if (!account || account.role !== "student") {
    return { levelKey: "cadet", missionIndex: 0 };
  }
  const progress = ensureAccountProgress(account);
  const nextMission = getAllMissionEntries().find((entry) => !progress[entry.missionKey]?.completed);
  if (!nextMission) {
    const finalCampaignKey = Object.keys(CAMPAIGNS)[Object.keys(CAMPAIGNS).length - 1];
    const finalMissionIndex = CAMPAIGNS[finalCampaignKey].missions.length - 1;
    return { levelKey: finalCampaignKey, missionIndex: finalMissionIndex };
  }
  return { levelKey: nextMission.levelKey, missionIndex: nextMission.missionIndex };
}

function getMissionEntryFromKey(missionKey) {
  return getAllMissionEntries().find((entry) => entry.missionKey === missionKey) ?? null;
}

function getStudentUnlockedMissionKeys() {
  const account = getCurrentAccount();
  const missions = getAllMissionEntries();
  if (!account || account.role !== "student") {
    return new Set(missions.map((entry) => entry.missionKey));
  }
  const progress = ensureAccountProgress(account);
  const unlocked = new Set();
  for (const entry of missions) {
    unlocked.add(entry.missionKey);
    if (!progress[entry.missionKey]?.completed) {
      break;
    }
  }
  return unlocked;
}

function getStudentCompletionSummary(account = getCurrentAccount()) {
  const missions = getAllMissionEntries();
  if (!account || account.role !== "student") {
    return { missions, completedCount: 0, allComplete: false, latestCompletedAt: "" };
  }
  const progress = ensureAccountProgress(account);
  const completedEntries = missions.filter((entry) => progress[entry.missionKey]?.completed);
  const completedDates = completedEntries
    .map((entry) => progress[entry.missionKey]?.completedAt)
    .filter(Boolean)
    .sort();
  return {
    missions,
    completedCount: completedEntries.length,
    allComplete: completedEntries.length === missions.length && missions.length > 0,
    latestCompletedAt: completedDates[completedDates.length - 1] ?? "",
  };
}

function ensureAccountProgress(account) {
  account.progress ??= {};
  return account.progress;
}

function getMission() {
  return getCampaign().missions[state.missionIndex];
}

function getInitialDrone() {
  const pad = getMission().launchPad;
  return { x: pad.x + pad.width / 2, y: pad.y + pad.height / 2, altitude: 0, heading: 0, airborne: false, sampleFlashMs: 0, photoFlashMs: 0, sampledTargets: new Set(), landSamples: new Set(), photos: new Set() };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function describeDirection(dx, dy) {
  const vertical = dy < -18 ? "north" : dy > 18 ? "south" : "";
  const horizontal = dx > 18 ? "east" : dx < -18 ? "west" : "";
  if (vertical && horizontal) return `${vertical}-${horizontal}`;
  return vertical || horizontal || "at";
}

function formatDistance(value) {
  return `${Math.round(value)} pixels`;
}

function formatCoordinates(x, y) {
  return `x ${Math.round(x)}, y ${Math.round(y)}`;
}

function getMissionPhotoRequirements() {
  return getMission().photoRequirements ?? getMission().checkpoints.map((checkpoint) => ({
    checkpointId: checkpoint.id,
    label: `${checkpoint.name} Photo`,
  }));
}

function getMissionLandSampleRequirements() {
  return getMission().landSampleRequirements ?? [{
    id: "launch-pad-ground-sample",
    label: "Launch Pad Ground Sample",
  }];
}

function getRelativeDescriptionFromPoint(originX, originY, targetX, targetY) {
  const dx = targetX - originX;
  const dy = targetY - originY;
  const distance = Math.hypot(dx, dy);
  const direction = describeDirection(dx, dy);
  return direction === "at"
    ? `very close to the starting point at ${formatCoordinates(targetX, targetY)}`
    : `${formatDistance(distance)} ${direction} of the launch pad at ${formatCoordinates(targetX, targetY)}`;
}

function describeDroneLocation(drone = state.drone) {
  if (!drone) {
    return "No drone state is available yet.";
  }
  const mission = getMission();
  if (isOnLaunchPad()) {
    return "The drone is on the launch pad.";
  }
  const nearbyCheckpoint = mission.checkpoints.find((checkpoint) =>
    Math.hypot(drone.x - checkpoint.x, drone.y - checkpoint.y) <= checkpoint.radius + 24
  );
  if (nearbyCheckpoint) {
    return `The drone is near ${nearbyCheckpoint.name}.`;
  }
  const sampleTarget = getSampleTargetAtPosition(drone.x, drone.y);
  if (sampleTarget && !drone.airborne) {
    return `The drone is landed on the ${sampleTarget.color} sample patch.`;
  }
  const activeZone = mission.noFlyZones.find((zone) =>
    drone.x > zone.x && drone.x < zone.x + zone.width && drone.y > zone.y && drone.y < zone.y + zone.height
  );
  if (activeZone) {
    return `Warning: the drone is inside the ${activeZone.label} no-fly zone.`;
  }
  const pad = mission.launchPad;
  const padCenterX = pad.x + pad.width / 2;
  const padCenterY = pad.y + pad.height / 2;
  const dx = drone.x - padCenterX;
  const dy = drone.y - padCenterY;
  const distance = Math.hypot(dx, dy);
  const direction = describeDirection(dx, dy);
  return direction === "at"
    ? `The drone is close to the launch pad at ${formatCoordinates(drone.x, drone.y)}.`
    : `The drone is ${formatDistance(distance)} ${direction} of the launch pad at ${formatCoordinates(drone.x, drone.y)}.`;
}

function updateAccessibleStatus() {
  if (!state.drone) {
    accessibleStatusText.textContent = "The drone is waiting to be initialised.";
    accessibleStatusBadge.textContent = "Waiting";
    accessibleStatusBadge.className = "chip chip-calm";
    return;
  }
  const altitudeText = state.drone.airborne ? `Airborne at ${state.drone.altitude.toFixed(1)} metres.` : "Landed.";
  const headingText = `Heading ${normalizeDegrees(state.drone.heading)} degrees.`;
  accessibleStatusText.textContent = `${describeDroneLocation()} ${altitudeText} ${headingText}`;
  const badgeText = state.playing ? "Flying" : state.currentMissionSuccess ? "Complete" : "Waiting";
  const badgeClass = state.playing ? "chip chip-warn" : state.currentMissionSuccess ? "chip chip-good" : "chip chip-calm";
  accessibleStatusBadge.textContent = badgeText;
  accessibleStatusBadge.className = badgeClass;
}

function renderAccessibleMissionSummary() {
  const mission = getMission();
  const checkpointsHtml = mission.checkpoints
    .map((checkpoint, index) => `<li>Checkpoint ${index + 1}: ${escapeHtml(checkpoint.name)} at ${formatCoordinates(checkpoint.x, checkpoint.y)}.</li>`)
    .join("");
  const noFlyHtml = mission.noFlyZones.length
    ? mission.noFlyZones.map((zone) => `<li>${escapeHtml(zone.label)} no-fly zone.</li>`).join("")
    : "<li>No no-fly zones in this mission.</li>";
  const sampleRequirements = mission.sampleRequirements ?? [];
  const photoRequirements = getMissionPhotoRequirements();
  const landSampleRequirements = getMissionLandSampleRequirements();
  const sampleHtml = sampleRequirements.length
    ? sampleRequirements.map((sample) => `<li>Collect ${escapeHtml(sample.label)} by landing on the ${escapeHtml(sample.color)} patch and using takeSample().</li>`).join("")
    : "<li>No sample collection is required.</li>";
  const photoHtml = photoRequirements.length
    ? photoRequirements.map((photo) => `<li>Take ${escapeHtml(photo.label)} with takePhoto() while airborne at that checkpoint.</li>`).join("")
    : "";
  const landSampleHtml = landSampleRequirements.length
    ? landSampleRequirements.map((sample) => `<li>After landing back on the launch pad, collect ${escapeHtml(sample.label)} with takeLandSample().</li>`).join("")
    : "";
  accessibleMissionBadge.textContent = `Mission ${state.missionIndex + 1}`;
  accessibleMissionBadge.className = "chip chip-calm";
  accessibleMissionSummary.innerHTML = `
    <p>${escapeHtml(mission.title)}. ${escapeHtml(mission.objective)}</p>
    <p>${escapeHtml(mission.story)}</p>
    <ul>
      <li>Launch from the pad, complete all listed objectives, and finish with a safe landing back on the pad.</li>
      ${checkpointsHtml}
      ${sampleHtml}
      ${photoHtml}
      ${landSampleHtml}
      ${noFlyHtml}
    </ul>
  `;
}

function announceForScreenReader(message) {
  if (state.lastAnnouncement === message) {
    simulatorAnnouncements.textContent = "";
  }
  state.lastAnnouncement = message;
  simulatorAnnouncements.textContent = message;
}

function renderFlightLog() {
  accessibleLogBadge.textContent = `${state.flightLog.length} update${state.flightLog.length === 1 ? "" : "s"}`;
  accessibleLogBadge.className = `chip ${state.flightLog.length ? "chip-good" : "chip-calm"}`;
  accessibleFlightLog.innerHTML = state.flightLog.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("");
}

function addFlightLog(message, announce = false, speak = false) {
  state.flightLog.unshift(message);
  state.flightLog = state.flightLog.slice(0, 14);
  renderFlightLog();
  if (announce) {
    announceForScreenReader(message);
  }
  if (speak) {
    speakMessage(message);
  }
}

function loadAccessibilityPreferences() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY) ?? "{}");
    state.voiceGuidanceEnabled = saved.voiceGuidanceEnabled !== false;
    state.soundEffectsEnabled = saved.soundEffectsEnabled !== false;
  } catch (_error) {
    state.voiceGuidanceEnabled = true;
    state.soundEffectsEnabled = true;
  }
}

function saveAccessibilityPreferences() {
  window.localStorage.setItem(
    ACCESSIBILITY_STORAGE_KEY,
    JSON.stringify({
      voiceGuidanceEnabled: state.voiceGuidanceEnabled,
      soundEffectsEnabled: state.soundEffectsEnabled,
    })
  );
}

function updateAudioControls() {
  voiceToggleButton.textContent = state.voiceGuidanceEnabled ? "Voice On" : "Voice Off";
  soundToggleButton.textContent = state.soundEffectsEnabled ? "Sound Effects On" : "Sound Effects Off";
  voiceToggleButton.setAttribute("aria-pressed", String(state.voiceGuidanceEnabled));
  soundToggleButton.setAttribute("aria-pressed", String(state.soundEffectsEnabled));
  voiceToggleButton.className = state.voiceGuidanceEnabled ? "secondary-button" : "ghost-button";
  soundToggleButton.className = state.soundEffectsEnabled ? "secondary-button" : "ghost-button";
  audioStatusText.textContent = `Voice guidance is ${state.voiceGuidanceEnabled ? "on" : "off"}. Sound effects are ${state.soundEffectsEnabled ? "on" : "off"}.`;
}

function ensureAudioContext() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return null;
  }
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (!state.audioContext) {
    state.audioContext = new AudioContextClass();
  }
  if (state.audioContext.state === "suspended") {
    state.audioContext.resume().catch(() => {});
  }
  return state.audioContext;
}

function speakMessage(message, interrupt = false) {
  if (!state.voiceGuidanceEnabled || !("speechSynthesis" in window)) {
    return;
  }
  if (interrupt) {
    window.speechSynthesis.cancel();
  }
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function playTone(frequency, durationMs, type = "sine", gainValue = 0.035, delaySeconds = 0) {
  const audioContext = ensureAudioContext();
  if (!audioContext || !state.soundEffectsEnabled) {
    return;
  }
  const now = audioContext.currentTime + delaySeconds;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000 + 0.02);
}

function playSoundCue(kind) {
  if (!state.soundEffectsEnabled) {
    return;
  }
  if (kind === "start") {
    playTone(440, 120, "sine");
    playTone(660, 140, "sine", 0.03, 0.14);
    return;
  }
  if (kind === "move") {
    playTone(520, 90, "triangle", 0.02);
    return;
  }
  if (kind === "checkpoint") {
    playTone(660, 100, "sine", 0.03);
    playTone(880, 160, "sine", 0.03, 0.12);
    return;
  }
  if (kind === "sample") {
    playTone(520, 90, "triangle", 0.025);
    playTone(780, 180, "triangle", 0.03, 0.1);
    return;
  }
  if (kind === "success") {
    playTone(523.25, 120, "sine", 0.03);
    playTone(659.25, 120, "sine", 0.03, 0.12);
    playTone(783.99, 220, "sine", 0.03, 0.24);
    return;
  }
  if (kind === "crash") {
    playTone(240, 180, "sawtooth", 0.03);
    playTone(180, 260, "sawtooth", 0.03, 0.08);
    return;
  }
  if (kind === "reset") {
    playTone(330, 120, "triangle", 0.02);
  }
}

function speakCurrentPosition(interrupt = true) {
  speakMessage(accessibleStatusText.textContent, interrupt);
}

function speakMissionDescription() {
  const mission = getMission();
  const sampleRequirements = mission.sampleRequirements?.length
    ? `Required samples: ${mission.sampleRequirements.map((sample) => `${sample.label} from the ${sample.color} patch`).join(", ")}.`
    : "No sample collection is required.";
  const description = `Mission description. ${mission.title}. ${mission.story} Objective: ${mission.objective} ${sampleRequirements}`;
  addFlightLog("Mission description played.", true, false);
  speakMessage(description, true);
}

function speakCommandGuide() {
  const commandGuide = [
    "takeOff. Lift the drone into the air.",
    "land. Bring the drone back to the pad.",
    "moveUp 80. Move north by pixels.",
    "moveDown 80. Move south by pixels.",
    "moveLeft 80. Move west by pixels.",
    "moveRight 80. Move east by pixels.",
    "rotateLeft 90. Turn anticlockwise.",
    "rotateRight 90. Turn clockwise.",
    "wait 1. Hover for seconds.",
    "takeSample. Land on a coloured sensor patch and collect a sample.",
    "takeLandSample. Land back on the launch pad and collect a ground sample before the mission can finish.",
    "takePhoto. Take an aerial photo while the drone is airborne at a checkpoint.",
    "if droneIsAirborne. Run commands only when the condition is true.",
    "if sensingColor grey. Run commands when the drone is above a coloured patch.",
    "for let i equals 0; i less than 3; i plus plus. Repeat a block of commands.",
  ];
  const summary = `Command guide. ${commandGuide.join(" ")}`;
  addFlightLog("Command guide played.", true, false);
  speakMessage(summary, true);
}

function speakMissionAudioMap() {
  const mission = getMission();
  const launchPad = mission.launchPad;
  const startX = launchPad.x + launchPad.width / 2;
  const startY = launchPad.y + launchPad.height / 2;

  const checkpointSummary = mission.checkpoints
    .map((checkpoint, index) => `Checkpoint ${index + 1}, ${checkpoint.name}, is ${getRelativeDescriptionFromPoint(startX, startY, checkpoint.x, checkpoint.y)}.`)
    .join(" ");

  const sampleZones = (mission.sampleRequirements ?? []).map((sample) => {
    const zone = getMissionColorZones().find((candidate) => candidate.color.toLowerCase() === sample.color.toLowerCase());
    if (!zone) {
      return `${sample.label} uses the ${sample.color} patch.`;
    }
    const zoneCenterX = zone.x + zone.width / 2;
    const zoneCenterY = zone.y + zone.height / 2;
    return `${sample.label} is on the ${sample.color} patch, ${getRelativeDescriptionFromPoint(startX, startY, zoneCenterX, zoneCenterY)}.`;
  }).join(" ");

  const photoSummary = getMissionPhotoRequirements().map((photo) => {
    const checkpoint = mission.checkpoints.find((entry) => entry.id === photo.checkpointId);
    return checkpoint
      ? `${photo.label} requires takePhoto at ${getRelativeDescriptionFromPoint(startX, startY, checkpoint.x, checkpoint.y)}.`
      : `${photo.label} requires takePhoto.`;
  }).join(" ");

  const landSampleSummary = getMissionLandSampleRequirements()
    .map((sample) => `${sample.label} requires takeLandSample after landing back on the launch pad.`)
    .join(" ");

  const noFlySummary = mission.noFlyZones.length
    ? mission.noFlyZones.map((zone) => {
      const zoneCenterX = zone.x + zone.width / 2;
      const zoneCenterY = zone.y + zone.height / 2;
      return `${zone.label} no-fly zone is ${getRelativeDescriptionFromPoint(startX, startY, zoneCenterX, zoneCenterY)}.`;
    }).join(" ")
    : "There are no no-fly zones in this mission.";

  const summary = `Mission audio map. You are starting on the launch pad at ${formatCoordinates(startX, startY)}. ${mission.objective} ${checkpointSummary} ${sampleZones} ${photoSummary} ${landSampleSummary} ${noFlySummary}`;
  addFlightLog("Mission audio map played from the launch pad starting position.", true, false);
  speakMessage(summary, true);
}

function loadAccounts() {
  try {
    state.accounts = JSON.parse(window.localStorage.getItem(ACCOUNT_STORAGE_KEY) ?? "{}");
  } catch (_error) {
    state.accounts = {};
  }
  const singleStudentProgress = state.accounts[SINGLE_STUDENT_KEY]?.progress ?? {};
  delete state.accounts[SINGLE_STUDENT_KEY];
  state.accounts[DEFAULT_TEACHER_EMAIL] = {
    ...(state.accounts[DEFAULT_TEACHER_EMAIL] ?? {}),
    email: DEFAULT_TEACHER_EMAIL,
    password: state.accounts[DEFAULT_TEACHER_EMAIL]?.password ?? DEFAULT_TEACHER_PASSWORD,
    role: "teacher",
    progress: state.accounts[DEFAULT_TEACHER_EMAIL]?.progress ?? {},
  };
  const firstStudent = Object.values(state.accounts).find((account) => account.role === "student");
  if (firstStudent && Object.keys(firstStudent.progress ?? {}).length === 0 && Object.keys(singleStudentProgress).length > 0) {
    firstStudent.progress = singleStudentProgress;
  }
  saveAccounts();
}

function saveAccounts() {
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(state.accounts));
}

function loadSession() {
  const savedEmail = window.localStorage.getItem(SESSION_STORAGE_KEY) ?? "";
  state.currentUserEmail = state.accounts[savedEmail] ? savedEmail : "";
}

function saveSession() {
  if (state.currentUserEmail) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, state.currentUserEmail);
    return;
  }
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

function setAuthMode(mode) {
  state.authMode = mode;
  showLoginButton.classList.toggle("active", mode === "login");
  showRegisterButton.classList.toggle("active", mode === "register");
  authSubmitButton.textContent = mode === "login" ? "Sign In" : "Create Account";
  if (mode === "register") {
    state.authKind = "student";
  }
  refreshAuthControls();
}

function setAuthKind(kind) {
  state.authKind = kind;
  if (kind === "teacher") {
    state.authMode = "login";
  }
  refreshAuthControls();
}

function refreshAuthControls() {
  const registerMode = state.authMode === "register";
  const teacherKind = state.authKind === "teacher";
  showLoginButton.classList.toggle("active", !registerMode);
  showRegisterButton.classList.toggle("active", registerMode);
  selectStudentButton.classList.toggle("active", !teacherKind);
  selectTeacherButton.classList.toggle("active", teacherKind);
  showLoginButton.setAttribute("aria-pressed", String(!registerMode));
  showRegisterButton.setAttribute("aria-pressed", String(registerMode));
  selectStudentButton.setAttribute("aria-pressed", String(!teacherKind));
  selectTeacherButton.setAttribute("aria-pressed", String(teacherKind));
  showRegisterButton.disabled = teacherKind;
  studentNameInput.classList.toggle("hidden", !registerMode);
  studentNameLabel.classList.toggle("hidden", !registerMode);
  authSubmitButton.textContent = registerMode ? "Create Student Account" : "Sign In";
  authFeedbackText.textContent = registerMode
    ? "Create a student account with a student name, email, and password."
    : teacherKind
      ? `Teacher login: ${DEFAULT_TEACHER_EMAIL}`
      : "Use a saved student account to continue your missions.";
}

function refreshAuthUi() {
  const account = getCurrentAccount();
  const signedIn = Boolean(account);
  const teacherMode = isTeacherUser();
  entryOverlay.classList.toggle("hidden", signedIn);
  appShell.classList.toggle("teacher-mode", teacherMode);
  mainColumn.classList.toggle("hidden", teacherMode);
  missionPanel.classList.toggle("hidden", teacherMode);
  commandsPanel.classList.toggle("hidden", teacherMode);
  tipsPanel.classList.toggle("hidden", teacherMode);
  accountRoleBadge.textContent = signedIn ? (account.role === "teacher" ? "Teacher" : "Student") : "Signed out";
  accountRoleBadge.className = `chip ${signedIn ? "chip-good" : "chip-calm"}`;
  accountStatusText.textContent = !signedIn
    ? "Sign in as a student to save mission progress, or as a teacher to view class completion data."
    : account.role === "teacher"
      ? "Teacher dashboard is now available below."
      : `${account.name ?? account.email} is signed in. Mission completion will save automatically to this student account.`;
  logoutButton.classList.toggle("hidden", !signedIn);
  teacherAccountPanel.classList.toggle("hidden", !teacherMode);
  teacherPanel.classList.toggle("hidden", !teacherMode);
  studentProgressPanel.classList.toggle("hidden", !isStudentUser());
  renderStudentProgress();
  renderTeacherDashboard();
}

function refreshStudentWorkspace() {
  if (!isStudentUser()) {
    return;
  }
  appShell.classList.remove("teacher-mode");
  mainColumn.classList.remove("hidden");
  missionPanel.classList.remove("hidden");
  commandsPanel.classList.remove("hidden");
  tipsPanel.classList.remove("hidden");
  const nextMission = findNextIncompleteMissionForCurrentStudent();
  state.levelKey = nextMission.levelKey;
  state.missionIndex = nextMission.missionIndex;
  state.selectedStudentMissionKey = getMissionKey(nextMission.levelKey, nextMission.missionIndex);
  setTheme();
  loadMissionEditor();
  renderCommandPreview([]);
  resetDrone();
  renderMissionPanel();
  updateHud();
  drawScene(performance.now());
  requestAnimationFrame(() => {
    drawScene(performance.now());
  });
}

function resetSimulatorForAuthSwitch() {
  state.playing = false;
  state.animationQueue = [];
  state.currentStep = null;
  state.lastTime = 0;
  state.visitedCheckpoints = new Set();
  state.collectedSamples = new Set();
  state.collectedLandSamples = new Set();
  state.capturedPhotos = new Set();
  state.currentMissionSuccess = false;
  if (state.drone) {
    state.drone.sampleFlashMs = 0;
  }
}

function switchStudentMissionByKey(missionKey) {
  const missionEntry = getMissionEntryFromKey(missionKey);
  if (!missionEntry || !isStudentUser()) {
    return;
  }
  if (!getStudentUnlockedMissionKeys().has(missionEntry.missionKey)) {
    renderStudentProgress();
    updateFeedback("Complete the previous mission before opening this one.", "Locked", "chip-warn");
    return;
  }
  state.selectedStudentMissionKey = missionEntry.missionKey;
  state.levelKey = missionEntry.levelKey;
  state.missionIndex = missionEntry.missionIndex;
  setTheme();
  loadMissionEditor();
  renderCommandPreview([]);
  resetDrone();
  renderMissionPanel();
  updateHud();
  drawScene(performance.now());
  requestAnimationFrame(() => {
    drawScene(performance.now());
  });
  renderStudentProgress();
}

function handleAuthSubmit() {
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value.trim();
  const studentName = studentNameInput.value.trim();
  if (!email || !password) {
    authFeedbackText.textContent = "Enter both email and password.";
    return;
  }

  if (state.authMode === "register") {
    if (!studentName) {
      authFeedbackText.textContent = "Enter the student name before registering.";
      return;
    }
    if (state.accounts[email]) {
      authFeedbackText.textContent = "That email already has an account.";
      return;
    }
    state.accounts[email] = { email, password, role: "student", name: studentName, progress: {} };
    state.currentUserEmail = email;
    saveAccounts();
    saveSession();
    refreshAuthUi();
    refreshStudentWorkspace();
    authFeedbackText.textContent = "Account created and signed in.";
    return;
  }

  const account = state.accounts[email];
  if (!account || account.password !== password) {
    authFeedbackText.textContent = "Incorrect email or password.";
    return;
  }
  if (state.authKind === "teacher" && account.role !== "teacher") {
    authFeedbackText.textContent = "Use the teacher login for a teacher account.";
    return;
  }
  if (state.authKind === "student" && account.role !== "student") {
    authFeedbackText.textContent = "Use the student login for a student account.";
    return;
  }

  resetSimulatorForAuthSwitch();
  state.currentUserEmail = email;
  saveSession();
  refreshAuthUi();
  if (account.role === "student") {
    refreshStudentWorkspace();
  } else {
    resetDrone();
    drawScene(performance.now());
  }
  authFeedbackText.textContent = "Signed in successfully.";
}

function logoutCurrentUser() {
  resetSimulatorForAuthSwitch();
  state.currentUserEmail = "";
  state.authMode = "login";
  state.authKind = "student";
  saveSession();
  setAuthMode("login");
  setAuthKind("student");
  refreshAuthUi();
  authFeedbackText.textContent = "Signed out.";
}

function renderStudentProgress() {
  if (!isStudentUser()) {
    studentMissionSelect.innerHTML = "";
    studentProgressList.innerHTML = "";
    studentProgressBadge.textContent = "0 complete";
    certificatePanel.classList.add("hidden");
    return;
  }
  const account = getCurrentAccount();
  const progress = ensureAccountProgress(account);
  const summary = getStudentCompletionSummary(account);
  const missions = summary.missions;
  const unlockedMissionKeys = getStudentUnlockedMissionKeys();
  const completedCount = summary.completedCount;
  studentProgressBadge.textContent = `${completedCount} complete`;
  studentProgressBadge.className = `chip ${completedCount ? "chip-good" : "chip-calm"}`;
  if (
    !missions.some((entry) => entry.missionKey === state.selectedStudentMissionKey) ||
    !unlockedMissionKeys.has(state.selectedStudentMissionKey)
  ) {
    state.selectedStudentMissionKey = missions[0]?.missionKey ?? "";
  }

  studentMissionSelect.innerHTML = missions.map((entry) => `
    <option
      value="${entry.missionKey}"
      ${entry.missionKey === state.selectedStudentMissionKey ? "selected" : ""}
      ${unlockedMissionKeys.has(entry.missionKey) ? "" : "disabled"}
    >
      ${entry.levelLabel} - ${entry.missionTitle}
    </option>
  `).join("");

  const selectedMission = missions.find((entry) => entry.missionKey === state.selectedStudentMissionKey) ?? missions[0];
  if (!selectedMission) {
    studentProgressList.innerHTML = "";
    return;
  }

  const complete = Boolean(progress[selectedMission.missionKey]?.completed);
  const completedAt = progress[selectedMission.missionKey]?.completedAt;
  const unlocked = unlockedMissionKeys.has(selectedMission.missionKey);
  studentProgressList.innerHTML = `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${selectedMission.levelLabel} - ${selectedMission.missionTitle}</strong><div>${complete ? `Completed${completedAt ? ` on ${new Date(completedAt).toLocaleDateString()}` : ""}` : unlocked ? "Ready to attempt" : "Locked until the previous mission is completed"}</div></div><span class="chip ${complete ? "chip-good" : unlocked ? "chip-calm" : "chip-warn"}">${complete ? "Done" : unlocked ? "Unlocked" : "Locked"}</span></div>`;

  certificatePanel.classList.toggle("hidden", !summary.allComplete);
  if (summary.allComplete) {
    certificateStudentName.textContent = account.name ?? account.email;
    certificateDateText.textContent = summary.latestCompletedAt
      ? `Awarded on ${new Date(summary.latestCompletedAt).toLocaleDateString()}`
      : "Awarded for completing all missions";
  }
}

function renderTeacherDashboard() {
  if (!isTeacherUser()) {
    teacherDashboard.innerHTML = "";
    teacherSummaryBadge.textContent = "0 students";
    teacherStudentSelect.innerHTML = "";
    return;
  }
  const students = Object.values(state.accounts).filter((account) => account.role === "student");
  teacherSummaryBadge.textContent = `${students.length} student${students.length === 1 ? "" : "s"}`;
  teacherSummaryBadge.className = `chip ${students.length ? "chip-good" : "chip-calm"}`;
  if (!students.length) {
    teacherStudentSelect.innerHTML = `<option value="">No students available</option>`;
    teacherDashboard.innerHTML = `<div class="teacher-student-card"><strong>No student accounts yet</strong><span>Student progress will appear here after they register and complete missions.</span></div>`;
    return;
  }

  if (!students.some((student) => student.email === state.selectedTeacherStudentEmail)) {
    state.selectedTeacherStudentEmail = students[0].email;
  }

  teacherStudentSelect.innerHTML = students.map((student) => `
    <option value="${student.email}" ${student.email === state.selectedTeacherStudentEmail ? "selected" : ""}>
      ${student.name ?? student.email}
    </option>
  `).join("");

  const student = students.find((entry) => entry.email === state.selectedTeacherStudentEmail) ?? students[0];
  const missions = getAllMissionEntries();
  const progress = ensureAccountProgress(student);
  const completedCount = missions.filter((entry) => progress[entry.missionKey]?.completed).length;
  const nextMission = missions.find((entry) => !progress[entry.missionKey]?.completed);
  const missionRows = missions.map((entry) => {
    const complete = Boolean(progress[entry.missionKey]?.completed);
    const completedAt = progress[entry.missionKey]?.completedAt;
    return `<div class="teacher-mission-row"><span>${entry.levelLabel} - ${entry.missionTitle}</span><span>${complete ? `Complete${completedAt ? ` (${new Date(completedAt).toLocaleDateString()})` : ""}` : "Pending"}</span></div>`;
  }).join("");
  const missionGraphRows = missions.map((entry) => {
    const completionCount = students.filter((studentAccount) => {
      const studentProgress = ensureAccountProgress(studentAccount);
      return Boolean(studentProgress[entry.missionKey]?.completed);
    }).length;
    const completionPercent = students.length ? (completionCount / students.length) * 100 : 0;
    return `
      <div class="teacher-graph-row">
        <div class="teacher-graph-header">
          <span>${entry.levelLabel} - Mission ${entry.missionIndex + 1}</span>
          <span>${completionCount}/${students.length}</span>
        </div>
        <div class="teacher-graph-track">
          <div class="teacher-graph-bar" style="width: ${completionPercent}%;"></div>
        </div>
      </div>`;
  }).join("");

  teacherDashboard.innerHTML = `
    <div class="teacher-student-card">
      <strong>${student.name ?? student.email}</strong>
      <div class="teacher-summary-lines">
        <span>${student.email}</span>
        <span>${completedCount} / ${missions.length} missions complete</span>
        <span>${nextMission ? `Currently up to: ${nextMission.levelLabel} - ${nextMission.missionTitle}` : "All missions complete"}</span>
      </div>
      ${missionRows}
      <div class="teacher-account-actions">
        <label class="field-label" for="reset-${sanitizeId(student.email)}">New Password</label>
        <input id="reset-${sanitizeId(student.email)}" data-email="${student.email}" class="teacher-password-input" type="text" placeholder="Enter new password">
        <div class="teacher-action-row">
          <button type="button" class="secondary-button teacher-reset-button" data-email="${student.email}">Change Password</button>
          <button type="button" class="danger-button teacher-delete-button" data-email="${student.email}">Delete User</button>
        </div>
      </div>
      <div class="teacher-graph-card">
        <strong>Mission Completion Graph</strong>
        <div class="teacher-summary-lines">
          <span>Bar graph showing how many students have completed each mission.</span>
        </div>
        <div class="teacher-graph">
          ${missionGraphRows}
        </div>
      </div>
    </div>`;

  teacherDashboard.querySelectorAll(".teacher-reset-button").forEach((button) => {
    button.addEventListener("click", () => changeStudentPassword(button.dataset.email));
  });
  teacherDashboard.querySelectorAll(".teacher-delete-button").forEach((button) => {
    button.addEventListener("click", () => deleteStudentAccount(button.dataset.email));
  });
}

function sanitizeId(value) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function changeTeacherPassword() {
  if (!isTeacherUser()) {
    return;
  }
  const teacherAccount = getCurrentAccount();
  if (!teacherAccount) {
    return;
  }
  const nextPassword = teacherPasswordInput?.value.trim() ?? "";
  if (!nextPassword) {
    authFeedbackText.textContent = "Enter a new teacher password before changing it.";
    return;
  }
  teacherAccount.password = nextPassword;
  saveAccounts();
  authFeedbackText.textContent = "Teacher password updated.";
  if (teacherPasswordInput) {
    teacherPasswordInput.value = "";
  }
  renderTeacherDashboard();
}

function changeStudentPassword(email) {
  if (!isTeacherUser() || !email || !state.accounts[email] || state.accounts[email].role !== "student") {
    return;
  }
  const input = teacherDashboard.querySelector(`#reset-${sanitizeId(email)}`);
  const nextPassword = input?.value.trim() ?? "";
  if (!nextPassword) {
    authFeedbackText.textContent = "Enter a new password before changing it.";
    return;
  }
  state.accounts[email].password = nextPassword;
  saveAccounts();
  authFeedbackText.textContent = `Password updated for ${email}.`;
  if (input) {
    input.value = "";
  }
  renderTeacherDashboard();
}

function deleteStudentAccount(email) {
  if (!isTeacherUser() || !email || !state.accounts[email] || state.accounts[email].role !== "student") {
    return;
  }
  delete state.accounts[email];
  if (state.selectedTeacherStudentEmail === email) {
    state.selectedTeacherStudentEmail = "";
  }
  saveAccounts();
  authFeedbackText.textContent = `Deleted student account ${email}.`;
  renderTeacherDashboard();
}

function recordMissionCompletion() {
  if (!isStudentUser()) {
    return;
  }
  const account = getCurrentAccount();
  const progress = ensureAccountProgress(account);
  progress[getMissionKey()] = {
    completed: true,
    completedAt: new Date().toISOString(),
    levelKey: state.levelKey,
    missionIndex: state.missionIndex,
  };
  saveAccounts();
  renderStudentProgress();
  renderTeacherDashboard();
}

function setTheme() {
  const campaign = getCampaign();
  document.body.dataset.theme = state.levelKey;
  themeBadge.textContent = campaign.label;
  hudThemeReadout.textContent = campaign.label;
  pathButtons.forEach((button) => {
    const active = button.dataset.level === state.levelKey;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  syntaxNote.textContent = "The editor accepts one command per line. Distances are in pixels, rotations are in degrees, and blocks use { and }.";
  rankRequirementNote.textContent = getRankRequirementText();
}

function getRankRequirementText() {
  if (state.levelKey === "second_officer") {
    return "Second Officer missions require at least one if statement, such as if (sensingColor(\"grey\")) { ... }.";
  }
  if (state.levelKey === "first_officer") {
    return "First Officer missions require at least one loop, such as for (let i = 0; i < 3; i++) { ... }.";
  }
  if (state.levelKey === "captain") {
    return "Captain missions require both an if statement and a loop. Colour sensing conditions also work here.";
  }
  return "Cadet missions can be solved with direct commands. Higher ranks unlock required control structures.";
}

function getMissionColorZones() {
  if (getMission().colorZones) {
    return getMission().colorZones;
  }
  return [
    { color: "grey", label: "Grey Rock", x: 215, y: 330, width: 120, height: 85, fill: "rgba(170, 180, 191, 0.32)", stroke: "#b8c1ca" },
    { color: "blue", label: "Blue Tile", x: 485, y: 155, width: 120, height: 85, fill: "rgba(89, 215, 255, 0.24)", stroke: "#72dfff" },
    { color: "gold", label: "Gold Tile", x: 735, y: 345, width: 120, height: 85, fill: "rgba(255, 215, 140, 0.24)", stroke: "#ffd78c" },
  ];
}

function loadMissionEditor(exampleOverride) {
  if (exampleOverride) {
    codeEditor.value = exampleOverride;
    return;
  }
  if (state.missionIndex === 0) {
    codeEditor.value = getMission().example;
    exampleButton.disabled = false;
    exampleButton.textContent = "Load Example";
    return;
  }
  codeEditor.value = `// Plan your own solution for this mission.
// Use takePhoto() at checkpoints.
// Use takeSample() on required colour patches.
// Finish by landing on the launch pad and using takeLandSample().`;
  exampleButton.disabled = true;
  exampleButton.textContent = "Example Available On Mission 1";
}

function updateFeedback(message, badgeText, badgeClass) {
  feedbackText.textContent = message;
  feedbackBadge.textContent = badgeText;
  feedbackBadge.className = `chip ${badgeClass}`;
  announceForScreenReader(`${badgeText}. ${message}`);
}

function updateHud() {
  positionReadout.textContent = `x: ${Math.round(state.drone.x)}, y: ${Math.round(state.drone.y)}`;
  altitudeReadout.textContent = `${state.drone.altitude.toFixed(1)} m`;
  headingReadout.textContent = `${normalizeDegrees(state.drone.heading)} deg`;
  updateAccessibleStatus();
}

function renderMissionPanel() {
  const campaign = getCampaign();
  const mission = getMission();
  const allVisited = mission.checkpoints.every((checkpoint) => state.visitedCheckpoints.has(checkpoint.id));
  const sampleRequirements = mission.sampleRequirements ?? [];
  const photoRequirements = getMissionPhotoRequirements();
  const landSampleRequirements = getMissionLandSampleRequirements();
  storyText.textContent = `${campaign.title}: ${mission.story}`;
  missionText.textContent = mission.objective;
  missionIndexBadge.textContent = `Mission ${state.missionIndex + 1} of ${campaign.missions.length}`;
  missionGoalBadge.textContent = mission.goalLabel;
  prevMissionButton.disabled = state.missionIndex === 0;
  nextMissionButton.disabled = state.missionIndex === campaign.missions.length - 1;
  const checkpointHtml = mission.checkpoints.map((checkpoint) => {
    const complete = state.visitedCheckpoints.has(checkpoint.id);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${checkpoint.name}</strong><div>${formatCoordinates(checkpoint.x, checkpoint.y)} - ${complete ? "Reached by drone" : "Pending objective"}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Done" : "Pending"}</span></div>`;
  }).join("");
  const sampleHtml = sampleRequirements.map((sample) => {
    const complete = state.collectedSamples.has(sample.label);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${sample.label}</strong><div>${complete ? `Collected from ${sample.color} patch` : `Land on the ${sample.color} patch and use takeSample();`}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Sampled" : "Pending"}</span></div>`;
  }).join("");
  const photoHtml = photoRequirements.map((photo) => {
    const complete = state.capturedPhotos.has(photo.label);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${photo.label}</strong><div>${complete ? "Photo captured" : "Fly to this checkpoint and use takePhoto();"}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Photo" : "Pending"}</span></div>`;
  }).join("");
  const landSampleHtml = landSampleRequirements.map((sample) => {
    const complete = state.collectedLandSamples.has(sample.label);
    return `<div class="checkpoint-item ${complete ? "complete" : ""}"><div><strong>${sample.label}</strong><div>${complete ? "Ground sample collected" : "Land back on the launch pad and use takeLandSample();"}</div></div><span class="chip ${complete ? "chip-good" : "chip-calm"}">${complete ? "Sampled" : "Pending"}</span></div>`;
  }).join("");
  checkpointList.innerHTML = checkpointHtml + sampleHtml + photoHtml + landSampleHtml;

  if (state.playing) {
    missionState.textContent = "Flying";
    missionState.className = "chip chip-warn";
  } else if (state.currentMissionSuccess && allVisited) {
    missionState.textContent = "Complete";
    missionState.className = "chip chip-good";
  } else {
    missionState.textContent = "Waiting";
    missionState.className = "chip chip-calm";
  }
  renderAccessibleMissionSummary();
  updateAccessibleStatus();
}

function renderCommandPreview(commands) {
  commandCount.textContent = `${commands.length} command${commands.length === 1 ? "" : "s"}`;
  commandPreview.innerHTML = commands.map((command, index) => `<li>${index + 1}. ${command.name}(${command.value ?? ""})</li>`).join("");
}

function resetDrone() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  state.drone = getInitialDrone();
  state.animationQueue = [];
  state.currentStep = null;
  state.lastTime = 0;
  state.playing = false;
  state.visitedCheckpoints = new Set();
  state.collectedSamples = new Set();
  state.collectedLandSamples = new Set();
  state.capturedPhotos = new Set();
  state.trail = [{ x: state.drone.x, y: state.drone.y }];
  state.currentMissionSuccess = false;
  state.lastSpokenProgressAt = 0;
  state.lastSpokenProgressMessage = "";
  state.flightLog = ["Mission reset. The drone is back on the launch pad."];
  updateHud();
  renderMissionPanel();
  renderFlightLog();
  playSoundCue("reset");
  updateFeedback("Drone reset. Run the mission program when you're ready.", "Ready", "chip-calm");
}

function applyLevel(levelKey) {
  if (isStudentUser()) {
    const targetMissionKey = getMissionKey(levelKey, 0);
    if (!getStudentUnlockedMissionKeys().has(targetMissionKey)) {
      updateFeedback("Complete the earlier missions before moving to that level.", "Locked", "chip-warn");
      return;
    }
  }
  state.levelKey = levelKey;
  state.missionIndex = 0;
  state.selectedStudentMissionKey = getMissionKey(state.levelKey, state.missionIndex);
  setTheme();
  loadMissionEditor();
  renderCommandPreview([]);
  resetDrone();
}

function loadMission(index) {
  const nextIndex = clamp(index, 0, getCampaign().missions.length - 1);
  const nextMissionKey = getMissionKey(state.levelKey, nextIndex);
  if (isStudentUser() && !getStudentUnlockedMissionKeys().has(nextMissionKey)) {
    updateFeedback("Complete the previous mission before opening this one.", "Locked", "chip-warn");
    return;
  }
  state.missionIndex = nextIndex;
  state.selectedStudentMissionKey = getMissionKey(state.levelKey, state.missionIndex);
  loadMissionEditor();
  renderCommandPreview([]);
  resetDrone();
}

function parseProgram(source) {
  const lines = source.split(/\r?\n/);
  const parsed = parseBlock(lines, 0, false);
  const commands = expandNodes(parsed.nodes, getInitialDrone());
  validateRankRequirements(parsed.meta);
  if (!commands.length) throw new Error("Add at least one command before running the mission.");
  return { commands, meta: parsed.meta };
}

function parseBlock(lines, startIndex, stopOnBrace) {
  const nodes = [];
  const meta = { usedIf: false, usedLoop: false };
  let index = startIndex;

  while (index < lines.length) {
    const rawLine = lines[index].trim();
    if (!rawLine || rawLine.startsWith("//")) {
      index += 1;
      continue;
    }

    if (rawLine === "}") {
      if (!stopOnBrace) {
        throw new Error(`Line ${index + 1}: unexpected closing brace.`);
      }
      return { nodes, meta, nextIndex: index + 1 };
    }

    const ifMatch = rawLine.match(/^if\s*\((.+)\)\s*\{\s*$/);
    if (ifMatch) {
      const inner = parseBlock(lines, index + 1, true);
      nodes.push({ type: "if", condition: ifMatch[1].trim(), body: inner.nodes, line: index + 1 });
      meta.usedIf = true;
      meta.usedIf ||= inner.meta.usedIf;
      meta.usedLoop ||= inner.meta.usedLoop;
      index = inner.nextIndex;
      continue;
    }

    const loopMatch = rawLine.match(/^for\s*\(\s*let\s+([a-zA-Z_$][\w$]*)\s*=\s*0\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\s*\)\s*\{\s*$/);
    if (loopMatch) {
      const repetitions = Number(loopMatch[2]);
      if (!Number.isFinite(repetitions) || repetitions <= 0 || repetitions > 12) {
        throw new Error(`Line ${index + 1}: loop counts must be between 1 and 12.`);
      }
      const inner = parseBlock(lines, index + 1, true);
      nodes.push({ type: "loop", count: repetitions, body: inner.nodes, line: index + 1 });
      meta.usedLoop = true;
      meta.usedIf ||= inner.meta.usedIf;
      meta.usedLoop ||= inner.meta.usedLoop;
      index = inner.nextIndex;
      continue;
    }

    nodes.push(parseCommandLine(rawLine, index + 1));
    index += 1;
  }

  if (stopOnBrace) {
    throw new Error("A control block is missing its closing brace.");
  }

  return { nodes, meta, nextIndex: index };
}

function parseCommandLine(rawLine, lineNumber) {
  const match = rawLine.match(/^([a-zA-Z][a-zA-Z0-9]*)\s*\(([^)]*)\)\s*;\s*$/);
  if (!match) throw new Error(`Line ${lineNumber}: use commandName(value); with a semicolon at the end.`);
  const [, name, rawArg] = match;
  if (!COMMANDS.has(name)) throw new Error(`Line ${lineNumber}: "${name}" is not a supported command.`);
  const trimmedArg = rawArg.trim();
  const needsValue = !["takeOff", "land", "takeSample", "takeLandSample", "takePhoto"].includes(name);
  if (!needsValue && trimmedArg) throw new Error(`Line ${lineNumber}: ${name}() does not take a value.`);
  if (needsValue && !trimmedArg) throw new Error(`Line ${lineNumber}: ${name} needs a positive number.`);
  let value = null;
  if (needsValue) {
    value = Number(trimmedArg);
    if (!Number.isFinite(value) || value <= 0) throw new Error(`Line ${lineNumber}: ${name} needs a positive number.`);
  }
  return { type: "command", name, value, line: lineNumber };
}

function expandNodes(nodes, previewDrone) {
  const commands = [];
  for (const node of nodes) {
    if (node.type === "command") {
      validateCommandAgainstState(node, previewDrone);
      commands.push({ name: node.name, value: node.value, line: node.line });
      continue;
    }
    if (node.type === "if") {
      if (evaluateCondition(node.condition, previewDrone, node.line)) {
        commands.push(...expandNodes(node.body, previewDrone));
      }
      continue;
    }
    if (node.type === "loop") {
      for (let index = 0; index < node.count; index += 1) {
        commands.push(...expandNodes(node.body, previewDrone));
      }
    }
  }
  return commands;
}

function evaluateCondition(condition, previewDrone, line) {
  if (condition === "true") return true;
  if (condition === "false") return false;
  if (condition === "droneIsAirborne") return previewDrone.airborne;
  if (condition === "!droneIsAirborne") return !previewDrone.airborne;
  const sensingMatch = condition.match(/^sensingColor\(\s*["']([a-zA-Z]+)["']\s*\)$/);
  if (sensingMatch) {
    return getSensedColor(previewDrone.x, previewDrone.y) === sensingMatch[1].toLowerCase();
  }
  const headingMatch = condition.match(/^headingIs\((\d+)\)$/);
  if (headingMatch) {
    return normalizeDegrees(previewDrone.heading) === normalizeDegrees(Number(headingMatch[1]));
  }
  throw new Error(`Line ${line}: supported conditions are true, false, droneIsAirborne, !droneIsAirborne, headingIs(90), and sensingColor("grey").`);
}

function getSensedColor(x, y) {
  const zone = getMissionColorZones().find((candidate) =>
    x > candidate.x &&
    x < candidate.x + candidate.width &&
    y > candidate.y &&
    y < candidate.y + candidate.height
  );
  return zone ? zone.color.toLowerCase() : "";
}

function getSampleTargetAtPosition(x, y) {
  const sensedColor = getSensedColor(x, y);
  if (!sensedColor) return null;
  return (getMission().sampleRequirements ?? []).find((sample) => sample.color.toLowerCase() === sensedColor) ?? null;
}

function getPhotoTargetAtPosition(x, y) {
  const mission = getMission();
  const checkpoint = mission.checkpoints.find((entry) => Math.hypot(x - entry.x, y - entry.y) <= entry.radius + 16);
  if (!checkpoint) return null;
  return getMissionPhotoRequirements().find((photo) => photo.checkpointId === checkpoint.id) ?? null;
}

function getLandSampleTargetAtPosition(x, y) {
  if (!isOnLaunchPadPosition(x, y)) return null;
  return getMissionLandSampleRequirements()[0] ?? null;
}

function validateRankRequirements(meta) {
  if (state.levelKey === "second_officer" && !meta.usedIf) {
    throw new Error("Second Officer missions require at least one if statement.");
  }
  if (state.levelKey === "first_officer" && !meta.usedLoop) {
    throw new Error("First Officer missions require at least one loop.");
  }
  if (state.levelKey === "captain" && (!meta.usedIf || !meta.usedLoop)) {
    throw new Error("Captain missions require both an if statement and a loop.");
  }
}

function validateCommandAgainstState(command, previewDrone) {
  if (command.name === "takeOff") {
    if (previewDrone.airborne) throw new Error(`Line ${command.line}: the drone is already airborne.`);
    previewDrone.airborne = true;
    previewDrone.altitude = 24;
    return;
  }
  if (command.name === "land") {
    if (!previewDrone.airborne) throw new Error(`Line ${command.line}: take off before landing.`);
    previewDrone.airborne = false;
    previewDrone.altitude = 0;
    return;
  }
  if (command.name === "takeSample") {
    if (previewDrone.airborne) throw new Error(`Line ${command.line}: land on a colour patch before taking a sample.`);
    const sampleTarget = getSampleTargetAtPosition(previewDrone.x, previewDrone.y);
    if (!sampleTarget) throw new Error(`Line ${command.line}: takeSample() only works when landed on a required colour patch.`);
    previewDrone.sampledTargets.add(sampleTarget.label);
    return;
  }
  if (command.name === "takeLandSample") {
    if (previewDrone.airborne) throw new Error(`Line ${command.line}: land on the launch pad before taking a land sample.`);
    const landSampleTarget = getLandSampleTargetAtPosition(previewDrone.x, previewDrone.y);
    if (!landSampleTarget) throw new Error(`Line ${command.line}: takeLandSample() only works after landing back on the launch pad.`);
    previewDrone.landSamples.add(landSampleTarget.label);
    return;
  }
  if (command.name === "takePhoto") {
    if (!previewDrone.airborne) throw new Error(`Line ${command.line}: takePhoto() only works while the drone is airborne at a checkpoint.`);
    const photoTarget = getPhotoTargetAtPosition(previewDrone.x, previewDrone.y);
    if (!photoTarget) throw new Error(`Line ${command.line}: takePhoto() only works when the drone is above a required checkpoint.`);
    previewDrone.photos.add(photoTarget.label);
    return;
  }
  if (!previewDrone.airborne) throw new Error(`Line ${command.line}: the drone must take off before it can move.`);
  if (["moveUp", "moveDown", "moveLeft", "moveRight"].includes(command.name)) {
    const next = getNextPosition(previewDrone, command);
    ensureSafePosition(next.x, next.y, command.line);
    previewDrone.x = next.x;
    previewDrone.y = next.y;
    return;
  }
  if (["rotateLeft", "rotateRight"].includes(command.name)) {
    previewDrone.heading = normalizeDegrees(previewDrone.heading + (command.name === "rotateRight" ? command.value : -command.value));
  }
}

function buildAnimationQueue(commands) {
  const previewDrone = getInitialDrone();
  const queue = [];
  for (const command of commands) {
    if (command.name === "takeOff") {
      if (previewDrone.airborne) throw new Error(`Line ${command.line}: the drone is already airborne.`);
      previewDrone.airborne = true;
      previewDrone.altitude = 24;
      queue.push({ type: "altitude", targetAltitude: 24, duration: 1000, label: "Taking off" });
      continue;
    }
    if (command.name === "land") {
      if (!previewDrone.airborne) throw new Error(`Line ${command.line}: take off before landing.`);
      previewDrone.airborne = false;
      previewDrone.altitude = 0;
      queue.push({ type: "altitude", targetAltitude: 0, duration: 1000, label: "Landing" });
      continue;
    }
    if (command.name === "takeSample") {
      if (previewDrone.airborne) throw new Error(`Line ${command.line}: land on a colour patch before taking a sample.`);
      const sampleTarget = getSampleTargetAtPosition(previewDrone.x, previewDrone.y);
      if (!sampleTarget) throw new Error(`Line ${command.line}: takeSample() only works when landed on a required colour patch.`);
      previewDrone.sampledTargets.add(sampleTarget.label);
      queue.push({ type: "sample", sampleLabel: sampleTarget.label, color: sampleTarget.color, duration: 700, label: `Taking ${sampleTarget.color} sample` });
      continue;
    }
    if (command.name === "takeLandSample") {
      if (previewDrone.airborne) throw new Error(`Line ${command.line}: land on the launch pad before taking a land sample.`);
      const landSampleTarget = getLandSampleTargetAtPosition(previewDrone.x, previewDrone.y);
      if (!landSampleTarget) throw new Error(`Line ${command.line}: takeLandSample() only works after landing back on the launch pad.`);
      previewDrone.landSamples.add(landSampleTarget.label);
      queue.push({ type: "landSample", sampleLabel: landSampleTarget.label, duration: 700, label: "Taking land sample" });
      continue;
    }
    if (command.name === "takePhoto") {
      if (!previewDrone.airborne) throw new Error(`Line ${command.line}: takePhoto() only works while the drone is airborne at a checkpoint.`);
      const photoTarget = getPhotoTargetAtPosition(previewDrone.x, previewDrone.y);
      if (!photoTarget) throw new Error(`Line ${command.line}: takePhoto() only works when the drone is above a required checkpoint.`);
      previewDrone.photos.add(photoTarget.label);
      queue.push({ type: "photo", photoLabel: photoTarget.label, duration: 650, label: `Taking photo: ${photoTarget.label}` });
      continue;
    }
    if (!previewDrone.airborne) throw new Error(`Line ${command.line}: the drone must take off before it can move.`);
    if (["moveUp", "moveDown", "moveLeft", "moveRight"].includes(command.name)) {
      const next = getNextPosition(previewDrone, command);
      ensureSafePosition(next.x, next.y, command.line);
      previewDrone.x = next.x;
      previewDrone.y = next.y;
      queue.push({ type: "move", targetX: next.x, targetY: next.y, duration: Math.max(700, command.value * 6), label: `${command.name}(${command.value})` });
      continue;
    }
    if (["rotateLeft", "rotateRight"].includes(command.name)) {
      previewDrone.heading = normalizeDegrees(previewDrone.heading + (command.name === "rotateRight" ? command.value : -command.value));
      queue.push({ type: "rotate", targetHeading: previewDrone.heading, duration: 650, label: `${command.name}(${command.value})` });
      continue;
    }
    queue.push({ type: "wait", duration: command.value * 1000, label: `Hovering for ${command.value} second${command.value === 1 ? "" : "s"}` });
  }
  return queue;
}

function getNextPosition(drone, command) {
  const next = { x: drone.x, y: drone.y };
  if (command.name === "moveUp") next.y -= command.value;
  if (command.name === "moveDown") next.y += command.value;
  if (command.name === "moveLeft") next.x -= command.value;
  if (command.name === "moveRight") next.x += command.value;
  return next;
}

function ensureSafePosition(x, y, line) {
  const margin = 30;
  if (x < margin || x > canvas.width - margin || y < margin || y > canvas.height - margin) {
    throw new Error(`Line ${line}: that move exits the mission flight area.`);
  }
}

function startProgram() {
  if (!isStudentUser()) {
    updateFeedback("Sign in with a student account to run missions and save progress.", "Login Required", "chip-bad");
    return;
  }
  try {
    ensureAudioContext();
    const parsedProgram = parseProgram(codeEditor.value);
    state.animationQueue = buildAnimationQueue(parsedProgram.commands);
    state.drone = getInitialDrone();
    state.currentStep = null;
    state.lastTime = 0;
    state.playing = true;
    state.visitedCheckpoints = new Set();
    state.collectedSamples = new Set();
    state.collectedLandSamples = new Set();
    state.capturedPhotos = new Set();
    state.trail = [{ x: state.drone.x, y: state.drone.y }];
    state.currentMissionSuccess = false;
    state.lastSpokenProgressAt = 0;
    state.lastSpokenProgressMessage = "";
    state.flightLog = [
      `Mission started with ${parsedProgram.commands.length} programmed command${parsedProgram.commands.length === 1 ? "" : "s"}.`,
      `Current goal: ${getMission().objective}`,
    ];
    renderCommandPreview(parsedProgram.commands);
    updateHud();
    renderMissionPanel();
    renderFlightLog();
    playSoundCue("start");
    speakMessage(`Mission started. ${getMission().objective}`, true);
    updateFeedback("Program accepted. The mission simulation is running.", "Running", "chip-warn");
  } catch (error) {
    state.playing = false;
    state.animationQueue = [];
    state.currentStep = null;
    state.currentMissionSuccess = false;
    renderMissionPanel();
    addFlightLog(`Program error: ${error.message}`, true, true);
    updateFeedback(error.message, "Error", "chip-bad");
  }
}

function stepAnimation(timestamp) {
  if (!state.lastTime) state.lastTime = timestamp;
  const delta = timestamp - state.lastTime;
  state.lastTime = timestamp;

  if (state.drone?.sampleFlashMs > 0) {
    state.drone.sampleFlashMs = Math.max(0, state.drone.sampleFlashMs - delta);
  }
  if (state.drone?.photoFlashMs > 0) {
    state.drone.photoFlashMs = Math.max(0, state.drone.photoFlashMs - delta);
  }

  if (state.playing) {
    if (!state.currentStep && state.animationQueue.length) {
      const nextStep = state.animationQueue.shift();
      if (nextStep.type === "altitude" && nextStep.targetAltitude > 0) {
        state.drone.airborne = true;
      }
      state.currentStep = { ...nextStep, elapsed: 0, startX: state.drone.x, startY: state.drone.y, startAltitude: state.drone.altitude, startHeading: state.drone.heading };
      addFlightLog(`Executing ${nextStep.label}.`, true, true);
      updateFeedback(`Executing: ${nextStep.label}`, "Running", "chip-warn");
    }

    if (state.currentStep) {
      state.currentStep.elapsed += delta;
      const progress = Math.min(state.currentStep.elapsed / state.currentStep.duration, 1);
      applyAnimationStep(state.currentStep, progress);
      if (detectNoFlyCollision()) {
        crashDrone();
        drawScene(timestamp);
        requestAnimationFrame(stepAnimation);
        return;
      }
      detectCheckpointHits();
      updateHud();
      if (timestamp - state.lastSpokenProgressAt > 2600) {
        const progressMessage = `In flight. ${describeDroneLocation()} ${state.drone.airborne ? `Altitude ${state.drone.altitude.toFixed(1)} metres.` : "Landed."} Current coordinates ${formatCoordinates(state.drone.x, state.drone.y)}.`;
        if (progressMessage !== state.lastSpokenProgressMessage) {
          speakMessage(progressMessage, false);
          state.lastSpokenProgressMessage = progressMessage;
        }
        state.lastSpokenProgressAt = timestamp;
      }
      if (progress >= 1) {
        finalizeStep(state.currentStep);
        state.currentStep = null;
      }
    } else if (!state.animationQueue.length) {
      state.playing = false;
      state.currentMissionSuccess = evaluateMissionSuccess();
      if (state.currentMissionSuccess) {
        recordMissionCompletion();
      }
      renderMissionPanel();
      addFlightLog(
        state.currentMissionSuccess
          ? "Mission complete. All objectives were met and the drone finished safely on the launch pad."
          : "Mission finished, but some objectives are still incomplete.",
        true,
        true
      );
      playSoundCue(state.currentMissionSuccess ? "success" : "reset");
      updateFeedback(
        state.currentMissionSuccess
          ? "Mission complete. The storyline can continue to the next challenge."
          : "Mission finished, but some objectives are still incomplete. Try refining the code.",
        state.currentMissionSuccess ? "Success" : "Finished",
        state.currentMissionSuccess ? "chip-good" : "chip-calm"
      );
    }
  }

  drawScene(timestamp);
  requestAnimationFrame(stepAnimation);
}

function applyAnimationStep(step, progress) {
  if (step.type === "move") {
    state.drone.x = lerp(step.startX, step.targetX, progress);
    state.drone.y = lerp(step.startY, step.targetY, progress);
  }
  if (step.type === "altitude") {
    state.drone.altitude = lerp(step.startAltitude, step.targetAltitude, progress);
  }
  if (step.type === "rotate") {
    const shortestTurn = getShortestTurn(step.startHeading, step.targetHeading);
    state.drone.heading = normalizeDegrees(step.startHeading + shortestTurn * progress);
  }
  if (step.type === "move" || step.type === "altitude") {
    const lastPoint = state.trail[state.trail.length - 1];
    if (!lastPoint || Math.hypot(lastPoint.x - state.drone.x, lastPoint.y - state.drone.y) > 8) {
      state.trail.push({ x: state.drone.x, y: state.drone.y });
    }
  }
}

function finalizeStep(step) {
  if (step.type === "move") {
    state.drone.x = step.targetX;
    state.drone.y = step.targetY;
    addFlightLog(`${step.label} complete. ${describeDroneLocation()} Current coordinates ${formatCoordinates(state.drone.x, state.drone.y)}.`, false, true);
    playSoundCue("move");
  }
  if (step.type === "altitude") {
    state.drone.altitude = step.targetAltitude;
    state.drone.airborne = step.targetAltitude > 0;
    addFlightLog(
      step.targetAltitude > 0
        ? `Take-off complete. The drone is airborne at ${formatCoordinates(state.drone.x, state.drone.y)}.`
        : `Landing complete. The drone is on the ground at ${formatCoordinates(state.drone.x, state.drone.y)}.`,
      false,
      true
    );
  }
  if (step.type === "rotate") {
    state.drone.heading = step.targetHeading;
    addFlightLog(`Rotation complete. Heading is now ${normalizeDegrees(step.targetHeading)} degrees at ${formatCoordinates(state.drone.x, state.drone.y)}.`, false, true);
  }
  if (step.type === "sample") {
    state.collectedSamples.add(step.sampleLabel);
    state.drone.sampleFlashMs = 2000;
    addFlightLog(`${step.sampleLabel} collected successfully at ${formatCoordinates(state.drone.x, state.drone.y)}.`, true, true);
    playSoundCue("sample");
  }
  if (step.type === "landSample") {
    state.collectedLandSamples.add(step.sampleLabel);
    state.drone.sampleFlashMs = 2000;
    addFlightLog(`${step.sampleLabel} collected successfully at ${formatCoordinates(state.drone.x, state.drone.y)}.`, true, true);
    playSoundCue("sample");
  }
  if (step.type === "photo") {
    state.capturedPhotos.add(step.photoLabel);
    state.drone.photoFlashMs = 1200;
    addFlightLog(`${step.photoLabel} captured at ${formatCoordinates(state.drone.x, state.drone.y)}.`, true, true);
    playSoundCue("checkpoint");
  }
  detectCheckpointHits();
  updateHud();
  renderMissionPanel();
}

function detectCheckpointHits() {
  const newlyReached = [];
  getMission().checkpoints.forEach((checkpoint) => {
    const distance = Math.hypot(state.drone.x - checkpoint.x, state.drone.y - checkpoint.y);
    if (state.drone.airborne && distance <= checkpoint.radius + 16 && !state.visitedCheckpoints.has(checkpoint.id)) {
      state.visitedCheckpoints.add(checkpoint.id);
      newlyReached.push(checkpoint.name);
    }
  });
  newlyReached.forEach((name) => {
    addFlightLog(`Checkpoint reached: ${name} at ${formatCoordinates(state.drone.x, state.drone.y)}.`, true, true);
    playSoundCue("checkpoint");
  });
  renderMissionPanel();
}

function detectNoFlyCollision() {
  return getMission().noFlyZones.some((zone) =>
    state.drone.x > zone.x &&
    state.drone.x < zone.x + zone.width &&
    state.drone.y > zone.y &&
    state.drone.y < zone.y + zone.height
  );
}

function crashDrone() {
  state.playing = false;
  state.animationQueue = [];
  state.currentStep = null;
  state.currentMissionSuccess = false;
  state.visitedCheckpoints = new Set();
  state.collectedSamples = new Set();
  state.collectedLandSamples = new Set();
  state.capturedPhotos = new Set();
  state.trail = [];
  state.drone = getInitialDrone();
  state.lastTime = 0;
  state.lastSpokenProgressAt = 0;
  state.lastSpokenProgressMessage = "";
  addFlightLog("Crash detected in a no-fly zone. The drone has been returned to the launch pad.", true, true);
  playSoundCue("crash");
  updateHud();
  renderMissionPanel();
  updateFeedback("The drone crashed in a no-fly zone and restarted at the launch pad. Adjust the code and try again.", "Crash", "chip-bad");
}

function evaluateMissionSuccess() {
  const allVisited = getMission().checkpoints.every((checkpoint) => state.visitedCheckpoints.has(checkpoint.id));
  const allSamplesCollected = (getMission().sampleRequirements ?? []).every((sample) => state.collectedSamples.has(sample.label));
  const allPhotosCaptured = getMissionPhotoRequirements().every((photo) => state.capturedPhotos.has(photo.label));
  const allLandSamplesCollected = getMissionLandSampleRequirements().every((sample) => state.collectedLandSamples.has(sample.label));
  return allVisited && allSamplesCollected && allPhotosCaptured && allLandSamplesCollected && isOnLaunchPad() && !state.drone.airborne && state.drone.altitude === 0;
}

function isOnLaunchPad() {
  return isOnLaunchPadPosition(state.drone.x, state.drone.y);
}

function isOnLaunchPadPosition(x, y) {
  const pad = getMission().launchPad;
  return x >= pad.x && x <= pad.x + pad.width && y >= pad.y && y <= pad.y + pad.height;
}

function drawScene(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawGrid();
  drawDecorations(timestamp);
  drawColorZones();
  drawNoFlyZones();
  drawLaunchPad();
  drawCheckpoints(timestamp);
  drawFlightTrail();
  drawDrone(timestamp);
}

function drawBackground() {
  const sky = getCampaign().sky;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, sky[0]);
  gradient.addColorStop(0.42, sky[1]);
  gradient.addColorStop(0.43, sky[2]);
  gradient.addColorStop(1, sky[3]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawDecorations(timestamp) {
  getMission().decorations.forEach((decoration, index) => {
    if (decoration.type === "cloud") drawCloud(decoration.x, decoration.y, decoration.size, timestamp / 900 + index);
    if (decoration.type === "hangar") drawHangar(decoration);
    if (decoration.type === "ship") drawShip(decoration);
    if (decoration.type === "mountain") drawMountain(decoration);
    if (decoration.type === "river") drawRiver(decoration);
    if (decoration.type === "stars") drawStars(decoration.density);
    if (decoration.type === "lightning") drawLightning(decoration.x, decoration.y, timestamp / 160 + index);
    if (decoration.type === "platform") drawPlatform(decoration);
  });
}

function drawCloud(x, y, scale, drift) {
  const offset = Math.sin(drift) * 10;
  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.beginPath();
  ctx.arc(x + offset, y, 24 * scale, 0, Math.PI * 2);
  ctx.arc(x + 28 * scale + offset, y - 10 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 52 * scale + offset, y, 24 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawHangar({ x, y, width, height }) {
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#9fe7ff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}

function drawShip({ x, y, width, height }) {
  ctx.fillStyle = "rgba(89, 215, 255, 0.2)";
  ctx.fillRect(x, y, width, height);
  ctx.beginPath();
  ctx.moveTo(x + 20, y + height);
  ctx.lineTo(x + width - 15, y + height);
  ctx.lineTo(x + width - 40, y + height + 18);
  ctx.lineTo(x + 35, y + height + 18);
  ctx.closePath();
  ctx.fill();
}

function drawMountain({ x, y, width, height }) {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width / 2, y - height);
  ctx.lineTo(x + width, y);
  ctx.closePath();
  ctx.fill();
}

function drawRiver({ x, y, width, height }) {
  ctx.fillStyle = "rgba(120, 208, 255, 0.18)";
  ctx.fillRect(x, y, width, height);
}

function drawStars(density) {
  for (let index = 0; index < density; index += 1) {
    const x = (index * 47) % canvas.width;
    const y = (index * 73) % 240;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillRect(x, y, 2, 2);
  }
}

function drawLightning(x, y, phase) {
  if (Math.sin(phase) <= 0.6) return;
  ctx.strokeStyle = "rgba(255, 239, 123, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 15, y + 30);
  ctx.lineTo(x - 4, y + 30);
  ctx.lineTo(x + 10, y + 58);
  ctx.stroke();
}

function drawPlatform({ x, y, width, height }) {
  ctx.fillStyle = "rgba(255, 215, 168, 0.18)";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#ffd7a8";
  ctx.strokeRect(x, y, width, height);
}

function drawNoFlyZones() {
  getMission().noFlyZones.forEach((zone) => {
    ctx.fillStyle = "rgba(255, 123, 123, 0.18)";
    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
    ctx.strokeStyle = "#ff7b7b";
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
    ctx.fillStyle = "#ffe7e7";
    ctx.font = "700 14px Chakra Petch";
    ctx.fillText(zone.label.toUpperCase(), zone.x + 10, zone.y + 24);
  });
}

function drawColorZones() {
  getMissionColorZones().forEach((zone) => {
    ctx.fillStyle = zone.fill;
    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
    ctx.strokeStyle = zone.stroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
    ctx.fillStyle = "#eef8ff";
    ctx.font = "700 13px Chakra Petch";
    ctx.fillText(zone.label.toUpperCase(), zone.x + 8, zone.y + 22);
  });
}

function drawLaunchPad() {
  const pad = getMission().launchPad;
  ctx.fillStyle = "rgba(89, 215, 255, 0.18)";
  ctx.fillRect(pad.x, pad.y, pad.width, pad.height);
  ctx.strokeStyle = getCampaign().droneColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(pad.x, pad.y, pad.width, pad.height);
  ctx.fillStyle = "#eff9ff";
  ctx.font = "700 18px Chakra Petch";
  ctx.fillText("PAD", pad.x + 34, pad.y + 34);
}

function drawCheckpoints(timestamp) {
  getMission().checkpoints.forEach((checkpoint, index) => {
    const pulse = 1 + Math.sin(timestamp / 280 + index) * 0.12;
    const complete = state.visitedCheckpoints.has(checkpoint.id);
    ctx.beginPath();
    ctx.fillStyle = complete ? "rgba(173, 247, 111, 0.22)" : "rgba(255,255,255,0.08)";
    ctx.arc(checkpoint.x, checkpoint.y, checkpoint.radius * pulse + 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = complete ? getCampaign().rotorColor : "#eff9ff";
    ctx.arc(checkpoint.x, checkpoint.y, checkpoint.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#09161e";
    ctx.font = "700 15px Chakra Petch";
    ctx.fillText(String(index + 1), checkpoint.x - 5, checkpoint.y + 5);
  });
}

function drawFlightTrail() {
  if (state.trail.length < 2) return;
  ctx.beginPath();
  ctx.strokeStyle = "rgba(89, 215, 255, 0.28)";
  ctx.lineWidth = 2;
  ctx.moveTo(state.trail[0].x, state.trail[0].y);
  state.trail.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.stroke();
}

function drawDrone(timestamp) {
  const bob = state.drone.airborne ? Math.sin(timestamp / 120) * 4 : 0;
  const rotorSpin = timestamp / 28;
  const campaign = getCampaign();
  ctx.save();
  ctx.translate(state.drone.x, state.drone.y - state.drone.altitude - bob);
  ctx.rotate((state.drone.heading * Math.PI) / 180);
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(0, state.drone.altitude + 38, 26, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = campaign.droneColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(28, 0);
  ctx.moveTo(0, -20);
  ctx.lineTo(0, 20);
  ctx.stroke();
  ctx.fillStyle = campaign.droneColor;
  roundedRect(-24, -14, 48, 28, 10);
  ctx.fill();
  ctx.fillStyle = state.drone.sampleFlashMs > 0 ? "#74e26f" : "#eff9ff";
  roundedRect(-12, -8, 24, 16, 6);
  ctx.fill();
  drawRotor(-28, -20, rotorSpin, campaign.rotorColor);
  drawRotor(28, -20, rotorSpin, campaign.rotorColor);
  drawRotor(-28, 20, rotorSpin, campaign.rotorColor);
  drawRotor(28, 20, rotorSpin, campaign.rotorColor);
  ctx.strokeStyle = "#d4f7ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, 18);
  ctx.lineTo(-10, 28);
  ctx.lineTo(10, 28);
  ctx.lineTo(18, 18);
  ctx.stroke();
  ctx.restore();
}

function drawRotor(x, y, spin, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.lineTo(16, 0);
  ctx.moveTo(0, -16);
  ctx.lineTo(0, 16);
  ctx.stroke();
  ctx.restore();
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function normalizeDegrees(value) {
  return ((Math.round(value) % 360) + 360) % 360;
}

function getShortestTurn(start, end) {
  let diff = normalizeDegrees(end) - normalizeDegrees(start);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

runButton.addEventListener("click", startProgram);
resetButton.addEventListener("click", resetDrone);
exampleButton.addEventListener("click", () => {
  if (state.missionIndex !== 0) {
    updateFeedback("Example code is only available for Mission 1 of each flight level. Use the mission objectives to plan this one yourself.", "Plan It", "chip-calm");
    return;
  }
  loadMissionEditor();
  updateFeedback("Mission example loaded into the editor.", "Example", "chip-calm");
});
prevMissionButton.addEventListener("click", () => loadMission(state.missionIndex - 1));
nextMissionButton.addEventListener("click", () => loadMission(state.missionIndex + 1));
pathButtons.forEach((button) => button.addEventListener("click", () => applyLevel(button.dataset.level)));
showLoginButton.addEventListener("click", () => setAuthMode("login"));
showRegisterButton.addEventListener("click", () => setAuthMode("register"));
selectStudentButton.addEventListener("click", () => setAuthKind("student"));
selectTeacherButton.addEventListener("click", () => setAuthKind("teacher"));
authSubmitButton.addEventListener("click", handleAuthSubmit);
logoutButton.addEventListener("click", logoutCurrentUser);
teacherPasswordButton.addEventListener("click", changeTeacherPassword);
teacherStudentSelect.addEventListener("change", () => {
  state.selectedTeacherStudentEmail = teacherStudentSelect.value;
  renderTeacherDashboard();
});
studentMissionSelect.addEventListener("change", () => {
  state.selectedStudentMissionKey = studentMissionSelect.value;
  switchStudentMissionByKey(studentMissionSelect.value);
});
printCertificateButton.addEventListener("click", () => {
  window.print();
});
voiceToggleButton.addEventListener("click", () => {
  state.voiceGuidanceEnabled = !state.voiceGuidanceEnabled;
  ensureAudioContext();
  saveAccessibilityPreferences();
  updateAudioControls();
  if (!state.voiceGuidanceEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  if (state.voiceGuidanceEnabled) {
    speakMessage("Voice guidance enabled.", true);
  }
});
soundToggleButton.addEventListener("click", () => {
  state.soundEffectsEnabled = !state.soundEffectsEnabled;
  ensureAudioContext();
  saveAccessibilityPreferences();
  updateAudioControls();
  if (state.soundEffectsEnabled) {
    playSoundCue("start");
  }
});
speakPositionButton.addEventListener("click", () => {
  ensureAudioContext();
  speakCurrentPosition(true);
});
speakMissionDescriptionButton.addEventListener("click", () => {
  ensureAudioContext();
  speakMissionDescription();
});
speakCommandGuideButton.addEventListener("click", () => {
  ensureAudioContext();
  speakCommandGuide();
});
speakMissionMapButton.addEventListener("click", () => {
  ensureAudioContext();
  speakMissionAudioMap();
});

loadAccounts();
loadAccessibilityPreferences();
loadSession();
setAuthMode("login");
setAuthKind("student");
refreshAuthUi();
if (isStudentUser()) {
  refreshStudentWorkspace();
} else {
  applyLevel("cadet");
}
updateAudioControls();
drawScene(0);
requestAnimationFrame(stepAnimation);
