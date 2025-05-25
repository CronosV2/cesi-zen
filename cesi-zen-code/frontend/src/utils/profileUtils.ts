/**
 * Déclenche le rafraîchissement des données du profil dans le BentoGrid
 * Utilisé après la completion d'exercices ou la mise à jour de données utilisateur
 */
export const refreshProfile = () => {
  window.dispatchEvent(new CustomEvent('refreshProfile'));
};

/**
 * Déclenche le rafraîchissement des données du profil avec un délai
 * Utile pour s'assurer que les données backend sont mises à jour
 */
export const refreshProfileDelayed = (delay: number = 500) => {
  setTimeout(() => {
    refreshProfile();
  }, delay);
}; 