// Format date labels with year included
export const formatDateLabels = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric' // Always include year
    });
};



// Format for bar chart if needed
export const formatBarLabels = () => {
    return ['Infected', 'Recovered', 'Deaths'];
};

// Scroll to top function
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
