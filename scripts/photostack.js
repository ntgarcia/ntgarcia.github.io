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

    const dragStart = (e) => {
      initialX = e.clientX - photo.offsetLeft;
      initialY = e.clientY - photo.offsetTop;
      
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
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        const bounds = this.container.getBoundingClientRect();
        const padding = 50;
        
        currentX = Math.max(-padding, Math.min(bounds.width - photo.offsetWidth + padding, currentX));
        currentY = Math.max(-padding, Math.min(bounds.height - photo.offsetHeight + padding, currentY));

        photo.style.left = `${currentX}px`;
        photo.style.top = `${currentY}px`;
      }
    };

    const dragEnd = () => {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
      photo.classList.remove('dragging');
    };

    photo.addEventListener('mousedown', dragStart);
    photo.addEventListener('mousemove', drag);
    photo.addEventListener('mouseup', dragEnd);
    photo.addEventListener('mouseleave', dragEnd);
  }
}

// Initialize photostack
document.addEventListener('DOMContentLoaded', () => {
  const photoStack = new PhotoStack(document.querySelector('.photo-stack'));
}); 