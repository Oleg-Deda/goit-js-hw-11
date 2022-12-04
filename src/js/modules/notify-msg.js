import { Notify } from 'notiflix/build/notiflix-notify-aio';

export const notifyFailureMessage = () => {
  return Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      opacity: 0.8,
      position: 'right-top',
      timeout: 300,
      cssAnimationDuration: 1500,
      backOverlayColor: 'rgba(50,198,130,0.2)',
      cssAnimationStyle: 'zoom',
    }
  );
};

export const notifySuccessMessage = totalHits => {
  return Notify.success(`Hooray! We found ${totalHits} images.`, {
    opacity: 0.8,
    position: 'right-top',
    timeout: 300,
    cssAnimationDuration: 1500,
    backOverlayColor: 'rgba(255,85,73,0.2)',
    cssAnimationStyle: 'zoom',
  });
};

export const notifyInfoMessage = () => {
  return Notify.info(
    "We're sorry, but you've reached the end of search results.",
    {
      opacity: 1,
      position: 'center-center',
      timeout: 400,
      background: '#0c09db',
      backOverlay: true,
      cssAnimationDuration: 1000,
      backOverlayColor: 'rgba(0, 153, 255, 0.313)',
      cssAnimationStyle: 'zoom',
    }
  );
};
