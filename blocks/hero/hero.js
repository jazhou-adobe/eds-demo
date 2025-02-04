import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* Rearrange and add classes to match hero-result.html structure */
  const textDiv = document.createElement('div');
  textDiv.className = 'hero-text';
  const imageDiv = document.createElement('div');
  imageDiv.className = 'hero-image';

  [...block.children].forEach((row) => {
    const innerDiv = row.firstElementChild;
    if (innerDiv.querySelector('picture')) {
      // Handle image section
      moveInstrumentation(row, imageDiv);
      while (row.firstElementChild) imageDiv.append(row.firstElementChild);
    } else {
      // Handle text section
      moveInstrumentation(row, textDiv);
      while (row.firstElementChild) textDiv.append(row.firstElementChild);
      
      // Add classes to text elements
      const h1 = textDiv.querySelector('h1');
      if (h1) h1.className = 'hero-title';
      
      const p = textDiv.querySelector('p');
      if (p) p.className = 'hero-description';
      
      const h3 = textDiv.querySelector('h3');
      if (h3) h3.className = 'hero-link';
    }
  });

  // Optimize images
  imageDiv.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1170' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(textDiv, imageDiv);
}
