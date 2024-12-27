class PhotoStack {
  constructor(container) {
    this.container = container;
    this.photos = container.querySelectorAll('img');
    this.highestZ = this.photos.length;
    this.initializePhotos();
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  initializePhotos() {
    this.photos.forEach((photo, index) => {
      this.positionPhoto(photo, index);
      this.setupDragListeners(photo);
    });
  }

  positionPhoto(photo, index) {
    const bounds = this.container.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const radius = Math.min(bounds.width, bounds.height) * 0.25;
    
    const angle = (index / this.photos.length) * 2 * Math.PI;
    const distance = radius * (0.6 + Math.random() * 0.4);
    
    const baseX = centerX + Math.cos(angle) * distance - 125;
    const baseY = centerY + Math.sin(angle) * distance - 125;
    
    const randomX = baseX + (Math.random() - 0.5) * 50;
    const randomY = baseY + (Math.random() - 0.5) * 50;
    const randomRotate = Math.random() * 30 - 15;
    
    photo.style.left = `${randomX}px`;
    photo.style.top = `${randomY}px`;
    photo.style.transform = `rotate(${randomRotate}deg)`;
    photo.style.zIndex = index;
  }

  handleResize() {
    this.photos.forEach((photo, index) => {
      this.positionPhoto(photo, index);
    });
  }

  setupDragListeners(photo) {
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
      const style = window.getComputedStyle(photo);
      const matrix = new DOMMatrix(style.transform);
      const currentLeft = parseInt(photo.style.left) || 0;
      const currentTop = parseInt(photo.style.top) || 0;

      initialX = position.x - currentLeft;
      initialY = position.y - currentTop;
      
      if (e.target === photo) {
        isDragging = true;
        this.highestZ++;
        photo.style.zIndex = this.highestZ;
        photo.classList.add('dragging');
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
        
        currentX = Math.max(-padding, Math.min(bounds.width - photo.offsetWidth + padding, currentX));
        currentY = Math.max(-padding, Math.min(bounds.height - photo.offsetHeight + padding, currentY));

        photo.style.left = `${currentX}px`;
        photo.style.top = `${currentY}px`;
      }
    };

    const dragEnd = (e) => {
      if (isDragging) {
        isDragging = false;
        initialX = currentX;
        initialY = currentY;
        photo.classList.remove('dragging');
      }
    };

    // Mouse events
    photo.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragEnd);

    // Touch events
    photo.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('touchcancel', dragEnd);
  }
}

// Initialize photostack
document.addEventListener('DOMContentLoaded', () => {
  const photoStack = new PhotoStack(document.querySelector('.photo-stack'));
}); 