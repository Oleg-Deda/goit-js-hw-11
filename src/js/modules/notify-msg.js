export const notifyInfoMessage = () => {
  return Notify.info(
    "We're sorry, but you've reached the end of search results.",
    {
      opacity: 1,
      position: 'center-center',
      timeout: 500,
      background: '#0c09db',
      backOverlay: true,
      cssAnimationDuration: 1000,
      backOverlayColor: 'rgba(0, 153, 255, 0.313)',
      cssAnimationStyle: 'zoom',
    }
  );
};

export const notifyInfoSearchMessage = () => {
  return Notify.info('Please fill the search field!', {
    opacity: 1,
    position: 'center-center',
    timeout: 1000,
    background: '#0c09db',
    backOverlay: true,
    cssAnimationDuration: 1000,
    backOverlayColor: 'rgba(0, 153, 255, 0.313)',
    cssAnimationStyle: 'fade',
  });
};
