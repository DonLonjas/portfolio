            document.getElementById('copy-email').addEventListener('click', function(e) {
                e.preventDefault();
                const email = 'contacto@lonjas.site';
                navigator.clipboard.writeText(email).then(function() {
                    const alert = document.getElementById('copy-alert');
                    alert.style.display = 'block';
                    setTimeout(() => { alert.style.display = 'none'; }, 1800);
                });
            });

            i=0
            const names = ["Andres Lancheros", "MrLonjas" ];
            const nameEl = document.getElementById('name');
            setInterval(() => {
            nameEl.classList.add('fade');
            setTimeout(() => {
                // Cambia el texto cuando está invisible
                nameEl.textContent = names[i % names.length];
                i++;
                // Quita la clase para permitir la próxima animación
                nameEl.classList.remove('fade');
            }, 300); // 300ms coincide con el punto de opacidad 0
            }, 2500);