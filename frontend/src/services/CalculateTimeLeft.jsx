function CalculateTimeLeft(dateMariage) {
        if (!dateMariage) return {};

        const weddingDate = new Date(dateMariage);
        const now = new Date();
        const difference = weddingDate - now;
    
        let timeLeft = {};
    
        if (difference > 0) {
          timeLeft = {
            jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
            heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            secondes: Math.floor((difference / 1000) % 60),
          };
        }
    
        return timeLeft;
      }

export default CalculateTimeLeft