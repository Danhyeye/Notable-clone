export function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope: ', registration.scope);
                })
                .catch(error => {
                    console.error('Failed to register Service Worker: ', error);
                });
        });
    } else {
        console.log('Service Worker is not supported in this browser.');
    }
}