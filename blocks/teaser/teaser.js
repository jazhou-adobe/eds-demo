import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Add teaser-image class to image container div
  const imageDiv = block.querySelector('div > div:first-child');
  if (imageDiv) {
    imageDiv.classList.add('teaser-image');
      // Optimize images
    imageDiv.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1360' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  }

  // Add teaser-content class to content container div 
  const contentDiv = block.querySelector('div:nth-child(2) > div');
  if (contentDiv) {
    contentDiv.classList.add('teaser-content');
  }

  // Add teaser-navlist class to navigation list container div
  const navListDiv = block.querySelector('div:nth-child(3) > div');
  if (navListDiv) {
    navListDiv.classList.add('teaser-navlist');
  }

}
