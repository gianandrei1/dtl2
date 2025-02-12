const carousel = document.querySelector(".carousel");
const firstImg = carousel.querySelectorAll("img")[0];
const arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false, prevPageX, prevScrollLeft;
let firstImgWidth = firstImg.clientWidth + 400;


// Function to show/hide arrows based on scroll position
const showHideIcons = () => {
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth; // Recalculate scrollWidth
    const threshold = 1; // Small threshold for floating-point precision

    // Hide left arrow if at the start, else show it
    arrowIcons[0].style.display = carousel.scrollLeft <= threshold ? "none" : "block";

    // Hide right arrow if at the end, else show it
    arrowIcons[1].style.display = carousel.scrollLeft >= scrollWidth - threshold ? "none" : "block";
};

// Prevent text selection during dragging
document.addEventListener("selectstart", (e) => e.preventDefault());

// Button click handling
arrowIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default behavior
        let direction = icon.id === "left" ? -1 : 1;
        carousel.scrollBy({ left: firstImgWidth * direction, behavior: "smooth" });
        setTimeout(showHideIcons, 500); // Update arrow visibility immediately
    });
});

// Dragging functionality
const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX; // Support touch events
    prevScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
    if (!isDragStart) return;
    e.preventDefault();
    carousel.classList.add("dragging");
    let positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX; // Support touch events
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons(); // Update arrow visibility during dragging
};

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");
};

// Prevent image dragging
carousel.querySelectorAll("img").forEach(img => img.setAttribute("draggable", false));

// Debounced scroll event listener
let isScrolling;
carousel.addEventListener("scroll", () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => showHideIcons(), 100); // Adjust delay as needed
});

// Add event listeners
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("mouseleave", dragStop);

// Touch event listeners for mobile support
carousel.addEventListener("touchstart", dragStart);
carousel.addEventListener("touchmove", dragging);
carousel.addEventListener("touchend", dragStop);
carousel.addEventListener("touchleave", dragStop);

// Initial call to set arrow visibility
showHideIcons();