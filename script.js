// Constants
const totalFloors = 10;
const roomsPerFloor = 10;
const topFloorRooms = 7;

// DOM Elements
const floorContainer = document.getElementById("floorContainer");
const roomCountInput = document.getElementById("roomCount");
const bookButton = document.getElementById("bookButton");
const resetButton = document.getElementById("resetButton");
const randomButton = document.getElementById("randomButton");

// State
let rooms = [];

// Initialize Hotel Layout
function initHotel() {
    floorContainer.innerHTML = "";
    rooms = [];

    for (let floor = 1; floor <= totalFloors; floor++) {
        const roomsOnThisFloor = floor === totalFloors ? topFloorRooms : roomsPerFloor;
        const floorRooms = [];

        for (let room = 1; room <= roomsOnThisFloor; room++) {
            const roomNumber = `${floor}${room.toString().padStart(2, "0")}`;
            const roomDiv = document.createElement("div");
            roomDiv.className = "room";
            roomDiv.innerText = roomNumber;
            roomDiv.dataset.roomNumber = roomNumber;
            floorContainer.appendChild(roomDiv);
            floorRooms.push({ roomNumber, occupied: false, element: roomDiv });
        }

        rooms.push(floorRooms);
    }
}

// Randomize Room Occupancy
function randomizeRooms() {
    rooms.flat().forEach(room => {
        room.occupied = Math.random() < 0.3; // 30% chance of being occupied
        room.element.classList.toggle("occupied", room.occupied);
    });
}

// Reset All Rooms
function resetRooms() {
    rooms.flat().forEach(room => {
        room.occupied = false;
        room.element.classList.remove("occupied", "selected");
    });
}

// Book Rooms
function bookRooms() {
    const numRoomsToBook = parseInt(roomCountInput.value, 10);
    if (isNaN(numRoomsToBook) || numRoomsToBook < 1 || numRoomsToBook > 5) {
        alert("Enter a valid number of rooms (1-5).");
        return;
    }

    const availableRooms = rooms.flat().filter(room => !room.occupied);
    if (availableRooms.length < numRoomsToBook) {
        alert("Not enough rooms available!");
        return;
    }

    // Booking Logic: Priority to same floor, minimal travel time
    let bestRooms = [];
    let bestTravelTime = Infinity;

    rooms.forEach(floor => {
        for (let i = 0; i <= floor.length - numRoomsToBook; i++) {
            const candidateRooms = floor.slice(i, i + numRoomsToBook);
            if (candidateRooms.every(room => !room.occupied)) {
                const travelTime = numRoomsToBook - 1; // Horizontal travel time
                if (travelTime < bestTravelTime) {
                    bestRooms = candidateRooms;
                    bestTravelTime = travelTime;
                }
            }
        }
    });

    if (bestRooms.length < numRoomsToBook) {
        // Span across floors
        const flatRooms = rooms.flat().filter(room => !room.occupied);
        bestRooms = flatRooms.slice(0, numRoomsToBook); // Fallback option
    }

    // Mark rooms as booked
    bestRooms.forEach(room => {
        room.occupied = true;
        room.element.classList.add("selected");
    });
}

// Event Listeners
bookButton.addEventListener("click", bookRooms);
resetButton.addEventListener("click", resetRooms);
randomButton.addEventListener("click", randomizeRooms);

// Initialize
initHotel();
