document.addEventListener("DOMContentLoaded", function () {
    const conversions = {
        longitud: {
            Metro: 1,
            Kilómetro: 0.001,
            Centímetro: 100,
            Milímetro: 1000,
        },
        peso: {
            Kilogramo: 1,
            Gramo: 1000,
            Libra: 2.20462,
        },
        temperatura: {
            Celsius: {
                toCelsius: v => v,
                fromCelsius: v => v,
            },
            Fahrenheit: {
                toCelsius: v => (v - 32) * 5 / 9,
                fromCelsius: v => (v * 9 / 5) + 32,
            },
            Kelvin: {
                toCelsius: v => v - 273.15,
                fromCelsius: v => v + 273.15,
            },
        }
    };

    function convertir(tipo, from, to, valor) {
        if (tipo === 'temperatura') {
            if (!conversions[tipo][from] || !conversions[tipo][to]) return "Error";
            const celsius = conversions[tipo][from].toCelsius(parseFloat(valor));
            const resultado = conversions[tipo][to].fromCelsius(celsius);
            return isNaN(resultado) ? "Error" : resultado.toFixed(2);
        } else {
            const base = conversions[tipo][from];
            const target = conversions[tipo][to];
            return ((parseFloat(valor) / base) * target).toFixed(2);
        }
    }

    function guardarHistorial(tipo, historial) {
        localStorage.setItem(`${tipo}Historial`, JSON.stringify(historial));
    }

    function cargarHistorial(tipo) {
        const datos = localStorage.getItem(`${tipo}Historial`);
        return datos ? JSON.parse(datos) : [];
    }

    function renderizarHistorial(tipo, historial) {
        const lista = document.getElementById(`${tipo}Historial`);
        lista.innerHTML = "";
        historial.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            lista.appendChild(li);
        });
    }

    function agregarAlHistorial(tipo, entrada, salida) {
        let historial = cargarHistorial(tipo);
        historial.unshift(`${entrada} => ${salida}`);
        if (historial.length > 5) historial = historial.slice(0, 5);
        guardarHistorial(tipo, historial);
        renderizarHistorial(tipo, historial);
    }

    function mostrarError(mensaje) {
        let errorDiv = document.getElementById("mensajeError");
        if (!errorDiv) {
            errorDiv = document.createElement("div");
            errorDiv.id = "mensajeError";
            errorDiv.style.position = "fixed";
            errorDiv.style.bottom = "20px";
            errorDiv.style.right = "20px";
            errorDiv.style.backgroundColor = "#f44336";
            errorDiv.style.color = "white";
            errorDiv.style.padding = "10px 20px";
            errorDiv.style.borderRadius = "5px";
            errorDiv.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
            errorDiv.style.zIndex = 1000;
            document.body.appendChild(errorDiv);
        }
        errorDiv.textContent = mensaje;
        errorDiv.style.display = "block";

        setTimeout(() => {
            errorDiv.style.display = "none";
        }, 3000);
    }

    function agregarEvento(tipo) {
        const from = document.getElementById(`${tipo}From`);
        const to = document.getElementById(`${tipo}To`);
        const input = document.getElementById(`${tipo}Input`);
        const output = document.getElementById(`${tipo}Output`);
        const clearBtn = document.getElementById(`${tipo}ClearBtn`);

        renderizarHistorial(tipo, cargarHistorial(tipo));

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const valor = input.value;
                if (!valor || isNaN(valor)) {
                    output.textContent = "0";
                    mostrarError("Por favor ingresa un número válido.");
                    return;
                }

                const resultado = convertir(tipo, from.value, to.value, valor);
                output.textContent = resultado;
                agregarAlHistorial(tipo, `${valor} ${from.value}`, `${resultado} ${to.value}`);
            }
        });

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                localStorage.removeItem(`${tipo}Historial`);
                renderizarHistorial(tipo, []);
            });
        }
    }

    agregarEvento("longitud");
    agregarEvento("peso");
    agregarEvento("temperatura");
});
