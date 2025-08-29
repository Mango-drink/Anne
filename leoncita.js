// Año dinámico en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Descarga rápida a PDF (diálogo de impresión)
document.getElementById('btn-cv').addEventListener('click', () => {
    window.print();
});

// Scroll suave (fallback simple)
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
            e.preventDefault();
            const el = document.querySelector(id);
            if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }
    })
});
