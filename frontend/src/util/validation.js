
export const validateEmail = (email) => {
    // If the email is empty or not provided, it's considered invalid.
    if (email.trim()) { 
       const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       return regex.test(email);
    }
    return false;
};
