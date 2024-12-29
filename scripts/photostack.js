class PhotoStack {
  constructor(container) {
    this.container = container;
    this.photoCards = container.querySelectorAll('.photo-card');
    this.highestZ = this.photoCards.length;
    this.initializePhotos();
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  initializePhotos() {
    this.photoCards.forEach((photoCard, index) => {
      this.positionPhoto(photoCard, index);
      this.setupDragListeners(photoCard);
    });
  }

  positionPhoto(photoCard, index) {
    const bounds = this.container.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const radius = Math.min(bounds.width, bounds.height) * 0.25;
    
    const angle = (index / this.photoCards.length) * 2 * Math.PI;
    const distance = radius * (0.6 + Math.random() * 0.4);
    
    const baseX = centerX + Math.cos(angle) * distance - 125;
    const baseY = centerY + Math.sin(angle) * distance - 125;
    
    const randomX = baseX + (Math.random() - 0.5) * 50;
    const randomY = baseY + (Math.random() - 0.5) * 50;
    const randomRotate = Math.random() * 30 - 15;
    
    photoCard.style.left = `${randomX}px`;
    photoCard.style.top = `${randomY}px`;
    photoCard.style.transform = `rotate(${randomRotate}deg)`;
    photoCard.style.zIndex = index;
  }

  handleResize() {
    this.photoCards.forEach((photoCard, index) => {
      this.positionPhoto(photoCard, index);
    });
  }

  setupDragListeners(photoCard) {
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    const getPosition = (event) => {
      // Return coordinates for both touch and mouse events
      if (event.touches && event.touches.length > 0) {
        return {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }
      return {
        x: event.clientX,
        y: event.clientY
      };
    };

    const dragStart = (e) => {
      const position = getPosition(e);
      
      // Get the current transform values
      const style = window.getComputedStyle(photoCard);
      const matrix = new DOMMatrix(style.transform);
      const currentLeft = parseInt(photoCard.style.left) || 0;
      const currentTop = parseInt(photoCard.style.top) || 0;

      initialX = position.x - currentLeft;
      initialY = position.y - currentTop;
      
      // Check if clicked on the image or card area (not the title)
      if (!e.target.closest('.photo-title')) {
        isDragging = true;
        this.highestZ++;
        photoCard.style.zIndex = this.highestZ;
        photoCard.classList.add('dragging');
      }
    };

    const drag = (e) => {
      if (isDragging) {
        e.preventDefault();
        const position = getPosition(e);
        
        currentX = position.x - initialX;
        currentY = position.y - initialY;

        const bounds = this.container.getBoundingClientRect();
        const padding = 50;
        
        currentX = Math.max(-padding, Math.min(bounds.width - photoCard.offsetWidth + padding, currentX));
        currentY = Math.max(-padding, Math.min(bounds.height - photoCard.offsetHeight + padding, currentY));

        photoCard.style.left = `${currentX}px`;
        photoCard.style.top = `${currentY}px`;
      }
    };

    const dragEnd = (e) => {
      if (isDragging) {
        isDragging = false;
        initialX = currentX;
        initialY = currentY;
        photoCard.classList.remove('dragging');
      }
    };

    // Mouse events
    photoCard.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragEnd);

    // Touch events
    photoCard.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('touchcancel', dragEnd);
  }
}

// Initialize photostack
document.addEventListener('DOMContentLoaded', () => {
  const photoStack = new PhotoStack(document.querySelector('.photo-stack'));
}); 