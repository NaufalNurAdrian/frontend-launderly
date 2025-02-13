  export const calculateTimeDifference = (createdAt: string) => {
    const now = new Date(); 
    const createdDate = new Date(createdAt); 
  
    const timeDifference = now.getTime() - createdDate.getTime();
  
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(minutesDifference / 60);
  
    if (hoursDifference > 0) {
      return `${hoursDifference} hours ago`;
    } else {
      return `${minutesDifference} minutes ago`;
    }
  };