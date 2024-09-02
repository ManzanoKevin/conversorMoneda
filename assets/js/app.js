const getApiMoneda = "https://mindicador.cl/api/";
const boton = document.getElementById('buscador');
let grafico;

// LLAMADO DATOS API
async function getMonedas() {
    try {
        const res = await fetch(getApiMoneda);
        const monedas = await res.json();
        return monedas;
    } catch (error) {
        alert('Error al obtener información tipo de cambio');
    }
}

// LLAMADO DATOS A SELECT
async function cargarSelect() {
    const selectOption = document.getElementById("conversor");
    try {
        const datos = await getMonedas();
        for (const iterador in datos) {
            if (typeof datos[iterador] === 'object') {
                const option = document.createElement("option");
                option.value = datos[iterador].valor;
                option.text = datos[iterador].codigo;
                selectOption.appendChild(option);
            }
        }
    } catch (error) {
        alert('Ingrese un monto válido');
    }
}

// FUNCIÓN PARA CALCULAR EL VALOR
async function resultado() {
    const selectOption = document.getElementById("conversor");
    const input = Number(document.getElementById('monto').value);
    const resultado = document.getElementById('total');
    const selectedValue = selectOption.options[selectOption.selectedIndex].value;

    if (input === 0) {
        alert('Ingrese una cifra a convertir');
    } else {
        const valorFinal = input / selectedValue;
        resultado.innerHTML = `Total: $${valorFinal.toFixed(2)}`;
    }
}

// CARGAR DATOS PARA EL GRÁFICO
async function cargarDatosSerie() {
    try {
        const selectOption = document.getElementById("conversor");
        const selectedText = selectOption.options[selectOption.selectedIndex].text;
        const url = `https://mindicador.cl/api/${selectedText}`;
        const res = await fetch(url);
        const datosDias = await res.json();
        return datosDias.serie.slice(0, 10).reverse();
    } catch (error) {
        alert('No se logró obtener datos para el grádico');
    }
}

// CREAR GRÁFICO
async function crearGrafico() {
    const datos = await cargarDatosSerie();
    const labels = datos.map((inf) => inf.fecha);
    const data = datos.map((inf) => inf.valor);
    
    const canvasGrafico = document.getElementById('myChart');
    if (grafico) {
        grafico.destroy(); // Limpia el dgrafico anterior para que ingrese el nuevo sin problemas
    }
    grafico = new Chart(canvasGrafico, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Valor moneda últimos 10 días",
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}

cargarSelect();
boton.addEventListener('click', resultado);
boton.addEventListener('click', crearGrafico);
