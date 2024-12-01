let tooltipTimer;

function galoisMultiply(a, b, irreduciblePoly) {
    let result = 0;
    while (b > 0) {
        if (b & 1) {
            result ^= a;
        }
        b >>= 1;
        a <<= 1;
        if (a >= 256) {
            a ^= irreduciblePoly;
        }
    }
    return result;
}

function galoisAdd(a, b) {
    return a ^ b;
}

function calculate() {
    const polyA = document.getElementById('polyA').value.trim();
    const polyB = document.getElementById('polyB').value.trim();
    const irreduciblePoly = document.getElementById('irreduciblePoly').value.trim();
    
    const a = parseInt(polyA, 16);
    const b = parseInt(polyB, 16);
    const irreducible = parseInt(irreduciblePoly, 16);
    
    if (isNaN(a) || isNaN(b) || isNaN(irreducible)) {
        alert("Bitte gültige Hex-Werte eingeben.");
        return;
    }
    
    const operation = document.getElementById('operation').value;
    
    let result;
    if (operation === 'multiply') {
        result = galoisMultiply(a, b, irreducible);
    } else if (operation === 'add') {
        result = galoisAdd(a, b);
    }

    const hexResult = '0x' + result.toString(16).toUpperCase();

    const polyResult = toPolynomial(result);

    document.getElementById('result').innerHTML = `
        <p>Hex: ${hexResult}</p>
        <p>Polynom: ${polyResult}</p>
    `;
}

function toPolynomial(value) {
    let terms = [];
    for (let i = 0; i < 8; i++) {
        if ((value >> i) & 1) {
            if (i === 0) {
                terms.push("1");
            } else if (i === 1) {
                terms.push("x");
            } else {
                terms.push(`x^${i}`);
            }
        }
    }
    return terms.reverse().join(" + ");
}

const irreducibleInput = document.getElementById('irreduciblePoly');
const tooltip = document.getElementById('tooltip');

irreducibleInput.addEventListener('mouseenter', () => {
    tooltipTimer = setTimeout(() => {
        tooltip.style.display = 'block';
    }, 500);
});

irreducibleInput.addEventListener('mousemove', (e) => {
    tooltip.style.left = e.pageX + 15 + 'px';
    tooltip.style.top = e.pageY + 15 + 'px';
});

irreducibleInput.addEventListener('mouseleave', () => {
    clearTimeout(tooltipTimer);
    tooltip.style.display = 'none';
});
