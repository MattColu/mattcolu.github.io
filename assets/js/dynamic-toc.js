// Adapted from https://www.freecodecamp.org/news/how-to-make-a-dynamic-table-of-contents-in-javascript/

const tocElement = document.getElementById("markdown-toc");
if (tocElement) {
    const tocHeaders = [...tocElement.getElementsByTagName("li")];
    const textHeaders = tocHeaders.map(header => document.getElementById(header.firstChild.getAttribute("href").substring(1)));
    
    const handleIntersect = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = textHeaders.indexOf(entry.target);
                tocHeaders.forEach((elem) => {
                    elem.firstChild.classList.remove("active");
                });
                tocHeaders[index].firstChild.classList.add("active");
            }
        });
    };
    
    const observer = new IntersectionObserver(handleIntersect, {rootMargin: "50% 0px -50%", threshold: 1.0});
    textHeaders.forEach(elem => observer.observe(elem));
}
